(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <style>
        
    .game-over {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 15px;
        border: 3px solid red; 
        background: white;
        text-align: center;
        z-index: 10;
    }        
        
          .game-container {
                position: relative;
                height: 200px;
                width: 300px;
                border: 1px solid black;
            }
          
            .player, .obstacle, .top-obstacle {
                position: absolute;
                bottom: 0;
            }
            .player {
                left: 10px;
                height: 50px;
                width: 120px;
   background: orange;  background-size: cover;
            }
            .obstacle {
    position: absolute;
    right: 0;
    height: 80px;
    width: 20px;
    background: #5F6A9D;
}
.top-obstacle {
    position: absolute;
    right: 0;
    top: 0;
    height: 100px;
    width: 20px;
    background: orange;
}
            .score {
                position: absolute;
                right: 10px;
                top: 10px;
            }
            .paused {
                animation-play-state: paused;
            }
            
   .start-button, .replay-button, .jump-button, .dunk-button, .pause-button {
    margin: 10px;
    padding: 5px 10px;
    font-size: 1.5em;
}

      .start-button, .replay-button {
        background: blue;
        color: white;
      }

      .jump-button {
        background: #5F6A9D;
        color: white;
      }
      
      .dunk-button {
        background: orange;
        color: white;
      }

      .pause-button {
        background: blue;
        color: white;
      }
      
        </style>
        <div class="game-container">
            <div class="player"></div>
            <div class="score">Score: 0</div>
        </div>
        <button class="start-button">Start Game</button>
        <button class="replay-button" style="display: none;">Play Again</button>
        <button class="jump-button" style="display: none;">Jump</button>
        <button class="dunk-button" style="display: none;">Dunk</button>
        <button class="pause-button" style="display: none;">Pause</button>
    `;

    class PlanifyitRunnerWidget extends HTMLElement {
        constructor() {
            super();
            this._blueStarted = false;
            this._shadowRoot = this.attachShadow({mode: 'open'});
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

            this._gameContainer = this._shadowRoot.querySelector('.game-container');
            this._startButton = this._shadowRoot.querySelector('.start-button');
            this._replayButton = this._shadowRoot.querySelector('.replay-button');
            this._jumpButton = this._shadowRoot.querySelector('.jump-button');
            this._dunkButton = this._shadowRoot.querySelector('.dunk-button');
            this._pauseButton = this._shadowRoot.querySelector('.pause-button');
            this._scoreDisplay = this._shadowRoot.querySelector('.score');

            this._score = 0;
            this._isPaused = false;
            this._isJumping = false;
            this._obstacleRight = 0;
            this._topObstacleRight = 0;
            this._topObstacleOffset = this.randomOffset();
            
                
        }

        randomOffset() {
        // Returns a random number between 50 and 150
        return Math.floor(Math.random() * 200) + 50;
    }
        connectedCallback() {
            this._startButton.addEventListener('click', this._startGame.bind(this));
            this._replayButton.addEventListener('click', this._replayGame.bind(this));
            this._jumpButton.addEventListener('click', this._jump.bind(this));
            this._dunkButton.addEventListener('click', this._dunk.bind(this));
            this._pauseButton.addEventListener('click', this._pause.bind(this));
        }

_updateTopScores(newScore) {
    let topScores = JSON.parse(localStorage.getItem('topScores')) || [];
    topScores.push(newScore);
    topScores.sort((a, b) => b - a);
    topScores = topScores.slice(0, 5); // Keep only top 10 scores
    localStorage.setItem('topScores', JSON.stringify(topScores));
}        
        
_startGame() {
 if (this._gameContainer.contains(this._obstacle)) {
        this._gameContainer.removeChild(this._obstacle);
    }
    if (this._gameContainer.contains(this._topObstacle)) {
        this._gameContainer.removeChild(this._topObstacle);
    }

    this._player = this._shadowRoot.querySelector('.player');
    this._player.style.bottom = '0px'; // Reset the position of the Planifyit
    this._obstacle = document.createElement('div');
    this._obstacle.classList.add('obstacle');
    this._gameContainer.appendChild(this._obstacle);
    this._topObstacle = null; // Don't create the blue obstacle yet
    this._gameInterval = setInterval(this._gameLoop.bind(this), 50);
    this._startButton.style.display = 'none';
    this._jumpButton.style.display = 'block';
    this._dunkButton.style.display = 'block';
    this._pauseButton.style.display = 'block';
    this._obstacleRight = 0;
    this._topObstacleRight = 0;
    this._blueStarted = false;
    this._redStarted = true;
}


_gameLoop() {
    if(this._isPaused) return;

    // For the bottom obstacle...
    if (!this._blueStarted && !this._obstacle) {
        this._obstacle = document.createElement('div');
        this._obstacle.classList.add('obstacle');
        this._gameContainer.appendChild(this._obstacle);
        this._obstacleRight = 0; // start from the right edge
    }

    if (this._obstacle) {
        this._obstacleRight += 5; // increase the right value, moving left
        this._obstacle.style.right = `${this._obstacleRight}px`;

        // Check if red obstacle has reached the same position as the Planifyit
        if (this._obstacleRight >= this._gameContainer.offsetWidth - this._player.offsetWidth) {
            // Start blue obstacle if it hasn't started yet
            if (!this._blueStarted) {
                this._blueStarted = true;
            }
        }

        // Check if red obstacle has gone past the left edge of the game container
        if (this._obstacleRight >= this._gameContainer.offsetWidth) {
            if (this._gameContainer.contains(this._obstacle)) {
                this._gameContainer.removeChild(this._obstacle);
                this._obstacle = null;
                this._score++;
                this._scoreDisplay.textContent = 'Score: ' + this._score;
            }
        }
    }

    // For the top obstacle...
    if (this._blueStarted && !this._topObstacle) {
        this._topObstacle = document.createElement('div');
        this._topObstacle.classList.add('top-obstacle');
        this._gameContainer.appendChild(this._topObstacle);
        this._topObstacleRight = 0; // start from the right edge
    }

    if (this._topObstacle) {
        this._topObstacleRight += 5; // increase the right value, moving left
        this._topObstacle.style.right = `${this._topObstacleRight}px`;

        // Check if blue obstacle has reached the same position as the Planifyit
        if (this._topObstacleRight >= this._gameContainer.offsetWidth - this._player.offsetWidth) {
            // Start red obstacle if it hasn't started yet
            if (this._blueStarted) {
                this._blueStarted = false;
            }
        }

        // Check if blue obstacle has gone past the left edge of the game container
        if (this._topObstacleRight >= this._gameContainer.offsetWidth) {
            if (this._gameContainer.contains(this._topObstacle)) {
                this._gameContainer.removeChild(this._topObstacle);
                this._topObstacle = null;
                this._score++;
                this._scoreDisplay.textContent = 'Score: ' + this._score;
            }
        }
    }

    // Collision detection
 const playerRect = this._player.getBoundingClientRect();
    const obstacleRect = this._obstacle ? this._obstacle.getBoundingClientRect() : null;
    const topObstacleRect = this._topObstacle ? this._topObstacle.getBoundingClientRect() : null;

    if (obstacleRect && playerRect.right > obstacleRect.left && playerRect.left < obstacleRect.right && 
        playerRect.bottom > obstacleRect.top && playerRect.top < obstacleRect.bottom) {
        this._endGame();
        return; // Stop the game loop after game over
    }

    if (topObstacleRect && playerRect.right > topObstacleRect.left && playerRect.left < topObstacleRect.right && 
        playerRect.bottom > topObstacleRect.top && playerRect.top < topObstacleRect.bottom) {
        this._endGame();
        return; // Stop the game loop after game over
    }
}

_endGame() {
    clearInterval(this._gameInterval);
    this._updateTopScores(this._score);
    this._topScores = JSON.parse(localStorage.getItem('topScores')) || [];
    this._gameOverElement = document.createElement('div');
    this._gameOverElement.classList.add('game-over');
    this._gameOverElement.innerHTML = `
        <h2>Game Over!</h2>
        <p>Your score: ${this._score}</p>
        <p>Top scores:</p>
        <ol>${this._topScores.map(score => `<li>${score}</li>`).join('')}</ol>
    `;
    this._gameContainer.appendChild(this._gameOverElement);
    this._replayButton.style.display = 'block';
    this._jumpButton.style.display = 'none';
    this._dunkButton.style.display = 'none';
    this._pauseButton.style.display = 'none';

    // Remove obstacles from the game area
    if (this._gameContainer.contains(this._obstacle)) {
        this._gameContainer.removeChild(this._obstacle);
    }
    if (this._gameContainer.contains(this._topObstacle)) {
        this._gameContainer.removeChild(this._topObstacle);
    }
}



_replayGame() {
    this._score = 0;
    this._scoreDisplay.textContent = 'Score: ' + this._score;
    this._replayButton.style.display = 'none';
    this._jumpButton.style.display = 'none';
    this._dunkButton.style.display = 'none';
    this._pauseButton.style.display = 'none';
    if (this._gameContainer.contains(this._gameOverElement)) {
        this._gameContainer.removeChild(this._gameOverElement);
    }
    this._startGame();
}


        _jump() {
            this._isJumping = true;
            this._player.style.bottom = '100px';
        }

        _dunk() {
            this._player.style.bottom = '0px';
            this._isJumping = false;
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

    customElements.define('planifyit-runner-widget', PlanifyitRunnerWidget);
})();
