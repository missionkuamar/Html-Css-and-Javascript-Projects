document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const sourceText = document.getElementById('sourceText');
    const translatedText = document.getElementById('translatedText');
    const sourceLang = document.getElementById('sourceLang');
    const targetLang = document.getElementById('targetLang');
    const translateBtn = document.getElementById('translateBtn');
    const swapLangs = document.getElementById('swapLangs');
    const clearSource = document.getElementById('clearSource');
    const copyTranslation = document.getElementById('copyTranslation');
    const charCount = document.getElementById('charCount');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    
    // Character counter
    sourceText.addEventListener('input', function() {
        charCount.textContent = `${sourceText.value.length} characters`;
    });
    
    // Clear source text
    clearSource.addEventListener('click', function() {
        sourceText.value = '';
        charCount.textContent = '0 characters';
    });
    
    // Copy translation
    copyTranslation.addEventListener('click', function() {
        if (translatedText.value) {
            navigator.clipboard.writeText(translatedText.value);
            // Show feedback
            const originalText = copyTranslation.innerHTML;
            copyTranslation.innerHTML = '<i class="fas fa-check mr-1"></i>Copied!';
            setTimeout(() => {
                copyTranslation.innerHTML = originalText;
            }, 2000);
        }
    });
    
    // Swap languages
    swapLangs.addEventListener('click', function() {
        const tempLang = sourceLang.value;
        sourceLang.value = targetLang.value;
        targetLang.value = tempLang;
        
        const tempText = sourceText.value;
        sourceText.value = translatedText.value;
        translatedText.value = tempText;
    });
    
    // Translate function
    async function translateText(text, sourceLang, targetLang) {
        // Using LibreTranslate API (you might need to host your own instance or find a public one)
        const apiUrl = 'https://libretranslate.de/translate';
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: JSON.stringify({
                    q: text,
                    source: sourceLang,
                    target: targetLang
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            return data.translatedText;
        } catch (err) {
            console.error('Translation error:', err);
            throw err;
        }
    }
    
    // Translate button click
    translateBtn.addEventListener('click', async function() {
        const text = sourceText.value.trim();
        if (!text) {
            showError('Please enter text to translate');
            return;
        }
        
        // Show loading
        loading.classList.remove('hidden');
        error.classList.add('hidden');
        
        try {
            const translation = await translateText(
                text,
                sourceLang.value,
                targetLang.value
            );
            
            translatedText.value = translation;
        } catch (err) {
            showError('Translation failed. Please try again later.');
            console.error(err);
        } finally {
            loading.classList.add('hidden');
        }
    });
    
    // Show error message
    function showError(message) {
        error.textContent = message;
        error.classList.remove('hidden');
    }
    
    // Auto-translate when source text changes (with debounce)
    let debounceTimer;
    sourceText.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (sourceText.value.trim() && sourceText.value.length > 3) {
                translateBtn.click();
            }
        }, 1000);
    });
});