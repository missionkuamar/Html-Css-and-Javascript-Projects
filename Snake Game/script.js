document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');
    const restartBtn = document.getElementById('restart-btn');
    
    // Game settings
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    
    // Game variables
    let snake = [];
    let food = {};
    let direction = 'right';
    let nextDirection = 'right';
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let gameSpeed = 100;
    let gameLoop;
    let gameRunning = false;
    
    highScoreDisplay.textContent = highScore;
    
    // Initialize game
    function initGame() {
        // Reset snake
        snake = [
            {x: 5, y: 10},
            {x: 4, y: 10},
            {x: 3, y: 10}
        ];
        
        // Reset direction
        direction = 'right';
        nextDirection = 'right';
        
        // Reset score
        score = 0;
        scoreDisplay.textContent = score;
        
        // Create first food
        createFood();
        
        // Set game speed
        gameSpeed = 100;
        
        // Start game loop if not already running
        if (!gameRunning) {
            gameLoop = setInterval(gameUpdate, gameSpeed);
            gameRunning = true;
        }
    }
    
    // Create food at random position
    function createFood() {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        // Make sure food doesn't appear on snake
        for (let i = 0; i < snake.length; i++) {
            if (food.x === snake[i].x && food.y === snake[i].y) {
                createFood();
                return;
            }
        }
    }
    
    // Main game update function
    function gameUpdate() {
        // Update direction
        direction = nextDirection;
        
        // Calculate new head position
        const head = {x: snake[0].x, y: snake[0].y};
        
        switch (direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }
        
        // Check for wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
            return;
        }
        
        // Check for self collision
        for (let i = 0; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
                return;
            }
        }
        
        // Add new head to snake
        snake.unshift(head);
        
        // Check if snake ate food
        if (head.x === food.x && head.y === food.y) {
            // Increase score
            score++;
            scoreDisplay.textContent = score;
            
            // Update high score if needed
            if (score > highScore) {
                highScore = score;
                highScoreDisplay.textContent = highScore;
                localStorage.setItem('snakeHighScore', highScore);
            }
            
            // Create new food
            createFood();
            
            // Increase speed slightly (up to a limit)
            if (gameSpeed > 60 && score % 3 === 0) {
                clearInterval(gameLoop);
                gameSpeed -= 5;
                gameLoop = setInterval(gameUpdate, gameSpeed);
            }
        } else {
            // Remove tail if no food eaten
            snake.pop();
        }
        
        // Draw everything
        drawGame();
    }
    
    // Draw game elements
    function drawGame() {
        // Clear canvas
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw snake
        for (let i = 0; i < snake.length; i++) {
            const segment = snake[i];
            
            // Head is different color
            if (i === 0) {
                ctx.fillStyle = '#2E7D32'; // Dark green head
            } else {
                ctx.fillStyle = '#4CAF50'; // Green body
            }
            
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
            
            // Add eyes to head
            if (i === 0) {
                ctx.fillStyle = 'white';
                const eyeSize = 3;
                
                // Position eyes based on direction
                if (direction === 'right' || direction === 'left') {
                    ctx.fillRect(
                        segment.x * gridSize + (direction === 'right' ? gridSize - 6 : 3), 
                        segment.y * gridSize + 4, 
                        eyeSize, eyeSize
                    );
                    ctx.fillRect(
                        segment.x * gridSize + (direction === 'right' ? gridSize - 6 : 3), 
                        segment.y * gridSize + gridSize - 7, 
                        eyeSize, eyeSize
                    );
                } else {
                    ctx.fillRect(
                        segment.x * gridSize + 4, 
                        segment.y * gridSize + (direction === 'down' ? gridSize - 6 : 3), 
                        eyeSize, eyeSize
                    );
                    ctx.fillRect(
                        segment.x * gridSize + gridSize - 7, 
                        segment.y * gridSize + (direction === 'down' ? gridSize - 6 : 3), 
                        eyeSize, eyeSize
                    );
                }
            }
        }
        
        // Draw food
        ctx.fillStyle = '#FF5252';
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize / 2, 
            food.y * gridSize + gridSize / 2, 
            gridSize / 2 - 2, 
            0, 
            Math.PI * 2
        );
        ctx.fill();
    }
    
    // Game over function
    function gameOver() {
        clearInterval(gameLoop);
        gameRunning = false;
        
        // Show game over message
        const gameOverDiv = document.createElement('div');
        gameOverDiv.className = 'game-over';
        gameOverDiv.innerHTML = `
            <h2>Game Over!</h2>
            <p>Your score: ${score}</p>
            <p>High score: ${highScore}</p>
            <button id="play-again-btn">Play Again</button>
        `;
        document.body.appendChild(gameOverDiv);
        
        document.getElementById('play-again-btn').addEventListener('click', () => {
            gameOverDiv.remove();
            initGame();
        });
    }
    
    // Handle keyboard input
    document.addEventListener('keydown', (e) => {
        // Prevent default action for arrow keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
        
        // Change direction based on key press
        switch (e.key) {
            case 'ArrowUp':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') nextDirection = 'right';
                break;
        }
    });
    
    // Touch controls for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    
    canvas.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, false);
    
    canvas.addEventListener('touchmove', (e) => {
        if (!touchStartX || !touchStartY) return;
        
        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;
        
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;
        
        // Determine swipe direction
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0 && direction !== 'left') nextDirection = 'right';
            else if (dx < 0 && direction !== 'right') nextDirection = 'left';
        } else {
            if (dy > 0 && direction !== 'up') nextDirection = 'down';
            else if (dy < 0 && direction !== 'down') nextDirection = 'up';
        }
        
        // Reset touch coordinates
        touchStartX = 0;
        touchStartY = 0;
        e.preventDefault();
    }, false);
    
    // Restart button
    restartBtn.addEventListener('click', () => {
        if (gameRunning) {
            clearInterval(gameLoop);
            gameRunning = false;
        }
        initGame();
    });
    
    // Start the game
    initGame();
});