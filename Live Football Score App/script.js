document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const matchesContainer = document.getElementById('matchesContainer');
    const loadingElement = document.getElementById('loading');
    const noMatchesElement = document.getElementById('noMatches');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const leagueFilter = document.getElementById('leagueFilter');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    // Mock data - in a real app, you would fetch this from an API
    let matches = [];
    let leagues = new Set();

    // Initialize the app
    initApp();

    // Functions
    async function initApp() {
        // In a real app, you would fetch data from an API like:
        // const response = await fetch('https://api.football-data.org/v2/matches');
        // const data = await response.json();
        // matches = data.matches;
        
        // For demo purposes, we'll use mock data
        matches = getMockMatches();
        
        // Extract unique leagues for the filter dropdown
        matches.forEach(match => {
            leagues.add(match.competition.name);
        });
        
        populateLeagueFilter();
        renderMatches(matches);
        
        // Hide loading spinner
        loadingElement.classList.add('hidden');
    }

    function populateLeagueFilter() {
        leagues.forEach(league => {
            const option = document.createElement('option');
            option.value = league;
            option.textContent = league;
            leagueFilter.appendChild(option);
        });
    }

    function renderMatches(matchesToRender) {
        matchesContainer.innerHTML = '';
        
        if (matchesToRender.length === 0) {
            noMatchesElement.classList.remove('hidden');
            return;
        }
        
        noMatchesElement.classList.add('hidden');
        
        matchesToRender.forEach(match => {
            const matchElement = createMatchElement(match);
            matchesContainer.appendChild(matchElement);
        });
    }

    function createMatchElement(match) {
        const matchElement = document.createElement('div');
        matchElement.className = 'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow';
        
        // Determine match status and styling
        let statusClass = 'bg-gray-500';
        let statusText = match.status;
        
        if (match.status === 'LIVE') {
            statusClass = 'bg-red-500 animate-pulse';
            statusText = 'LIVE';
        } else if (match.status === 'IN_PLAY') {
            statusClass = 'bg-green-500';
            statusText = 'Playing';
        } else if (match.status === 'PAUSED') {
            statusClass = 'bg-yellow-500';
            statusText = 'HT';
        } else if (match.status === 'FINISHED') {
            statusClass = 'bg-blue-500';
            statusText = 'FT';
        } else if (match.status === 'SCHEDULED') {
            statusText = new Date(match.utcDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }
        
        matchElement.innerHTML = `
            <div class="p-4">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-gray-500">${match.competition.name}</span>
                    <span class="text-xs px-2 py-1 rounded-full ${statusClass} text-white">${statusText}</span>
                </div>
                
                <div class="flex items-center justify-between py-4">
                    <div class="flex items-center w-2/5">
                        <img src="${match.homeTeam.crest}" alt="${match.homeTeam.name}" class="h-8 w-8 mr-3" onerror="this.src='https://via.placeholder.com/32'">
                        <span class="font-medium truncate">${match.homeTeam.name}</span>
                    </div>
                    
                    <div class="w-1/5 text-center">
                        ${match.status === 'SCHEDULED' ? 
                            '<span class="text-gray-700 font-medium">vs</span>' : 
                            `<span class="text-2xl font-bold">${match.score.fullTime.home} - ${match.score.fullTime.away}</span>`
                        }
                    </div>
                    
                    <div class="flex items-center justify-end w-2/5">
                        <span class="font-medium truncate">${match.awayTeam.name}</span>
                        <img src="${match.awayTeam.crest}" alt="${match.awayTeam.name}" class="h-8 w-8 ml-3" onerror="this.src='https://via.placeholder.com/32'">
                    </div>
                </div>
                
                <div class="flex justify-between text-xs text-gray-500">
                    <span>${new Date(match.utcDate).toLocaleDateString()}</span>
                    <span>${match.venue || 'TBD'}</span>
                </div>
            </div>
        `;
        
        return matchElement;
    }

    function filterMatches() {
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        const selectedLeague = leagueFilter.value;
        const searchTerm = searchInput.value.toLowerCase();
        
        let filtered = matches;
        
        // Apply status filter
        if (activeFilter === 'live') {
            filtered = filtered.filter(match => match.status === 'LIVE' || match.status === 'IN_PLAY' || match.status === 'PAUSED');
        } else if (activeFilter === 'upcoming') {
            filtered = filtered.filter(match => match.status === 'SCHEDULED');
        } else if (activeFilter === 'finished') {
            filtered = filtered.filter(match => match.status === 'FINISHED');
        }
        
        // Apply league filter
        if (selectedLeague !== 'all') {
            filtered = filtered.filter(match => match.competition.name === selectedLeague);
        }
        
        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(match => 
                match.homeTeam.name.toLowerCase().includes(searchTerm) || 
                match.awayTeam.name.toLowerCase().includes(searchTerm) ||
                match.competition.name.toLowerCase().includes(searchTerm)
        }
        
        renderMatches(filtered);
    }

    // Event Listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active', 'bg-blue-500', 'text-white'));
            button.classList.add('active', 'bg-blue-500', 'text-white');
            button.classList.remove('bg-gray-200', 'hover:bg-gray-300');
            filterMatches();
        });
    });
    
    leagueFilter.addEventListener('change', filterMatches);
    searchInput.addEventListener('input', filterMatches);
    searchBtn.addEventListener('click', filterMatches);

    // Mock data function - replace with real API calls in production
    function getMockMatches() {
        return [
            {
                "id": 1,
                "competition": {
                    "name": "Premier League"
                },
                "homeTeam": {
                    "name": "Arsenal",
                    "crest": "https://crests.football-data.org/57.png"
                },
                "awayTeam": {
                    "name": "Chelsea",
                    "crest": "https://crests.football-data.org/61.png"
                },
                "score": {
                    "fullTime": {
                        "home": 2,
                        "away": 2
                    }
                },
                "status": "LIVE",
                "utcDate": new Date(),
                "venue": "Emirates Stadium"
            },
            {
                "id": 2,
                "competition": {
                    "name": "La Liga"
                },
                "homeTeam": {
                    "name": "Barcelona",
                    "crest": "https://crests.football-data.org/81.png"
                },
                "awayTeam": {
                    "name": "Real Madrid",
                    "crest": "https://crests.football-data.org/86.png"
                },
                "score": {
                    "fullTime": {
                        "home": 1,
                        "away": 0
                    }
                },
                "status": "IN_PLAY",
                "utcDate": new Date(),
                "venue": "Camp Nou"
            },
            {
                "id": 3,
                "competition": {
                    "name": "Premier League"
                },
                "homeTeam": {
                    "name": "Manchester United",
                    "crest": "https://crests.football-data.org/66.png"
                },
                "awayTeam": {
                    "name": "Liverpool",
                    "crest": "https://crests.football-data.org/64.png"
                },
                "score": {
                    "fullTime": {
                        "home": 0,
                        "away": 0
                    }
                },
                "status": "PAUSED",
                "utcDate": new Date(),
                "venue": "Old Trafford"
            },
            {
                "id": 4,
                "competition": {
                    "name": "Serie A"
                },
                "homeTeam": {
                    "name": "Juventus",
                    "crest": "https://crests.football-data.org/109.png"
                },
                "awayTeam": {
                    "name": "AC Milan",
                    "crest": "https://crests.football-data.org/98.png"
                },
                "score": {
                    "fullTime": {
                        "home": 3,
                        "away": 1
                    }
                },
                "status": "FINISHED",
                "utcDate": new Date(Date.now() - 86400000),
                "venue": "Allianz Stadium"
            },
            {
                "id": 5,
                "competition": {
                    "name": "Bundesliga"
                },
                "homeTeam": {
                    "name": "Bayern Munich",
                    "crest": "https://crests.football-data.org/5.png"
                },
                "awayTeam": {
                    "name": "Borussia Dortmund",
                    "crest": "https://crests.football-data.org/4.png"
                },
                "score": {
                    "fullTime": {
                        "home": null,
                        "away": null
                    }
                },
                "status": "SCHEDULED",
                "utcDate": new Date(Date.now() + 86400000),
                "venue": "Allianz Arena"
            },
            {
                "id": 6,
                "competition": {
                    "name": "Ligue 1"
                },
                "homeTeam": {
                    "name": "Paris Saint-Germain",
                    "crest": "https://crests.football-data.org/524.png"
                },
                "awayTeam": {
                    "name": "Marseille",
                    "crest": "https://crests.football-data.org/516.png"
                },
                "score": {
                    "fullTime": {
                        "home": 4,
                        "away": 0
                    }
                },
                "status": "FINISHED",
                "utcDate": new Date(Date.now() - 172800000),
                "venue": "Parc des Princes"
            }
        ];
    }
});