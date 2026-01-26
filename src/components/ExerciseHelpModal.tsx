import { X, Dumbbell, Repeat, Timer } from 'lucide-react';

interface ExerciseHelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ExerciseHelpModal({ isOpen, onClose }: ExerciseHelpModalProps) {
    if (!isOpen) return null;

    const helpItems = [
        {
            icon: Repeat,
            title: 'Sets',
            description: 'A "set" is a group of repetitions performed without rest. For example, if you do 10 push-ups, rest, then do 10 more, that\'s 2 sets of 10 reps.',
            color: 'text-blue-400'
        },
        {
            icon: Dumbbell,
            title: 'Reps (Repetitions)',
            description: 'The number of times you perform a specific movement. For example, lifting a dumbbell up and down 8 times = 8 reps.',
            color: 'text-green-400'
        },
        {
            icon: Dumbbell,
            title: 'Weight',
            description: 'The amount of resistance you\'re using (in kg or lbs). Start light to master form, then gradually increase as you get stronger.',
            color: 'text-purple-400'
        },
        {
            icon: Timer,
            title: 'Rest',
            description: 'The time you wait between sets to recover. Proper rest ensures you can perform each set with good form and intensity.',
            color: 'text-orange-400'
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-red-600/30 rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                            Exercise Tracking Guide
                        </h2>
                        <p className="text-xs text-gray-400 font-medium mt-1">
                            Learn the basics of tracking your workouts
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600/20 hover:bg-red-600/30 transition-all"
                    >
                        <X className="w-5 h-5 text-red-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {helpItems.map((item, index) => (
                        <div
                            key={index}
                            className="bg-slate-800/50 border border-white/5 rounded-xl p-5 hover:border-red-600/30 transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 flex-shrink-0 bg-black rounded-xl flex items-center justify-center border border-white/10">
                                    <item.icon className={`w-6 h-6 ${item.color}`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Beginner Tips */}
                    <div className="bg-red-600/10 border border-red-600/30 rounded-xl p-5">
                        <h3 className="text-lg font-black text-red-500 uppercase tracking-tight mb-3 flex items-center gap-2">
                            <span>💡</span> Beginner Tips
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 font-bold">•</span>
                                <span><strong className="text-white">Start light:</strong> Focus on proper form before adding weight</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 font-bold">•</span>
                                <span><strong className="text-white">Track everything:</strong> Log weight and reps for each set to monitor progress</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 font-bold">•</span>
                                <span><strong className="text-white">Progressive overload:</strong> Gradually increase weight or reps over time</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 font-bold">•</span>
                                <span><strong className="text-white">Rest matters:</strong> Don't skip rest periods - they're crucial for performance</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-slate-900 border-t border-white/10 p-6">
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl uppercase tracking-wider transition-all"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
}
