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
            currentScreen: 'setup'
        };

        // Load categories from external configuration
        this.categories = window.WORD_CATEGORIES || {};

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generatePlayerInputs();
        this.generateCategoryButtons();
        this.showScreen('setup-screen');
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

        for (let i = 0; i < this.gameState.playerCount; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'player-input';
            input.placeholder = `Player ${i + 1}`;
            input.maxLength = 20;
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

        this.gameState.scores = {};
        this.gameState.players.forEach(player => {
            this.gameState.scores[player] = 0;
        });

        this.assignImposter();
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
        document.getElementById('current-player-name').textContent = `${playerName}, it's your turn.`;

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
                <h3>You are the</h3>
                <p class="imposter-role">IMPOSTER!</p>
                <p>Category: <span class="highlight">${categoryName}</span></p>
            `;
        } else {
            roleContent.innerHTML = `
                <p>Category: <span class="highlight">${categoryName}</span></p>
                <p>Secret Word: <span class="secret-word">${this.gameState.secretWord.toUpperCase()}</span></p>
            `;
        }

        document.getElementById('reveal-role-btn').classList.add('hidden');
        document.getElementById('role-display').classList.remove('hidden');

        if (this.gameState.currentPlayerIndex === this.gameState.players.length - 1) {
            document.getElementById('pass-phone-btn').textContent = 'Start the Game!';
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
        const firstPlayer = this.gameState.players[0];
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
                <h3 class="success-text">You caught the Imposter!</h3>
                <p><span class="highlight">${imposterName}</span> was the Imposter.</p>
                <p>The secret word was: <span class="secret-word">${this.gameState.secretWord}</span></p>
                <p class="success-text">The Crew gets 1 point!</p>
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
                <h3 class="error-text">Wrong guess!</h3>
                <p><span class="highlight">${votedPlayerName}</span> was not the Imposter.</p>
                <p>The real Imposter was <span class="highlight">${imposterName}</span>!</p>
            `;

            document.getElementById('imposter-guess-prompt').textContent =
                `${imposterName}, you have one chance to guess the secret word for a bonus point!`;
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
                    <h3 class="success-text">Correct!</h3>
                    <p>The word was <span class="secret-word">${this.gameState.secretWord}</span>.</p>
                    <p class="success-text">The Imposter earns 2 points!</p>
                </div>
            `;
            this.gameState.scores[imposterName] += 2;
        } else {
            resultsContent.innerHTML += `
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
                    <h3 class="error-text">Incorrect!</h3>
                    <p>The secret word was <span class="secret-word">${this.gameState.secretWord}</span>.</p>
                    <p>The Imposter earns 1 point.</p>
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
        this.gameState.votedPlayer = null;
        this.gameState.selectedCategory = null;
        this.gameState.secretWord = null;
        document.getElementById('imposter-guess-input').value = '';
        this.showScreen('category-screen');
    }

    endGame() {
        this.gameState = {
            players: [],
            playerCount: 4,
            currentPlayerIndex: 0,
            imposterIndex: -1,
            selectedCategory: null,
            secretWord: null,
            votedPlayer: null,
            scores: {},
            currentScreen: 'setup'
        };

        document.getElementById('player-count-display').textContent = '4';
        this.generatePlayerInputs();
        this.showScreen('setup-screen');
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        this.gameState.currentScreen = screenId.replace('-screen', '');
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
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