// API Key (Note: In production, this should be secured on a backend)
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your OpenWeatherMap API key

// DOM Elements
const locationInput = document.getElementById('locationInput');
const searchBtn = document.getElementById('searchBtn');
const currentLocationBtn = document.getElementById('currentLocationBtn');
const currentWeather = document.getElementById('currentWeather');
const forecastContainer = document.getElementById('forecastContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');

// Weather icon mapping
const weatherIcons = {
    '01d': 'fas fa-sun',           // clear sky (day)
    '01n': 'fas fa-moon',          // clear sky (night)
    '02d': 'fas fa-cloud-sun',     // few clouds (day)
    '02n': 'fas fa-cloud-moon',    // few clouds (night)
    '03d': 'fas fa-cloud',         // scattered clouds
    '03n': 'fas fa-cloud',
    '04d': 'fas fa-cloud',         // broken clouds
    '04n': 'fas fa-cloud',
    '09d': 'fas fa-cloud-rain',    // shower rain
    '09n': 'fas fa-cloud-rain',
    '10d': 'fas fa-cloud-sun-rain',// rain (day)
    '10n': 'fas fa-cloud-moon-rain',// rain (night)
    '11d': 'fas fa-bolt',          // thunderstorm
    '11n': 'fas fa-bolt',
    '13d': 'fas fa-snowflake',     // snow
    '13n': 'fas fa-snowflake',
    '50d': 'fas fa-smog',          // mist
    '50n': 'fas fa-smog'
};

// Initialize the app
function init() {
    // Event listeners
    searchBtn.addEventListener('click', () => {
        const location = locationInput.value.trim();
        if (location) {
            fetchWeatherByLocation(location);
        }
    });

    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const location = locationInput.value.trim();
            if (location) {
                fetchWeatherByLocation(location);
            }
        }
    });

    currentLocationBtn.addEventListener('click', fetchWeatherByCurrentLocation);

    // Try to get weather for default location (or current location if permitted)
    fetchWeatherByLocation('London');
}

// Fetch weather by city name
async function fetchWeatherByLocation(location) {
    try {
        showLoading();
        
        // Fetch current weather
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
        );
        
        if (!currentResponse.ok) {
            throw new Error('Location not found');
        }
        
        const currentData = await currentResponse.json();
        
        // Fetch forecast
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${API_KEY}`
        );
        
        if (!forecastResponse.ok) {
            throw new Error('Forecast not available');
        }
        
        const forecastData = await forecastResponse.json();
        
        displayWeather(currentData, forecastData);
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError();
    }
}

// Fetch weather by current geolocation
async function fetchWeatherByCurrentLocation() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }
    
    try {
        showLoading();
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                
                // Fetch current weather
                const currentResponse = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
                );
                
                if (!currentResponse.ok) {
                    throw new Error('Location not found');
                }
                
                const currentData = await currentResponse.json();
                
                // Fetch forecast
                const forecastResponse = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
                );
                
                if (!forecastResponse.ok) {
                    throw new Error('Forecast not available');
                }
                
                const forecastData = await forecastResponse.json();
                
                displayWeather(currentData, forecastData);
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Unable to retrieve your location');
                hideLoading();
            }
        );
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError();
    }
}

// Display weather data
function displayWeather(currentData, forecastData) {
    hideLoading();
    
    // Display current weather
    displayCurrentWeather(currentData);
    
    // Display forecast
    displayForecast(forecastData);
    
    // Show containers
    currentWeather.classList.remove('hidden');
    forecastContainer.classList.remove('hidden');
}

// Display current weather
function displayCurrentWeather(data) {
    const date = new Date(data.dt * 1000);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    document.getElementById('currentLocation').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('currentDate').textContent = date.toLocaleDateString('en-US', options);
    document.getElementById('currentTemp').textContent = `${Math.round(data.main.temp)}°C`;
    
    const weather = data.weather[0];
    const iconClass = weatherIcons[weather.icon] || 'fas fa-cloud';
    
    document.getElementById('currentIcon').className = iconClass;
    document.getElementById('currentConditions').textContent = weather.description;
    
    document.getElementById('currentDetails').innerHTML = `
        <div>Feels like: ${Math.round(data.main.feels_like)}°C</div>
        <div>High: ${Math.round(data.main.temp_max)}°C / Low: ${Math.round(data.main.temp_min)}°C</div>
    `;
    
    document.getElementById('currentWind').textContent = `${data.wind.speed} m/s`;
    document.getElementById('currentHumidity').textContent = `${data.main.humidity}%`;
    document.getElementById('currentVisibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
}

// Display 7-day forecast
function displayForecast(data) {
    const forecastList = document.getElementById('forecastList');
    forecastList.innerHTML = '';
    
    // Group forecasts by day
    const dailyForecasts = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateString = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        
        if (!dailyForecasts[dateString]) {
            dailyForecasts[dateString] = [];
        }
        
        dailyForecasts[dateString].push(item);
    });
    
    // Get the next 7 days
    const next7Days = Object.keys(dailyForecasts).slice(0, 7);
    
    next7Days.forEach(day => {
        const dayForecasts = dailyForecasts[day];
        
        // Calculate min/max temp for the day
        const temps = dayForecasts.map(item => item.main.temp);
        const minTemp = Math.round(Math.min(...temps));
        const maxTemp = Math.round(Math.max(...temps));
        
        // Get most common weather condition for the day
        const weatherCounts = {};
        dayForecasts.forEach(item => {
            const condition = item.weather[0].main;
            weatherCounts[condition] = (weatherCounts[condition] || 0) + 1;
        });
        
        const mostCommonWeather = Object.keys(weatherCounts).reduce((a, b) => 
            weatherCounts[a] > weatherCounts[b] ? a : b
        );
        
        // Find corresponding icon
        const weatherItem = dayForecasts.find(item => 
            item.weather[0].main === mostCommonWeather
        );
        
        const iconClass = weatherIcons[weatherItem.weather[0].icon] || 'fas fa-cloud';
        
        // Create forecast card
        const forecastCard = document.createElement('div');
        forecastCard.className = 'bg-white rounded-lg shadow p-4 text-center';
        forecastCard.innerHTML = `
            <div class="font-semibold text-blue-800 mb-2">${day.split(',')[0]}</div>
            <div class="text-sm text-gray-600 mb-2">${day.split(',')[1]}</div>
            <div class="text-4xl my-3">
                <i class="${iconClass}"></i>
            </div>
            <div class="text-gray-700 mb-1">${mostCommonWeather}</div>
            <div class="flex justify-center space-x-2">
                <span class="font-bold">${maxTemp}°</span>
                <span class="text-gray-500">${minTemp}°</span>
            </div>
        `;
        
        forecastList.appendChild(forecastCard);
    });
}

// Show loading state
function showLoading() {
    currentWeather.classList.add('hidden');
    forecastContainer.classList.add('hidden');
    errorMessage.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');
}

// Hide loading state
function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

// Show error message
function showError() {
    currentWeather.classList.add('hidden');
    forecastContainer.classList.add('hidden');
    loadingSpinner.classList.add('hidden');
    errorMessage.classList.remove('hidden');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);