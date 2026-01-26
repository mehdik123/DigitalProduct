import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate('/');
            }
        });
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('Attempting login...');

            // Use Promise.race to prevent hanging
            const loginPromise = supabase.auth.signInWithPassword({
                email,
                password,
            });

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Login timeout')), 10000)
            );

            const { data, error } = await Promise.race([loginPromise, timeoutPromise]) as any;

            if (error) {
                console.error('Login error:', error);
                setError(error.message || 'Invalid email or password');
                setLoading(false);
                return;
            }

            console.log('Login response received:', { hasSession: !!data?.session, hasUser: !!data?.user });

            // Check localStorage for session (more reliable than waiting for promise)
            setTimeout(() => {
                const keys = Object.keys(localStorage);
                const hasSession = keys.some(k => k.startsWith('sb-') && k.includes('auth-token'));

                if (hasSession || (data?.session && data?.user)) {
                    console.log('Session detected, redirecting...');
                    window.location.href = '/';
                } else {
                    console.error('No session found after login');
                    setError('Login failed. Please try again.');
                    setLoading(false);
                }
            }, 1000);

        } catch (error: any) {
            console.error('Login exception:', error);

            // Even if promise hangs, check localStorage
            setTimeout(() => {
                const keys = Object.keys(localStorage);
                const hasSession = keys.some(k => k.startsWith('sb-') && k.includes('auth-token'));

                if (hasSession) {
                    console.log('Session found in localStorage despite error, redirecting...');
                    window.location.href = '/';
                } else {
                    setError(error.message || 'An unexpected error occurred');
                    setLoading(false);
                }
            }, 1000);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-red-500/30">
            {/* Advanced Atmospheric FX */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-red-600/10 rounded-full blur-[160px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-neutral-900/40 rounded-full blur-[160px]" />
            </div>

            <div className="relative z-10 w-full max-w-md animate-slide-up text-white">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 mb-8 shadow-2xl backdrop-blur-2xl relative group">
                        <div className="absolute inset-0 bg-red-600/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Lock className="w-10 h-10 text-red-500 relative z-10" />
                    </div>
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-3 leading-none text-white">
                        Athlete Login
                    </h1>
                    <p className="text-neutral-500 font-extrabold uppercase tracking-[0.4em] text-[10px]">
                        Hybrid Athlete Program v1.1
                    </p>
                </div>

                <div className="bg-[#0d1117] p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-transparent opacity-50" />

                    <form onSubmit={handleLogin} className="space-y-6 text-left relative z-10">
                        <div className="space-y-2">
                            <label className="block text-[9px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-white text-sm font-medium outline-none focus:border-red-500/50 focus:bg-red-500/5 transition-all placeholder:text-neutral-700 shadow-inner shadow-black/20"
                                placeholder="name@example.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[9px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-white text-sm font-medium outline-none focus:border-red-500/50 focus:bg-red-500/5 transition-all placeholder:text-neutral-700 shadow-inner shadow-black/20"
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-fade-in">
                                <p className="text-[10px] text-red-500 font-black uppercase tracking-tight leading-relaxed">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-4 py-6 bg-red-600 text-white font-black rounded-2xl uppercase tracking-[0.25em] text-xs shadow-2xl shadow-red-900/40 hover:scale-[1.03] active:scale-[0.97] transition-all disabled:opacity-50 group mb-4"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    <span>Login Now</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 text-center relative z-10">
                        <button
                            onClick={() => navigate('/')}
                            className="group inline-flex items-center gap-3 text-neutral-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em]"
                        >
                            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-2 transition-transform" />
                            Return to Portal
                        </button>
                    </div>
                </div>

                <div className="mt-12 flex items-center justify-center gap-6 opacity-20">
                    <div className="h-px w-12 bg-neutral-500" />
                    <p className="text-[9px] font-black text-white uppercase tracking-[0.5em]">System Secure 256-Bit</p>
                    <div className="h-px w-12 bg-neutral-500" />
                </div>
            </div>
        </div>
    );
}
