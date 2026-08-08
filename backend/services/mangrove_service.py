from sqlalchemy.orm import Session
from repositories import mangrove_repo

from fastapi.responses import Response

def get_mangrove_extent(year: int, db: Session) -> Response:
    json_str = mangrove_repo.get_mangrove_geojson_from_db(year, db)
    
    if not json_str:
        json_str = '{"type": "FeatureCollection", "features": []}'
        
    return Response(content=json_str, media_type="application/json")
