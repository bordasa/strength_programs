from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional, Dict, Any
from app.models.program import Program, ProgramConfig, ProgramWeek, ProgramType, ProgramStatus
from app.schemas.program import ProgramCreate
from app.programs.battleship import generate_battleship_program
from random import choice


class ProgramService:
    """Service for managing strength programs."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_battleship_program(self, program_data: ProgramCreate) -> Program:
        """Create a new Battleship program with all weeks generated."""
        # Generate the program using Battleship logic
        sessions_per_week = getattr(program_data, 'sessions_per_week', None)
        battleship_data = generate_battleship_program(
            num_lifts=program_data.num_lifts,
            lift_rms=program_data.lift_rms,
            sessions_per_week=sessions_per_week
        )
        
        # Create Program record
        program = Program(
            name=program_data.name,
            athlete_id=program_data.athlete_id,
            program_type=ProgramType.BATTLESHIP,
            created_by=program_data.created_by,
            start_date=program_data.start_date,
            status=ProgramStatus.DRAFT
        )
        self.db.add(program)
        self.db.flush()  # Get the program ID
        
        # Create ProgramConfig
        config = ProgramConfig(
            program_id=program.id,
            num_lifts=program_data.num_lifts,
            lift_rms=program_data.lift_rms,
            lift_weights=program_data.lift_weights,
            lift_intensity_rms=program_data.lift_intensity_rms,
            weekly_template=battleship_data["template"]
        )
        self.db.add(config)
        
        # Create ProgramWeeks
        for week_num in range(8):  # 8 weeks for Battleship
            week_data = battleship_data["weeks"][week_num]
            
            # Store dice rolls for each lift
            week_dice_rolls = {}
            for lift in battleship_data["lifts"]:
                roll1, roll2 = battleship_data["rolls"][lift][week_num]
                week_dice_rolls[lift] = [roll1, roll2]
            
            # For backward compatibility, store first lift's rolls in old columns
            first_lift = battleship_data["lifts"][0]
            roll1, roll2 = battleship_data["rolls"][first_lift][week_num]
            
            program_week = ProgramWeek(
                program_id=program.id,
                week_number=week_num + 1,
                dice_roll_1=roll1,
                dice_roll_2=roll2,
                dice_rolls=week_dice_rolls,
                weekly_data=week_data
            )
            self.db.add(program_week)
        
        self.db.commit()
        self.db.refresh(program)
        
        return program
    
    def get_program(self, program_id: UUID) -> Optional[Program]:
        """Get a program by ID."""
        return self.db.query(Program).filter(Program.id == program_id).first()
    
    def list_programs(self, skip: int = 0, limit: int = 100) -> List[Program]:
        """List all programs."""
        return self.db.query(Program).offset(skip).limit(limit).all()
    
    def delete_program(self, program_id: UUID) -> bool:
        """Delete a program."""
        program = self.get_program(program_id)
        if not program:
            return False
        
        self.db.delete(program)
        self.db.commit()
        return True
    
    def update_program(self, program_id: UUID, update_data: Dict[str, Any]) -> Optional[Program]:
        """Update a program's fields (name, status, etc.)."""
        program = self.get_program(program_id)
        if not program:
            return None
        
        # Update allowed fields
        if 'name' in update_data:
            program.name = update_data['name']
        if 'status' in update_data:
            # Convert string to enum if needed
            if isinstance(update_data['status'], str):
                program.status = ProgramStatus(update_data['status'])
            else:
                program.status = update_data['status']
        
        self.db.commit()
        self.db.refresh(program)
        return program
    
    def reroll_week(self, program_id: UUID, week_number: int, specific_lift: Optional[str] = None) -> Optional[Program]:
        """Reroll the dice for a specific week (all lifts or a specific lift) and regenerate that week's data."""
        program = self.get_program(program_id)
        if not program or not program.config:
            return None
        
        # Get the week to reroll
        week = next((w for w in program.weeks if w.week_number == week_number), None)
        if not week:
            return None
        
        from app.programs.battleship import lookup_nl
        
        lifts = list(program.config.lift_rms.keys())
        
        # Initialize dice_rolls if it doesn't exist (for old programs)
        if week.dice_rolls is None:
            week.dice_rolls = {}
            for lift in lifts:
                week.dice_rolls[lift] = [week.dice_roll_1 or 1, week.dice_roll_2 or 1]
        
        # Determine which lifts to reroll
        lifts_to_reroll = [specific_lift] if specific_lift else lifts
        
        # Generate new dice rolls
        for lift in lifts_to_reroll:
            # Get current roll for this lift
            current_roll = tuple(week.dice_rolls.get(lift, [1, 1]))
            print(f"Rerolling {lift}: current roll = {current_roll}")
            
            # Generate new roll (ensure it's different)
            # Using 4-sided dice with values [1, 2, 4, 6]
            DICE_VALUES = [1, 2, 4, 6]
            new_roll = current_roll
            while new_roll == current_roll:
                new_roll = (choice(DICE_VALUES), choice(DICE_VALUES))
            
            print(f"Rerolling {lift}: new roll = {new_roll}")
            
            # Store new roll
            week.dice_rolls[lift] = list(new_roll)
            
            # Calculate NL values for this lift with new roll
            if lift not in week.weekly_data:
                week.weekly_data[lift] = {}
            
            for day_intensity in ['H', 'M', 'L']:
                nl = lookup_nl(new_roll[0], new_roll[1], day_intensity)
                week.weekly_data[lift][day_intensity] = nl
        
        # Update backward compatibility fields with first lift's rolls
        first_lift = lifts[0]
        week.dice_roll_1, week.dice_roll_2 = week.dice_rolls[first_lift]
        
        # Force SQLAlchemy to detect JSONB changes
        from sqlalchemy.orm.attributes import flag_modified
        flag_modified(week, 'dice_rolls')
        flag_modified(week, 'weekly_data')
        
        self.db.commit()
        self.db.refresh(program)
        
        print(f"After commit - Week {week_number} dice_rolls: {week.dice_rolls}")
        
        return program
