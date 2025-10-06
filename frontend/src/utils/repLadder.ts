/**
 * Assigns a rep ladder based on the athlete's RM (rep max)
 * This matches the logic from the original Python Battleship program
 */
export function assignLadder(liftRM: number): number[] {
  switch (liftRM) {
    case 4: return [1, 2, 3];
    case 5: return [2, 3, 3];
    case 6: return [2, 3, 4];
    case 7: return [2, 4, 5];
    case 8: return [3, 4, 5];
    case 9: return [3, 5, 6];
    case 10: return [3, 5, 7];
    case 11: return [4, 6, 7];
    case 12: return [4, 6, 8];
    case 13: return [4, 7, 9]; // Interpolated
    case 14: return [5, 7, 9];
    case 15: return [5, 8, 10];
    default: 
      // For RMs outside the defined range, use a reasonable default
      if (liftRM < 4) return [1, 2, 3];
      return [5, 8, 10];
  }
}

/**
 * Calculates the suggested sets and reps for a given total rep count (NL)
 * using the athlete's rep ladder
 * 
 * For Medium and Light intensities, distributes remaining reps across previous sets
 * to keep all reps within the ladder range
 */
export function assignReps(liftRM: number, nl: number, intensity: 'H' | 'M' | 'L' = 'H'): number[] {
  const repLadder = assignLadder(liftRM);
  const sessionReps: number[] = [];
  let remaining = nl;

  // Use the rep ladder to build sets
  while (remaining >= repLadder[0]) {
    for (const reps of repLadder) {
      if (remaining >= reps) {
        sessionReps.push(reps);
        remaining -= reps;
      }
    }
  }

  // Handle remaining reps
  if (remaining > 0) {
    if (intensity === 'H') {
      // For Heavy: just add remaining reps as a final set
      sessionReps.push(remaining);
    } else {
      // For Medium and Light: distribute remaining reps across previous sets
      // to keep all reps within the ladder range [min, max]
      const minReps = repLadder[0];
      const maxReps = repLadder[repLadder.length - 1];
      
      // Try to distribute remaining reps by adding to existing sets
      let i = sessionReps.length - 1;
      while (remaining > 0 && i >= 0) {
        const currentReps = sessionReps[i];
        const canAdd = maxReps - currentReps;
        
        if (canAdd > 0) {
          const toAdd = Math.min(canAdd, remaining);
          sessionReps[i] += toAdd;
          remaining -= toAdd;
        }
        i--;
      }
      
      // If still have remaining reps (shouldn't happen often), add as final set
      if (remaining > 0) {
        sessionReps.push(remaining);
      }
    }
  }

  return sessionReps;
}

/**
 * Formats the rep scheme as a readable string
 * Example: [5, 5, 5, 3, 2] => "5 sets: 5, 5, 5, 3, 2"
 */
export function formatRepScheme(reps: number[]): string {
  if (reps.length === 0) return '';
  return `${reps.length} ${reps.length === 1 ? 'set' : 'sets'}: ${reps.join(', ')}`;
}
