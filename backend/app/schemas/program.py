from pydantic import BaseModel
from uuid import UUID
from datetime import date, datetime
from typing import Dict, List, Optional, Union
from app.models.program import ProgramType, ProgramStatus


class ProgramConfigBase(BaseModel):
    num_lifts: int  # 3, 4, or 6
    lift_rms: Dict[str, int]  # {"squat": 10, "bench": 8, ...}
    lift_weights: Optional[Dict[str, Dict[str, Union[float, str]]]] = None  # {"squat": {"H": 225, "M": 185, "L": "Push Ups"}, ...}
    lift_intensity_rms: Optional[Dict[str, Dict[str, int]]] = None  # {"squat": {"H": 10, "M": 12, "L": 15}, ...}
    lift_names: Optional[Dict[str, str]] = None  # {"squat": "Bench Press", "deadlift": "Conventional Deadlift", ...}
    weekly_template: Optional[Dict] = None


class ProgramWeekBase(BaseModel):
    week_number: int
    dice_roll_1: Optional[int] = None  # Deprecated
    dice_roll_2: Optional[int] = None  # Deprecated
    dice_rolls: Optional[Dict[str, List[int]]] = None  # {"lift_name": [roll1, roll2], ...}
    weekly_data: Dict  # NL values for each lift/intensity


class ProgramWeekResponse(ProgramWeekBase):
    id: UUID
    program_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True


class ProgramConfigResponse(ProgramConfigBase):
    id: UUID
    program_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True


class ProgramCreate(BaseModel):
    name: Optional[str] = None
    athlete_id: UUID
    created_by: UUID
    num_lifts: int
    lift_rms: Dict[str, int]
    lift_weights: Optional[Dict[str, Dict[str, Union[float, str]]]] = None  # {"squat": {"H": 225, "M": 185, "L": "Push Ups"}, ...}
    lift_intensity_rms: Optional[Dict[str, Dict[str, int]]] = None  # {"squat": {"H": 10, "M": 12, "L": 15}, ...}
    lift_names: Optional[Dict[str, str]] = None  # {"squat": "Bench Press", "deadlift": "Conventional Deadlift", ...}
    sessions_per_week: Optional[int] = None
    start_date: Optional[date] = None


class ProgramResponse(BaseModel):
    id: UUID
    name: Optional[str] = None
    athlete_id: UUID
    program_type: ProgramType
    created_by: UUID
    start_date: Optional[date]
    status: ProgramStatus
    created_at: datetime
    config: Optional[ProgramConfigResponse] = None
    weeks: List[ProgramWeekResponse] = []
    
    class Config:
        from_attributes = True
