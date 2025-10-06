# Intensity-Based Training System

## Overview
The program creation flow now collects detailed intensity-specific data for each lift, allowing for proper implementation of the Battleship program's Heavy (H), Medium (M), and Light (L) training days.

## Training Intensities

### Heavy Days (H)
- **Weight:** 85% of 1RM
- **Purpose:** Build maximum strength
- **Example:** If 1RM squat is 300 lbs, Heavy weight = 255 lbs

### Medium Days (M)
- **Weight:** 75% of 1RM
- **Purpose:** Balance volume and intensity
- **Example:** If 1RM squat is 300 lbs, Medium weight = 225 lbs

### Light Days (L)
- **Weight:** 65% of 1RM
- **Purpose:** High volume, technique work, recovery
- **Example:** If 1RM squat is 300 lbs, Light weight = 195 lbs

## Data Collection Flow

### Step 1: Training Weights
For each lift, the athlete enters the actual weight they will use at each intensity:
- Heavy (H): Weight at 85% 1RM
- Medium (M): Weight at 75% 1RM
- Light (L): Weight at 65% 1RM

**Example for Squat:**
- H: 255 lbs
- M: 225 lbs
- L: 195 lbs

### Step 2: Rep Maxes (RM)
For each weight entered in Step 1, the athlete enters their rep max (4-15 reps):
- Heavy RM: Max reps at 255 lbs (e.g., 8 reps)
- Medium RM: Max reps at 225 lbs (e.g., 10 reps)
- Light RM: Max reps at 195 lbs (e.g., 12 reps)

## Why This Matters

The Battleship program uses these RMs to calculate:
1. **Total reps (NL)** for each lift at each intensity each week (via dice rolls)
2. **Rep ladders** - how to break up the total reps into sets
3. **Daily workouts** - which lifts at which intensities on which days

## Database Schema

### ProgramConfig Table
Now stores:
```json
{
  "lift_weights": {
    "squat": {"H": 255, "M": 225, "L": 195},
    "upper_body_press": {"H": 185, "M": 165, "L": 145}
  },
  "lift_intensity_rms": {
    "squat": {"H": 8, "M": 10, "L": 12},
    "upper_body_press": {"H": 10, "M": 12, "L": 15}
  }
}
```

## Next Steps

With this data collected, the program can now:
1. ✅ Generate weekly NL values based on dice rolls
2. ✅ Display week-by-week plans
3. 🔄 Calculate proper rep ladders using intensity-specific RMs
4. 🔄 Show exact weights for each workout
5. 🔄 Display day-by-day workout cards with sets/reps/weight

## UI Features

### Two-Step Form
- **Step 1:** Collect weights (with visual progress indicator)
- **Step 2:** Collect RMs (showing the weight for context)
- Clean validation and error handling
- Black/grey/white theme throughout

### User Experience
- Clear labels explaining each intensity (85%, 75%, 65%)
- Weight units displayed (lbs)
- Rep range guidance (4-15 reps)
- Back button to edit weights
- Program summary before generation
