(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <style>
            .game-container {
                position: relative;
                height: 200px;
                width: 300px;
                border: 1px solid black;
            }
            .player, .obstacle {
                position: absolute;
                bottom: 0;
            }
            .player {
                left: 10px;
                height: 50px;
                width: 50px;
                background: green;
            }
            .obstacle {
                right: 0;
                height: 50px;
                width: 50px;
                background: red;
                animation: moveObstacle 2s linear infinite;
            }
            .score {
                position: absolute;
                right: 10px;
                top: 10px;
            }
            @keyframes moveObstacle {
                0% { right: 0; }
                100% { right: 100%; }
            }
        </style>
        <div class="game-container">
            <div class="player"></div>
            <div class="score">Score: 0</div>
        </div>
        <button class="start-button">Start Game</button>
        <button class="replay-button" style="display: none;">Play Again</button>
    `;

    class DinoRunner extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({mode: 'open'});
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

            this._gameContainer = this._shadowRoot.querySelector('.game-container');
            this._startButton = this._shadowRoot.querySelector('.start-button');
            this._replayButton = this._shadowRoot.querySelector('.replay-button');
            this._scoreDisplay = this._shadowRoot.querySelector('.score');

            this._score = 0;
        }

        connectedCallback() {
            this._startButton.addEventListener('click', this._startGame.bind(this));
            this._replayButton.addEventListener('click', this._replayGame.bind(this));
        }

        _startGame() {
            this._player = this._shadowRoot.querySelector('.player');
            this._obstacle = document.createElement('div');
            this._obstacle.classList.add('obstacle');
            this._gameContainer.appendChild(this._obstacle);
            this._gameInterval = setInterval(this._gameLoop.bind(this), 50);
            this._startButton.style.display = 'none';
        }

        _gameLoop() {
            const playerRect = this._player.getBoundingClientRect();
            const obstacleRect = this._obstacle.getBoundingClientRect();

            // Detect collision
            if (playerRect.x < obstacleRect.x + obstacleRect.width &&
                playerRect.x + playerRect.width > obstacleRect.x &&
                playerRect.y < obstacleRect.y + obstacleRect.height &&
                playerRect.height + playerRect.y > obstacleRect.y) {
                this._endGame();
            }

            // Increase score if obstacle successfully avoided
            if (obstacleRect.right < 0) {
                this._score++;
                this._scoreDisplay.textContent = 'Score: ' + this._score;
                this._gameContainer.removeChild(this._obstacle);
                this._obstacle = document.createElement('div');
                this._obstacle.classList.add('obstacle');
                this._gameContainer.appendChild(this._obstacle);
            }
        }

        _endGame() {
            clearInterval(this._gameInterval);
            this._obstacle.remove();
            alert('Game Over!');
            this._gameOverScreen.style.display = 'block';
            this._replayButton.style.display = 'block';
        }

        _replayGame() {
            this._score = 0;
            this._scoreDisplay.textContent = 'Score: ' + this._score;
            this._gameOverScreen.style.display = 'none';
            this._replayButton.style.display = 'none';
            this._startGame();
        }
    }

    customElements.define('dino-runner-widget', DinoRunner);
})();

