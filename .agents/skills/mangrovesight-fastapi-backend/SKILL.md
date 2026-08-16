---
name: mangrovesight-fastapi-backend
description: Backend development guidelines for MangroveSight using FastAPI, PostGIS, and Gemini API. Triggers when working on backend API, database queries, or AI integration.
---

# MangroveSight FastAPI Backend Guidelines

You are an expert Backend Developer for the **MangroveSight** project. The backend serves spatial data (GeoJSON), statistical data (JSON), and proxies AI chat requests using Python and FastAPI.

## 🛠 Tech Stack & Core Libraries

- **Framework**: FastAPI (`fastapi[standard]`)
- **Database**: PostgreSQL with PostGIS extension (hosted on Heroku Postgres for production). For local development, use Docker: `cd backend && docker-compose up -d`.
- **ORM / DB Driver**: `SQLAlchemy` (synchronous) + `psycopg2-binary` driver + `GeoAlchemy2` for spatial types
  - **Do NOT use `asyncpg`** — the project uses synchronous SQLAlchemy (`create_engine`, not `create_async_engine`)
- **Migrations**: `alembic` — use for any schema changes to the `mangrove_extents` table
- **Settings Management**: `pydantic-settings` — load `DATABASE_URL` and `OPENROUTER_API_KEY` from environment
- **AI Integration**: Google GenAI SDK (Gemini Flash 2.0) for the `/api/ask` endpoint
- **Spatial Utilities**: `shapely` — geometry manipulation if needed server-side

## 🏗 API Architecture & Endpoints

### `GET /api/mangrove?year=YYYY`
- Queries `mangrove_extents` PostGIS table; returns **GeoJSON FeatureCollection**
- Use `ST_AsGeoJSON()` at the DB level, not in Python
- Valid years: `[2007, 2008, 2009, 2010, 2015, 2016, 2017, 2018, 2019, 2020, 2022]`
- Return 400 for invalid year, 404 if no data found

### `GET /api/years`
- Returns list of available epochs as integers
- Response: `{ "years": [2007, 2008, 2009, 2010, 2015, 2016, 2017, 2018, 2019, 2020, 2022] }`

### `GET /api/stats`
- Returns precomputed statistics — read from DB or `mangrove_stats.json`
- **Never compute statistics on-the-fly** with `ST_Area` — use precomputed values only
- Response schema must match the `mangrove_stats.json` structure exactly:
  ```python
  class EpochStats(BaseModel):
      year: int
      area_ha: float
      polygon_count: int
      delta_ha: Optional[float]
      delta_pct: Optional[float]
      prev_year: Optional[int]

  class StatsResponse(BaseModel):
      metadata: dict
      summary: dict
      epochs: List[EpochStats]
  ```

### `POST /api/ask`
- Request body: `{ "question": "..." }`
- Fetches precomputed stats JSON, injects as Gemini system context
- **Strict Guardrails**: The System Prompt MUST explicitly instruct the AI to **ONLY** answer questions related to mangroves and the data provided in this project. If the user asks anything outside this context, the AI MUST politely refuse to answer.
- System prompt example: *"You are MangroveSight AI. Answer ONLY based on the provided JSON data. If the question is not about mangroves or this project's data, reply: 'Maaf, saya hanya dapat menjawab pertanyaan seputar data mangrove Teluk Balikpapan yang ada pada sistem ini.'"*
- Apply rate limiting (max 20 req/min) to control API costs
- Return 429 if rate limit exceeded

## 🤖 AI Endpoint Best Practices

- **Grounded Responses**: Instruct LLM to strictly stay within precomputed data context and explicitly refuse off-topic questions as defined in the guardrails above.
- **Stateless**: Single-turn Q&A only — no session memory
- **Error Handling**: Wrap Gemini calls in `try-except` for rate limits and timeouts

### `GET /`
- Health check endpoint returning `{"status": "ok", "message": "..."}`

## 🗄️ Database (PostGIS) Rules & Performance

- **Connection**: Load `DATABASE_URL` via `pydantic-settings`. Fix Heroku's deprecated prefix: `url.replace("postgres://", "postgresql://", 1)`
- **Table schema**: `mangrove_extents` with columns `year INTEGER`, `geometry GEOMETRY(Geometry, 4326)`
- **Spatial Index**: Table has GIST on `geometry` and B-tree on `year` — leverage these in WHERE clauses
- **Performance Optimization**: When returning massive GeoJSON FeatureCollections, use `::text` in the PostgreSQL query (e.g. `COALESCE(jsonb_agg(...), '[]'::jsonb)::text`) and return it directly using FastAPI's `Response(content=json_str, media_type="application/json")`. Do NOT let Pydantic parse and serialize massive GeoJSON dictionaries.
- **Alembic**: Use `alembic revision --autogenerate` for schema changes; never use `Base.metadata.create_all()` in production

## 📁 Recommended File Structure (Clean Architecture)

```
backend/
├── main.py              # FastAPI app, CORS config, router inclusion
├── db.py                # SQLAlchemy engine + session dependency
├── settings.py          # pydantic-settings Settings class
├── schemas.py           # Pydantic response models
├── routers/             # API Endpoints (receives HTTP requests)
│   ├── mangrove.py      # GET /api/mangrove
│   ├── stats.py         # GET /api/stats, GET /api/years
│   └── ai.py            # POST /api/ask
├── services/            # Business Logic
│   ├── mangrove_service.py
│   ├── stats_service.py
│   └── ai_service.py
├── repositories/        # Database Queries
│   └── mangrove_repo.py
├── requirements.txt
├── Procfile             # web: uvicorn main:app --host=0.0.0.0 --port=${PORT:-5000}
└── .env                 # LOCAL ONLY — never commit
```

## 🔒 Security & Configuration

- **Never hardcode** `DATABASE_URL`, `OPENROUTER_API_KEY`, or `CORS_ORIGINS`
- Use `pydantic-settings` to load all config from environment
- **CORS**: Configure `CORSMiddleware` from the start; use `CORS_ORIGINS` env var for Netlify URL

## 🚀 Deployment (Heroku)

- **Procfile**: `web: uvicorn main:app --host=0.0.0.0 --port=${PORT:-5000}`
- All production dependencies (including `uvicorn`) must be in `requirements.txt`
- **Heroku Config Vars** (NOT GitHub Secrets): `DATABASE_URL`, `OPENROUTER_API_KEY`, `CORS_ORIGINS`
- Heroku auto-provides `DATABASE_URL` when Heroku Postgres add-on is attached



