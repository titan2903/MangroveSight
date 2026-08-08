*# Product Requirements Document (PRD)
## MangroveSight — Sistem WebGIS Pemantauan Perubahan Hutan Mangrove Teluk Balikpapan (2007–2020)

| Field | Value |
|---|---|
| Versi Dokumen | 1.1 |
| Tanggal | 4 Agustus 2026 |
| Pemilik Project | Titanio Yudista |
| Durasi Development | 4 minggu (1 bulan) |
| Status | Draft — Final Project |

---

## 1. Latar Belakang & Masalah

Teluk Balikpapan mengalami degradasi ekosistem mangrove akibat tekanan industri (migas, pelabuhan, alih fungsi lahan). Data mengenai perubahan sebaran mangrove secara historis tersedia (Global Mangrove Watch), tetapi tidak disajikan dalam bentuk yang mudah diakses dan dieksplorasi oleh mahasiswa, peneliti, atau pemangku kepentingan lokal.

**Masalah yang ingin diselesaikan:**
- Tidak ada alat visual yang memudahkan eksplorasi perubahan luas mangrove Teluk Balikpapan dari waktu ke waktu.
- Data mentah (shapefile/GeoTIFF) tidak accessible untuk non-GIS-user.
- Interpretasi data spasial-temporal butuh insight instan tanpa harus membaca laporan panjang.

## 2. Tujuan Project

1. Membangun WebGIS yang memvisualisasikan sebaran & perubahan hutan mangrove Teluk Balikpapan periode **2007–2020** (10 epoch; bersumber dari GMW v3.0).
2. Menyediakan analisis kuantitatif otomatis (luas area, laju perubahan) per epoch.
3. Menyediakan asisten AI ringan di frontend yang membantu pengguna memahami data tanpa perlu membaca tabel mentah.
4. Deliverable selesai dan ter-deploy dalam **4 minggu**.

## 3. Target Pengguna

| Persona | Kebutuhan |
|---|---|
| Mahasiswa/Peneliti | Eksplorasi data spasial-temporal untuk riset/tugas akhir |
| Dosen Penguji | Menilai kelengkapan fitur & orisinalitas analisis |
| Pemangku kepentingan lokal (opsional, tidak jadi fokus utama) | Memahami tren degradasi secara awam |

## 4. Scope

### 4.1 In Scope
- Wilayah studi: Teluk Balikpapan (bounding box tetap, tidak seluruh Kalimantan)
- Rentang waktu: **2007, 2008, 2009, 2010, 2015, 2016, 2017, 2018, 2019, 2020** (10 epoch; bersumber dari GMW v3.0)
- Navigasi multi-halaman: **About**, **Maps**, **Chart**
- Visualisasi peta interaktif per epoch (halaman Maps)
- Grafik chart tren luas mangrove (halaman Chart)
- Kalkulasi luas area otomatis per epoch
- Perbandingan antar-epoch (selisih luas, % perubahan)
- AI Insight Assistant (chat sederhana, lihat Section 6)
- Deploy publik via Heroku (backend) + Netlify (frontend)
- CI/CD pipeline via GitHub Actions (auto-deploy on push/merge ke `master`)

### 4.2 Out of Scope
- Prediksi/forecasting mangrove masa depan (butuh ML model terpisah)
- Data real-time/live satellite feed
- Analisis NDVI/kesehatan vegetasi per piksel (raster analysis kompleks)
- Multi-region (fokus hanya Teluk Balikpapan)
- Autentikasi user / multi-role akses
- Mobile native app

## 5. Fitur Utama (Core WebGIS)

### F0 — Navigasi Multi-Halaman (Navbar)
- **Deskripsi:** Navbar persisten di semua halaman dengan 3 route utama:
  - **About** — Deskripsi project, sumber data, metodologi ringkas, kredit/referensi.
  - **Maps** — Halaman utama peta interaktif (F1–F5).
  - **Chart** — Halaman grafik & statistik tren mangrove (F2b).
- **Acceptance Criteria:**
  - Navigasi antar halaman tanpa full page reload (SPA routing via React Router).
  - Navbar aktif state sesuai halaman yang sedang dibuka.
  - Responsif di layar desktop (mobile adalah nice-to-have).

### F1 — Peta Interaktif Multi-Epoch (Halaman Maps)
- **Deskripsi:** Menampilkan layer polygon sebaran mangrove per epoch di atas basemap (OSM/Esri Satellite).
- **Interaksi:** Slider atau dropdown untuk berpindah antar tahun (2007 → 2020).
- **Acceptance Criteria:**
  - User bisa switch antar 10 epoch dalam < 2 detik render time.
  - Layer mangrove ditampilkan dengan styling warna konsisten (hijau) di atas basemap.

### F2 — Kalkulasi Luas Area Otomatis
- **Deskripsi:** Sistem menghitung total luas mangrove (ha/km²) per epoch secara otomatis dari data geometri.
- **Acceptance Criteria:**
  - Nilai luas ditampilkan di panel info setiap kali user berpindah epoch.
  - Perhitungan dilakukan sekali saat data preprocessing (precomputed), bukan on-the-fly di browser.

### F2b — Halaman Chart: Grafik Tren & Statistik
- **Deskripsi:** Halaman tersendiri yang menampilkan visualisasi statistik berupa grafik interaktif. Tidak ada peta di halaman ini — murni data viz.
- **Konten grafik yang ditampilkan:**
  - **Line Chart:** Tren luas mangrove (ha) dari tahun 2007 hingga 2020 per epoch.
  - **Bar Chart:** Perubahan luas (delta ha) antar-epoch — batang merah untuk loss, hijau untuk gain.
  - **Summary Cards:** Total luas tertinggi, total luas terendah, total net loss/gain selama 2007–2020, epoch dengan penurunan paling drastis.
- **Library:** Recharts (kompatibel dengan React, ringan, tidak perlu setup ekstra).
- **Data source:** Endpoint `/api/stats` yang mengembalikan statistik precomputed (JSON).
- **Acceptance Criteria:**
  - Minimal 2 jenis chart (line + bar) ter-render dengan data real.
  - Summary cards menampilkan 4 metrik kunci.
  - Chart responsif terhadap ukuran container.

### F3 — Perbandingan Antar-Epoch (Change Detection View)
- **Deskripsi:** User bisa memilih 2 epoch (misal 2007 vs 2020) untuk melihat area yang hilang (loss) dan bertambah (gain).
- **Acceptance Criteria:**
  - Overlay visual dengan warna berbeda: merah (loss), biru (gain), hijau (tetap).
  - Statistik ringkas: total loss (ha), total gain (ha), net change (%).

### F4 — Info Panel Kontekstual
- **Deskripsi:** Panel sidebar menampilkan metadata: nama wilayah, sumber data, tahun, luas total.
- **Acceptance Criteria:** Update otomatis sesuai epoch/area yang dipilih di peta.

### F5 — Legend & Basemap Toggle
- **Deskripsi:** Legenda warna layer + toggle basemap (OSM / Satellite).
- **Acceptance Criteria:** Minimal 2 pilihan basemap tersedia.

## 6. Fitur AI (Frontend) — AI Insight Assistant

> **Prinsip desain:** AI **tidak** melakukan analisis geospasial real-time atau reasoning atas geometri mentah. AI hanya menjawab pertanyaan berbasis **data statistik yang sudah di-precompute** (hasil F2 dan F3).

### F6 — Chat Widget: Tanya-Jawab Seputar Data Mangrove

- **Deskripsi:** Widget chat sederhana (floating button di pojok layar) yang memungkinkan user bertanya dalam bahasa natural tentang data yang sedang ditampilkan, contoh:
  - "Berapa luas mangrove Teluk Balikpapan tahun 2010?"
  - "Tahun berapa penurunan mangrove paling drastis?"
  - "Apa penyebab umum degradasi mangrove di area ini?" *(jawaban generik dari knowledge umum, bukan analisis data)*

- **Cara Kerja (Arsitektur Sederhana):**
  1. Saat preprocessing data, buat **ringkasan statistik terstruktur** (JSON) berisi: luas per epoch, delta antar-epoch, top loss/gain area, dsb.
  2. Ringkasan ini di-inject sebagai **context/system prompt** ke LLM API (Gemini API) — bukan pencarian real-time ke database spasial.
  3. Frontend mengirim pertanyaan user + context JSON ke backend endpoint (`/api/ask`) → backend forward ke LLM API → jawab dalam bahasa natural.
  4. Tidak ada vector database, tidak ada RAG kompleks, tidak ada fine-tuning — murni **prompt engineering + structured context**.

- **Acceptance Criteria:**
  - User bisa mengetik pertanyaan bebas terkait data yang tampil dan mendapat jawaban relevan dalam < 5 detik.
  - AI menjawab berdasarkan data precomputed, bukan mengarang angka (grounded response).
  - Jika pertanyaan di luar konteks data (misal "siapa presiden Indonesia"), AI merespons sopan bahwa itu di luar cakupan asisten ini.
  - Tidak perlu conversation memory lintas sesi (stateless per-session cukup).

- **Batasan (agar tetap simple):**
  - Tidak ada voice input.
  - Tidak ada upload file oleh user.
  - Tidak ada multi-turn context yang kompleks — cukup Q&A single-turn atau short follow-up.
  - Rate limit sederhana (misal 20 pertanyaan/menit) untuk kontrol biaya API.

### F7 (Opsional, jika waktu memungkinkan) — Quick Insight Auto-Summary

- **Deskripsi:** Saat user memilih 2 epoch untuk dibandingkan (F3), tombol "Jelaskan dengan AI" men-generate 2-3 kalimat ringkasan otomatis dari statistik perubahan tersebut.
- **Contoh output:** *"Antara 2010 dan 2020, luas mangrove Teluk Balikpapan berkurang sekitar 320 ha (12%), dengan area kehilangan terbesar di sisi utara teluk."*
- **Kenapa opsional:** Bisa jadi extension dari F6 (prompt template berbeda), risiko rendah kalau dikerjakan setelah F6 stabil.

## 7. Data Requirements

| Data | Sumber | Format | Catatan |
|---|---|---|---|
| Sebaran mangrove epoch 2007–2020 | **GMW v3.0** (Zenodo/UNEP-WCMC) | Shapefile → clip ke Teluk Balikpapan | 10 epoch: 2007, 2008, 2009, 2010, 2015–2020 |
| Basemap | OpenStreetMap / Esri Satellite | Tile layer | Via Leaflet tile provider |
| Batas administrasi (opsional) | GADM / BIG | Shapefile | Untuk konteks wilayah di halaman About/Maps |
| Ringkasan statistik (untuk AI & Chart) | Precomputed dari data GMW | JSON | Dibuat saat preprocessing; dipakai F2b dan F6 |

> ⚠️ **Catatan:** Epoch 2007–2020 menggunakan GMW v3.0 (resolusi 25m).

## 8. Tech Stack

```
Data Pipeline : QGIS (clip wilayah) → GDAL → PostGIS

Backend       : FastAPI (Python)
                Endpoints:
                - GET /api/mangrove?year=YYYY     → GeoJSON layer per epoch
                - GET /api/stats                  → statistik precomputed (JSON)
                - GET /api/years                  → list epoch yang tersedia
                - POST /api/ask                   → proxy ke Gemini API

Database      : PostgreSQL + PostGIS
                → Di-host di Heroku Postgres (Heroku add-on)
                → Local development menggunakan Docker (image: postgis/postgis)

Frontend      : Vite + React JS
                - React Router v6 (SPA routing: /about, /maps, /chart)
                - Leaflet.js (via react-leaflet) untuk peta interaktif
                - Recharts untuk grafik di halaman Chart
                - Turf.js untuk kalkulasi/validasi luas sisi client (opsional)

AI Layer      : Gemini API (Gemini Flash 2.0)
                - Dipanggil via backend endpoint /api/ask
                - API key disimpan sebagai environment variable Heroku
                - Tidak pernah diekspos ke frontend

Tools Tambahan: Docker & Docker Compose
                - Digunakan untuk environment local development (khususnya untuk PostGIS database) tanpa perlu instalasi native.

Deploy        :
  Backend     → Heroku (Dyno + Heroku Postgres add-on)
  Frontend    → Netlify

CI/CD         : GitHub Actions
  Trigger     : Push atau merge ke branch `master`
  Pipeline Backend (heroku-deploy.yml):
                1. Checkout repo
                2. Install dependencies & run tests (opsional)
                3. Deploy ke Heroku via Heroku CLI / heroku/deploy action
  Pipeline Frontend (netlify-deploy.yml):
                1. Checkout repo
                2. npm install & npm run build (Vite)
                3. Deploy dist/ ke Netlify via netlify/actions
  Environment :
                - HEROKU_API_KEY → GitHub Secret
                - NETLIFY_AUTH_TOKEN + NETLIFY_SITE_ID → GitHub Secret
                - GEMINI_API_KEY → Heroku Config Vars (tidak masuk repo)
```

### Struktur Repository

```
mangrove-sight/
├── .github/
│   └── workflows/
│       ├── heroku-deploy.yml     # CI/CD backend
│       └── netlify-deploy.yml    # CI/CD frontend
├── backend/
│   ├── main.py                   # FastAPI app
│   ├── routers/
│   │   ├── mangrove.py
│   │   ├── stats.py
│   │   └── ai.py
│   ├── db.py                     # PostGIS connection
│   ├── requirements.txt
│   └── Procfile                  # Heroku process config
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── Maps.jsx
│   │   │   └── Chart.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── MapViewer.jsx
│   │   │   ├── EpochSlider.jsx
│   │   │   ├── InfoPanel.jsx
│   │   │   ├── ChatWidget.jsx
│   │   │   └── StatsChart.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
├── data-pipeline/
│   ├── clip_mangrove.py          # Script clip GMW ke bounding box Teluk Balikpapan
│   ├── import_to_postgis.sh      # Import SHP → PostGIS
│   └── precompute_stats.py       # Hitung luas & delta, export JSON
└── README.md
```

## 9. Timeline (4 Minggu)

| Minggu | Fokus | Output Target |
|---|---|---|
| **1** | Data Pipeline + Backend + CI/CD Setup | Data GMW (2007–2020) ter-clip & masuk PostGIS Heroku; semua endpoint FastAPI jalan; GitHub Actions pipeline terkonfigurasi (auto-deploy sudah aktif) |
| **2** | Frontend Core — Navbar, Maps, About (F0, F1, F4, F5) | SPA dengan React Router; halaman About statis; peta Leaflet dengan epoch slider/dropdown; info panel & legend; auto-deploy ke Netlify via push ke `master` |
| **3** | Chart, Analisis & AI (F2, F2b, F3, F6) | Halaman Chart dengan line + bar chart (Recharts); kalkulasi luas; change detection overlay; chat widget AI terhubung ke Gemini API |
| **4** | Polish, F7 (opsional), Finalisasi | Styling konsisten antar halaman; testing end-to-end; validasi CI/CD pipeline; dokumentasi README; slide presentasi |

### Catatan Prioritas Minggu 1
Setup CI/CD di awal (bukan di akhir) adalah keputusan krusial — setelah pipeline jalan, setiap push ke `master` otomatis ter-deploy. Ini menghilangkan risiko "deploy manual yang gagal di menit terakhir" dan memungkinkan iterasi lebih cepat di Minggu 2–4.

## 10. Success Metrics

- Seluruh 10 epoch (2007–2020) ter-render dengan benar di halaman Maps.
- Kalkulasi luas area akurat dibanding sumber GMW asli (toleransi margin kecil dari proses clip wilayah).
- Halaman Chart menampilkan minimal 2 jenis grafik (line + bar) dengan data real dari PostGIS.
- AI Insight Assistant menjawab minimal 90% pertanyaan dasar (luas per tahun, tren umum) dengan benar berdasarkan data precomputed.
- CI/CD pipeline berjalan: push ke `master` → backend ter-deploy ke Heroku & frontend ter-deploy ke Netlify secara otomatis.
- Aplikasi bisa diakses publik via URL Heroku (backend) dan URL Netlify (frontend) sebelum deadline.
- Waktu load awal peta < 3 detik pada koneksi standar.

## 11. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Perbedaan format data GMW v3.0 | Inkonsistensi visualisasi | Seragamkan proyeksi (EPSG:4326) dan format saat import ke PostGIS |
| GitHub Actions gagal deploy (misconfigured secrets) | Delay pipeline | Uji pipeline CI/CD di Minggu 1 dengan dummy endpoint sebelum data siap |
| CORS error antara Netlify frontend dan Heroku backend | Fitur tidak berjalan di production | Konfigurasikan CORS di FastAPI dari awal (`origins=["https://your-netlify-url"]`) |
| Biaya API LLM membengkak jika trafik tinggi | Biaya tak terduga | Set rate limit di endpoint `/api/ask`; gunakan `Gemini Flash 2.0` (lebih murah) untuk chat sederhana |
| AI menjawab di luar konteks (halusinasi angka) | Kredibilitas project turun | Inject data precomputed sebagai context; instruksikan system prompt agar hanya menjawab dari data yang diberikan |
| Data GMW resolusi 25–30m kurang presisi di skala lokal | Akurasi analisis terbatas | Cantumkan sebagai limitasi eksplisit di halaman About dan laporan project |

## 12. Deliverables Akhir

- [ ] Aplikasi WebGIS ter-deploy: frontend (Netlify URL) + backend (Heroku URL)
- [ ] Source code (repo GitHub publik, struktur monorepo backend/frontend/data-pipeline)
- [ ] CI/CD pipeline aktif (`.github/workflows/`) — auto-deploy on push ke `master`
- [ ] Dokumentasi teknis (README dengan instruksi setup lokal + arsitektur diagram)
- [ ] Data pipeline script (clip GMW → PostGIS + precompute stats)
- [ ] Laporan/slide presentasi final project

---

## Lampiran: Referensi Data & Tools

**Data, Tools & Dokumentasi:**
1. Global Mangrove Watch v3.0 Dataset (epoch 2007–2020) — https://zenodo.org/records/6894273
2. UNEP-WCMC Ocean Data Viewer (per-epoch download) — https://data.unep-wcmc.org/datasets/45
3. GMW v3.0 Paper: Bunting et al. (2022), *Global Mangrove Extent Change 1996–2020*, Remote Sensing 14(15): 3657.
5. FastAPI — https://fastapi.tiangolo.com
6. React Router v6 — https://reactrouter.com
7. react-leaflet — https://react-leaflet.js.org
8. Recharts — https://recharts.org
9. Heroku Deployment (Python) — https://devcenter.heroku.com/articles/getting-started-with-python
10. Netlify + GitHub Actions — https://docs.netlify.com/integrations/frameworks/vite
11. GitHub Actions: heroku/deploy — https://github.com/AkhileshNS/heroku-deploy*