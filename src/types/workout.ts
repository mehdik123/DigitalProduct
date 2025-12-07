export interface Exercise {
  id: string;
  name: string;
  type: 'calisthenics' | 'bodybuilding';
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
  videoUrl?: string;
}

export interface WorkoutDay {
  id: number;
  name: string;
  description: string;
  focus: string;
  difficulty: 'Intermediate' | 'Advanced';
  duration: string;
  exercises: Exercise[];
  color: string;
  icon: string;
  backgroundImage?: string;
}

export interface WorkoutProgress {
  dayId: number;
  completed: boolean;
  completedAt?: Date;
  exercisesCompleted: string[];
}

// New types for 8-week program

export type TrainingPhase =
  | 'Anatomical Adaptation'
  | 'Hypertrophy Focus'
  | 'Strength & Power'
  | 'Deload'
  | 'Peak Performance';

export interface WeeklyProgression {
  weekNumber: number;
  phase: TrainingPhase;
  volumeMultiplier: number; // Multiplier for sets (e.g., 1.0 = baseline, 1.25 = +25% sets)
  intensityTarget: number; // Target percentage of 1RM (65-95%)
  rpeRange: [number, number]; // RPE range [min, max]
  restMultiplier: number; // Multiplier for rest periods
  description: string;
  goals: string[];
}

export interface ProgressionRules {
  weeklyLoadIncrease: number; // Percentage increase per week (2.5-5%)
  volumeLandmark: number; // Max volume increase per week (10-20%)
  deloadVolumeReduction: number; // Volume reduction for deload (40-60%)
  deloadIntensityReduction: number; // Intensity reduction for deload (30-40%)
}

export interface ProgramWeek {
  weekNumber: number;
  progression: WeeklyProgression;
  workouts: WorkoutDay[];
}

// User authentication and profile types

export interface UserProfile {
  id: string;
  email?: string;
  username?: string;
  createdAt: Date;
  currentWeek: number;
  programStartDate: Date;
}

export interface AuthUser {
  id: string;
  email?: string;
}

// Workout logging types

export interface ExerciseSet {
  setNumber: number;
  reps: number;
  weight: number; // in lbs or kg
  rpe?: number; // Rate of Perceived Exertion (1-10)
  completed: boolean;
}

export interface ExerciseLog {
  id?: string;
  workoutLogId: string;
  exerciseId: string;
  exerciseName: string;
  sets: ExerciseSet[];
  notes?: string;
}

export interface WorkoutLog {
  id?: string;
  userId: string;
  workoutDayId: number;
  weekNumber: number;
  completedAt: Date;
  exercises: ExerciseLog[];
  notes?: string;
}

export interface PersonalRecord {
  id?: string;
  userId: string;
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  achievedAt: Date;
}

// Previous workout data for comparison
export interface PreviousWorkoutData {
  exerciseId: string;
  sets: ExerciseSet[];
  completedAt: Date;
}
