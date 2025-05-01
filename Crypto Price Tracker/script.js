// DOM Elements
const cryptoTable = document.getElementById('cryptoTable');
const searchInput = document.getElementById('searchInput');
const currencySelect = document.getElementById('currencySelect');
const chartModal = document.getElementById('chartModal');
const closeChartModal = document.getElementById('closeChartModal');
const chartModalTitle = document.getElementById('chartModalTitle');
const priceChartCanvas = document.getElementById('priceChart');
const chartPeriodButtons = document.querySelectorAll('.chart-period-btn');
const marketCapElement = document.getElementById('marketCap');
const marketVolumeElement = document.getElementById('marketVolume');
const btcDominanceElement = document.getElementById('btcDominance');

// Global variables
let cryptoData = [];
let currentCurrency = 'usd';
let priceChart = null;
let selectedCryptoId = '';
let selectedCryptoName = '';

// Initialize the app
async function init() {
    // Set up event listeners
    searchInput.addEventListener('input', filterCryptos);
    currencySelect.addEventListener('change', async (e) => {
        currentCurrency = e.target.value;
        await fetchCryptoData();
    });
    closeChartModal.addEventListener('click', () => {
        chartModal.classList.add('hidden');
    });
    
    // Set up chart period buttons
    chartPeriodButtons.forEach(button => {
        button.addEventListener('click', async () => {
            // Update active button
            chartPeriodButtons.forEach(btn => {
                btn.classList.remove('bg-amber-500', 'text-white');
                btn.classList.add('bg-gray-700', 'hover:bg-gray-600');
            });
            button.classList.add('bg-amber-500', 'text-white');
            button.classList.remove('bg-gray-700', 'hover:bg-gray-600');
            
            // Fetch and display new chart data
            const days = button.dataset.days;
            await displayPriceChart(selectedCryptoId, selectedCryptoName, days);
        });
    });
    
    // Fetch initial data
    await fetchCryptoData();
    await fetchGlobalData();
    
    // Refresh data every 60 seconds
    setInterval(async () => {
        await fetchCryptoData();
        await fetchGlobalData();
    }, 60000);
}

// Fetch global market data
async function fetchGlobalData() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/global');
        const data = await response.json();
        
        const marketCap = data.data.total_market_cap.usd;
        const marketVolume = data.data.total_volume.usd;
        const btcDominance = data.data.market_cap_percentage.btc;
        
        marketCapElement.textContent = formatCurrency(marketCap, 'usd');
        marketVolumeElement.textContent = formatCurrency(marketVolume, 'usd');
        btcDominanceElement.textContent = `${btcDominance.toFixed(1)}%`;
    } catch (error) {
        console.error('Error fetching global data:', error);
    }
}

// Fetch cryptocurrency data
async function fetchCryptoData() {
    try {
        // Show loading state
        cryptoTable.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                    <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                    <p>Loading cryptocurrency data...</p>
                </td>
            </tr>
        `;
        
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currentCurrency}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h`
        );
        cryptoData = await response.json();
        
        renderCryptoTable(cryptoData);
    } catch (error) {
        console.error('Error fetching crypto data:', error);
        cryptoTable.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                    <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
                    <p>Failed to load data. Please try again later.</p>
                </td>
            </tr>
        `;
    }
}

// Render cryptocurrency table
function renderCryptoTable(data) {
    if (data.length === 0) {
        cryptoTable.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                    <i class="fas fa-search text-2xl mb-2"></i>
                    <p>No cryptocurrencies found matching your search.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    cryptoTable.innerHTML = '';
    
    data.forEach((crypto, index) => {
        const priceChange24h = crypto.price_change_percentage_24h;
        const priceChangeClass = priceChange24h >= 0 ? 'text-green-500' : 'text-red-500';
        const priceChangeIcon = priceChange24h >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
        
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-700 cursor-pointer';
        row.dataset.id = crypto.id;
        row.addEventListener('click', () => {
            selectedCryptoId = crypto.id;
            selectedCryptoName = crypto.name;
            displayPriceChart(crypto.id, crypto.name);
        });
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-gray-400">${index + 1}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <img src="${crypto.image}" alt="${crypto.name}" class="w-8 h-8 mr-3 rounded-full">
                    <div>
                        <div class="font-medium">${crypto.name}</div>
                        <div class="text-gray-400 text-sm">${crypto.symbol.toUpperCase()}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right font-medium">
                ${formatCurrency(crypto.current_price, currentCurrency)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right ${priceChangeClass}">
                <i class="fas ${priceChangeIcon} mr-1"></i>${Math.abs(priceChange24h).toFixed(2)}%
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-gray-400">
                ${formatCurrency(crypto.market_cap, currentCurrency)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="h-10 w-32 ml-auto">
                    <canvas class="sparkline" data-sparkline="${crypto.sparkline_in_7d.price.join(',')}"></canvas>
                </div>
            </td>
        `;
        
        cryptoTable.appendChild(row);
    });
    
    // Render sparkline charts
    renderSparklines();
}

// Render small sparkline charts
function renderSparklines() {
    const sparklineElements = document.querySelectorAll('.sparkline');
    
    sparklineElements.forEach(element => {
        const prices = element.dataset.sparkline.split(',').map(Number);
        const ctx = element.getContext('2d');
        
        // Determine line color based on price trend
        const firstPrice = prices[0];
        const lastPrice = prices[prices.length - 1];
        const lineColor = lastPrice >= firstPrice ? 'rgba(22, 163, 74, 1)' : 'rgba(220, 38, 38, 1)';
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array(prices.length).fill(''),
                datasets: [{
                    data: prices,
                    borderColor: lineColor,
                    borderWidth: 1,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false,
                        min: Math.min(...prices),
                        max: Math.max(...prices)
                    }
                }
            }
        });
    });
}

// Display price chart in modal
async function displayPriceChart(cryptoId, cryptoName, days = '1') {
    try {
        // Show loading state
        chartModalTitle.textContent = `${cryptoName} (Loading...)`;
        document.getElementById('currentPrice').textContent = '-';
        document.getElementById('high24h').textContent = '-';
        document.getElementById('low24h').textContent = '-';
        document.getElementById('ath').textContent = '-';
        
        // Show modal
        chartModal.classList.remove('hidden');
        
        // Fetch chart data
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=${currentCurrency}&days=${days}`
        );
        const chartData = await response.json();
        
        // Fetch additional coin data
        const coinResponse = await fetch(
            `https://api.coingecko.com/api/v3/coins/${cryptoId}`
        );
        const coinData = await coinResponse.json();
        
        // Update modal title and info
        chartModalTitle.textContent = `${cryptoName} (${coinData.symbol.toUpperCase()})`;
        document.getElementById('currentPrice').textContent = formatCurrency(coinData.market_data.current_price[currentCurrency], currentCurrency);
        document.getElementById('high24h').textContent = formatCurrency(coinData.market_data.high_24h[currentCurrency], currentCurrency);
        document.getElementById('low24h').textContent = formatCurrency(coinData.market_data.low_24h[currentCurrency], currentCurrency);
        document.getElementById('ath').textContent = formatCurrency(coinData.market_data.ath[currentCurrency], currentCurrency);
        
        // Prepare chart data
        const prices = chartData.prices.map(price => price[1]);
        const timestamps = chartData.prices.map(price => new Date(price[0]));
        
        // Format labels based on time period
        let labelFormat;
        if (days === '1') {
            labelFormat = {
                hour: 'numeric'
            };
        } else if (days === '7' || days === '14') {
            labelFormat = {
                weekday: 'short'
            };
        } else {
            labelFormat = {
                month: 'short',
                day: 'numeric'
            };
        }
        
        const labels = timestamps.map(date => 
            date.toLocaleDateString('en-US', labelFormat)
        );
        
        // Destroy previous chart if exists
        if (priceChart) {
            priceChart.destroy();
        }
        
        // Create new chart
        priceChart = new Chart(priceChartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Price',
                    data: prices,
                    borderColor: 'rgba(245, 158, 11, 1)',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `${cryptoName}: ${formatCurrency(context.parsed.y, currentCurrency)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: 'rgba(156, 163, 175, 1)'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(55, 65, 81, 1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: 'rgba(156, 163, 175, 1)',
                            callback: function(value) {
                                return formatCurrency(value, currentCurrency, true);
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
        
        // Set first chart period button as active
        chartPeriodButtons.forEach((button, index) => {
            if (index === 0) {
                button.classList.add('bg-amber-500', 'text-white');
                button.classList.remove('bg-gray-700', 'hover:bg-gray-600');
            } else {
                button.classList.remove('bg-amber-500', 'text-white');
                button.classList.add('bg-gray-700', 'hover:bg-gray-600');
            }
        });
    } catch (error) {
        console.error('Error fetching chart data:', error);
        chartModalTitle.textContent = `${cryptoName} (Error)`;
    }
}

// Filter cryptocurrencies based on search input
function filterCryptos() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredData = cryptoData.filter(crypto => 
        crypto.name.toLowerCase().includes(searchTerm) || 
        crypto.symbol.toLowerCase().includes(searchTerm)
    );
    renderCryptoTable(filteredData);
}

// Format currency
function formatCurrency(value, currency, compact = false) {
    if (value === undefined || value === null) return '-';
    
    if (compact && value >= 1000000) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            notation: 'compact',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }
    
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: value < 1 ? 6 : 2
    }).format(value);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);