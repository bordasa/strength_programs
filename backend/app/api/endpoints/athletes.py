from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.db.base import get_db

router = APIRouter()


@router.get("")
async def list_athletes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List all athletes (placeholder)."""
    return {"message": "Athletes endpoint - coming soon"}


@router.get("/{athlete_id}")
async def get_athlete(
    athlete_id: UUID,
    db: Session = Depends(get_db)
):
    """Get athlete details (placeholder)."""
    return {"message": f"Athlete {athlete_id} - coming soon"}
