import { UserProfile, Phase, WeighIn, AppState } from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'weightloss_user_profile',
  PHASES: 'weightloss_phases',
  WEIGH_INS: 'weightloss_weigh_ins',
  APP_STATE: 'weightloss_app_state',
};

// Date serialization helpers
function dateReplacer(_key: string, value: unknown): unknown {
  if (value instanceof Date) {
    return { __type: 'Date', value: value.toISOString() };
  }
  return value;
}

function dateReviver(_key: string, value: unknown): unknown {
  if (value && typeof value === 'object' && '__type' in value && (value as { __type: string }).__type === 'Date') {
    return new Date((value as unknown as { value: string }).value);
  }
  return value;
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile, dateReplacer));
}

export function getUserProfile(): UserProfile | null {
  const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  if (!data) return null;
  return JSON.parse(data, dateReviver);
}

export function savePhases(phases: Phase[]): void {
  localStorage.setItem(STORAGE_KEYS.PHASES, JSON.stringify(phases, dateReplacer));
}

export function getPhases(): Phase[] | null {
  const data = localStorage.getItem(STORAGE_KEYS.PHASES);
  if (!data) return null;
  return JSON.parse(data, dateReviver);
}

export function saveWeighIns(weighIns: WeighIn[]): void {
  localStorage.setItem(STORAGE_KEYS.WEIGH_INS, JSON.stringify(weighIns, dateReplacer));
}

export function getWeighIns(): WeighIn[] | null {
  const data = localStorage.getItem(STORAGE_KEYS.WEIGH_INS);
  if (!data) return null;
  return JSON.parse(data, dateReviver);
}

export function saveAppState(state: AppState): void {
  localStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify(state, dateReplacer));
}

export function getAppState(): AppState | null {
  const data = localStorage.getItem(STORAGE_KEYS.APP_STATE);
  if (!data) return null;
  return JSON.parse(data, dateReviver);
}

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}
