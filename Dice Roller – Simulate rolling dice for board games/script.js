document.addEventListener('DOMContentLoaded', () => {
    const diceTypeSelect = document.getElementById('dice-type');
    const diceQuantityInput = document.getElementById('dice-quantity');
    const rollBtn = document.getElementById('roll-btn');
    const diceResults = document.getElementById('dice-results');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');
    
    let rollHistory = JSON.parse(localStorage.getItem('diceRollHistory')) || [];
    
    // Initialize by showing history if it exists
    updateHistoryDisplay();
    
    // Roll dice when button is clicked
    rollBtn.addEventListener('click', rollDice);
    
    // Also allow rolling with Enter key
    diceQuantityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            rollDice();
        }
    });
    
    // Clear history
    clearHistoryBtn.addEventListener('click', () => {
        rollHistory = [];
        localStorage.setItem('diceRollHistory', JSON.stringify(rollHistory));
        updateHistoryDisplay();
    });
    
    function rollDice() {
        const diceType = parseInt(diceTypeSelect.value);
        const quantity = parseInt(diceQuantityInput.value);
        
        // Validate quantity
        if (quantity < 1 || quantity > 10) {
            alert('Please enter a quantity between 1 and 10');
            return;
        }
        
        // Clear previous results
        diceResults.innerHTML = '<p class="instructions">Rolling...</p>';
        
        // Add slight delay to simulate rolling
        setTimeout(() => {
            const results = [];
            let total = 0;
            
            // Generate random numbers for each die
            for (let i = 0; i < quantity; i++) {
                const roll = Math.floor(Math.random() * diceType) + 1;
                results.push(roll);
                total += roll;
            }
            
            // Display results
            displayResults(diceType, results, total);
            
            // Add to history
            addToHistory(diceType, quantity, results, total);
        }, 300);
    }
    
    function displayResults(diceType, results, total) {
        diceResults.innerHTML = '';
        
        // Create container for dice
        const diceContainer = document.createElement('div');
        diceContainer.className = 'dice-container';
        
        // Create a visual die for each result
        results.forEach((result, index) => {
            const die = document.createElement('div');
            die.className = `dice d${diceType} rolling`;
            die.textContent = result;
            
            // Remove rolling class after animation completes
            setTimeout(() => {
                die.classList.remove('rolling');
            }, 500);
            
            diceContainer.appendChild(die);
        });
        
        diceResults.appendChild(diceContainer);
        
        // Show total if more than one die
        if (results.length > 1) {
            const totalElement = document.createElement('div');
            totalElement.className = 'total';
            totalElement.textContent = `Total: ${total}`;
            diceResults.appendChild(totalElement);
        }
    }
    
    function addToHistory(diceType, quantity, results, total) {
        const historyItem = {
            date: new Date().toLocaleString(),
            diceType,
            quantity,
            results,
            total
        };
        
        rollHistory.unshift(historyItem);
        
        // Keep only the last 20 rolls
        if (rollHistory.length > 20) {
            rollHistory.pop();
        }
        
        // Save to localStorage
        localStorage.setItem('diceRollHistory', JSON.stringify(rollHistory));
        
        // Update history display
        updateHistoryDisplay();
    }
    
    function updateHistoryDisplay() {
        historyList.innerHTML = '';
        
        if (rollHistory.length === 0) {
            historyList.innerHTML = '<p>No rolls yet</p>';
            return;
        }
        
        rollHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const diceNotation = `${item.quantity}d${item.diceType}`;
            const resultText = item.results.length > 1 
                ? `${item.results.join(' + ')} = ${item.total}`
                : item.results[0];
            
            historyItem.innerHTML = `
                <span class="history-notation">${diceNotation}</span>
                <span class="history-result">${resultText}</span>
                <span class="history-time">${item.date}</span>
            `;
            
            historyList.appendChild(historyItem);
        });
    }
});