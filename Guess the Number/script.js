document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    const submitBtn = document.getElementById('submit-guess');
    const guessInput = document.getElementById('guess');
    const maxRangeSelect = document.getElementById('max-range');
    const gameArea = document.getElementById('game-area');
    const feedback = document.getElementById('feedback');
    const guessCount = document.getElementById('guess-count');
    const previousGuesses = document.getElementById('previous-guesses');
    const currentMax = document.getElementById('current-max');
    
    let targetNumber;
    let guesses = [];
    let maxRange = 50;
    
    // Initialize the game
    function initGame() {
        maxRange = parseInt(maxRangeSelect.value);
        currentMax.textContent = maxRange;
        targetNumber = Math.floor(Math.random() * maxRange) + 1;
        guesses = [];
        guessCount.textContent = '0';
        previousGuesses.textContent = '';
        feedback.textContent = '';
        feedback.className = 'game-feedback';
        guessInput.value = '';
        gameArea.style.display = 'block';
        guessInput.focus();
    }
    
    // Handle guess submission
    function submitGuess() {
        const guess = parseInt(guessInput.value);
        
        if (isNaN(guess) || guess < 1 || guess > maxRange) {
            feedback.textContent = `Please enter a number between 1 and ${maxRange}`;
            feedback.className = 'game-feedback';
            return;
        }
        
        guesses.push(guess);
        guessCount.textContent = guesses.length;
        previousGuesses.textContent = guesses.join(', ');
        
        if (guess === targetNumber) {
            // Correct guess
            feedback.textContent = `Congratulations! You found the number in ${guesses.length} guesses!`;
            feedback.className = 'game-feedback correct';
            guessInput.disabled = true;
            submitBtn.disabled = true;
        } else {
            // Wrong guess - provide hint
            if (guess < targetNumber) {
                feedback.textContent = 'Too low! Try a higher number.';
                feedback.className = 'game-feedback low';
            } else {
                feedback.textContent = 'Too high! Try a lower number.';
                feedback.className = 'game-feedback high';
            }
        }
        
        guessInput.value = '';
        guessInput.focus();
    }
    
    // Event listeners
    startBtn.addEventListener('click', initGame);
    
    newGameBtn.addEventListener('click', () => {
        initGame();
        guessInput.disabled = false;
        submitBtn.disabled = false;
    });
    
    submitBtn.addEventListener('click', submitGuess);
    
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitGuess();
        }
    });
    
    // Initialize with game settings visible
    gameArea.style.display = 'none';
});