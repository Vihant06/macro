from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

from app.core.config import settings
from app.graph.state import FitPilotState
from app.graph.nodes import (
    input_guardrail,
    supervisor_router,
    collect_profile,
    ask_missing_details,
    run_workout_agent,
    run_nutrition_agent,
    general_response,
    final_response,
)

def _get_checkpointer():
    if settings.database_url:
        try:
            from langgraph_checkpoint_postgres import PostgresSaver
            # Setup tables if needed
            saver = PostgresSaver.from_conn_string(settings.database_url)
            saver.setup()
            return saver
        except Exception as e:
            print(f"[Workflow] PostgresSaver connection error: {e}. Falling back to MemorySaver.")
    return MemorySaver()

def build_graph(llm, workout_agent, nutrition_agent, checkpointer=None):
    builder = StateGraph(FitPilotState)

    builder.add_node("input_guardrail", lambda s: input_guardrail(s, llm=llm))
    builder.add_node("supervisor", lambda s: supervisor_router(s, llm=llm))
    builder.add_node("collect_profile", lambda s: collect_profile(s, llm=llm))
    builder.add_node("ask_missing", ask_missing_details)
    builder.add_node("workout", lambda s: run_workout_agent(s, workout_agent=workout_agent))
    builder.add_node("nutrition", lambda s: run_nutrition_agent(s, nutrition_agent=nutrition_agent))
    builder.add_node("general", lambda s: general_response(s, llm=llm))
    builder.add_node("final", lambda s: final_response(s, llm=llm))

    builder.add_edge(START, "input_guardrail")

    builder.add_conditional_edges(
        "input_guardrail",
        lambda state: "blocked" if state.get("guardrail_blocked", False) else "continue",
        {
            "blocked": END,
            "continue": "supervisor"
        }
    )

    builder.add_conditional_edges(
        "supervisor",
        lambda state: "general" if state.get("route") == "general" else "collect_profile",
        {
            "general": "general",
            "collect_profile": "collect_profile"
        }
    )

    builder.add_conditional_edges(
        "collect_profile",
        lambda state: "ask_missing" if state.get("missing_fields") else state.get("route"),
        {
            "ask_missing": "ask_missing",
            "workout": "workout",
            "nutrition": "nutrition",
            "both": "workout"
        }
    )

    builder.add_conditional_edges(
        "workout",
        lambda state: "nutrition" if state.get("route") == "both" else "final",
        {
            "nutrition": "nutrition",
            "final": "final"
        }
    )

    builder.add_edge("nutrition", "final")
    builder.add_edge("final", END)
    builder.add_edge("general", END)
    builder.add_edge("ask_missing", END)

    cp = checkpointer or _get_checkpointer()
    return builder.compile(checkpointer=cp)
