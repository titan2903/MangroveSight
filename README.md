# MangroveSight

## WebGIS Pemantauan Perubahan Hutan Mangrove Teluk Balikpapan (2007–2020)

MangroveSight adalah proyek final WebGIS yang dikembangkan sebagai bagian dari Final Project Bootcamp WebGIS Batch 3 MAPID Academy. Proyek ini bertujuan untuk memvisualisasikan perubahan sebaran hutan mangrove di wilayah Teluk Balikpapan dari periode 2007 hingga 2020 secara interaktif dan mudah dipahami.

### Tujuan Proyek
- Menyajikan data spasial mangrove dalam bentuk peta interaktif.
- Memungkinkan pengguna melihat perubahan luas mangrove antar tahun.
- Menyediakan visualisasi statistik perubahan secara lebih ringkas.
- Menyusun dasar untuk fitur asisten AI yang menjawab pertanyaan berbasis data terstruktur.

### Fitur yang Dikembangkan
- Peta interaktif untuk eksplorasi wilayah mangrove.
- Perbandingan antar epoch/tahun.
- Grafik tren perubahan luas mangrove.
- Panel informasi statistik terkait perubahan area.
- Asisten AI ringan berbasis data precomputed (direncanakan/tersedia pada tahap lanjutan).

### Teknologi yang Digunakan
- Frontend: Vite + React
- Backend: FastAPI (direncanakan untuk layanan API geospasial dan AI)
- Data Spasial: shapefile/GeoTIFF, Global Mangrove Watch, PostgreSQL/PostGIS (rencana pengolahan data)
- Dokumentasi kebutuhan produk: PRD.md

### Struktur Repository
- frontend/: aplikasi React untuk antarmuka WebGIS
- backend/: folder backend untuk API dan logika server
- PRD.md: dokumen kebutuhan produk dan fitur proyek
- README.md: ringkasan proyek

### Menjalankan Frontend
```bash
cd frontend
npm install
npm run dev
```
Aplikasi akan tersedia di http://localhost:5173.

### Status Pengembangan
Saat ini repository berisi struktur awal frontend Vite React dan folder backend sebagai landasan pengembangan. Pengembangan fitur WebGIS utama, integrasi data spasial, serta layanan backend akan dilanjutkan sesuai dokumen PRD.

### Referensi
- Dokumen PRD: PRD.md
- Repository ini ditujukan untuk final project WebGIS dengan fokus pada ekosistem mangrove Teluk Balikpapan.
