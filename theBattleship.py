from random import randint
import copy

WEEKS = 8
DAYS = ['H', 'M', 'L']
NUM_OF_LIFTS = 6

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

def assign_lifts(num_of_lifts: int):
    match num_of_lifts:
        case 3:
            LIFTS = LIFTS3
        case 4:
            LIFTS = LIFTS4
        case 6:
            LIFTS = LIFTS6
    return LIFTS

ACTUAL_LIFTS = assign_lifts(NUM_OF_LIFTS)

def create_RM_4_lifts_dict(actual_lifts: list = ACTUAL_LIFTS):
    rm_4_lifts_dict = {}
    for lift in actual_lifts:
        rm_4_lifts_dict[lift] = None

    return rm_4_lifts_dict

def create_lifts_dict(lifts:list):
    lifts_dict = {}
    for lift in lifts:
        lifts_dict[lift] = []
    return lifts_dict

def create_8Week_NL_dict(lifts: list, days:int = DAYS, weeks:int = WEEKS):
    empty_NL_dict = {}
    empty_weekly_NL_dict = {}
    empty_weekly_intensity_dict = {}
    for day in days:
        empty_weekly_intensity_dict[day] = 0

    for lift in lifts:
        empty_NL_dict[lift] = copy.deepcopy(empty_weekly_intensity_dict)
    
    for week in range(weeks):
        empty_weekly_NL_dict[week] = copy.deepcopy(empty_NL_dict)

    #print(empty_weekly_NL_dict)
    return empty_weekly_NL_dict

def weekly_rolls(lifts_dict:dict, weeks:int = WEEKS):
    for lift in lifts_dict:
        for week in range(weeks):
            lifts_dict[lift].append(find_next_roll_tup(lifts_dict, lift, week))
            #print(lifts_dict)
    return lifts_dict

def find_next_roll_tup(lifts_dict:dict, lift:str, week:int):
    while True:
        roll_1 = randint(1,6)
        roll_2 = randint(1,6)
        roll_tup = (roll_1, roll_2)
        if week == 0:
            return roll_tup
        elif lifts_dict[lift][week-1] != roll_tup:
            return roll_tup

def lookup_NL(roll1: int, roll2: int, day: int):
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

def assign_NL(weekly_rolls:dict, weekly_NL_dict: dict):
    for week in weekly_NL_dict.keys():
        for lift in weekly_NL_dict[week].keys():
            for day in weekly_NL_dict[week][lift].keys():
                roll1, roll2 = weekly_rolls[lift][week]
                nl = lookup_NL(roll1, roll2, day)
                weekly_NL_dict[week][lift][day] = nl

    return weekly_NL_dict

def assign_ladder(lift_RM: int):
    match lift_RM:
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

def assign_reps(lift_RM: int, nl: int):
    rep_ladder = assign_ladder(lift_RM)
    session_reps = []
    while nl >= rep_ladder[0]:
        for reps in rep_ladder:
            session_reps.append(reps)
            nl -= reps
    if nl > 0:
        session_reps.append(nl)

    return session_reps


##########

empty_lifts_dict = create_lifts_dict(ACTUAL_LIFTS)
empty_weekly_NL_dict = create_8Week_NL_dict(ACTUAL_LIFTS)

actual_weekly_rolls = weekly_rolls(empty_lifts_dict)
# for lift in actual_weekly_rolls.keys(): 
#     print(f"{lift}:{actual_weekly_rolls[lift]}")

full_plan = assign_NL(actual_weekly_rolls, empty_weekly_NL_dict)

for week in full_plan.keys():
    print(f"Week: {week + 1}")
    for lift in full_plan[week].keys():
       print(f"{lift}: {full_plan[week][lift]}")
