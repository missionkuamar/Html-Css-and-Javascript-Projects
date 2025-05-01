document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const apiKeyInput = document.getElementById('api-key');
    
    // Load API key from localStorage if available
    if (localStorage.getItem('openai_api_key')) {
        apiKeyInput.value = localStorage.getItem('openai_api_key');
    }
    
    // Save API key to localStorage when changed
    apiKeyInput.addEventListener('change', function() {
        localStorage.setItem('openai_api_key', apiKeyInput.value);
    });
    
    // Function to add a message to the chat
    function addMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'}`;
        
        const bubble = document.createElement('div');
        bubble.className = `max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
            role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`;
        bubble.textContent = content;
        
        messageDiv.appendChild(bubble);
        chatContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // Function to handle sending a message
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            alert('Please enter your OpenAI API key');
            return;
        }
        
        // Add user message to chat
        addMessage('user', message);
        userInput.value = '';
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'flex justify-start';
        typingIndicator.innerHTML = `
            <div class="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
                <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                    <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                </div>
            </div>
        `;
        chatContainer.appendChild(typingIndicator);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        try {
            // Call OpenAI API
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{role: 'user', content: message}],
                    temperature: 0.7
                })
            });
            
            // Remove typing indicator
            chatContainer.removeChild(typingIndicator);
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            
            // Add AI response to chat
            addMessage('assistant', aiResponse);
        } catch (error) {
            console.error('Error:', error);
            // Remove typing indicator
            chatContainer.removeChild(typingIndicator);
            // Show error message
            addMessage('assistant', `Sorry, I encountered an error: ${error.message}`);
        }
    }
    
    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});