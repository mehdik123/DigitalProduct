import { X, Dumbbell, Repeat, Timer } from 'lucide-react';
import { IconButton, Button } from './ui';

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
        },
        {
            icon: Dumbbell,
            title: 'Reps (Repetitions)',
            description: 'The number of times you perform a specific movement. For example, lifting a dumbbell up and down 8 times = 8 reps.',
        },
        {
            icon: Dumbbell,
            title: 'Weight',
            description: 'The amount of resistance you\'re using (in kg or lbs). Start light to master form, then gradually increase as you get stronger.',
        },
        {
            icon: Timer,
            title: 'Rest',
            description: 'The time you wait between sets to recover. Proper rest ensures you can perform each set with good form and intensity.',
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-hair bg-surface-1 shadow-soft">
                {/* Header */}
                <div className="sticky top-0 flex items-center justify-between border-b border-hair bg-surface-1 p-6">
                    <div>
                        <h2 className="font-display text-3xl font-black uppercase italic tracking-tight text-txt-hi">
                            Exercise Tracking Guide
                        </h2>
                        <p className="mt-1 text-xs font-medium text-txt-lo">
                            Learn the basics of tracking your workouts
                        </p>
                    </div>
                    <IconButton aria-label="close" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </IconButton>
                </div>

                {/* Content */}
                <div className="space-y-4 p-6">
                    {helpItems.map((item, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-hair bg-surface-2 p-5 transition-colors hover:border-brand/30"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-hair bg-surface-3 text-brand">
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="mb-2 font-display text-lg font-extrabold uppercase italic tracking-tight text-txt-hi">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-txt-mid">{item.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Beginner Tips */}
                    <div className="rounded-2xl border border-brand/30 bg-brand-soft p-5">
                        <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-extrabold uppercase italic tracking-tight text-brand">
                            <span>💡</span> Beginner Tips
                        </h3>
                        <ul className="space-y-2 text-sm text-txt-mid">
                            <li className="flex items-start gap-2">
                                <span className="font-bold text-brand">•</span>
                                <span><strong className="text-txt-hi">Start light:</strong> Focus on proper form before adding weight</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-bold text-brand">•</span>
                                <span><strong className="text-txt-hi">Track everything:</strong> Log weight and reps for each set to monitor progress</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-bold text-brand">•</span>
                                <span><strong className="text-txt-hi">Progressive overload:</strong> Gradually increase weight or reps over time</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-bold text-brand">•</span>
                                <span><strong className="text-txt-hi">Rest matters:</strong> Don't skip rest periods - they're crucial for performance</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 border-t border-hair bg-surface-1 p-6">
                    <Button variant="primary" size="lg" fullWidth onClick={onClose}>
                        Got it!
                    </Button>
                </div>
            </div>
        </div>
    );
}
