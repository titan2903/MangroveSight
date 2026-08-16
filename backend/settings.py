from typing import List

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://mangrovesight.netlify.app",
        "https://mangrovesight.vercel.app",
    ]
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_MODEL: str = "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free"

    class Config:
        env_file = ".env"


settings = Settings()
