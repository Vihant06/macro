from langchain.agents import create_agent
from langchain.agents.middleware import (
    ToolCallLimitMiddleware,
    ModelCallLimitMiddleware
)

from app.tools.exercise_tools import (
    search_exercises,
    search_by_muscle,
    search_by_bodyParts,
    search_by_equipments,
)
from app.tools.research_tools import research_fitness_science
from app.tools.recipe_tools import (
    firecrawl_search_recipes,
    firecrawl_scrape,
)
from app.tools.nutrition_tools import (
    search_food,
    get_food_details,
    build_nutrition_tools,
)
from app.agents.prompts import (
    workout_system_prompt,
    nutrition_system_prompt,
)

workout_middleware = [
    ToolCallLimitMiddleware(
        run_limit=8,
        exit_behavior="end"
    ),
    ModelCallLimitMiddleware(
        run_limit=6,
        exit_behavior="end"
    )
]

nutrition_middleware = [
    ToolCallLimitMiddleware(
        run_limit=12,
        exit_behavior="end"
    ),
    ModelCallLimitMiddleware(
        run_limit=8,
        exit_behavior="end"
    )
]

workout_toolset = [
    search_exercises,
    search_by_muscle,
    search_by_bodyParts,
    search_by_equipments,
    research_fitness_science,
]

def build_workout_agent(llm):
    return create_agent(
        model=llm,
        tools=workout_toolset,
        system_prompt=workout_system_prompt,
        middleware=workout_middleware
    )

def build_nutrition_agent(llm, user_id: str):
    nutrition_tools = build_nutrition_tools(user_id)
    nutrition_toolset = [
        search_food,
        get_food_details,
        firecrawl_search_recipes,
        firecrawl_scrape,
        *nutrition_tools
    ]
    return create_agent(
        model=llm,
        tools=nutrition_toolset,
        system_prompt=nutrition_system_prompt,
        middleware=nutrition_middleware
    )
