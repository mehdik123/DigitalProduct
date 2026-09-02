import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { Mail, KeyRound, ShieldCheck, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button, Eyebrow, Input, Field, BrandMark } from './ui';
import LanguageToggle from './LanguageToggle';

export default function LoginPage() {
    const navigate = useNavigate();
    const { t } = useLanguage();
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
        <div className="bg-hero relative flex min-h-dvh flex-col items-center justify-center overflow-x-hidden overflow-y-auto p-5 sm:p-6">
            {/* Ambient grid + diagonal speed streak (the brand signature). */}
            <div className="ambient-grid pointer-events-none absolute inset-0 opacity-40" />
            <div className="ambient-streak pointer-events-none absolute -left-[30%] -top-[10%] h-[46%] w-[160%]" />

            <div className="relative z-10 w-full max-w-md">
                <div className="mb-6 flex animate-rise items-center justify-between opacity-0" style={{ animationDelay: '.05s' }}>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        aria-label={t('common.back')}
                        className="grid h-9 w-9 place-items-center rounded-full border border-hair bg-surface-2 text-txt-mid transition-colors hover:text-txt-hi active:scale-95 rtl:rotate-180"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <LanguageToggle />
                </div>

                <div className="mb-7 flex animate-rise justify-center opacity-0" style={{ animationDelay: '.08s' }}>
                    <BrandMark />
                </div>

                <div className="mb-8 flex animate-rise flex-col items-center text-center opacity-0" style={{ animationDelay: '.12s' }}>
                    <Eyebrow>{t('welcome.eyebrow')}</Eyebrow>
                    <h1 className="mt-4 font-display text-display-lg font-black uppercase italic leading-none tracking-tight text-txt-hi">
                        {t('common.login')}
                    </h1>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
                    className="overflow-hidden rounded-3xl border border-hair bg-surface-1 p-7 shadow-soft md:p-8"
                >
                    <form onSubmit={handleLogin} className="space-y-5 text-left rtl:text-right">
                        <Field label={t('signup.email')} htmlFor="login-email">
                            <Input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                icon={<Mail className="h-4 w-4" />}
                                required
                                disabled={loading}
                            />
                        </Field>

                        <Field label={t('signup.password')} htmlFor="login-password">
                            <Input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                icon={<KeyRound className="h-4 w-4" />}
                                required
                                disabled={loading}
                            />
                        </Field>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-2xl border border-brand/20 bg-brand-soft p-4"
                            >
                                <p className="text-[11px] font-bold uppercase leading-relaxed tracking-tight text-brand">
                                    {error}
                                </p>
                            </motion.div>
                        )}

                        <Button type="submit" fullWidth size="lg" disabled={loading}>
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <ShieldCheck className="h-5 w-5" />
                                    <span>{t('common.login')}</span>
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-7 border-t border-hair pt-6 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="group inline-flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.3em] text-txt-lo transition-colors hover:text-txt-hi"
                        >
                            <ArrowRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1.5 rtl:rotate-0 rtl:group-hover:translate-x-1.5" />
                            {t('common.backToHome')}
                        </button>
                    </div>
                </motion.div>

                <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-txt-lo">
                    <ShieldCheck className="h-[13px] w-[13px] text-emerald" />
                    {t('welcome.trust')}
                </div>
            </div>
        </div>
    );
}
