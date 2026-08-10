from fastapi import APIRouter, HTTPException, Request
from schemas import AskRequest
from services import ai_service
import time

router = APIRouter()

# Simple in-memory rate limiter: max 20 requests per minute per IP
RATE_LIMIT = 20
RATE_LIMIT_WINDOW = 60
request_history = {}

@router.post("/")
def ask_ai(request: AskRequest, req: Request):
    """
    Endpoint AI Chat Assistant (Gemini).
    Menggunakan context precomputed stats dan memiliki guardrails ketat
    agar hanya menjawab pertanyaan terkait MangroveSight.
    """
    client_ip = req.client.host
    current_time = time.time()
    
    # Initialize or cleanup history for this IP
    if client_ip not in request_history:
        request_history[client_ip] = []
    
    # Filter out timestamps older than the window
    request_history[client_ip] = [ts for ts in request_history[client_ip] if current_time - ts < RATE_LIMIT_WINDOW]
    
    # Check rate limit
    if len(request_history[client_ip]) >= RATE_LIMIT:
        raise HTTPException(status_code=429, detail="Too Many Requests. Please try again later (limit: 20 req/min).")
    
    # Log request timestamp
    request_history[client_ip].append(current_time)

    try:
        answer = ai_service.ask_assistant(request.question)
        return {"answer": answer}
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
