window.onload = function() {
    const canvas = document.getElementById('game-board');
    const context = canvas.getContext('2d');
    const scoreBoard = document.getElementById('score-board');

    // Game variables
    let gameInterval;
    let playerSnake;
    let redSnakes;
    let food;
    let score;
    let highscore;

    // Game functions
    function startGame() {
        playerSnake = { x: 10, y: 10, dx: 0, dy: 0, tail: [] };
        redSnakes = [{ x: 5, y: 5, dx: 1, dy: 0 }, { x: 15, y: 15, dx: 0, dy: 1 }, { x: 5, y: 15, dx: -1, dy: 0 }];
        food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
        score = 0;
        gameInterval = setInterval(updateGame, 100);
    }

    function endGame() {
        clearInterval(gameInterval);
        alert('Game Over!');
    }

    function moveSnake(snake) {
        snake.x += snake.dx;
        snake.y += snake.dy;
        if (snake.x < 0 || snake.x >= 20 || snake.y < 0 || snake.y >= 20) {
            endGame();
        }
        for (let block of snake.tail) {
            if (snake.x === block.x && snake.y === block.y) {
                endGame();
            }
        }
        snake.tail.push({ x: snake.x, y: snake.y });
        while (snake.tail.length > score) {
            snake.tail.shift();
        }
    }

    function moveRedSnakes() {
        for (let snake of redSnakes) {
            if (Math.random() < 0.2) {
                snake.dx = Math.floor(Math.random() * 3) - 1;
                snake.dy = Math.floor(Math.random() * 3) - 1;
            }
            moveSnake(snake);
        }
    }

    function checkCollision() {
        for (let snake of redSnakes) {
            if (playerSnake.x === snake.x && playerSnake.y === snake.y) {
                endGame();
            }
        }
    }

    function eatFood() {
        if (playerSnake.x === food.x && playerSnake.y === food.y) {
            score++;
            food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
        }
    }

    function drawBoard() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'green';
        for (let block of playerSnake.tail) {
            context.fillRect(block.x * 20, block.y * 20, 20, 20);
        }
        context.fillStyle = 'red';
        for (let snake of redSnakes) {
            for (let block of snake.tail) {
                context.fillRect(block.x * 20, block.y * 20, 20, 20);
            }
        }
        context.fillStyle = 'blue';
        context.fillRect(food.x * 20, food.y * 20, 20, 20);
    }

    function updateScore() {
        scoreBoard.innerText = 'Score: ' + score + ', Highscore: ' + highscore;
    }

    function updateGame() {
        moveSnake(playerSnake);
        moveRedSnakes();
        checkCollision();
        eatFood();
        drawBoard();
        updateScore();
    }

    fetch('/highscore')
        .then(response => response.json())
        .then(data => {
            highscore = data.highscore;
            startGame();
        });
};
