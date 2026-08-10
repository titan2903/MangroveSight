from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000", "https://mangrovesight.netlify.app", "https://mangrovesight.vercel.app"]
    OPENROUTER_API_KEY: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
