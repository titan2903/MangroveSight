from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import ai, mangrove, stats
from settings import settings

tags_metadata = [
    {
        "name": "Mangrove",
        "description": "Endpoint untuk mengambil data spasial GeoJSON hutan mangrove (2007-2022).",
    },
    {
        "name": "Statistics",
        "description": "Endpoint untuk mengambil ringkasan statistik (luas area dan delta perubahan) yang sudah di-precompute.",
    },
    {
        "name": "AI",
        "description": "Endpoint integrasi OpenRouter AI untuk AI Assistant khusus MangroveSight.",
    },
    {
        "name": "Health",
        "description": "Endpoint untuk mengecek status kesehatan API.",
    },
]

app = FastAPI(
    title="MangroveSight API",
    description="""
**Backend API untuk MangroveSight WebGIS.**
API ini menyediakan data spasial dan statistik terkait perubahan hutan mangrove di Teluk Balikpapan (2007-2022),
serta asisten AI yang dapat menjawab pertanyaan seputar data tersebut.
""",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=tags_metadata,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(mangrove.router, prefix="/api/mangrove", tags=["Mangrove"])
app.include_router(stats.router, prefix="/api/stats", tags=["Statistics"])
app.include_router(ai.router, prefix="/api/ask", tags=["AI"])


@app.get("/", tags=["Health"])
def health_check():
    """
    Endpoint untuk mengecek status kesehatan API (Health Check).
    """
    return {
        "status": "ok",
        "message": "MangroveSight API is healthy and running smoothly.",
    }
