// Get the display element
const output = document.getElementById('output');

// Function to append input to display
function appendToDisplay(value) {
 if (output.textContent === '0' && value !== '.' && !['+', '-', '*', '/'].includes(value)) {
 output.textContent = value;
 } else if (output.textContent === 'Error') {
 output.textContent = value;
 } else {
 output.textContent += value;
 }
}

// Function to clear the display
function clearDisplay() {
 output.textContent = '0';
}

// Function to remove last character (backspace)
function backspace() {
 if (output.textContent === 'Error') {
 output.textContent = '0';
 } else if (output.textContent.length > 1) {
 output.textContent = output.textContent.slice(0, -1);
 } else {
 output.textContent = '0';
 }
}

// Function to calculate percentage
function calculatePercentage() {
 try {
 let value = eval(output.textContent);
 if (isNaN(value)) throw new Error('Invalid input');
 let result = value / 100;
 output.textContent = result % 1 === 0 ? result : result.toFixed(2);
 } catch (error) {
 output.textContent = 'Error';
 }
}

// Function to calculate the result
function calculate() {
 try {
 let expression = output.textContent.replace(/×/g, '*');
 let result = eval(expression);
 if (result === Infinity || result === -Infinity || isNaN(result)) {
 output.textContent = 'Error';
 return;
 }
 output.textContent = result % 1 === 0 ? result : result.toFixed(2);
 } catch (error) {
 output.textContent = 'Error';
 }
}

// Keyboard Support
document.addEventListener('keydown', (event) => {
 const key = event.key;
 if (key >= '0' && key <= '9' || key === '.' || key === '+' || key === '-' || key === '*' || key === '/') {
 appendToDisplay(key);
 } else if (key === 'Enter') {
 calculate();
 } else if (key === 'Escape') {
 clearDisplay();
 } else if (key === 'Backspace') {
 backspace();
 } else if (key === '%') {
 calculatePercentage();
 }
});