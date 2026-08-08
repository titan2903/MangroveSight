from fastapi import APIRouter
from schemas import StatsResponse
from services import stats_service

router = APIRouter()

@router.get("/", response_model=StatsResponse)
def get_stats():
    """
    Mengambil data statistik mangrove dari file JSON precomputed.
    """
    return stats_service.get_full_stats()

@router.get("/years")
def get_available_years():
    """
    Mengambil daftar tahun epoch yang tersedia (berdasarkan data precomputed).
    """
    return stats_service.get_available_years()
