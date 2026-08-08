from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Any

def get_mangrove_geojson_from_db(year: int, db: Session) -> Any:
    query = text("""
        SELECT jsonb_build_object(
            'type',     'FeatureCollection',
            'features', jsonb_agg(features.feature)
        )
        FROM (
          SELECT jsonb_build_object(
            'type',       'Feature',
            'geometry',   ST_AsGeoJSON(geometry)::jsonb,
            'properties', jsonb_build_object('year', year)
          ) AS feature
          FROM mangrove_extents
          WHERE year = :year
        ) features;
    """)
    return db.execute(query, {"year": year}).scalar()
