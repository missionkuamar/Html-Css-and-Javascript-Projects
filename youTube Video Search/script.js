// YouTube API key - Replace with your own API key
const API_KEY = 'YOUR_YOUTUBE_API_KEY';
let currentSearchTerm = '';
let currentPageToken = '';
let nextPageToken = '';
let prevPageToken = '';
let currentFilter = 'all';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('resultsContainer');
const loadingIndicator = document.getElementById('loading');
const pagination = document.getElementById('pagination');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');
const filterAll = document.getElementById('filterAll');
const filterHD = document.getElementById('filterHD');
const filterShort = document.getElementById('filterShort');

// Event Listeners
searchButton.addEventListener('click', searchVideos);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchVideos();
});

prevPageButton.addEventListener('click', () => {
    if (prevPageToken) {
        currentPageToken = prevPageToken;
        fetchVideos(currentSearchTerm, currentPageToken);
    }
});

nextPageButton.addEventListener('click', () => {
    if (nextPageToken) {
        currentPageToken = nextPageToken;
        fetchVideos(currentSearchTerm, currentPageToken);
    }
});

filterAll.addEventListener('click', () => {
    currentFilter = 'all';
    updateFilterButtons();
    if (currentSearchTerm) {
        fetchVideos(currentSearchTerm, currentPageToken);
    }
});

filterHD.addEventListener('click', () => {
    currentFilter = 'hd';
    updateFilterButtons();
    if (currentSearchTerm) {
        fetchVideos(currentSearchTerm, currentPageToken);
    }
});

filterShort.addEventListener('click', () => {
    currentFilter = 'short';
    updateFilterButtons();
    if (currentSearchTerm) {
        fetchVideos(currentSearchTerm, currentPageToken);
    }
});

function updateFilterButtons() {
    filterAll.className = 'px-4 py-2 text-sm font-medium rounded-l-lg ' + (currentFilter === 'all' ? 'bg-red-600 text-white' : 'bg-white border-t border-b border-l border-gray-200');
    filterHD.className = 'px-4 py-2 text-sm font-medium ' + (currentFilter === 'hd' ? 'bg-red-600 text-white' : 'bg-white border-t border-b border-gray-200');
    filterShort.className = 'px-4 py-2 text-sm font-medium rounded-r-lg ' + (currentFilter === 'short' ? 'bg-red-600 text-white' : 'bg-white border-t border-b border-r border-gray-200');
}

// Search videos function
function searchVideos() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        currentSearchTerm = searchTerm;
        currentPageToken = '';
        fetchVideos(searchTerm);
    }
}

// Fetch videos from YouTube API
async function fetchVideos(searchTerm, pageToken = '') {
    try {
        // Show loading indicator
        resultsContainer.innerHTML = '';
        loadingIndicator.classList.remove('hidden');
        pagination.classList.add('hidden');

        // Build API URL based on filter
        let apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=9&q=${encodeURIComponent(searchTerm)}&key=${API_KEY}`;
        
        if (pageToken) {
            apiUrl += `&pageToken=${pageToken}`;
        }
        
        if (currentFilter === 'hd') {
            apiUrl += '&videoDefinition=high';
        } else if (currentFilter === 'short') {
            apiUrl += '&videoDuration=short';
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        // Handle API response
        if (data.items) {
            displayVideos(data.items);
            
            // Update pagination tokens
            nextPageToken = data.nextPageToken || '';
            prevPageToken = data.prevPageToken || '';
            
            // Update pagination UI
            if (nextPageToken || prevPageToken) {
                const currentPage = pageToken ? 
                    (prevPageToken ? 2 : 1) : 1; // Simplified page tracking
                const totalPages = currentPage + (nextPageToken ? 1 : 0);
                
                pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
                pagination.classList.remove('hidden');
                
                prevPageButton.disabled = !prevPageToken;
                nextPageButton.disabled = !nextPageToken;
            }
        } else {
            resultsContainer.innerHTML = `
                <div class="col-span-full text-center py-10 text-gray-500">
                    <i class="fas fa-exclamation-circle text-3xl mb-2 text-red-600"></i>
                    <p>No videos found. Try a different search term.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching videos:', error);
        resultsContainer.innerHTML = `
            <div class="col-span-full text-center py-10 text-gray-500">
                <i class="fas fa-exclamation-triangle text-3xl mb-2 text-red-600"></i>
                <p>Error loading videos. Please try again later.</p>
            </div>
        `;
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}

// Display videos in the UI
function displayVideos(videos) {
    resultsContainer.innerHTML = '';
    
    if (videos.length === 0) {
        resultsContainer.innerHTML = `
            <div class="col-span-full text-center py-10 text-gray-500">
                <i class="fas fa-exclamation-circle text-3xl mb-2 text-red-600"></i>
                <p>No videos found matching your criteria.</p>
            </div>
        `;
        return;
    }
    
    videos.forEach(video => {
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        const channel = video.snippet.channelTitle;
        const thumbnail = video.snippet.thumbnails.medium.url;
        
        const videoElement = document.createElement('div');
        videoElement.className = 'bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition';
        videoElement.innerHTML = `
            <div class="relative pb-[56.25%]"> <!-- 16:9 aspect ratio -->
                <img src="${thumbnail}" alt="${title}" class="absolute h-full w-full object-cover">
                <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="absolute inset-0 flex items-center justify-center">
                    <div class="bg-black bg-opacity-50 rounded-full p-4">
                        <i class="fas fa-play text-white text-2xl"></i>
                    </div>
                </a>
            </div>
            <div class="p-4">
                <h3 class="font-semibold text-lg mb-1 line-clamp-2">${title}</h3>
                <p class="text-gray-600 text-sm">${channel}</p>
                <div class="mt-3 flex justify-end">
                    <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="text-red-600 hover:text-red-700 text-sm font-medium">
                        Watch on YouTube <i class="fas fa-external-link-alt ml-1"></i>
                    </a>
                </div>
            </div>
        `;
        
        resultsContainer.appendChild(videoElement);
    });
}