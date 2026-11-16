from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from langchain_core.messages import HumanMessage

from app.core.auth import verify_jwt
from app.core.dependencies import get_graph_for_user

router = APIRouter()

class ChatRequest(BaseModel):
    message: str = Field(..., description="User query or message")
    thread_id: str | None = Field(default=None, description="Optional custom thread ID; defaults to user_id")

class ChatResponse(BaseModel):
    response: str
    route: str | None = None
    guardrail_blocked: bool = False
    profile: dict | None = None
    missing_fields: list[str] | None = None

@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(
    body: ChatRequest,
    user_id: str = Depends(verify_jwt)
):
    thread_id = body.thread_id or user_id
    graph = get_graph_for_user(user_id)

    result = graph.invoke(
        {"messages": [HumanMessage(content=body.message)]},
        config={"configurable": {"thread_id": thread_id}}
    )

    last_message = result.get("messages", [])[-1]
    content = getattr(last_message, "content", str(last_message))

    return ChatResponse(
        response=content,
        route=result.get("route"),
        guardrail_blocked=result.get("guardrail_blocked", False),
        profile=result.get("profile"),
        missing_fields=result.get("missing_fields")
    )

@router.post("/ai/chat")
def ai_coach_chat(
    body: ChatRequest,
    user_id: str = Depends(verify_jwt)
):
    """
    Adapter endpoint matching the frontend AICoach service interface.
    Returns { success: True, data: { text: ... } } envelope.
    """
    thread_id = body.thread_id or user_id
    graph = get_graph_for_user(user_id)

    result = graph.invoke(
        {"messages": [HumanMessage(content=body.message)]},
        config={"configurable": {"thread_id": thread_id}}
    )

    last_message = result.get("messages", [])[-1]
    content = getattr(last_message, "content", str(last_message))

    return {
        "success": True,
        "data": {
            "text": content,
            "route": result.get("route"),
            "guardrail_blocked": result.get("guardrail_blocked", False),
            "profile": result.get("profile"),
            "missing_fields": result.get("missing_fields")
        }
    }
