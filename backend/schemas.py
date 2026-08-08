from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class EpochStats(BaseModel):
    epoch_from: int
    epoch_to: int
    delta_ha: float
    delta_percent: float
    status: str

class StatsResponse(BaseModel):
    metadata: Dict[str, Any]
    summary: Dict[str, Any]
    epochs: List[Dict[str, Any]]

class AskRequest(BaseModel):
    question: str
