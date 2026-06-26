import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import WorkoutCard from './components/WorkoutCard';
import WorkoutPageNew from './components/WorkoutPageNew';
import WeekSelector from './components/WeekSelector';
import BaselineScreen from './components/BaselineScreen';
import RetestScreen from './components/RetestScreen';
import { workoutSplit } from './data/workoutData';
import { WorkoutDay } from './types/workout';
import { Info, Lock, Circle, Trophy } from 'lucide-react';
import { getProgramState, ProgramState, WeekStatus } from './services/workoutService';
import WelcomePortal from './components/WelcomePortal';
import ProgramIntro from './components/ProgramIntro';
import AuthChoiceModal from './components/AuthChoiceModal';
import SignupModal from './components/SignupModal';
import HowItWorksModal from './components/HowItWorksModal';
import BottomNav from './components/BottomNav';
import { useLanguage } from './contexts/LanguageContext';
import { useAuth } from './contexts/AuthContext';
import { Pill, Button } from './components/ui';

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
  const [programLoading, setProgramLoading] = useState(false);
  const [showRetest, setShowRetest] = useState(false);

  const loadProgram = async () => {
    if (!user) return;
    setProgramLoading(true);
    try {
      const state = await getProgramState(user.id);
      setProgramState(state);
      if (state.currentWeek >= 1) setCurrentWeek(state.currentWeek);
    } catch (err) {
      console.error('Failed to load program state:', err);
    } finally {
      setProgramLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadProgram();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const weekStatuses: Record<number, WeekStatus> = programState?.weeks ?? {};
  const needsBaseline = programState !== null && programState.currentWeek === 0;

  // Auto-redirect for authenticated users
  useEffect(() => {
    if (profile?.currentWeek && view === 'welcome') {
      setCurrentWeek(profile.currentWeek);
    }
  }, [profile, view]);

  // Show loading spinner while checking auth session
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand/30 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  // ... (rest of the component)

  const handleSignupSubmit = async ({ fullName, email, password }: { fullName: string; email: string; password: string }) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await signUp(email, password, {
        full_name: fullName
      });

      if (error) throw error;

      // Handle success
      if (data?.session) {
        // Logged in immediately
        setShowSignupForm(false);
        // useEffect will handle redirection to 'workouts' view
      } else {
        // Email confirmation likely required
        alert('Check your email to confirm your account!');
        setShowSignupForm(false);
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      alert(err.message);
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

  const handleWeekSelect = async (week: number) => {
    const status = weekStatuses[week] ?? 'locked';
    if (status === 'locked') return; // gating: cannot open locked weeks
    setCurrentWeek(week);
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
        onWeekUnlocked={() => loadProgram()}
      />
    );
  }

  // Week 12 retest & comparison screen
  if (showRetest && user) {
    return <RetestScreen profileId={user.id} onBack={() => setShowRetest(false)} />;
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
    <div className="min-h-screen bg-app selection:bg-red-500/30">
      <div className={`transition-all duration-500 ${selectedWorkout ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>

        {/* Home / Welcome Portal - Only shown to authenticated users */}
        {isHome && (
          <div className="animate-fade-in">
            <WelcomePortal
              onSelectTraining={() => setView('intro')}
              onSelectNutrition={() => navigate('/nutrition')}
              onSignup={() => setShowSignupForm(true)}
              userName={profile?.fullName || user?.user_metadata?.full_name || user?.email}
            />
          </div>
        )}

        {/* Program Intro */}
        {isIntro && (
          <div className="animate-fade-in">
            <ProgramIntro
              onBack={() => setView('welcome')}
              onStart={handleStartProgram}
            />
          </div>
        )}

        {/* Workouts Feed - Authenticated users only */}
        {isWorkouts && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 pb-40">
            {/* Redirect if not logged in */}
            {!user ? (
              <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8">
                <div className="w-20 h-20 bg-brand-soft rounded-full flex items-center justify-center text-brand border border-brand/20">
                  <Lock className="w-10 h-10" />
                </div>
                <div className="text-center space-y-4">
                  <h2 className="font-display text-3xl font-black uppercase italic tracking-tight text-txt-hi">Access Locked</h2>
                  <p className="text-txt-lo text-sm font-bold uppercase tracking-widest">Authentication required for program access</p>
                </div>
                <Button variant="primary" size="lg" onClick={() => setShowAuthChoice(true)} className="px-10 tracking-[0.2em]">
                  Enable Access
                </Button>
              </div>
            ) : (
              <>
                <div className={`mb-10 relative z-50`}>
                  <Header
                    onSignup={() => setShowSignupForm(true)}
                    showAuthButtons={false}
                  />
                </div>

                <div className="space-y-8 animate-fade-in px-2 md:px-0">
                  {/* Title Section */}
                  <div className="space-y-4 px-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-2">
                        {(profile?.fullName || user?.user_metadata?.full_name || user?.email) && (
                          <Pill tone="brand" dot>
                            Personalized Identity • {(profile?.fullName || user?.user_metadata?.full_name || user?.email)?.split(' ')[0]}
                          </Pill>
                        )}
                        <h2 className="font-display text-5xl md:text-7xl font-black italic tracking-tight uppercase leading-[0.9] text-txt-hi">
                          Hello, <span className="text-brand">{(profile?.fullName || user?.user_metadata?.full_name || user?.email)?.split(' ')[0] || 'Athlete'}</span>
                        </h2>
                        <h3 className="font-display text-xl md:text-3xl font-black italic tracking-tight uppercase leading-none text-txt-lo">
                          {t('workout.title')}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-grad-red px-4 py-2 rounded-xl shadow-red">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-white">{t('workout.week')} {currentWeek}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-glass px-4 py-2 rounded-xl border border-hair">
                        <span className="text-[11px] font-black uppercase tracking-widest text-txt-mid italic">Active System</span>
                      </div>
                    </div>
                  </div>

                  {programLoading && !programState ? (
                    <div className="flex justify-center py-20">
                      <div className="w-10 h-10 border-4 border-brand/30 border-t-brand rounded-full animate-spin" />
                    </div>
                  ) : needsBaseline ? (
                    <BaselineScreen onComplete={loadProgram} />
                  ) : (
                    <>
                      {/* Week Selector */}
                      <div className="w-full flex justify-center md:justify-start">
                        <WeekSelector
                          currentWeek={currentWeek}
                          weeks={weekStatuses}
                          onWeekSelect={handleWeekSelect}
                        />
                      </div>

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

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                        {workoutSplit.map((workout) => (
                          <WorkoutCard
                            key={workout.id}
                            workout={workout}
                            onClick={() => setSelectedWorkout(workout)}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  <div className="pt-10 flex justify-center">
                    <button
                      onClick={() => setShowHowItWorks(true)}
                      className="flex items-center gap-2 text-[9px] font-black text-txt-lo hover:text-txt-hi uppercase tracking-[0.4em] transition-all"
                    >
                      <Circle className="w-3.5 h-3.5" />
                      <Info className="w-3.5 h-3.5" />
                      System Specification
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Persistent Bottom Navigation */}
        {!isHome && (
          <BottomNav activeView={view} onViewChange={setView} />
        )}
      </div>

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
