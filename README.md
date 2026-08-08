# MangroveSight

## WebGIS Pemantauan Perubahan Hutan Mangrove Teluk Balikpapan (2007–2020)

MangroveSight adalah proyek final WebGIS yang dikembangkan sebagai bagian dari Final Project Bootcamp WebGIS Batch 3 MAPID Academy. Proyek ini bertujuan untuk memvisualisasikan perubahan sebaran hutan mangrove di wilayah Teluk Balikpapan dari periode 2007 hingga 2020 secara interaktif dan komprehensif.

### Tujuan Proyek
- Menyajikan data spasial mangrove dalam bentuk peta interaktif (berbasis GeoJSON/PostGIS).
- Memungkinkan pengguna melihat perubahan luas mangrove antar tahun secara visual maupun statistik.
- Menyediakan visualisasi analitik tingkat lanjut: Change Detection dan Heatmap.
- Menyediakan asisten AI interaktif (didukung Google Gemini) untuk menjawab pertanyaan spesifik seputar analisis spasial dan statistik berdasarkan basis pengetahuan (*knowledge base*).

### Fitur Utama
- **Interactive Web Map**: Eksplorasi spasial hutan mangrove dari berbagai rentang waktu (2007, 2010, 2015, 2020).
- **Mode Perbandingan (Change Detection)**: Menampilkan poligon selisih area (Pertumbuhan/Gain, Penurunan/Loss, dan Stabil) antara dua tahun berbeda menggunakan kalkulasi `ST_Difference` dan `ST_Intersection` tingkat *database* (PostGIS).
- **Heatmap Kepadatan**: Menampilkan sebaran intensitas area mangrove untuk memvisualisasikan konsentrasi ekosistem yang paling padat menggunakan algoritma dinamis yang dirender menggunakan *Canvas* di Leaflet.
- **Statistical Dashboard**: Menampilkan grafik (*bar chart*) tren total luas dan persentase perubahan area mangrove dari waktu ke waktu secara interaktif dengan komponen Recharts.
- **AI Chat Assistant**: Chatbot cerdas terintegrasi secara *on-map*, didukung oleh Google Gemini Pro. Asisten ini mampu menganalisis konteks statistik spasial Teluk Balikpapan secara akurat karena disuplai dengan data statistik *precomputed* khusus.

### Teknologi yang Digunakan
- **Frontend**: React, Vite, React Router, Material UI (MUI v6), Leaflet (`react-leaflet`, `leaflet.heat`), dan Recharts.
- **Backend**: FastAPI, SQLAlchemy, GeoAlchemy2, PostGIS Functions, dan Google GenAI SDK.
- **Database**: PostgreSQL dengan ekstensi PostGIS (berjalan di atas Docker Compose).
- **Data Pipeline**: Python, GeoPandas, Psycopg2.
- **Sumber Data**: Global Mangrove Watch (GMW v3).

### Struktur Repository
- `data-pipeline/`: Skrip Python untuk memotong (*clip*) raw data GMW secara spesifik ke area *Bounding Box* Teluk Balikpapan, menghitung luasan statistik, dan mengimpor spasial ke tabel PostGIS.
- `backend/`: Server API (*Clean Architecture*) yang menyediakan *endpoints* GeoJSON spasial, endpoint analitik on-the-fly (Heatmap, Compare), serta merutekan interaksi Chat AI ke Gemini.
- `frontend/`: Aplikasi web interaktif bergaya modern (*Glassmorphism*, nuansa alam hijau/teal) yang di-build menggunakan Vite.

### Cara Menjalankan Aplikasi Secara Lokal

#### 1. Jalankan Database (PostgreSQL + PostGIS)
```bash
cd backend
docker compose up -d
```

#### 2. Jalankan Backend Server (FastAPI)
Buka terminal baru:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # macOS/Linux (gunakan .venv\Scripts\activate untuk Windows)
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
Swagger UI API Documentation dapat diakses pada: `http://localhost:8000/docs`.

#### 3. Jalankan Frontend WebGIS
Buka terminal baru:
```bash
cd frontend
npm install
npm run dev
```
Aplikasi WebGIS siap diakses melalui browser pada: `http://localhost:5173/`.

### Status Pengembangan (Tahap Akhir)
- **Data Pipeline**: ✅ Selesai (Clipping, ekstraksi statistik, & injeksi ke DB).
- **Database**: ✅ Selesai (Skema tabel optimal dengan indeks spasial).
- **Backend**: ✅ Selesai (API Mangrove, Kalkulasi Spasial Lanjut, & Integrasi Gemini 1.5 Pro).
- **Frontend**: ✅ Selesai (UI/UX WebGIS Modern, Peta Interaktif, Dashboard, dan Chatbot AI terselesaikan secara menyeluruh).

### Referensi
- Dokumen Pedoman Produk (PRD): `PRD.md`
- Desain Arsitektur: `ARCHITECTURE.md`
- Proyek ini ditujukan untuk *Final Project* dengan fokus spasial **Teluk Balikpapan, Kalimantan Timur**.
