// Weekly progression data for 8-week program
import { WeeklyProgression } from '../types/workout';

export const weeklyProgressions: WeeklyProgression[] = [
    // Weeks 1-2: Anatomical Adaptation Phase
    {
        weekNumber: 1,
        phase: 'Anatomical Adaptation',
        volumeMultiplier: 1.0,
        intensityTarget: 65,
        rpeRange: [6, 7],
        restMultiplier: 1.2,
        description: 'Build work capacity and perfect form',
        goals: [
            'Master movement patterns',
            'Prepare connective tissue',
            'Build training base',
            'Focus on technique over weight'
        ]
    },
    {
        weekNumber: 2,
        phase: 'Anatomical Adaptation',
        volumeMultiplier: 1.1,
        intensityTarget: 70,
        rpeRange: [6, 7],
        restMultiplier: 1.15,
        description: 'Continue building capacity with slight volume increase',
        goals: [
            'Refine technique',
            'Increase work capacity',
            'Prepare for hypertrophy phase',
            'Build movement confidence'
        ]
    },

    // Weeks 3-4: Hypertrophy Focus Phase
    {
        weekNumber: 3,
        phase: 'Hypertrophy Focus',
        volumeMultiplier: 1.25,
        intensityTarget: 75,
        rpeRange: [7, 8],
        restMultiplier: 0.9,
        description: 'Maximum volume for muscle growth',
        goals: [
            'Maximize time under tension',
            'Create muscle damage for growth',
            'Increase training volume',
            'Build muscle mass'
        ]
    },
    {
        weekNumber: 4,
        phase: 'Hypertrophy Focus',
        volumeMultiplier: 1.3,
        intensityTarget: 78,
        rpeRange: [7, 8],
        restMultiplier: 0.85,
        description: 'Peak hypertrophy volume',
        goals: [
            'Push volume to maximum recoverable',
            'Maintain intensity',
            'Maximize metabolic stress',
            'Peak muscle building stimulus'
        ]
    },

    // Weeks 5-6: Strength & Power Phase
    {
        weekNumber: 5,
        phase: 'Strength & Power',
        volumeMultiplier: 1.0,
        intensityTarget: 85,
        rpeRange: [8, 9],
        restMultiplier: 1.3,
        description: 'Build maximum strength with heavy loads',
        goals: [
            'Increase maximum strength',
            'Develop explosive power',
            'Lift heavier weights',
            'Improve neural adaptations'
        ]
    },
    {
        weekNumber: 6,
        phase: 'Strength & Power',
        volumeMultiplier: 0.95,
        intensityTarget: 88,
        rpeRange: [8, 9],
        restMultiplier: 1.4,
        description: 'Peak strength development',
        goals: [
            'Maximize strength gains',
            'Perfect explosive technique',
            'Prepare for deload',
            'Test new strength levels'
        ]
    },

    // Week 7: Deload Week
    {
        weekNumber: 7,
        phase: 'Deload',
        volumeMultiplier: 0.5,
        intensityTarget: 65,
        rpeRange: [6, 7],
        restMultiplier: 1.2,
        description: 'Active recovery and supercompensation',
        goals: [
            'Allow full recovery',
            'Prevent overtraining',
            'Refine technique',
            'Prepare for peak week'
        ]
    },

    // Week 8: Peak Performance Week
    {
        weekNumber: 8,
        phase: 'Peak Performance',
        volumeMultiplier: 0.85,
        intensityTarget: 92,
        rpeRange: [9, 10],
        restMultiplier: 1.5,
        description: 'Demonstrate maximum capabilities',
        goals: [
            'Set personal records',
            'Test maximum strength',
            'Showcase all improvements',
            'Peak performance output'
        ]
    }
];

export const progressionRules = {
    weeklyLoadIncrease: 2.5, // 2.5% per week
    volumeLandmark: 15, // Max 15% volume increase per week
    deloadVolumeReduction: 50, // 50% volume reduction
    deloadIntensityReduction: 30 // 30% intensity reduction
};

// Helper function to get progression for a specific week
export const getWeekProgression = (weekNumber: number): WeeklyProgression => {
    const progression = weeklyProgressions.find(p => p.weekNumber === weekNumber);
    if (!progression) {
        throw new Error(`No progression data found for week ${weekNumber}`);
    }
    return progression;
};

// Helper function to calculate adjusted sets based on week
export const calculateAdjustedSets = (baseSets: number, weekNumber: number): number => {
    const progression = getWeekProgression(weekNumber);
    return Math.round(baseSets * progression.volumeMultiplier);
};

// Helper function to calculate adjusted rest based on week
export const calculateAdjustedRest = (baseRestSeconds: number, weekNumber: number): number => {
    const progression = getWeekProgression(weekNumber);
    return Math.round(baseRestSeconds * progression.restMultiplier);
};

// Helper function to format rest time
export const formatRestTime = (seconds: number): string => {
    if (seconds < 60) {
        return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}min ${remainingSeconds}s` : `${minutes}min`;
};
