from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas import StatsResponse
from services import stats_service
from db import get_db

router = APIRouter()

@router.get("/", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    """
    Mengambil data statistik mangrove (dihitung on-the-fly dari database).
    """
    return stats_service.get_full_stats(db)

@router.get("/years")
def get_available_years(db: Session = Depends(get_db)):
    """
    Mengambil daftar tahun epoch yang tersedia (dihitung dari database).
    """
    return stats_service.get_available_years(db)
