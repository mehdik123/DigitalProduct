import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import AppChrome from './components/AppChrome';
import WorkoutCard from './components/WorkoutCard';
import WeekSelector from './components/WeekSelector';
import { getWorkoutSplit, DaysPerWeek } from './data/workoutData';
import { WorkoutDay } from './types/workout';
import { Lock } from 'lucide-react';
import { ProgramState, WeekStatus } from './services/workoutService';
import {
  getLocalProgramState,
  isLocalDayComplete,
  getLocalDayExerciseProgress,
  ensureLocalProgram,
  getLocalDaysPerWeek,
} from './services/localProgram';
import WelcomePortal from './components/WelcomePortal';
import ProgramIntro from './components/ProgramIntro';
import AuthChoiceModal from './components/AuthChoiceModal';
import { hasSeenWorkoutCoach, hasDismissedWeek6Banner, dismissWeek6Banner } from './lib/onboarding';
import { getWeekSetProgress } from './lib/weekProgress';
import { getPhase } from './data/programConfig';
import BottomNav from './components/BottomNav';
import { useLanguage } from './contexts/LanguageContext';
import { useAuth } from './contexts/AuthContext';
import { isTimeoutError } from './lib/firebase';
import { Button, ScreenTransition, WorkoutFeedSkeleton, Skeleton } from './components/ui';
import { listVariants } from './design/motion';
import { motion } from 'framer-motion';

const WorkoutPageNew = lazy(() => import('./components/WorkoutPageNew'));
const SignupModal = lazy(() => import('./components/SignupModal'));
const WorkoutCoachModal = lazy(() => import('./components/WorkoutCoachModal'));
const LockedWeekModal = lazy(() => import('./components/LockedWeekModal'));

function App() {
  const navigate = useNavigate();
  const { user, profile, signUp, loading } = useAuth();
  const { t } = useLanguage();

  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutDay | null>(null);
  const [view, setView] = useState<'welcome' | 'intro' | 'workouts'>('workouts');
  const [showWorkoutCoach, setShowWorkoutCoach] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showAuthChoice, setShowAuthChoice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [programState, setProgramState] = useState<ProgramState | null>(null);
  const [lockedWeekTarget, setLockedWeekTarget] = useState<number | null>(null);
  const [week6Dismissed, setWeek6Dismissed] = useState(() => hasDismissedWeek6Banner());

  // The program a user is enrolled in (chosen once at signup, irreversible).
  // Falls back to the value this device recorded, so an offline user who cannot
  // load their profile still gets their own split rather than the 5-day default.
  const daysPerWeek =
    (profile?.daysPerWeek as DaysPerWeek | undefined) ??
    (user ? getLocalDaysPerWeek(user.id) : undefined);
  const split = getWorkoutSplit(daysPerWeek);

  const loadProgram = () => {
    if (!user) return;
    // Local-only: sets and progressive overload live in localStorage.
    ensureLocalProgram(user.id, profile?.daysPerWeek);
    const local = getLocalProgramState(user.id, profile?.daysPerWeek);
    setProgramState(local);
    setCurrentWeek(Math.max(1, local.currentWeek));
  };

  useEffect(() => {
    if (user) loadProgram();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Once the profile (with its days-per-week) arrives, re-seed the local
  // program so a fresh device builds the right split.
  useEffect(() => {
    if (user && profile?.daysPerWeek) {
      ensureLocalProgram(user.id, profile.daysPerWeek);
      setProgramState(getLocalProgramState(user.id, profile.daysPerWeek));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, profile?.daysPerWeek]);

  const weekStatuses: Record<number, WeekStatus> = programState?.weeks ?? {};

  // Auto-redirect for authenticated users
  useEffect(() => {
    if (profile?.currentWeek && profile.currentWeek >= 1 && view === 'welcome') {
      setCurrentWeek(profile.currentWeek);
    }
  }, [profile, view]);

  // Show coach the first time user lands on the train tab (e.g. via bottom nav).
  useEffect(() => {
    if (user && view === 'workouts' && !hasSeenWorkoutCoach()) {
      setShowWorkoutCoach(true);
    }
  }, [user, view]);

  useEffect(() => {
    if (!selectedWorkout && user) {
      setProgramState(getLocalProgramState(user.id, profile?.daysPerWeek));
    }
  }, [selectedWorkout, user?.id, profile?.daysPerWeek]);

  // Show loading spinner while checking auth session
  if (loading) {
    return (
      <div className="min-h-dvh bg-app pad-safe-top px-6 py-12">
        <div className="mx-auto max-w-md space-y-6">
          <Skeleton className="mx-auto h-16 w-16 rounded-2xl" />
          <Skeleton className="h-8 w-3/4 rounded-xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  // ... (rest of the component)

  const handleSignupSubmit = async ({ fullName, email, password, daysPerWeek }: { fullName: string; email: string; password: string; daysPerWeek: DaysPerWeek }) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await signUp(email, password, {
        full_name: fullName,
        days_per_week: daysPerWeek
      });

      if (error) throw error;

      // Handle success
      if (data?.session) {
        // Logged in immediately
        setShowSignupForm(false);
        // useEffect will handle redirection to 'workouts' view
      } else {
        // Account created but no session (e.g. email confirmation enabled).
        alert(t('signup.success.message'));
        setShowSignupForm(false);
        navigate('/login/returning');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      const message: string = err?.message ?? '';

      if (/already\s*(registered|exists)|user\s*already/i.test(message)) {
        alert(t('signup.error.alreadyRegistered'));
        setShowSignupForm(false);
        navigate('/login/returning');
      } else if (isTimeoutError(err)) {
        // The request may well have succeeded server-side; send them to login
        // rather than showing a raw abort error.
        alert(t('signup.timeoutRedirect'));
        setShowSignupForm(false);
        navigate('/login/returning');
      } else {
        alert(message || 'Signup failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartProgram = () => {
    if (user) {
      setView('workouts');
      if (!hasSeenWorkoutCoach()) {
        setShowWorkoutCoach(true);
      }
    } else {
      setShowAuthChoice(true);
    }
  };

  const handleWeekSelect = (week: number) => {
    const status = weekStatuses[week] ?? 'locked';
    if (status === 'locked') return;
    setLockedWeekTarget(null);
    setCurrentWeek(week);
  };

  const handleLockedWeek = (week: number) => {
    setLockedWeekTarget(week);
  };

  // Individual workout page - restricted to authenticated users
  if (selectedWorkout) {
    if (!user) {
      setSelectedWorkout(null);
      setShowAuthChoice(true);
      return null;
    }
    return (
      <>
        <AppChrome showBack onBack={() => setSelectedWorkout(null)} />
        <div className="pt-chrome">
          <Suspense fallback={<WorkoutFeedSkeleton />}>
            <WorkoutPageNew
              workout={selectedWorkout}
              weekNumber={currentWeek}
              onBack={() => setSelectedWorkout(null)}
              profile={profile || { id: user.id }}
              daysPerWeek={daysPerWeek}
              onWeekUnlocked={() => loadProgram()}
            />
          </Suspense>
        </div>
        <BottomNav activeView="workouts" onViewChange={setView} />
      </>
    );
  }

  const isHome = view === 'welcome';
  const isIntro = view === 'intro';
  const isWorkouts = view === 'workouts';

  // Show auth gate first if not logged in
  if (!user) {
    return (
    <div className="min-h-screen bg-app">
      {/* Show auth choice modal immediately for non-authenticated users */}
        <AuthChoiceModal
          onClose={() => { }} // Can't close - must authenticate
          onJoin={() => setShowSignupForm(true)}
          onLogin={() => navigate('/login/returning')}
        />

        {/* Signup Modal */}
        {showSignupForm && (
          <Suspense fallback={null}>
            <SignupModal
              onClose={() => setShowSignupForm(false)}
              onSubmit={handleSignupSubmit}
              loading={isSubmitting}
            />
          </Suspense>
        )}
      </div>
    );
  }

  const handleChromeBack = () => {
    if (isIntro || isWorkouts) setView('welcome');
  };

  return (
    <div className="min-h-dvh bg-app">
      <AppChrome showBack={!isHome} onBack={handleChromeBack} />

      <main className={`pt-chrome ${selectedWorkout ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
        <ScreenTransition screenKey={view}>
        {isHome && user && (() => {
          const { done, total } = getWeekSetProgress(user.id, currentWeek, daysPerWeek);
          const phase = getPhase(currentWeek);
          return (
            <WelcomePortal
              onSelectTraining={() => setView('workouts')}
              onSignup={() => setShowSignupForm(true)}
              userName={profile?.fullName || user?.user_metadata?.full_name || user?.email}
              weekNumber={currentWeek}
              setsDone={done}
              setsTotal={total}
              phaseLabel={t(phase.phaseLabelKey)}
            />
          );
        })()}

        {isIntro && (
          <ProgramIntro
              onStart={handleStartProgram}
              daysPerWeek={daysPerWeek}
            />
        )}

        {isWorkouts && (
          <div className="relative mx-auto max-w-lg px-5 pb-nav-space pt-3">
            {!user ? (
              <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5">
                <Lock className="h-7 w-7 text-txt-lo" strokeWidth={1.75} />
                <div className="space-y-2 text-center">
                  <h2 className="font-display text-3xl font-semibold uppercase tracking-tight text-txt-hi">
                    {t('app.accessLocked')}
                  </h2>
                  <p className="text-sm text-txt-mid">{t('app.authRequired')}</p>
                </div>
                <Button variant="primary" size="lg" onClick={() => setShowAuthChoice(true)}>
                  {t('app.enableAccess')}
                </Button>
              </div>
            ) : (
              <div className="relative space-y-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-txt-lo">
                  {t('home.yourWorkouts')}
                </p>

                <div className="flex items-end justify-between gap-3">
                  <div className="flex items-end gap-2.5">
                    <span className="font-display text-[84px] font-bold leading-[0.78] tracking-[-0.02em] tabular-nums text-txt-hi">
                      {String(currentWeek).padStart(2, '0')}
                    </span>
                    <span className="pb-1.5 text-[13px] font-semibold uppercase tracking-[0.16em] text-txt-lo">
                      {t('workout.week')}
                    </span>
                  </div>
                  <div className="pb-1 text-right">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-txt-lo">
                      {t('home.phase')}
                    </div>
                    <div className="mt-2 text-[15px] font-semibold leading-snug text-txt-hi">
                      {t(getPhase(currentWeek).phaseLabelKey)}
                    </div>
                  </div>
                </div>

                {!programState ? (
                  <WorkoutFeedSkeleton />
                ) : (
                  <>
                    <WeekSelector
                      currentWeek={currentWeek}
                      weeks={weekStatuses}
                      onWeekSelect={handleWeekSelect}
                      onLockedSelect={handleLockedWeek}
                    />

                    {(() => {
                      const { done, total } = getWeekSetProgress(user.id, currentWeek, daysPerWeek);
                      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                      return (
                        <div>
                          <div className="mt-[18px] h-1 overflow-hidden rounded-sm bg-surface-3">
                            <div
                              className="h-full rounded-sm bg-brand transition-[width] duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="mt-2.5 flex justify-between text-[13px] font-medium text-txt-mid">
                            <span>
                              {done} of {total} sets
                            </span>
                            <span className="text-txt-lo">{pct}%</span>
                          </div>
                        </div>
                      );
                    })()}

                    {currentWeek === 5 && !week6Dismissed && (
                      <div className="flex items-start justify-between gap-3 rounded-[14px] bg-surface-1 px-3.5 py-3">
                        <p className="text-sm leading-relaxed text-txt-mid">{t('feed.week6Banner')}</p>
                        <button
                          type="button"
                          onClick={() => {
                            dismissWeek6Banner();
                            setWeek6Dismissed(true);
                          }}
                          className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-brand"
                        >
                          {t('common.gotIt')}
                        </button>
                      </div>
                    )}

                    <motion.div
                      variants={listVariants}
                      initial="hidden"
                      animate="show"
                      className="grid gap-2"
                    >
                      {split.map((workout, i) => {
                        const completed = isLocalDayComplete(user.id, currentWeek, workout.id);
                        const progress = getLocalDayExerciseProgress(
                          user.id,
                          currentWeek,
                          workout.id
                        );
                        return (
                          <WorkoutCard
                            key={workout.id}
                            workout={workout}
                            dayIndex={i + 1}
                            completed={completed}
                            progress={progress}
                            onClick={() => setSelectedWorkout(workout)}
                          />
                        );
                      })}
                    </motion.div>

                    <button
                      type="button"
                      onClick={() => setShowWorkoutCoach(true)}
                      className="mx-auto block pt-1 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-txt-lo transition-colors hover:text-txt-hi"
                    >
                      {t('feed.howProgress')}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
        </ScreenTransition>
      </main>

      {/* Persistent bottom navigation on every authenticated screen. */}
      <BottomNav activeView={view} onViewChange={setView} />

      {/* Auth Choice Modal */}
      {showAuthChoice && (
        <AuthChoiceModal
          dismissible
          onClose={() => setShowAuthChoice(false)}
          onJoin={() => {
            setShowAuthChoice(false);
            setShowSignupForm(true);
          }}
          onLogin={() => {
            setShowAuthChoice(false);
            navigate('/login/returning');
          }}
        />
      )}

      {/* Signup Modal */}
      {showSignupForm && (
        <Suspense fallback={null}>
          <SignupModal
            onClose={() => setShowSignupForm(false)}
            onSubmit={handleSignupSubmit}
            loading={isSubmitting}
          />
        </Suspense>
      )}

      {showWorkoutCoach && (
        <Suspense fallback={null}>
          <WorkoutCoachModal onClose={() => setShowWorkoutCoach(false)} />
        </Suspense>
      )}

      {lockedWeekTarget !== null && (
        <Suspense fallback={null}>
          <LockedWeekModal week={lockedWeekTarget} onClose={() => setLockedWeekTarget(null)} />
        </Suspense>
      )}
    </div>
  );
}

export default App;
