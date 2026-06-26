export type Language = 'en' | 'ar';

export interface Translations {
    [key: string]: {
        en: string;
        ar: string;
    };
}

// Technical terms that should NOT be translated
export const TECHNICAL_TERMS = [
    'protein', 'carbs', 'calories', 'fiber', 'macros',
    'push-up', 'pull-up', 'squat', 'deadlift', 'bench press',
    'dumbbell', 'barbell', 'kg', 'lbs', 'reps', 'sets'
];

export const translations: Translations = {
    // Welcome Portal
    'welcome.title': {
        en: 'Welcome',
        ar: 'مرحباً'
    },
    'welcome.subtitle': {
        en: 'Choose your focus for today. Master your body through training or fuel your performance through nutrition.',
        ar: 'اختر تركيزك لليوم. أتقن جسمك من خلال التدريب أو عزز أدائك من خلال التغذية.'
    },
    'welcome.training': {
        en: 'Training',
        ar: 'التدريب'
    },
    'welcome.training.description': {
        en: 'Access your 12-week progressive overload program, log workouts, and track PRs.',
        ar: 'الوصول إلى برنامج الحمل التدريجي لمدة 12 أسبوعاً، تسجيل التمارين، وتتبع الأرقام القياسية.'
    },
    'welcome.nutrition': {
        en: 'Nutrition',
        ar: 'التغذية'
    },
    'welcome.nutrition.description': {
        en: 'Calculate macros, plan meals, and discover healthy alternatives for your goals.',
        ar: 'احسب السعرات، خطط للوجبات، واكتشف البدائل الصحية لأهدافك.'
    },
    'welcome.startWorkout': {
        en: 'Start Workout',
        ar: 'ابدأ التمرين'
    },
    'welcome.openKitchen': {
        en: 'Open Kitchen',
        ar: 'افتح المطبخ'
    },
    // Welcome / Login entry screen
    'welcome.eyebrow': {
        en: '12-Week Program',
        ar: 'برنامج 12 أسبوعاً'
    },
    'welcome.tagline': {
        en: 'Build real strength and an engine that lasts — one program, twelve weeks, no hype.',
        ar: 'ابنِ قوة حقيقية ولياقة تدوم — برنامج واحد، اثنا عشر أسبوعاً، بلا مبالغة.'
    },
    'welcome.stat.program': {
        en: 'Program',
        ar: 'البرنامج'
    },
    'welcome.stat.sessions': {
        en: 'Sessions',
        ar: 'الحصص'
    },
    'welcome.stat.focus': {
        en: 'Strength · Engine',
        ar: 'قوة · لياقة'
    },
    'welcome.join.subtitle': {
        en: 'Start your 12 weeks today',
        ar: 'ابدأ أسابيعك الـ12 اليوم'
    },
    'welcome.login.subtitle': {
        en: 'Already have an account?',
        ar: 'لديك حساب بالفعل؟'
    },
    'welcome.trust': {
        en: 'Secure sign-in · coached by El Mehdi',
        ar: 'تسجيل دخول آمن · بإشراف المهدي'
    },
    'welcome.choosePath.line1': {
        en: 'Choose Your',
        ar: 'اختر'
    },
    'welcome.choosePath.line2': {
        en: 'Path',
        ar: 'مسارك'
    },

    // Signup Flow
    'signup.title': {
        en: 'Create Your Program',
        ar: 'أنشئ برنامجك'
    },
    'signup.description': {
        en: 'Enter your details to get started with your personalized 12-week program',
        ar: 'أدخل بياناتك للبدء ببرنامجك الشخصي لمدة 12 أسبوعاً'
    },
    'signup.fullName': {
        en: 'Full Name',
        ar: 'الاسم الكامل'
    },
    'signup.email': {
        en: 'Email Address',
        ar: 'البريد الإلكتروني'
    },
    'signup.emailNote': {
        en: 'Your email will be used as your username',
        ar: 'سيتم استخدام بريدك الإلكتروني كاسم مستخدم'
    },
    'signup.password': {
        en: 'Password',
        ar: 'كلمة المرور'
    },
    'signup.confirmPassword': {
        en: 'Confirm Password',
        ar: 'تأكيد كلمة المرور'
    },
    'signup.passwordPlaceholder': {
        en: 'Min. 6 characters',
        ar: '6 أحرف كحد أدنى'
    },
    'signup.createAccount': {
        en: 'Build My Program',
        ar: 'أنشئ برنامجي'
    },
    'signup.howItWorks': {
        en: 'How It Works?',
        ar: 'كيف يعمل؟'
    },

    // How It Works Modal
    'howItWorks.title': {
        en: 'How "Get My Own Copy" Works',
        ar: 'كيف يعمل "أنشئ نسختي الخاصة"'
    },
    'howItWorks.step1.title': {
        en: 'Step 1: Create Your Account',
        ar: 'الخطوة 1: أنشئ حسابك'
    },
    'howItWorks.step1.description': {
        en: 'Enter your name, email, and choose a secure password.',
        ar: 'أدخل اسمك، بريدك الإلكتروني، واختر كلمة مرور آمنة.'
    },
    'howItWorks.step2.title': {
        en: 'Step 2: Login',
        ar: 'الخطوة 2: تسجيل الدخول'
    },
    'howItWorks.step2.description': {
        en: 'Use your email and the password you created to login to your account.',
        ar: 'استخدم بريدك الإلكتروني وكلمة المرور التي أنشأتها لتسجيل الدخول إلى حسابك.'
    },
    'howItWorks.step2.description_simplified': {
        en: 'Use your email and the password you created to login to your account.',
        ar: 'استخدم بريدك الإلكتروني وكلمة المرور التي أنشأتها لتسجيل الدخول إلى حسابك.'
    },
    'howItWorks.step3.title': {
        en: 'Step 3: Track Your Progress',
        ar: 'الخطوة 3: تتبع تقدمك'
    },
    'howItWorks.step3.description': {
        en: 'Log your workouts, track weights, and watch your progress over 12 weeks. Your data is saved automatically.',
        ar: 'سجل تمارينك، تتبع الأوزان، وراقب تقدمك على مدى 12 أسبوعاً. يتم حفظ بياناتك تلقائياً.'
    },
    'howItWorks.important': {
        en: 'Important: This creates a personal copy of the program just for you. Your progress is private and saved to your account.',
        ar: 'مهم: هذا ينشئ نسخة شخصية من البرنامج لك فقط. تقدمك خاص ومحفوظ في حسابك.'
    },
    'howItWorks.gotIt': {
        en: 'Got It!',
        ar: 'فهمت!'
    },

    // Success Modal
    'signup.success.title': {
        en: 'Account Created!',
        ar: 'تم إنشاء الحساب!'
    },
    'signup.success.message': {
        en: 'Your account has been successfully created. Please login with your email and password.',
        ar: 'تم إنشاء حسابك بنجاح. يرجى تسجيل الدخول باستخدام بريدك الإلكتروني وكلمة المرور.'
    },
    'signup.success.button': {
        en: 'Go to Login',
        ar: 'اذهب لتسجيل الدخول'
    },
    'signup.error.alreadyRegistered': {
        en: 'This email is already registered. Redirecting to login...',
        ar: 'هذا البريد الإلكتروني مسجل بالفعل. جاري التوجيه لتسجيل الدخول...'
    },
    'signup.timeoutRedirect': {
        en: 'Server is taking a moment. Account likely created! Redirecting to login...',
        ar: 'الخادم يستغرق لحظة. تم إنشاء الحساب على الأرجح! جاري التوجيه لتسجيل الدخول...'
    },

    // Credentials Modal
    'credentials.welcome': {
        en: 'Welcome',
        ar: 'مرحباً'
    },
    'credentials.actionRequired': {
        en: 'Action Required:',
        ar: 'إجراء مطلوب:'
    },
    'credentials.instruction': {
        en: 'Please copy your credentials below. You will need to manually enter them on the next screen to access your program.',
        ar: 'يرجى نسخ بيانات الاعتماد أدناه. ستحتاج إلى إدخالها يدوياً في الشاشة التالية للوصول إلى برنامجك.'
    },
    'credentials.copyPasswordInstruction': {
        en: 'Please copy your password below. You will need to remember your email and enter this password to access your program.',
        ar: 'يرجى نسخ كلمة المرور أدناه. ستحتاج إلى تذكر بريدك الإلكتروني وإدخال كلمة المرور هذه للوصول إلى برنامجك.'
    },
    'credentials.personalLink': {
        en: 'YOUR PERSONAL LINK',
        ar: 'رابطك الشخصي'
    },
    'credentials.email': {
        en: 'EMAIL',
        ar: 'البريد الإلكتروني'
    },
    'credentials.password': {
        en: 'PASSWORD',
        ar: 'كلمة المرور'
    },
    'credentials.warning': {
        en: 'Important:',
        ar: 'مهم:'
    },
    'credentials.warningText': {
        en: 'Screenshot this page! Click your personal link and use these credentials to login.',
        ar: 'التقط صورة لهذه الصفحة! انقر على رابطك الشخصي واستخدم بيانات الاعتماد هذه لتسجيل الدخول.'
    },
    'credentials.goToLogin': {
        en: 'Go to Login Page',
        ar: 'اذهب إلى صفحة تسجيل الدخول'
    },

    // Common
    'common.backToHome': {
        en: 'Back to Home',
        ar: 'العودة للرئيسية'
    },
    'common.logout': {
        en: 'Logout',
        ar: 'تسجيل الخروج'
    },
    'common.login': {
        en: 'Login',
        ar: 'تسجيل الدخول'
    },
    'common.createAccount': {
        en: 'Join Program',
        ar: 'انضم للبرنامج'
    },
    'common.alreadyHaveAccount': {
        en: 'Already Have Account?',
        ar: 'لديك حساب بالفعل؟'
    },

    // Workout Section
    'workout.title': {
        en: 'Personal Training Split',
        ar: 'برنامج التدريب الشخصي'
    },
    'workout.selectWorkout': {
        en: 'Select a workout to view exercises',
        ar: 'اختر تمريناً لعرض التمارين'
    },
    'workout.logWeights': {
        en: 'Select a workout to log your weights',
        ar: 'اختر تمريناً لتسجيل أوزانك'
    },
    'workout.week': {
        en: 'Week',
        ar: 'الأسبوع'
    },

    // Nutrition Section
    'nutrition.backToPortal': {
        en: 'Back to Brand Portal',
        ar: 'الرجوع للبوابة الرئيسية'
    },

    // Technical Explanations (Darija flavored)
    'workout.rpe.title': {
        en: 'RPE (Intensity)',
        ar: 'RPE (جهد التمرين)'
    },
    'workout.rpe.description': {
        en: 'RPE 10: Maximum effort. RPE 8: Could do 2 more reps. RPE 7: Challenging but smooth.',
        ar: 'RPE 10: مجهود قد جهدك. RPE 8: تقدر تزيد 2 مكررات. RPE 7: صعيب شوية ولكن كيدوز مزيان.'
    },
    'workout.progressive_overload.title': {
        en: 'Progressive Overload',
        ar: 'الحمل التدريجي (Progression)'
    },
    'workout.progressive_overload.description': {
        en: 'Gradually increase weights or reps every week to keep building muscle.',
        ar: 'كل سيمانة زيد شوية فالثقل ولا فالمكررات باش العضلة ديما تزيد تكبر.'
    },
    'workout.rest.description': {
        en: 'Rest between sets to recover your energy.',
        ar: 'ارتاح بين المجموعات باش ترجع الطاقة ديالك وتخدم السيت الجاي حسن.'
    },

    // Phases (12-week periodization)
    'phase.anatomical': { en: 'Anatomical Adaptation', ar: 'التأقلم التشريحي' },
    'phase.hypertrophy': { en: 'Hypertrophy', ar: 'التضخم العضلي' },
    'phase.deload': { en: 'Deload', ar: 'تخفيف الحمل' },
    'phase.strength': { en: 'Strength', ar: 'القوة' },
    'phase.peak': { en: 'Peak', ar: 'الذروة' },
    'phase.retest': { en: 'Retest', ar: 'إعادة الاختبار' },

    // Week selector / gating
    'week.label': { en: 'Week', ar: 'الأسبوع' },
    'week.locked.title': { en: 'Week Locked', ar: 'الأسبوع مقفل' },
    'week.locked.message': {
        en: 'Finish logging the current week to unlock this one.',
        ar: 'أكمل تسجيل الأسبوع الحالي لفتح هذا الأسبوع.'
    },
    'week.active': { en: 'In Progress', ar: 'قيد التنفيذ' },
    'week.completed': { en: 'Completed', ar: 'مكتمل' },

    // Targets & logging
    'log.target': { en: 'This week’s target', ar: 'هدف هذا الأسبوع' },
    'log.lastWeek': { en: 'Last week', ar: 'الأسبوع الماضي' },
    'log.reps': { en: 'Reps', ar: 'التكرارات' },
    'log.weight': { en: 'Weight', ar: 'الوزن' },
    'log.rpe': { en: 'RPE', ar: 'الجهد' },
    'log.set': { en: 'Set', ar: 'المجموعة' },
    'log.save': { en: 'Save', ar: 'حفظ' },
    'log.saving': { en: 'Saving…', ar: 'جارٍ الحفظ…' },
    'log.saved': { en: 'Saved', ar: 'تم الحفظ' },
    'log.update': { en: 'Update', ar: 'تحديث' },
    'log.done': { en: 'Done', ar: 'تم' },
    'log.noData': { en: 'Enter reps or weight before saving.', ar: 'أدخل التكرارات أو الوزن قبل الحفظ.' },

    // Week progress / unlock
    'progress.weekLabel': { en: 'Week progress', ar: 'تقدم الأسبوع' },
    'progress.setsLogged': { en: '{done} of {total} sets logged', ar: 'تم تسجيل {done} من {total} مجموعة' },
    'unlock.title': { en: 'Week Complete!', ar: 'اكتمل الأسبوع!' },
    'unlock.message': { en: 'Next week unlocked. New targets are ready.', ar: 'تم فتح الأسبوع التالي. الأهداف الجديدة جاهزة.' },
    'unlock.finalTitle': { en: 'Program Complete!', ar: 'اكتمل البرنامج!' },
    'unlock.continue': { en: 'Continue', ar: 'متابعة' },

    // Baseline (Week 0)
    'baseline.title': { en: 'Set Your Baseline', ar: 'حدد نقطة البداية' },
    'baseline.subtitle': {
        en: 'Enter your current working weight for the key lifts. We’ll build your 12 weeks from here.',
        ar: 'أدخل وزنك الحالي للتمارين الأساسية. سنبني أسابيعك الـ12 انطلاقاً من هنا.'
    },
    'baseline.weight': { en: 'Working weight (kg)', ar: 'وزن العمل (كجم)' },
    'baseline.reps': { en: 'Reps', ar: 'التكرارات' },
    'baseline.submit': { en: 'Start Week 1', ar: 'ابدأ الأسبوع 1' },
    'baseline.saving': { en: 'Setting up…', ar: 'جارٍ الإعداد…' },

    // Retest (Week 12)
    'retest.title': { en: 'Week 12 Retest', ar: 'إعادة اختبار الأسبوع 12' },
    'retest.subtitle': {
        en: 'Retest your key lifts and see how far you’ve come.',
        ar: 'أعد اختبار تمارينك الأساسية وشاهد مدى تقدمك.'
    },
    'retest.open': { en: 'Retest & Compare', ar: 'إعادة الاختبار والمقارنة' },
    'retest.compare': { en: 'Your Progress', ar: 'تقدمك' },
    'retest.baseline': { en: 'Baseline', ar: 'البداية' },
    'retest.now': { en: 'Now', ar: 'الآن' },
    'retest.gained': { en: 'Gained', ar: 'المكتسب' },
    'retest.save': { en: 'Save Retest', ar: 'حفظ الاختبار' }
};

// Helper function to get translation, with optional {placeholder} interpolation
export function t(key: string, lang: Language = 'en', vars?: Record<string, string | number>): string {
    const translation = translations[key];
    let value: string;
    if (!translation) {
        console.warn(`Translation missing for key: ${key}`);
        value = key;
    } else {
        value = translation[lang] || translation.en;
    }
    if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
            value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        });
    }
    return value;
}

// Helper to check if a word is a technical term
export function isTechnicalTerm(word: string): boolean {
    return TECHNICAL_TERMS.some(term =>
        word.toLowerCase().includes(term.toLowerCase())
    );
}
