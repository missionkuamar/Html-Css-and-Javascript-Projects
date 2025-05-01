document.addEventListener('DOMContentLoaded', () => {
    const wordDisplay = document.getElementById('word-display');
    const keyboard = document.getElementById('keyboard');
    const gameMessage = document.getElementById('game-message');
    const wrongLettersEl = document.getElementById('wrong-letters');
    const remainingGuessesEl = document.getElementById('remaining-guesses');
    const hangmanArtEl = document.getElementById('hangman-art');
    const newGameBtn = document.getElementById('new-game-btn');
    const categoryEl = document.getElementById('category');
    
    // Game words by category
    const wordsByCategory = {
        animals: ['ELEPHANT', 'GIRAFFE', 'KANGAROO', 'DOLPHIN', 'CHEETAH'],
        countries: ['CANADA', 'BRAZIL', 'JAPAN', 'GERMANY', 'AUSTRALIA'],
        fruits: ['BANANA', 'WATERMELON', 'PINEAPPLE', 'STRAWBERRY', 'BLUEBERRY'],
        general: ['COMPUTER', 'KEYBOARD', 'INTERNET', 'PROGRAMMING', 'ALGORITHM']
    };
    
    // Hangman art stages
    const hangmanStages = [
        `
          +---+
          |   |
              |
              |
              |
              |
        =========
        `,
        `
          +---+
          |   |
          O   |
              |
              |
              |
        =========
        `,
        `
          +---+
          |   |
          O   |
          |   |
              |
              |
        =========
        `,
        `
          +---+
          |   |
          O   |
         /|   |
              |
              |
        =========
        `,
        `
          +---+
          |   |
          O   |
         /|\\  |
              |
              |
        =========
        `,
        `
          +---+
          |   |
          O   |
         /|\\  |
         /    |
              |
        =========
        `,
        `
          +---+
          |   |
          O   |
         /|\\  |
         / \\  |
              |
        =========
        `
    ];
    
    let selectedWord = '';
    let selectedCategory = '';
    let correctLetters = [];
    let wrongLetters = [];
    let remainingGuesses = 6;
    let gameActive = false;
    
    // Initialize keyboard
    function createKeyboard() {
        keyboard.innerHTML = '';
        for (let i = 65; i <= 90; i++) {
            const letter = String.fromCharCode(i);
            const button = document.createElement('button');
            button.className = 'letter-btn';
            button.textContent = letter;
            button.id = `letter-${letter}`;
            button.addEventListener('click', () => handleGuess(letter));
            keyboard.appendChild(button);
        }
    }
    
    // Start a new game
    function startNewGame() {
        // Select random category and word
        const categories = Object.keys(wordsByCategory);
        selectedCategory = categories[Math.floor(Math.random() * categories.length)];
        const words = wordsByCategory[selectedCategory];
        selectedWord = words[Math.floor(Math.random() * words.length)];
        
        // Reset game state
        correctLetters = [];
        wrongLetters = [];
        remainingGuesses = 6;
        gameActive = true;
        
        // Update UI
        categoryEl.textContent = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
        remainingGuessesEl.textContent = remainingGuesses;
        wrongLettersEl.textContent = '';
        gameMessage.textContent = '';
        hangmanArtEl.textContent = hangmanStages[0];
        
        // Display word placeholder
        displayWord();
        
        // Reset keyboard
        const buttons = document.querySelectorAll('.letter-btn');
        buttons.forEach(button => {
            button.disabled = false;
            button.className = 'letter-btn';
        });
    }
    
    // Display the word with blanks for unguessed letters
    function displayWord() {
        wordDisplay.innerHTML = selectedWord
            .split('')
            .map(letter => correctLetters.includes(letter) ? letter : '_')
            .join(' ');
        
        // Check if player won
        if (!wordDisplay.textContent.includes('_')) {
            gameActive = false;
            gameMessage.textContent = 'Congratulations! You won!';
            gameMessage.style.color = '#4CAF50';
        }
    }
    
    // Handle a letter guess
    function handleGuess(letter) {
        if (!gameActive) return;
        
        const button = document.getElementById(`letter-${letter}`);
        button.disabled = true;
        
        if (selectedWord.includes(letter)) {
            // Correct guess
            if (!correctLetters.includes(letter)) {
                correctLetters.push(letter);
                button.className = 'letter-btn correct';
                displayWord();
            }
        } else {
            // Wrong guess
            if (!wrongLetters.includes(letter)) {
                wrongLetters.push(letter);
                wrongLettersEl.textContent = wrongLetters.join(' ');
                remainingGuesses--;
                remainingGuessesEl.textContent = remainingGuesses;
                button.className = 'letter-btn wrong';
                updateHangman();
                
                // Check if player lost
                if (remainingGuesses === 0) {
                    gameActive = false;
                    gameMessage.textContent = `Game Over! The word was ${selectedWord}`;
                    gameMessage.style.color = '#f44336';
                    wordDisplay.textContent = selectedWord.split('').join(' ');
                }
            }
        }
    }
    
    // Update hangman drawing
    function updateHangman() {
        const stageIndex = 6 - remainingGuesses;
        hangmanArtEl.textContent = hangmanStages[stageIndex];
    }
    
    // Keyboard event listener
    document.addEventListener('keydown', e => {
        if (!gameActive) return;
        
        const key = e.key.toUpperCase();
        if (/^[A-Z]$/.test(key)) {
            const button = document.getElementById(`letter-${key}`);
            if (button && !button.disabled) {
                button.click();
            }
        }
    });
    
    // Initialize the game
    createKeyboard();
    newGameBtn.addEventListener('click', startNewGame);
    
    // Start first game
    startNewGame();
});