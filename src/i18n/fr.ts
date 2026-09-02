/**
 * French translations, keyed identically to `translations.ts`.
 *
 * Kept in its own file so French can be reviewed and extended without touching
 * the English/Darija source. `scripts/checkTranslations.ts` fails if a key here
 * is missing or unknown, so this stays in sync with the English keys.
 */
export const frenchTranslations: Record<string, string> = {
    // Welcome Portal
    'welcome.title': 'Bienvenue',
    'welcome.subtitle':
        "Choisis ton objectif du jour. Maîtrise ton corps par l'entraînement ou alimente tes performances par la nutrition.",
    'welcome.training': 'Entraînement',
    'welcome.training.description':
        'Accède à ton programme de surcharge progressive de 12 semaines, enregistre tes séances et suis tes records.',
    'welcome.nutrition': 'Nutrition',
    'welcome.nutrition.description':
        'Calcule tes macros, planifie tes repas et découvre des alternatives saines adaptées à tes objectifs.',
    'welcome.startWorkout': 'Commencer la séance',
    'welcome.openKitchen': 'Ouvrir la cuisine',
    'welcome.eyebrow': 'Programme 12 semaines',
    'welcome.tagline':
        'Construis une vraie force et un moteur qui dure. Un programme, douze semaines, sans blabla.',
    'welcome.stat.program': 'Programme',
    'welcome.stat.sessions': 'Séances',
    'welcome.stat.focus': 'Force · Endurance',
    'welcome.join.subtitle': "Commence tes 12 semaines aujourd'hui",
    'welcome.login.subtitle': 'Tu as déjà un compte ?',
    'welcome.trust': 'Connexion sécurisée · coaché par El Mehdi',
    'welcome.choosePath.line1': 'Choisis ta',
    'welcome.choosePath.line2': 'voie',

    // Signup
    'signup.title': 'Crée ton programme',
    'signup.description':
        'Saisis tes informations pour démarrer ton programme personnalisé de 12 semaines',
    'signup.fullName': 'Nom complet',
    'signup.email': 'Adresse e-mail',
    'signup.emailNote': "Ton e-mail servira d'identifiant",
    'signup.password': 'Mot de passe',
    'signup.confirmPassword': 'Confirme le mot de passe',
    'signup.passwordPlaceholder': '6 caractères minimum',
    'signup.createAccount': 'Créer mon programme',
    'signup.howItWorks': 'Comment ça marche ?',
    'signup.days.label': "Combien de jours par semaine veux-tu t'entraîner ?",
    'signup.days.perWeek': 'jours/semaine',
    'signup.days.comingSoon': 'Bientôt disponible',
    'signup.days.note':
        'Important : ce choix est définitif et ne pourra pas être modifié. Ton programme est construit autour des jours que tu choisis.',
    'signup.days.required': "Choisis combien de jours par semaine tu veux t'entraîner.",

    // How it works
    'howItWorks.title': 'Comment fonctionne « Obtenir ma copie »',
    'howItWorks.step1.title': 'Étape 1 : crée ton compte',
    'howItWorks.step1.description':
        'Saisis ton nom, ton e-mail et choisis un mot de passe sécurisé.',
    'howItWorks.step2.title': 'Étape 2 : connexion',
    'howItWorks.step2.description':
        'Utilise ton e-mail et le mot de passe que tu as créé pour te connecter à ton compte.',
    'howItWorks.step2.description_simplified':
        'Utilise ton e-mail et le mot de passe que tu as créé pour te connecter à ton compte.',
    'howItWorks.step3.title': 'Étape 3 : suis ta progression',
    'howItWorks.step3.description':
        'Enregistre tes séances, suis tes charges et observe ta progression sur 12 semaines. Tes données sont sauvegardées automatiquement.',
    'howItWorks.important':
        'Important : ceci crée une copie personnelle du programme rien que pour toi. Ta progression est privée et enregistrée sur ton compte.',
    'howItWorks.gotIt': 'Compris !',

    // Signup result
    'signup.success.title': 'Compte créé !',
    'signup.success.message':
        'Ton compte a bien été créé. Connecte-toi avec ton e-mail et ton mot de passe.',
    'signup.success.button': 'Aller à la connexion',
    'signup.error.alreadyRegistered':
        'Cet e-mail est déjà enregistré. Redirection vers la connexion…',
    'signup.timeoutRedirect':
        'Le serveur prend un moment. Ton compte a probablement été créé ! Redirection vers la connexion…',

    // Credentials
    'credentials.welcome': 'Bienvenue',
    'credentials.actionRequired': 'Action requise :',
    'credentials.instruction':
        'Copie tes identifiants ci-dessous. Tu devras les saisir manuellement sur l\u2019écran suivant pour accéder à ton programme.',
    'credentials.copyPasswordInstruction':
        'Copie ton mot de passe ci-dessous. Tu devras retenir ton e-mail et saisir ce mot de passe pour accéder à ton programme.',
    'credentials.personalLink': 'TON LIEN PERSONNEL',
    'credentials.email': 'E-MAIL',
    'credentials.password': 'MOT DE PASSE',
    'credentials.warning': 'Important :',
    'credentials.warningText':
        'Fais une capture de cette page ! Clique sur ton lien personnel et utilise ces identifiants pour te connecter.',
    'credentials.goToLogin': 'Aller à la page de connexion',

    // Common
    'common.backToHome': "Retour à l'accueil",
    'common.logout': 'Déconnexion',
    'common.login': 'Connexion',
    'common.createAccount': 'Rejoindre le programme',
    'common.alreadyHaveAccount': 'Tu as déjà un compte ?',
    'common.gotIt': 'Compris',

    // Workout
    'workout.title': 'Ton split personnalisé',
    'workout.selectWorkout': 'Choisis une séance pour voir les exercices',
    'workout.logWeights': 'Choisis une séance pour enregistrer tes charges',
    'workout.week': 'Semaine',
    'workout.done': 'Fait',
    'workout.start': 'Démarrer',
    'workout.review': 'Revoir',

    // Nutrition
    'nutrition.backToPortal': 'Retour au portail',
    'nutrition.badgePlans': 'Plans nutrition',
    'nutrition.selectTarget':
        'Choisis ton objectif calorique pour débloquer ton plan de repas personnalisé.',
    'nutrition.kcalPerDay': 'kcal/jour',
    'nutrition.viewBlueprint': 'Voir le plan',
    'nutrition.designedFor': 'Conçu pour la performance de l\u2019athlète hybride',
    'nutrition.plan.2000.title': 'Perte de gras agressive',
    'nutrition.plan.2000.desc': 'Déficit maximal pour des résultats rapides',
    'nutrition.plan.2500.title': 'Déficit modéré',
    'nutrition.plan.2500.desc': 'Perte de gras durable / maintien',
    'nutrition.plan.3000.title': 'Maintien / prise de masse sèche',
    'nutrition.plan.3000.desc': 'Maintenir ou développer du muscle sec',
    'nutrition.plan.3500.title': 'Prise de masse sèche',
    'nutrition.plan.3500.desc': 'Croissance musculaire optimale pour les gabarits plus lourds',
    'nutrition.meals3': '3 repas',
    'nutrition.meals3snack1': '3 repas + 1 collation',
    'nutrition.meals4snack1': '4 repas + 1 collation',
    'nutrition.planDesc.2000': 'Perte de gras agressive avec 3 repas riches en nutriments',
    'nutrition.planDesc.2500': 'Déficit modéré ou maintien avec 3 repas + collation',
    'nutrition.planDesc.3000': 'Maintien ou prise de masse sèche avec 3 repas + collation',
    'nutrition.planDesc.3500':
        'Prise de masse sèche pour gabarits plus lourds avec 4 repas + collation',
    'nutrition.backToPlans': 'Retour aux plans',
    'nutrition.dailyProtocol': 'Protocole quotidien',
    'nutrition.kcal': 'kcal',
    'nutrition.hideMacros': 'Masquer les macros',
    'nutrition.showMacros': 'Afficher les macros',
    'nutrition.shop': 'Courses',
    'nutrition.pdf': 'PDF',
    'nutrition.totalCalories': 'Calories totales',
    'nutrition.protein': 'Protéines',
    'nutrition.carbs': 'Glucides',
    'nutrition.fats': 'Lipides',
    'nutrition.toast.generatingPdf': 'Génération du PDF…',
    'nutrition.toast.generatingPdfDesc': 'Préparation d\u2019une mise en page haute qualité avec images…',
    'nutrition.toast.pdfSuccess': 'PDF téléchargé avec succès !',
    'nutrition.toast.pdfSuccessDesc':
        'Ton plan de repas a été enregistré dans ton dossier de téléchargements.',
    'nutrition.toast.pdfError': "Échec de l'export PDF",
    'nutrition.toast.pdfErrorDesc':
        'Réessaie ou contacte le support si le problème persiste.',
    'nutrition.toast.swapSuccess': 'Repas remplacé avec succès !',
    'nutrition.toast.swapSuccessDesc': 'Remplacé par {name}',
    'nutrition.mealType.breakfast': 'Petit-déjeuner',
    'nutrition.mealType.lunch': 'Déjeuner',
    'nutrition.mealType.dinner': 'Dîner',
    'nutrition.mealType.snack': 'Collation',
    'nutrition.kcalShort': 'Kcal',
    'nutrition.proShort': 'Prot',
    'nutrition.carbShort': 'Gluc',
    'nutrition.fatShort': 'Lip',
    'nutrition.fibShort': 'Fibr',
    'nutrition.hideDetails': 'Masquer les détails',
    'nutrition.viewRecipe': 'Voir la recette',
    'nutrition.ingredients': 'Ingrédients',
    'nutrition.instructions': 'Préparation',
    'nutrition.swapMeal': 'Changer de repas',
    'nutrition.swapReplace': 'Remplacer',
    'nutrition.swapWithAlt': 'par une alternative similaire',
    'nutrition.noAlternatives':
        'Aucune alternative disponible pour ce type de repas pour le moment.',
    'nutrition.cal': 'cal',
    'nutrition.proteinLower': 'protéines',
    'nutrition.carbsLower': 'glucides',
    'nutrition.fatsLower': 'lipides',
    'nutrition.cancel': 'Annuler',
    'nutrition.fiber.poor': 'Faible',
    'nutrition.fiber.moderate': 'Modéré',
    'nutrition.fiber.good': 'Bon',
    'nutrition.fiber.excessive': 'Excessif',
    'nutrition.fiberIntake': 'Apport en fibres',
    'nutrition.fiberTarget': 'Objectif : 35-50 g par jour',
    'nutrition.currentStatus': 'Statut actuel :',
    'nutrition.smartShoppingList': 'Liste de courses intelligente',
    'nutrition.cat.produce': 'Fruits & légumes',
    'nutrition.cat.meatDairy': 'Viandes & produits laitiers',
    'nutrition.cat.pantry': 'Épicerie',
    'nutrition.cat.other': 'Autre',
    'nutrition.copyList': 'Copier la liste',
    'nutrition.close': 'Fermer',
    'nutrition.copiedClipboard': 'Copié dans le presse-papiers !',

    // Coaching info
    'workout.rpe.title': 'RPE (intensité)',
    'workout.rpe.description':
        'RPE 10 : effort maximal. RPE 8 : tu pourrais faire 2 reps de plus. RPE 7 : exigeant mais fluide.',
    'workout.progressive_overload.title': 'Surcharge progressive',
    'workout.progressive_overload.description':
        'Augmente progressivement les charges ou les reps chaque semaine pour continuer à prendre du muscle.',
    'workout.rest.description': 'Repose-toi entre les séries pour récupérer ton énergie.',

    // Phases
    'phase.anatomical': 'Adaptation anatomique',
    'phase.hypertrophy': 'Hypertrophie',
    'phase.deload': 'Décharge',
    'phase.strength': 'Force',
    'phase.peak': 'Pic',
    'phase.retest': 'Retest',

    // Weeks
    'week.label': 'Semaine',
    'week.locked.title': 'Semaine verrouillée',
    'week.locked.message':
        'Termine l\u2019enregistrement de la semaine en cours pour débloquer celle-ci.',
    'week.active': 'En cours',
    'week.completed': 'Terminée',
    'week.lockedNotice':
        'Cette semaine est verrouillée. Termine toutes les séances de ta semaine en cours et enregistre les charges utilisées — dès que la semaine entière est faite, la suivante se débloque automatiquement.',

    // Logging
    'log.target': 'Objectif de cette semaine',
    'log.lastWeek': 'Semaine dernière',
    'log.reps': 'Reps',
    'log.weight': 'Charge',
    'log.optional': 'facultatif',
    'log.rest': 'Repos',
    'log.restBetween': 'Repos',
    'log.to': 'à',
    'log.set': 'Série',
    'log.save': 'Enregistrer',
    'log.saving': 'Enregistrement…',
    'log.saved': 'Enregistré',
    'log.update': 'Mettre à jour',
    'log.done': 'Fait',
    'log.noData': 'Saisis des reps ou une charge avant d\u2019enregistrer.',
    'log.noReps': 'Saisis des reps avant d\u2019enregistrer.',
    'log.syncFailed':
        'Impossible de charger les séries enregistrées. Tu peux quand même enregistrer cette séance. Vérifie ta connexion ou lance la configuration de la base dans Supabase.',
    'log.retrySync': 'Réessayer',

    // Progress
    'progress.weekLabel': 'Progression de la semaine',
    'progress.setsLogged': '{done} séries sur {total} enregistrées',

    // Unlock
    'unlock.title': 'Semaine terminée !',
    'unlock.message': 'Semaine suivante débloquée. De nouveaux objectifs sont prêts.',
    'unlock.weekReady': 'Bien joué — la semaine {week} est maintenant débloquée.',
    'unlock.whatChanged': 'Ce qui change cette semaine',
    'unlock.point1':
        'Tes objectifs ont augmenté : tu verras plus de reps ou un peu plus de charge que la semaine dernière.',
    'unlock.point2':
        'Cela représente un peu plus de volume total, et c\u2019est exactement ce qui te rend plus fort sur la durée.',
    'unlock.point3':
        'Termine toutes les séances de cette semaine et enregistre tes séries pour débloquer la suivante.',
    'unlock.finalTitle': 'Programme terminé !',
    'unlock.finalMessage':
        'Tu as terminé les 12 semaines. Il est temps de refaire les tests et de voir le chemin parcouru.',
    'unlock.continue': 'Continuer',

    // Baseline
    'baseline.title': 'Définis ta référence',
    'baseline.subtitle':
        'Saisis ta charge de travail actuelle sur les mouvements clés. On construit tes 12 semaines à partir de là.',
    'baseline.weight': 'Charge de travail (kg)',
    'baseline.reps': 'Reps',
    'baseline.submit': 'Commencer la semaine 1',
    'baseline.saving': 'Configuration…',

    // Retest
    'retest.title': 'Retest semaine 12',
    'retest.subtitle': 'Refais les tests sur tes mouvements clés et vois le chemin parcouru.',
    'retest.open': 'Retest & comparaison',
    'retest.compare': 'Ta progression',
    'retest.baseline': 'Semaine 1',
    'retest.now': 'Maintenant',
    'retest.gained': 'Gain',
    'retest.save': 'Enregistrer le retest',

    // App shell
    'app.accessLocked': 'Accès verrouillé',
    'app.authRequired': 'Authentification requise pour accéder au programme',
    'app.enableAccess': 'Activer l\u2019accès',
    'app.hello': 'Salut,',
    'app.athlete': 'Athlète',
    'app.activeSystem': 'Système actif',
    'app.systemSpec': 'Spécifications du système',

    // Program intro
    'intro.backToPortal': 'Retour au portail',
    'intro.eyebrow': "Système d'entraînement hybride",
    'intro.headline.line1': 'Programme',
    'intro.headline.accent': 'Élite',
    'intro.headline.line2': '12 semaines',
    'intro.tagline':
        "Un système de surcharge progressive haute performance, conçu pour développer une puissance fonctionnelle, une esthétique d'élite et une capacité de travail hybride.",
    'intro.spec.splitDays': 'Split {days} jours',
    'intro.spec.split.title': 'Ton split',
    'intro.spec.split.sub': 'Fréquence optimisée',
    'intro.spec.progression.title': 'Progression',
    'intro.spec.progression.sub': 'Surcharge scientifique',
    'intro.spec.support.title': 'Support complet',
    'intro.spec.support.sub': 'Vidéos de démonstration',
    'intro.inside.title': "L'expérience athlète",
    'intro.inside.microcycles': 'Microcycles avancés sur 12 semaines',
    'intro.inside.tracking': 'Suivi et enregistrement des charges',
    'intro.inside.videos': 'Vidéos de démonstration des exercices',
    'intro.inside.records': 'Tableau de bord des records',
    'intro.inside.mobile': "Conçu d'abord pour mobile",
    'intro.inside.fatigue': 'Gestion progressive de la fatigue',
    'intro.accessProgram': 'Accéder au programme',

    // Bottom navigation
    'nav.home': 'Accueil',
    'nav.train': 'Séance',
    'nav.diet': 'Nutrition',
    'nav.logout': 'Déconnexion',
};
