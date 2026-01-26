import { X, UserPlus, LogIn, ChevronRight } from 'lucide-react';

interface AuthChoiceModalProps {
    onClose: () => void;
    onJoin: () => void;
    onLogin: () => void;
}

export default function AuthChoiceModal({ onClose, onJoin, onLogin }: AuthChoiceModalProps) {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[150] flex items-center justify-center p-6 animate-fade-in">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg aspect-square bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="glass-card w-full max-w-md p-8 md:p-10 border-white/10 shadow-2xl relative overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="flex justify-between items-start mb-10">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none text-white">Entry Choice</h2>
                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Select your authentication path</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 text-neutral-500 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Choices */}
                <div className="space-y-6">
                    <button
                        onClick={onJoin}
                        className="w-full group relative bg-red-600 p-8 rounded-[2rem] flex items-center justify-between shadow-2xl shadow-red-900/40 transition-all hover:scale-[1.03] active:scale-[0.97]"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                                <UserPlus className="w-7 h-7" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Join Program</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/60">New Athletes</p>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform" />
                    </button>

                    <button
                        onClick={onLogin}
                        className="w-full group relative bg-white p-8 rounded-[2rem] flex items-center justify-between shadow-2xl transition-all hover:scale-[1.03] active:scale-[0.97]"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center text-black">
                                <LogIn className="w-7 h-7" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-black uppercase italic tracking-tighter text-black">Login</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Returning Athletes</p>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-black group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>

                <p className="mt-10 text-center text-[9px] font-black text-neutral-600 uppercase tracking-[0.4em]">
                    Secure Access Required for Program Tracking
                </p>
            </div>
        </div>
    );
}
