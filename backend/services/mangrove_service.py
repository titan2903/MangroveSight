from fastapi.responses import Response
from sqlalchemy.orm import Session

from repositories import mangrove_repo

_extent_cache: dict[tuple[int, bool], str] = {}
_compare_cache: dict[tuple[int, int, bool], str] = {}
_heatmap_cache: dict[int, str] = {}

EMPTY_FC = '{"type": "FeatureCollection", "features": []}'


def get_mangrove_extent(year: int, db: Session, simplify: bool = False) -> Response:
    cache_key = (year, simplify)
    if cache_key not in _extent_cache:
        json_str = mangrove_repo.get_mangrove_geojson_from_db(year, db, simplify)
        _extent_cache[cache_key] = json_str if json_str else EMPTY_FC

    return Response(content=_extent_cache[cache_key], media_type="application/json")


def get_mangrove_comparison(
    year1: int, year2: int, db: Session, simplify: bool = False
) -> Response:
    cache_key = (year1, year2, simplify)
    if cache_key not in _compare_cache:
        json_str = mangrove_repo.get_mangrove_comparison(year1, year2, db, simplify)
        _compare_cache[cache_key] = json_str if json_str else EMPTY_FC

    return Response(content=_compare_cache[cache_key], media_type="application/json")


def get_mangrove_heatmap(year: int, db: Session) -> Response:
    if year not in _heatmap_cache:
        json_str = mangrove_repo.get_heatmap_points(year, db)
        _heatmap_cache[year] = json_str if json_str else "[]"

    return Response(content=_heatmap_cache[year], media_type="application/json")
