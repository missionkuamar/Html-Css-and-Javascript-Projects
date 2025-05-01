document.addEventListener('DOMContentLoaded', () => {
    const textDisplay = document.getElementById('text-display');
    const typingArea = document.getElementById('typing-area');
    const startBtn = document.getElementById('start-btn');
    const newTestBtn = document.getElementById('new-test-btn');
    const timerDisplay = document.getElementById('timer');
    const wpmDisplay = document.getElementById('wpm');
    const accuracyDisplay = document.getElementById('accuracy');
    const resultModal = document.getElementById('result-modal');
    const finalWpm = document.getElementById('final-wpm');
    const finalAccuracy = document.getElementById('final-accuracy');
    const correctCharsDisplay = document.getElementById('correct-chars');
    const incorrectCharsDisplay = document.getElementById('incorrect-chars');
    const closeModalBtn = document.getElementById('close-modal');
    
    // Sample texts for typing test
    const sampleTexts = [
        "The quick brown fox jumps over the lazy dog. This sentence contains all the letters in the English alphabet.",
        "Programming is the process of creating a set of instructions that tell a computer how to perform a task.",
        "The best way to predict the future is to invent it. Computer science is no more about computers than astronomy is about telescopes.",
        "The only way to learn a new programming language is by writing programs in it. The more you code, the better you become.",
        "In the middle of difficulty lies opportunity. The greatest glory in living lies not in never falling, but in rising every time we fall."
    ];
    
    let timer;
    let timeLeft = 60;
    let testActive = false;
    let currentText = '';
    let words = [];
    let currentWordIndex = 0;
    let startTime;
    let correctChars = 0;
    let incorrectChars = 0;
    let totalKeystrokes = 0;
    
    // Initialize the test
    function initTest() {
        // Reset variables
        timeLeft = 60;
        currentWordIndex = 0;
        correctChars = 0;
        incorrectChars = 0;
        totalKeystrokes = 0;
        
        // Select random text
        currentText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        words = currentText.split(' ');
        
        // Display the text with highlighting
        displayText();
        
        // Update UI
        timerDisplay.textContent = timeLeft;
        wpmDisplay.textContent = '0';
        accuracyDisplay.textContent = '100';
        typingArea.value = '';
        typingArea.disabled = false;
        typingArea.focus();
        startBtn.disabled = true;
        newTestBtn.disabled = true;
        
        // Start timer
        testActive = true;
        startTime = new Date().getTime();
        timer = setInterval(updateTimer, 1000);
    }
    
    // Display the text with current word highlighted
    function displayText() {
        textDisplay.innerHTML = words.map((word, index) => {
            if (index === currentWordIndex) {
                return `<span class="current-word">${word}</span>`;
            }
            return word;
        }).join(' ');
    }
    
    // Update timer
    function updateTimer() {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        
        // Calculate and display WPM
        const elapsedMinutes = (60 - timeLeft) / 60;
        const typedWords = typingArea.value.split(/\s+/).filter(word => word.length > 0).length;
        const currentWpm = Math.round(typedWords / elapsedMinutes) || 0;
        wpmDisplay.textContent = currentWpm;
        
        // Calculate and display accuracy
        const accuracy = totalKeystrokes > 0 
            ? Math.round((correctChars / totalKeystrokes) * 100) 
            : 100;
        accuracyDisplay.textContent = accuracy;
        
        if (timeLeft <= 0) {
            endTest();
        }
    }
    
    // Handle typing input
    typingArea.addEventListener('input', (e) => {
        if (!testActive) return;
        
        const typedText = typingArea.value;
        const currentWord = words[currentWordIndex];
        
        // Check if space was pressed (word completed)
        if (typedText.endsWith(' ')) {
            // Check if word was correct
            const userWord = typedText.trim();
            if (userWord === currentWord) {
                correctChars += currentWord.length;
            } else {
                incorrectChars += Math.abs(currentWord.length - userWord.length);
            }
            
            totalKeystrokes += currentWord.length + 1; // +1 for space
            
            // Move to next word
            currentWordIndex++;
            if (currentWordIndex >= words.length) {
                // Reached end of text, start from beginning
                currentWordIndex = 0;
            }
            
            // Update display and clear input
            displayText();
            typingArea.value = '';
        }
        
        // Update character accuracy in real-time
        const currentTyped = typedText.trim();
        for (let i = 0; i < currentTyped.length; i++) {
            if (currentTyped[i] === currentWord[i]) {
                correctChars++;
            } else {
                incorrectChars++;
            }
            totalKeystrokes++;
        }
    });
    
    // End the test
    function endTest() {
        clearInterval(timer);
        testActive = false;
        typingArea.disabled = true;
        startBtn.disabled = false;
        newTestBtn.disabled = false;
        
        // Calculate final results
        const finalWpmValue = parseInt(wpmDisplay.textContent);
        const finalAccuracyValue = parseInt(accuracyDisplay.textContent);
        
        // Display results in modal
        finalWpm.textContent = finalWpmValue;
        finalAccuracy.textContent = finalAccuracyValue;
        correctCharsDisplay.textContent = correctChars;
        incorrectCharsDisplay.textContent = incorrectChars;
        
        resultModal.style.display = 'flex';
    }
    
    // Close the modal
    closeModalBtn.addEventListener('click', () => {
        resultModal.style.display = 'none';
    });
    
    // Start new test
    newTestBtn.addEventListener('click', initTest);
    
    // Start button event listener
    startBtn.addEventListener('click', initTest);
    
    // Initialize with start button ready
    startBtn.disabled = false;
});