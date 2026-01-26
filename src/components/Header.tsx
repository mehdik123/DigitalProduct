import { useNavigate } from 'react-router-dom';
import { Dumbbell, Home, Utensils, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LanguageToggle from './LanguageToggle';

interface HeaderProps {
  onSignup: () => void;
  showAuthButtons?: boolean;
}

export default function Header({ showAuthButtons = true }: HeaderProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <div className="w-full flex items-center justify-between px-4 md:px-8 py-3 md:py-6 bg-black/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-[60]">
      {/* Brand Identity */}
      <div
        onClick={() => navigate('/')}
        className="flex items-center gap-2 md:gap-3 cursor-pointer group"
      >
        <div className="w-8 h-8 md:w-12 md:h-12 bg-red-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(220,30,58,0.4)] group-hover:rotate-12 transition-all">
          <Dumbbell className="w-5 h-5 md:w-7 md:h-7 text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm md:text-2xl font-black italic uppercase tracking-tighter leading-none text-white">
            Hybrid Athlete
          </h1>
          <span className="text-[6px] md:text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Program v1.1</span>
        </div>
      </div>

      {/* Action Zone */}
      <div className="flex items-center gap-2 md:gap-6">
        {/* Quick Nav - Desktop Hidden */}
        <div className="flex md:hidden items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10">
          <button onClick={() => navigate('/')} className="p-1.5 text-neutral-400 hover:text-white transition-colors">
            <Home className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => navigate('/nutrition')} className="p-1.5 text-neutral-400 hover:text-white transition-colors">
            <Utensils className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="scale-75 md:scale-100">
            <LanguageToggle />
          </div>

          {user && (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-lg md:rounded-xl border border-red-500/20 hover:border-red-600 transition-all font-black uppercase tracking-widest text-[8px] md:text-[10px] shadow-lg shadow-red-600/5 group"
            >
              <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-0.5 transition-transform" />
              <span className="hidden xs:inline">Log Out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
