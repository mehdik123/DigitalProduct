import { WorkoutDay } from '../types/workout';

export const workoutSplit: WorkoutDay[] = [
  {
    id: 1,
    name: 'Upper Body 1',
    description: 'Upper body push focus with chest and triceps emphasis',
    focus: 'Push',
    duration: '75-90 min',
    icon: 'Dumbbell',
    color: 'from-blue-500 to-cyan-500',
    exercises: [
      {
        id: 'incline-barbell-bench-smith',
        name: 'Incline Barbell Bench Press (Smith Machine)',
        sets: 3,
        reps: '8',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'Compound movement - focus on controlled tempo and full range of motion'
      },
      {
        id: 'dips',
        name: 'Dips',
        sets: 3,
        reps: '6',
        rest: '3 min',
        type: 'calisthenics',
        notes: 'Lean forward for chest emphasis, keep elbows at 45 degrees'
      },
      {
        id: 'standing-db-lateral-raises',
        name: 'Standing Dumbbell Lateral Raises',
        sets: 3,
        reps: '12',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Isolation - keep slight bend in elbows, raise to shoulder height'
      },
      {
        id: 'pike-push-ups',
        name: 'Pike Push Ups',
        sets: 3,
        reps: '14',
        rest: '2 min',
        type: 'calisthenics',
        notes: 'Shoulder focus - keep hips high, head between arms'
      },
      {
        id: 'wide-grip-lat-pulldowns',
        name: 'Wide Grip Lat Pulldowns',
        sets: 3,
        reps: '10',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'Pull to upper chest, squeeze shoulder blades together'
      },
      {
        id: 'barbell-bent-over-rows',
        name: 'Barbell Bent Over Rows',
        sets: 3,
        reps: '10',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'Compound - maintain flat back, pull to lower chest'
      },
      {
        id: 'straight-bar-bicep-curls',
        name: 'Straight Bar Bicep Curls',
        sets: 3,
        reps: '10',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Keep elbows stationary, full range of motion'
      },
      {
        id: 'barbell-skull-crushers',
        name: 'Barbell Skull Crushers',
        sets: 4,
        reps: '14',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Isolation - lower to forehead, keep elbows tucked'
      }
    ]
  },
  {
    id: 2,
    name: 'Lower Body 1',
    description: 'Complete lower body development with quad, hamstring, and calf focus',
    focus: 'Legs',
    duration: '80-95 min',
    icon: 'Activity',
    color: 'from-orange-500 to-red-500',
    exercises: [
      {
        id: 'high-bar-back-squats',
        name: 'High Bar Back Squats',
        sets: 3,
        reps: '5',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'Heavy compound - go to parallel or below, keep chest up'
      },
      {
        id: 'front-squats-smith',
        name: 'Front Squats (Smith Machine)',
        sets: 3,
        reps: '10',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'Quad emphasis - keep torso upright, elbows high'
      },
      {
        id: 'leg-press',
        name: 'Leg Press',
        sets: 3,
        reps: '12',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'Full range of motion, feet shoulder-width apart'
      },
      {
        id: 'dumbbell-lunges',
        name: 'Dumbbell Lunges',
        sets: 3,
        reps: '12',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Per leg - step forward, knee at 90 degrees'
      },
      {
        id: 'prone-leg-curls',
        name: 'Prone Leg Curls',
        sets: 3,
        reps: '14',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Isolation - squeeze at top, control the negative'
      },
      {
        id: 'dumbbell-rdl',
        name: 'Dumbbell Romanian Deadlifts',
        sets: 3,
        reps: '10',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'Hamstring focus - slight knee bend, push hips back'
      },
      {
        id: 'calf-raises-in',
        name: 'Machine Standing Calf Raises (Toes In)',
        sets: 4,
        reps: '8, 10, 12, 14',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Progressive reps - full stretch and contraction'
      },
      {
        id: 'calf-raises-out',
        name: 'Machine Standing Calf Raises (Toes Out)',
        sets: 4,
        reps: '8, 10, 12, 14',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Progressive reps - targets different calf muscles'
      }
    ]
  },
  {
    id: 3,
    name: 'Upper Body 2',
    description: 'Shoulder development with core work',
    focus: 'Shoulders',
    duration: '70-85 min',
    icon: 'Zap',
    color: 'from-purple-500 to-pink-500',
    exercises: [
      {
        id: 'flat-barbell-bench',
        name: 'Flat Barbell Bench Press',
        sets: 3,
        reps: '8',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'Compound - retract shoulder blades, bar to mid-chest'
      },
      {
        id: 'pull-ups',
        name: 'Pull Ups',
        sets: 3,
        reps: '6',
        rest: '3 min',
        type: 'calisthenics',
        notes: 'Full range - dead hang to chin over bar'
      },
      {
        id: 'reverse-grip-bent-rows',
        name: 'Reverse Grip Bent Over Rows',
        sets: 3,
        reps: '10',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'Underhand grip - targets lower lats and biceps'
      },
      {
        id: 'seated-lateral-raises',
        name: 'Seated Lateral Raises',
        sets: 3,
        reps: '14',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Isolation - prevents momentum, strict form'
      },
      {
        id: 'db-rear-delt-kickbacks',
        name: 'Dumbbell Rear Delt Kickbacks',
        sets: 3,
        reps: '14',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Bend forward, raise arms back and out'
      },
      {
        id: 'chin-ups',
        name: 'Chin Ups',
        sets: 3,
        reps: '10',
        rest: '3 min',
        type: 'calisthenics',
        notes: 'Underhand grip - bicep and back emphasis'
      },
      {
        id: 'overhead-cable-triceps',
        name: 'Overhead Cable Triceps Extensions',
        sets: 4,
        reps: '12',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Keep elbows close to head, full extension'
      },
      {
        id: 'diamond-push-ups',
        name: 'Diamond Push Ups',
        sets: 4,
        reps: '14',
        rest: '2 min',
        type: 'calisthenics',
        notes: 'Hands form diamond shape - tricep emphasis'
      }
    ]
  },
  {
    id: 4,
    name: 'Lower Body 2',
    description: 'Lower body power and strength development',
    focus: 'Legs',
    duration: '80-95 min',
    icon: 'Flame',
    color: 'from-green-500 to-emerald-500',
    exercises: [
      {
        id: 'front-squats-smith-day4',
        name: 'Front Squats (Smith Machine)',
        sets: 3,
        reps: '6',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'Heavy - maintain upright torso, core tight'
      },
      {
        id: 'machine-leg-extensions',
        name: 'Machine Leg Extensions',
        sets: 3,
        reps: '10',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Quad isolation - squeeze at top, control descent'
      },
      {
        id: 'jump-squats',
        name: 'Jump Squats',
        sets: 3,
        reps: '12',
        rest: '3 min',
        type: 'calisthenics',
        notes: 'Explosive power - land softly, full squat depth'
      },
      {
        id: 'deadlifts',
        name: 'Deadlifts',
        sets: 3,
        reps: '14',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'King of compounds - neutral spine, drive through heels'
      },
      {
        id: 'prone-leg-curls-day4',
        name: 'Prone Leg Curls',
        sets: 3,
        reps: '14',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Hamstring isolation - full contraction'
      },
      {
        id: 'calf-raises-in-day4',
        name: 'Machine Standing Calf Raises (Toes In)',
        sets: 4,
        reps: '8, 10, 12, 14',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Progressive reps - pause at top'
      },
      {
        id: 'calf-raises-out-day4',
        name: 'Machine Standing Calf Raises (Toes Out)',
        sets: 4,
        reps: '8, 10, 12, 14',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Progressive reps - full range of motion'
      },
      {
        id: 'adductor-machine',
        name: 'Adductor Machine',
        sets: 3,
        reps: '12',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Inner thigh - controlled movement, squeeze'
      }
    ]
  },
  {
    id: 5,
    name: 'Upper Body 3',
    description: 'Intense arm training with superset protocol',
    focus: 'Arms',
    duration: '65-80 min',
    icon: 'Target',
    color: 'from-yellow-500 to-orange-500',
    exercises: [
      {
        id: 'incline-db-bench',
        name: 'Incline Dumbbell Bench Press',
        sets: 3,
        reps: '6',
        rest: '3 min',
        type: 'bodybuilding',
        notes: 'Upper chest focus - 30-45 degree incline'
      },
      {
        id: 'push-ups',
        name: 'Push Ups',
        sets: 3,
        reps: '10',
        rest: '2 min',
        type: 'calisthenics',
        notes: 'Bodyweight - chest to ground, full extension'
      },
      {
        id: 'pull-ups-day5',
        name: 'Pull Ups',
        sets: 3,
        reps: '6',
        rest: '3 min',
        type: 'calisthenics',
        notes: 'Overhand grip - full range of motion'
      },
      {
        id: 'neutral-grip-pull-ups',
        name: 'Neutral Grip Pull Ups',
        sets: 3,
        reps: '14',
        rest: '3 min',
        type: 'calisthenics',
        notes: 'Palms facing - targets brachialis and forearms'
      },
      {
        id: 'standing-db-lateral-raises-day5',
        name: 'Standing Dumbbell Lateral Raises',
        sets: 3,
        reps: '14',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Shoulder isolation - controlled tempo'
      },
      {
        id: 'wide-grip-ez-curls',
        name: 'Wide Grip EZ Bar Curls',
        sets: 3,
        reps: '10',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Bicep focus - no swinging, strict form'
      },
      {
        id: 'db-hammer-curls',
        name: 'Dumbbell Hammer Curls',
        sets: 3,
        reps: '10',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Neutral grip - targets brachialis'
      },
      {
        id: 'overhead-cable-triceps-day5',
        name: 'Overhead Cable Triceps Extensions',
        sets: 3,
        reps: '14',
        rest: '2 min',
        type: 'bodybuilding',
        notes: 'Long head emphasis - full stretch and contraction'
      }
    ]
  }
];
