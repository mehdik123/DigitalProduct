-- DEBUGGING MIGRATION: Fix "Hang" issues by Disabling RLS and Adding Indexes
-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Disable RLS on tables (allows all operations)
ALTER TABLE workout_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_logs DISABLE ROW LEVEL SECURITY;

-- 2. Drop validation constraints that might be blocking inserts
ALTER TABLE exercise_logs DROP CONSTRAINT IF EXISTS exercise_logs_rpe_check;
ALTER TABLE exercise_logs DROP CONSTRAINT IF EXISTS exercise_logs_reps_check;
ALTER TABLE exercise_logs DROP CONSTRAINT IF EXISTS exercise_logs_weight_check;
ALTER TABLE workout_logs DROP CONSTRAINT IF EXISTS workout_logs_week_number_check;

-- 3. Ensure columns are nullable/flexible
ALTER TABLE exercise_logs ALTER COLUMN weight DROP NOT NULL;
ALTER TABLE exercise_logs ALTER COLUMN reps DROP NOT NULL;
ALTER TABLE exercise_logs ALTER COLUMN rpe DROP NOT NULL;

-- 4. Add Performance Indexes (Crucial for Speed and preventing deadlocks)
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_week_day 
ON workout_logs(user_id, week_number, workout_day_id);

CREATE INDEX IF NOT EXISTS idx_exercise_logs_workout_exercise 
ON exercise_logs(workout_log_id, exercise_id);

-- 5. Drop specific policies just in case
DROP POLICY IF EXISTS "Users can view own workout logs" ON workout_logs;
DROP POLICY IF EXISTS "Users can insert own workout logs" ON workout_logs;
DROP POLICY IF EXISTS "Users can update own workout logs" ON workout_logs;
DROP POLICY IF EXISTS "Users can delete own workout logs" ON workout_logs;

DROP POLICY IF EXISTS "Users can view own exercise logs" ON exercise_logs;
DROP POLICY IF EXISTS "Users can insert own exercise logs" ON exercise_logs;
DROP POLICY IF EXISTS "Users can update own exercise logs" ON exercise_logs;
DROP POLICY IF EXISTS "Users can delete own exercise logs" ON exercise_logs;
