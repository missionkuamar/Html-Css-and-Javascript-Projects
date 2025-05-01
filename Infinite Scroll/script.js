document.addEventListener('DOMContentLoaded', function() {
    const contentContainer = document.getElementById('content-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    const endMessage = document.getElementById('end-message');
    
    let isLoading = false;
    let currentPage = 1;
    const itemsPerPage = 6;
    const maxPages = 5; // Simulate having a limited amount of content
    
    // Initial load
    loadMoreItems();
    
    // Scroll event listener
    window.addEventListener('scroll', function() {
        if (isLoading || currentPage >= maxPages) return;
        
        // Check if we've scrolled near the bottom of the page
        const scrollPosition = window.innerHeight + window.scrollY;
        const pageHeight = document.body.offsetHeight;
        const threshold = 200; // pixels from bottom to trigger load
        
        if (scrollPosition > pageHeight - threshold) {
            loadMoreItems();
        }
    });
    
    function loadMoreItems() {
        if (isLoading || currentPage >= maxPages) return;
        
        isLoading = true;
        loadingSpinner.classList.remove('hidden');
        
        // Simulate API call delay
        setTimeout(function() {
            // Generate some dummy content
            const fragment = document.createDocumentFragment();
            
            for (let i = 0; i < itemsPerPage; i++) {
                const itemNumber = (currentPage - 1) * itemsPerPage + i + 1;
                const item = createContentItem(itemNumber);
                fragment.appendChild(item);
            }
            
            contentContainer.appendChild(fragment);
            currentPage++;
            isLoading = false;
            loadingSpinner.classList.add('hidden');
            
            // Show end message if we've loaded all pages
            if (currentPage >= maxPages) {
                endMessage.classList.remove('hidden');
            }
        }, 1000); // 1 second delay to simulate network request
    }
    
    function createContentItem(number) {
        const colors = ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100', 'bg-pink-100', 'bg-indigo-100'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const item = document.createElement('div');
        item.className = `rounded-lg overflow-hidden shadow-md ${randomColor}`;
        item.innerHTML = `
            <div class="p-6">
                <h2 class="text-xl font-semibold mb-2">Item ${number}</h2>
                <p class="text-gray-700">This is content item number ${number}. Scroll down to load more items automatically.</p>
                <div class="mt-4 h-40 flex items-center justify-center text-gray-400">
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                </div>
            </div>
        `;
        
        return item;
    }
});