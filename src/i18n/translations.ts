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
        en: 'Access your 8-week progressive overload program, log workouts, and track PRs.',
        ar: 'الوصول إلى برنامج الحمل التدريجي لمدة 8 أسابيع، تسجيل التمارين، وتتبع الأرقام القياسية.'
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

    // Signup Flow
    'signup.title': {
        en: 'Create Your Program',
        ar: 'أنشئ برنامجك'
    },
    'signup.description': {
        en: 'Enter your details to get started with your personalized 8-week program',
        ar: 'أدخل بياناتك للبدء ببرنامجك الشخصي لمدة 8 أسابيع'
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
        en: 'Log your workouts, track weights, and watch your progress over 8 weeks. Your data is saved automatically.',
        ar: 'سجل تمارينك، تتبع الأوزان، وراقب تقدمك على مدى 8 أسابيع. يتم حفظ بياناتك تلقائياً.'
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
    }
};

// Helper function to get translation
export function t(key: string, lang: Language = 'en'): string {
    const translation = translations[key];
    if (!translation) {
        console.warn(`Translation missing for key: ${key}`);
        return key;
    }
    return translation[lang] || translation.en;
}

// Helper to check if a word is a technical term
export function isTechnicalTerm(word: string): boolean {
    return TECHNICAL_TERMS.some(term =>
        word.toLowerCase().includes(term.toLowerCase())
    );
}
