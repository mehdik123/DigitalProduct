
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="relative inline-flex bg-neutral-900 border border-white/5 p-1 rounded-2xl shadow-inner shadow-black/50">
            {/* Sliding Indicator */}
            <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] transition-all duration-300 ease-out rounded-xl shadow-lg shadow-blue-500/20 ${language === 'en' ? 'left-1 bg-blue-600' : 'left-[calc(50%+2px)] bg-blue-600'
                    }`}
            />

            <button
                onClick={() => setLanguage('en')}
                className={`relative z-10 px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${language === 'en' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                    }`}
            >
                EN
            </button>
            <button
                onClick={() => setLanguage('ar')}
                className={`relative z-10 px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${language === 'ar' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                    }`}
            >
                AR
            </button>
        </div>
    );
}
