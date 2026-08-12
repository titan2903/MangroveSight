from typing import Any, Dict, List

from pydantic import BaseModel


class StatsResponse(BaseModel):
    metadata: Dict[str, Any]
    summary: Dict[str, Any]
    epochs: List[Dict[str, Any]]


class AskRequest(BaseModel):
    question: str
