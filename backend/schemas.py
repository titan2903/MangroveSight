from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class StatsResponse(BaseModel):
    metadata: Dict[str, Any]
    summary: Dict[str, Any]
    epochs: List[Dict[str, Any]]

class AskRequest(BaseModel):
    question: str
