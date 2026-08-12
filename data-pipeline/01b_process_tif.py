"""
Script 01b: Process GMW GeoTIFF (2022) to GeoJSON
=================================================
Mengekstrak data mangrove dari GeoTIFF GMW v4.1 (2022),
memotong sesuai Bounding Box Teluk Balikpapan, dan mengubahnya
menjadi poligon vektor (GeoJSON).
"""

import os
import glob
import json
import rasterio
from rasterio.merge import merge
from rasterio.mask import mask
from rasterio.features import shapes
from shapely.geometry import box, shape
import geopandas as gpd
from pathlib import Path

# Konfigurasi
INPUT_DIR = Path(__file__).parent / "input" / "GMW-13_v4112"
OUTPUT_DIR = Path(__file__).parent / "output" / "clipped"
OUTPUT_FILE = OUTPUT_DIR / "mangrove_2022.geojson"

# Bounding Box Teluk Balikpapan (Min_X, Min_Y, Max_X, Max_Y)
BALIKPAPAN_BBOX = (116.60, -1.55, 117.15, -1.00)

def main():
    print("=" * 60)
    print("MangroveSight — Data Pipeline: Process 2022 GeoTIFF")
    print("=" * 60)
    
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # 1. Cari semua file TIF
    tif_files = glob.glob(str(INPUT_DIR / "*.tif"))
    print(f"Ditemukan {len(tif_files)} file .tif di {INPUT_DIR.name}")
    
    bbox_geom = box(*BALIKPAPAN_BBOX)
    
    # 2. Filter file TIF yang bersinggungan dengan Bounding Box
    intersecting_tifs = []
    for tif_path in tif_files:
        with rasterio.open(tif_path) as src:
            bounds = src.bounds
            tif_bbox = box(bounds.left, bounds.bottom, bounds.right, bounds.top)
            if bbox_geom.intersects(tif_bbox):
                intersecting_tifs.append(tif_path)
                
    if not intersecting_tifs:
        print("Tidak ada file TIF yang bersinggungan dengan Teluk Balikpapan.")
        return
        
    print(f"\nDitemukan {len(intersecting_tifs)} tile yang berpotongan:")
    for t in intersecting_tifs:
        print(f"  - {Path(t).name}")
        
    # 3. Merge tile yang berpotongan
    print("\nMenggabungkan tile raster...")
    src_files_to_mosaic = []
    for fp in intersecting_tifs:
        src = rasterio.open(fp)
        src_files_to_mosaic.append(src)
        
    mosaic, out_trans = merge(src_files_to_mosaic)
    
    # 4. Potong hasil merge sesuai Bounding Box menggunakan rasterio.mask
    print("Memotong raster sesuai Bounding Box Teluk Balikpapan...")
    # Update profile dengan metadata dari hasil merge
    out_meta = src.meta.copy()
    out_meta.update({
        "driver": "GTiff",
        "height": mosaic.shape[1],
        "width": mosaic.shape[2],
        "transform": out_trans
    })
    
    # Simpan sementara untuk di-mask
    temp_tif = INPUT_DIR / "temp_merged.tif"
    with rasterio.open(temp_tif, "w", **out_meta) as dest:
        dest.write(mosaic)
        
    for src in src_files_to_mosaic:
        src.close()
        
    # Lakukan masking (clipping raster)
    with rasterio.open(temp_tif) as src:
        out_image, out_transform = mask(src, [bbox_geom], crop=True)
        out_meta = src.meta
    
    # Hapus file temporary
    if temp_tif.exists():
        os.remove(temp_tif)
        
    # 5. Konversi Raster ke Vektor (Polygonize)
    print("Mengekstrak poligon mangrove (Raster ke Vektor)...")
    # Mask array: hanya ekstrak nilai == 1 (mangrove)
    mask_arr = (out_image[0] == 1)
    
    results = (
        {'properties': {'mangrove': v}, 'geometry': s}
        for i, (s, v) 
        in enumerate(shapes(out_image[0], mask=mask_arr, transform=out_transform))
    )
    
    geometries = list(results)
    print(f"Ditemukan {len(geometries)} poligon mangrove.")
    
    if not geometries:
        print("Tidak ada data mangrove pada area ini.")
        return
        
    # 6. Buat GeoDataFrame dan Simpan sebagai GeoJSON
    gdf = gpd.GeoDataFrame.from_features(geometries)
    gdf.set_crs(epsg=4326, inplace=True)
    
    # Drop kolom 'mangrove' karena tidak diperlukan
    if 'mangrove' in gdf.columns:
        gdf = gdf.drop(columns=['mangrove'])
        
    print(f"Menyimpan ke {OUTPUT_FILE.name}...")
    gdf.to_file(OUTPUT_FILE, driver="GeoJSON")
    
    print("\n✅ Pemrosesan selesai!")
    print(f"Hasil tersimpan di: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
