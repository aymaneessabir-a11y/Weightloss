import { WeighIn, Phase } from '../types';

/**
 * Calculate body fat percentage using BMI-based estimation
 * (Navy method requires waist/neck measurements which we don't have)
 */
export function calculateBodyFatPct(weight_kg: number, height_cm: number, age: number): number {
  const bmi = (weight_kg / Math.pow(height_cm / 100, 2));
  const bf_pct = (1.20 * bmi) + (0.23 * age) - 16.2;
  return Math.max(0, Math.min(100, bf_pct));
}

/**
 * Calculate fat mass and lean mass
 */
export function calculateComposition(weight_kg: number, body_fat_pct: number) {
  const fat_mass_kg = weight_kg * (body_fat_pct / 100);
  const lean_mass_kg = weight_kg - fat_mass_kg;
  return { fat_mass_kg, lean_mass_kg };
}

/**
 * Calculate weekly delta (weight change from previous week)
 */
export function calculateWeeklyDelta(current_weight: number, last_weight: number | null): number {
  if (last_weight === null) return 0;
  return current_weight - last_weight;
}

/**
 * Calculate rolling average over N weeks
 */
export function calculateRollingAverage(weighIns: WeighIn[], weeks: number = 4): number {
  if (weighIns.length === 0) return 0;
  const recent = weighIns.slice(-weeks);
  const sum = recent.reduce((acc, w) => acc + w.weight_kg, 0);
  return sum / recent.length;
}

/**
 * Calculate trend (average loss per week over last N entries)
 */
export function calculateTrend(weighIns: WeighIn[], weeks: number = 4): number {
  if (weighIns.length < 2) return 0;

  const recent = weighIns.slice(-weeks);
  if (recent.length < 2) return 0;

  const firstWeight = recent[0].weight_kg;
  const lastWeight = recent[recent.length - 1].weight_kg;
  const totalLoss = firstWeight - lastWeight;
  const weeksSpan = recent.length - 1;

  return weeksSpan > 0 ? totalLoss / weeksSpan : 0;
}

/**
 * Detect plateau (no progress over threshold weeks)
 */
export function detectPlateau(weighIns: WeighIn[], threshold_weeks: number = 3): boolean {
  if (weighIns.length < threshold_weeks) return false;

  const recent = weighIns.slice(-threshold_weeks);
  const weights = recent.map(w => w.weight_kg);

  // Check variance
  const variance = Math.max(...weights) - Math.min(...weights);
  if (variance < 0.3) return true;

  // Check if trend is flat or upward
  const firstAvg = (weights[0] + (weights[1] || weights[0])) / 2;
  const lastAvg = (weights[weights.length - 2] + weights[weights.length - 1]) / 2;

  if (lastAvg >= firstAvg) return true;

  return false;
}

/**
 * Calculate projected completion dates for a phase
 */
export function calculateProjection(
  current_weight: number,
  target_weight: number,
  phase: Phase,
  weighIns: WeighIn[]
): { weeks_min: number; weeks_max: number; completion_date_min: Date; completion_date_max: Date } {
  const remaining_kg = current_weight - target_weight;

  // If already at or past target
  if (remaining_kg <= 0) {
    const today = new Date();
    return {
      weeks_min: 0,
      weeks_max: 0,
      completion_date_min: today,
      completion_date_max: today
    };
  }

  // Get recent trend
  const avg_loss_per_week = calculateTrend(weighIns, 4);

  let weeks_min: number;
  let weeks_max: number;

  if (avg_loss_per_week > 0.1) {
    // Use trend-based projection
    weeks_min = remaining_kg / phase.weekly_loss_max_kg;
    weeks_max = remaining_kg / phase.weekly_loss_min_kg;
  } else {
    // No progress yet, use phase defaults
    weeks_min = phase.estimated_duration_weeks_min;
    weeks_max = phase.estimated_duration_weeks_max;
  }

  const today = new Date();
  const completion_date_min = new Date(today);
  completion_date_min.setDate(today.getDate() + (weeks_min * 7));

  const completion_date_max = new Date(today);
  completion_date_max.setDate(today.getDate() + (weeks_max * 7));

  return {
    weeks_min: Math.ceil(weeks_min),
    weeks_max: Math.ceil(weeks_max),
    completion_date_min,
    completion_date_max
  };
}

/**
 * Get next Sunday from a given date
 */
export function getNextSunday(from: Date = new Date()): Date {
  const date = new Date(from);
  const day = date.getDay();
  const daysUntilSunday = day === 0 ? 7 : 7 - day;
  date.setDate(date.getDate() + daysUntilSunday);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Check if a date is a Sunday
 */
export function isSunday(date: Date): boolean {
  return date.getDay() === 0;
}

/**
 * Format date range
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const start = startDate.toLocaleDateString('en-US', options);
  const end = endDate.toLocaleDateString('en-US', { ...options, year: 'numeric' });
  return `${start} – ${end}`;
}

/**
 * Calculate expected trajectory (linear projection)
 */
export function calculateExpectedTrajectory(
  startWeight: number,
  targetWeight: number,
  totalWeeks: number,
  currentWeek: number
): number {
  const totalLoss = startWeight - targetWeight;
  const lossPerWeek = totalLoss / totalWeeks;
  return startWeight - (lossPerWeek * currentWeek);
}

/**
 * Calculate progress percentage in current phase
 */
export function calculatePhaseProgress(
  currentWeight: number,
  phaseStartWeight: number,
  phaseTargetWeight: number
): number {
  const totalLoss = phaseStartWeight - phaseTargetWeight;
  const currentLoss = phaseStartWeight - currentWeight;
  const progress = (currentLoss / totalLoss) * 100;
  return Math.max(0, Math.min(100, progress));
}
