async function fetchJoke() {
    const setup = document.getElementById('setup');
    const punchline = document.getElementById('punchline');
    const errorMessage = document.getElementById('errorMessage');
    const loading = document.getElementById('loading');
    const getJokeBtn = document.getElementById('getJokeBtn');

    // Reset UI
    errorMessage.textContent = '';
    setup.textContent = '';
    punchline.textContent = '';
    loading.classList.remove('hidden');
    getJokeBtn.disabled = true;

    try {
        const response = await fetch('https://official-joke-api.appspot.com/random_joke');
        if (!response.ok) {
            throw new Error('Failed to fetch joke');
        }
        const data = await response.json();

        // Display joke
        setup.textContent = data.setup;
        punchline.textContent = data.punchline;
    } catch (error) {
        errorMessage.textContent = 'Error fetching joke. Please try again.';
        console.error('Error:', error);
    } finally {
        loading.classList.add('hidden');
        getJokeBtn.disabled = false;
    }
}

// Fetch a joke on page load
fetchJoke();