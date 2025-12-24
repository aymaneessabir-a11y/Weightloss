export interface UserProfile {
  id: string;
  age: number;
  height_cm: number;
  starting_weight_kg: number;
  starting_body_fat_pct: number;
  goal_body_fat_pct: number;
  lean_mass_kg: number;
  created_at: Date;
  assumptions_last_updated: Date;
}

export interface Phase {
  id: 1 | 2 | 3;
  name: string;
  start_bf_pct: number;
  end_bf_pct: number;
  target_weight_kg: number;
  weekly_loss_min_kg: number;
  weekly_loss_max_kg: number;
  estimated_duration_weeks_min: number;
  estimated_duration_weeks_max: number;
  is_unlocked: boolean;
  completed_at?: Date;
}

export interface WeighIn {
  id: string;
  date: Date;
  weight_kg: number;
  phase_id: 1 | 2 | 3;
  weekly_delta_kg: number;
  four_week_avg_kg: number;
  estimated_bf_pct: number;
  estimated_fat_mass_kg: number;
  notes: string;
  ai_insight: string;
  photo_path?: string;
  is_edited: boolean;
  edited_at?: Date;
  created_at: Date;
}

export interface ProgressPhoto {
  id: string;
  weigh_in_id: string;
  photo_path: string;
  week_number: number;
  phase_id: 1 | 2 | 3;
  weight_at_photo_kg: number;
  created_at: Date;
  is_synced_to_cloud: boolean;
}

export interface AppState {
  current_phase: 1 | 2 | 3;
  current_weight_kg: number;
  plateau_mode: boolean;
  plateau_detected_at?: Date;
  trend_view_weeks: 4 | 6 | 8 | 12;
  last_weigh_in_date?: Date;
  next_weigh_in_date: Date;
  photo_reminders_enabled: boolean;
  has_completed_onboarding: boolean;
}

export type View = 'onboarding' | 'dashboard' | 'weigh-in' | 'history' | 'photos' | 'settings';
