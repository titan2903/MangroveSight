---
name: mangrovesight-fastapi-backend
description: Backend development guidelines for MangroveSight using FastAPI, PostGIS, and Gemini API. Triggers when working on backend API, database queries, or AI integration.
---

# MangroveSight FastAPI Backend Guidelines

You are an expert Backend Developer for the **MangroveSight** project. The backend serves spatial data (GeoJSON), statistical data (JSON), and proxies AI chat requests using Python and FastAPI.

## 🛠 Tech Stack & Core Libraries
- **Framework**: FastAPI (Python 3.9+)
- **Database**: PostgreSQL with PostGIS extension.
- **ORM / DB Driver**: `asyncpg` or `SQLAlchemy` (with `GeoAlchemy2` if needed).
- **Data Validation**: `pydantic` (for request/response schemas).
- **AI Integration**: Google GenAI SDK (Gemini API) for the `/api/ask` endpoint.

## 🏗 API Architecture & Endpoints
The backend must implement the following core routes (as defined in the PRD):
1. **`GET /api/mangrove?year=YYYY`**: Fetches spatial data for a given epoch. Must return valid **GeoJSON** format (using `ST_AsGeoJSON()` at the database level).
2. **`GET /api/stats`**: Fetches precomputed summary statistics (JSON) used by the frontend charts and the AI context.
3. **`GET /api/years`**: Returns a list of available epochs (e.g., `[2000, 2007, 2008, ...]`).
4. **`POST /api/ask`**: Acts as a proxy to the Gemini API for the chat widget.

## 🤖 AI Endpoint (`/api/ask`) Best Practices
- **Strict Context Injection**: Fetch the precomputed statistics (from DB or a JSON file) and inject them into the system prompt of the Gemini model. 
- **Stateless & Grounded**: Instruct the LLM to *only* answer based on the injected data. Do not execute spatial SQL queries (like `ST_Area` or `ST_Intersects`) dynamically based on user prompts.
- **Error Handling**: Implement `try-except` blocks for Gemini API calls to handle rate limits or timeouts gracefully.

## 🗄️ Database (PostGIS) Rules
- **Connection**: Connect securely using `DATABASE_URL` from environment variables.
- **Precomputed First**: Rely on precomputed area/delta columns. Avoid running heavy spatial operations during API requests unless absolutely necessary (e.g., just formatting as GeoJSON).

## 🔒 Security & Configuration
- **Environment Variables**: NEVER hardcode API keys or database URIs. Use `os.getenv` or `pydantic-settings` to load `GEMINI_API_KEY` and `DATABASE_URL`.
- **CORS (Cross-Origin Resource Sharing)**: Configure `CORSMiddleware` in the main FastAPI app. Ensure the origin matches the Netlify frontend URL to prevent browser blocks in production.

## 🚀 Deployment (Heroku)
- Ensure the presence of a valid `Procfile` (e.g., `web: uvicorn main:app --host=0.0.0.0 --port=${PORT:-5000}`).
- Ensure all dependencies (including production servers like `uvicorn` and `gunicorn`) are listed in `requirements.txt`.
