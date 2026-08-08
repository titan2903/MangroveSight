from fastapi import APIRouter, HTTPException
from schemas import AskRequest
from services import ai_service

router = APIRouter()

@router.post("/")
def ask_ai(request: AskRequest):
    """
    Endpoint AI Chat Assistant (Gemini).
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
