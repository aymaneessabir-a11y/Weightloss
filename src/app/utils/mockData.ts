import { UserProfile, Phase, WeighIn, AppState } from '../types';
import { getNextSunday, calculateBodyFatPct, calculateComposition } from './calculations';

export function createDefaultUserProfile(): UserProfile {
  return {
    id: 'user-1',
    age: 25,
    height_cm: 180,
    starting_weight_kg: 114,
    starting_body_fat_pct: 34,
    goal_body_fat_pct: 15,
    lean_mass_kg: 75.24,
    created_at: new Date(),
    assumptions_last_updated: new Date(),
  };
}

export function createDefaultPhases(): Phase[] {
  return [
    {
      id: 1,
      name: 'Foundation',
      start_bf_pct: 34,
      end_bf_pct: 25,
      target_weight_kg: 100,
      weekly_loss_min_kg: 0.5,
      weekly_loss_max_kg: 1.0,
      estimated_duration_weeks_min: 14,
      estimated_duration_weeks_max: 28,
      is_unlocked: true,
    },
    {
      id: 2,
      name: 'Refinement',
      start_bf_pct: 25,
      end_bf_pct: 20,
      target_weight_kg: 94,
      weekly_loss_min_kg: 0.5,
      weekly_loss_max_kg: 0.75,
      estimated_duration_weeks_min: 10,
      estimated_duration_weeks_max: 14,
      is_unlocked: false,
    },
    {
      id: 3,
      name: 'Precision',
      start_bf_pct: 20,
      end_bf_pct: 15,
      target_weight_kg: 88,
      weekly_loss_min_kg: 0.5,
      weekly_loss_max_kg: 1.0,
      estimated_duration_weeks_min: 10,
      estimated_duration_weeks_max: 16,
      is_unlocked: false,
    },
  ];
}

export function createDefaultAppState(): AppState {
  return {
    current_phase: 1,
    current_weight_kg: 114,
    plateau_mode: false,
    trend_view_weeks: 4,
    next_weigh_in_date: getNextSunday(),
    photo_reminders_enabled: true,
    has_completed_onboarding: false,
  };
}

/**
 * Generate AI insight based on weigh-in data (mock version)
 */
export function generateMockInsight(
  weekly_delta: number,
  four_week_trend: number,
  phase: Phase,
  current_weight: number
): string {
  const remaining = current_weight - phase.target_weight_kg;
  
  // On track
  if (weekly_delta <= -phase.weekly_loss_min_kg && weekly_delta >= -phase.weekly_loss_max_kg) {
    return `You lost ${Math.abs(weekly_delta).toFixed(1)} kg this week, which is right in the expected range for Phase ${phase.id}. Your 4-week trend shows consistent progress with ${Math.abs(four_week_trend).toFixed(1)} kg lost overall. Keep doing what you're doing.`;
  }
  
  // Faster than expected
  if (weekly_delta < -phase.weekly_loss_max_kg) {
    return `You lost ${Math.abs(weekly_delta).toFixed(1)} kg this week, which is above the typical range. This might include water weight. Let's see how next week goes while maintaining your 4-week downward trend of ${Math.abs(four_week_trend).toFixed(1)} kg.`;
  }
  
  // Gain week
  if (weekly_delta > 0) {
    return `Your weight increased by ${weekly_delta.toFixed(1)} kg this week. Weekly fluctuations are normal—your 4-week trend is still downward (${Math.abs(four_week_trend).toFixed(1)} kg lost). Stay consistent.`;
  }
  
  // Stall week
  if (Math.abs(weekly_delta) < 0.1) {
    const phaseMessage = phase.id === 3 
      ? 'In Phase 3, progress often slows. Your body is adjusting.' 
      : 'Weight can stabilize for a week.';
    return `No significant change this week. ${phaseMessage} Your 4-week trend shows ${Math.abs(four_week_trend).toFixed(1)} kg lost. Consistency wins.`;
  }
  
  // Slow progress
  return `You lost ${Math.abs(weekly_delta).toFixed(1)} kg this week. Progress is happening. Your 4-week trend confirms steady movement with ${Math.abs(four_week_trend).toFixed(1)} kg total loss. ${remaining.toFixed(1)} kg to go in this phase.`;
}

/**
 * Create sample weigh-in data for demonstration
 */
export function createSampleWeighIns(userProfile: UserProfile): WeighIn[] {
  const samples: WeighIn[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (8 * 7)); // 8 weeks ago
  
  // Week 1
  samples.push({
    id: 'sample-1',
    date: new Date(startDate),
    weight_kg: 114,
    phase_id: 1,
    weekly_delta_kg: 0,
    four_week_avg_kg: 114,
    estimated_bf_pct: 34,
    estimated_fat_mass_kg: 38.76,
    notes: '',
    ai_insight: 'Starting your transformation journey at 114 kg. This is your baseline. Consistency from here forward is what matters.',
    is_edited: false,
    created_at: new Date(startDate),
  });

  // Week 2
  const week2Date = new Date(startDate);
  week2Date.setDate(week2Date.getDate() + 7);
  samples.push({
    id: 'sample-2',
    date: week2Date,
    weight_kg: 113.2,
    phase_id: 1,
    weekly_delta_kg: -0.8,
    four_week_avg_kg: 113.6,
    estimated_bf_pct: calculateBodyFatPct(113.2, userProfile.height_cm, userProfile.age),
    estimated_fat_mass_kg: calculateComposition(113.2, calculateBodyFatPct(113.2, userProfile.height_cm, userProfile.age)).fat_mass_kg,
    notes: '',
    ai_insight: 'You lost 0.8 kg this week, which is right in the expected range for Phase 1. Great start. Keep the momentum going.',
    is_edited: false,
    created_at: week2Date,
  });

  // Week 3
  const week3Date = new Date(week2Date);
  week3Date.setDate(week3Date.getDate() + 7);
  samples.push({
    id: 'sample-3',
    date: week3Date,
    weight_kg: 112.5,
    phase_id: 1,
    weekly_delta_kg: -0.7,
    four_week_avg_kg: 113.2,
    estimated_bf_pct: calculateBodyFatPct(112.5, userProfile.height_cm, userProfile.age),
    estimated_fat_mass_kg: calculateComposition(112.5, calculateBodyFatPct(112.5, userProfile.height_cm, userProfile.age)).fat_mass_kg,
    notes: '',
    ai_insight: 'You lost 0.7 kg this week. Your trend is consistent and sustainable. This is exactly the pace we want to see.',
    is_edited: false,
    created_at: week3Date,
  });

  // Week 4
  const week4Date = new Date(week3Date);
  week4Date.setDate(week4Date.getDate() + 7);
  samples.push({
    id: 'sample-4',
    date: week4Date,
    weight_kg: 112.1,
    phase_id: 1,
    weekly_delta_kg: -0.4,
    four_week_avg_kg: 113.0,
    estimated_bf_pct: calculateBodyFatPct(112.1, userProfile.height_cm, userProfile.age),
    estimated_fat_mass_kg: calculateComposition(112.1, calculateBodyFatPct(112.1, userProfile.height_cm, userProfile.age)).fat_mass_kg,
    notes: 'Less sleep this week',
    ai_insight: 'You lost 0.4 kg this week. Slower than usual, but still progress. Your 4-week average shows 1.9 kg lost total. Stay the course.',
    is_edited: false,
    created_at: week4Date,
  });

  // Week 5
  const week5Date = new Date(week4Date);
  week5Date.setDate(week5Date.getDate() + 7);
  samples.push({
    id: 'sample-5',
    date: week5Date,
    weight_kg: 111.8,
    phase_id: 1,
    weekly_delta_kg: -0.3,
    four_week_avg_kg: 112.4,
    estimated_bf_pct: calculateBodyFatPct(111.8, userProfile.height_cm, userProfile.age),
    estimated_fat_mass_kg: calculateComposition(111.8, calculateBodyFatPct(111.8, userProfile.height_cm, userProfile.age)).fat_mass_kg,
    notes: '',
    ai_insight: 'You lost 0.3 kg this week. Your 4-week trend shows 1.4 kg lost. Progress continues even when individual weeks vary.',
    is_edited: false,
    created_at: week5Date,
  });

  // Week 6
  const week6Date = new Date(week5Date);
  week6Date.setDate(week6Date.getDate() + 7);
  samples.push({
    id: 'sample-6',
    date: week6Date,
    weight_kg: 111.1,
    phase_id: 1,
    weekly_delta_kg: -0.7,
    four_week_avg_kg: 111.9,
    estimated_bf_pct: calculateBodyFatPct(111.1, userProfile.height_cm, userProfile.age),
    estimated_fat_mass_kg: calculateComposition(111.1, calculateBodyFatPct(111.1, userProfile.height_cm, userProfile.age)).fat_mass_kg,
    notes: '',
    ai_insight: 'You lost 0.7 kg this week. Back on track. Your 4-week trend shows 1.0 kg lost. Consistency is showing up.',
    is_edited: false,
    created_at: week6Date,
  });

  // Week 7
  const week7Date = new Date(week6Date);
  week7Date.setDate(week7Date.getDate() + 7);
  samples.push({
    id: 'sample-7',
    date: week7Date,
    weight_kg: 111.3,
    phase_id: 1,
    weekly_delta_kg: 0.2,
    four_week_avg_kg: 111.6,
    estimated_bf_pct: calculateBodyFatPct(111.3, userProfile.height_cm, userProfile.age),
    estimated_fat_mass_kg: calculateComposition(111.3, calculateBodyFatPct(111.3, userProfile.height_cm, userProfile.age)).fat_mass_kg,
    notes: 'Weekend event',
    ai_insight: 'Your weight increased by 0.2 kg this week. Weekly fluctuations are normal—your 4-week trend is still downward (0.5 kg lost). Stay consistent.',
    is_edited: false,
    created_at: week7Date,
  });

  // Week 8
  const week8Date = new Date(week7Date);
  week8Date.setDate(week8Date.getDate() + 7);
  samples.push({
    id: 'sample-8',
    date: week8Date,
    weight_kg: 110.5,
    phase_id: 1,
    weekly_delta_kg: -0.8,
    four_week_avg_kg: 111.2,
    estimated_bf_pct: calculateBodyFatPct(110.5, userProfile.height_cm, userProfile.age),
    estimated_fat_mass_kg: calculateComposition(110.5, calculateBodyFatPct(110.5, userProfile.height_cm, userProfile.age)).fat_mass_kg,
    notes: '',
    ai_insight: 'You lost 0.8 kg this week. Your 4-week trend shows consistent progress with 0.6 kg lost overall. You\'re 3.5 kg down from your starting weight. Keep doing what you\'re doing.',
    is_edited: false,
    created_at: week8Date,
  });

  return samples;
}