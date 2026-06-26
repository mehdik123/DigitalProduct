import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, User, Mail, KeyRound } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button, Input, Field, IconButton, BrandMark } from './ui';
import { celebrateVariants } from '../design/motion';

interface SignupModalProps {
  onClose: () => void;
  onSubmit: (data: { fullName: string; email: string; password: string }) => Promise<void> | void;
  loading?: boolean;
}

export default function SignupModal({ onClose, onSubmit, loading }: SignupModalProps) {
  const { t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim() || !email.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    onSubmit({ fullName: fullName.trim(), email: email.trim(), password });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-6 backdrop-blur-2xl"
    >
      {/* Ambient grid behind the card. */}
      <div className="ambient-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-soft blur-[120px]" />

      <motion.div
        variants={celebrateVariants}
        initial="hidden"
        animate="show"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-hair bg-surface-1 p-7 shadow-soft md:p-8"
      >
        <div className="mb-7 flex items-start justify-between">
          <div className="space-y-4">
            <BrandMark />
            <h2 className="font-display text-3xl font-black uppercase italic leading-none tracking-tight text-txt-hi">
              {t('signup.title')}
            </h2>
          </div>
          <IconButton aria-label="close" onClick={onClose}>
            <X className="h-4 w-4" />
          </IconButton>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left rtl:text-right">
          <Field label={t('signup.fullName')} htmlFor="signup-name">
            <Input
              id="signup-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="E.g. John Wick"
              icon={<User className="h-4 w-4" />}
            />
          </Field>

          <Field label={t('signup.email')} htmlFor="signup-email">
            <Input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              icon={<Mail className="h-4 w-4" />}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t('signup.password')} htmlFor="signup-password">
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={<KeyRound className="h-4 w-4" />}
              />
            </Field>
            <Field label={t('signup.confirmPassword')} htmlFor="signup-confirm">
              <Input
                id="signup-confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                icon={<KeyRound className="h-4 w-4" />}
              />
            </Field>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-brand/20 bg-brand-soft p-3"
            >
              <p className="text-[11px] font-bold uppercase tracking-tight text-brand">{error}</p>
            </motion.div>
          )}

          <Button type="submit" fullWidth size="lg" disabled={loading} className="mt-2">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : t('signup.createAccount')}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
}
