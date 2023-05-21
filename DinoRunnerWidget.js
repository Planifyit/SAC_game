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
        <div class="game">
            <div class="dino" tabindex="0"></div>
            <div class="obstacle"></div>
            <button id="start-button">Start</button>
            <div id="score">0</div>
            <button id="play-again" style="display:none;">Play Again</button>
        </div>
        <button class="start-button">Start Game</button>
        <button class="replay-button" style="display: none;">Play Again</button>
    `;

    class DinoRunner extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({mode: 'open'});
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this._dino = this._shadowRoot.querySelector('.dino');
            this._obstacle = this._shadowRoot.querySelector('.obstacle');
            this._startButton = this._shadowRoot.querySelector('#start-button');
            this._score = this._shadowRoot.querySelector('#score');
            this._playAgainButton = this._shadowRoot.querySelector('#play-again');
            this._gameOver = false;
        }

        connectedCallback() {
            this._dino.addEventListener('keydown', this._jump.bind(this));
            this._startButton.addEventListener('click', this._startGame.bind(this));
            this._playAgainButton.addEventListener('click', this._resetGame.bind(this));
        }

        _startGame() {
            this._startButton.style.display = 'none';
            this._obstacle.style.animation = 'obstacle 1s infinite linear';
            this._score.textContent = '0';
            this._gameOver = false;
            this._obstacle.addEventListener('animationiteration', () => {
                if (!this._gameOver) {
                    let currentScore = parseInt(this._score.textContent);
                    this._score.textContent = currentScore + 1;
                }
            });
        }

        _jump(event) {
            if (event.code === 'Space' || event.type === 'click') {
                if (this._dino.classList != "jump") {
                    this._dino.classList.add("jump");
                }
                setTimeout(() => {
                    this._dino.classList.remove("jump");
                }, 300);
            }
        }

        _checkCollision() {
            let dinoTop = parseInt(window.getComputedStyle(this._dino).getPropertyValue('top'));
            let obstacleLeft = parseInt(window.getComputedStyle(this._obstacle).getPropertyValue('left'));

            if (obstacleLeft < 50 && obstacleLeft > 0 && dinoTop >= 140) {
                this._gameOver = true;
                this._obstacle.style.animation = '';
                this._startButton.style.display = 'none';
                this._playAgainButton.style.display = 'block';
                alert('Game Over!');
            }
        }

        _resetGame() {
            this._playAgainButton.style.display = 'none';
            this._startButton.style.display = 'block';
            this._obstacle.style.left = '150px';
        }
    }

    customElements.define('dino-runner-widget', DinoRunner);
})();
