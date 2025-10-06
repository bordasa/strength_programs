from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Enum, Date
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from app.db.base import Base


class ProgramType(str, enum.Enum):
    BATTLESHIP = "battleship"
    FIVE_THREE_ONE = "531"
    TEXAS_METHOD = "texas_method"


class ProgramStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class Program(Base):
    __tablename__ = "programs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=True)
    athlete_id = Column(UUID(as_uuid=True), ForeignKey("athletes.id"), nullable=False)
    program_type = Column(Enum(ProgramType), nullable=False, default=ProgramType.BATTLESHIP)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    start_date = Column(Date, nullable=True)
    status = Column(Enum(ProgramStatus), nullable=False, default=ProgramStatus.DRAFT)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    athlete = relationship("Athlete", back_populates="programs")
    creator = relationship("User")
    config = relationship("ProgramConfig", back_populates="program", uselist=False)
    weeks = relationship("ProgramWeek", back_populates="program", order_by="ProgramWeek.week_number")


class ProgramConfig(Base):
    __tablename__ = "program_configs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    program_id = Column(UUID(as_uuid=True), ForeignKey("programs.id"), nullable=False)
    num_lifts = Column(Integer, nullable=False)  # 3, 4, or 6
    lift_rms = Column(JSONB, nullable=False)  # {"squat": 10, "bench": 8, ...}
    lift_weights = Column(JSONB, nullable=True)  # {"squat": {"H": 225, "M": 185, "L": 155}, ...}
    lift_intensity_rms = Column(JSONB, nullable=True)  # {"squat": {"H": 10, "M": 12, "L": 15}, ...}
    weekly_template = Column(JSONB, nullable=True)  # Template structure
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    program = relationship("Program", back_populates="config")


class ProgramWeek(Base):
    __tablename__ = "program_weeks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    program_id = Column(UUID(as_uuid=True), ForeignKey("programs.id"), nullable=False)
    week_number = Column(Integer, nullable=False)  # 1-8 for Battleship
    dice_roll_1 = Column(Integer, nullable=True)  # Deprecated: kept for backward compatibility
    dice_roll_2 = Column(Integer, nullable=True)  # Deprecated: kept for backward compatibility
    dice_rolls = Column(JSONB, nullable=True)  # {"lift_name": [roll1, roll2], ...}
    weekly_data = Column(JSONB, nullable=False)  # NL values for each lift/intensity
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    program = relationship("Program", back_populates="weeks")
