class ImposterWordGame {
    constructor() {
        this.gameState = {
            players: [],
            playerCount: 4,
            currentPlayerIndex: 0,
            imposterIndex: -1,
            selectedCategory: null,
            secretWord: null,
            votedPlayer: null,
            scores: {},
            currentScreen: 'setup',
            firstPlayerIndex: 0
        };

        // Initialize language manager
        this.lang = new LanguageManager();

        // Load categories based on current language
        this.categories = this.lang.getWordCategories();

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.translateUI();
        this.generatePlayerInputs();
        this.generateCategoryButtons();
        this.showScreen('setup-screen');
    }

    translateUI() {
        // Translate all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.lang.t(key);

            if (element.tagName === 'INPUT' && element.type === 'text') {
                // Don't change the value of input fields, just placeholder if needed
            } else if (key.includes('Text') && translation.includes('<br>')) {
                // Handle HTML content for text that contains line breaks
                element.innerHTML = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.lang.t(key);
            element.placeholder = translation;
        });

        // Special handling for HTML content with embedded elements
        const instructionsText2 = document.querySelector('[data-i18n="instructionsText2"]');
        if (instructionsText2) {
            const firstPlayerName = document.getElementById('first-player-name');
            const playerName = firstPlayerName ? firstPlayerName.textContent : 'Player 1';

            if (this.lang.getCurrentLanguage() === 'fr') {
                instructionsText2.innerHTML = `En commençant par <strong id="first-player-name">${playerName}</strong>, faites le tour et donnez un <strong>indice d'un mot</strong> lié au mot secret.`;
            } else {
                instructionsText2.innerHTML = `Starting with <strong id="first-player-name">${playerName}</strong>, go around the circle and give a <strong>one-word clue</strong> related to the secret word.`;
            }
        }
    }

    setupEventListeners() {
        document.getElementById('decrease-players').addEventListener('click', () => this.changePlayerCount(-1));
        document.getElementById('increase-players').addEventListener('click', () => this.changePlayerCount(1));
        document.getElementById('start-game-btn').addEventListener('click', () => this.startGame());

        // Category button listeners will be added dynamically in generateCategoryButtons()

        document.getElementById('reveal-role-btn').addEventListener('click', () => this.revealRole());
        document.getElementById('pass-phone-btn').addEventListener('click', () => this.passPhone());
        document.getElementById('proceed-voting-btn').addEventListener('click', () => this.showVoting());
        document.getElementById('reveal-vote-btn').addEventListener('click', () => this.revealVote());
        document.getElementById('submit-guess-btn').addEventListener('click', () => this.submitImposterGuess());
        document.getElementById('continue-results-btn').addEventListener('click', () => this.showScoreboard());
        document.getElementById('next-round-btn').addEventListener('click', () => this.nextRound());
        document.getElementById('end-game-btn').addEventListener('click', () => this.endGame());
        document.getElementById('rules-btn').addEventListener('click', () => this.showRules());
        document.getElementById('rules-close-btn').addEventListener('click', () => this.hideRules());

        // Close modal when clicking outside
        document.getElementById('rules-modal').addEventListener('click', (e) => {
            if (e.target.id === 'rules-modal') {
                this.hideRules();
            }
        });

        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('player-input')) {
                this.checkPlayerInputs();
            }
        });
    }

    changePlayerCount(delta) {
        this.gameState.playerCount = Math.max(4, Math.min(12, this.gameState.playerCount + delta));
        document.getElementById('player-count-display').textContent = this.gameState.playerCount;
        this.generatePlayerInputs();
    }

    generatePlayerInputs() {
        const container = document.getElementById('player-names-container');
        container.innerHTML = '';

        // Load previous player names from localStorage
        const savedNames = this.loadPlayerNames();

        for (let i = 0; i < this.gameState.playerCount; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'player-input';
            input.placeholder = `${this.lang.t('playerPlaceholder')} ${i + 1}`;
            input.maxLength = 20;

            // Pre-fill with saved name if available
            if (savedNames && savedNames[i]) {
                input.value = savedNames[i];
            }

            container.appendChild(input);
        }

        this.checkPlayerInputs();
    }

    generateCategoryButtons() {
        const container = document.getElementById('categories-grid');
        container.innerHTML = '';

        Object.keys(this.categories).forEach(categoryKey => {
            const category = this.categories[categoryKey];
            const button = document.createElement('button');
            button.className = 'category-btn btn btn-secondary';
            button.dataset.category = categoryKey;
            button.textContent = category.name;
            button.addEventListener('click', (e) => this.selectCategory(e.target.dataset.category));
            container.appendChild(button);
        });
    }

    checkPlayerInputs() {
        const inputs = document.querySelectorAll('.player-input');
        const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');
        const startBtn = document.getElementById('start-game-btn');
        startBtn.disabled = !allFilled;
    }

    startGame() {
        const inputs = document.querySelectorAll('.player-input');
        this.gameState.players = Array.from(inputs).map(input => input.value.trim());

        // Save player names to localStorage for next game
        this.savePlayerNames(this.gameState.players);

        this.gameState.scores = {};
        this.gameState.players.forEach(player => {
            this.gameState.scores[player] = 0;
        });

        this.assignImposter();
        this.selectFirstPlayer();
        this.showScreen('category-screen');
    }

    assignImposter() {
        this.gameState.imposterIndex = Math.floor(Math.random() * this.gameState.players.length);
    }

    selectCategory(categoryKey) {
        this.gameState.selectedCategory = categoryKey;
        const category = this.categories[categoryKey];
        const words = category.words;
        this.gameState.secretWord = words[Math.floor(Math.random() * words.length)];

        this.gameState.currentPlayerIndex = 0;
        this.showRoleDistribution();
    }

    showRoleDistribution() {
        const playerName = this.gameState.players[this.gameState.currentPlayerIndex];
        document.getElementById('current-player-name').textContent = `${playerName}${this.lang.t('yourTurn')}`;

        document.getElementById('reveal-role-btn').classList.remove('hidden');
        document.getElementById('role-display').classList.add('hidden');

        this.showScreen('role-screen');
    }

    revealRole() {
        const isImposter = this.gameState.currentPlayerIndex === this.gameState.imposterIndex;
        const roleContent = document.getElementById('role-content');

        const categoryName = this.categories[this.gameState.selectedCategory].name;

        if (isImposter) {
            roleContent.innerHTML = `
                <h3>${this.lang.t('youAreThe')}</h3>
                <p class="imposter-role">${this.lang.t('imposterRole')}</p>
                <p>${this.lang.t('category')} <span class="highlight">${categoryName}</span></p>
            `;
        } else {
            roleContent.innerHTML = `
                <p>${this.lang.t('category')} <span class="highlight">${categoryName}</span></p>
                <p>${this.lang.t('secretWord')} <span class="secret-word">${this.gameState.secretWord.toUpperCase()}</span></p>
            `;
        }

        document.getElementById('reveal-role-btn').classList.add('hidden');
        document.getElementById('role-display').classList.remove('hidden');

        if (this.gameState.currentPlayerIndex === this.gameState.players.length - 1) {
            document.getElementById('pass-phone-btn').textContent = this.lang.t('startGameBtn2');
        }
    }

    passPhone() {
        this.gameState.currentPlayerIndex++;

        if (this.gameState.currentPlayerIndex >= this.gameState.players.length) {
            this.showInstructions();
        } else {
            this.showRoleDistribution();
        }
    }

    showInstructions() {
        const firstPlayer = this.gameState.players[this.gameState.firstPlayerIndex];
        document.getElementById('first-player-name').textContent = firstPlayer;
        this.showScreen('instructions-screen');
    }

    showVoting() {
        const votingContainer = document.getElementById('voting-buttons');
        votingContainer.innerHTML = '';

        this.gameState.players.forEach((player, index) => {
            const button = document.createElement('button');
            button.className = 'vote-btn btn btn-secondary';
            button.textContent = player;
            button.addEventListener('click', () => this.selectVote(index, button));
            votingContainer.appendChild(button);
        });

        document.getElementById('reveal-vote-btn').disabled = true;
        this.showScreen('voting-screen');
    }

    selectVote(playerIndex, buttonElement) {
        document.querySelectorAll('.vote-btn').forEach(btn => btn.classList.remove('selected'));
        buttonElement.classList.add('selected');
        this.gameState.votedPlayer = playerIndex;
        document.getElementById('reveal-vote-btn').disabled = false;
    }

    revealVote() {
        const votedPlayerName = this.gameState.players[this.gameState.votedPlayer];
        const imposterName = this.gameState.players[this.gameState.imposterIndex];
        const resultsContent = document.getElementById('results-content');

        if (this.gameState.votedPlayer === this.gameState.imposterIndex) {
            resultsContent.innerHTML = `
                <h3 class="success-text">${this.lang.t('caughtImposter')}</h3>
                <p><span class="highlight">${imposterName}</span>${this.lang.t('wasImposter')}</p>
                <p>${this.lang.t('secretWordWas')}<span class="secret-word">${this.gameState.secretWord}</span></p>
                <p class="success-text">${this.lang.t('crewGetsPoint')}</p>
            `;

            this.gameState.players.forEach((player, index) => {
                if (index !== this.gameState.imposterIndex) {
                    this.gameState.scores[player] += 1;
                }
            });

            document.getElementById('continue-results-btn').classList.remove('hidden');
            document.getElementById('imposter-guess-section').classList.add('hidden');
        } else {
            resultsContent.innerHTML = `
                <h3 class="error-text">${this.lang.t('wrongGuess')}</h3>
                <p><span class="highlight">${votedPlayerName}</span>${this.lang.t('wasNotImposter')}</p>
                <p>${this.lang.t('realImposterWas')}<span class="highlight">${imposterName}</span>!</p>
            `;

            document.getElementById('imposter-guess-prompt').textContent =
                `${imposterName}${this.lang.t('imposterGuessPrompt')}`;
            document.getElementById('imposter-guess-section').classList.remove('hidden');
            document.getElementById('continue-results-btn').classList.add('hidden');
        }

        this.showScreen('results-screen');
    }

    submitImposterGuess() {
        const guess = document.getElementById('imposter-guess-input').value.trim().toLowerCase();
        const secretWord = this.gameState.secretWord.toLowerCase();
        const imposterName = this.gameState.players[this.gameState.imposterIndex];
        const resultsContent = document.getElementById('results-content');

        if (guess === secretWord) {
            resultsContent.innerHTML += `
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
                    <h3 class="success-text">${this.lang.t('correctGuess')}</h3>
                    <p>${this.lang.t('wordWas')}<span class="secret-word">${this.gameState.secretWord}</span>.</p>
                    <p class="success-text">${this.lang.t('imposterEarns2')}</p>
                </div>
            `;
            this.gameState.scores[imposterName] += 2;
        } else {
            resultsContent.innerHTML += `
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
                    <h3 class="error-text">${this.lang.t('incorrectGuess')}</h3>
                    <p>${this.lang.t('secretWordWas')}<span class="secret-word">${this.gameState.secretWord}</span>.</p>
                    <p>${this.lang.t('imposterEarns1')}</p>
                </div>
            `;
            this.gameState.scores[imposterName] += 1;
        }

        document.getElementById('imposter-guess-section').classList.add('hidden');
        document.getElementById('continue-results-btn').classList.remove('hidden');
    }

    showScoreboard() {
        const scoresList = document.getElementById('scores-list');
        scoresList.innerHTML = '';

        const sortedPlayers = this.gameState.players.sort((a, b) =>
            this.gameState.scores[b] - this.gameState.scores[a]
        );

        sortedPlayers.forEach(player => {
            const scoreItem = document.createElement('div');
            scoreItem.className = 'score-item';
            scoreItem.innerHTML = `
                <span class="score-name">${player}</span>
                <span class="score-value">${this.gameState.scores[player]}</span>
            `;
            scoresList.appendChild(scoreItem);
        });

        this.showScreen('scoreboard-screen');
    }

    nextRound() {
        this.assignImposter();
        this.selectFirstPlayer();
        this.gameState.votedPlayer = null;
        this.gameState.selectedCategory = null;
        this.gameState.secretWord = null;
        document.getElementById('imposter-guess-input').value = '';
        this.showScreen('category-screen');
    }

    endGame() {
        // Save current player count for next game
        const currentPlayerCount = this.gameState.playerCount;

        this.gameState = {
            players: [],
            playerCount: currentPlayerCount,
            currentPlayerIndex: 0,
            imposterIndex: -1,
            selectedCategory: null,
            secretWord: null,
            votedPlayer: null,
            scores: {},
            currentScreen: 'setup',
            firstPlayerIndex: 0
        };

        document.getElementById('player-count-display').textContent = currentPlayerCount.toString();
        this.generatePlayerInputs();
        this.showScreen('setup-screen');
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        this.gameState.currentScreen = screenId.replace('-screen', '');

        // Ensure page is scrolled to top on mobile devices
        setTimeout(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            // Also ensure body scroll is at top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }, 100);
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    showRules() {
        // Re-translate the modal content in case language has changed
        this.translateUI();
        document.getElementById('rules-modal').classList.remove('hidden');
    }

    hideRules() {
        document.getElementById('rules-modal').classList.add('hidden');
    }

    savePlayerNames(playerNames) {
        try {
            localStorage.setItem('imposterGamePlayerNames', JSON.stringify(playerNames));
        } catch (e) {
            console.warn('Could not save player names to localStorage:', e);
        }
    }

    loadPlayerNames() {
        try {
            const saved = localStorage.getItem('imposterGamePlayerNames');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.warn('Could not load player names from localStorage:', e);
            return null;
        }
    }

    selectFirstPlayer() {
        // Weighted random selection: imposter has 20% chance, others have 80% chance total
        const imposterChance = 0.2;
        const nonImposterPlayers = this.gameState.players.length - 1;
        const nonImposterChanceEach = (1 - imposterChance) / nonImposterPlayers;

        const random = Math.random();

        if (random < imposterChance) {
            // Imposter starts (20% chance)
            this.gameState.firstPlayerIndex = this.gameState.imposterIndex;
        } else {
            // One of the non-imposters starts (80% chance total)
            const availableIndices = [];
            for (let i = 0; i < this.gameState.players.length; i++) {
                if (i !== this.gameState.imposterIndex) {
                    availableIndices.push(i);
                }
            }
            const randomIndex = Math.floor(Math.random() * availableIndices.length);
            this.gameState.firstPlayerIndex = availableIndices[randomIndex];
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ImposterWordGame();
});

document.addEventListener('contextmenu', e => e.preventDefault());

window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    e.returnValue = '';
});