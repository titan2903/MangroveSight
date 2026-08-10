import asyncio
from services.ai_service import ask_assistant

try:
    print(ask_assistant("Berapa luas mangrove tahun 2020?"))
except Exception as e:
    print(f"Error: {e}")
