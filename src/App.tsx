import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import WorkoutCard from './components/WorkoutCard';
import WorkoutPageNew from './components/WorkoutPageNew';
import WeekSelector from './components/WeekSelector';
import { workoutSplit } from './data/workoutData';
import { WorkoutDay } from './types/workout';
import { X, Info, Lock, Circle } from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import WelcomePortal from './components/WelcomePortal';
import ProgramIntro from './components/ProgramIntro';
import AuthChoiceModal from './components/AuthChoiceModal';
import HowItWorksModal from './components/HowItWorksModal';
import BottomNav from './components/BottomNav';
import { useLanguage } from './contexts/LanguageContext';
import { useAuth } from './contexts/AuthContext';

function App() {
  const navigate = useNavigate();
  const { user, profile, signOut, signUp, loading } = useAuth();
  const { t } = useLanguage();

  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutDay | null>(null);
  const [view, setView] = useState<'welcome' | 'intro' | 'workouts'>('welcome');
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showAuthChoice, setShowAuthChoice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

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
        <div className="w-10 h-10 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  // ... (rest of the component)

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.fullName.trim() || !signupForm.email.trim()) {
      alert('Please fill in all fields');
      return;
    }
    if (signupForm.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await signUp(signupForm.email.trim(), signupForm.password, {
        full_name: signupForm.fullName.trim()
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
    setCurrentWeek(week);
    if (user) {
      await supabase.from('profiles').update({ current_week: week }).eq('id', user.id);
    }
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
      />
    );
  }

  const isHome = view === 'welcome';
  const isIntro = view === 'intro';
  const isWorkouts = view === 'workouts';

  // Show auth gate first if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-black selection:bg-red-500/30">
        {/* Show auth choice modal immediately for non-authenticated users */}
        <AuthChoiceModal
          onClose={() => { }} // Can't close - must authenticate
          onJoin={() => setShowSignupForm(true)}
          onLogin={() => navigate('/login/returning')}
        />

        {/* Signup Modal */}
        {showSignupForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[200] flex items-center justify-center p-6 animate-fade-in text-white">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg aspect-square bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="glass-card w-full max-w-md p-8 border-white/10 shadow-2xl relative overflow-hidden animate-slide-up">
              <div className="flex justify-between items-center mb-10">
                <div className="space-y-1 text-left">
                  <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Initialize</h2>
                  <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Create Your Account</p>
                </div>
                <button onClick={() => setShowSignupForm(false)} className="p-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSignupSubmit} className="space-y-5 text-left">
                <div className="space-y-2">
                  <label className="block text-[8px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="E.g. John Wick"
                    className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-white text-sm font-medium outline-none focus:border-red-500/50 focus:bg-red-500/5 transition-all placeholder:text-neutral-700 font-bold"
                    value={signupForm.fullName}
                    onChange={e => setSignupForm({ ...signupForm, fullName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[8px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-white text-sm font-medium outline-none focus:border-red-500/50 focus:bg-red-500/5 transition-all placeholder:text-neutral-700 font-bold"
                    value={signupForm.email}
                    onChange={e => setSignupForm({ ...signupForm, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[8px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-1">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-white text-sm font-medium outline-none focus:border-red-500/50 focus:bg-red-500/5 transition-all placeholder:text-neutral-700 font-bold font-mono"
                      value={signupForm.password}
                      onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[8px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-1">Confirm</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-white text-sm font-medium outline-none focus:border-red-500/50 focus:bg-red-500/5 transition-all placeholder:text-neutral-700 font-bold font-mono"
                      value={signupForm.confirmPassword}
                      onChange={e => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-red-600 text-white font-black rounded-2xl uppercase tracking-[0.2em] shadow-xl shadow-red-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black selection:bg-red-500/30">
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
                <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center text-red-600 border border-red-500/20">
                  <Lock className="w-10 h-10" />
                </div>
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-black italic uppercase italic tracking-tighter">Access Locked</h2>
                  <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest">Authentication required for program access</p>
                </div>
                <button
                  onClick={() => setShowAuthChoice(true)}
                  className="px-10 py-5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-red-900/40"
                >
                  Enable Access
                </button>
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
                      <div className="space-y-1">
                        {(profile?.fullName || user?.user_metadata?.full_name || user?.email) && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-red-600/10 rounded-full border border-red-500/20 w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <p className="text-[10px] md:text-xs font-black text-red-500 uppercase tracking-[0.2em]">
                              Personalized Identity • {(profile?.fullName || user?.user_metadata?.full_name || user?.email)?.split(' ')[0]}
                            </p>
                          </div>
                        )}
                        <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.9] text-white">
                          Hello, <span className="text-red-600">{(profile?.fullName || user?.user_metadata?.full_name || user?.email)?.split(' ')[0] || 'Athlete'}</span>
                        </h2>
                        <h3 className="text-xl md:text-3xl font-black italic tracking-tighter uppercase leading-none text-neutral-500">
                          {t('workout.title')}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(220,30,58,0.3)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-white">Week {currentWeek}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                        <span className="text-[11px] font-black uppercase tracking-widest text-neutral-400 italic">Active System</span>
                      </div>
                    </div>
                  </div>

                  {/* Week Selector */}
                  <div className="w-full flex justify-center md:justify-start">
                    <WeekSelector
                      currentWeek={currentWeek}
                      onWeekSelect={handleWeekSelect}
                      completedWeeks={[]}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {workoutSplit.map((workout) => (
                      <WorkoutCard
                        key={workout.id}
                        workout={workout}
                        onClick={() => setSelectedWorkout(workout)}
                      />
                    ))}
                  </div>

                  <div className="pt-10 flex justify-center">
                    <button
                      onClick={() => setShowHowItWorks(true)}
                      className="flex items-center gap-2 text-[9px] font-black text-neutral-600 hover:text-white uppercase tracking-[0.4em] transition-all"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[200] flex items-center justify-center p-6 animate-fade-in text-white">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg aspect-square bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="glass-card w-full max-w-md p-8 border-white/10 shadow-2xl relative overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center mb-10">
              <div className="space-y-1 text-left">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Initialize</h2>
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Create Your Program Copy</p>
              </div>
              <button onClick={() => setShowSignupForm(false)} className="p-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSignupSubmit} className="space-y-5 text-left">
              <div className="space-y-2">
                <label className="block text-[8px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-1">Full Identity</label>
                <input
                  type="text"
                  placeholder="E.g. John Wick"
                  className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-white text-sm font-medium outline-none focus:border-red-500/50 focus:bg-red-500/5 transition-all placeholder:text-neutral-700 font-bold"
                  value={signupForm.fullName}
                  onChange={e => setSignupForm({ ...signupForm, fullName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[8px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-white text-sm font-medium outline-none focus:border-red-500/50 focus:bg-red-500/5 transition-all placeholder:text-neutral-700 font-bold"
                  value={signupForm.email}
                  onChange={e => setSignupForm({ ...signupForm, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[8px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-1">Security Key</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-white text-sm font-medium outline-none focus:border-red-500/50 focus:bg-red-500/5 transition-all placeholder:text-neutral-700 font-bold font-mono"
                    value={signupForm.password}
                    onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[8px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-1">Confirm</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-white text-sm font-medium outline-none focus:border-red-500/50 focus:bg-red-500/5 transition-all placeholder:text-neutral-700 font-bold font-mono"
                    value={signupForm.confirmPassword}
                    onChange={e => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-red-600 text-white font-black rounded-2xl uppercase tracking-[0.2em] shadow-xl shadow-red-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Syncing...' : 'Build My Program'}
              </button>
            </form>
          </div>
        </div>
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
