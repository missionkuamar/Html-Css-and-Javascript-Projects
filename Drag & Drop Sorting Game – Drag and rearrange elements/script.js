document.addEventListener('DOMContentLoaded', () => {
    const sortingArea = document.getElementById('sorting-area');
    const newGameBtn = document.getElementById('new-game-btn');
    const checkBtn = document.getElementById('check-btn');
    const resultMessage = document.getElementById('result-message');
    const categoryDisplay = document.getElementById('category');
    const difficultyDisplay = document.getElementById('difficulty');
    
    // Game data
    const gameData = {
        numbers: {
            easy: [1, 2, 3, 4, 5],
            medium: [10, 20, 30, 40, 50, 60, 70],
            hard: [5, 15, 25, 35, 45, 55, 65, 75, 85]
        },
        letters: {
            easy: ['A', 'B', 'C', 'D', 'E'],
            medium: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            hard: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
        },
        words: {
            easy: ['Apple', 'Banana', 'Cherry', 'Date'],
            medium: ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'],
            hard: ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape', 'Honeydew', 'Kiwi']
        }
    };
    
    const difficulties = ['easy', 'medium', 'hard'];
    const categories = ['numbers', 'letters', 'words'];
    
    let currentItems = [];
    let correctOrder = [];
    let currentCategory = '';
    let currentDifficulty = '';
    
    // Initialize the game
    function initGame() {
        // Select random category and difficulty
        currentCategory = categories[Math.floor(Math.random() * categories.length)];
        currentDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
        
        // Get the correct order
        correctOrder = [...gameData[currentCategory][currentDifficulty]];
        
        // Create a shuffled version
        currentItems = shuffleArray([...correctOrder]);
        
        // Update UI
        categoryDisplay.textContent = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
        difficultyDisplay.textContent = currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1);
        resultMessage.textContent = '';
        resultMessage.className = 'result-message';
        
        // Display the items
        renderItems();
    }
    
    // Render items in the sorting area
    function renderItems() {
        sortingArea.innerHTML = '';
        
        currentItems.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'sortable-item';
            itemElement.textContent = item;
            itemElement.draggable = true;
            itemElement.dataset.index = index;
            
            // Add drag event listeners
            itemElement.addEventListener('dragstart', dragStart);
            itemElement.addEventListener('dragover', dragOver);
            itemElement.addEventListener('drop', drop);
            itemElement.addEventListener('dragend', dragEnd);
            
            sortingArea.appendChild(itemElement);
        });
    }
    
    // Drag and drop functions
    let draggedItem = null;
    
    function dragStart(e) {
        draggedItem = this;
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }
    
    function dragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }
    
    function drop(e) {
        e.preventDefault();
        if (draggedItem !== this) {
            // Get indices of dragged item and drop target
            const fromIndex = parseInt(draggedItem.dataset.index);
            const toIndex = parseInt(this.dataset.index);
            
            // Swap items in array
            [currentItems[fromIndex], currentItems[toIndex]] = [currentItems[toIndex], currentItems[fromIndex]];
            
            // Re-render items
            renderItems();
        }
    }
    
    function dragEnd() {
        this.classList.remove('dragging');
    }
    
    // Check if the order is correct
    function checkOrder() {
        const isCorrect = currentItems.every((item, index) => item === correctOrder[index]);
        
        if (isCorrect) {
            resultMessage.textContent = 'Correct! Well done!';
            resultMessage.className = 'result-message correct';
        } else {
            resultMessage.textContent = 'Not quite right. Try again!';
            resultMessage.className = 'result-message incorrect';
        }
    }
    
    // Helper function to shuffle array
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    // Event listeners
    newGameBtn.addEventListener('click', initGame);
    checkBtn.addEventListener('click', checkOrder);
    
    // Initialize the first game
    initGame();
});