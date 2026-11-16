import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_PATH = Path(__file__).resolve().parents[3] / ".env"
if not ENV_PATH.exists():
    ENV_PATH = Path(__file__).resolve().parents[2] / ".env"

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(ENV_PATH),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    nvidia_api_key: str = ""
    exa_api_key: str = ""
    tavily_api_key: str = ""
    firecrawl_api_key: str = ""
    usda_api_key: str = ""
    supabase_url: str = ""
    supabase_secret_key: str = ""
    supabase_publishable_key: str = ""
    supabase_test_email: str = ""
    supabase_test_password: str = ""
    
    # Optional / custom auth & db settings
    supabase_jwt_secret: str = ""
    database_url: str = ""
    
    model_name: str = "nvidia/nemotron-3.5-lightning-30b-a3b"
    model_temperature: float = 0.0

settings = Settings()

# Ensure environment variables are visible to standard libraries
for key, value in settings.model_dump().items():
    if value and isinstance(value, str):
        env_key = key.upper()
        if env_key not in os.environ:
            os.environ[env_key] = value
