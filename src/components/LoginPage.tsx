import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Lock, ShieldCheck } from 'lucide-react';

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
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                navigate('/');
            }
        } catch (error: any) {
            setError(error.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-800">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
                            <Lock className="w-8 h-8 text-blue-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Secure Login
                        </h1>
                        <p className="text-slate-400 text-sm">
                            Enter your credentials to access your program
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-700 text-white rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none"
                                placeholder="Enter your email"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-700 text-white rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none"
                                placeholder="Enter your password"
                                required
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border-l-4 border-red-500 p-4 rounded-lg">
                                <p className="text-sm text-red-200">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? 'Verifying...' : (
                                <>
                                    <ShieldCheck className="w-5 h-5" />
                                    Access Program
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                        <p className="text-xs text-slate-500 mb-4">
                            Secure connection • 256-bit encryption
                        </p>
                        <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
                            ← Return to Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
