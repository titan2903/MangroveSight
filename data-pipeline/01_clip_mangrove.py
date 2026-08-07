"""
Script 01: Clip Mangrove Shapefiles to Teluk Balikpapan Bounding Box
===================================================================
Sumber Data:
  - GMW v4.0 (Epoch 2000): https://zenodo.org/records/12756047
  - GMW v3.0 (Epoch 2007-2020): https://zenodo.org/records/6894273

Cara Penggunaan:
  1. Unduh file shapefile dari link di atas.
  2. Letakkan file-file tersebut di dalam folder: data-pipeline/input/
  3. Pastikan naming convention:
       - GMW v4.0 tahun 2000 → input/GMW_v4_2000.shp  (atau nama asli dari Zenodo)
       - GMW v3.0 per tahun  → input/GMW_v3_YYYY.shp
  4. Jalankan script ini:
       cd data-pipeline
       python 01_clip_mangrove.py

Output:
  File GeoJSON hasil clip tersimpan di folder: data-pipeline/output/clipped/
  Contoh: output/clipped/mangrove_2000.geojson
"""

import geopandas as gpd
from pathlib import Path
import sys

# =============================================================================
# KONFIGURASI BOUNDING BOX TELUK BALIKPAPAN
# Koordinat (WGS84 / EPSG:4326): [minx, miny, maxx, maxy]
# =============================================================================
BALIKPAPAN_BBOX = (116.60, -1.55, 117.15, -1.00)

# =============================================================================
# PEMETAAN EPOCH → FILE SHAPEFILE SUMBER
# Sesuaikan nama file di sini jika nama file download dari Zenodo berbeda.
# =============================================================================
EPOCH_FILE_MAPPING = {
    2000: "GMW_v4_2000.shp",
    2007: "GMW_v3_2007.shp",
    2008: "GMW_v3_2008.shp",
    2009: "GMW_v3_2009.shp",
    2010: "GMW_v3_2010.shp",
    2015: "GMW_v3_2015.shp",
    2016: "GMW_v3_2016.shp",
    2017: "GMW_v3_2017.shp",
    2018: "GMW_v3_2018.shp",
    2019: "GMW_v3_2019.shp",
    2020: "GMW_v3_2020.shp",
}

# Direktori input (folder tempat meletakkan shapefile yang diunduh)
INPUT_DIR = Path(__file__).parent / "input"
# Direktori output (folder tempat hasil clip GeoJSON disimpan)
OUTPUT_DIR = Path(__file__).parent / "output" / "clipped"


def clip_to_balikpapan(input_path: Path, year: int) -> gpd.GeoDataFrame | None:
    """
    Baca shapefile GMW, clip ke bounding box Teluk Balikpapan,
    dan konversi proyeksi ke EPSG:4326.
    """
    print(f"\n[{year}] Membaca file: {input_path.name} ...")

    try:
        gdf = gpd.read_file(input_path, bbox=BALIKPAPAN_BBOX)
    except Exception as e:
        print(f"  [ERROR] Gagal membaca file: {e}", file=sys.stderr)
        return None

    if gdf.empty:
        print(f"  [WARNING] Tidak ada data yang ditemukan dalam bounding box untuk tahun {year}.")
        return None

    print(f"  [{year}] Ditemukan {len(gdf)} polygon sebelum clip. Melakukan clip presisi...")

    # Pastikan proyeksi adalah WGS84 (EPSG:4326) sebelum clip
    if gdf.crs is None or gdf.crs.to_epsg() != 4326:
        print(f"  [{year}] Mengkonversi CRS dari {gdf.crs} ke EPSG:4326...")
        gdf = gdf.to_crs(epsg=4326)

    # Buat polygon bounding box untuk clip presisi
    from shapely.geometry import box
    bbox_polygon = box(*BALIKPAPAN_BBOX)

    # Clip polygon mangrove agar batas tepat di bounding box
    gdf_clipped = gdf.clip(bbox_polygon)

    if gdf_clipped.empty:
        print(f"  [WARNING] Hasil clip kosong untuk tahun {year}.")
        return None

    # Tambahkan kolom tahun untuk kemudahan identifikasi
    gdf_clipped["year"] = year

    print(f"  [{year}] Berhasil! {len(gdf_clipped)} polygon setelah clip.")
    return gdf_clipped


def main():
    print("=" * 60)
    print("MangroveSight — Data Pipeline: Clip Mangrove to Teluk Balikpapan")
    print("=" * 60)
    print(f"Bounding Box: {BALIKPAPAN_BBOX}")
    print(f"Input  Dir  : {INPUT_DIR}")
    print(f"Output Dir  : {OUTPUT_DIR}")
    print()

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    success_years = []
    failed_years = []

    for year, filename in EPOCH_FILE_MAPPING.items():
        input_path = INPUT_DIR / filename

        if not input_path.exists():
            print(f"\n[{year}] [SKIP] File tidak ditemukan: {input_path}")
            print(f"         Silakan unduh dari Zenodo dan letakkan di folder 'input/'.")
            failed_years.append(year)
            continue

        gdf_clipped = clip_to_balikpapan(input_path, year)

        if gdf_clipped is not None:
            output_path = OUTPUT_DIR / f"mangrove_{year}.geojson"
            gdf_clipped.to_file(output_path, driver="GeoJSON")
            print(f"  [{year}] Output disimpan: {output_path}")
            success_years.append(year)
        else:
            failed_years.append(year)

    # Ringkasan hasil
    print("\n" + "=" * 60)
    print("RINGKASAN HASIL CLIPPING")
    print("=" * 60)
    print(f"  Berhasil : {len(success_years)} epoch → {success_years}")
    print(f"  Gagal    : {len(failed_years)} epoch → {failed_years}")
    print("\nJalankan script berikutnya: python 02_precompute_stats.py")


if __name__ == "__main__":
    main()
