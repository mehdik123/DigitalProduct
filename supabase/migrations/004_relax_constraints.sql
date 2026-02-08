-- Relax constraints on exercise_logs to allow 0 reps (failed set) and 0 weight
-- First, drop the existing constraints if they exist
ALTER TABLE exercise_logs 
DROP CONSTRAINT IF EXISTS exercise_logs_reps_check,
DROP CONSTRAINT IF EXISTS exercise_logs_weight_check;

-- Optionally re-add them with relaxed rules if needed, or just leave them unconstrained.
-- Here we just ensure they are non-negative, allowing 0.
ALTER TABLE exercise_logs
ADD CONSTRAINT exercise_logs_reps_check CHECK (reps >= 0),
ADD CONSTRAINT exercise_logs_weight_check CHECK (weight >= 0);
