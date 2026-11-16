import requests
from langchain.tools import tool

@tool
def search_exercises(
    name: str = "",
    body_parts: str = "",
    equipments: str = "",
    limit: int = 5
):
    """Search exercises by name, body parts, and equipment."""
    url = "https://oss.exercisedb.dev/api/v1/exercises"

    params = {
        "name": name,
        "bodyParts": body_parts,
        "equipments": equipments,
        "limit": limit
    }

    params = {k: v for k, v in params.items() if v not in ("", None)}

    response = requests.get(
        url,
        params=params,
        timeout=15
    )
    response.raise_for_status()
    return response.json()


@tool
def search_by_muscle(
    target_muscle_name: str = "",
    secondary_muscle_name: str = "",
    limit: int = 5
):
    """Search exercises by target or secondary muscle name."""
    url = "https://oss.exercisedb.dev/api/v1/exercises/muscles"

    params = {
        "target_muscle_name": target_muscle_name,
        "secondary_muscle_name": secondary_muscle_name,
        "limit": limit
    }

    params = {k: v for k, v in params.items() if v not in ("", None)}

    response = requests.get(url, params=params, timeout=15)
    response.raise_for_status()
    return response.json()


@tool
def search_by_bodyParts(
    body_part: str = "",
    limit: int = 5
):
    """Search exercises by body part."""
    url = "https://oss.exercisedb.dev/api/v1/exercises/bodyparts"

    params = {
        "body_part": body_part,
        "limit": limit
    }

    params = {k: v for k, v in params.items() if v not in ("", None)}

    response = requests.get(url, params=params, timeout=15)
    response.raise_for_status()
    return response.json()


@tool
def search_by_equipments(
    equipments_name: str = "",
    limit: int = 5
):
    """Search exercises by equipment."""
    url = "https://oss.exercisedb.dev/api/v1/exercises/bodyparts"

    params = {
        "equipments_name": equipments_name,
        "limit": limit
    }

    params = {k: v for k, v in params.items() if v not in ("", None)}

    response = requests.get(url, params=params, timeout=15)
    response.raise_for_status()
    return response.json()
