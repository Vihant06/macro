from datetime import date
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from app.core.auth import verify_jwt
from app.tools.nutrition_tools import get_supabase_client

router = APIRouter()

class FoodLogPayload(BaseModel):
    food_name: str
    meal: str
    servings: float = 1.0
    calories_per_serving: float
    protein_per_serving_g: float
    carbs_per_serving_g: float
    fat_per_serving_g: float
    logged_date: str = ""

@router.get("/summary")
def get_nutrition_summary(
    logged_date: str = Query(default=""),
    user_id: str = Depends(verify_jwt)
):
    try:
        if not logged_date:
            logged_date = date.today().isoformat()
        supabase = get_supabase_client()
        res = (
            supabase.table("food_logs")
            .select("food_name, meal, servings, calories, protein_g, carbs_g, fat_g, logged_date")
            .eq("user_id", user_id)
            .eq("logged_date", logged_date)
            .execute()
        )
        entries = res.data or []
        totals = {"calories": 0.0, "protein_g": 0.0, "carbs_g": 0.0, "fat_g": 0.0}
        for entry in entries:
            for nutrient in totals:
                totals[nutrient] += float(entry.get(nutrient) or 0)

        return {
            "date": logged_date,
            "number_of_entries": len(entries),
            "daily_totals": {k: round(v, 2) for k, v in totals.items()},
            "food_entries": entries
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/log")
def log_food(
    payload: FoodLogPayload,
    user_id: str = Depends(verify_jwt)
):
    try:
        supabase = get_supabase_client()
        logged_date = payload.logged_date or date.today().isoformat()
        servings = payload.servings
        data = {
            "user_id": user_id,
            "food_name": payload.food_name,
            "meal": payload.meal,
            "servings": servings,
            "calories": round(payload.calories_per_serving * servings, 2),
            "protein_g": round(payload.protein_per_serving_g * servings, 2),
            "carbs_g": round(payload.carbs_per_serving_g * servings, 2),
            "fat_g": round(payload.fat_per_serving_g * servings, 2),
            "logged_date": logged_date
        }
        res = supabase.table("food_logs").insert(data).select("id").execute()
        return {"status": "success", "data": res.data[0] if res.data else data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/meal-plans")
def get_meal_plans(
    plan_date: str = Query(default=""),
    user_id: str = Depends(verify_jwt)
):
    try:
        supabase = get_supabase_client()
        query = supabase.table("meal_plans").select("*").eq("user_id", user_id)
        if plan_date:
            query = query.eq("plan_date", plan_date)
        res = query.order("plan_date", desc=True).execute()
        return {"status": "success", "meal_plans": res.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/targets")
def get_nutrition_targets(
    target_date: str = Query(default=""),
    user_id: str = Depends(verify_jwt)
):
    try:
        supabase = get_supabase_client()
        query = supabase.table("nutrition_targets").select("*").eq("user_id", user_id)
        if target_date:
            query = query.eq("target_date", target_date)
        res = query.order("target_date", desc=True).execute()
        return {"status": "success", "targets": res.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
