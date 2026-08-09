from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Dict

def get_area_per_year(db: Session) -> List[Dict]:
    """
    Menjalankan query spasial ke PostGIS untuk menghitung 
    luas total (ha) dan jumlah polygon per epoch/year.
    """
    query = text("""
        SELECT 
            year,
            SUM(ST_Area(ST_Transform(geometry, 32750))) / 10000 AS area_ha,
            COUNT(*) as polygon_count
        FROM mangrove_extents
        GROUP BY year
        ORDER BY year ASC
    """)
    result = db.execute(query)
    
    data = []
    for row in result:
        data.append({
            "year": int(row.year),
            "area_ha": float(row.area_ha) if row.area_ha else 0.0,
            "polygon_count": int(row.polygon_count) if row.polygon_count else 0
        })
    return data
