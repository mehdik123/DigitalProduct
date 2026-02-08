import { useNavigate } from 'react-router-dom';
import { Dumbbell, Home, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LanguageToggle from './LanguageToggle';

interface HeaderProps {
  onSignup: () => void;
  showAuthButtons?: boolean;
}

export default function Header({ }: HeaderProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <div className="w-full flex items-center justify-between px-4 md:px-8 py-4 bg-black/60 backdrop-blur-xl border-b border-white/5 sticky top-0 z-[60] supports-[backdrop-filter]:bg-black/20">
      {/* Brand Identity */}
      <div
        onClick={() => navigate('/')}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-red-600 blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
          <div className="relative w-10 h-10 bg-gradient-to-br from-zinc-900 to-black rounded-xl border border-white/10 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-500">
            <Dumbbell className="w-5 h-5 text-red-500 fill-current" />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-black italic uppercase tracking-tighter leading-none text-white group-hover:text-red-500 transition-colors">
            Hybrid
          </h1>
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] group-hover:text-zinc-300 transition-colors">Athlete v1.2</span>
        </div>
      </div>

      {/* Action Zone */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Quick Nav - Desktop Hidden (Simplified) */}
        <div className="flex md:hidden items-center gap-1">
          <button onClick={() => navigate('/')} className="p-2 text-zinc-500 hover:text-white transition-colors">
            <Home className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="scale-90 opacity-80 hover:opacity-100 transition-opacity">
            <LanguageToggle />
          </div>

          {user && (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 hover:bg-red-600/10 text-zinc-400 hover:text-red-500 rounded-lg border border-white/5 hover:border-red-500/50 transition-all font-bold uppercase tracking-wider text-[10px] group"
            >
              <span>Exit</span>
              <LogOut className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
