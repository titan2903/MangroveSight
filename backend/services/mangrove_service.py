from fastapi.responses import Response
from sqlalchemy.orm import Session

from repositories import mangrove_repo


def get_mangrove_extent(year: int, db: Session, simplify: bool = False) -> Response:
    json_str = mangrove_repo.get_mangrove_geojson_from_db(year, db, simplify)

    if not json_str:
        json_str = '{"type": "FeatureCollection", "features": []}'

    return Response(content=json_str, media_type="application/json")


def get_mangrove_comparison(
    year1: int, year2: int, db: Session, simplify: bool = False
) -> Response:
    json_str = mangrove_repo.get_mangrove_comparison(year1, year2, db, simplify)

    if not json_str:
        json_str = '{"type": "FeatureCollection", "features": []}'

    return Response(content=json_str, media_type="application/json")


def get_mangrove_heatmap(year: int, db: Session) -> Response:
    json_str = mangrove_repo.get_heatmap_points(year, db)

    if not json_str:
        json_str = "[]"

    return Response(content=json_str, media_type="application/json")
