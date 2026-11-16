from functools import lru_cache
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from app.core.config import settings
from app.agents.factories import build_workout_agent, build_nutrition_agent
from app.graph.workflow import build_graph

def get_llm():
    return ChatNVIDIA(
        model=settings.model_name,
        temperature=settings.model_temperature,
    )

@lru_cache(maxsize=128)
def get_graph_for_user(user_id: str):
    llm = get_llm()
    workout_agent = build_workout_agent(llm)
    nutrition_agent = build_nutrition_agent(llm, user_id=user_id)
    return build_graph(llm, workout_agent, nutrition_agent)
