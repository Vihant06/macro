from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import health, chat, profile, workout, nutrition

def create_app() -> FastAPI:
    app = FastAPI(
        title="FitPilot Backend API",
        description="Multi-agent fitness and nutrition assistant powered by LangGraph",
        version="1.0.0"
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router, tags=["Health"])
    app.include_router(chat.router, tags=["Chat"])
    app.include_router(profile.router, prefix="/profile", tags=["Profile"])
    app.include_router(workout.router, prefix="/workout", tags=["Workout"])
    app.include_router(nutrition.router, prefix="/nutrition", tags=["Nutrition"])

    return app

app = create_app()
