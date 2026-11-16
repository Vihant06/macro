from typing import TypedDict, Annotated, Any
from pydantic import BaseModel, Field
from langgraph.graph.message import add_messages
from langchain_core.messages import AnyMessage

class FitPilotState(TypedDict, total=False):
    messages: Annotated[list[AnyMessage], add_messages]
    route: str
    profile: dict[str, Any]
    missing_fields: list[str]
    workout_result: str
    nutrition_result: str
    guardrail_blocked: bool
    guardrail_reason: str | None


class ProfileUpdate(BaseModel):
    age: int | None = None
    sex: str | None = None
    weight_kg: float | None = None
    height_cm: float | None = None
    activity_level: str | None = None
    fitness_goal: str | None = None
    experience_level: str | None = None
    training_days: int | None = None
    equipment: list[str] | None = None
    dietary_preference: str | None = None


REQUIRED_FIELDS = {
    "workout": [
        "fitness_goal",
        "experience_level",
        "training_days",
        "equipment"
    ],
    "nutrition": [
        "age",
        "sex",
        "weight_kg",
        "height_cm",
        "activity_level",
        "fitness_goal",
        "dietary_preference"
    ]
}


def get_missing_fields(profile: dict[str, Any], route: str) -> list[str]:
    if route == "both":
        required = list(dict.fromkeys(
            REQUIRED_FIELDS["workout"]
            + REQUIRED_FIELDS["nutrition"]
        ))
    else:
        required = REQUIRED_FIELDS.get(route, [])

    return [
        field for field in required
        if profile.get(field) is None
        or profile.get(field) == ""
    ]


FIELD_QUESTIONS = {
    "age": "Your age",
    "sex": "Sex used for calorie estimation",
    "weight_kg": "Your weight in kg",
    "height_cm": "Your height in cm",
    "activity_level": "Your activity level",
    "fitness_goal": "Your fitness goal",
    "experience_level": "Your training experience",
    "training_days": "Days available for training per week",
    "equipment": "Equipment you have available",
    "dietary_preference": "Your dietary preferences"
}
