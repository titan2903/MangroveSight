import json
from pathlib import Path
from typing import Dict, Any, List
from fastapi import HTTPException

STATS_FILE_PATH = Path(__file__).resolve().parent.parent.parent / "data-pipeline" / "output" / "stats" / "mangrove_stats.json"

# Fallback untuk environment Heroku production (karena appdir="backend", folder data-pipeline tidak ter-deploy)
if not STATS_FILE_PATH.exists():
    STATS_FILE_PATH = Path(__file__).resolve().parent.parent / "data" / "mangrove_stats.json"

def get_full_stats() -> Dict[str, Any]:
    if not STATS_FILE_PATH.exists():
        raise HTTPException(status_code=404, detail="Stats data file not found")
        
    with open(STATS_FILE_PATH, "r") as f:
        data = json.load(f)
        
    return data

def get_available_years() -> List[int]:
    if not STATS_FILE_PATH.exists():
        return []
        
    with open(STATS_FILE_PATH, "r") as f:
        data = json.load(f)
        
    return data.get("metadata", {}).get("epochs_available", [])
