from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from settings import settings
from routers import mangrove, stats, ai

app = FastAPI(
    title="MangroveSight API",
    description="Backend API for MangroveSight (Teluk Balikpapan)",
    version="1.0.0"
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

@app.get("/")
def root():
    return {"message": "Welcome to MangroveSight API"}
