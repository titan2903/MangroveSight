import json
from pathlib import Path
from google import genai
from google.genai import types
from settings import settings

STATS_FILE_PATH = Path(__file__).resolve().parent.parent.parent / "data-pipeline" / "output" / "stats" / "mangrove_stats.json"

def ask_assistant(question: str) -> str:
    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not configured")
        
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    
    stats_data = {}
    if STATS_FILE_PATH.exists():
        with open(STATS_FILE_PATH, "r") as f:
            stats_data = json.load(f)
            
    stats_context = json.dumps(stats_data, indent=2)
    
    system_instruction = f"""Anda adalah AI Assistant spesialis MangroveSight.
Tugas Anda adalah menjawab pertanyaan HANYA terkait dengan data mangrove di Teluk Balikpapan antara tahun 2007 hingga 2020.
Berikut adalah data statistik (precomputed) yang menjadi satu-satunya sumber angka dan tren Anda:
{stats_context}

Aturan Ketat:
1. Jawab HANYA berdasarkan data di atas atau konteks MangroveSight (Teluk Balikpapan).
2. Jika pengguna bertanya di luar topik mangrove atau di luar Teluk Balikpapan, Anda HARUS menolak dengan sopan dan mengatakan bahwa Anda hanya bisa menjawab terkait data MangroveSight.
3. Jangan pernah melakukan perhitungan spasial, gunakan angka dari statistik yang diberikan.
"""
    
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=question,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
        ),
    )
    return response.text
