from typing import Any

from sqlalchemy import text
from sqlalchemy.orm import Session


def get_mangrove_geojson_from_db(year: int, db: Session, simplify: bool = False) -> Any:
    # If simplify is True, use ST_SimplifyPreserveTopology with ST_MakeValid to avoid TopologyException
    geometry_expr = "ST_MakeValid(ST_SimplifyPreserveTopology(geometry, 0.0005))" if simplify else "ST_MakeValid(geometry)"

    query = text(f"""
        SELECT jsonb_build_object(
            'type',     'FeatureCollection',
            'features', COALESCE(jsonb_agg(features.feature), '[]'::jsonb)
        )::text
        FROM (
          SELECT jsonb_build_object(
            'type',       'Feature',
            'geometry',   ST_AsGeoJSON({geometry_expr})::jsonb,
            'properties', jsonb_build_object('year', year)
          ) AS feature
          FROM mangrove_extents
          WHERE year = :year
        ) features;
    """)
    return db.execute(query, {"year": year}).scalar()


def get_mangrove_comparison(
    year1: int, year2: int, db: Session, simplify: bool = False
) -> Any:
    # Uses ST_Difference and ST_Intersection to find loss, gain, and stable areas
    # Returns a GeoJSON FeatureCollection

    # Wrap with ST_MakeValid to prevent TopologyException on complex polygons
    # Use ST_SimplifyPreserveTopology instead of ST_Simplify to avoid self-intersections
    geometry_expr = "ST_MakeValid(ST_SimplifyPreserveTopology(geometry, 0.0005))" if simplify else "ST_MakeValid(geometry)"

    query = text(f"""
        WITH y1 AS (
            SELECT ST_Union({geometry_expr}) as geom FROM mangrove_extents WHERE year = :year1
        ),
        y2 AS (
            SELECT ST_Union({geometry_expr}) as geom FROM mangrove_extents WHERE year = :year2
        )
        SELECT jsonb_build_object(
            'type', 'FeatureCollection',
            'features', jsonb_build_array(
                jsonb_build_object(
                    'type', 'Feature',
                    'properties', jsonb_build_object('status', 'loss', 'color', '#FF5252', 'desc', 'Hilang'),
                    'geometry', ST_AsGeoJSON(ST_Difference(y1.geom, y2.geom))::jsonb
                ),
                jsonb_build_object(
                    'type', 'Feature',
                    'properties', jsonb_build_object('status', 'gain', 'color', '#00E5FF', 'desc', 'Bertambah'),
                    'geometry', ST_AsGeoJSON(ST_Difference(y2.geom, y1.geom))::jsonb
                ),
                jsonb_build_object(
                    'type', 'Feature',
                    'properties', jsonb_build_object('status', 'stable', 'color', '#00BFA5', 'desc', 'Tetap'),
                    'geometry', ST_AsGeoJSON(ST_Intersection(y1.geom, y2.geom))::jsonb
                )
            )
        )::text
        FROM y1, y2;
    """)
    return db.execute(query, {"year1": year1, "year2": year2}).scalar()


def get_heatmap_points(year: int, db: Session) -> Any:
    # Returns an array of [lat, lng, intensity] for leafet.heat
    # Intensity is based on the area of the polygon patch
    query = text("""
        SELECT COALESCE(jsonb_agg(jsonb_build_array(ST_Y(centroid), ST_X(centroid), area_ha)), '[]'::jsonb)::text
        FROM (
            SELECT ST_Centroid(geometry) as centroid, ST_Area(geometry::geography)/10000 as area_ha
            FROM mangrove_extents WHERE year = :year
        ) sub;
    """)
    return db.execute(query, {"year": year}).scalar()
