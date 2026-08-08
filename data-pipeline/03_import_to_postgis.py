"""
Script 03: Import Clipped GeoJSON to PostGIS Database
======================================================
Script ini membaca semua file GeoJSON hasil clip dari Script 01,
dan mengimpornya ke dalam tabel `mangrove_extents` di database
PostgreSQL + PostGIS (Heroku Postgres).

Cara Penggunaan:
  1. Pastikan file .env pada folder backend/ sudah berisi DATABASE_URL yang benar.
  2. Pastikan Script 01 (clip) sudah dijalankan.
  3. Jalankan dari folder data-pipeline:
       cd data-pipeline
       python 03_import_to_postgis.py

Catatan:
  - Script ini akan menghapus dan membuat ulang tabel (DROP + CREATE) setiap dijalankan.
    Ini aman karena data bersumber dari file GeoJSON (bukan database lain).
  - Pastikan ekstensi PostGIS sudah aktif di database Anda:
    CREATE EXTENSION IF NOT EXISTS postgis;
"""

import geopandas as gpd
import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# =============================================================================
# KONFIGURASI
# =============================================================================
# Muat DATABASE_URL dari file .env di folder backend/
BACKEND_ENV_PATH = Path(__file__).parent.parent / "backend" / ".env"
load_dotenv(BACKEND_ENV_PATH)

DATABASE_URL = os.getenv("DATABASE_URL")

CLIPPED_DIR = Path(__file__).parent / "output" / "clipped"

# Nama tabel di PostgreSQL
TABLE_NAME = "mangrove_extents"

# Proyeksi yang akan disimpan ke database (WGS84 — standar GeoJSON/Web)
TARGET_CRS = "EPSG:4326"

# Daftar epoch sesuai PRD
EXPECTED_EPOCHS = [2007, 2008, 2009, 2010, 2015, 2016, 2017, 2018, 2019, 2020]


def get_engine():
    """Membuat SQLAlchemy engine dari DATABASE_URL."""
    if not DATABASE_URL:
        raise ValueError(
            "DATABASE_URL tidak ditemukan.\n"
            "Pastikan file backend/.env sudah berisi: DATABASE_URL=postgresql://..."
        )
    # Heroku menggunakan prefix 'postgres://' (deprecated), ganti ke 'postgresql://'
    url = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    return create_engine(url)


def main():
    print("=" * 60)
    print("MangroveSight — Data Pipeline: Import to PostGIS")
    print("=" * 60)
    print(f"Target Tabel: {TABLE_NAME}")
    print(f"Input Dir   : {CLIPPED_DIR}")
    print()

    engine = get_engine()

    # Aktifkan ekstensi PostGIS (jika belum aktif)
    print("Mengaktifkan ekstensi PostGIS...")
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
        conn.commit()
    print("  ✅ Ekstensi PostGIS aktif.")

    # Kumpulkan semua GeoDataFrame menjadi satu
    all_gdfs = []
    for year in EXPECTED_EPOCHS:
        geojson_path = CLIPPED_DIR / f"mangrove_{year}.geojson"

        if not geojson_path.exists():
            print(f"[{year}] [SKIP] File tidak ditemukan: {geojson_path.name}")
            continue

        print(f"[{year}] Membaca {geojson_path.name}...")
        gdf = gpd.read_file(geojson_path)

        if gdf.empty:
            print(f"  [{year}] [WARNING] GeoDataFrame kosong, dilewati.")
            continue

        # Pastikan CRS sesuai target
        if gdf.crs is None or gdf.crs.to_epsg() != 4326:
            gdf = gdf.to_crs(TARGET_CRS)

        # Pastikan ada kolom 'year'
        gdf["year"] = year
        all_gdfs.append(gdf)
        print(f"  [{year}] {len(gdf)} polygon siap diimport.")

    if not all_gdfs:
        print("\n[ERROR] Tidak ada data untuk diimport. Hentikan.")
        return

    # Gabungkan semua epoch menjadi satu GeoDataFrame
    import pandas as pd
    combined_gdf = pd.concat(all_gdfs, ignore_index=True)

    # Simpan hanya kolom yang relevan
    cols_to_keep = ["year", "geometry"]
    available_cols = [c for c in cols_to_keep if c in combined_gdf.columns]
    combined_gdf = combined_gdf[available_cols]

    print(f"\nTotal baris yang akan diimport: {len(combined_gdf)}")
    print(f"Mengimport ke tabel '{TABLE_NAME}' (mengganti data lama jika ada)...")

    # Import ke PostgreSQL (if_exists='replace' → drop + create tabel baru)
    combined_gdf.to_postgis(
        name=TABLE_NAME,
        con=engine,
        if_exists="replace",
        index=False,
        dtype={"geometry": "Geometry(Geometry, 4326)"},
    )

    # Buat index spasial untuk mempercepat query
    print("Membuat spatial index pada kolom geometry...")
    with engine.connect() as conn:
        conn.execute(
            text(f"CREATE INDEX IF NOT EXISTS idx_{TABLE_NAME}_geom ON {TABLE_NAME} USING GIST (geometry);")
        )
        conn.execute(
            text(f"CREATE INDEX IF NOT EXISTS idx_{TABLE_NAME}_year ON {TABLE_NAME} (year);")
        )
        conn.commit()

    print("\n" + "=" * 60)
    print("HASIL IMPORT")
    print("=" * 60)
    print(f"  ✅ Berhasil import {len(combined_gdf)} polygon ke tabel '{TABLE_NAME}'")
    print(f"  ✅ Spatial index (GIST) berhasil dibuat")
    print(f"\nData Pipeline selesai! Backend FastAPI siap dijalankan.")


if __name__ == "__main__":
    main()
