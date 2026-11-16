import os
from datetime import date
from typing import Any
import requests
from supabase import create_client
from langchain.tools import tool
from app.core.config import settings
from app.tools.nutrition_math import calculate_nutrition_data

BASE_URL = "https://api.nal.usda.gov/fdc/v1"

@tool
def search_food(query: str) -> dict:
    """Search for food items by name and return matching food names and FDC IDs."""
    response = requests.get(
        f"{BASE_URL}/foods/search",
        params={
            "query": query,
            "pageSize": 5
        },
        headers={"X-Api-Key": settings.usda_api_key},
        timeout=15
    )
    response.raise_for_status()
    data = response.json()

    return [
        {
            "fdcId": food["fdcId"],
            "description": food["description"],
            "dataType": food.get("dataType"),
            "brandOwner": food.get("brandOwner")
        }
        for food in data.get("foods", [])
    ]


@tool
def get_food_details(fdcId: int) -> dict:
    """Retrieve nutritional information and validate basic nutrient consistency."""
    response = requests.get(
        f"{BASE_URL}/food/{fdcId}",
        headers={"X-Api-Key": settings.usda_api_key},
        timeout=15
    )
    response.raise_for_status()
    data = response.json()

    nutrients = {}

    for item in data.get("foodNutrients", []):
        nutrient = item.get("nutrient", {})
        name = nutrient.get("name")
        if name:
            nutrients[name] = {
                "amount": item.get("amount"),
                "unit": nutrient.get("unitName")
            }

    data_type = data.get("dataType")
    if data_type == "Survey (FNDDS)":
        nutrient_basis = "per 100 g edible portion"
    else:
        nutrient_basis = None

    warnings = []
    carbs = nutrients.get("Carbohydrate, by difference", {})
    sugars = nutrients.get("Total Sugars", {})

    carb_amount = carbs.get("amount")
    sugar_amount = sugars.get("amount")

    if (
        isinstance(carb_amount, (int, float))
        and isinstance(sugar_amount, (int, float))
        and carbs.get("unit") == sugars.get("unit") == "g"
        and sugar_amount > carb_amount + 0.1
    ):
        warnings.append(
            "Data inconsistency: total sugars exceed total carbohydrates. "
            "Do not treat these values as simultaneously reliable. "
            "Verify the source record before using them."
        )

    return {
        "fdcId": data.get("fdcId"),
        "description": data.get("description"),
        "dataType": data_type,
        "nutrientBasis": nutrient_basis,
        "servingSize": data.get("servingSize"),
        "servingSizeUnit": data.get("servingSizeUnit"),
        "nutrients": nutrients,
        "dataQualityWarnings": warnings
    }


def get_supabase_client():
    url = settings.supabase_url
    key = settings.supabase_secret_key
    if not url or not key:
        raise ValueError(
            "SUPABASE_URL and SUPABASE_SECRET_KEY must be configured."
        )
    return create_client(url, key)


def build_nutrition_tools(authenticated_user_id: str):
    if not authenticated_user_id:
        raise ValueError("An authenticated user ID is required.")

    supabase = get_supabase_client()
    user_id = authenticated_user_id

    @tool
    def calculate_recipe_nutrition(
        ingredients: list[dict[str, Any]],
        servings: int
    ) -> dict:
        """
        Calculate calories, protein, carbs and fat from recipe
        ingredients. Nutrient inputs must be normalized per 100g.
        Ingredient quantities must be in grams.
        """
        return calculate_nutrition_data(ingredients, servings)

    @tool
    def scale_recipe(
        ingredients: list[dict[str, Any]],
        original_servings: int,
        target_servings: int
    ) -> dict:
        """
        Scale recipe ingredient quantities to the requested
        number of servings. All quantities must be in grams.
        """
        if original_servings <= 0 or target_servings <= 0:
            raise ValueError("Serving counts must be positive.")

        factor = target_servings / original_servings
        scaled = []
        for ingredient in ingredients:
            item = ingredient.copy()
            item["quantity_g"] = round(
                float(item["quantity_g"]) * factor, 2
            )
            scaled.append(item)

        return {
            "original_servings": original_servings,
            "target_servings": target_servings,
            "scaled_ingredients": scaled
        }

    @tool
    def optimize_recipe_macros(
        ingredients: list[dict[str, Any]],
        servings: int,
        min_protein_g: float,
        max_calories_per_serving: float,
        protein_source: str,
        protein_source_max_g: float,
        reducible_ingredient: str = "",
        reducible_min_g: float = 0,
        step_g: float = 5
    ) -> dict:
        """
        Increase a selected protein ingredient and optionally
        reduce another ingredient to meet protein and calorie
        targets. Uses a step-based search, not a global optimizer.
        """
        if servings <= 0 or step_g <= 0:
            raise ValueError("Servings and step size must be positive.")

        items = [ingredient.copy() for ingredient in ingredients]

        protein_index = next(
            (
                i for i, item in enumerate(items)
                if item["name"].lower() == protein_source.lower()
            ),
            None
        )

        if protein_index is None:
            raise ValueError("Protein source not found.")

        current_protein = float(items[protein_index]["quantity_g"])

        if protein_source_max_g < current_protein:
            raise ValueError(
                "Maximum protein quantity is below its current quantity."
            )

        protein_steps = int(
            (protein_source_max_g - current_protein) / step_g
        )

        if protein_steps > 500:
            raise ValueError("Too many optimization steps.")

        protein_values = [
            round(current_protein + i * step_g, 2)
            for i in range(protein_steps + 1)
        ]

        if protein_values[-1] < protein_source_max_g:
            protein_values.append(float(protein_source_max_g))

        reduce_index = None
        reduce_values = [0.0]
        current_reduce = 0.0

        if reducible_ingredient:
            reduce_index = next(
                (
                    i for i, item in enumerate(items)
                    if item["name"].lower() == reducible_ingredient.lower()
                ),
                None
            )

            if reduce_index is None:
                raise ValueError("Reducible ingredient not found.")

            if reduce_index == protein_index:
                raise ValueError(
                    "Protein source and reducible ingredient must be different."
                )

            current_reduce = float(items[reduce_index]["quantity_g"])

            if not 0 <= reducible_min_g <= current_reduce:
                raise ValueError("Invalid minimum ingredient quantity.")

            reduce_steps = int(
                (current_reduce - reducible_min_g) / step_g
            )

            if reduce_steps > 500:
                raise ValueError("Too many optimization steps.")

            reduce_values = [
                round(current_reduce - i * step_g, 2)
                for i in range(reduce_steps + 1)
            ]

            if reduce_values[-1] > reducible_min_g:
                reduce_values.append(float(reducible_min_g))

        candidates = []

        for protein_qty in protein_values:
            for reduce_qty in reduce_values:
                candidate = [item.copy() for item in items]
                candidate[protein_index]["quantity_g"] = protein_qty

                if reduce_index is not None:
                    candidate[reduce_index]["quantity_g"] = reduce_qty

                nutrition = calculate_nutrition_data(candidate, servings)
                per_serving = nutrition["per_serving"]

                feasible = (
                    per_serving["protein_g"] >= min_protein_g
                    and per_serving["calories"] <= max_calories_per_serving
                )

                change_score = abs(
                    protein_qty - current_protein
                ) / max(current_protein, 1)

                if reduce_index is not None:
                    change_score += abs(
                        reduce_qty - current_reduce
                    ) / max(current_reduce, 1)

                candidates.append({
                    "ingredients": candidate,
                    "nutrition": nutrition,
                    "feasible": feasible,
                    "change_score": change_score
                })

        feasible_candidates = [
            item for item in candidates if item["feasible"]
        ]

        if feasible_candidates:
            best = min(
                feasible_candidates,
                key=lambda item: item["change_score"]
            )
        else:
            best = min(
                candidates,
                key=lambda item: (
                    max(
                        0,
                        min_protein_g
                        - item["nutrition"]["per_serving"]["protein_g"]
                    )
                    + max(
                        0,
                        item["nutrition"]["per_serving"]["calories"]
                        - max_calories_per_serving
                    ),
                    item["change_score"]
                )
            )

        return {
            "feasible": best["feasible"],
            "optimized_ingredients": best["ingredients"],
            "nutrition": best["nutrition"],
            "message": (
                "Targets achieved."
                if best["feasible"]
                else "Targets could not both be achieved with the tested ingredient adjustments."
            )
        }

    @tool
    def calculate_daily_targets(
        age: int,
        sex: str,
        weight_kg: float,
        height_cm: float,
        activity_level: str,
        goal: str,
        target_date: str = ""
    ) -> dict:
        """
        Estimate daily calorie and macro targets using the
        Mifflin-St Jeor equation, then save them to Supabase.

        Intended for adults. Sex must be male or female for
        the equation's coefficients.
        """
        if age < 18:
            raise ValueError("This calculator is intended for adults.")

        if weight_kg <= 0 or height_cm <= 0:
            raise ValueError("Weight and height must be positive.")

        sex = str(sex).strip().lower()

        activity_text = (
            str(activity_level)
            .strip()
            .lower()
            .replace("-", "_")
            .replace(" ", "_")
        )

        activity_aliases = {
            "sedentary": "sedentary",
            "inactive": "sedentary",
            "light": "light",
            "lightly_active": "light",
            "mildly_active": "light",
            "moderate": "moderate",
            "moderately_active": "moderate",
            "moderate_activity": "moderate",
            "active": "active",
            "very_active": "very_active",
            "highly_active": "very_active",
            "extra_active": "very_active",
            "extremely_active": "very_active",
        }

        activity_level = activity_aliases.get(
            activity_text,
            activity_text
        )

        goal_text = (
            str(goal)
            .strip()
            .lower()
            .replace("-", "_")
            .replace(" ", "_")
        )

        goal_aliases = {
            "gain_muscle": "gain_muscle",
            "muscle_gain": "gain_muscle",
            "muscle_building": "gain_muscle",
            "build_muscle": "gain_muscle",
            "bulking": "gain_muscle",
            "lose_weight": "lose_weight",
            "weight_loss": "lose_weight",
            "fat_loss": "lose_weight",
            "cutting": "lose_weight",
            "maintain": "maintain",
            "maintenance": "maintain",
            "maintain_weight": "maintain",
        }

        goal = goal_aliases.get(goal_text, goal_text)

        if sex not in ["male", "female"]:
            raise ValueError("Sex must be male or female.")

        activity_factors = {
            "sedentary": 1.2,
            "light": 1.375,
            "moderate": 1.55,
            "active": 1.725,
            "very_active": 1.9
        }

        if activity_level not in activity_factors:
            raise ValueError("Invalid activity level.")

        if sex == "male":
            bmr = (
                10 * weight_kg
                + 6.25 * height_cm
                - 5 * age
                + 5
            )
        else:
            bmr = (
                10 * weight_kg
                + 6.25 * height_cm
                - 5 * age
                - 161
            )

        maintenance = bmr * activity_factors[activity_level]

        goal_adjustments = {
            "lose_weight": 0.85,
            "maintain": 1.0,
            "gain_muscle": 1.08
        }

        if goal not in goal_adjustments:
            raise ValueError(
                f"Invalid goal received: {goal!r}. Accepted values: {list(goal_adjustments.keys())}"
            )

        calories = maintenance * goal_adjustments[goal]
        protein = weight_kg * 1.6
        fat = weight_kg * 0.8
        carbs = (calories - protein * 4 - fat * 9) / 4

        if carbs < 0:
            raise ValueError(
                "The estimated calorie target is incompatible with these starting macro estimates."
            )

        if not target_date:
            target_date = date.today().isoformat()

        date.fromisoformat(target_date)

        targets = {
            "calories": round(calories),
            "protein_g": round(protein, 2),
            "carbs_g": round(carbs, 2),
            "fat_g": round(fat, 2)
        }

        supabase.table("nutrition_targets").upsert(
            {
                "user_id": user_id,
                "target_date": target_date,
                **targets,
                "bmr_calories": round(bmr),
                "maintenance_calories": round(maintenance),
                "goal": goal
            },
            on_conflict="user_id,target_date"
        ).execute()

        return {
            "date": target_date,
            "bmr_calories": round(bmr),
            "maintenance_calories": round(maintenance),
            "daily_targets": targets,
            "saved_to_supabase": True,
            "note": "Estimates for general guidance, not medical prescriptions."
        }

    @tool
    def track_food_intake(
        food_name: str,
        meal: str,
        servings: float,
        calories_per_serving: float,
        protein_per_serving_g: float,
        carbs_per_serving_g: float,
        fat_per_serving_g: float,
        logged_date: str = ""
    ) -> dict:
        """
        Save consumed food and its per-serving nutrition
        to the authenticated user's Supabase food_logs table.
        """
        if servings <= 0:
            raise ValueError("Servings must be greater than zero.")

        if not food_name.strip():
            raise ValueError("Food name is required.")

        if not logged_date:
            logged_date = date.today().isoformat()

        date.fromisoformat(logged_date)

        values = [
            calories_per_serving,
            protein_per_serving_g,
            carbs_per_serving_g,
            fat_per_serving_g
        ]

        if any(value < 0 for value in values):
            raise ValueError("Nutrition values cannot be negative.")

        payload = {
            "user_id": user_id,
            "food_name": food_name,
            "meal": meal,
            "servings": servings,
            "calories": round(calories_per_serving * servings, 2),
            "protein_g": round(protein_per_serving_g * servings, 2),
            "carbs_g": round(carbs_per_serving_g * servings, 2),
            "fat_g": round(fat_per_serving_g * servings, 2),
            "logged_date": logged_date
        }

        response = (
            supabase.table("food_logs")
            .insert(payload)
            .select("id")
            .execute()
        )

        return {
            "status": "success",
            "entry_id": response.data[0]["id"] if response.data else None,
            "food_name": food_name,
            "meal": meal,
            "date": logged_date,
            "nutrition_logged": {
                key: payload[key]
                for key in ["calories", "protein_g", "carbs_g", "fat_g"]
            }
        }

    @tool
    def get_daily_nutrition_summary(
        logged_date: str = ""
    ) -> dict:
        """
        Retrieve the authenticated user's food logs for a
        particular date and calculate daily nutrition totals.
        """
        if not logged_date:
            logged_date = date.today().isoformat()

        date.fromisoformat(logged_date)

        response = (
            supabase.table("food_logs")
            .select(
                "food_name, meal, servings, calories, "
                "protein_g, carbs_g, fat_g, logged_date"
            )
            .eq("user_id", user_id)
            .eq("logged_date", logged_date)
            .order("created_at")
            .execute()
        )

        entries = response.data or []

        totals = {
            "calories": 0.0,
            "protein_g": 0.0,
            "carbs_g": 0.0,
            "fat_g": 0.0
        }

        for entry in entries:
            for nutrient in totals:
                totals[nutrient] += float(entry[nutrient] or 0)

        return {
            "date": logged_date,
            "number_of_entries": len(entries),
            "daily_totals": {
                key: round(value, 2)
                for key, value in totals.items()
            },
            "food_entries": entries
        }

    @tool
    def generate_meal_plan(
        candidate_meals: list[dict[str, Any]],
        daily_targets: dict[str, Any],
        meals_per_day: int = 4,
        plan_date: str = ""
    ) -> dict:
        """
        Select meals from nutritionally evaluated candidate meals
        to form a daily plan, then save it to Supabase.
        """
        if not candidate_meals:
            raise ValueError("No candidate meals provided.")

        if meals_per_day not in [3, 4, 5, 6]:
            raise ValueError("Meals per day must be between 3 and 6.")

        required = ["calories", "protein_g", "carbs_g", "fat_g"]

        for key in required:
            if key not in daily_targets:
                raise ValueError(f"Missing daily target: {key}")

        if not plan_date:
            plan_date = date.today().isoformat()

        date.fromisoformat(plan_date)

        slots_by_count = {
            3: ["breakfast", "lunch", "dinner"],
            4: ["breakfast", "lunch", "dinner", "snack"],
            5: ["breakfast", "lunch", "dinner", "snack", "snack"],
            6: ["breakfast", "lunch", "dinner", "snack", "snack", "snack"]
        }

        distributions = {
            3: [0.30, 0.35, 0.35],
            4: [0.25, 0.35, 0.30, 0.10],
            5: [0.25, 0.30, 0.25, 0.10, 0.10],
            6: [0.25, 0.25, 0.25, 0.08, 0.08, 0.09]
        }

        slots = slots_by_count[meals_per_day]
        distribution = distributions[meals_per_day]

        selected = []
        used_names = set()

        for index, slot in enumerate(slots):
            fraction = distribution[index]
            desired = {
                key: float(daily_targets[key]) * fraction
                for key in required
            }

            matching = [
                meal for meal in candidate_meals
                if meal["name"].lower() not in used_names
                and meal.get("meal_type", "").lower() == slot
            ]

            if not matching:
                matching = [
                    meal for meal in candidate_meals
                    if meal["name"].lower() not in used_names
                ]

            if not matching:
                break

            def score(meal):
                total = 0
                for key in required:
                    actual = float(meal[key])
                    expected = desired[key]
                    total += abs(actual - expected) / max(expected, 1)
                return total

            chosen = min(matching, key=score)
            selected.append({
                "meal_type": slot,
                "meal": chosen
            })
            used_names.add(chosen["name"].lower())

        totals = {key: 0.0 for key in required}
        for selection in selected:
            meal = selection["meal"]
            for key in required:
                totals[key] += float(meal[key])

        totals = {
            key: round(value, 2)
            for key, value in totals.items()
        }

        remaining = {
            key: round(float(daily_targets[key]) - totals[key], 2)
            for key in required
        }

        plan_payload = {
            "user_id": user_id,
            "plan_date": plan_date,
            "meals": selected,
            "planned_nutrition": totals,
            "daily_targets": daily_targets
        }

        response = (
            supabase.table("meal_plans")
            .upsert(
                plan_payload,
                on_conflict="user_id,plan_date"
            )
            .select("id")
            .execute()
        )

        return {
            "plan_id": response.data[0]["id"] if response.data else None,
            "plan_date": plan_date,
            "meal_plan": selected,
            "planned_nutrition": totals,
            "daily_targets": daily_targets,
            "remaining_targets": remaining,
            "saved_to_supabase": True
        }

    return [
        calculate_recipe_nutrition,
        scale_recipe,
        optimize_recipe_macros,
        calculate_daily_targets,
        track_food_intake,
        get_daily_nutrition_summary,
        generate_meal_plan
    ]
