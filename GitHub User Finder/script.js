document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('search-btn');
    const usernameInput = document.getElementById('username');
    const errorDiv = document.getElementById('error');
    const profileDiv = document.getElementById('profile');
    const loaderDiv = document.getElementById('loader');

    // Search when button is clicked
    searchBtn.addEventListener('click', searchUser);
    
    // Search when Enter key is pressed
    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchUser();
        }
    });

    function searchUser() {
        const username = usernameInput.value.trim();
        
        if (username === '') {
            showError('Please enter a GitHub username');
            return;
        }
        
        // Show loader, hide profile and error
        loaderDiv.classList.remove('hidden');
        profileDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');
        
        // Fetch user data
        fetch(`https://api.github.com/users/${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('User not found');
                }
                return response.json();
            })
            .then(data => {
                displayProfile(data);
                return fetch(`https://api.github.com/users/${username}/repos?sort=created&per_page=5`);
            })
            .then(response => response.json())
            .then(repos => {
                displayRepos(repos);
                loaderDiv.classList.add('hidden');
                profileDiv.classList.remove('hidden');
            })
            .catch(err => {
                showError(err.message);
                loaderDiv.classList.add('hidden');
            });
    }

    function displayProfile(user) {
        document.getElementById('avatar').src = user.avatar_url;
        document.getElementById('name').textContent = user.name || 'No name provided';
        document.getElementById('login').textContent = `@${user.login}`;
        document.getElementById('bio').textContent = user.bio || 'No bio provided';
        document.getElementById('followers').textContent = user.followers;
        document.getElementById('following').textContent = user.following;
        document.getElementById('repos').textContent = user.public_repos;
        document.getElementById('gists').textContent = user.public_gists;
        
        // Optional fields
        document.getElementById('location').textContent = user.location || 'Not specified';
        document.getElementById('blog').textContent = user.blog ? (user.blog.startsWith('http') ? user.blog : `https://${user.blog}`) : 'Not specified';
        document.getElementById('blog').href = user.blog ? (user.blog.startsWith('http') ? user.blog : `https://${user.blog}`) : '#';
        document.getElementById('company').textContent = user.company || 'Not specified';
        
        // Format date
        const joinedDate = new Date(user.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('created').textContent = `Joined on ${joinedDate}`;
    }

    function displayRepos(repos) {
        const reposDiv = document.getElementById('repos');
        reposDiv.innerHTML = '';
        
        if (repos.length === 0) {
            reposDiv.innerHTML = '<p class="text-gray-400">No repositories found</p>';
            return;
        }
        
        repos.forEach(repo => {
            const repoDiv = document.createElement('div');
            repoDiv.className = 'bg-gray-900/50 p-3 rounded-lg hover:bg-gray-900/70 transition-colors';
            
            repoDiv.innerHTML = `
                <div class="flex justify-between items-center">
                    <div>
                        <a href="${repo.html_url}" target="_blank" class="font-bold hover:text-blue-400 hover:underline">${repo.name}</a>
                        <p class="text-sm text-gray-400">${repo.description || 'No description provided'}</p>
                    </div>
                    <div class="flex space-x-3 text-sm">
                        <span class="flex items-center text-gray-400">
                            <i class="fas fa-star mr-1 text-yellow-400"></i> ${repo.stargazers_count}
                        </span>
                        <span class="flex items-center text-gray-400">
                            <i class="fas fa-code-branch mr-1 text-blue-400"></i> ${repo.forks_count}
                        </span>
                    </div>
                </div>
            `;
            
            reposDiv.appendChild(repoDiv);
        });
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        profileDiv.classList.add('hidden');
    }
});