document.getElementById('palindromeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const errorMessage = document.getElementById('errorMessage');
    const result = document.getElementById('result');
    const resultMessage = document.getElementById('resultMessage');

    // Reset error and result
    errorMessage.textContent = '';
    result.classList.add('hidden');

    // Get input value
    const word = document.getElementById('word').value.trim();

    // Validation
    if (!word) {
        errorMessage.textContent = 'Please enter a word or phrase.';
        return;
    }

    // Check if palindrome
    const isPalindrome = checkPalindrome(word);

    // Display result
    resultMessage.textContent = `"${word}" is ${isPalindrome ? '' : 'not '}a palindrome.`;
    result.classList.remove('hidden');

    // Log result (replace with backend API call if needed)
    console.log({ word, isPalindrome });
});

function checkPalindrome(str) {
    // Remove non-alphanumeric characters and convert to lowercase
    const cleanedStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    // Compare with its reverse
    const reversedStr = cleanedStr.split('').reverse().join('');
    return cleanedStr === reversedStr;
}