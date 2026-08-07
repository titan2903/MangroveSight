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

## 6. Data Pipeline (PENTING)
- **Urutan Eksekusi Wajib**: Script data-pipeline harus selalu dijalankan secara berurutan: `01_clip_mangrove.py` → `02_precompute_stats.py` → `03_import_to_postgis.py`. Jangan melewati atau mengubah urutan ini.
- **Single Source of Truth untuk Statistik**: File `output/stats/mangrove_stats.json` adalah satu-satunya sumber data angka (luas, delta, persentase). Backend dan AI assistant harus membaca dari file/tabel ini — **dilarang** menghitung ulang statistik secara *on-the-fly* di backend atau frontend.
- **Schema JSON Immutable**: Struktur output JSON dari Script 02 (`metadata`, `summary`, `epochs`) **tidak boleh diubah** tanpa juga memperbarui Pydantic schema di backend FastAPI. Perubahan ini bersifat *breaking change*.
- **Bounding Box Tetap**: Batas area kliping Teluk Balikpapan `(116.7, -1.6, 117.1, -1.1)` dan EPSG untuk kalkulasi (`EPSG:32750`) **tidak boleh diubah**.

## 7. Python Virtual Environment
- **Isolasi Dependensi**: Seluruh dependensi data-pipeline dikelola secara **terpisah** dari backend. Gunakan virtual environment lokal di `data-pipeline/.venv/`.
- **Jangan Campur Interpreter**: Jangan menjalankan script data-pipeline menggunakan interpreter sistem (`/usr/bin/python3`) atau interpreter backend. Selalu aktifkan `.venv` terlebih dahulu: `source data-pipeline/.venv/bin/activate`.
- **IDE Interpreter**: Pastikan VS Code menggunakan interpreter dari `.venv` (dikonfigurasi via `.vscode/settings.json` dengan `python.defaultInterpreterPath`). Jika ada error "Cannot find module" di IDE, ini tandanya interpreter IDE belum diarahkan ke `.venv`.
- **`.venv` tidak di-commit**: Direktori `.venv` selalu ada di `.gitignore`. Jangan pernah commit virtual environment ke Git.

## 8. Git Operation Rules
- **No Automatic Commits/Pushes**: AI/Agent **DILARANG KERAS** melakukan operasi `git commit` atau `git push` secara otomatis. Semua tahap commit dan push ke GitHub (terutama branch `master`) harus diserahkan sepenuhnya kepada *User*. Biarkan *User* yang melakukan commit dan push secara manual sesuai dengan milestone pekerjaan mereka.
