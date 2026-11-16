from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from app.core.auth import verify_jwt
from app.tools.nutrition_tools import get_supabase_client

router = APIRouter()

class WorkoutPlanPayload(BaseModel):
    title: str = Field(default="My Workout Plan")
    plan: dict[str, Any] | list[Any] = Field(...)
    scheduled_date: str | None = None

@router.get("")
def get_user_workouts(user_id: str = Depends(verify_jwt)):
    try:
        supabase = get_supabase_client()
        res = (
            supabase.table("workout_plans")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        return {"status": "success", "workouts": res.data or []}
    except Exception as e:
        return {"status": "error", "message": str(e), "workouts": []}

@router.post("")
def save_user_workout(
    payload: WorkoutPlanPayload,
    user_id: str = Depends(verify_jwt)
):
    try:
        supabase = get_supabase_client()
        data = {
            "user_id": user_id,
            "title": payload.title,
            "plan": payload.plan,
            "scheduled_date": payload.scheduled_date
        }
        res = supabase.table("workout_plans").insert(data).execute()
        return {"status": "success", "data": res.data[0] if res.data else data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
