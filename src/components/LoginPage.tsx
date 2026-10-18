import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button, Eyebrow, Input, Field, IconButton } from './ui';
import LanguageToggle from './LanguageToggle';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';

/** P02 — Login: top-aligned form, no card, sentence-case labels. */
export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, signIn, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/');
    }
  }, [authLoading, user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const timeout = new Promise<{ error: { message: string } }>((_, reject) =>
        setTimeout(() => reject(new Error('Login timeout')), 15000)
      );
      const result = await Promise.race([signIn(email, password), timeout]);

      if (result.error) {
        setError(t('login.error'));
        setLoading(false);
        return;
      }

      window.location.href = '/';
    } catch {
      setError(t('login.error'));
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email.trim()) {
      setError(t('login.emailRequired'));
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setResetSent(true);
      setError('');
    } catch {
      setError(t('login.error'));
    }
  };

  return (
    <div className="relative min-h-dvh w-full bg-bg text-txt-hi">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pb-6 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <IconButton aria-label={t('common.back')} onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5 rtl:rotate-180" strokeWidth={1.75} />
          </IconButton>
          <LanguageToggle />
        </div>

        <div className="mt-7">
          <Eyebrow>{t('login.eyebrow')}</Eyebrow>
          <h1 className="mt-4 font-display text-[46px] font-semibold uppercase leading-none tracking-tight text-txt-hi">
            {t('common.login')}
          </h1>
          <p className="mt-2.5 text-[15px] leading-[22px] text-txt-mid">{t('login.lead')}</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 grid gap-[18px]">
          <Field label={t('signup.email')} htmlFor="login-email" error={error && !password ? error : undefined}>
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              disabled={loading}
              invalid={Boolean(error)}
              autoComplete="email"
            />
          </Field>

          <Field label={t('signup.password')} htmlFor="login-password">
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              invalid={Boolean(error)}
              autoComplete="current-password"
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-txt-lo hover:text-txt-mid"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" strokeWidth={1.75} />
                  ) : (
                    <Eye className="h-5 w-5" strokeWidth={1.75} />
                  )}
                </button>
              }
            />
          </Field>

          <div className="-mt-1 flex justify-end">
            <button
              type="button"
              onClick={handleForgot}
              className="text-sm font-semibold text-txt-hi"
            >
              {t('login.forgot')}
            </button>
          </div>

          {error && (
            <p className="text-[13px] font-medium text-brand">{error}</p>
          )}
          {resetSent && (
            <p className="text-[13px] font-medium text-txt-mid">{t('login.resetSent')}</p>
          )}

          <Button type="submit" fullWidth size="lg" disabled={loading} className="mt-2">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : t('common.login')}
          </Button>
        </form>

        <p className="mt-auto pb-[max(2rem,env(safe-area-inset-bottom))] pt-10 text-center text-sm font-medium text-txt-lo">
          {t('login.newHere')}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="ml-1.5 font-semibold text-txt-hi"
          >
            {t('common.createAccount')}
          </button>
        </p>
      </div>
    </div>
  );
}
