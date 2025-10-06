from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel
from app.db.base import get_db
from app.schemas.program import ProgramCreate, ProgramResponse
from app.services.program_service import ProgramService
from app.programs.templates import get_available_templates

router = APIRouter()


@router.post("", response_model=ProgramResponse, status_code=status.HTTP_201_CREATED)
async def create_program(
    program_data: ProgramCreate,
    db: Session = Depends(get_db)
):
    """Create a new program."""
    service = ProgramService(db)
    program = service.create_battleship_program(program_data)
    return program


@router.get("", response_model=List[ProgramResponse])
async def list_programs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List all programs."""
    service = ProgramService(db)
    programs = service.list_programs(skip=skip, limit=limit)
    return programs


@router.get("/{program_id}", response_model=ProgramResponse)
async def get_program(
    program_id: UUID,
    db: Session = Depends(get_db)
):
    """Get a specific program by ID."""
    service = ProgramService(db)
    program = service.get_program(program_id)
    
    if not program:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Program not found"
        )
    
    return program


@router.delete("/{program_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_program(
    program_id: UUID,
    db: Session = Depends(get_db)
):
    """Delete a program."""
    service = ProgramService(db)
    success = service.delete_program(program_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Program not found"
        )
    
    return None


@router.get("/templates")
async def get_templates():
    """Get available program templates."""
    return get_available_templates()


class ProgramUpdateRequest(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None


@router.patch("/{program_id}", response_model=ProgramResponse)
async def update_program(
    program_id: UUID,
    update_data: ProgramUpdateRequest,
    db: Session = Depends(get_db)
):
    """Update a program (name, status, etc.)."""
    service = ProgramService(db)
    program = service.update_program(program_id, update_data.dict(exclude_unset=True))
    
    if not program:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Program not found"
        )
    
    return program


@router.post("/{program_id}/reroll-week/{week_number}", response_model=ProgramResponse)
async def reroll_week(
    program_id: UUID,
    week_number: int,
    lift: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Reroll the dice for a specific week (all lifts or a specific lift) and regenerate that week's data."""
    service = ProgramService(db)
    program = service.reroll_week(program_id, week_number, lift)
    
    if not program:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Program not found"
        )
    
    return program
