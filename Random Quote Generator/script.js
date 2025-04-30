// Sample quote array (replace with API call if preferred)
const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
    { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
];

function getRandomQuote() {
    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');
    const errorMessage = document.getElementById('errorMessage');
    const loading = document.getElementById('loading');
    const getQuoteBtn = document.getElementById('getQuoteBtn');

    // Reset UI
    errorMessage.textContent = '';
    quoteText.textContent = '';
    quoteAuthor.textContent = '';
    loading.classList.remove('hidden');
    getQuoteBtn.disabled = true;

    // Simulate delay for local quotes (remove for API)
    setTimeout(() => {
        try {
            // Get random quote from array
            const randomIndex = Math.floor(Math.random() * quotes.length);
            const quote = quotes[randomIndex];

            // Display quote
            quoteText.textContent = `"${quote.text}"`;
            quoteAuthor.textContent = `— ${quote.author}`;
        } catch (error) {
            errorMessage.textContent = 'Error loading quote. Please try again.';
            console.error('Error:', error);
        } finally {
            loading.classList.add('hidden');
            getQuoteBtn.disabled = false;
        }
    }, 500);

    /* 
    // Optional: Fetch quote from Quotable API
    async function fetchQuote() {
        try {
            const response = await fetch('https://api.quotable.io/random');
            if (!response.ok) {
                throw new Error('Failed to fetch quote');
            }
            const data = await response.json();
            quoteText.textContent = `"${data.content}"`;
            quoteAuthor.textContent = `— ${data.author}`;
        } catch (error) {
            errorMessage.textContent = 'Error fetching quote. Please try again.';
            console.error('Error:', error);
        } finally {
            loading.classList.add('hidden');
            getQuoteBtn.disabled = false;
        }
    }
    fetchQuote();
    */
}

// Load a quote on page load
getRandomQuote();