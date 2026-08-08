# MangroveSight

## WebGIS Pemantauan Perubahan Hutan Mangrove Teluk Balikpapan (2007–2020)

MangroveSight adalah proyek final WebGIS yang dikembangkan sebagai bagian dari Final Project Bootcamp WebGIS Batch 3 MAPID Academy. Proyek ini bertujuan untuk memvisualisasikan perubahan sebaran hutan mangrove di wilayah Teluk Balikpapan dari periode 2007 hingga 2020 secara interaktif dan mudah dipahami.

### Tujuan Proyek
- Menyajikan data spasial mangrove dalam bentuk peta interaktif (berbasis GeoJSON/PostGIS).
- Memungkinkan pengguna melihat perubahan luas mangrove antar tahun (2007-2020).
- Menyediakan visualisasi statistik tren deforestasi/aforestasi.
- Menyediakan asisten AI interaktif (didukung Google Gemini) untuk menjawab pertanyaan spesifik seputar analisis spasial dan statistik dari data precomputed.

### Fitur Utama
- **Interactive Web Map**: Eksplorasi spasial hutan mangrove per-epoch.
- **Statistical Dashboard**: Grafik tren perubahan luas mangrove berdasarkan perhitungan *precomputed*.
- **AI Chat Assistant**: Chatbot terintegrasi dengan konteks statistik mangrove.

### Teknologi yang Digunakan
- **Frontend**: React + Vite + Leaflet + Recharts (Sedang dikembangkan)
- **Backend**: FastAPI + SQLAlchemy + GeoAlchemy2 + Google GenAI SDK (Selesai)
- **Database**: PostgreSQL dengan ekstensi PostGIS berjalan di atas Docker Compose (Selesai)
- **Data Pipeline**: Python, GeoPandas, Psycopg2 (Selesai)
- **Sumber Data**: Global Mangrove Watch (GMW v3)

### Struktur Repository
- `data-pipeline/`: Skrip Python untuk meng-clip data GMW ke Teluk Balikpapan, menghitung statistik, dan mengimpor spasial ke PostGIS.
- `backend/`: API Server (Clean Architecture: Routers, Services, Repositories) yang menyediakan GeoJSON, Statistik, dan endpoint Chat AI.
- `frontend/`: Aplikasi React untuk antarmuka pengguna WebGIS.
- `ARCHITECTURE.md` & `PRD.md`: Standar referensi arsitektur dan kebutuhan produk.

### Cara Menjalankan Backend & Database
```bash
# 1. Jalankan Database PostGIS via Docker
cd backend
docker compose up -d

# 2. Jalankan Server FastAPI
source .venv/bin/activate  # atau environment virtual Anda
uvicorn main:app --host 0.0.0.0 --port 8000
```
Swagger UI akan tersedia di `http://localhost:8000/docs`.

### Status Pengembangan (Terbaru)
- **Data Pipeline**: ✅ Selesai (Clipping, ekstraksi statistik, & injeksi ke DB).
- **Database**: ✅ Selesai (PostGIS berjalan stabil).
- **Backend**: ✅ Selesai (API Mangrove, Stats, & integrasi Gemini berjalan sangat optimal).
- **Frontend**: 🚧 Segera dimulai.

### Referensi
- Dokumen PRD: `PRD.md`
- Repository ini ditujukan untuk final project WebGIS dengan fokus eksklusif pada ekosistem mangrove **Teluk Balikpapan**.
