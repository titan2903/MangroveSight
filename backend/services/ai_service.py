import json
from pathlib import Path

from openai import OpenAI

from settings import settings

STATS_FILE_PATH = (
    Path(__file__).resolve().parent.parent.parent
    / "data-pipeline"
    / "output"
    / "stats"
    / "mangrove_stats.json"
)
if not STATS_FILE_PATH.exists():
    STATS_FILE_PATH = (
        Path(__file__).resolve().parent.parent / "data" / "mangrove_stats.json"
    )


def ask_assistant(question: str) -> str:
    if not settings.OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER_API_KEY is not configured")

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=settings.OPENROUTER_API_KEY,
    )

    stats_data = {}
    if STATS_FILE_PATH.exists():
        with open(STATS_FILE_PATH, "r") as f:
            stats_data = json.load(f)

    stats_context = json.dumps(stats_data, indent=2)

    system_instruction = f"""Anda adalah AI Assistant spesialis MangroveSight.
Tugas Anda adalah menjawab pertanyaan HANYA terkait dengan data mangrove di Teluk Balikpapan antara tahun 2007 hingga 2022.
Berikut adalah data statistik (precomputed) yang menjadi satu-satunya sumber angka dan tren Anda:
{stats_context}

Aturan Ketat:
1. Jawab HANYA berdasarkan data di atas atau konteks MangroveSight (Teluk Balikpapan).
2. Jika pengguna bertanya di luar topik mangrove atau di luar Teluk Balikpapan, Anda HARUS menolak dengan sopan dan mengatakan bahwa Anda hanya bisa menjawab terkait data MangroveSight.
3. Jangan pernah melakukan perhitungan spasial, gunakan angka dari statistik yang diberikan.
"""

    response = client.chat.completions.create(
        model="nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
        messages=[
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": question},
        ],
        extra_headers={
            "HTTP-Referer": "https://mangrovesight.netlify.app",  # Optional, for including your app on openrouter.ai rankings.
            "X-Title": "MangroveSight",  # Optional. Shows in rankings on openrouter.ai.
        },
    )
    return response.choices[0].message.content
