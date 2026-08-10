from fastapi import APIRouter, HTTPException, Request, Depends
from schemas import AskRequest
from services import ai_service
import time

router = APIRouter()

# Simple in-memory rate limiter: max 20 requests per minute per IP
RATE_LIMIT = 20
RATE_LIMIT_WINDOW = 60
request_history = {}

def check_rate_limit(req: Request):
    client_ip = req.client.host
    current_time = time.time()
    
    if client_ip not in request_history:
        request_history[client_ip] = []
    
    request_history[client_ip] = [ts for ts in request_history[client_ip] if current_time - ts < RATE_LIMIT_WINDOW]
    
    if len(request_history[client_ip]) >= RATE_LIMIT:
        raise HTTPException(status_code=429, detail="Too Many Requests. Please try again later (limit: 20 req/min).")
    
    request_history[client_ip].append(current_time)

@router.post("/", dependencies=[Depends(check_rate_limit)])
def ask_ai(request: AskRequest):
    """
    Endpoint AI Chat Assistant (OpenRouter AI).
    Menggunakan context precomputed stats dan memiliki guardrails ketat
    agar hanya menjawab pertanyaan terkait MangroveSight.
    """
    try:
        answer = ai_service.ask_assistant(request.question)
        return {"answer": answer}
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
