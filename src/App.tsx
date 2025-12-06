import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import WorkoutCard from './components/WorkoutCard';
import WorkoutPage from './components/WorkoutPage';
import WeekSelector from './components/WeekSelector';
import { workoutSplit } from './data/workoutData';
import { WorkoutDay } from './types/workout';
import { X, Copy, Check } from 'lucide-react';
import { supabase } from './lib/supabaseClient';

function App() {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutDay | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [generatedCredentials, setGeneratedCredentials] = useState<{ username: string, password: string, name?: string, uniqueLink?: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [signupForm, setSignupForm] = useState({ fullName: '', email: '' });

  // Load session and user profile from Supabase
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load user profile from database
  const loadUserProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setUserProfile(data);
      setCurrentWeek(data.current_week || 1);
    }
  };

  // Generate secure password
  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Handle signup form submission with Supabase
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupForm.fullName.trim() || !signupForm.email.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupForm.email)) {
      alert('Please enter a valid email address');
      return;
    }

    const password = generateSecurePassword();

    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: signupForm.email,
        password: password,
        options: {
          data: {
            full_name: signupForm.fullName
          }
        }
      });

      if (error) {
        console.error('Supabase signup error:', error);
        alert(`Error creating account: ${error.message}\n\nFull error: ${JSON.stringify(error, null, 2)}`);
        return;
      }

      if (data.user) {
        // Immediately sign out to force manual login
        await supabase.auth.signOut();

        setGeneratedCredentials({
          username: signupForm.email,
          password: password,
          name: signupForm.fullName,
          uniqueLink: `${window.location.origin}/#/login/returning`
        });
        setShowSignupForm(false);
        setShowModal(true);
        setSignupForm({ fullName: '', email: '' });
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      alert(`An error occurred during signup: ${err.message || 'Please try again.'}\n\nDetails: ${JSON.stringify(err, null, 2)}`);
    }
  };

  // Copy credentials to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Update current week in database
  const handleWeekSelect = async (week: number) => {
    setCurrentWeek(week);
    if (session?.user && userProfile) {
      await supabase
        .from('profiles')
        .update({ current_week: week })
        .eq('id', session.user.id);
    }
  };

  // Logout function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserProfile(null);
    setSession(null);
  };

  // Show workout detail page
  if (selectedWorkout) {
    return (
      <WorkoutPage
        workout={selectedWorkout}
        weekNumber={currentWeek}
        onBack={() => setSelectedWorkout(null)}
        session={session}
        userProfile={userProfile}
      />
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <Header />

        {/* User Info Banner (if logged in) */}
        {userProfile && (
          <div className="mb-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-2xl p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white mb-1">
                  Welcome, {userProfile.full_name}! 💪
                </h3>
                <p className="text-sm text-gray-300">
                  Your progress is being tracked. Keep crushing it!
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-white underline"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Create My Own Copy Button (if not logged in) */}
        {!userProfile && (
          <div className="mb-6 md:mb-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500/50 rounded-2xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-black text-white mb-2">Ready to Start Your Journey?</h3>
                <p className="text-sm md:text-base text-gray-300">
                  Create your own copy to track progress, log weights, and see your gains over 8 weeks!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={() => setShowSignupForm(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-6 md:px-8 py-3 md:py-4 rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                >
                  Create My Own Copy
                </button>
                <button
                  onClick={() => navigate('/login/returning')}
                  className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 md:px-8 py-3 md:py-4 rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all whitespace-nowrap border border-slate-600"
                >
                  Already Have Account?
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Week Selector - Only show if logged in */}
        {userProfile && (
          <div className="mb-6 md:mb-8">
            <WeekSelector
              currentWeek={currentWeek}
              onWeekSelect={handleWeekSelect}
              completedWeeks={[]}
            />
          </div>
        )}

        {/* Workout Selection */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
            5-Day Training Split{userProfile ? ` - Week ${currentWeek}` : ''}
          </h2>
          <p className="text-sm md:text-lg text-gray-400">
            {userProfile ? 'Select a workout to log your weights' : 'Select a workout to view exercises'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {workoutSplit.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onClick={() => setSelectedWorkout(workout)}
            />
          ))}
        </div>

        {/* Program Info Cards */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-blue-500/20 hover:border-blue-500/40 transition-colors">
            <div className="text-3xl md:text-4xl mb-3">🤸</div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-2">Calisthenics Focus</h3>
            <p className="text-xs md:text-sm text-gray-400">
              Master bodyweight movements for functional strength and mobility
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-orange-500/20 hover:border-orange-500/40 transition-colors">
            <div className="text-3xl md:text-4xl mb-3">🏋️</div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-2">Bodybuilding Power</h3>
            <p className="text-xs md:text-sm text-gray-400">
              Build muscle mass with progressive overload and targeted hypertrophy
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-purple-500/20 hover:border-purple-500/40 transition-colors">
            <div className="text-3xl md:text-4xl mb-3">⚡</div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-2">
              {userProfile ? '8-Week Program' : 'Progressive Training'}
            </h3>
            <p className="text-xs md:text-sm text-gray-400">
              {userProfile
                ? 'Progressive periodization with deload and peak weeks for maximum results'
                : 'Structured program designed for continuous strength and muscle gains'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Signup Form Modal */}
      {showSignupForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowSignupForm(false)}>
          <div className="bg-slate-800 rounded-2xl p-6 md:p-8 max-w-md w-full border border-slate-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-white">Create Your Program</h3>
              <button onClick={() => setShowSignupForm(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-300 mb-6">
              Enter your details to get started with your personalized 8-week workout program
            </p>

            <form onSubmit={handleSignupSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={signupForm.fullName}
                  onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none"
                  placeholder="john@example.com"
                  required
                />
                <p className="text-xs text-gray-400 mt-2">
                  Your email will be used as your username
                </p>
              </div>

              <div className="bg-blue-500/20 border-l-4 border-blue-500 p-4 rounded-lg">
                <p className="text-sm text-blue-200">
                  <span className="font-bold">🔒 Secure:</span> We'll generate a strong password for you
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                Generate My Program
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Credentials Modal */}
      {showModal && generatedCredentials && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-slate-800 rounded-2xl p-6 md:p-8 max-w-md w-full border border-slate-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-black text-white">🎉 Welcome, {generatedCredentials.name}!</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-300 mb-6">
              <span className="text-amber-400 font-bold">Action Required:</span> Please copy your credentials below. You will need to manually enter them on the next screen to access your program.
            </p>

            {/* Unique Login Link */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border-2 border-blue-500/50 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-blue-300">YOUR PERSONAL LINK</span>
                <button
                  onClick={() => copyToClipboard(generatedCredentials.uniqueLink || '')}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-white font-mono text-xs break-all">{generatedCredentials.uniqueLink}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-400">EMAIL (USERNAME)</span>
                  <button
                    onClick={() => copyToClipboard(generatedCredentials.username)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-white font-mono text-lg break-all">{generatedCredentials.username}</p>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-400">PASSWORD</span>
                  <button
                    onClick={() => copyToClipboard(generatedCredentials.password)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-white font-mono text-sm break-all">{generatedCredentials.password}</p>
              </div>
            </div>

            <div className="bg-amber-500/20 border-l-4 border-amber-500 p-4 rounded-lg mb-6">
              <p className="text-sm text-amber-200">
                <span className="font-bold">⚠️ Important:</span> Screenshot this page! Click your personal link and use these credentials to login.
              </p>
            </div>

            <button
              onClick={() => navigate('/login/returning')}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all"
            >
              Go to Login Page →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
