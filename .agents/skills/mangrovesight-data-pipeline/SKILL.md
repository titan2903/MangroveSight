---
name: mangrovesight-data-pipeline
description: Data pipeline development guidelines for MangroveSight. Triggers when working on data preprocessing, geospatial clipping, statistics computation, or PostGIS import scripts inside the data-pipeline/ directory.
---

# MangroveSight Data Pipeline Guidelines

You are an expert Geospatial Data Engineer for the **MangroveSight** project. The data pipeline is a **one-time preprocessing workflow** — its output files (GeoJSON clips + `mangrove_stats.json`) feed directly into the FastAPI backend and the Gemini AI assistant.

## 🗂 Pipeline Structure & Execution Order

The pipeline consists of **3 sequential scripts** that must be run in order:

| Step | Script | Input | Output |
|------|--------|-------|--------|
| 01 | `01_clip_mangrove.py` | GMW Shapefiles (`.shp`) in `input/` | `output/clipped/mangrove_{year}.geojson` |
| 02 | `02_precompute_stats.py` | `output/clipped/*.geojson` | `output/stats/mangrove_stats.json` |
| 03 | `03_import_to_postgis.py` | `output/clipped/*.geojson` + `backend/.env` | Rows in PostgreSQL table `mangrove_extents` |

**Critical Rule**: Never skip or reorder these steps. Script 02 and 03 depend on the output of Script 01.

## 🛠 Tech Stack & Environment

- **Language**: Python 3.12+
- **Virtual Environment**: Always use the **local `.venv`** inside `data-pipeline/`:
  ```bash
  cd data-pipeline
  source .venv/bin/activate
  pip install -r requirements-pipeline.txt
  ```
- **Local Database**: Use Docker to run a local PostGIS database for Script 03. A `docker-compose.yml` is provided in the `backend/` directory. Run `cd backend && docker-compose up -d`.
- **Core Libraries**:
  - `geopandas` — spatial data reading/writing, CRS reprojection
  - `shapely` — geometry operations
  - `fiona` — low-level file driver (used by geopandas)
  - `pyproj` — CRS definitions and transformations
  - `sqlalchemy` + `geoalchemy2` + `psycopg2-binary` — PostGIS import
  - `python-dotenv` — loads `DATABASE_URL` from `backend/.env`

> ⚠️ **IDE Linting**: If the IDE reports "Cannot find module sqlalchemy" (or similar), it means the IDE Python interpreter is pointing to the system Python, not `.venv`. Fix by selecting the `.venv` interpreter in VS Code (`Ctrl+Shift+P` → `Python: Select Interpreter` → choose `.venv`).

## 🌏 Geographical Scope (CRITICAL)

- **Bounding Box Teluk Balikpapan**: `(116.7, -1.6, 117.1, -1.1)` — format: `(min_lon, min_lat, max_lon, max_lat)`
- **CRS for Clipping / Web Output**: `EPSG:4326` (WGS84 — standard for GeoJSON/Web)
- **CRS for Area Calculation**: `EPSG:32750` (WGS 84 / UTM Zone 50S) — must reproject before calling `.area`
- **Never** change the bounding box or generalize to other regions.

## 📅 Epochs & Data Sources

| Epoch | Source |
|-------|--------|
| 2000 | Global Mangrove Watch **v4.0** (Zenodo: `10.5281/zenodo.12756047`) |
| 2007–2020 | Global Mangrove Watch **v3.0** (Zenodo: `10.5281/zenodo.6894273`) |

**Expected epochs**: `[2000, 2007, 2008, 2009, 2010, 2015, 2016, 2017, 2018, 2019, 2020]`

## 📐 Script 01 — Clipping Rules

- Read each GMW shapefile using `gpd.read_file(path, bbox=BALIKPAPAN_BBOX)` — using `bbox` as a pre-filter is critical for performance.
- Clip precisely with `gdf.clip(CLIP_GEOMETRY)` after pre-filtering.
- Reproject to `EPSG:4326` before saving.
- Save as GeoJSON: `output/clipped/mangrove_{year}.geojson`
- Handle missing shapefiles gracefully (warn + skip, do not crash).

## 📊 Script 02 — Statistics Rules

- Calculate area using **UTM projection** (`EPSG:32750`), then convert: `area_m2 / 10_000 = area_ha`.
- Round area to **2 decimal places**.
- Compute `delta_ha` and `delta_pct` between consecutive epochs (not from year 2000 always).
- The output JSON structure must follow this schema exactly (the backend and AI assistant depend on it):
  ```json
  {
    "metadata": { "project", "region", "data_sources", "area_unit", "crs_for_calculation", "epochs_available" },
    "summary": { "max_area", "min_area", "net_change_2000_to_2020", "biggest_loss_epoch", "first_epoch", "last_epoch", "total_epochs" },
    "epochs": [ { "year", "area_ha", "polygon_count", "delta_ha", "delta_pct", "prev_year" } ]
  }
  ```
- **Do NOT** add new top-level keys to this JSON without also updating the FastAPI `/api/stats` endpoint schema.

## 🗄️ Script 03 — PostGIS Import Rules

- Load `DATABASE_URL` from `backend/.env` (never hardcode).
- Fix Heroku's deprecated prefix: `.replace("postgres://", "postgresql://", 1)`.
- Use `gdf.to_postgis(name="mangrove_extents", ..., if_exists="replace")` — this is intentionally destructive (DROP + CREATE) because data comes from source files.
- Always create spatial index (`GIST`) on `geometry` column and a B-tree index on `year` column after import.
- Activate PostGIS extension before import: `CREATE EXTENSION IF NOT EXISTS postgis;`

## 🔒 Security

- `DATABASE_URL` is **always** read from `backend/.env` via `python-dotenv`. Never hardcode credentials.
- `backend/.env` must be in `.gitignore` — never commit it.
- `data-pipeline/.venv/` must be in `data-pipeline/.gitignore` — never commit the virtual environment.

## 🚫 Anti-Patterns to Avoid

- ❌ Do NOT run heavy spatial SQL (e.g., `ST_Area`, `ST_Intersects`) inside the FastAPI app — all calculations must be done here in the pipeline.
- ❌ Do NOT compute statistics on-the-fly in the frontend or backend — the `mangrove_stats.json` is the single source of truth for numbers.
- ❌ Do NOT expand the bounding box or add data from outside Teluk Balikpapan.
- ❌ Do NOT change the output JSON schema without updating the backend Pydantic models.
