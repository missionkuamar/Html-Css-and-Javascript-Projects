// API Configuration (Replace with your RapidAPI key)
const API_URL = 'https://jsearch.p.rapidapi.com/search';
const API_KEY = 'YOUR_RAPIDAPI_KEY'; // Replace with your RapidAPI key
const ITEMS_PER_PAGE = 9;

let currentPage = 1;
let jobs = [];
let filteredJobs = [];

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Fetch jobs from API
async function fetchJobs(query = '', page = 1) {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    loading.classList.remove('hidden');
    error.classList.add('hidden');

    try {
        const response = await fetch(`${API_URL}?query=${encodeURIComponent(query)}&page=${page}&num_pages=1`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
        });

        if (!response.ok) throw new Error('Failed to fetch jobs');

        const data = await response.json();
        jobs = data.data || [];
        filteredJobs = jobs;
        renderJobs();
        renderPagination(data.parameters.num_pages || 1);
    } catch (err) {
        error.textContent = 'Error fetching jobs: ' + err.message;
        error.classList.remove('hidden');
    } finally {
        loading.classList.add('hidden');
    }
}

// Render job listings
function renderJobs() {
    const jobListings = document.getElementById('jobListings');
    jobListings.innerHTML = '';

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginatedJobs = filteredJobs.slice(start, end);

    paginatedJobs.forEach(job => {
        const card = document.createElement('div');
        card.className = 'bg-white p-6 rounded-lg shadow card-hover cursor-pointer';
        card.innerHTML = `
            <h2 class="text-xl font-semibold text-gray-800">${job.job_title || 'N/A'}</h2>
            <p class="text-gray-600">${job.employer_name || 'Unknown Company'}</p>
            <p class="text-gray-500">${job.job_city ? job.job_city + ', ' : ''}${job.job_country || 'N/A'}</p>
            <p class="text-gray-500">${job.job_employment_type || 'N/A'}</p>
            <p class="text-gray-500">${job.job_salary ? '$' + job.job_salary : 'Salary not disclosed'}</p>
        `;
        card.addEventListener('click', () => showJobModal(job));
        jobListings.appendChild(card);
    });
}

// Render pagination
function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= Math.min(totalPages, 10); i++) {
        const button = document.createElement('button');
        button.className = `px-4 py-2 rounded-lg ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`;
        button.textContent = i;
        button.addEventListener('click', () => {
            currentPage = i;
            fetchJobs(document.getElementById('searchInput').value);
        });
        pagination.appendChild(button);
    }
}

// Show job details in modal
function showJobModal(job) {
    const modal = document.getElementById('jobModal');
    document.getElementById('modalTitle').textContent = job.job_title || 'N/A';
    document.getElementById('modalCompany').textContent = `Company: ${job.employer_name || 'Unknown'}`;
    document.getElementById('modalLocation').textContent = `Location: ${job.job_city ? job.job_city + ', ' : ''}${job.job_country || 'N/A'}`;
    document.getElementById('modalType').textContent = `Type: ${job.job_employment_type || 'N/A'}`;
    document.getElementById('modalDescription').textContent = job.job_description || 'No description available';
    document.getElementById('modalApply').href = job.job_apply_link || '#';
    modal.classList.remove('hidden');
}

// Close modal
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('jobModal').classList.add('hidden');
});

// Filter jobs
function filterJobs() {
    const location = document.getElementById('locationInput').value.toLowerCase();
    const jobType = document.getElementById('jobType').value;
    const minSalary = parseInt(document.getElementById('salaryInput').value) || 0;

    filteredJobs = jobs.filter(job => {
        const matchesLocation = !location || (job.job_city && job.job_city.toLowerCase().includes(location)) || (job.job_country && job.job_country.toLowerCase().includes(location));
        const matchesType = !jobType || job.job_employment_type === jobType;
        const matchesSalary = !job.job_salary || job.job_salary >= minSalary;
        return matchesLocation && matchesType && matchesSalary;
    });

    currentPage = 1;
    renderJobs();
    renderPagination(Math.ceil(filteredJobs.length / ITEMS_PER_PAGE));
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', debounce(() => {
    currentPage = 1;
    fetchJobs(document.getElementById('searchInput').value);
}, 500));

document.getElementById('locationInput').addEventListener('input', filterJobs);
document.getElementById('jobType').addEventListener('change', filterJobs);
document.getElementById('salaryInput').addEventListener('input', filterJobs);

// Initial fetch
fetchJobs();