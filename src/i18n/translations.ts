import { frenchTranslations } from './fr';
import { programContentTranslations } from './programContent';

export type Language = 'en' | 'ar' | 'fr';

/** Every language the UI can be switched to, in switcher order. */
export const LANGUAGES: readonly Language[] = ['en', 'ar', 'fr'] as const;

export const isLanguage = (value: unknown): value is Language =>
    typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value);

export interface Translations {
    [key: string]: {
        en: string;
        ar: string;
        /** Filled from ./fr at module load, so French lives in one reviewable file. */
        fr?: string;
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
        ar: 'مرحبا'
    },
    'welcome.subtitle': {
        en: 'Build a better looking body, get stronger, and improve your endurance. One hybrid program for 8 weeks.',
        ar: 'حسن الشكل ديال جسمك، زيد القوة، وحسن التحمل. برنامج هجين واحد لـ 8 سيمانات.',
        fr: 'Un corps plus esthétique, plus de force et une meilleure endurance. Un programme hybride sur 8 semaines.',
    },
    'welcome.training': {
        en: 'Training',
        ar: 'التمرين'
    },
    'welcome.training.description': {
        en: 'Train like a hybrid athlete. Build aesthetics, strength, and endurance in one plan.',
        ar: 'تمرن بحال رياضي هجين. بني الشكل، القوة، والتحمل فبرنامج واحد.',
        fr: 'Entraîne-toi comme un athlète hybride. Esthétique, force et endurance dans un seul plan.',
    },
    'welcome.nutrition': {
        en: 'Nutrition',
        ar: 'الماكلة'
    },
    'welcome.nutrition.description': {
        en: 'Calculate macros, plan meals, and discover healthy alternatives for your goals.',
        ar: 'حسب الماكروز، خطط للوجبات، ولقا بدائل صحية للأهداف ديالك.'
    },
    'welcome.startWorkout': {
        en: 'Start Workout',
        ar: 'بدا التمرين'
    },
    'welcome.openKitchen': {
        en: 'Open Kitchen',
        ar: 'حل الكوزينة'
    },
    // Welcome / Login entry screen
    'welcome.eyebrow': {
        en: '8-week program',
        ar: 'برنامج 8 أسابيع',
        fr: 'Programme 8 semaines',
    },
    'welcome.tagline': {
        en: 'Aesthetics, strength and endurance in one plan. Your weights adjust every week from what you log.',
        ar: 'الشكل، القوة والتحمل في برنامج واحد. الأثقال كتتعدّل كل سيمانة من اللي كتسجّل.',
        fr: 'Esthétique, force et endurance dans un seul plan. Tes charges s’ajustent chaque semaine selon ce que tu enregistres.',
    },
    'welcome.trust': {
        en: 'Coached by El Mehdi Kamal',
        ar: 'بتأطير المهدي كمال',
        fr: 'Coaché par El Mehdi Kamal',
    },
    'home.greet.morning': {
        en: 'Good morning, {name}',
        ar: 'صباح الخير، {name}',
        fr: 'Bonjour, {name}',
    },
    'home.greet.afternoon': {
        en: 'Good afternoon, {name}',
        ar: 'مساء الخير، {name}',
        fr: 'Bon après-midi, {name}',
    },
    'home.greet.evening': {
        en: 'Good evening, {name}',
        ar: 'مساء الخير، {name}',
        fr: 'Bonsoir, {name}',
    },
    'home.ready': {
        en: 'Ready to train',
        ar: 'واجد باش تمرن',
        fr: 'Prêt à t’entraîner',
    },
    'home.thisWeek': { en: 'This week', ar: 'هاد السيمانة', fr: 'Cette semaine' },
    'home.openWorkouts': {
        en: 'Open workouts',
        ar: 'فتح التمارين',
        fr: 'Voir les séances',
    },
    'home.upNext': { en: 'Up next', ar: 'التالي', fr: 'À suivre' },
    'home.day': { en: 'Day', ar: 'يوم', fr: 'Jour' },
    'home.exercises': { en: 'exercises', ar: 'تمارين', fr: 'exercices' },
    'home.sets': { en: 'sets', ar: 'مجموعات', fr: 'séries' },
    'home.more': { en: 'more', ar: 'المزيد', fr: 'de plus' },
    'home.startWorkout': {
        en: 'Start workout',
        ar: 'بدا التمرين',
        fr: 'Démarrer la séance',
    },
    'home.program': { en: 'Program', ar: 'البرنامج', fr: 'Programme' },
    'home.weekOf': {
        en: 'Week {week} of {total}',
        ar: 'سيمانة {week} من {total}',
        fr: 'Semaine {week} sur {total}',
    },
    'home.setsThisWeek': {
        en: '{done} of {total} sets this week',
        ar: '{done} من {total} مجموعات هاد السيمانة',
        fr: '{done} sur {total} séries cette semaine',
    },
    'home.yourWorkouts': {
        en: 'Your workouts',
        ar: 'تمارينك',
        fr: 'Tes séances',
    },
    'home.phase': { en: 'Phase', ar: 'المرحلة', fr: 'Phase' },
    'week.now': { en: 'Now', ar: 'الآن', fr: 'Actuel' },
    'login.eyebrow': {
        en: 'Welcome back',
        ar: 'مرحبا بيك',
        fr: 'Bon retour',
    },
    'login.lead': {
        en: 'Pick up your 8 weeks where you left them.',
        ar: 'كمّل 8 سيمانات من اللي وقفتي.',
        fr: 'Reprends tes 8 semaines là où tu t’étais arrêté.',
    },
    'login.forgot': {
        en: 'Forgot password?',
        ar: 'نسيتي كلمة السر؟',
        fr: 'Mot de passe oublié ?',
    },
    'login.error': {
        en: 'Email or password is incorrect.',
        ar: 'الإيميل أو كلمة السر غلط.',
        fr: 'E-mail ou mot de passe incorrect.',
    },
    'login.emailRequired': {
        en: 'Enter your email to reset the password.',
        ar: 'دخل الإيميل باش تعاود كلمة السر.',
        fr: 'Entre ton e-mail pour réinitialiser le mot de passe.',
    },
    'login.resetSent': {
        en: 'Check your email for a reset link.',
        ar: 'شوف الإيميل ديالك للرابط.',
        fr: 'Vérifie ton e-mail pour le lien de réinitialisation.',
    },
    'login.newHere': {
        en: 'New here?',
        ar: 'جديد هنا؟',
        fr: 'Nouveau ici ?',
    },
    'welcome.stat.program': {
        en: 'Aesthetics',
        ar: 'الشكل',
        fr: 'Esthétique',
    },
    'welcome.stat.sessions': {
        en: 'Strength',
        ar: 'القوة',
        fr: 'Force',
    },
    'welcome.stat.focus': {
        en: 'Endurance',
        ar: 'التحمل',
        fr: 'Endurance',
    },
    'welcome.join.subtitle': {
        en: 'Start your 8 weeks today',
        ar: 'بدا 8 سيمانات ديالك اليوم'
    },
    'welcome.login.subtitle': {
        en: 'Already have an account?',
        ar: 'عندك حساب من قبل؟'
    },
    'welcome.choosePath.line1': {
        en: 'Ready to',
        ar: 'واجد باش',
        fr: 'Prêt à',
    },
    'welcome.choosePath.line2': {
        en: 'train',
        ar: 'تمرن',
        fr: "t'entraîner",
    },

    // Signup Flow
    'signup.title': {
        en: 'Create Your Program',
        ar: 'صاوب البرنامج ديالك'
    },
    'signup.description': {
        en: 'Enter your details to get started with your personalized 8 week program',
        ar: 'دخل المعلومات ديالك باش تبدا البرنامج الشخصي ديالك ديال 8 سيمانات'
    },
    'signup.fullName': {
        en: 'Full Name',
        ar: 'السمية الكاملة'
    },
    'signup.email': {
        en: 'Email Address',
        ar: 'الإيميل'
    },
    'signup.emailNote': {
        en: 'Your email will be used as your username',
        ar: 'الإيميل ديالك غادي يتستعمل بحال اسم المستخدم'
    },
    'signup.password': {
        en: 'Password',
        ar: 'كلمة السر'
    },
    'signup.confirmPassword': {
        en: 'Confirm Password',
        ar: 'أكّد كلمة السر'
    },
    'signup.passwordPlaceholder': {
        en: 'Min. 6 characters',
        ar: '6 حروف على الأقل'
    },
    'signup.createAccount': {
        en: 'Build My Program',
        ar: 'صاوب البرنامج ديالي'
    },
    'signup.howItWorks': {
        en: 'How It Works?',
        ar: 'كيفاش كيخدم؟'
    },
    'signup.days.label': {
        en: 'How many days per week do you want to train?',
        ar: 'شحال من نهار فالسيمانة بغيتي تمرن؟'
    },
    'signup.days.perWeek': {
        en: 'days/week',
        ar: 'أيام/سيمانة'
    },
    'signup.days.comingSoon': {
        en: 'Coming soon',
        ar: 'قريباً'
    },
    'signup.days.note': {
        en: 'Important: this choice is permanent and cannot be changed later. Your program is built around the days you pick.',
        ar: 'مهم: هاد الاختيار دائم وما يمكنش يتبدل من بعد. البرنامج ديالك كيتبنا على عدد الأيام اللي ختاريتي.'
    },
    'signup.days.required': {
        en: 'Please choose how many days per week you want to train.',
        ar: 'عافاك ختار شحال من نهار فالسيمانة بغيتي تمرن.'
    },

    // How It Works Modal
    'howItWorks.title': {
        en: 'How "Get My Own Copy" Works',
        ar: 'كيفاش كيخدم "صاوب نسختك الخاصة"'
    },
    'howItWorks.step1.title': {
        en: 'Step 1: Create Your Account',
        ar: 'المرحلة 1: صاوب حسابك'
    },
    'howItWorks.step1.description': {
        en: 'Enter your name, email, and choose a secure password.',
        ar: 'دخل سميتك، الإيميل ديالك، وختار كلمة سر آمنة.'
    },
    'howItWorks.step2.title': {
        en: 'Step 2: Login',
        ar: 'المرحلة 2: دخل'
    },
    'howItWorks.step2.description': {
        en: 'Use your email and the password you created to login to your account.',
        ar: 'استعمل الإيميل وكلمة السر اللي صاوبتي باش تدخل لحسابك.'
    },
    'howItWorks.step2.description_simplified': {
        en: 'Use your email and the password you created to login to your account.',
        ar: 'استعمل الإيميل وكلمة السر اللي صاوبتي باش تدخل لحسابك.'
    },
    'howItWorks.step3.title': {
        en: 'Step 3: Track Your Progress',
        ar: 'المرحلة 3: تبّع تقدمك'
    },
    'howItWorks.step3.description': {
        en: 'Log your workouts, track weights, and watch your progress over 8 weeks. Progress is saved on this device.',
        ar: 'سجل التمارين ديالك، تبّع الأثقال، وشوف تقدمك على مدى 8 سيمانات. التقدم كيتسجل فهاد الجهاز.'
    },
    'howItWorks.important': {
        en: 'Important: This creates a personal copy of the program just for you. Your progress is private and saved to your account.',
        ar: 'مهم: هادشي كيصاوب نسخة خاصة بيك من البرنامج. تقدمك خاص بيك ومحفوظ فحسابك.'
    },
    'howItWorks.gotIt': {
        en: 'Got It!',
        ar: 'فهمت!'
    },

    // First-time workout coach (train tab)
    'coach.title': {
        en: 'How to progress',
        ar: 'كيفاش تتقدم',
        fr: 'Comment progresser',
    },
    'coach.subtitle': {
        en: '3 steps. Takes 30 seconds to learn.',
        ar: '3 خطوات. 30 ثانية باش تفهم.',
        fr: '3 étapes. 30 secondes pour comprendre.',
    },
    'coach.step1.title': {
        en: 'Pick a workout',
        ar: 'اختار التمرين',
        fr: 'Choisis une séance',
    },
    'coach.step1.desc': {
        en: 'Tap any day card (e.g. Upper Body 1) to open it.',
        ar: 'كليكي على أي يوم (مثلا Upper Body 1) باش تفتحو.',
        fr: 'Appuie sur une carte de jour (ex. Upper Body 1) pour l\u2019ouvrir.',
    },
    'coach.step2.title': {
        en: 'Log every set',
        ar: 'سجل كل السلسلة',
        fr: 'Enregistre chaque série',
    },
    'coach.step2.desc': {
        en: 'Enter reps and weight for each set, then tap Save on that exercise.',
        ar: 'دخل العدات والوزن لكل سلسلة، ومن بعد كليكي Save فذاك التمرين.',
        fr: 'Saisis reps et charge pour chaque série, puis appuie sur Enregistrer.',
    },
    'coach.step3.title': {
        en: 'Unlock next week',
        ar: 'فتح السيمانة الجاية',
        fr: 'Débloque la semaine suivante',
    },
    'coach.step3.desc': {
        en: 'Complete every workout day in Week 1 with all sets logged. Week 2 opens automatically.',
        ar: 'كمل كل أيام السيمانة 1 وسجل كل السلاسل. السيمانة 2 كتفتح بوحدها.',
        fr: 'Termine tous les jours de la semaine 1 avec toutes les séries enregistrées. La semaine 2 s\u2019ouvre automatiquement.',
    },
    'coach.tip': {
        en: 'Tip: the ring at the top shows how many sets you\u2019ve logged this week.',
        ar: 'نصيحة: الدائرة فالفوق كتوريك شحال من سلسلة سجلتي هاد السيمانة.',
        fr: 'Astuce : l\u2019anneau en haut montre combien de séries tu as enregistrées cette semaine.',
    },
    'coach.start': {
        en: 'Start training',
        ar: 'بدا التمرين',
        fr: 'Commencer',
    },

    'feed.setsProgress': {
        en: '{done}/{total} sets logged this week',
        ar: '{done}/{total} سلسلة مسجلة هاد السيمانة',
        fr: '{done}/{total} séries enregistrées cette semaine',
    },
    'feed.nextUp': {
        en: 'Next up: {workout}',
        ar: 'الجاي: {workout}',
        fr: 'Prochaine séance : {workout}',
    },
    'feed.howProgress': {
        en: 'How progress works',
        ar: 'كيفاش التقدم',
        fr: 'Comment progresser',
    },
    'feed.week6Banner': {
        en: 'Week 5 is your deload. Recover well, then strength weeks begin.',
        ar: 'السيمانة 5 هي الديلود. استريح مزيان، من بعد كيدوز فاز القوة.',
        fr: 'La semaine 5 est ta décharge. Récupère bien, puis viennent les semaines de force.',
    },

    'toast.firstSet': {
        en: 'First set logged. Keep going.',
        ar: 'أول سلسلة تسجلت. كمل.',
        fr: 'Première série enregistrée. Continue.',
    },
    'toast.dayComplete': {
        en: 'Workout day complete. Nice work.',
        ar: 'نهيت هاد اليوم. مزيان.',
        fr: 'Séance du jour terminée. Beau travail.',
    },
    'toast.emptySave': {
        en: 'Enter the reps and weight you actually used before saving.',
        ar: 'دخل العدات والوزن اللي استعملتي قبل ما تسجل.',
        fr: 'Saisis les reps et la charge réelles avant d\u2019enregistrer.',
    },

    // Milestones (no em dashes)
    'milestone.badge': {
        en: 'Milestone unlocked',
        ar: 'إنجاز جديد',
        fr: 'Jalon débloqué',
    },
    'milestone.progress': {
        en: 'Collection',
        ar: 'المجموعة',
        fr: 'Collection',
    },
    'milestone.continue': {
        en: 'Keep going',
        ar: 'كمل',
        fr: 'Continuer',
    },
    'milestone.first_set.title': {
        en: 'First set logged',
        ar: 'أول سلسلة',
        fr: 'Première série',
    },
    'milestone.first_set.body': {
        en: 'You started tracking. Every set you log builds the next week.',
        ar: 'بديتي التسجيل. كل سلسلة كتكمل السيمانة الجاية.',
        fr: 'Tu as commencé le suivi. Chaque série prépare la semaine suivante.',
    },
    'milestone.first_day.title': {
        en: 'Workout day done',
        ar: 'نهاية اليوم',
        fr: 'Séance terminée',
    },
    'milestone.first_day.body': {
        en: 'Full day in the books. Finish the rest of the week to unlock what comes next.',
        ar: 'كملتي اليوم كامل. كمل باقي السيمانة باش تفتح الجاي.',
        fr: 'Journée complète. Finis la semaine pour débloquer la suite.',
    },
    'milestone.week2.title': {
        en: 'Week 2 unlocked',
        ar: 'السيمانة 2 تفتحات',
        fr: 'Semaine 2 débloquée',
    },
    'milestone.week2.body': {
        en: 'First microcycle complete. New targets are ready.',
        ar: 'أول ميكروسايكل سالا. الأهداف الجديدة واجدة.',
        fr: 'Premier microcycle terminé. Nouveaux objectifs prêts.',
    },
    'milestone.three_days.title': {
        en: 'Three days complete',
        ar: 'ثلاث أيام كاملة',
        fr: 'Trois jours complétés',
    },
    'milestone.three_days.body': {
        en: 'You cleared three different training days. Consistency is stacking.',
        ar: 'كملتي ثلاث أيام مختلفة. الاستمرارية كتجمع.',
        fr: 'Tu as validé trois jours différents. La régularité s\u2019installe.',
    },
    'milestone.week4.title': {
        en: 'Week 4 unlocked',
        ar: 'السيمانة 4 تفتحات',
        fr: 'Semaine 4 débloquée',
    },
    'milestone.week4.body': {
        en: 'Hypertrophy block is rolling. Keep logging every set.',
        ar: 'بلوك التضخم خدام. كمل سجل كل سلسلة.',
        fr: 'Le bloc hypertrophie avance. Continue d\u2019enregistrer chaque série.',
    },
    'milestone.deload.title': {
        en: 'Deload week',
        ar: 'سيمانة الديلود',
        fr: 'Semaine de décharge',
    },
    'milestone.deload.body': {
        en: 'Halfway through the program. Recover well and stay sharp.',
        ar: 'نص البرنامج. استريح مزيان وبقى مركز.',
        fr: 'Mi parcours. Récupère bien et reste précis.',
    },
    'milestone.strength.title': {
        en: 'Strength phase',
        ar: 'فاز القوة',
        fr: 'Phase force',
    },
    'milestone.strength.body': {
        en: 'Lower reps. Heavier intent. Trust the plan.',
        ar: 'عدات أقل. تركيز على الثقل. تبع البرنامج.',
        fr: 'Moins de reps. Plus d\u2019intention. Fais confiance au plan.',
    },
    'milestone.peak.title': {
        en: 'Peak phase',
        ar: 'فاز البيك',
        fr: 'Phase de pic',
    },
    'milestone.peak.body': {
        en: 'Top intensity window. Hit your targets clean.',
        ar: 'أعلى شدة. ضرب الأهداف بنقاوة.',
        fr: 'Fenêtre d\u2019intensité max. Atteins tes cibles proprement.',
    },
    'milestone.retest.title': {
        en: 'Retest week',
        ar: 'سيمانة الريتيست',
        fr: 'Semaine de retest',
    },
    'milestone.retest.body': {
        en: 'Measure the key lifts and see how far you came.',
        ar: 'قيس الحركات الرئيسية وشوف شحال تقدمتي.',
        fr: 'Mesure les lifts clés et vois le chemin parcouru.',
    },
    'milestone.complete.title': {
        en: 'Program complete',
        ar: 'البرنامج سالا',
        fr: 'Programme terminé',
    },
    'milestone.complete.body': {
        en: 'Eight weeks done. You built the habit and the numbers.',
        ar: '8 سيمانات سالاو. صاوبتي العادة والأرقام.',
        fr: 'Huit semaines terminées. Habitude et chiffres sont là.',
    },
    'milestone.feedLabel': {
        en: 'Milestones',
        ar: 'الإنجازات',
        fr: 'Jalons',
    },

    // Success Modal
    'signup.success.title': {
        en: 'Account Created!',
        ar: 'تصاوب الحساب!'
    },
    'signup.success.message': {
        en: 'Your account has been successfully created. Please login with your email and password.',
        ar: 'الحساب ديالك تصاوب بنجاح. دخل بالإيميل وكلمة السر ديالك.'
    },
    'signup.success.button': {
        en: 'Go to Login',
        ar: 'سير للدخول'
    },
    'signup.error.alreadyRegistered': {
        en: 'This email is already registered. Redirecting to login...',
        ar: 'هاد الإيميل مسجل من قبل. غادي نوجهوك للدخول...'
    },
    'signup.timeoutRedirect': {
        en: 'Server is taking a moment. Account likely created! Redirecting to login...',
        ar: 'السيرفر خد شوية ديال الوقت. الحساب غالبا تصاوب! غادي نوجهوك للدخول...'
    },

    // Credentials Modal
    'credentials.welcome': {
        en: 'Welcome',
        ar: 'مرحبا'
    },
    'credentials.actionRequired': {
        en: 'Action Required:',
        ar: 'خاصك دير:'
    },
    'credentials.instruction': {
        en: 'Please copy your credentials below. You will need to manually enter them on the next screen to access your program.',
        ar: 'نسخ المعلومات ديالك اللي تحت. غادي تحتاج تدخلهم بيدك فالشاشة الجاية باش توصل للبرنامج ديالك.'
    },
    'credentials.copyPasswordInstruction': {
        en: 'Please copy your password below. You will need to remember your email and enter this password to access your program.',
        ar: 'نسخ كلمة السر ديالك اللي تحت. خاصك تعقل على الإيميل وتدخل هاد كلمة السر باش توصل للبرنامج ديالك.'
    },
    'credentials.personalLink': {
        en: 'YOUR PERSONAL LINK',
        ar: 'الرابط الشخصي ديالك'
    },
    'credentials.email': {
        en: 'EMAIL',
        ar: 'الإيميل'
    },
    'credentials.password': {
        en: 'PASSWORD',
        ar: 'كلمة السر'
    },
    'credentials.warning': {
        en: 'Important:',
        ar: 'مهم:'
    },
    'credentials.warningText': {
        en: 'Screenshot this page! Click your personal link and use these credentials to login.',
        ar: 'دير تصويرة لهاد الصفحة! كليكي على الرابط الشخصي ديالك واستعمل هاد المعلومات باش تدخل.'
    },
    'credentials.goToLogin': {
        en: 'Go to Login Page',
        ar: 'سير لصفحة الدخول'
    },

    // Common
    'common.backToHome': {
        en: 'Back to Home',
        ar: 'رجع للرئيسية'
    },
    'common.logout': {
        en: 'Logout',
        ar: 'خروج'
    },
    'common.login': {
        en: 'Log in',
        ar: 'دخول',
        fr: 'Connexion',
    },
    'common.createAccount': {
        en: 'Create account',
        ar: 'إنشاء حساب',
        fr: 'Créer un compte',
    },
    'common.alreadyHaveAccount': {
        en: 'Already Have Account?',
        ar: 'عندك حساب من قبل؟'
    },

    // Workout Section
    'workout.title': {
        en: 'Personal Training Split',
        ar: 'برنامج التمرين الشخصي'
    },
    'workout.selectWorkout': {
        en: 'Select a workout to view exercises',
        ar: 'ختار تمرين باش تشوف الحركات'
    },
    'workout.logWeights': {
        en: 'Select a workout to log your weights',
        ar: 'ختار تمرين باش تسجل الأثقال ديالك'
    },
    'workout.week': {
        en: 'Week',
        ar: 'السيمانة'
    },
    'workout.done': { en: 'Done', ar: 'سالا', fr: 'Fait' },
    'workout.openToFinish': {
        en: 'Tap to finish',
        ar: 'ضغط باش تكمّل',
        fr: 'Ouvre pour finir',
    },
    'log.confirmDay': {
        en: 'Mark day done',
        ar: 'علّم اليوم كسالا',
        fr: 'Marquer le jour comme fait',
    },
    'log.confirmDayHint': {
        en: 'Hit the targets as written? Confirm the day in one tap — no need to edit every set.',
        ar: 'تبعتي الأهداف بلا تعديلات؟ أكّد اليوم بضغطة وحدة.',
        fr: 'Tu as suivi les cibles telles quelles ? Confirme le jour en un tap.',
    },
    'log.dayConfirmed': {
        en: 'This session is logged for the week.',
        ar: 'هاد الجلسة تسجّلات فالسيمانة.',
        fr: 'Cette séance est enregistrée pour la semaine.',
    },
    'workout.start': { en: 'Start', ar: 'بدا' },
    'workout.review': { en: 'Review', ar: 'راجع' },
    'common.gotIt': { en: 'Got it', ar: 'فهمت' },

    // Nutrition Section (Moroccan Darija)
    'nutrition.backToPortal': {
        en: 'Back to Brand Portal',
        ar: 'رجع للبوابة'
    },
    'nutrition.badgePlans': {
        en: 'Nutrition Plans',
        ar: 'برامج الماكلة'
    },
    'nutrition.selectTarget': {
        en: 'Select your calorie target to unlock your personalized meal plan.',
        ar: 'ختار عدد الكالوري ديالك باش تفتح برنامج الماكلة المخصص ليك.'
    },
    'nutrition.kcalPerDay': {
        en: 'kcal/day',
        ar: 'كالوري/نهار'
    },
    'nutrition.viewBlueprint': {
        en: 'View Blueprint',
        ar: 'شوف البلان'
    },
    'nutrition.designedFor': {
        en: 'Designed for Hybrid Athlete Performance',
        ar: 'مصمم لأداء الرياضي الهجين'
    },
    // Calorie plan cards
    'nutrition.plan.2000.title': {
        en: 'Aggressive Fat Loss',
        ar: 'تنقيص الشحم بقوة'
    },
    'nutrition.plan.2000.desc': {
        en: 'Maximum deficit for rapid results',
        ar: 'أقصى عجز فالكالوري باش النتائج يجيو دغيا'
    },
    'nutrition.plan.2500.title': {
        en: 'Moderate Deficit',
        ar: 'عجز متوسط'
    },
    'nutrition.plan.2500.desc': {
        en: 'Sustainable fat loss / maintenance',
        ar: 'تنقيص الشحم بشوية ولا الحفاظ على الوزن'
    },
    'nutrition.plan.3000.title': {
        en: 'Maintenance / Lean Bulk',
        ar: 'الحفاظ ولا الزيادة فالعضل'
    },
    'nutrition.plan.3000.desc': {
        en: 'Maintain or grow lean muscle',
        ar: 'حافظ ولا كبّر العضل الصافي'
    },
    'nutrition.plan.3500.title': {
        en: 'Lean Bulk',
        ar: 'زيادة العضل الصافي'
    },
    'nutrition.plan.3500.desc': {
        en: 'Optimal muscle growth for larger athletes',
        ar: 'نمو مثالي للعضل للرياضيين الكبار'
    },
    'nutrition.meals3': {
        en: '3 meals',
        ar: '3 وجبات'
    },
    'nutrition.meals3snack1': {
        en: '3 meals + 1 snack',
        ar: '3 وجبات + سناك'
    },
    'nutrition.meals4snack1': {
        en: '4 meals + 1 snack',
        ar: '4 وجبات + سناك'
    },
    // Meal plan view descriptions (keyed by calorie target)
    'nutrition.planDesc.2000': {
        en: 'Aggressive fat loss with 3 nutrient-dense meals',
        ar: 'تنقيص الشحم بقوة مع 3 وجبات غنية بالمغذيات'
    },
    'nutrition.planDesc.2500': {
        en: 'Moderate deficit or maintenance with 3 meals + snack',
        ar: 'عجز متوسط ولا الحفاظ مع 3 وجبات + سناك'
    },
    'nutrition.planDesc.3000': {
        en: 'Maintenance or lean bulk with 3 meals + snack',
        ar: 'الحفاظ ولا زيادة العضل مع 3 وجبات + سناك'
    },
    'nutrition.planDesc.3500': {
        en: 'Lean bulk for larger athletes with 4 meals + snack',
        ar: 'زيادة العضل للرياضيين الكبار مع 4 وجبات + سناك'
    },
    // Meal plan view chrome
    'nutrition.backToPlans': {
        en: 'Back to Plans',
        ar: 'رجع للبرامج'
    },
    'nutrition.dailyProtocol': {
        en: 'Daily Protocol',
        ar: 'البروتوكول اليومي'
    },
    'nutrition.kcal': {
        en: 'kcal',
        ar: 'كالوري'
    },
    'nutrition.hideMacros': {
        en: 'Hide Macros',
        ar: 'خبي الماكروز'
    },
    'nutrition.showMacros': {
        en: 'Show Macros',
        ar: 'بيّن الماكروز'
    },
    'nutrition.shop': {
        en: 'Shop',
        ar: 'التسوق'
    },
    'nutrition.pdf': {
        en: 'PDF',
        ar: 'PDF'
    },
    'nutrition.totalCalories': {
        en: 'Total Calories',
        ar: 'مجموع الكالوري'
    },
    'nutrition.protein': {
        en: 'Protein',
        ar: 'البروتين'
    },
    'nutrition.carbs': {
        en: 'Carbs',
        ar: 'الكاربوهيدرات'
    },
    'nutrition.fats': {
        en: 'Fats',
        ar: 'الدهون'
    },
    // Toasts
    'nutrition.toast.generatingPdf': {
        en: 'Generating PDF...',
        ar: 'كنصاوب PDF...'
    },
    'nutrition.toast.generatingPdfDesc': {
        en: 'Preparing high-quality layout with images...',
        ar: 'كنوجد التصميم بجودة عالية مع التصاور...'
    },
    'nutrition.toast.pdfSuccess': {
        en: 'PDF downloaded successfully!',
        ar: 'تحمّل ال PDF بنجاح!'
    },
    'nutrition.toast.pdfSuccessDesc': {
        en: 'Your meal plan has been saved to your downloads folder.',
        ar: 'برنامج الماكلة ديالك تسجل فمجلد التحميلات.'
    },
    'nutrition.toast.pdfError': {
        en: 'Failed to export PDF',
        ar: 'ما تصاوبش ال PDF'
    },
    'nutrition.toast.pdfErrorDesc': {
        en: 'Please try again or contact support if the issue persists.',
        ar: 'عاود حاول ولا تواصل مع الدعم إلا بقا المشكل.'
    },
    'nutrition.toast.swapSuccess': {
        en: 'Meal swapped successfully!',
        ar: 'تبدلات الوجبة بنجاح!'
    },
    'nutrition.toast.swapSuccessDesc': {
        en: 'Replaced with {name}',
        ar: 'تبدلات بـ {name}'
    },
    // Meal types
    'nutrition.mealType.breakfast': {
        en: 'Breakfast',
        ar: 'الفطور'
    },
    'nutrition.mealType.lunch': {
        en: 'Lunch',
        ar: 'الغدا'
    },
    'nutrition.mealType.dinner': {
        en: 'Dinner',
        ar: 'العشا'
    },
    'nutrition.mealType.snack': {
        en: 'Snack',
        ar: 'سناك'
    },
    // Macro short labels (meal card)
    'nutrition.kcalShort': {
        en: 'Kcal',
        ar: 'كالوري'
    },
    'nutrition.proShort': {
        en: 'Pro',
        ar: 'بروتين'
    },
    'nutrition.carbShort': {
        en: 'Carb',
        ar: 'كارب'
    },
    'nutrition.fatShort': {
        en: 'Fat',
        ar: 'دهون'
    },
    'nutrition.fibShort': {
        en: 'Fib',
        ar: 'ألياف'
    },
    'nutrition.hideDetails': {
        en: 'Hide Details',
        ar: 'خبي التفاصيل'
    },
    'nutrition.viewRecipe': {
        en: 'View Recipe',
        ar: 'شوف الوصفة'
    },
    'nutrition.ingredients': {
        en: 'Ingredients',
        ar: 'المكونات'
    },
    'nutrition.instructions': {
        en: 'Instructions',
        ar: 'طريقة التحضير'
    },
    // Swap dialog
    'nutrition.swapMeal': {
        en: 'Swap Meal',
        ar: 'بدّل الوجبة'
    },
    'nutrition.swapReplace': {
        en: 'Replace',
        ar: 'بدّل'
    },
    'nutrition.swapWithAlt': {
        en: 'with a similar alternative',
        ar: 'ببديل مشابه'
    },
    'nutrition.noAlternatives': {
        en: 'No alternative meals available for this meal type yet.',
        ar: 'مازال ما كاينش بدائل لهاد النوع ديال الوجبات.'
    },
    'nutrition.cal': {
        en: 'cal',
        ar: 'كالوري'
    },
    'nutrition.proteinLower': {
        en: 'protein',
        ar: 'بروتين'
    },
    'nutrition.carbsLower': {
        en: 'carbs',
        ar: 'كارب'
    },
    'nutrition.fatsLower': {
        en: 'fats',
        ar: 'دهون'
    },
    'nutrition.cancel': {
        en: 'Cancel',
        ar: 'إلغاء'
    },
    // Fiber tracker
    'nutrition.fiber.poor': {
        en: 'Poor',
        ar: 'ضعيف'
    },
    'nutrition.fiber.moderate': {
        en: 'Moderate',
        ar: 'متوسط'
    },
    'nutrition.fiber.good': {
        en: 'Good',
        ar: 'مزيان'
    },
    'nutrition.fiber.excessive': {
        en: 'Excessive',
        ar: 'بزاف'
    },
    'nutrition.fiberIntake': {
        en: 'Fiber Intake',
        ar: 'كمية الألياف'
    },
    'nutrition.fiberTarget': {
        en: 'Target: 35-50g per day',
        ar: 'الهدف: 35-50غ فالنهار'
    },
    'nutrition.currentStatus': {
        en: 'Current Status:',
        ar: 'الحالة دابا:'
    },
    // Shopping list
    'nutrition.smartShoppingList': {
        en: 'Smart Shopping List',
        ar: 'لائحة التسوق الذكية'
    },
    'nutrition.cat.produce': {
        en: 'Produce',
        ar: 'الخضرة والفواكه'
    },
    'nutrition.cat.meatDairy': {
        en: 'Meat & Dairy',
        ar: 'اللحم والحليب'
    },
    'nutrition.cat.pantry': {
        en: 'Pantry',
        ar: 'المونة'
    },
    'nutrition.cat.other': {
        en: 'Other',
        ar: 'حوايج أخرى'
    },
    'nutrition.copyList': {
        en: 'Copy List',
        ar: 'نسخ اللائحة'
    },
    'nutrition.close': {
        en: 'Close',
        ar: 'سد'
    },
    'nutrition.copiedClipboard': {
        en: 'Copied to clipboard!',
        ar: 'تنسخات!'
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

    // Phases (8-week periodization)
    'phase.anatomical': { en: 'Anatomical Adaptation', ar: 'التأقلم' },
    'phase.hypertrophy': { en: 'Hypertrophy', ar: 'تكبير العضل' },
    'phase.deload': { en: 'Deload', ar: 'تخفيف الحمل' },
    'phase.strength': { en: 'Strength', ar: 'القوة' },
    'phase.peak': { en: 'Peak', ar: 'الذروة' },
    'phase.retest': { en: 'Retest', ar: 'إعادة الاختبار' },

    // Week selector / gating
    'week.label': { en: 'Week', ar: 'السيمانة' },
    'week.locked.title': { en: 'Week Locked', ar: 'السيمانة مقفولة' },
    'week.locked.message': {
        en: 'Finish every workout in your current week and log all sets. The next week opens automatically.',
        ar: 'كمل كل التمارين فالسيمانة الحالية وسجل كل السلاسل. السيمانة الجاية كتفتح بوحدها.',
        fr: 'Termine toutes les séances de ta semaine en cours et enregistre toutes les séries. La semaine suivante s\u2019ouvre automatiquement.',
    },
    'week.active': { en: 'In Progress', ar: 'خدّامة دابا' },
    'week.completed': { en: 'Completed', ar: 'سالات' },
    'week.lockedNotice': {
        en: 'Log every set in your current week. When the full week is done, the next week unlocks automatically.',
        ar: 'سجل كل سلسلة فالسيمانة الحالية. منين تكمل السيمانة كاملة، السيمانة الجاية كتفتح بوحدها.',
        fr: 'Enregistre chaque série de ta semaine en cours. Quand la semaine est terminée, la suivante se débloque automatiquement.',
    },

    // Targets & logging
    'log.target': { en: 'This week’s target', ar: 'هدف هاد السيمانة' },
    'log.lastWeek': { en: 'Last week', ar: 'السيمانة اللي فاتت' },
    'log.reps': { en: 'Reps', ar: 'التكرارات' },
    'log.weight': { en: 'Weight', ar: 'الثقل' },
    'log.optional': { en: 'optional', ar: 'اختياري' },
    'log.rest': { en: 'Rest', ar: 'الراحة' },
    'log.restBetween': { en: 'Rest', ar: 'راحة' },
    'log.to': { en: 'to', ar: 'ل' },
    'log.set': { en: 'Set', ar: 'المجموعة' },
    'log.save': { en: 'Save', ar: 'سجل' },
    'log.saving': { en: 'Saving…', ar: 'كيتسجل…' },
    'log.saved': { en: 'Saved', ar: 'تسجل' },
    'log.update': { en: 'Update', ar: 'حدّث' },
    'log.done': { en: 'Done', ar: 'سالا' },
    'log.noData': { en: 'Enter reps or weight before saving.', ar: 'دخل التكرارات ولا الثقل قبل ما تسجل.' },
    'log.noReps': { en: 'Enter reps before saving.', ar: 'دخل التكرارات قبل ما تسجل.' },
    'log.syncFailed': {
        en: 'Could not load saved sets. You can still log this workout. Check your connection or run the database setup in Supabase.',
        ar: 'ما قدرناش نحملو المجموعات المحفوظة. تقدر تكمل التسجيل. تشيك على الاتصال ولا إعداد قاعدة البيانات.'
    },
    'log.retrySync': { en: 'Try again', ar: 'عاود حاول' },

    // Week progress / unlock
    'progress.weekLabel': { en: 'Week progress', ar: 'تقدم السيمانة' },
    'progress.setsLogged': { en: '{done} of {total} sets logged', ar: 'تسجلو {done} من {total} مجموعة' },
    'unlock.title': { en: 'Week complete', ar: 'كملتي السيمانة', fr: 'Semaine terminée' },
    'unlock.unlocked': { en: 'Unlocked', ar: 'تفتحات', fr: 'Débloquée' },
    'unlock.finalLabel': { en: 'Complete', ar: 'انتهى', fr: 'Terminé' },
    'unlock.message': { en: 'Next week unlocked. New targets are ready.', ar: 'السيمانة الجاية تفتحات. الأهداف الجديدة واجدة.' },
    'unlock.weekReady': {
        en: 'Your loads and reps were updated from what you logged. Week {week} is ready.',
        ar: 'الأثقال والتكرارات تعدّلو من اللي سجّلتي. السيمانة {week} واجدة.',
        fr: 'Tes charges et reps ont été mises à jour. La semaine {week} est prête.',
    },
    'unlock.whatChanged': { en: "What's new this week", ar: 'أشنو الجديد فهاد السيمانة' },
    'unlock.point1': {
        en: 'Targets recalculated from last week’s logged sets',
        ar: 'الأهداف تحسبو من مجموعات السيمانة اللي فاتت',
        fr: 'Objectifs recalculés à partir des séries enregistrées',
    },
    'unlock.point2': {
        en: 'Same split, progressed loads where you earned them',
        ar: 'نفس التقسيم، أثقال أعلى فين تستاهل',
        fr: 'Même split, charges progressées là où tu les as méritées',
    },
    'unlock.point3': {
        en: 'Log every set this week to unlock the next',
        ar: 'سجّل كل المجموعات باش تفتح اللي بعدها',
        fr: 'Enregistre chaque série cette semaine pour débloquer la suivante',
    },
    'unlock.finalTitle': { en: 'Program done', ar: 'البرنامج سالا', fr: 'Programme terminé' },
    'unlock.finalMessage': {
        en: 'You finished all 8 weeks. Retest when you are ready for the next block.',
        ar: 'كملتي 8 سيمانات. عاود الاختبار ملي تكون واجد للكتلة الجاية.',
        fr: 'Tu as terminé les 8 semaines. Reteste quand tu es prêt pour le prochain bloc.',
    },
    'unlock.continue': { en: 'Continue', ar: 'كمل', fr: 'Continuer' },

    // Baseline (Week 0)
    'baseline.title': { en: 'Set Your Baseline', ar: 'حدد نقطة البداية' },
    'baseline.subtitle': {
        en: 'Enter your current working weight for the key lifts. We’ll build your 8 weeks from here.',
        ar: 'دخل الثقل اللي كتخدم بيه دابا فالتمارين الأساسية. غادي نبنيو 8 سيمانات ديالك من هنا.'
    },
    'baseline.weight': { en: 'Working weight (kg)', ar: 'ثقل الخدمة (كجم)' },
    'baseline.reps': { en: 'Reps', ar: 'التكرارات' },
    'baseline.submit': { en: 'Start Week 1', ar: 'بدا السيمانة 1' },
    'baseline.saving': { en: 'Setting up…', ar: 'كنوجدو…' },

    // Retest (legacy keys — cloud retest removed)
    'retest.title': { en: 'Program complete', ar: 'البرنامج سالا' },
    'retest.subtitle': {
        en: 'Retest your key lifts and see how far you’ve come.',
        ar: 'عاود اختبر التمارين الأساسية ديالك وشوف شحال تقدمتي.'
    },
    'retest.open': { en: 'Retest & Compare', ar: 'إعادة الاختبار والمقارنة' },
    'retest.compare': { en: 'Your Progress', ar: 'التقدم ديالك' },
    'retest.baseline': { en: 'Week 1', ar: 'السيمانة 1' },
    'retest.now': { en: 'Now', ar: 'دابا' },
    'retest.gained': { en: 'Gained', ar: 'اللي ربحتي' },
    'retest.save': { en: 'Save Retest', ar: 'سجل الاختبار' },

    // App shell (workouts screen chrome)
    'app.accessLocked': { en: 'Access Locked', ar: 'الدخول مقفول' },
    'app.authRequired': { en: 'Authentication required for program access', ar: 'خاصك تدخل باش توصل للبرنامج ديالك' },
    'app.enableAccess': { en: 'Enable Access', ar: 'فتح الدخول' },
    'app.hello': { en: 'Hello,', ar: 'أهلا،' },
    'app.athlete': { en: 'Athlete', ar: 'الرياضي' },
    'app.activeSystem': { en: 'Active System', ar: 'النظام خدّام' },
    'app.systemSpec': { en: 'System Specification', ar: 'مواصفات النظام' },

    // Program intro
    'intro.backToPortal': { en: 'Back to Portal', ar: 'رجع للبورطال' },
    'intro.eyebrow': { en: 'Hybrid Athlete Program', ar: 'برنامج الرياضي الهجين', fr: 'Programme athlète hybride' },
    // Headline is split in three so each language can order the words itself.
    'intro.headline.line1': { en: '8 Week', ar: 'برنامج' },
    'intro.headline.accent': { en: 'Hybrid', ar: 'هجين' },
    'intro.headline.line2': { en: 'Program', ar: '8 أسابيع' },
    'intro.tagline': {
        en: 'Simple progressive training to look better, get stronger, and last longer. Built for hybrid athletes.',
        ar: 'تدريب بسيط ومتدرج باش تحسن الشكل، تزيد القوة، وتدوم أكثر. مصمم للرياضي الهجين.',
        fr: 'Un entraînement simple et progressif pour mieux paraître, gagner en force et tenir plus longtemps. Fait pour les athlètes hybrides.',
    },
    'intro.spec.splitDays': { en: '{days} Day Split', ar: 'سبليت {days} أيام' },
    'intro.spec.split.title': { en: 'Your Split', ar: 'السبليت ديالك' },
    'intro.spec.split.sub': { en: 'Optimized Frequency', ar: 'وتيرة محسّنة' },
    'intro.spec.progression.title': { en: 'Progression', ar: 'التدرّج' },
    'intro.spec.progression.sub': { en: 'Scientific Overload', ar: 'زيادة علمية' },
    'intro.spec.support.title': { en: 'Full Support', ar: 'دعم كامل' },
    'intro.spec.support.sub': { en: 'Video Drill Guides', ar: 'فيديوهات الشرح' },
    'intro.inside.title': { en: 'The Athlete Experience', ar: 'تجربة الرياضي' },
    'intro.inside.microcycles': { en: 'Advanced 8 Week Microcycles', ar: 'دورات صغيرة متقدمة على 8 أسابيع' },
    'intro.inside.tracking': { en: 'Weight Tracking and Logging', ar: 'تتبع وتسجيل الأوزان' },
    'intro.inside.videos': { en: 'Exercise Video Demonstrations', ar: 'فيديوهات شرح التمارين' },
    'intro.inside.records': { en: 'Personal Record Dashboard', ar: 'لوحة الأرقام القياسية' },
    'intro.inside.mobile': { en: 'Mobile First Interaction', ar: 'تجربة مصممة للتيليفون' },
    'intro.inside.fatigue': { en: 'Progressive Fatigue Management', ar: 'تدبير التعب بالتدريج' },
    'intro.accessProgram': { en: 'Access Program', ar: 'دخل للبرنامج' },

    // Bottom navigation
    'nav.home': { en: 'Home', ar: 'الرئيسية' },
    'nav.train': { en: 'Train', ar: 'تدريب' },
    'nav.diet': { en: 'Diet', ar: 'تغذية' },
    'nav.logout': { en: 'Logout', ar: 'خروج' },

    'common.back': { en: 'Back', ar: 'رجوع', fr: 'Retour' },
    'nutrition.mealType.midMorning': { en: 'Mid-Morning', ar: 'وجبة الصباح', fr: 'Collation matinale' },
    'nutrition.notFound': { en: 'Page not found', ar: 'الصفحة ما كاينة', fr: 'Page introuvable' },
    'log.playVideo': { en: 'Play {name} video', ar: 'شغل فيديو {name}', fr: 'Lire la vidéo de {name}' },
    'progress.ringLabel': { en: 'Week progress {percent}%', ar: 'تقدم الأسبوع {percent}%', fr: 'Progression de la semaine {percent} %' },

    // Units. "min" and "kg" are left as-is in every language on purpose:
    // they are universal gym shorthand, not prose.
    'unit.min': { en: 'min', ar: 'min', fr: 'min' },
    'workout.series': { en: 'Series', ar: 'مجموعة', fr: 'Série' },
    'workout.drills': { en: 'Drills', ar: 'تمارين', fr: 'exercices' }
};

// Program content (exercise/day names) is authored per-language in its own
// file and folded in here so `t()` resolves it like any other key.
Object.assign(translations, programContentTranslations);

// Attach French from its own file. Unknown keys would be silently unreachable,
// so they are reported rather than ignored.
for (const [key, value] of Object.entries(frenchTranslations)) {
    if (translations[key]) {
        translations[key].fr = value;
    } else {
        console.warn(`French translation for unknown key: ${key}`);
    }
}

export const hasTranslation = (key: string): boolean =>
    Object.prototype.hasOwnProperty.call(translations, key);

/** Keys that have no French value yet (used by the translation check script). */
export function missingFrenchKeys(): string[] {
    return Object.keys(translations).filter((key) => !translations[key].fr);
}

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
