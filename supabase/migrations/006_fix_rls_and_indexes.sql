-- 1. Ensure RLS is disabled (Explicitly)
ALTER TABLE workout_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_logs DISABLE ROW LEVEL SECURITY;

-- 2. Drop ALL specific policies to prevent interference
DROP POLICY IF EXISTS "Users can view own workout logs" ON workout_logs;
DROP POLICY IF EXISTS "Users can insert own workout logs" ON workout_logs;
DROP POLICY IF EXISTS "Users can update own workout logs" ON workout_logs;
DROP POLICY IF EXISTS "Users can delete own workout logs" ON workout_logs;

DROP POLICY IF EXISTS "Users can view own exercise logs" ON exercise_logs;
DROP POLICY IF EXISTS "Users can insert own exercise logs" ON exercise_logs;
DROP POLICY IF EXISTS "Users can update own exercise logs" ON exercise_logs;
DROP POLICY IF EXISTS "Users can delete own exercise logs" ON exercise_logs;

-- 3. Add Performance Indexes (Crucial for Speed)
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_week_day 
ON workout_logs(user_id, week_number, workout_day_id);

CREATE INDEX IF NOT EXISTS idx_exercise_logs_workout_exercise 
ON exercise_logs(workout_log_id, exercise_id);
