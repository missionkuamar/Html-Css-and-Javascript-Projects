// Alpha Vantage API Configuration (Replace with your API key)
const API_KEY = 'YOUR_ALPHA_VANTAGE_API_KEY'; // Get from alphavantage.co
const BASE_URL = 'https://www.alphavantage.co/query';
const ITEMS_PER_PAGE = 9;

// Watchlist stored in localStorage
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
let currentStock = null;
let chartInstance = null;

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Fetch stock quote
async function fetchStockQuote(symbol) {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    loading.classList.remove('hidden');
    error.classList.add('hidden');

    try {
        const response = await fetch(`${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
        const data = await response.json();
        if (data['Global Quote']) {
            return data['Global Quote'];
        } else {
            throw new Error('Stock not found or API limit reached');
        }
    } catch (err) {
        error.textContent = 'Error fetching stock data: ' + err.message;
        error.classList.remove('hidden');
        return null;
    } finally {
        loading.classList.add('hidden');
    }
}

// Fetch stock time series for chart
async function fetchStockTimeSeries(symbol, range) {
    let interval;
    switch (range) {
        case '1D': interval = 'INTRADAY&interval=5min'; break;
        case '1W': interval = 'DAILY'; break;
        case '1M': interval = 'DAILY'; break;
        case '1Y': interval = 'WEEKLY'; break;
        default: interval = 'DAILY';
    }

    try {
        const response = await fetch(`${BASE_URL}?function=TIME_SERIES_${interval}&symbol=${symbol}&apikey=${API_KEY}`);
        const data = await response.json();
        if (data['Time Series (5min)'] || data['Time Series (Daily)'] || data['Weekly Time Series']) {
            return data;
        } else {
            throw new Error('Time series data not available');
        }
    } catch (err) {
        document.getElementById('error').textContent = 'Error fetching chart data: ' + err.message;
        document.getElementById('error').classList.remove('hidden');
        return null;
    }
}

// Render stock overview
async function renderStockOverview(symbol) {
    const stockOverview = document.getElementById('stockOverview');
    const quote = await fetchStockQuote(symbol);
    if (!quote) return;

    const change = parseFloat(quote['10. change percent'].replace('%', ''));
    stockOverview.innerHTML = `
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">${symbol}</h2>
        <p class="text-2xl font-bold text-gray-800 dark:text-white">$${parseFloat(quote['05. price']).toFixed(2)}</p>
        <p class="${change >= 0 ? 'text-green-500' : 'text-red-500'}">${change.toFixed(2)}%</p>
        <p class="text-gray-600 dark:text-gray-300">Volume: ${quote['06. volume']}</p>
        <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onclick="showStockModal('${symbol}')">View Details</button>
    `;
}

// Render chart
async function renderChart(symbol, range = '1D') {
    const timeSeries = await fetchStockTimeSeries(symbol, range);
    if (!timeSeries) return;

    const ctx = document.getElementById('stockChart').getContext('2d');
    let labels, prices;

    if (range === '1D') {
        const series = timeSeries['Time Series (5min)'];
        labels = Object.keys(series).slice(0, 50).reverse();
        prices = Object.values(series).slice(0, 50).map(item => parseFloat(item['4. close'])).reverse();
    } else if (range === '1Y') {
        const series = timeSeries['Weekly Time Series'];
        labels = Object.keys(series).slice(0, 52).reverse();
        prices = Object.values(series).slice(0, 52).map(item => parseFloat(item['4. close'])).reverse();
    } else {
        const series = timeSeries['Time Series (Daily)'];
        labels = Object.keys(series).slice(0, range === '1W' ? 5 : 20).reverse();
        prices = Object.values(series).slice(0, range === '1W' ? 5 : 20).map(item => parseFloat(item['4. close'])).reverse();
    }

    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: `${symbol} Price`,
                data: prices,
                borderColor: '#3b82f6',
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { display: true, title: { display: true, text: 'Time' } },
                y: { display: true, title: { display: true, text: 'Price (USD)' } }
            }
        }
    });
}

// Render watchlist
async function renderWatchlist() {
    const watchlistDiv = document.getElementById('watchlist');
    watchlistDiv.innerHTML = '';

    for (const symbol of watchlist) {
        const quote = await fetchStockQuote(symbol);
        if (!quote) continue;

        const change = parseFloat(quote['10. change percent'].replace('%', ''));
        const card = document.createElement('div');
        card.className = 'bg-white p-6 rounded-lg shadow card-hover dark:bg-gray-700';
        card.innerHTML = `
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white">${symbol}</h2>
            <p class="text-2xl font-bold text-gray-800 dark:text-white">$${parseFloat(quote['05. price']).toFixed(2)}</p>
            <p class="${change >= 0 ? 'text-green-500' : 'text-red-500'}">${change.toFixed(2)}%</p>
            <button class="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600" onclick="removeFromWatchlist('${symbol}')">Remove</button>
        `;
        watchlistDiv.appendChild(card);
    }
}

// Show stock details in modal
async function showStockModal(symbol) {
    const modal = document.getElementById('stockModal');
    const modalContent = modal.querySelector('.modal');
    const quote = await fetchStockQuote(symbol);
    if (!quote) return;

    document.getElementById('modalTitle').textContent = symbol;
    document.getElementById('modalPrice').textContent = `Price: $${parseFloat(quote['05. price']).toFixed(2)}`;
    document.getElementById('modalChange').textContent = `Change: ${quote['10. change percent']}`;
    document.getElementById('modalVolume').textContent = `Volume: ${quote['06. volume']}`;
    document.getElementById('modalMarketCap').textContent = `Market Cap: N/A`; // Alpha Vantage free tier doesn't provide market cap

    const addButton = document.getElementById('addToWatchlist');
    addButton.textContent = watchlist.includes(symbol) ? 'Already in Watchlist' : 'Add to Watchlist';
    addButton.disabled = watchlist.includes(symbol);
    addButton.onclick = () => addToWatchlist(symbol);

    modal.classList.remove('hidden');
    setTimeout(() => modalContent.classList.replace('modal-closed', 'modal-open'), 10);
}

// Add to watchlist
function addToWatchlist(symbol) {
    if (!watchlist.includes(symbol)) {
        watchlist.push(symbol);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        renderWatchlist();
        showStockModal(symbol);
    }
}

// Remove from watchlist
function removeFromWatchlist(symbol) {
    watchlist = watchlist.filter(s => s !== symbol);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    renderWatchlist();
}

// Toggle between dashboard and watchlist
function showDashboard() {
    document.getElementById('dashboardSection').classList.remove('hidden');
    document.getElementById('watchlistSection').classList.add('hidden');
}

function showWatchlist() {
    document.getElementById('dashboardSection').classList.add('hidden');
    document.getElementById('watchlistSection').classList.remove('hidden');
    renderWatchlist();
}

// Toggle dark mode
function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
}

// Event listeners
document.getElementById('searchButton').addEventListener('click', async () => {
    const symbol = document.getElementById('searchInput').value.trim().toUpperCase();
    if (symbol) {
        currentStock = symbol;
        await renderStockOverview(symbol);
        await renderChart(symbol);
    }
});

document.getElementById('searchInput').addEventListener('input', debounce(() => {
    const symbol = document.getElementById('searchInput').value.trim().toUpperCase();
    if (symbol) {
        currentStock = symbol;
        renderStockOverview(symbol);
        renderChart(symbol);
    }
}, 500));

document.querySelectorAll('.time-range').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.time-range').forEach(btn => {
            btn.classList.remove('bg-blue-500', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700', 'dark:bg-gray-600', 'dark:text-white');
        });
        button.classList.remove('bg-gray-200', 'text-gray-700', 'dark:bg-gray-600', 'dark:text-white');
        button.classList.add('bg-blue-500', 'text-white');
        if (currentStock) renderChart(currentStock, button.dataset.range);
    });
});

document.getElementById('dashboardLink').addEventListener('click', showDashboard);
document.getElementById('watchlistLink').addEventListener('click', showWatchlist);
document.getElementById('themeToggle').addEventListener('click', toggleDarkMode);
document.getElementById('closeModal').addEventListener('click', () => {
    const modal = document.getElementById('stockModal');
    const modalContent = modal.querySelector('.modal');
    modalContent.classList.replace('modal-open', 'modal-closed');
    setTimeout(() => modal.classList.add('hidden'), 300);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
    }
    currentStock = 'AAPL';
    renderStockOverview(currentStock);
    renderChart(currentStock);
    renderWatchlist();
});