// Internationalization for the Imposter Word Game

const TRANSLATIONS = {
    en: {
        // Header
        gameTitle: "Imposter Word Game",

        // Setup Screen
        setupTitle: "Game Setup",
        playerCountLabel: "Number of Players:",
        startGameBtn: "Start Game",
        playerPlaceholder: "Player",

        // Category Screen
        categoryTitle: "Choose a Category",

        // Role Distribution Screen
        yourTurn: ", it's your turn.",
        revealRoleBtn: "Tap to Reveal Your Role",
        youAreThe: "You are the",
        imposterRole: "IMPOSTER!",
        category: "Category:",
        secretWord: "Secret Word:",
        gotItBtn: "Got It! Pass to the Next Player",
        startGameBtn2: "Start the Game!",

        // Instructions Screen
        instructionsTitle: "The Game Begins!",
        instructionsText1: "Everyone has their role. Put the phone down now.",
        instructionsText2: "Starting with <strong id=\"first-player-name\">Player 1</strong>, go around the circle and give a <strong>one-word clue</strong> related to the secret word.",
        instructionsText3: "After <strong>two full rounds</strong> of clues, pick up the phone to vote.",
        proceedVotingBtn: "Proceed to Voting",

        // Voting Screen
        votingTitle: "Who is the Imposter?",
        votingInstructions: "After discussion, select the player the group has voted for.",
        revealVoteBtn: "Reveal the Vote",

        // Results Screen
        resultsTitle: "Results",
        caughtImposter: "You caught the Imposter!",
        wasImposter: " was the Imposter.",
        secretWordWas: "The secret word was: ",
        crewGetsPoint: "The Crew gets 1 point!",
        wrongGuess: "Wrong guess!",
        wasNotImposter: " was not the Imposter.",
        realImposterWas: "The real Imposter was ",
        imposterGuessPrompt: ", you have one chance to guess the secret word for a bonus point!",
        enterGuess: "Enter your guess",
        submitGuessBtn: "Submit Guess",
        correctGuess: "Correct!",
        wordWas: "The word was ",
        imposterEarns2: "The Imposter earns 2 points!",
        incorrectGuess: "Incorrect!",
        imposterEarns1: "The Imposter earns 1 point.",
        continueBtn: "Continue",

        // Scoreboard Screen
        scoreboardTitle: "Current Scores",
        nextRoundBtn: "Play Next Round",
        endGameBtn: "End Game"
    },
    fr: {
        // Header
        gameTitle: "Jeu de l'Imposteur",

        // Setup Screen
        setupTitle: "Configuration de la Partie",
        playerCountLabel: "Nombre de Joueurs :",
        startGameBtn: "Commencer la Partie",
        playerPlaceholder: "Joueur",

        // Category Screen
        categoryTitle: "Choisissez une Catégorie",

        // Role Distribution Screen
        yourTurn: ", c'est votre tour.",
        revealRoleBtn: "Appuyez pour Révéler votre Rôle",
        youAreThe: "Vous êtes",
        imposterRole: "L'IMPOSTEUR !",
        category: "Catégorie :",
        secretWord: "Mot Secret :",
        gotItBtn: "Compris ! Passez au Joueur Suivant",
        startGameBtn2: "Commencer le Jeu !",

        // Instructions Screen
        instructionsTitle: "Le Jeu Commence !",
        instructionsText1: "Tout le monde a son rôle. Posez le téléphone maintenant.",
        instructionsText2: "En commençant par <strong id=\"first-player-name\">Joueur 1</strong>, faites le tour et donnez un <strong>indice d'un mot</strong> lié au mot secret.",
        instructionsText3: "Après <strong>deux tours complets</strong> d'indices, reprenez le téléphone pour voter.",
        proceedVotingBtn: "Passer au Vote",

        // Voting Screen
        votingTitle: "Qui est l'Imposteur ?",
        votingInstructions: "Après discussion, sélectionnez le joueur pour lequel le groupe a voté.",
        revealVoteBtn: "Révéler le Vote",

        // Results Screen
        resultsTitle: "Résultats",
        caughtImposter: "Vous avez attrapé l'Imposteur !",
        wasImposter: " était l'Imposteur.",
        secretWordWas: "Le mot secret était : ",
        crewGetsPoint: "L'Équipe gagne 1 point !",
        wrongGuess: "Mauvaise supposition !",
        wasNotImposter: " n'était pas l'Imposteur.",
        realImposterWas: "Le vrai Imposteur était ",
        imposterGuessPrompt: ", vous avez une chance de deviner le mot secret pour un point bonus !",
        enterGuess: "Entrez votre supposition",
        submitGuessBtn: "Soumettre la Supposition",
        correctGuess: "Correct !",
        wordWas: "Le mot était ",
        imposterEarns2: "L'Imposteur gagne 2 points !",
        incorrectGuess: "Incorrect !",
        imposterEarns1: "L'Imposteur gagne 1 point.",
        continueBtn: "Continuer",

        // Scoreboard Screen
        scoreboardTitle: "Scores Actuels",
        nextRoundBtn: "Jouer le Tour Suivant",
        endGameBtn: "Terminer la Partie"
    }
};

// Language detection and management
class LanguageManager {
    constructor() {
        this.currentLanguage = this.detectLanguage();
        this.translations = TRANSLATIONS;
    }

    detectLanguage() {
        // Check URL parameter first
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam && (langParam === 'en' || langParam === 'fr')) {
            return langParam;
        }

        // Check localStorage
        const savedLang = localStorage.getItem('gameLanguage');
        if (savedLang && (savedLang === 'en' || savedLang === 'fr')) {
            return savedLang;
        }

        // Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('fr')) {
            return 'fr';
        }

        // Default to English
        return 'en';
    }

    setLanguage(lang) {
        if (lang === 'en' || lang === 'fr') {
            this.currentLanguage = lang;
            localStorage.setItem('gameLanguage', lang);
            return true;
        }
        return false;
    }

    t(key) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];

        for (const k of keys) {
            if (translation && typeof translation === 'object') {
                translation = translation[k];
            } else {
                // Fallback to English if translation not found
                translation = this.translations.en;
                for (const fallbackKey of keys) {
                    if (translation && typeof translation === 'object') {
                        translation = translation[fallbackKey];
                    } else {
                        return `[${key}]`; // Return key if no translation found
                    }
                }
                break;
            }
        }

        return translation || `[${key}]`;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getWordCategories() {
        if (this.currentLanguage === 'fr') {
            return window.WORD_CATEGORIES || {};
        } else {
            return window.WORD_CATEGORIES_EN || {};
        }
    }
}

// Export for use in the game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TRANSLATIONS, LanguageManager };
} else {
    window.TRANSLATIONS = TRANSLATIONS;
    window.LanguageManager = LanguageManager;
}