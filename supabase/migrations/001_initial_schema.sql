-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_week INTEGER DEFAULT 1 CHECK (current_week >= 1 AND current_week <= 8),
  program_start_date DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout logs table
CREATE TABLE IF NOT EXISTS workout_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  workout_day_id INTEGER NOT NULL,
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 8),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercise logs table (individual set tracking)
CREATE TABLE IF NOT EXISTS exercise_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_log_id UUID REFERENCES workout_logs ON DELETE CASCADE NOT NULL,
  exercise_id TEXT NOT NULL,
  exercise_name TEXT NOT NULL,
  set_number INTEGER NOT NULL CHECK (set_number > 0),
  reps INTEGER CHECK (reps > 0),
  weight DECIMAL(6,2) CHECK (weight >= 0),
  rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10),
  completed BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personal records table
CREATE TABLE IF NOT EXISTS personal_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  exercise_id TEXT NOT NULL,
  exercise_name TEXT NOT NULL,
  weight DECIMAL(6,2) NOT NULL CHECK (weight > 0),
  reps INTEGER NOT NULL CHECK (reps > 0),
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, exercise_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_id ON workout_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_week ON workout_logs(week_number);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_workout ON exercise_logs(workout_log_id);
CREATE INDEX IF NOT EXISTS idx_personal_records_user ON personal_records(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view own workout logs" ON workout_logs;
DROP POLICY IF EXISTS "Users can insert own workout logs" ON workout_logs;
DROP POLICY IF EXISTS "Users can update own workout logs" ON workout_logs;
DROP POLICY IF EXISTS "Users can delete own workout logs" ON workout_logs;

DROP POLICY IF EXISTS "Users can view own exercise logs" ON exercise_logs;
DROP POLICY IF EXISTS "Users can insert own exercise logs" ON exercise_logs;
DROP POLICY IF EXISTS "Users can update own exercise logs" ON exercise_logs;
DROP POLICY IF EXISTS "Users can delete own exercise logs" ON exercise_logs;

DROP POLICY IF EXISTS "Users can view own PRs" ON personal_records;
DROP POLICY IF EXISTS "Users can insert own PRs" ON personal_records;
DROP POLICY IF EXISTS "Users can update own PRs" ON personal_records;
DROP POLICY IF EXISTS "Users can delete own PRs" ON personal_records;

-- Profiles policies
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Workout logs policies
CREATE POLICY "Users can view own workout logs" 
  ON workout_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout logs" 
  ON workout_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout logs" 
  ON workout_logs FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout logs" 
  ON workout_logs FOR DELETE 
  USING (auth.uid() = user_id);

-- Exercise logs policies
CREATE POLICY "Users can view own exercise logs" 
  ON exercise_logs FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM workout_logs 
      WHERE id = exercise_logs.workout_log_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own exercise logs" 
  ON exercise_logs FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_logs 
      WHERE id = exercise_logs.workout_log_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own exercise logs" 
  ON exercise_logs FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM workout_logs 
      WHERE id = exercise_logs.workout_log_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own exercise logs" 
  ON exercise_logs FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM workout_logs 
      WHERE id = exercise_logs.workout_log_id 
      AND user_id = auth.uid()
    )
  );

-- Personal records policies
CREATE POLICY "Users can view own PRs" 
  ON personal_records FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own PRs" 
  ON personal_records FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own PRs" 
  ON personal_records FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own PRs" 
  ON personal_records FOR DELETE 
  USING (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, created_at)
  VALUES (NEW.id, NEW.email, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
