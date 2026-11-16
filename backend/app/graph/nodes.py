import re
import json
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

from app.graph.state import (
    FitPilotState,
    ProfileUpdate,
    REQUIRED_FIELDS,
    get_missing_fields,
    FIELD_QUESTIONS,
)
from app.graph.guardrails import (
    detect_prompt_injection,
    classify_fitpilot_scope,
    apply_fitness_nutrition_safety_guardrail,
    apply_plan_quality_guardrail,
    apply_privacy_guardrail,
)
from app.agents.prompts import PROFILE_EXTRACTION_PROMPT


def normalize_profile_updates(updates: dict, user_message: str = "") -> dict:
    normalized = dict(updates)

    if normalized.get("activity_level") is not None:
        value = str(normalized["activity_level"]).strip().lower()
        value = re.sub(r"[_-]+", " ", value)

        activity_aliases = {
            "sedentary": "sedentary",
            "inactive": "sedentary",
            "light": "light",
            "lightly active": "light",
            "light active": "light",
            "moderate": "moderate",
            "moderately active": "moderate",
            "moderate activity": "moderate",
            "active": "active",
            "very active": "very_active",
            "highly active": "very_active"
        }
        normalized["activity_level"] = activity_aliases.get(value, value)

    if normalized.get("fitness_goal") is not None:
        value = str(normalized["fitness_goal"]).strip().lower()
        value = re.sub(r"[_-]+", " ", value)

        goal_aliases = {
            "muscle gain": "gain_muscle",
            "gain muscle": "gain_muscle",
            "build muscle": "gain_muscle",
            "muscle building": "gain_muscle",
            "bulking": "gain_muscle",
            "weight loss": "lose_weight",
            "lose weight": "lose_weight",
            "fat loss": "lose_weight",
            "lose fat": "lose_weight",
            "maintain": "maintain",
            "maintenance": "maintain",
            "maintain weight": "maintain"
        }
        normalized["fitness_goal"] = goal_aliases.get(value, value)

    for field in ["sex", "experience_level", "dietary_preference"]:
        if normalized.get(field) is not None:
            normalized[field] = str(normalized[field]).strip().lower()

    equipment = normalized.get("equipment")
    if isinstance(equipment, str):
        normalized["equipment"] = [
            item.strip().lower()
            for item in re.split(r",|\band\b", equipment)
            if item.strip()
        ]
    elif isinstance(equipment, list):
        normalized["equipment"] = [
            str(item).strip().lower()
            for item in equipment
            if str(item).strip()
        ]

    message = user_message.lower().replace("-", " ")

    if not normalized.get("fitness_goal"):
        goal_patterns = {
            "gain_muscle": [
                r"\bmuscle gain\b", r"\bgain muscle\b", r"\bbuild muscle\b",
                r"\bmuscle building\b", r"\bbulking\b"
            ],
            "lose_weight": [
                r"\bweight loss\b", r"\blose weight\b", r"\bfat loss\b", r"\blose fat\b"
            ],
            "maintain": [
                r"\bmaintain weight\b", r"\bmaintenance\b"
            ]
        }
        for goal, patterns in goal_patterns.items():
            if any(re.search(p, message) for p in patterns):
                normalized["fitness_goal"] = goal
                break

    if not normalized.get("activity_level"):
        activity_patterns = [
            ("very_active", r"\bvery active\b|\bhighly active\b"),
            ("moderate", r"\bmoderately active\b|\bmoderate activity\b"),
            ("light", r"\blightly active\b|\blight activity\b"),
            ("sedentary", r"\bsedentary\b|\binactive\b"),
            ("active", r"\bactive\b")
        ]
        for activity, pattern in activity_patterns:
            if re.search(pattern, message):
                normalized["activity_level"] = activity
                break

    return normalized


def input_guardrail(state: FitPilotState, llm=None):
    messages = state.get("messages", [])

    latest_user_index = next(
        (
            i
            for i in range(len(messages) - 1, -1, -1)
            if isinstance(messages[i], HumanMessage)
        ),
        None
    )

    if latest_user_index is None:
        return {
            "guardrail_blocked": False,
            "guardrail_reason": None
        }

    user_input = messages[latest_user_index].content

    if not isinstance(user_input, str):
        return {
            "guardrail_blocked": True,
            "guardrail_reason": "invalid_input",
            "messages": [
                AIMessage(
                    content="Please send your request as normal text."
                )
            ]
        }

    flagged, reason = detect_prompt_injection(user_input)
    if flagged:
        return {
            "guardrail_blocked": True,
            "guardrail_reason": reason,
            "messages": [
                AIMessage(
                    content=(
                        "I can help with fitness and nutrition, "
                        "but I cannot follow instructions that "
                        "attempt to override my system or safety rules. "
                        "Please send your fitness or nutrition request again."
                    )
                )
            ]
        }

    previous_assistant_message = next(
        (
            messages[i].content
            for i in range(latest_user_index - 1, -1, -1)
            if isinstance(messages[i], AIMessage)
            and isinstance(messages[i].content, str)
        ),
        None
    )

    if llm is not None:
        allowed, reason = classify_fitpilot_scope(
            user_query=user_input,
            previous_assistant_message=previous_assistant_message,
            llm=llm
        )

        if not allowed:
            return {
                "guardrail_blocked": True,
                "guardrail_reason": "out_of_scope",
                "messages": [
                    AIMessage(
                        content=(
                            "I'm FitPilot, your fitness and nutrition "
                            "assistant. I can help with workout planning, "
                            "exercise discovery, nutrition, meal planning "
                            "and fitness-related questions. "
                            "Please try a request related to these areas."
                        )
                    )
                ]
            }

    return {
        "guardrail_blocked": False,
        "guardrail_reason": None
    }


def supervisor_router(state: FitPilotState, llm):
    pending_fields = state.get("missing_fields", [])
    previous_route = state.get("route")

    if pending_fields and previous_route in {"workout", "nutrition", "both"}:
        return {"route": previous_route}

    user_query = next(
        (
            msg.content
            for msg in reversed(state.get("messages", []))
            if msg.type == "human"
        ),
        ""
    )

    prompt = f"""
    You are the supervisor of FitPilot, a multi-agent fitness assistant.

    Decide which specialist should handle the current user request.

    Available routes:

    workout:
    Exercise recommendations, workout plans, training,
    muscles, recovery and exercise science.

    nutrition:
    Food search, recipes, calories, macros, nutrition targets,
    meal plans and food logging.

    both:
    Requests that genuinely require BOTH workout and nutrition
    agents.

    general:
    Greetings and general fitness questions that don't require
    either specialist.

    Return ONLY one word:
    workout, nutrition, both, or general.

    User request:
    {user_query}
    """

    response = llm.invoke([
        SystemMessage(content="You are a precise request router."),
        HumanMessage(content=prompt)
    ])

    route = response.content.strip().lower()
    route = route.strip("`.,:;").split()[0]

    if route not in {"workout", "nutrition", "both", "general"}:
        route = "general"

    return {"route": route}


def collect_profile(state: FitPilotState, llm):
    current_profile = state.get("profile", {})

    latest_user_message = next(
        (
            msg.content
            for msg in reversed(state.get("messages", []))
            if msg.type == "human"
        ),
        ""
    )

    profile_llm = llm.with_structured_output(ProfileUpdate)
    extracted = profile_llm.invoke([
        ("system", PROFILE_EXTRACTION_PROMPT),
        ("human", latest_user_message)
    ])

    raw_updates = extracted.model_dump(exclude_none=True)
    updates = normalize_profile_updates(raw_updates, latest_user_message)
    updated_profile = {**current_profile, **updates}
    missing = get_missing_fields(updated_profile, state["route"])

    return {
        "profile": updated_profile,
        "missing_fields": missing
    }


def ask_missing_details(state: FitPilotState):
    missing_fields = state.get("missing_fields", [])

    questions = [
        f"- {FIELD_QUESTIONS[field]}"
        for field in missing_fields
        if field in FIELD_QUESTIONS
    ]

    message = (
        "Before I create your personalized plan, "
        "please share these details:\n\n"
        + "\n".join(questions)
    )

    return {
        "messages": [AIMessage(content=message)],
        "profile": state.get("profile", {}),
        "route": state.get("route", ""),
        "missing_fields": missing_fields
    }


def get_latest_user_request(messages):
    return next(
        (
            msg.content
            for msg in reversed(messages)
            if msg.type == "human"
        ),
        ""
    )


def extract_labeled_task(request: str, label: str) -> str:
    pattern = re.compile(
        rf"^\s*(?:\d+\s*[.)]\s*)?{label}\s*:\s*"
        rf"(.*?)"
        rf"(?=^\s*(?:\d+\s*[.)]\s*)?"
        rf"(?:WORKOUT|NUTRITION)\s*:|\Z)",
        re.IGNORECASE | re.MULTILINE | re.DOTALL
    )

    match = pattern.search(request)
    return match.group(1).strip() if match else request.strip()


def invoke_specialist_safely(agent, prompt: str, specialist_name: str) -> str:
    try:
        result = agent.invoke({"messages": [HumanMessage(content=prompt)]})
        content = result["messages"][-1].content
        if "Model call limits exceeded" in content or "Tool call limits exceeded" in content:
            return (
                f"I've compiled the primary recommendations for your {specialist_name.lower()} plan, "
                "but reached the execution limit while retrieving additional details. "
                "Please let me know if you would like me to expand on any specific part."
            )
        return content
    except Exception as e:
        print(f"Error invoking {specialist_name}: {e}")
        return f"Unable to generate response from {specialist_name} at this time."


def run_workout_agent(state: FitPilotState, workout_agent):
    profile = state.get("profile", {})
    request = get_latest_user_request(state["messages"])
    workout_task = extract_labeled_task(request, "WORKOUT")

    prompt = f"""
You are handling ONLY the workout component of the user's request.

Workout task:
{workout_task}

Verified user profile:
{json.dumps(profile)}

Instructions:
- Use ExerciseDB when exercise information is requested.
- Use the verified user profile.
- Do not repeat questions already answered in the profile.
- Return only workout-related information.
- Never recommend training through pain or injury.
- Prioritize safe technique, realistic progression, and recovery.
"""

    answer = invoke_specialist_safely(workout_agent, prompt, "Workout Agent")
    answer = apply_fitness_nutrition_safety_guardrail(answer, "workout")
    answer = apply_plan_quality_guardrail(answer, profile, "workout")
    answer = apply_privacy_guardrail(answer)

    return {"workout_result": answer}


def run_nutrition_agent(state: FitPilotState, nutrition_agent):
    profile = state.get("profile", {})
    request = get_latest_user_request(state["messages"])
    nutrition_task = extract_labeled_task(request, "NUTRITION")

    prompt = f"""
You are handling ONLY the nutrition component of the user's request.

Nutrition task:
{nutrition_task}

Verified user profile:
{json.dumps(profile)}

Instructions:
- Use available nutrition tools.
- Inspect data quality warnings.
- Never invent or silently correct nutritional values.
- Return only nutrition-related information.
- Avoid extreme calorie restriction and unrealistic weight-loss targets.
- Do not present medical nutrition advice as a substitute for professional care.
"""

    answer = invoke_specialist_safely(nutrition_agent, prompt, "Nutrition Agent")
    answer = apply_fitness_nutrition_safety_guardrail(answer, "nutrition")
    answer = apply_plan_quality_guardrail(answer, profile, "nutrition")
    answer = apply_privacy_guardrail(answer)

    return {"nutrition_result": answer}


def general_response(state: FitPilotState, llm):
    user_query = state["messages"][-1].content

    response = llm.invoke([
        SystemMessage(
            content="You are FitPilot, a helpful fitness assistant. "
                    "Answer general fitness questions clearly."
        ),
        HumanMessage(content=user_query)
    ])

    return {
        "messages": [AIMessage(content=response.content)]
    }


def final_response(state: FitPilotState, llm):
    route = state["route"]

    if route == "workout":
        answer = state.get("workout_result", "")
    elif route == "nutrition":
        answer = state.get("nutrition_result", "")
    elif route == "both":
        prompt = f"""
        You are FitPilot's final response coordinator.

        Combine the following specialist agent results into
        one coherent, personalized response.

        Workout Agent result:
        {state.get("workout_result", "")}

        Nutrition Agent result:
        {state.get("nutrition_result", "")}

        Avoid repeating information.
        Resolve overlaps and clearly explain recommendations.
        Do not invent facts that neither agent provided.
        """

        response = llm.invoke([
            SystemMessage(content="You coordinate specialist results."),
            HumanMessage(content=prompt)
        ])
        answer = response.content
    else:
        answer = "I couldn't determine which specialist to use."

    answer = apply_privacy_guardrail(answer)

    return {
        "messages": [AIMessage(content=answer)]
    }
