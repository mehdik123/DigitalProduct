# 8-Week Hybrid Athlete Training Program - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase

1. Create a free account at [Supabase](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key from Settings > API
4. Create a `.env` file in the project root:
```bash
cp .env.example .env
```
5. Add your Supabase credentials to `.env`

### 3. Run Database Migrations

In your Supabase project dashboard:
1. Go to SQL Editor
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and run the SQL

### 4. Start Development Server
```bash
npm run dev
```

## Features

✅ **8-Week Progressive Program** - Scientifically-based periodization with distinct training phases
✅ **Multi-User Authentication** - Email/password and Google OAuth support  
✅ **Weight Logging** - Track weights for every set with auto-save
✅ **Progress Tracking** - View previous workout data and personal records
✅ **Week-by-Week Progression** - Automatic volume and intensity adjustments
✅ **Private Data** - Row Level Security ensures users only see their own data

## Program Structure

- **Weeks 1-2**: Anatomical Adaptation (Build base, perfect form)
- **Weeks 3-4**: Hypertrophy Focus (Maximum muscle growth)
- **Weeks 5-6**: Strength & Power (Heavy loads, explosive movements)
- **Week 7**: Deload (Recovery and supercompensation)
- **Week 8**: Peak Performance (Test maximum capabilities)

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## Database Schema

- `profiles` - User profiles with current week tracking
- `workout_logs` - Workout session records
- `exercise_logs` - Individual set tracking with weights and RPE
- `personal_records` - Automatic PR tracking per exercise

## Environment Variables

Required in `.env`:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Development

```bash
# Type checking
npm run typecheck

# Build for production
npm run build

# Preview production build
npm run preview
```

## Next Steps

1. Set up your Supabase project
2. Run the database migration
3. Configure Google OAuth (optional) in Supabase Auth settings
4. Start the dev server and create an account
5. Begin your 8-week journey! 💪
