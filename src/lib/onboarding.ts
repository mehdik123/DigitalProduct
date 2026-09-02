const COACH_KEY = 'hybrid_workout_coach_seen';

export function hasSeenWorkoutCoach(): boolean {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(COACH_KEY) === '1';
}

export function markWorkoutCoachSeen(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(COACH_KEY, '1');
}

const FIRST_SET_KEY = 'hybrid_first_set_logged';
const WEEK6_BANNER_KEY = 'hybrid_week6_banner_dismissed';

export function hasLoggedFirstSet(): boolean {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(FIRST_SET_KEY) === '1';
}

export function markFirstSetLogged(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(FIRST_SET_KEY, '1');
}

export function hasDismissedWeek6Banner(): boolean {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(WEEK6_BANNER_KEY) === '1';
}

export function dismissWeek6Banner(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(WEEK6_BANNER_KEY, '1');
}
