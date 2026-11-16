from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from app.core.auth import verify_jwt
from app.tools.nutrition_tools import get_supabase_client

router = APIRouter()

class ProfilePayload(BaseModel):
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

@router.get("")
def get_user_profile(user_id: str = Depends(verify_jwt)):
    try:
        supabase = get_supabase_client()
        res = (
            supabase.table("profiles")
            .select("*")
            .eq("id", user_id)
            .execute()
        )
        if res.data:
            return {"status": "success", "profile": res.data[0]}
        return {"status": "not_found", "profile": {}}
    except Exception as e:
        return {"status": "error", "message": str(e), "profile": {}}

@router.post("")
def update_user_profile(
    payload: ProfilePayload,
    user_id: str = Depends(verify_jwt)
):
    try:
        supabase = get_supabase_client()
        data = payload.model_dump(exclude_none=True)
        data["id"] = user_id
        res = (
            supabase.table("profiles")
            .upsert(data)
            .execute()
        )
        return {"status": "success", "profile": res.data[0] if res.data else data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
