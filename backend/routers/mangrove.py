from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from db import get_db
from services import mangrove_service

router = APIRouter()

@router.get("/")
def get_mangrove_geojson(year: int = Query(..., description="Tahun epoch (2007-2020)"), db: Session = Depends(get_db)):
    """
    Mengambil data mangrove extent dalam format GeoJSON berdasarkan tahun tertentu.
    Menggunakan fungsi ST_AsGeoJSON dari PostGIS.
    """
    return mangrove_service.get_mangrove_extent(year, db)
