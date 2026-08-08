from sqlalchemy.orm import Session
from repositories import mangrove_repo

def get_mangrove_extent(year: int, db: Session) -> dict:
    result = mangrove_repo.get_mangrove_geojson_from_db(year, db)
    
    if not result or result.get("features") is None:
        return {"type": "FeatureCollection", "features": []}
        
    return result
