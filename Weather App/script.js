const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    const weatherDiv = document.getElementById('weather');

    if (!city) {
        weatherDiv.innerHTML = `<p class="text-red-500">Please enter a city name.</p>`;
        return;
    }

    try {
        const response = await fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();

        const temp = data.main.temp;
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;
        const cityName = data.name;

        weatherDiv.innerHTML = `
            <h2 class="text-xl font-semibold text-gray-800">${cityName}</h2>
            <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather icon" class="mx-auto">
            <p class="text-lg text-gray-600">Temperature: ${temp}°C</p>
            <p class="text-lg text-gray-600 capitalize">Description: ${description}</p>
        `;
    } catch (error) {
        weatherDiv.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
    }
}