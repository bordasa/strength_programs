"""
The Battleship Program - Core Logic
Migrated from theBattleship.py
"""
from random import randint
import copy
from typing import Dict, List, Tuple

WEEKS = 8
DAYS = ['H', 'M', 'L']

LIFTS6 = [
    'vert_pull',
    'horz_pull',
    'vert_press',
    'horz_press',
    'squat',
    'hinge'
]

LIFTS4 = [
    'upper_body_press',
    'upper_body_pull',
    'hip_hinge',
    'squat'
]

LIFTS3 = [
    'upper_body_press',
    'upper_body_pull',
    'squat'
]


def assign_lifts(num_of_lifts: int) -> List[str]:
    """Assign lift names based on number of lifts."""
    match num_of_lifts:
        case 3:
            return LIFTS3
        case 4:
            return LIFTS4
        case 6:
            return LIFTS6
        case _:
            raise ValueError(f"Invalid number of lifts: {num_of_lifts}. Must be 3, 4, or 6.")


def create_lifts_dict(lifts: List[str]) -> Dict[str, List]:
    """Create a dictionary with lift names as keys and empty lists as values."""
    lifts_dict = {}
    for lift in lifts:
        lifts_dict[lift] = []
    return lifts_dict


def create_8week_nl_dict(lifts: List[str], days: List[str] = DAYS, weeks: int = WEEKS) -> Dict:
    """Create nested dictionary structure for 8-week NL values."""
    empty_nl_dict = {}
    empty_weekly_nl_dict = {}
    empty_weekly_intensity_dict = {}
    
    for day in days:
        empty_weekly_intensity_dict[day] = 0
    
    for lift in lifts:
        empty_nl_dict[lift] = copy.deepcopy(empty_weekly_intensity_dict)
    
    for week in range(weeks):
        empty_weekly_nl_dict[week] = copy.deepcopy(empty_nl_dict)
    
    return empty_weekly_nl_dict


def weekly_rolls(lifts_dict: Dict[str, List], weeks: int = WEEKS) -> Dict[str, List[Tuple[int, int]]]:
    """Generate weekly dice rolls for each lift."""
    for lift in lifts_dict:
        for week in range(weeks):
            lifts_dict[lift].append(find_next_roll_tup(lifts_dict, lift, week))
    return lifts_dict


def find_next_roll_tup(lifts_dict: Dict[str, List], lift: str, week: int) -> Tuple[int, int]:
    """Find next dice roll tuple ensuring it's different from previous week."""
    while True:
        roll_1 = randint(1, 6)
        roll_2 = randint(1, 6)
        roll_tup = (roll_1, roll_2)
        if week == 0:
            return roll_tup
        elif lifts_dict[lift][week-1] != roll_tup:
            return roll_tup


def lookup_nl(roll1: int, roll2: int, day: str) -> int:
    """
    Lookup NL (Number of Lifts/total reps) based on dice rolls and intensity day.
    This is the core Battleship lookup table.
    """
    match roll1:
        case 1:
            match roll2:
                case 1:
                    match day:
                        case 'H':
                            return 6
                        case 'M':
                            return 21
                        case 'L':
                            return 33
                case 2|3:
                    match day:
                        case 'H':
                            return 9
                        case 'M':
                            return 18
                        case 'L':
                            return 33
                case 4|5:
                    match day:
                        case 'H':
                            return 11
                        case 'M':
                            return 16
                        case 'L':
                            return 33
                case 6:
                    match day:
                        case 'H':
                            return 14
                        case 'M':
                            return 13
                        case 'L':
                            return 33
        case 2|3:
            match roll2:
                case 1:
                    match day:
                        case 'H':
                            return 6
                        case 'M':
                            return 34
                        case 'L':
                            return 48
                case 2|3:
                    match day:
                        case 'H':
                            return 9
                        case 'M':
                            return 31
                        case 'L':
                            return 48
                case 4|5:
                    match day:
                        case 'H':
                            return 11
                        case 'M':
                            return 29
                        case 'L':
                            return 48
                case 6:
                    match day:
                        case 'H':
                            return 14
                        case 'M':
                            return 26
                        case 'L':
                            return 38
        case 4|5:
            match roll2:
                case 1:
                    match day:
                        case 'H':
                            return 6
                        case 'M':
                            return 44
                        case 'L':
                            return 62
                case 2|3:
                    match day:
                        case 'H':
                            return 9
                        case 'M':
                            return 41
                        case 'L':
                            return 62
                case 4|5:
                    match day:
                        case 'H':
                            return 11
                        case 'M':
                            return 39
                        case 'L':
                            return 62
                case 6:
                    match day:
                        case 'H':
                            return 14
                        case 'M':
                            return 36
                        case 'L':
                            return 62
        case 6:
            match roll2:
                case 1:
                    match day:
                        case 'H':
                            return 6
                        case 'M':
                            return 57
                        case 'L':
                            return 77
                case 2|3:
                    match day:
                        case 'H':
                            return 9
                        case 'M':
                            return 54
                        case 'L':
                            return 77
                case 4|5:
                    match day:
                        case 'H':
                            return 11
                        case 'M':
                            return 52
                        case 'L':
                            return 77
                case 6:
                    match day:
                        case 'H':
                            return 14
                        case 'M':
                            return 49
                        case 'L':
                            return 77
    return 0


def assign_nl(weekly_rolls_dict: Dict[str, List[Tuple[int, int]]], weekly_nl_dict: Dict) -> Dict:
    """Assign NL values to the weekly dictionary based on dice rolls."""
    for week in weekly_nl_dict.keys():
        for lift in weekly_nl_dict[week].keys():
            for day in weekly_nl_dict[week][lift].keys():
                roll1, roll2 = weekly_rolls_dict[lift][week]
                nl = lookup_nl(roll1, roll2, day)
                weekly_nl_dict[week][lift][day] = nl
    
    return weekly_nl_dict


def assign_ladder(lift_rm: int) -> List[int]:
    """Assign rep ladder based on lift RM."""
    match lift_rm:
        case 4: return [1, 2, 3]
        case 5: return [2, 3, 3]
        case 6: return [2, 3, 4]
        case 7: return [2, 4, 5]
        case 8: return [3, 4, 5]
        case 9: return [3, 5, 6]
        case 10: return [3, 5, 7]
        case 11: return [4, 6, 7]
        case 12: return [4, 6, 8]
        case 13: return [4, 7, 9]
        case 14: return [5, 7, 9]
        case 15: return [5, 8, 10]
        case _: return [3, 5, 7]  # Default ladder


def assign_reps(lift_rm: int, nl: int) -> List[int]:
    """
    Break down total NL into individual sets based on rep ladder.
    Returns a list of reps per set.
    """
    rep_ladder = assign_ladder(lift_rm)
    session_reps = []
    
    while nl >= rep_ladder[0]:
        for reps in rep_ladder:
            if nl >= reps:
                session_reps.append(reps)
                nl -= reps
            else:
                break
    
    if nl > 0:
        session_reps.append(nl)
    
    return session_reps


def generate_battleship_program(num_lifts: int, lift_rms: Dict[str, int], sessions_per_week: int = None) -> Dict:
    """
    Main function to generate a complete Battleship program.
    
    Args:
        num_lifts: Number of lifts (3, 4, or 6)
        lift_rms: Dictionary mapping lift names to their RM values
        sessions_per_week: Optional sessions per week (3 or 4), auto-selected if None
    
    Returns:
        Dictionary containing the full program with weekly NL values and dice rolls
    """
    from app.programs.templates import get_template
    
    lifts = assign_lifts(num_lifts)
    
    # Validate that all lifts have RMs
    for lift in lifts:
        if lift not in lift_rms:
            raise ValueError(f"Missing RM value for lift: {lift}")
    
    # Get the appropriate template
    template = get_template(num_lifts, sessions_per_week)
    
    # Generate dice rolls
    empty_lifts_dict = create_lifts_dict(lifts)
    rolls = weekly_rolls(empty_lifts_dict)
    
    # Create NL structure
    empty_weekly_nl_dict = create_8week_nl_dict(lifts)
    full_plan = assign_nl(rolls, empty_weekly_nl_dict)
    
    # Generate day-by-day breakdown
    daily_breakdown = generate_daily_breakdown(full_plan, template, lift_rms)
    
    # Return both the plan and the rolls
    return {
        "weeks": full_plan,
        "rolls": rolls,
        "lifts": lifts,
        "lift_rms": lift_rms,
        "template": template,
        "daily_breakdown": daily_breakdown
    }


def generate_daily_breakdown(weekly_nl_dict: Dict, template: Dict, lift_rms: Dict[str, int]) -> Dict:
    """
    Generate day-by-day breakdown of the program based on the template.
    
    Args:
        weekly_nl_dict: Weekly NL values for each lift and intensity
        template: Training template with session structure
        lift_rms: Dictionary of lift RMs for rep ladder calculation
    
    Returns:
        Dictionary with day-by-day breakdown for each week
    """
    breakdown = {}
    
    for week_num in range(WEEKS):
        week_sessions = {}
        
        for session_name, session_lifts in template["sessions"].items():
            session_data = {}
            
            for lift, intensity in session_lifts.items():
                nl = weekly_nl_dict[week_num][lift][intensity]
                rm = lift_rms.get(lift, 10)  # Default to 10 if not found
                
                # Calculate rep ladder
                rep_ladder = assign_ladder(rm)
                suggested_sets = assign_reps(rm, nl)
                
                session_data[lift] = {
                    "intensity": intensity,
                    "total_reps": nl,
                    "rm": rm,
                    "rep_ladder": rep_ladder,
                    "suggested_sets": suggested_sets,
                    "num_sets": len(suggested_sets)
                }
            
            week_sessions[session_name] = session_data
        
        breakdown[week_num + 1] = week_sessions
    
    return breakdown
