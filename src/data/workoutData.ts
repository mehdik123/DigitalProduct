import { WorkoutDay } from '../types/workout';

export type DaysPerWeek = 3 | 4 | 5;

/** Days-per-week options currently available for selection at signup. */
export const AVAILABLE_DAYS_PER_WEEK: DaysPerWeek[] = [5];

/** The 5-day split (currently the only finished program). */
export const fiveDaySplit: WorkoutDay[] = [
  {
    id: 1,
    name: 'Upper Body 1',
    description: 'Upper body push focus with chest and triceps emphasis',
    focus: 'Push',
    difficulty: 'Intermediate',
    duration: '75-90 min',
    icon: 'Dumbbell',
    color: 'from-blue-500 to-cyan-500',
    backgroundImage: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80',
    exercises: [
      {
        id: 'incline-barbell-bench-smith',
        name: 'Incline Barbell Bench Press (Smith Machine)',
        progressionType: 'barbell_upper',
        sets: 3,
        reps: '8',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'Compound movement - focus on controlled tempo and full range of motion',
        videoUrl: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
        imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80'
      },
      {
        id: 'dips',
        name: 'Dips',
        progressionType: 'calisthenics',
        sets: 3,
        reps: '6',
        rest: '3 min',
        type: 'calisthenics',
        notes: 'Lean forward for chest emphasis, keep elbows at 45 degrees',
        videoUrl: 'https://www.youtube.com/watch?v=2z8Ddsql-vE',
        imageUrl: 'https://images.unsplash.com/photo-1598971639058-211a74a5a6b7?w=800&q=80'
      },
      {
        id: 'standing-db-lateral-raises',
        name: 'Standing Dumbbell Lateral Raises',
        progressionType: 'isolation',
        sets: 3,
        reps: '12',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Isolation - keep slight bend in elbows, raise to shoulder height',
        videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'
      },
      {
        id: 'pike-push-ups',
        name: 'Pike Push Ups',
        progressionType: 'calisthenics',
        sets: 3,
        reps: '14',
        rest: '2 min',
        type: 'calisthenics',
        notes: 'Shoulder focus - keep hips high, head between arms',
        videoUrl: 'https://www.youtube.com/watch?v=sposDXIE0lM',
        imageUrl: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&q=80'
      },
      {
        id: 'wide-grip-lat-pulldowns',
        name: 'Wide Grip Lat Pulldowns',
        progressionType: 'machine',
        sets: 3,
        reps: '10',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'Pull to upper chest, squeeze shoulder blades together',
        videoUrl: 'https://www.youtube.com/watch?v=AO9L75rGbf0',
        imageUrl: 'https://images.unsplash.com/photo-1598532163257-5264875b0f4a?w=800&q=80'
      },
      {
        id: 'barbell-bent-over-rows',
        name: 'Barbell Bent Over Rows',
        progressionType: 'barbell_upper',
        sets: 3,
        reps: '10',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'Compound - maintain flat back, pull to lower chest',
        videoUrl: 'https://www.youtube.com/watch?v=9efgcAjQe7E',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'
      },
      {
        id: 'straight-bar-bicep-curls',
        name: 'Straight Bar Bicep Curls',
        progressionType: 'isolation',
        sets: 3,
        reps: '10',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Keep elbows stationary, full range of motion',
        videoUrl: 'https://www.youtube.com/watch?v=kwG2ipFRgfo',
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80'
      },
      {
        id: 'barbell-skull-crushers',
        name: 'Barbell Skull Crushers',
        progressionType: 'isolation',
        sets: 4,
        reps: '14',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Isolation - lower to forehead, keep elbows tucked',
        videoUrl: 'https://www.youtube.com/watch?v=d_KZxkY_0cM',
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80'
      }
    ]
  },
  {
    id: 2,
    name: 'Lower Body 1',
    description: 'Complete lower body development with quad, hamstring, and calf focus',
    focus: 'Legs',
    difficulty: 'Intermediate',
    duration: '80-95 min',
    icon: 'Activity',
    color: 'from-orange-500 to-red-500',
    backgroundImage: 'https://images.unsplash.com/photo-1574680096141-1c5e8e125795?w=800&q=80',
    exercises: [
      {
        id: 'high-bar-back-squats',
        name: 'High Bar Back Squats',
        progressionType: 'barbell_compound',
        sets: 3,
        reps: '5',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'Heavy compound - go to parallel or below, keep chest up',
        videoUrl: 'https://www.youtube.com/watch?v=i7J5h7BJ07g',
        imageUrl: 'https://images.unsplash.com/photo-1574680096141-1c5e8e125795?w=800&q=80'
      },
      {
        id: 'front-squats-smith',
        name: 'Front Squats (Smith Machine)',
        progressionType: 'barbell_compound',
        sets: 3,
        reps: '10',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'Quad emphasis - keep torso upright, elbows high',
        videoUrl: 'https://www.youtube.com/watch?v=Vf8zJc2j8g4',
        imageUrl: 'https://images.unsplash.com/photo-1574680096141-1c5e8e125795?w=800&q=80'
      },
      {
        id: 'leg-press',
        name: 'Leg Press',
        progressionType: 'machine',
        sets: 3,
        reps: '12',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'Full range of motion, feet shoulder-width apart',
        videoUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
        imageUrl: 'https://images.unsplash.com/photo-1574680096141-1c5e8e125795?w=800&q=80'
      },
      {
        id: 'dumbbell-lunges',
        name: 'Dumbbell Lunges',
        progressionType: 'dumbbell',
        sets: 3,
        reps: '12',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Per leg - step forward, knee at 90 degrees',
        videoUrl: 'https://www.youtube.com/watch?v=D7KaRcUTQeE',
        imageUrl: 'https://images.unsplash.com/photo-1574680096141-1c5e8e125795?w=800&q=80'
      },
      {
        id: 'prone-leg-curls',
        name: 'Prone Leg Curls',
        progressionType: 'machine',
        sets: 3,
        reps: '14',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Isolation - squeeze at top, control the negative',
        videoUrl: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs',
        imageUrl: 'https://images.unsplash.com/photo-1574680096141-1c5e8e125795?w=800&q=80'
      },
      {
        id: 'dumbbell-rdl',
        name: 'Dumbbell Romanian Deadlifts',
        progressionType: 'dumbbell',
        sets: 3,
        reps: '10',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'Hamstring focus - slight knee bend, push hips back',
        videoUrl: 'https://www.youtube.com/watch?v=JCXUYuzwNrM',
        imageUrl: 'https://images.unsplash.com/photo-1574680096141-1c5e8e125795?w=800&q=80'
      },
      {
        id: 'calf-raises-in',
        name: 'Machine Standing Calf Raises (Toes In)',
        progressionType: 'machine',
        sets: 4,
        reps: '8, 10, 12, 14',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Progressive reps - full stretch and contraction',
        videoUrl: 'https://www.youtube.com/watch?v=-M4-G8p8fmc',
        imageUrl: 'https://images.unsplash.com/photo-1574680096141-1c5e8e125795?w=800&q=80'
      },
      {
        id: 'calf-raises-out',
        name: 'Machine Standing Calf Raises (Toes Out)',
        progressionType: 'machine',
        sets: 4,
        reps: '8, 10, 12, 14',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Progressive reps - targets different calf muscles',
        videoUrl: 'https://www.youtube.com/watch?v=-M4-G8p8fmc',
        imageUrl: 'https://images.unsplash.com/photo-1574680096141-1c5e8e125795?w=800&q=80'
      }
    ]
  },
  {
    id: 3,
    name: 'Upper Body 2',
    description: 'Shoulder development with core work',
    focus: 'Shoulders',
    difficulty: 'Intermediate',
    duration: '70-85 min',
    icon: 'Zap',
    color: 'from-purple-500 to-pink-500',
    backgroundImage: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80',
    exercises: [
      {
        id: 'flat-barbell-bench',
        name: 'Flat Barbell Bench Press',
        progressionType: 'barbell_upper',
        sets: 3,
        reps: '8',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'Compound - retract shoulder blades, bar to mid-chest',
        videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80'
      },
      {
        id: 'pull-ups',
        name: 'Pull Ups',
        progressionType: 'calisthenics',
        sets: 3,
        reps: '6',
        rest: '3 min',
        type: 'calisthenics',
        notes: 'Full range - dead hang to chin over bar',
        videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
        imageUrl: 'https://images.unsplash.com/photo-1598971639058-211a74a5a6b7?w=800&q=80'
      },
      {
        id: 'reverse-grip-bent-rows',
        name: 'Reverse Grip Bent Over Rows',
        progressionType: 'barbell_upper',
        sets: 3,
        reps: '10',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'Underhand grip - targets lower lats and biceps',
        videoUrl: 'https://www.youtube.com/watch?v=34d1-8TjEw8',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'
      },
      {
        id: 'seated-lateral-raises',
        name: 'Seated Lateral Raises',
        progressionType: 'isolation',
        sets: 3,
        reps: '14',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Isolation - prevents momentum, strict form',
        videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'
      },
      {
        id: 'db-rear-delt-kickbacks',
        name: 'Dumbbell Rear Delt Kickbacks',
        progressionType: 'isolation',
        sets: 3,
        reps: '14',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Bend forward, raise arms back and out',
        videoUrl: 'https://www.youtube.com/watch?v=ZO81bExngMI',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'
      },
      {
        id: 'chin-ups',
        name: 'Chin Ups',
        progressionType: 'calisthenics',
        sets: 3,
        reps: '10',
        rest: '3 min',
        type: 'calisthenics',
        notes: 'Underhand grip - bicep and back emphasis',
        videoUrl: 'https://www.youtube.com/watch?v=brhRXlOhsAM',
        imageUrl: 'https://images.unsplash.com/photo-1598971639058-211a74a5a6b7?w=800&q=80'
      },
      {
        id: 'overhead-cable-triceps',
        name: 'Overhead Cable Triceps Extensions',
        progressionType: 'isolation',
        sets: 4,
        reps: '12',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Keep elbows close to head, full extension',
        videoUrl: 'https://www.youtube.com/watch?v=nRiJVZDpdL0',
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80'
      },
      {
        id: 'diamond-push-ups',
        name: 'Diamond Push Ups',
        progressionType: 'calisthenics',
        sets: 4,
        reps: '14',
        rest: '2 min',
        type: 'calisthenics',
        notes: 'Hands form diamond shape - tricep emphasis',
        videoUrl: 'https://www.youtube.com/watch?v=J0DnG1_S92I',
        imageUrl: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&q=80'
      }
    ]
  },
  {
    id: 4,
    name: 'Lower Body 2',
    description: 'Lower body power and strength development',
    focus: 'Legs',
    difficulty: 'Intermediate',
    duration: '80-95 min',
    icon: 'Flame',
    color: 'from-green-500 to-emerald-500',
    backgroundImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    exercises: [
      {
        id: 'front-squats-smith-day4',
        name: 'Front Squats (Smith Machine)',
        progressionType: 'barbell_compound',
        sets: 3,
        reps: '6',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'Heavy - maintain upright torso, core tight',
        videoUrl: 'https://www.youtube.com/watch?v=Vf8zJc2j8g4',
        imageUrl: 'https://images.unsplash.com/photo-1574680096141-1c5e8e125795?w=800&q=80'
      },
      {
        id: 'machine-leg-extensions',
        name: 'Machine Leg Extensions',
        progressionType: 'machine',
        sets: 3,
        reps: '10',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Quad isolation - squeeze at top, control descent',
        videoUrl: 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
        imageUrl: 'https://images.unsplash.com/photo-1574680096141-1c5e8e125795?w=800&q=80'
      },
      {
        id: 'jump-squats',
        name: 'Jump Squats',
        progressionType: 'calisthenics',
        sets: 3,
        reps: '12',
        rest: '3 min',
        type: 'calisthenics',
        notes: 'Explosive power - land softly, full squat depth',
        videoUrl: 'https://www.youtube.com/watch?v=CVaEhXotL7M',
        imageUrl: 'https://images.unsplash.com/photo-1574680096141-1c5e8e125795?w=800&q=80'
      },
      {
        id: 'deadlifts',
        name: 'Deadlifts',
        progressionType: 'barbell_compound',
        sets: 3,
        reps: '14',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'King of compounds - neutral spine, drive through heels',
        videoUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
        imageUrl: 'https://images.unsplash.com/photo-1574680096141-1c5e8e125795?w=800&q=80'
      },
      {
        id: 'prone-leg-curls-day4',
        name: 'Prone Leg Curls',
        progressionType: 'machine',
        sets: 3,
        reps: '14',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Hamstring isolation - full contraction',
        videoUrl: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs',
        imageUrl: 'https://images.unsplash.com/photo-1574680096141-1c5e8e125795?w=800&q=80'
      },
      {
        id: 'calf-raises-in-day4',
        name: 'Machine Standing Calf Raises (Toes In)',
        progressionType: 'machine',
        sets: 4,
        reps: '8, 10, 12, 14',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Progressive reps - pause at top',
        videoUrl: 'https://www.youtube.com/watch?v=-M4-G8p8fmc',
        imageUrl: 'https://images.unsplash.com/photo-1574680096141-1c5e8e125795?w=800&q=80'
      },
      {
        id: 'calf-raises-out-day4',
        name: 'Machine Standing Calf Raises (Toes Out)',
        progressionType: 'machine',
        sets: 4,
        reps: '8, 10, 12, 14',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Progressive reps - full range of motion',
        videoUrl: 'https://www.youtube.com/watch?v=-M4-G8p8fmc',
        imageUrl: 'https://images.unsplash.com/photo-1574680096141-1c5e8e125795?w=800&q=80'
      },
      {
        id: 'adductor-machine',
        name: 'Adductor Machine',
        progressionType: 'machine',
        sets: 3,
        reps: '12',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Inner thigh - controlled movement, squeeze',
        videoUrl: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs',
        imageUrl: 'https://images.unsplash.com/photo-1574680096141-1c5e8e125795?w=800&q=80'
      }
    ]
  },
  {
    id: 5,
    name: 'Upper Body 3',
    description: 'Intense arm training with superset protocol',
    focus: 'Arms',
    difficulty: 'Intermediate',
    duration: '65-80 min',
    icon: 'Target',
    color: 'from-yellow-500 to-orange-500',
    backgroundImage: 'https://images.unsplash.com/photo-1583454157193-4e89921b7c02?w=800&q=80',
    exercises: [
      {
        id: 'incline-db-bench',
        name: 'Incline Dumbbell Bench Press',
        progressionType: 'dumbbell',
        sets: 3,
        reps: '6',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'Upper chest focus - 30-45 degree incline',
        videoUrl: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80'
      },
      {
        id: 'push-ups',
        name: 'Push Ups',
        progressionType: 'calisthenics',
        sets: 3,
        reps: '10',
        rest: '2 min',
        type: 'calisthenics',
        notes: 'Bodyweight - chest to ground, full extension',
        videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
        imageUrl: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&q=80'
      },
      {
        id: 'pull-ups-day5',
        name: 'Pull Ups',
        progressionType: 'calisthenics',
        sets: 3,
        reps: '6',
        rest: '3 min',
        type: 'calisthenics',
        notes: 'Overhand grip - full range of motion',
        videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
        imageUrl: 'https://images.unsplash.com/photo-1598971639058-211a74a5a6b7?w=800&q=80'
      },
      {
        id: 'neutral-grip-pull-ups',
        name: 'Neutral Grip Pull Ups',
        progressionType: 'calisthenics',
        sets: 3,
        reps: '14',
        rest: '3 min',
        type: 'calisthenics',
        notes: 'Palms facing - targets brachialis and forearms',
        videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
        imageUrl: 'https://images.unsplash.com/photo-1598971639058-211a74a5a6b7?w=800&q=80'
      },
      {
        id: 'standing-db-lateral-raises-day5',
        name: 'Standing Dumbbell Lateral Raises',
        progressionType: 'isolation',
        sets: 3,
        reps: '14',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Shoulder isolation - controlled tempo',
        videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'
      },
      {
        id: 'wide-grip-ez-curls',
        name: 'Wide Grip EZ Bar Curls',
        progressionType: 'isolation',
        sets: 3,
        reps: '10',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Bicep focus - no swinging, strict form',
        videoUrl: 'https://www.youtube.com/watch?v=kwG2ipFRgfo',
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80'
      },
      {
        id: 'db-hammer-curls',
        name: 'Dumbbell Hammer Curls',
        progressionType: 'isolation',
        sets: 3,
        reps: '10',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Neutral grip - targets brachialis',
        videoUrl: 'https://www.youtube.com/watch?v=zC3nLlEvin4',
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80'
      },
      {
        id: 'overhead-cable-triceps-day5',
        name: 'Overhead Cable Triceps Extensions',
        progressionType: 'isolation',
        sets: 3,
        reps: '14',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Long head emphasis - full stretch and contraction',
        videoUrl: 'https://www.youtube.com/watch?v=nRiJVZDpdL0',
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80'
      }
    ]
  }
];

/**
 * 3-day and 4-day splits are not authored yet. They intentionally stay empty
 * until the real workouts are provided; the signup UI only lets users pick a
 * program from AVAILABLE_DAYS_PER_WEEK, so no user can land on an empty split.
 */
export const threeDaySplit: WorkoutDay[] = [];
export const fourDaySplit: WorkoutDay[] = [];

export const workoutPrograms: Record<DaysPerWeek, WorkoutDay[]> = {
  3: threeDaySplit,
  4: fourDaySplit,
  5: fiveDaySplit,
};

/** Returns the workout split for the given days-per-week (falls back to 5). */
export function getWorkoutSplit(days?: DaysPerWeek | number | null): WorkoutDay[] {
  const split = days ? workoutPrograms[days as DaysPerWeek] : undefined;
  return split && split.length ? split : fiveDaySplit;
}

/** Backward-compatible default export (the 5-day program). */
export const workoutSplit = fiveDaySplit;
