// DOM Elements
const eventForm = document.getElementById('eventForm');
const eventsContainer = document.getElementById('eventsContainer');
const editModal = document.getElementById('editModal');
const closeEditModal = document.getElementById('closeEditModal');
const editForm = document.getElementById('editForm');
const deleteEventBtn = document.getElementById('deleteEventBtn');

// Event storage
let events = JSON.parse(localStorage.getItem('events')) || [];

// Initialize the app
function init() {
    renderEvents();
    startCountdownTimers();
}

// Render all events
function renderEvents() {
    if (events.length === 0) {
        eventsContainer.innerHTML = `
            <div class="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
                <i class="fas fa-calendar-plus text-4xl mb-4"></i>
                <p>No events yet. Add your first event above!</p>
            </div>
        `;
        return;
    }

    // Sort events by date (soonest first)
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    eventsContainer.innerHTML = '';
    events.forEach((event, index) => {
        const eventElement = createEventElement(event, index);
        eventsContainer.appendChild(eventElement);
    });
}

// Create HTML for a single event
function createEventElement(event, index) {
    const eventDate = new Date(event.date);
    const now = new Date();
    const timeRemaining = eventDate - now;

    // Format date
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    const formattedDate = eventDate.toLocaleDateString('en-US', options);

    const eventElement = document.createElement('div');
    eventElement.className = `bg-white rounded-lg shadow-md overflow-hidden ${event.color} bg-opacity-10 border-l-4 ${event.color} border-opacity-80`;
    eventElement.dataset.id = index;
    
    eventElement.innerHTML = `
        <div class="p-5">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-1">${event.name}</h3>
                    <p class="text-gray-600 mb-3"><i class="far fa-calendar-alt mr-2"></i>${formattedDate}</p>
                </div>
                <button class="edit-event-btn text-gray-500 hover:text-blue-600 p-1">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
            
            <div class="countdown-timer grid grid-cols-4 gap-2 text-center mt-4">
                <div class="bg-white p-2 rounded shadow">
                    <div class="text-2xl font-bold days">00</div>
                    <div class="text-xs text-gray-500">DAYS</div>
                </div>
                <div class="bg-white p-2 rounded shadow">
                    <div class="text-2xl font-bold hours">00</div>
                    <div class="text-xs text-gray-500">HOURS</div>
                </div>
                <div class="bg-white p-2 rounded shadow">
                    <div class="text-2xl font-bold minutes">00</div>
                    <div class="text-xs text-gray-500">MINUTES</div>
                </div>
                <div class="bg-white p-2 rounded shadow">
                    <div class="text-2xl font-bold seconds">00</div>
                    <div class="text-xs text-gray-500">SECONDS</div>
                </div>
            </div>
            
            ${timeRemaining <= 0 ? `
                <div class="mt-4 text-center py-2 bg-green-100 text-green-800 rounded">
                    <i class="fas fa-check-circle mr-1"></i> Event has arrived!
                </div>
            ` : ''}
        </div>
    `;
    
    return eventElement;
}

// Start countdown timers for all events
function startCountdownTimers() {
    // Clear any existing intervals
    const existingIntervals = window.countdownIntervals || [];
    existingIntervals.forEach(interval => clearInterval(interval));
    window.countdownIntervals = [];

    events.forEach((event, index) => {
        const eventElement = document.querySelector(`[data-id="${index}"]`);
        if (!eventElement) return;

        const countdownElement = eventElement.querySelector('.countdown-timer');
        if (!countdownElement) return;

        const daysElement = countdownElement.querySelector('.days');
        const hoursElement = countdownElement.querySelector('.hours');
        const minutesElement = countdownElement.querySelector('.minutes');
        const secondsElement = countdownElement.querySelector('.seconds');

        const eventDate = new Date(event.date);
        
        // Update countdown immediately
        updateCountdown();

        // Set interval to update countdown every second
        const interval = setInterval(updateCountdown, 1000);
        window.countdownIntervals.push(interval);

        function updateCountdown() {
            const now = new Date();
            const timeRemaining = eventDate - now;

            if (timeRemaining <= 0) {
                daysElement.textContent = '00';
                hoursElement.textContent = '00';
                minutesElement.textContent = '00';
                secondsElement.textContent = '00';
                clearInterval(interval);
                return;
            }

            const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

            daysElement.textContent = days.toString().padStart(2, '0');
            hoursElement.textContent = hours.toString().padStart(2, '0');
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            secondsElement.textContent = seconds.toString().padStart(2, '0');
        }
    });
}

// Add new event
eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const eventName = document.getElementById('eventName').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventColor = document.querySelector('input[name="eventColor"]:checked').value;
    
    const newEvent = {
        name: eventName,
        date: eventDate,
        color: eventColor
    };
    
    events.push(newEvent);
    saveEvents();
    renderEvents();
    startCountdownTimers();
    
    // Reset form
    eventForm.reset();
    document.getElementById('colorBlue').checked = true;
});

// Edit event
eventsContainer.addEventListener('click', (e) => {
    if (e.target.closest('.edit-event-btn')) {
        const eventElement = e.target.closest('[data-id]');
        const eventId = parseInt(eventElement.dataset.id);
        const event = events[eventId];
        
        // Fill edit form
        document.getElementById('editEventId').value = eventId;
        document.getElementById('editEventName').value = event.name;
        document.getElementById('editEventDate').value = event.date.split('.')[0]; // Remove milliseconds if present
        
        // Set color radio button
        document.querySelector(`input[name="editEventColor"][value="${event.color}"]`).checked = true;
        
        // Show modal
        editModal.classList.remove('hidden');
    }
});

// Save edited event
editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const eventId = parseInt(document.getElementById('editEventId').value);
    const eventName = document.getElementById('editEventName').value;
    const eventDate = document.getElementById('editEventDate').value;
    const eventColor = document.querySelector('input[name="editEventColor"]:checked').value;
    
    events[eventId] = {
        name: eventName,
        date: eventDate,
        color: eventColor
    };
    
    saveEvents();
    renderEvents();
    startCountdownTimers();
    editModal.classList.add('hidden');
});

// Delete event
deleteEventBtn.addEventListener('click', () => {
    const eventId = parseInt(document.getElementById('editEventId').value);
    
    if (confirm('Are you sure you want to delete this event?')) {
        events.splice(eventId, 1);
        saveEvents();
        renderEvents();
        startCountdownTimers();
        editModal.classList.add('hidden');
    }
});

// Close edit modal
closeEditModal.addEventListener('click', () => {
    editModal.classList.add('hidden');
});

// Save events to localStorage
function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);