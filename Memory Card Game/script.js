document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const movesDisplay = document.getElementById('moves');
    const pairsFoundDisplay = document.getElementById('pairs-found');
    const totalPairsDisplay = document.getElementById('total-pairs');
    const restartBtn = document.getElementById('restart-btn');
    
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let pairsFound = 0;
    let totalPairs = 0;
    
    // Emoji symbols for the cards
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🦁', '🐮', '🐷', '🐸'];
    
    restartBtn.addEventListener('click', startGame);
    
    function startGame() {
        // Reset game state
        moves = 0;
        pairsFound = 0;
        movesDisplay.textContent = moves;
        pairsFoundDisplay.textContent = pairsFound;
        
        // Create pairs of cards
        const gameSize = 8; // 8 pairs (16 cards)
        const selectedEmojis = emojis.slice(0, gameSize);
        const cardValues = [...selectedEmojis, ...selectedEmojis];
        totalPairs = gameSize;
        totalPairsDisplay.textContent = totalPairs;
        
        // Shuffle cards
        cards = shuffleArray(cardValues);
        
        // Clear the game board
        gameBoard.innerHTML = '';
        
        // Create cards
        cards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.index = index;
            card.dataset.value = emoji;
            
            const cardBack = document.createElement('div');
            cardBack.classList.add('card-face', 'card-back');
            
            const cardFront = document.createElement('div');
            cardFront.classList.add('card-face', 'card-front');
            cardFront.textContent = emoji;
            
            card.appendChild(cardBack);
            card.appendChild(cardFront);
            
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }
    
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        if (this.classList.contains('matched')) return;
        
        this.classList.add('flipped');
        
        if (!hasFlippedCard) {
            // First card flipped
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Second card flipped
        secondCard = this;
        moves++;
        movesDisplay.textContent = moves;
        
        checkForMatch();
    }
    
    function checkForMatch() {
        const isMatch = firstCard.dataset.value === secondCard.dataset.value;
        
        if (isMatch) {
            disableMatchedCards();
            pairsFound++;
            pairsFoundDisplay.textContent = pairsFound;
            
            if (pairsFound === totalPairs) {
                setTimeout(() => {
                    alert(`Congratulations! You won in ${moves} moves!`);
                }, 500);
            }
        } else {
            unflipCards();
        }
    }
    
    function disableMatchedCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        resetBoard();
    }
    
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            
            resetBoard();
        }, 1000);
    }
    
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }
    
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    // Start the game when the page loads
    startGame();
});