import { ExerciseSet } from '../types/workout';
import { TOTAL_WEEKS } from '../data/programConfig';

export type WeekStatus = 'locked' | 'active' | 'completed';

export interface ProgramState {
  currentWeek: number;
  weeks: Record<number, WeekStatus>;
}

export interface SaveExerciseParams {
  weekNumber: number;
  workoutDayId: number;
  exerciseId: string;
  sets: ExerciseSet[];
}

export interface BaselineLift {
  exerciseId: string;
  weight: number;
  reps: number;
}

export interface ComparisonRow {
  exerciseId: string;
  baselineWeight: number;
  baselineReps: number;
  currentWeight: number;
  currentReps: number;
}

export interface CloudSet {
  week: number;
  dayId: number;
  exerciseId: string;
  setIndex: number;
  targetReps: number | null;
  targetWeight: number | null;
  actualReps: number | null;
  actualWeight: number | null;
  completed: boolean;
}

export interface CloudProgram {
  currentWeek: number;
  daysPerWeek: number | null;
  weeks: Record<number, WeekStatus>;
  sets: CloudSet[];
}

/** Local program week map — used when cloud is unavailable / disabled. */
export function defaultProgramState(currentWeek = 1): ProgramState {
  const week = Math.min(TOTAL_WEEKS, Math.max(1, currentWeek));
  const weeks: Record<number, WeekStatus> = {};
  for (let w = 1; w <= TOTAL_WEEKS; w++) {
    if (w < week) weeks[w] = 'completed';
    else if (w === week) weeks[w] = 'active';
    else weeks[w] = 'locked';
  }
  return { currentWeek: week, weeks };
}

/** No cloud program engine — progress lives in localProgram. */
export async function ensureProgramStarted(_userId: string): Promise<ProgramState> {
  return defaultProgramState(1);
}

export async function getProgramState(_userId: string): Promise<ProgramState> {
  return defaultProgramState(1);
}

export async function fetchCloudProgram(_userId: string): Promise<CloudProgram | null> {
  return null;
}

export async function pushProgramToCloud(
  _userId: string,
  _sets: CloudSet[],
  _currentWeek: number,
  _weeks: Record<number, WeekStatus>
): Promise<boolean> {
  return false;
}

export async function loadWorkoutSets(
  _userId: string,
  _weekNumber: number,
  _workoutDayId: number
): Promise<Map<string, ExerciseSet[]>> {
  return new Map();
}

export async function loadPreviousWeekSets(
  _userId: string,
  _weekNumber: number,
  _exerciseId: string
): Promise<Map<number, { reps: number; weight: number }>> {
  return new Map();
}

export async function getCompletedSetCount(_userId: string, _week: number): Promise<number> {
  return 0;
}

export async function saveExerciseSets(
  _params: SaveExerciseParams & { calisthenics?: boolean }
): Promise<{ success: boolean; error?: string }> {
  return { success: false, error: 'Cloud logging disabled. Sets save on this device only.' };
}

export async function completeWeek(
  _weekNumber: number
): Promise<{ success: boolean; unlockedWeek?: number; final?: boolean; reason?: string; error?: string }> {
  return { success: false, error: 'Cloud week completion disabled.' };
}

export async function submitBaseline(
  _lifts: BaselineLift[]
): Promise<{ success: boolean; error?: string }> {
  return { success: false, error: 'Baseline cloud save disabled. Start training directly.' };
}

export async function getComparison(
  _userId: string,
  keyLiftIds: string[]
): Promise<ComparisonRow[]> {
  return keyLiftIds.map((id) => ({
    exerciseId: id,
    baselineWeight: 0,
    baselineReps: 0,
    currentWeight: 0,
    currentReps: 0,
  }));
}
