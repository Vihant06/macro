from typing import Any

def calculate_nutrition_data(
    ingredients: list[dict[str, Any]],
    servings: int
) -> dict:
    if servings <= 0:
        raise ValueError("Servings must be greater than zero.")

    totals = {
        "calories": 0.0,
        "protein_g": 0.0,
        "carbs_g": 0.0,
        "fat_g": 0.0
    }

    required_fields = [
        "name",
        "quantity_g",
        "calories_per_100g",
        "protein_g_per_100g",
        "carbs_g_per_100g",
        "fat_g_per_100g"
    ]

    for ingredient in ingredients:
        missing = [
            field for field in required_fields
            if field not in ingredient
        ]

        if missing:
            raise ValueError(
                f"Missing fields for ingredient: {missing}"
            )

        quantity = float(ingredient["quantity_g"])

        if quantity < 0:
            raise ValueError("Ingredient quantity cannot be negative.")

        for nutrient in totals:
            source_value = float(
                ingredient[f"{nutrient if nutrient == 'calories' else nutrient}_per_100g"]
            )
            if source_value < 0:
                raise ValueError("Nutrient values cannot be negative.")

            totals[nutrient] += quantity / 100 * source_value

    per_serving = {
        key: round(value / servings, 2)
        for key, value in totals.items()
    }

    macro_calories = (
        totals["protein_g"] * 4
        + totals["carbs_g"] * 4
        + totals["fat_g"] * 9
    )

    discrepancy = (
        abs(totals["calories"] - macro_calories)
        / totals["calories"] * 100
        if totals["calories"] > 0 else 0
    )

    return {
        "total_recipe_nutrition": {
            key: round(value, 2)
            for key, value in totals.items()
        },
        "per_serving": per_serving,
        "macro_calories_estimate": round(
            macro_calories / servings, 2
        ),
        "calorie_discrepancy_percent": round(discrepancy, 2),
        "nutrition_warning": (
            "Calories and macros differ by more than 10%. "
            "Verify ingredient data and measurement basis."
            if discrepancy > 10 else None
        )
    }
