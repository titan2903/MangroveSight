# MangroveSight Global Rules

These rules apply universally to all AI agents working on the **MangroveSight** project. You MUST ALWAYS follow these constraints without exception, regardless of the task or skill being used.

## 1. Project Boundaries & Source of Truth
- **Single Source of Truth**: Selalu jadikan `PRD.md` sebagai acuan utama sebelum melakukan penambahan fitur atau perubahan arsitektur besar. Jika ada permintaan yang menyimpang jauh dari PRD (seperti penambahan role autentikasi kompleks atau integrasi data real-time), konfirmasi terlebih dahulu dengan *User*.
- **Geographical Scope**: Project ini **HANYA** fokus pada area Teluk Balikpapan. Jangan menulis kode atau struktur data yang mencoba menggeneralisasi atau menarik batas (*bounding box*) untuk wilayah lain atau seluruh Kalimantan.

## 2. Arsitektur AI & Perhitungan Spasial (PENTING)
- **No On-The-Fly Geospatial AI**: Asisten AI (Integrasi Gemini) **dilarang** melakukan kalkulasi spasial secara *real-time* atau mencoba menganalisis *raw geometry/shapefile*. 
- **Precomputed Only**: Semua jawaban AI, ringkasan (summary), dan chart harus murni bersumber dari data statistik berformat JSON yang sudah di-*precompute* pada saat preprocessing.

## 3. Disiplin Tech Stack
- **Konsistensi Framework**: Selalu gunakan `FastAPI` untuk backend dan `React (Vite)` untuk frontend. Jangan menyisipkan framework alternatif (seperti Express.js, Next.js, atau Django) kecuali diminta secara spesifik.
- **Library Frontend**: Pastikan `react-leaflet` digunakan untuk peta dan `recharts` digunakan untuk grafik. 
- **Database**: Backend berkomunikasi secara eksklusif dengan `PostgreSQL + PostGIS`. Jangan menggunakan NoSQL atau SQLite.

## 4. Keamanan & CI/CD
- **Environment Variables**: Jangan pernah melakukan *hardcode* pada API Keys (seperti `GEMINI_API_KEY`), Token, atau URL Database di dalam *source code*. Selalu baca dari Environment Variable.
- **Workflow Keselamatan**: Selalu pertimbangkan alur GitHub Actions (`heroku-deploy.yml` dan `netlify-deploy.yml`). Jangan membuat *breaking change* pada direktori `backend/` atau `frontend/` yang dapat merusak *build pipeline*.

## 5. Komunikasi & Kode
- Berikan penamaan variabel dan fungsi menggunakan bahasa Inggris yang jelas (contoh: `calculateArea`, `getMangroveEpochs`).
- Berikan *comment* pada kode yang kompleks.
- Jika melakukan perubahan UI/UX, pastikan untuk selalu mengingat estetika **"Mangrove Vibe"** (hijau hutan, biru laut, dan desain modern *glassmorphism*).
