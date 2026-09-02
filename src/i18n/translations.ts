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
        en: 'Choose your focus for today. Master your body through training or fuel your performance through nutrition.',
        ar: 'ختار على أش بغيتي تركز اليوم. طوّر جسمك بالتمارين ولا قوّي الأداء ديالك بالماكلة.'
    },
    'welcome.training': {
        en: 'Training',
        ar: 'التمرين'
    },
    'welcome.training.description': {
        en: 'Access your 12 week progressive overload program, log workouts, and track PRs.',
        ar: 'دخل للبرنامج ديالك ديال 12 سيمانة، سجل التمارين وتبّع الأرقام ديالك.'
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
        en: '12 Week Program',
        ar: 'برنامج 12 أسبوعاً'
    },
    'welcome.tagline': {
        en: 'Build real strength and an engine that lasts. One program, twelve weeks, no hype.',
        ar: 'بني قوة حقيقية ولياقة تدوم. برنامج واحد، 12 سيمانة، بلا مبالغة.'
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
        ar: 'بدا 12 سيمانة ديالك اليوم'
    },
    'welcome.login.subtitle': {
        en: 'Already have an account?',
        ar: 'عندك حساب من قبل؟'
    },
    'welcome.trust': {
        en: 'Secure sign-in · coached by El Mehdi',
        ar: 'دخول آمن · مع تأطير المهدي'
    },
    'welcome.choosePath.line1': {
        en: 'Choose Your',
        ar: 'ختار'
    },
    'welcome.choosePath.line2': {
        en: 'Path',
        ar: 'الطريق ديالك'
    },

    // Signup Flow
    'signup.title': {
        en: 'Create Your Program',
        ar: 'صاوب البرنامج ديالك'
    },
    'signup.description': {
        en: 'Enter your details to get started with your personalized 12 week program',
        ar: 'دخل المعلومات ديالك باش تبدا البرنامج الشخصي ديالك ديال 12 سيمانة'
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
        en: 'Log your workouts, track weights, and watch your progress over 12 weeks. Your data is saved automatically.',
        ar: 'سجل التمارين ديالك، تبّع الأثقال، وشوف تقدمك على مدى 12 سيمانة. المعلومات ديالك كتسجل بوحدها.'
    },
    'howItWorks.important': {
        en: 'Important: This creates a personal copy of the program just for you. Your progress is private and saved to your account.',
        ar: 'مهم: هادشي كيصاوب نسخة خاصة بيك من البرنامج. تقدمك خاص بيك ومحفوظ فحسابك.'
    },
    'howItWorks.gotIt': {
        en: 'Got It!',
        ar: 'فهمت!'
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
        en: 'Login',
        ar: 'دخول'
    },
    'common.createAccount': {
        en: 'Join Program',
        ar: 'انضم للبرنامج'
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
    'workout.done': { en: 'Done', ar: 'سالا' },
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

    // Phases (12-week periodization)
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
        en: 'Finish logging the current week to unlock this one.',
        ar: 'كمل تسجيل السيمانة الحالية باش تفتح هادي.'
    },
    'week.active': { en: 'In Progress', ar: 'خدّامة دابا' },
    'week.completed': { en: 'Completed', ar: 'سالات' },
    'week.lockedNotice': {
        en: 'This week is locked. Complete every workout of your current week and log the weights you used — once the whole week is done, the next week unlocks automatically.',
        ar: 'هاد السيمانة مقفولة. كمل جميع تمارين السيمانة الحالية وسجّل الأثقال اللي استعملتي — منين تكمل السيمانة كاملة، السيمانة الجاية كتفتح بوحدها.'
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
    'unlock.title': { en: 'Week Complete!', ar: 'كملتي السيمانة!' },
    'unlock.message': { en: 'Next week unlocked. New targets are ready.', ar: 'السيمانة الجاية تفتحات. الأهداف الجديدة واجدة.' },
    'unlock.weekReady': {
        en: 'Nice work — Week {week} is now unlocked.',
        ar: 'مبروك — السيمانة {week} تفتحات دابا.'
    },
    'unlock.whatChanged': { en: "What's new this week", ar: 'أشنو الجديد فهاد السيمانة' },
    'unlock.point1': {
        en: 'Your targets went up: you will see more reps or a bit more weight than last week.',
        ar: 'الأهداف ديالك زادو: غادي تلقا تكرارات كثر ولا ثقل شوية كثر من السيمانة اللي فاتت.'
    },
    'unlock.point2': {
        en: 'That means a little more total volume, which is exactly what makes you stronger over time.',
        ar: 'هادشي كيعني حجم تمرين شوية كثر، وهادا بالضبط اللي كيقويك مع الوقت.'
    },
    'unlock.point3': {
        en: 'Finish every workout of this week and log your sets to unlock the next one.',
        ar: 'كمل جميع تمارين هاد السيمانة وسجّل المجموعات ديالك باش تفتح اللي من بعد.'
    },
    'unlock.finalTitle': { en: 'Program Complete!', ar: 'كملتي البرنامج!' },
    'unlock.finalMessage': {
        en: 'You finished all 12 weeks. Time to retest and see how far you have come.',
        ar: 'كملتي 12 سيمانة كاملين. دابا وقت إعادة الاختبار باش تشوف شحال تقدمتي.'
    },
    'unlock.continue': { en: 'Continue', ar: 'كمل' },

    // Baseline (Week 0)
    'baseline.title': { en: 'Set Your Baseline', ar: 'حدد نقطة البداية' },
    'baseline.subtitle': {
        en: 'Enter your current working weight for the key lifts. We’ll build your 12 weeks from here.',
        ar: 'دخل الثقل اللي كتخدم بيه دابا فالتمارين الأساسية. غادي نبنيو 12 سيمانة ديالك من هنا.'
    },
    'baseline.weight': { en: 'Working weight (kg)', ar: 'ثقل الخدمة (كجم)' },
    'baseline.reps': { en: 'Reps', ar: 'التكرارات' },
    'baseline.submit': { en: 'Start Week 1', ar: 'بدا السيمانة 1' },
    'baseline.saving': { en: 'Setting up…', ar: 'كنوجدو…' },

    // Retest (Week 12)
    'retest.title': { en: 'Week 12 Retest', ar: 'إعادة اختبار السيمانة 12' },
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
    'intro.eyebrow': { en: 'Hybrid Training System', ar: 'نظام التدريب الهجين' },
    // Headline is split in three so each language can order the words itself.
    'intro.headline.line1': { en: '12 Week', ar: 'برنامج' },
    'intro.headline.accent': { en: 'Elite', ar: 'النخبة' },
    'intro.headline.line2': { en: 'Program', ar: '12 أسبوع' },
    'intro.tagline': {
        en: 'A high-performance progressive overload system designed to build functional power, elite aesthetics, and hybrid work capacity.',
        ar: 'نظام تدريب قوي بالزيادة التدريجية، مصمم باش تبني قوة حقيقية، جسم رياضي، وقدرة تحمل عالية.'
    },
    'intro.spec.splitDays': { en: '{days} Day Split', ar: 'سبليت {days} أيام' },
    'intro.spec.split.title': { en: 'Your Split', ar: 'السبليت ديالك' },
    'intro.spec.split.sub': { en: 'Optimized Frequency', ar: 'وتيرة محسّنة' },
    'intro.spec.progression.title': { en: 'Progression', ar: 'التدرّج' },
    'intro.spec.progression.sub': { en: 'Scientific Overload', ar: 'زيادة علمية' },
    'intro.spec.support.title': { en: 'Full Support', ar: 'دعم كامل' },
    'intro.spec.support.sub': { en: 'Video Drill Guides', ar: 'فيديوهات الشرح' },
    'intro.inside.title': { en: 'The Athlete Experience', ar: 'تجربة الرياضي' },
    'intro.inside.microcycles': { en: 'Advanced 12 Week Microcycles', ar: 'دورات صغيرة متقدمة على 12 أسبوع' },
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
