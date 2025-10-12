export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'coach' | 'athlete';
  athlete_id?: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  role: 'coach' | 'athlete';
}

export interface Program {
  id: string;
  name?: string;
  athlete_id: string;
  program_type: string;
  created_by: string;
  start_date: string | null;
  status: 'draft' | 'active' | 'completed' | 'archived';
  created_at: string;
  config?: ProgramConfig;
  weeks?: ProgramWeek[];
}

export interface ProgramConfig {
  id: string;
  program_id: string;
  num_lifts: number;
  lift_rms: Record<string, number>;
  lift_weights?: Record<string, Record<string, number | string>>;
  lift_intensity_rms?: Record<string, Record<string, number>>;
  lift_names?: Record<string, string>;
  weekly_template: any;
  created_at: string;
}

export interface ProgramWeek {
  id: string;
  program_id: string;
  week_number: number;
  dice_roll_1?: number;  // Deprecated
  dice_roll_2?: number;  // Deprecated
  dice_rolls?: Record<string, number[]>;  // {"lift_name": [roll1, roll2], ...}
  weekly_data: Record<string, Record<string, number>>;
  created_at: string;
}

