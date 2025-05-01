document.addEventListener('DOMContentLoaded', () => {
    const choices = document.querySelectorAll('.choice');
    const playerScoreDisplay = document.getElementById('player-score');
    const computerScoreDisplay = document.getElementById('computer-score');
    const resultDisplay = document.getElementById('result');
    const historyList = document.getElementById('history-list');
    const resetBtn = document.getElementById('reset-btn');
    
    let playerScore = 0;
    let computerScore = 0;
    let gameHistory = [];
    
    // Computer's random choice
    function computerPlay() {
        const choices = ['rock', 'paper', 'scissors'];
        const randomIndex = Math.floor(Math.random() * 3);
        return choices[randomIndex];
    }
    
    // Determine the winner of a round
    function playRound(playerSelection, computerSelection) {
        if (playerSelection === computerSelection) {
            return 'draw';
        }
        
        if (
            (playerSelection === 'rock' && computerSelection === 'scissors') ||
            (playerSelection === 'paper' && computerSelection === 'rock') ||
            (playerSelection === 'scissors' && computerSelection === 'paper')
        ) {
            return 'player';
        } else {
            return 'computer';
        }
    }
    
    // Update the game state and UI
    function updateGame(playerChoice, computerChoice, result) {
        // Update scores
        if (result === 'player') {
            playerScore++;
            playerScoreDisplay.textContent = playerScore;
            resultDisplay.textContent = `You win! ${playerChoice} beats ${computerChoice}`;
            resultDisplay.className = 'result winner';
        } else if (result === 'computer') {
            computerScore++;
            computerScoreDisplay.textContent = computerScore;
            resultDisplay.textContent = `You lose! ${computerChoice} beats ${playerChoice}`;
            resultDisplay.className = 'result loser';
        } else {
            resultDisplay.textContent = `It's a draw! Both chose ${playerChoice}`;
            resultDisplay.className = 'result draw';
        }
        
        // Add to game history
        const historyItem = {
            player: playerChoice,
            computer: computerChoice,
            result: result,
            timestamp: new Date().toLocaleTimeString()
        };
        
        gameHistory.unshift(historyItem);
        updateHistoryDisplay();
    }
    
    // Update the history list display
    function updateHistoryDisplay() {
        historyList.innerHTML = '';
        
        gameHistory.forEach((game, index) => {
            const gameItem = document.createElement('p');
            
            let resultText;
            let resultClass;
            
            if (game.result === 'player') {
                resultText = 'You won';
                resultClass = 'winner';
            } else if (game.result === 'computer') {
                resultText = 'You lost';
                resultClass = 'loser';
            } else {
                resultText = 'Draw';
                resultClass = 'draw';
            }
            
            gameItem.innerHTML = `
                <span class="${resultClass}">${resultText}</span> - 
                You: ${game.player} vs Computer: ${game.computer} 
                <span class="time">${game.timestamp}</span>
            `;
            
            historyList.appendChild(gameItem);
        });
    }
    
    // Handle player choice
    choices.forEach(choice => {
        choice.addEventListener('click', () => {
            const playerSelection = choice.id;
            const computerSelection = computerPlay();
            const result = playRound(playerSelection, computerSelection);
            
            // Highlight selections temporarily
            const playerChoiceElement = document.getElementById(playerSelection);
            const computerChoiceElement = document.getElementById(computerSelection);
            
            playerChoiceElement.classList.add('selected');
            computerChoiceElement.classList.add('selected');
            
            setTimeout(() => {
                playerChoiceElement.classList.remove('selected');
                computerChoiceElement.classList.remove('selected');
            }, 500);
            
            updateGame(playerSelection, computerSelection, result);
        });
    });
    
    // Reset the game
    resetBtn.addEventListener('click', () => {
        playerScore = 0;
        computerScore = 0;
        gameHistory = [];
        
        playerScoreDisplay.textContent = '0';
        computerScoreDisplay.textContent = '0';
        resultDisplay.textContent = 'Choose your weapon!';
        resultDisplay.className = 'result';
        historyList.innerHTML = '';
    });
    
    // Add keyboard controls
    document.addEventListener('keydown', (e) => {
        let choice;
        
        switch (e.key.toLowerCase()) {
            case 'r':
                choice = document.getElementById('rock');
                break;
            case 'p':
                choice = document.getElementById('paper');
                break;
            case 's':
                choice = document.getElementById('scissors');
                break;
            default:
                return;
        }
        
        choice.click();
        choice.classList.add('keypress');
        setTimeout(() => {
            choice.classList.remove('keypress');
        }, 100);
    });
});