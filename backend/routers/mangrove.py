from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from db import get_db
from services import mangrove_service

router = APIRouter()

@router.get("/")
def get_mangrove_geojson(
    year: int = Query(..., description="Tahun epoch (2007-2022)"), 
    simplify: bool = Query(False, description="Apakah geometri disederhanakan untuk zoom rendah?"),
    db: Session = Depends(get_db)
):
    """
    Mengambil data mangrove extent dalam format GeoJSON berdasarkan tahun tertentu.
    Menggunakan fungsi ST_AsGeoJSON dari PostGIS.
    """
    return mangrove_service.get_mangrove_extent(year, db, simplify)

@router.get("/compare")
def get_mangrove_comparison(
    year1: int = Query(..., description="Tahun dasar (misal 2007)"), 
    year2: int = Query(..., description="Tahun pembanding (misal 2020)"), 
    simplify: bool = Query(False, description="Apakah geometri disederhanakan untuk zoom rendah?"),
    db: Session = Depends(get_db)
):
    """
    Mengambil data perbandingan mangrove antara dua tahun.
    """
    return mangrove_service.get_mangrove_comparison(year1, year2, db, simplify)

@router.get("/heatmap")
def get_mangrove_heatmap(year: int = Query(..., description="Tahun epoch"), db: Session = Depends(get_db)):
    """
    Mengambil titik-titik untuk heatmap kepadatan mangrove.
    """
    return mangrove_service.get_mangrove_heatmap(year, db)
