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
            }
            .score {
                position: absolute;
                right: 10px;
                top: 10px;
            }
            .paused {
                animation-play-state: paused;
            }
        </style>
        <div class="game-container">
            <div class="player"></div>
            <div class="score">Score: 0</div>
        </div>
        <button class="start-button">Start Game</button>
        <button class="replay-button" style="display: none;">Play Again</button>
        <button class="jump-button" style="display: none;">Jump</button>
        <button class="pause-button" style="display: none;">Pause</button>
    `;

    class DinoRunner extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({mode: 'open'});
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

            this._gameContainer = this._shadowRoot.querySelector('.game-container');
            this._startButton = this._shadowRoot.querySelector('.start-button');
            this._replayButton = this._shadowRoot.querySelector('.replay-button');
            this._jumpButton = this._shadowRoot.querySelector('.jump-button');
            this._pauseButton = this._shadowRoot.querySelector('.pause-button');
            this._scoreDisplay = this._shadowRoot.querySelector('.score');

            this._score = 0;
            this._isPaused = false;
            this._isJumping = false;
            this._obstacleRight = 0;
        }

        connectedCallback() {
            this._startButton.addEventListener('click', this._startGame.bind(this));
            this._replayButton.addEventListener('click', this._replayGame.bind(this));
            this._jumpButton.addEventListener('click', this._jump.bind(this));
            this._pauseButton.addEventListener('click', this._pause.bind(this));
        }

        _startGame() {
            this._player = this._shadowRoot.querySelector('.player');
            this._obstacle = document.createElement('div');
            this._obstacle.classList.add('obstacle');
            this._gameContainer.appendChild(this._obstacle);
            this._gameInterval = setInterval(this._gameLoop.bind(this), 50);
            this._startButton.style.display = 'none';
            this._jumpButton.style.display = 'block';
            this._pauseButton.style.display = 'block';
            this._obstacleRight = 0;
        }

        _gameLoop() {
            if (this._isPaused) return;

            const playerRect = this._player.getBoundingClientRect();
            const obstacleRect = this._obstacle.getBoundingClientRect();

            // Detect collision
            if (!this._isJumping &&
                playerRect.x < obstacleRect.x + obstacleRect.width &&
                playerRect.x + playerRect.width > obstacleRect.x &&
                playerRect.y < obstacleRect.y + obstacleRect.height &&
                playerRect.height + playerRect.y > obstacleRect.y) {
                this._endGame();
            }

            // Increase score if obstacle successfully avoided
            if (this._obstacleRight + this._obstacle.offsetWidth > this._gameContainer.offsetWidth) {
                this._score++;
                this._scoreDisplay.textContent = 'Score: ' + this._score;
                this._gameContainer.removeChild(this._obstacle);
                this._obstacle = document.createElement('div');
                this._obstacle.classList.add('obstacle');
                this._gameContainer.appendChild(this._obstacle);
                this._obstacleRight = 0; // reset the obstacle position
            } else {
                // increase the obstacle position for the next loop iteration
                this._obstacleRight += 5;
                this._obstacle.style.right = `${this._obstacleRight}px`;
            }
        }

        _endGame() {
            clearInterval(this._gameInterval);
            this._obstacle.remove();
            alert('Game Over!');
            this._replayButton.style.display = 'block';
            this._jumpButton.style.display = 'none';
            this._pauseButton.style.display = 'none';
        }

        _replayGame() {
            this._score = 0;
            this._scoreDisplay.textContent = 'Score: ' + this._score;
            this._replayButton.style.display = 'none';
            this._jumpButton.style.display = 'none';
            this._pauseButton.style.display = 'none';
            this._startGame();
        }

        _jump() {
            this._isJumping = true;
            this._player.style.bottom = '100px';
            setTimeout(() => {
                this._player.style.bottom = '0px';
                this._isJumping = false;
            }, 3000);
        }

        _pause() {
            this._isPaused = !this._isPaused;
            if(this._isPaused) {
                this._pauseButton.textContent = 'Resume';
            } else {
                this._pauseButton.textContent = 'Pause';
            }
        }
    }

    customElements.define('dino-runner-widget', DinoRunner);
})();
