---
name: mangrovesight-cicd
description: CI/CD and deployment guidelines for MangroveSight. Triggers when working on GitHub Actions workflows, Heroku deployment, Vercel and Netlify deployment, Procfile, or secrets/environment variable configuration.
---

# MangroveSight CI/CD & Deployment Guidelines

You are a DevOps expert for the **MangroveSight** project. Deployment follows a two-target model: **Heroku** for the FastAPI backend and **Netlify** for the React frontend, orchestrated via **GitHub Actions**.

## 🏗 Deployment Architecture

```
GitHub (master branch push)
    │
    ├── heroku-deploy.yml ──► Heroku (backend FastAPI)
    │                         └── Heroku Postgres (PostGIS)
    │
    └── netlify-deploy.yml ──► Netlify (frontend Vite build)
```

## 📁 Required File Locations

```
.github/
└── workflows/
    ├── heroku-deploy.yml    # Backend CI/CD
    └── netlify-deploy.yml   # Frontend CI/CD
backend/
└── Procfile                 # Heroku process definition
```

## 🔐 Secrets & Environment Variables — WHERE They Go

This is the most critical rule. Secrets go in TWO different places:

### GitHub Secrets (`Settings → Secrets and variables → Actions`)
These are deploy tokens — they authenticate GitHub Actions to deploy:
| Secret Name | Value | Used By |
|-------------|-------|---------|
| `HEROKU_API_KEY` | Heroku API key | `heroku-deploy.yml` |
| `HEROKU_APP_NAME` | Your Heroku app name | `heroku-deploy.yml` |
| `NETLIFY_AUTH_TOKEN` | Netlify personal access token | `vercel-deploy.yml` (Primary) & `netlify-deploy.yml` (Backup) |
| `NETLIFY_SITE_ID` | Netlify site ID | `vercel-deploy.yml` (Primary) & `netlify-deploy.yml` (Backup) |

### Heroku Config Vars (`Heroku Dashboard → Settings → Config Vars`)
These are **runtime** environment variables for the FastAPI app:
| Config Var | Example Value | Notes |
|------------|--------------|-------|
| `DATABASE_URL` | `postgresql://user:pass@host/db` | Auto-provided by Heroku Postgres add-on |
| `OPENROUTER_API_KEY` | `AIza...` | Never in GitHub Secrets or source code |
| `CORS_ORIGINS` | `https://your-site.netlify.app` | Comma-separated allowed origins |

### Netlify Environment Variables (`Netlify Dashboard → Site settings → Environment variables`)
| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_API_BASE_URL` | `https://your-app.herokuapp.com` | Used at build time by Vite |

> ⚠️ **NEVER** put `OPENROUTER_API_KEY` or `DATABASE_URL` in GitHub Secrets — those should stay in Heroku Config Vars only. GitHub Secrets are only for deploy authentication tokens.

## 📄 `heroku-deploy.yml` Template

```yaml
name: Deploy Backend to Heroku

on:
  push:
    branches:
      - master
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.13.15
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: ${{ secrets.HEROKU_APP_NAME }}
          heroku_email: "your-email@example.com"
          appdir: "backend"
```

**Important notes:**
- `appdir: "backend"` deploys only the `backend/` subdirectory (monorepo setup)
- Trigger only on changes to `backend/**` to avoid unnecessary deploys
- The workflow uses `akhileshns/heroku-deploy` action — keep version pinned

## 📄 `vercel-deploy.yml` (Primary) & `netlify-deploy.yml` (Backup) Template

```yaml
name: Deploy Frontend to Netlify

on:
  push:
    branches:
      - master
    paths:
      - 'frontend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: npm ci
        working-directory: frontend

      - name: Build Vite project
        run: npm run build
        working-directory: frontend
        env:
          VITE_API_BASE_URL: ${{ vars.VITE_API_BASE_URL }}  # from GitHub Variables (not Secrets)

      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v3.0
        with:
          publish-dir: './frontend/dist'
          production-branch: master
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 📄 `Procfile` (in `backend/`)

```
web: uvicorn main:app --host=0.0.0.0 --port=${PORT:-5000}
```

- Heroku sets `$PORT` automatically — always use it, never hardcode a port
- Do NOT use `gunicorn` with workers unless specifically needed for concurrency

## 🚀 Heroku Setup Checklist

Before first deploy:
- [ ] Create Heroku app: `heroku create your-app-name`
- [ ] Add Heroku Postgres: `heroku addons:create heroku-postgresql:essential-0`
- [ ] Verify `DATABASE_URL` is set in Config Vars (added automatically)
- [ ] Set `OPENROUTER_API_KEY`: `heroku config:set OPENROUTER_API_KEY=AIza...`
- [ ] Set `CORS_ORIGINS`: `heroku config:set CORS_ORIGINS=https://your-site.netlify.app`
- [ ] Enable PostGIS in the database: `heroku pg:psql -c "CREATE EXTENSION IF NOT EXISTS postgis;"`

## 🚀 Netlify Setup Checklist

Before first deploy:
- [ ] Create Netlify site from GitHub repo
- [ ] Set `VITE_API_BASE_URL` in Netlify environment variables
- [ ] Configure publish directory: `frontend/dist`
- [ ] Configure build command: `npm run build`
- [ ] Configure base directory: `frontend`

## 🛡 Breaking Change Rules

- **Never modify** `backend/` directory structure in a way that changes the `Procfile` entry point without testing the build
- **Never add** new env var requirements to `backend/main.py` without also documenting them in `Heroku Config Vars` section above
- **Always use** `paths:` filtering in GitHub Actions triggers to avoid deploying both services on every push
- **Check** that `frontend/dist/` is in `.gitignore` — build artifacts should never be committed
