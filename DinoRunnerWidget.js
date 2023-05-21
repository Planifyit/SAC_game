(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <style>
   .game {
                position: relative;
                height: 200px;
                width: 500px;
                border: 1px solid black;
            }

            .dino {
                position: absolute;
                bottom: 0;
                left: 50px;
                width: 50px;
                height: 50px;
                background: green;
            }

            .obstacle {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 50px;
                height: 50px;
                background: red;
                animation: obstacle 1s infinite linear;
            }

            @keyframes obstacle {
                0% { right: 0; }
                100% { right: 100%; }
            }

            #start-button, #play-again {
                position: relative;
                margin: 10px;
            }

            #score {
                position: absolute;
                top: 0;
                right: 0;
                padding: 10px;
            }
        </style>
        <div class="game">
            <div class="dino"></div>
            <div class="obstacle"></div>
            <button id="start-button">Start</button>
            <div id="score">0</div>
            <button id="play-again" style="display:none;">Play Again</button>
            <div id="controls" style="display:none;">
                <button id="move-up">↑</button>
                <button id="move-down">↓</button>
                <button id="move-left">←</button>
                <button id="move-right">→</button>
            </div>
        </div>
    `;

    class DinoGame extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({mode: 'open'});
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

            this._dino = this._shadowRoot.querySelector('.dino');
            this._obstacle = this._shadowRoot.querySelector('.obstacle');
            this._startButton = this._shadowRoot.querySelector('#start-button');
            this._playAgainButton = this._shadowRoot.querySelector('#play-again');
            this._scoreElement = this._shadowRoot.querySelector('#score');
            this._controls = this._shadowRoot.querySelector('#controls');

            this._moveUpButton = this._shadowRoot.querySelector('#move-up');
            this._moveDownButton = this._shadowRoot.querySelector('#move-down');
            this._moveLeftButton = this._shadowRoot.querySelector('#move-left');
            this._moveRightButton = this._shadowRoot.querySelector('#move-right');

            this._isJumping = false;
            this._isGameRunning = false;
            this._score = 0;
        }

        connectedCallback() {
            this._moveUpButton.addEventListener('click', this._move.bind(this, 'up'));
            this._moveDownButton.addEventListener('click', this._move.bind(this, 'down'));
            this._moveLeftButton.addEventListener('click', this._move.bind(this, 'left'));
            this._moveRightButton.addEventListener('click', this._move.bind(this, 'right'));
            this._startButton.addEventListener('click', this._startGame.bind(this));
            this._playAgainButton.addEventListener('click', this._resetGame.bind(this));
        }

        _move(direction) {
            if (!this._isGameRunning) return;

            switch (direction) {
                case 'up':
                    if (!this._isJumping) {
                        this._isJumping = true;
                        this._dino.style.bottom = '150px';
                        setTimeout(() => {
                            this._dino.style.bottom = '0px';
                            this._isJumping = false;
                        }, 500);
                    }
                    break;
                // add additional cases here for other directions if needed
            }
        }

        _startGame() {
            this._isGameRunning = true;
            this._scoreElement.textContent = this._score;
            this._startButton.style.display = 'none';
            this._controls.style.display = 'block';
            this._obstacle.style.animationPlayState = 'running';

            this._gameInterval = setInterval(() => {
                const dinoBottom = parseInt(window.getComputedStyle(this._dino).getPropertyValue('bottom'));
                const obstacleLeft = parseInt(window.getComputedStyle(this._obstacle).getPropertyValue('left'));

                if (obstacleLeft > 0 && obstacleLeft < 40 && dinoBottom <= 60) {
                    this._endGame();
                }

                if (this._isGameRunning) {
                    this._score++;
                    this._scoreElement.textContent = this._score;
                }
            }, 10);
        }

        _endGame() {
            this._isGameRunning = false;
            clearInterval(this._gameInterval);
            this._obstacle.style.animationPlayState = 'paused';
            this._controls.style.display = 'none';
            this._playAgainButton.style.display = 'block';
            alert('Game Over!');
        }

        _resetGame() {
            this._isGameRunning = false;
            this._score = 0;
            this._scoreElement.textContent = this._score;
            this._obstacle.style.animationPlayState = 'paused';
            this._playAgainButton.style.display = 'none';
            this._startButton.style.display = 'block';
        }
    }

    customElements.define('dino-game', DinoGame);
})();
