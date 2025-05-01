// Mock data for the Netflix clone
const mockData = {
    popular: [
        { id: 1, title: "Stranger Things", image: "https://image.tmdb.org/t/p/w500/x49Xzq0zR2QHuxQzG6V5iJXZEYF.jpg", progress: 0 },
        { id: 2, title: "The Witcher", image: "https://image.tmdb.org/t/p/w500/8WUVHemHFH2ZIP6NWkwlHWsyrEL.jpg", progress: 0 },
        { id: 3, title: "Money Heist", image: "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg", progress: 0 },
        { id: 4, title: "The Crown", image: "https://image.tmdb.org/t/p/w500/jlG0FO9dh6lBUKv7GBvB6q6Qehq.jpg", progress: 0 },
        { id: 5, title: "Dark", image: "https://image.tmdb.org/t/p/w500/5Lo4H7NNU1YfXFs6h9FfYHDfXzN.jpg", progress: 0 },
        { id: 6, title: "Breaking Bad", image: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg", progress: 0 }
    ],
    trending: [
        { id: 7, title: "Squid Game", image: "https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg", progress: 0 },
        { id: 8, title: "The Queen's Gambit", image: "https://image.tmdb.org/t/p/w500/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg", progress: 0 },
        { id: 9, title: "Bridgerton", image: "https://image.tmdb.org/t/p/w500/kw4GhCZP5NCt6MEn8SJ5gZ3CoC.jpg", progress: 0 },
        { id: 10, title: "Ozark", image: "https://image.tmdb.org/t/p/w500/pCGyohvpQvui1MfYbWn8T7QKzsP.jpg", progress: 0 },
        { id: 11, title: "Peaky Blinders", image: "https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg", progress: 0 },
        { id: 12, title: "The Mandalorian", image: "https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg", progress: 0 }
    ],
    continue: [
        { id: 13, title: "Narcos", image: "https://image.tmdb.org/t/p/w500/7u3pxc0K1wx32IleAkLv78MKgrw.jpg", progress: 65 },
        { id: 14, title: "Black Mirror", image: "https://image.tmdb.org/t/p/w500/7PRddQvw8R5M0vA8bWwF4bVqEiN.jpg", progress: 30 },
        { id: 15, title: "The Last Kingdom", image: "https://image.tmdb.org/t/p/w500/ixWqYjX3qQokFfeInd2QxQh0QOE.jpg", progress: 15 },
        { id: 16, title: "House of Cards", image: "https://image.tmdb.org/t/p/w500/hw2vi8agaJZ7oeSvS8uEYgOtK32.jpg", progress: 80 },
        { id: 17, title: "Mindhunter", image: "https://image.tmdb.org/t/p/w500/91eS4B9eGrDi3yhvMLN0FVQHwUg.jpg", progress: 45 },
        { id: 18, title: "Daredevil", image: "https://image.tmdb.org/t/p/w500/QWbPaDxiB6ew2rRM9xGdqjMrU5h.jpg", progress: 20 }
    ],
    mylist: [
        { id: 19, title: "The Umbrella Academy", image: "https://image.tmdb.org/t/p/w500/scZlQQYnDVlnpxFTxaIv2g0BWnL.jpg", progress: 0 },
        { id: 20, title: "You", image: "https://image.tmdb.org/t/p/w500/1otvZQIb9AiQ9SN6ZURQ6agN7DX.jpg", progress: 0 },
        { id: 21, title: "Sex Education", image: "https://image.tmdb.org/t/p/w500/pZk3W5vNn1h4H4ZQeWQZPtYJ9Lz.jpg", progress: 0 },
        { id: 22, title: "The Haunting of Hill House", image: "https://image.tmdb.org/t/p/w500/5xJw1ZXKjWrS0hcaLMQ22xVY8rv.jpg", progress: 0 },
        { id: 23, title: "Locke & Key", image: "https://image.tmdb.org/t/p/w500/6LGB0GqwcG5ZQhVnHLQ9Cd5qTUL.jpg", progress: 0 },
        { id: 24, title: "The Boys", image: "https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg", progress: 0 }
    ]
};

// Function to create a content card
function createContentCard(item, withProgress = false) {
    const card = document.createElement('div');
    card.className = 'relative group cursor-pointer';
    
    card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="w-full h-auto rounded transition-transform duration-300 group-hover:scale-110">
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div class="text-center">
                <i class="fas fa-play text-2xl mb-2"></i>
                <p class="text-sm font-semibold">${item.title}</p>
            </div>
        </div>
    `;
    
    if (withProgress && item.progress > 0) {
        const progressBar = document.createElement('div');
        progressBar.className = 'absolute bottom-0 left-0 right-0 h-1 bg-gray-600';
        progressBar.innerHTML = `<div class="h-full bg-red-600" style="width: ${item.progress}%"></div>`;
        card.appendChild(progressBar);
    }
    
    return card;
}

// Function to load content into a row
function loadContent(rowId, items, withProgress = false) {
    const row = document.getElementById(rowId);
    row.innerHTML = '';
    
    items.forEach(item => {
        const card = createContentCard(item, withProgress);
        row.appendChild(card);
    });
}

// Load all content when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadContent('popular-row', mockData.popular);
    loadContent('trending-row', mockData.trending);
    loadContent('continue-row', mockData.continue, true);
    loadContent('mylist-row', mockData.mylist);
    
    // Add hover effect to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.classList.add('opacity-80');
        });
        button.addEventListener('mouseleave', () => {
            button.classList.remove('opacity-80');
        });
    });
});