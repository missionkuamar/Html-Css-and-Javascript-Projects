document.addEventListener('DOMContentLoaded', function() {
    // Engagement Chart
    const engagementOptions = {
        series: [{
            name: 'Facebook',
            data: [4.2, 4.5, 4.0, 4.8, 5.1, 4.6, 4.9]
        }, {
            name: 'Instagram',
            data: [3.8, 4.0, 4.2, 4.5, 4.7, 4.9, 5.2]
        }, {
            name: 'Twitter',
            data: [2.9, 3.1, 3.3, 3.5, 3.7, 3.9, 4.1]
        }],
        chart: {
            height: '100%',
            type: 'line',
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        colors: ['#3B82F6', '#EC4899', '#1DA1F2'],
        xaxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + "%"
                }
            }
        },
        legend: {
            position: 'top'
        }
    };

    const engagementChart = new ApexCharts(document.querySelector("#engagementChart"), engagementOptions);
    engagementChart.render();

    // Demographics Chart
    const demographicsOptions = {
        series: [{
            name: 'Followers',
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        }],
        chart: {
            type: 'bar',
            height: '100%',
            toolbar: {
                show: false
            }
        },
        colors: ['#3B82F6'],
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: ['13-17', '18-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55+'],
        }
    };

    const demographicsChart = new ApexCharts(document.querySelector("#demographicsChart"), demographicsOptions);
    demographicsChart.render();

    // Simulate API data fetching
    async function fetchSocialMediaData() {
        // In a real app, you would fetch from your API here
        // This is a mock implementation
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    facebook: {
                        followers: 24531,
                        change: 12.5,
                        isPositive: true
                    },
                    twitter: {
                        followers: 15219,
                        change: 8.3,
                        isPositive: true
                    },
                    instagram: {
                        followers: 32847,
                        change: -3.2,
                        isPositive: false
                    },
                    linkedin: {
                        followers: 8742,
                        change: 5.7,
                        isPositive: true
                    }
                });
            }, 1000);
        });
    }

    // Update stats cards with API data
    fetchSocialMediaData().then(data => {
        updateCard('facebook', data.facebook);
        updateCard('twitter', data.twitter);
        updateCard('instagram', data.instagram);
        updateCard('linkedin', data.linkedin);
    });

    function updateCard(platform, data) {
        const card = document.querySelector(`.border-${getPlatformColor(platform)}`);
        if (card) {
            const countElement = card.querySelector('p.text-2xl');
            const changeElement = card.querySelector('p.text-sm');
            
            if (countElement) {
                countElement.textContent = formatNumber(data.followers);
            }
            
            if (changeElement) {
                changeElement.textContent = `${data.isPositive ? '+' : ''}${data.change}%`;
                changeElement.className = `text-sm ${data.isPositive ? 'text-green-500' : 'text-red-500'} flex items-center`;
                const icon = document.createElement('i');
                icon.className = `fas fa-arrow-${data.isPositive ? 'up' : 'down'} mr-1`;
                changeElement.prepend(icon);
            }
        }
    }

    function getPlatformColor(platform) {
        const colors = {
            facebook: 'blue-600',
            twitter: 'blue-400',
            instagram: 'pink-500',
            linkedin: 'blue-700'
        };
        return colors[platform] || 'gray-500';
    }

    function formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    }

    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('button.md\\:hidden');
    const sidebar = document.querySelector('.hidden.md\\:flex');
    
    if (mobileMenuButton && sidebar) {
        mobileMenuButton.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
        });
    }
});