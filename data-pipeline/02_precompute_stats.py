"""
Script 02: Precompute Statistics from Clipped GeoJSON Files
===========================================================
Script ini membaca hasil clip dari Script 01, menghitung statistik
(luas area dalam ha, delta antar-epoch, % perubahan), dan mengekspor
hasilnya ke dalam satu file JSON terstruktur.

JSON ini akan digunakan oleh:
  - Backend FastAPI (/api/stats endpoint)
  - AI Insight Assistant (sebagai context pada /api/ask endpoint)
  - Frontend Recharts (Line Chart & Bar Chart di halaman /chart)

Cara Penggunaan:
  1. Pastikan Script 01 sudah dijalankan dan folder output/clipped/ berisi file GeoJSON.
  2. Jalankan script ini:
       cd data-pipeline
       python 02_precompute_stats.py

Output:
  output/stats/mangrove_stats.json
"""

import geopandas as gpd
import json
from pathlib import Path
import math

# =============================================================================
# KONFIGURASI
# =============================================================================
CLIPPED_DIR = Path(__file__).parent / "output" / "clipped"
STATS_DIR = Path(__file__).parent / "output" / "stats"
OUTPUT_FILE = STATS_DIR / "mangrove_stats.json"

# Proyeksi UTM untuk kalkulasi luas yang akurat (meter persegi)
# EPSG:32750 = WGS 84 / UTM Zone 50S (cocok untuk Kalimantan Timur)
UTM_CRS = "EPSG:32750"

# Daftar epoch yang diharapkan, sesuai PRD
EXPECTED_EPOCHS = [2007, 2008, 2009, 2010, 2015, 2016, 2017, 2018, 2019, 2020, 2022]


def calculate_area_ha(gdf: gpd.GeoDataFrame) -> float:
    """
    Menghitung total luas area (dalam hektar) dari GeoDataFrame.
    Diproyeksikan ke UTM terlebih dahulu untuk akurasi.
    """
    gdf_utm = gdf.to_crs(UTM_CRS)
    total_area_m2 = gdf_utm.geometry.area.sum()
    total_area_ha = total_area_m2 / 10_000  # konversi m² → hektar
    return round(total_area_ha, 2)


def main():
    print("=" * 60)
    print("MangroveSight — Data Pipeline: Precompute Statistics")
    print("=" * 60)
    print(f"Input  Dir: {CLIPPED_DIR}")
    print(f"Output    : {OUTPUT_FILE}")
    print()

    STATS_DIR.mkdir(parents=True, exist_ok=True)

    epoch_data = {}

    # Hitung luas per epoch
    for year in EXPECTED_EPOCHS:
        geojson_path = CLIPPED_DIR / f"mangrove_{year}.geojson"

        if not geojson_path.exists():
            print(f"[{year}] [SKIP] File tidak ditemukan: {geojson_path.name}")
            continue

        print(f"[{year}] Membaca dan menghitung luas...")
        gdf = gpd.read_file(geojson_path)

        if gdf.empty:
            print(f"[{year}] [WARNING] GeoDataFrame kosong, dilewati.")
            continue

        area_ha = calculate_area_ha(gdf)
        polygon_count = len(gdf)

        epoch_data[year] = {
            "year": year,
            "area_ha": area_ha,
            "polygon_count": polygon_count,
        }
        print(f"  [{year}] Luas: {area_ha:,.2f} ha | Polygon: {polygon_count}")

    if not epoch_data:
        print("\n[ERROR] Tidak ada data yang berhasil diproses. Hentikan.")
        return

    # Hitung delta (perubahan luas) antar-epoch
    print("\nMenghitung delta antar-epoch...")
    available_years = sorted(epoch_data.keys())

    for i, year in enumerate(available_years):
        if i == 0:
            epoch_data[year]["delta_ha"] = None
            epoch_data[year]["delta_pct"] = None
            epoch_data[year]["prev_year"] = None
        else:
            prev_year = available_years[i - 1]
            current_area = epoch_data[year]["area_ha"]
            prev_area = epoch_data[prev_year]["area_ha"]

            delta_ha = round(current_area - prev_area, 2)
            delta_pct = round((delta_ha / prev_area) * 100, 2) if prev_area > 0 else 0.0

            epoch_data[year]["delta_ha"] = delta_ha
            epoch_data[year]["delta_pct"] = delta_pct
            epoch_data[year]["prev_year"] = prev_year

            trend = "📈 GAIN" if delta_ha > 0 else "📉 LOSS"
            print(f"  {prev_year} → {year}: {delta_ha:+,.2f} ha ({delta_pct:+.2f}%) {trend}")

    # Hitung summary statistics
    areas = [d["area_ha"] for d in epoch_data.values()]
    deltas = [d["delta_ha"] for d in epoch_data.values() if d["delta_ha"] is not None]

    max_year = max(epoch_data, key=lambda y: epoch_data[y]["area_ha"])
    min_year = min(epoch_data, key=lambda y: epoch_data[y]["area_ha"])
    first_year = available_years[0]
    last_year = available_years[-1]

    net_change_ha = round(epoch_data[last_year]["area_ha"] - epoch_data[first_year]["area_ha"], 2)
    net_change_pct = round(
        (net_change_ha / epoch_data[first_year]["area_ha"]) * 100, 2
    ) if epoch_data[first_year]["area_ha"] > 0 else 0.0

    # Epoch dengan penurunan paling drastis (delta_ha paling negatif)
    biggest_loss_year = None
    biggest_loss_ha = 0.0
    for year in available_years:
        d = epoch_data[year].get("delta_ha")
        if d is not None and d < biggest_loss_ha:
            biggest_loss_ha = d
            biggest_loss_year = year

    summary = {
        "max_area": {
            "year": max_year,
            "area_ha": epoch_data[max_year]["area_ha"],
        },
        "min_area": {
            "year": min_year,
            "area_ha": epoch_data[min_year]["area_ha"],
        },
        "net_change_2007_to_2022": {
            "delta_ha": net_change_ha,
            "delta_pct": net_change_pct,
        },
        "biggest_loss_epoch": {
            "year": biggest_loss_year,
            "delta_ha": biggest_loss_ha,
        },
        "first_epoch": first_year,
        "last_epoch": last_year,
        "total_epochs": len(available_years),
    }

    # Susun output JSON final
    output_json = {
        "metadata": {
            "project": "MangroveSight",
            "region": "Teluk Balikpapan",
            "data_sources": {
                "2007_2022": "Global Mangrove Watch v3.0 (Zenodo: 10.5281/zenodo.6894273)",
            },
            "area_unit": "hectares (ha)",
            "crs_for_calculation": UTM_CRS,
            "epochs_available": available_years,
        },
        "summary": summary,
        "epochs": list(epoch_data.values()),
    }

    # Tulis ke file JSON di data-pipeline (untuk lokal)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output_json, f, indent=2, ensure_ascii=False)

    # Tulis salinan ke backend/data/mangrove_stats.json (untuk di-deploy ke Heroku)
    backend_data_dir = Path(__file__).parent.parent / "backend" / "data"
    backend_data_dir.mkdir(parents=True, exist_ok=True)
    backend_output_file = backend_data_dir / "mangrove_stats.json"
    with open(backend_output_file, "w", encoding="utf-8") as f:
        json.dump(output_json, f, indent=2, ensure_ascii=False)

    print("\n" + "=" * 60)
    print("RINGKASAN STATISTIK")
    print("=" * 60)
    print(f"  Epoch diproses    : {len(available_years)} dari {len(EXPECTED_EPOCHS)}")
    print(f"  Luas tertinggi    : {epoch_data[max_year]['area_ha']:,.2f} ha (tahun {max_year})")
    print(f"  Luas terendah     : {epoch_data[min_year]['area_ha']:,.2f} ha (tahun {min_year})")
    print(f"  Net change (total): {net_change_ha:+,.2f} ha ({net_change_pct:+.2f}%)")
    if biggest_loss_year:
        print(f"  Penurunan terbesar: {biggest_loss_ha:,.2f} ha (tahun {biggest_loss_year})")
    print(f"\n  ✅ Output tersimpan: {OUTPUT_FILE}")
    print("\nJalankan script berikutnya: python 03_import_to_postgis.py")


if __name__ == "__main__":
    main()
