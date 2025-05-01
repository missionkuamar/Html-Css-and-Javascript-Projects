// Poll data structure
let poll = {
    question: "What's your favorite programming language?",
    options: [
        { text: "JavaScript", votes: 0 },
        { text: "Python", votes: 0 },
        { text: "Java", votes: 0 },
        { text: "C#", votes: 0 }
    ],
    totalVotes: 0
};

// DOM Elements
const pollQuestion = document.getElementById('poll-question');
const pollOptions = document.getElementById('poll-options');
const pollResults = document.getElementById('poll-results');
const voteBtn = document.getElementById('vote-btn');
const newVoteBtn = document.getElementById('new-vote-btn');
const resultsList = document.getElementById('results-list');
const totalVotesSpan = document.getElementById('total-votes');
const resultsChartCanvas = document.getElementById('results-chart');
let resultsChart = null;

// Admin elements
const newQuestionInput = document.getElementById('new-question');
const optionInputs = document.querySelectorAll('.option-input');
const updatePollBtn = document.getElementById('update-poll-btn');

// Initialize the app
function init() {
    // Load poll data from localStorage or use default
    const savedPoll = localStorage.getItem('poll');
    if (savedPoll) {
        poll = JSON.parse(savedPoll);
    }
    
    renderPoll();
    setupEventListeners();
}

// Render the poll
function renderPoll() {
    pollQuestion.textContent = poll.question;
    
    // Check if user has already voted
    const hasVoted = localStorage.getItem('hasVoted') === 'true';
    
    if (hasVoted) {
        showResults();
    } else {
        showOptions();
    }
}

// Show voting options
function showOptions() {
    pollOptions.classList.remove('hidden');
    pollResults.classList.add('hidden');
    
    // Update radio buttons with current options
    const radioButtons = pollOptions.querySelectorAll('input[type="radio"]');
    const labels = pollOptions.querySelectorAll('label');
    
    poll.options.forEach((option, index) => {
        if (radioButtons[index]) {
            radioButtons[index].value = option.text;
            labels[index].textContent = option.text;
        }
    });
}

// Show results
function showResults() {
    pollOptions.classList.add('hidden');
    pollResults.classList.remove('hidden');
    
    // Update total votes
    totalVotesSpan.textContent = poll.totalVotes;
    
    // Clear previous results
    resultsList.innerHTML = '';
    
    // Add each option to results list
    poll.options.forEach(option => {
        const percentage = poll.totalVotes > 0 
            ? Math.round((option.votes / poll.totalVotes) * 100) 
            : 0;
        
        const optionElement = document.createElement('div');
        optionElement.className = 'bg-gray-100 rounded-md overflow-hidden';
        
        optionElement.innerHTML = `
            <div class="flex justify-between px-4 py-2">
                <span>${option.text}</span>
                <span>${percentage}% (${option.votes})</span>
            </div>
            <div class="h-2 bg-gray-300">
                <div class="h-full bg-indigo-500" style="width: ${percentage}%"></div>
            </div>
        `;
        
        resultsList.appendChild(optionElement);
    });
    
    // Update chart
    updateChart();
}

// Update the chart
function updateChart() {
    const labels = poll.options.map(option => option.text);
    const data = poll.options.map(option => option.votes);
    const backgroundColors = [
        'rgba(79, 70, 229, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(239, 68, 68, 0.7)'
    ];
    
    if (resultsChart) {
        resultsChart.data.labels = labels;
        resultsChart.data.datasets[0].data = data;
        resultsChart.update();
    } else {
        resultsChart = new Chart(resultsChartCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Votes',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Handle vote submission
function handleVote() {
    const selectedOption = document.querySelector('input[name="poll"]:checked');
    
    if (!selectedOption) {
        alert('Please select an option before voting!');
        return;
    }
    
    // Update poll data
    const optionText = selectedOption.value;
    const optionIndex = poll.options.findIndex(opt => opt.text === optionText);
    
    if (optionIndex !== -1) {
        poll.options[optionIndex].votes++;
        poll.totalVotes++;
        
        // Save to localStorage
        localStorage.setItem('poll', JSON.stringify(poll));
        localStorage.setItem('hasVoted', 'true');
        
        // Show results
        showResults();
    }
}

// Handle new vote
function handleNewVote() {
    localStorage.removeItem('hasVoted');
    showOptions();
}

// Update poll from admin controls
function updatePoll() {
    const newQuestion = newQuestionInput.value.trim();
    const newOptions = Array.from(optionInputs).map(input => ({
        text: input.value.trim(),
        votes: 0
    }));
    
    // Find existing votes for options that are being kept
    newOptions.forEach(newOption => {
        const existingOption = poll.options.find(opt => opt.text === newOption.text);
        if (existingOption) {
            newOption.votes = existingOption.votes;
        }
    });
    
    // Calculate new total votes
    const newTotalVotes = newOptions.reduce((sum, option) => sum + option.votes, 0);
    
    // Update poll
    poll.question = newQuestion;
    poll.options = newOptions;
    poll.totalVotes = newTotalVotes;
    
    // Save to localStorage
    localStorage.setItem('poll', JSON.stringify(poll));
    
    // Refresh the display
    renderPoll();
}

// Set up event listeners
function setupEventListeners() {
    voteBtn.addEventListener('click', handleVote);
    newVoteBtn.addEventListener('click', handleNewVote);
    updatePollBtn.addEventListener('click', updatePoll);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);