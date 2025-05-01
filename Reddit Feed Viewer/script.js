document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const subredditInput = document.getElementById('subreddit-input');
    const addSubredditBtn = document.getElementById('add-subreddit');
    const subredditList = document.getElementById('subreddit-list');
    const currentSubreddit = document.getElementById('current-subreddit');
    const timeFilter = document.getElementById('time-filter');
    const sortFilter = document.getElementById('sort-filter');
    const postsContainer = document.getElementById('posts-container');
    const loadingIndicator = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');

    // Current state
    let activeSubreddit = 'popular';
    let activeSort = 'top';
    let activeTime = 'week';
    let subreddits = ['popular', 'all', 'javascript', 'programming', 'webdev'];

    // Initialize the app
    function init() {
        loadPosts(activeSubreddit, activeSort, activeTime);
        setupEventListeners();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Subreddit buttons
        subredditList.addEventListener('click', function(e) {
            if (e.target.classList.contains('subreddit-btn')) {
                const subreddit = e.target.dataset.subreddit;
                setActiveSubreddit(subreddit);
                loadPosts(subreddit, activeSort, activeTime);
            }
        });

        // Add subreddit
        addSubredditBtn.addEventListener('click', addSubreddit);
        subredditInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addSubreddit();
            }
        });

        // Filters
        timeFilter.addEventListener('change', function() {
            activeTime = this.value;
            loadPosts(activeSubreddit, activeSort, activeTime);
        });

        sortFilter.addEventListener('change', function() {
            activeSort = this.value;
            // Reset time filter if not using 'top' sort
            if (activeSort !== 'top') {
                timeFilter.value = 'week';
                activeTime = 'week';
            }
            loadPosts(activeSubreddit, activeSort, activeTime);
        });
    }

    // Add a new subreddit to the list
    function addSubreddit() {
        const subreddit = subredditInput.value.trim().toLowerCase();
        if (!subreddit) return;

        // Remove 'r/' if included
        const cleanSubreddit = subreddit.replace(/^r\//, '');

        if (!subreddits.includes(cleanSubreddit)) {
            subreddits.push(cleanSubreddit);
            
            const btn = document.createElement('button');
            btn.className = 'subreddit-btn';
            btn.dataset.subreddit = cleanSubreddit;
            btn.textContent = `r/${cleanSubreddit}`;
            
            subredditList.appendChild(btn);
            subredditInput.value = '';
        }
    }

    // Set the active subreddit and update UI
    function setActiveSubreddit(subreddit) {
        activeSubreddit = subreddit;
        currentSubreddit.textContent = `r/${subreddit}`;
        
        // Update active button
        document.querySelectorAll('.subreddit-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.subreddit === subreddit);
        });
    }

    // Fetch posts from Reddit API
    async function loadPosts(subreddit, sort = 'top', time = 'week') {
        // Show loading indicator
        postsContainer.innerHTML = '';
        loadingIndicator.classList.remove('hidden');
        errorMessage.classList.add('hidden');

        try {
            // Use Reddit's JSON API
            const url = `https://www.reddit.com/r/${subreddit}/${sort}.json?t=${time}&limit=25`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            
            const data = await response.json();
            displayPosts(data.data.children);
        } catch (error) {
            console.error('Error fetching posts:', error);
            errorMessage.classList.remove('hidden');
        } finally {
            loadingIndicator.classList.add('hidden');
        }
    }

    // Display posts in the UI
    function displayPosts(posts) {
        postsContainer.innerHTML = '';

        if (posts.length === 0) {
            postsContainer.innerHTML = `
                <div class="p-8 text-center text-gray-500">
                    No posts found for this subreddit and filter combination.
                </div>
            `;
            return;
        }

        posts.forEach(post => {
            const postData = post.data;
            
            // Skip stickied posts
            if (postData.stickied) return;

            const postElement = document.createElement('article');
            postElement.className = 'p-4 hover:bg-gray-50 transition';
            
            // Post header with author and time
            const postTime = new Date(postData.created_utc * 1000).toLocaleString();
            
            // Determine if the post is NSFW
            const nsfwBadge = postData.over_18 ? `
                <span class="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded ml-2">NSFW</span>
            ` : '';
            
            // Determine if the post is a link or text
            const isLinkPost = postData.post_hint === 'link' || postData.is_self === false;
            const isImagePost = postData.post_hint === 'image';
            const isVideoPost = postData.is_video;
            
            // Post content
            let mediaContent = '';
            if (isImagePost) {
                mediaContent = `
                    <img src="${postData.url}" alt="Post image" 
                         class="mt-2 rounded-md max-h-96 object-contain mx-auto">
                `;
            } else if (isVideoPost && postData.media?.reddit_video) {
                mediaContent = `
                    <video controls class="mt-2 rounded-md max-h-96 w-full">
                        <source src="${postData.media.reddit_video.fallback_url}" type="video/mp4">
                    </video>
                `;
            } else if (isLinkPost && !isImagePost && !isVideoPost) {
                mediaContent = `
                    <a href="${postData.url}" target="_blank" rel="noopener noreferrer" 
                       class="mt-2 inline-block text-blue-500 hover:underline">
                        <i class="fas fa-external-link-alt mr-1"></i> ${postData.url}
                    </a>
                `;
            }
            
            // Self text (for text posts)
            const selfText = postData.selftext ? `
                <div class="mt-2 text-gray-700 prose max-w-none">${postData.selftext}</div>
            ` : '';
            
            // Build the post HTML
            postElement.innerHTML = `
                <div class="flex items-start space-x-3">
                    <!-- Votes -->
                    <div class="flex flex-col items-center">
                        <button class="text-gray-400 hover:text-red-500">
                            <i class="fas fa-arrow-up"></i>
                        </button>
                        <span class="font-medium text-gray-900 my-1">${postData.ups.toLocaleString()}</span>
                        <button class="text-gray-400 hover:text-blue-500">
                            <i class="fas fa-arrow-down"></i>
                        </button>
                    </div>
                    
                    <!-- Post content -->
                    <div class="flex-1">
                        <div class="text-sm text-gray-500">
                            Posted by u/${postData.author} in <a href="https://reddit.com/r/${postData.subreddit}" 
                            target="_blank" class="hover:underline">r/${postData.subreddit}</a> 
                            <span class="text-gray-400">• ${postTime}</span>
                            ${nsfwBadge}
                        </div>
                        
                        <h3 class="text-lg font-semibold mt-1 text-gray-900">
                            <a href="https://reddit.com${postData.permalink}" target="_blank" class="hover:underline">
                                ${postData.title}
                            </a>
                        </h3>
                        
                        ${mediaContent}
                        ${selfText}
                        
                        <!-- Post footer -->
                        <div class="mt-3 flex items-center text-sm text-gray-500 space-x-4">
                            <a href="https://reddit.com${postData.permalink}" target="_blank" 
                               class="flex items-center hover:text-gray-700">
                                <i class="far fa-comment mr-1"></i> ${postData.num_comments.toLocaleString()} comments
                            </a>
                            <button class="flex items-center hover:text-gray-700">
                                <i class="far fa-share-square mr-1"></i> Share
                            </button>
                            <button class="flex items-center hover:text-gray-700">
                                <i class="far fa-bookmark mr-1"></i> Save
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            postsContainer.appendChild(postElement);
        });
    }

    // Initialize the app
    init();
});