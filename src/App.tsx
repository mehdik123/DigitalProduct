import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import WorkoutCard from './components/WorkoutCard';
import WorkoutPageNew from './components/WorkoutPageNew';
import WeekSelector from './components/WeekSelector';
import RetestScreen from './components/RetestScreen';
import { getWorkoutSplit, DaysPerWeek } from './data/workoutData';
import { WorkoutDay } from './types/workout';
import { Info, Lock, Circle, Trophy, ArrowLeft } from 'lucide-react';
import {
  ensureProgramStarted,
  fetchCloudProgram,
  pushProgramToCloud,
  ProgramState,
  WeekStatus,
} from './services/workoutService';
import {
  getLocalProgramState,
  isLocalDayComplete,
  mergeCloudIntoLocal,
  collectAllSets,
  ensureLocalProgram,
  getLocalDaysPerWeek,
} from './services/localProgram';
import WelcomePortal from './components/WelcomePortal';
import ProgramIntro from './components/ProgramIntro';
import AuthChoiceModal from './components/AuthChoiceModal';
import SignupModal from './components/SignupModal';
import HowItWorksModal from './components/HowItWorksModal';
import BottomNav from './components/BottomNav';
import { useLanguage } from './contexts/LanguageContext';
import { useAuth } from './contexts/AuthContext';
import { isTimeoutError } from './lib/supabaseClient';
import { Pill, Button, ScreenTransition, WorkoutFeedSkeleton, Skeleton } from './components/ui';
import { listVariants } from './design/motion';
import { motion } from 'framer-motion';

function App() {
  const navigate = useNavigate();
  const { user, profile, signUp, loading } = useAuth();
  const { t } = useLanguage();

  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutDay | null>(null);
  const [view, setView] = useState<'welcome' | 'intro' | 'workouts'>('welcome');
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showAuthChoice, setShowAuthChoice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [programState, setProgramState] = useState<ProgramState | null>(null);
  const [showRetest, setShowRetest] = useState(false);
  const [lockedNotice, setLockedNotice] = useState(false);

  // The program a user is enrolled in (chosen once at signup, irreversible).
  // Falls back to the value this device recorded, so an offline user who cannot
  // load their profile still gets their own split rather than the 5-day default.
  const daysPerWeek =
    (profile?.daysPerWeek as DaysPerWeek | undefined) ??
    (user ? getLocalDaysPerWeek(user.id) : undefined);
  const split = getWorkoutSplit(daysPerWeek);

  const loadProgram = () => {
    if (!user) return;
    // Local-first: instant, always available. Seed with the user's program.
    ensureLocalProgram(user.id, profile?.daysPerWeek);
    const local = getLocalProgramState(user.id, profile?.daysPerWeek);
    setProgramState(local);
    setCurrentWeek(Math.max(1, local.currentWeek));

    // Background: reconcile with the cloud so data restores across devices.
    void syncWithCloud(user.id);
  };

  const syncWithCloud = async (userId: string) => {
    try {
      await ensureProgramStarted(userId);

      // Pull anything logged on other devices and merge it in.
      const cloud = await fetchCloudProgram(userId);
      if (cloud) {
        // Adopt the program the account was created with (irreversible).
        ensureLocalProgram(userId, cloud.daysPerWeek ?? profile?.daysPerWeek);
        const merged = mergeCloudIntoLocal(userId, { currentWeek: cloud.currentWeek, sets: cloud.sets });
        setProgramState(merged);
        setCurrentWeek(Math.max(1, merged.currentWeek));
      }

      // Push the reconciled state back up so this device's work is saved.
      const state = getLocalProgramState(userId);
      await pushProgramToCloud(userId, collectAllSets(userId), state.currentWeek, state.weeks);
    } catch (err) {
      console.warn('Cloud sync skipped (offline):', err);
    }
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
    } else {
      setShowAuthChoice(true);
    }
  };

  const handleWeekSelect = (week: number) => {
    const status = weekStatuses[week] ?? 'locked';
    if (status === 'locked') return; // gating: cannot open locked weeks
    setLockedNotice(false);
    setCurrentWeek(week);
  };

  const handleLockedWeek = () => {
    setLockedNotice(true);
  };

  // Individual workout page - restricted to authenticated users
  if (selectedWorkout) {
    if (!user) {
      setSelectedWorkout(null);
      setShowAuthChoice(true);
      return null;
    }
    return (
      <WorkoutPageNew
        workout={selectedWorkout}
        weekNumber={currentWeek}
        onBack={() => setSelectedWorkout(null)}
        profile={profile || { id: user.id }}
        daysPerWeek={daysPerWeek}
        onWeekUnlocked={() => loadProgram()}
      />
    );
  }

  // Week 12 retest & comparison screen
  if (showRetest && user) {
    return <RetestScreen profileId={user.id} daysPerWeek={daysPerWeek} onBack={() => setShowRetest(false)} />;
  }

  const isHome = view === 'welcome';
  const isIntro = view === 'intro';
  const isWorkouts = view === 'workouts';

  // Show auth gate first if not logged in
  if (!user) {
    return (
    <div className="min-h-screen bg-app selection:bg-red-500/30">
      {/* Show auth choice modal immediately for non-authenticated users */}
        <AuthChoiceModal
          onClose={() => { }} // Can't close - must authenticate
          onJoin={() => setShowSignupForm(true)}
          onLogin={() => navigate('/login/returning')}
        />

        {/* Signup Modal */}
        {showSignupForm && (
          <SignupModal
            onClose={() => setShowSignupForm(false)}
            onSubmit={handleSignupSubmit}
            loading={isSubmitting}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-dvh overflow-x-hidden bg-app selection:bg-red-500/30">
      <div className={`transition-all duration-500 ${selectedWorkout ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>

        <ScreenTransition screenKey={view}>
        {/* Home / Welcome Portal - Only shown to authenticated users */}
        {isHome && (
          <WelcomePortal
              onSelectTraining={() => setView('intro')}
              onSignup={() => setShowSignupForm(true)}
              userName={profile?.fullName || user?.user_metadata?.full_name || user?.email}
            />
        )}

        {/* Program Intro */}
        {isIntro && (
          <ProgramIntro
              onBack={() => setView('welcome')}
              onStart={handleStartProgram}
              daysPerWeek={daysPerWeek}
            />
        )}

        {/* Workouts Feed - Authenticated users only */}
        {isWorkouts && (
          <div className="mx-auto max-w-7xl px-4 pt-5 pb-nav-space sm:px-6 sm:pt-6 md:pt-12">
            {/* Redirect if not logged in */}
            {!user ? (
              <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8">
                <div className="w-20 h-20 bg-brand-soft rounded-full flex items-center justify-center text-brand border border-brand/20">
                  <Lock className="w-10 h-10" />
                </div>
                <div className="text-center space-y-4">
                  <h2 className="font-display text-3xl font-black uppercase italic tracking-tight text-txt-hi">{t('app.accessLocked')}</h2>
                  <p className="text-txt-lo text-sm font-bold uppercase tracking-widest">{t('app.authRequired')}</p>
                </div>
                <Button variant="primary" size="lg" onClick={() => setShowAuthChoice(true)} className="px-10 tracking-[0.2em]">
                  {t('app.enableAccess')}
                </Button>
              </div>
            ) : (
              <>
                <div className={`mb-4 relative z-50 sm:mb-8`}>
                  <Header
                    onSignup={() => setShowSignupForm(true)}
                    showAuthButtons={false}
                  />
                </div>

                <div className="space-y-3.5 px-1 sm:space-y-8 sm:px-0">
                  {/* Title Section — greeting and status share a row on mobile */}
                  <div className="space-y-2 px-1 sm:space-y-4 sm:px-2">
                    <div className="flex items-end justify-between gap-2.5 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => setView('welcome')}
                        aria-label={t('common.backToHome')}
                        className="grid h-9 w-9 shrink-0 place-items-center self-center rounded-full border border-hair bg-surface-2 text-txt-mid transition-colors hover:text-txt-hi active:scale-95 rtl:rotate-180 sm:h-10 sm:w-10"
                      >
                        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>

                      <div className="min-w-0 flex-1 space-y-1 sm:space-y-2">
                        {(profile?.fullName || user?.user_metadata?.full_name || user?.email) && (
                          <div className="hidden sm:block">
                            <Pill tone="brand" dot>
                              {(profile?.fullName || user?.user_metadata?.full_name || user?.email)?.split(' ')[0]}
                            </Pill>
                          </div>
                        )}
                        <h2 className="font-display text-2xl font-black italic tracking-tight uppercase leading-[0.95] text-txt-hi sm:text-display-lg">
                          {t('app.hello')} <span className="text-brand">{(profile?.fullName || user?.user_metadata?.full_name || user?.email)?.split(' ')[0] || t('app.athlete')}</span>
                        </h2>
                        <h3 className="font-display text-[11px] font-black italic tracking-tight uppercase leading-none text-txt-lo sm:text-xl md:text-2xl">
                          {t('workout.title')}
                        </h3>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-grad-red px-2.5 py-1.5 shadow-red sm:hidden">
                        <span className="h-1 w-1 rounded-full bg-white animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white">{t('workout.week')} {currentWeek}</span>
                      </div>
                    </div>

                    <div className="hidden flex-wrap items-center gap-2 sm:flex">
                      <div className="flex items-center gap-2 bg-grad-red px-4 py-2 rounded-xl shadow-red">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-white">{t('workout.week')} {currentWeek}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-glass px-4 py-2 rounded-xl border border-hair">
                        <span className="text-[11px] font-black uppercase tracking-widest text-txt-mid italic">{t('app.activeSystem')}</span>
                      </div>
                    </div>
                  </div>

                  {!programState ? (
                    <WorkoutFeedSkeleton />
                  ) : (
                    <>
                      {/* Week Selector */}
                      <div className="w-full flex justify-center md:justify-start">
                        <WeekSelector
                          currentWeek={currentWeek}
                          weeks={weekStatuses}
                          onWeekSelect={handleWeekSelect}
                          onLockedSelect={handleLockedWeek}
                        />
                      </div>

                      {lockedNotice && (
                        <div className="flex items-start gap-3 rounded-2xl border border-brand/30 bg-brand-soft px-4 py-3">
                          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold leading-relaxed text-txt-hi">
                              {t('week.lockedNotice')}
                            </p>
                            <button
                              type="button"
                              onClick={() => setLockedNotice(false)}
                              className="mt-2 text-[10px] font-black uppercase tracking-wider text-brand"
                            >
                              {t('common.gotIt')}
                            </button>
                          </div>
                        </div>
                      )}

                      {currentWeek === 12 && (
                        <button
                          onClick={() => setShowRetest(true)}
                          className="flex w-full items-center justify-between rounded-2xl border border-brand/30 bg-brand-soft px-5 py-4 transition-colors hover:bg-brand/20"
                        >
                          <span className="flex items-center gap-3">
                            <Trophy className="h-5 w-5 text-brand" />
                            <span className="text-sm font-black uppercase tracking-widest text-txt-hi">
                              {t('retest.open')}
                            </span>
                          </span>
                          <span className="text-brand rtl:rotate-180">→</span>
                        </button>
                      )}

                      <motion.div
                        variants={listVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
                      >
                        {split.map((workout) => (
                          <WorkoutCard
                            key={workout.id}
                            workout={workout}
                            completed={
                              user ? isLocalDayComplete(user.id, currentWeek, workout.id) : false
                            }
                            onClick={() => setSelectedWorkout(workout)}
                          />
                        ))}
                      </motion.div>
                    </>
                  )}

                  <div className="pt-4 flex justify-center sm:pt-10">
                    <button
                      onClick={() => setShowHowItWorks(true)}
                      className="flex items-center gap-2 text-[9px] font-black text-txt-lo hover:text-txt-hi uppercase tracking-[0.4em] transition-all"
                    >
                      <Circle className="w-3.5 h-3.5" />
                      <Info className="w-3.5 h-3.5" />
                      {t('app.systemSpec')}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        </ScreenTransition>
      </div>

      {/* Persistent Bottom Navigation.
          Must stay outside the scaled wrapper above: a CSS transform on an ancestor
          makes `fixed` resolve against that element instead of the viewport. */}
      {!isHome && (
        <BottomNav activeView={view} onViewChange={setView} />
      )}

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
        <SignupModal
          onClose={() => setShowSignupForm(false)}
          onSubmit={handleSignupSubmit}
          loading={isSubmitting}
        />
      )}

      {showHowItWorks && (
        <HowItWorksModal
          onClose={() => setShowHowItWorks(false)}
        />
      )}
    </div>
  );
}

export default App;
