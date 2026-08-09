import json
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from repositories import stats_repo

def get_full_stats(db: Session) -> Dict[str, Any]:
    raw_data = stats_repo.get_area_per_year(db)
    
    if not raw_data:
        return {"metadata": {}, "summary": {}, "epochs": []}
        
    epoch_data = {}
    for row in raw_data:
        year = row["year"]
        epoch_data[year] = {
            "year": year,
            "area_ha": round(row["area_ha"], 2),
            "polygon_count": row["polygon_count"]
        }
        
    available_years = sorted(epoch_data.keys())
    
    for i, year in enumerate(available_years):
        if i == 0:
            epoch_data[year]["delta_ha"] = None
            epoch_data[year]["delta_pct"] = None
            epoch_data[year]["prev_year"] = None
        else:
            prev_year = available_years[i - 1]
            current_area = epoch_data[year]["area_ha"]
            prev_area = epoch_data[prev_year]["area_ha"]

            delta_ha = round(current_area - prev_area, 2)
            delta_pct = round((delta_ha / prev_area) * 100, 2) if prev_area > 0 else 0.0

            epoch_data[year]["delta_ha"] = delta_ha
            epoch_data[year]["delta_pct"] = delta_pct
            epoch_data[year]["prev_year"] = prev_year
            
    # Calculate summary
    areas = [d["area_ha"] for d in epoch_data.values()]
    max_year = max(epoch_data, key=lambda y: epoch_data[y]["area_ha"])
    min_year = min(epoch_data, key=lambda y: epoch_data[y]["area_ha"])
    first_year = available_years[0]
    last_year = available_years[-1]

    net_change_ha = round(epoch_data[last_year]["area_ha"] - epoch_data[first_year]["area_ha"], 2)
    net_change_pct = round(
        (net_change_ha / epoch_data[first_year]["area_ha"]) * 100, 2
    ) if epoch_data[first_year]["area_ha"] > 0 else 0.0

    biggest_loss_year = None
    biggest_loss_ha = 0.0
    for year in available_years:
        d = epoch_data[year].get("delta_ha")
        if d is not None and d < biggest_loss_ha:
            biggest_loss_ha = d
            biggest_loss_year = year

    summary = {
        "max_area": {
            "year": max_year,
            "area_ha": epoch_data[max_year]["area_ha"],
        },
        "min_area": {
            "year": min_year,
            "area_ha": epoch_data[min_year]["area_ha"],
        },
        "net_change_2007_to_2020": {
            "delta_ha": net_change_ha,
            "delta_pct": net_change_pct,
        },
        "biggest_loss_epoch": {
            "year": biggest_loss_year,
            "delta_ha": biggest_loss_ha,
        },
        "first_epoch": first_year,
        "last_epoch": last_year,
        "total_epochs": len(available_years),
    }

    output_json = {
        "metadata": {
            "project": "MangroveSight",
            "region": "Teluk Balikpapan",
            "data_sources": {
                "2007_2020": "Global Mangrove Watch v3.0 (Zenodo: 10.5281/zenodo.6894273)",
            },
            "area_unit": "hectares (ha)",
            "crs_for_calculation": "EPSG:32750",
            "epochs_available": available_years,
            "calculation_mode": "on-the-fly (database)"
        },
        "summary": summary,
        "epochs": list(epoch_data.values()),
    }
    
    return output_json

def get_available_years(db: Session) -> List[int]:
    raw_data = stats_repo.get_area_per_year(db)
    return [row["year"] for row in raw_data]
