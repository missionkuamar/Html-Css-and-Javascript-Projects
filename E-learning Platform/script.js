// Mock course data (replace with API in production)
const courses = [
    { id: 1, title: "JavaScript Mastery", category: "Programming", description: "Learn advanced JavaScript concepts.", lessons: 20, image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485" },
    { id: 2, title: "UI/UX Design", category: "Design", description: "Master user interface design principles.", lessons: 15, image: "https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a" },
    { id: 3, title: "Business Strategy", category: "Business", description: "Develop effective business strategies.", lessons: 10, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf" },
    { id: 4, title: "Python for Beginners", category: "Programming", description: "Get started with Python programming.", lessons: 18, image: "https://images.unsplash.com/photo-1516321310768-61f59f12c54e" },
];

// User progress stored in localStorage
let userProgress = JSON.parse(localStorage.getItem('userProgress')) || {};

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Render courses
function renderCourses() {
    const courseListings = document.getElementById('courseListings');
    courseListings.innerHTML = '';

    const search = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(search) || course.description.toLowerCase().includes(search);
        const matchesCategory = !category || course.category === category;
        return matchesSearch && matchesCategory;
    });

    filteredCourses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'bg-white p-6 rounded-lg shadow card-hover cursor-pointer';
        card.innerHTML = `
            <img src="${course.image}" alt="${course.title}" class="w-full h-40 object-cover rounded-lg mb-4">
            <h2 class="text-xl font-semibold text-gray-800">${course.title}</h2>
            <p class="text-gray-600">${course.category}</p>
            <p class="text-gray-500">${course.lessons} Lessons</p>
            <div class="mt-4 h-2 bg-gray-200 rounded-full">
                <div class="h-2 bg-blue-500 rounded-full" style="width: ${userProgress[course.id]?.progress || 0}%"></div>
            </div>
        `;
        card.addEventListener('click', () => showCourseModal(course));
        courseListings.appendChild(card);
    });
}

// Render user progress in dashboard
function renderProgress() {
    const progressListings = document.getElementById('progressListings');
    progressListings.innerHTML = '';

    const enrolledCourses = courses.filter(course => userProgress[course.id]);

    if (enrolledCourses.length === 0) {
        progressListings.innerHTML = '<p class="text-gray-600">No courses enrolled yet.</p>';
        return;
    }

    enrolledCourses.forEach(course => {
        const progress = userProgress[course.id].progress || 0;
        const card = document.createElement('div');
        card.className = 'bg-white p-6 rounded-lg shadow card-hover';
        card.innerHTML = `
            <h2 class="text-xl font-semibold text-gray-800">${course.title}</h2>
            <p class="text-gray-600">${course.category}</p>
            <p class="text-gray-500">Progress: ${progress}%</p>
            <div class="mt-4 h-2 bg-gray-200 rounded-full">
                <div class="h-2 bg-blue-500 rounded-full" style="width: ${progress}%"></div>
            </div>
            <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onclick="updateProgress(${course.id})">Complete Lesson</button>
        `;
        progressListings.appendChild(card);
    });
}

// Show course details in modal
function showCourseModal(course) {
    const modal = document.getElementById('courseModal');
    const modalContent = modal.querySelector('.modal');
    document.getElementById('modalTitle').textContent = course.title;
    document.getElementById('modalCategory').textContent = `Category: ${course.category}`;
    document.getElementById('modalDescription').textContent = course.description;
    document.getElementById('modalLessons').textContent = `Lessons: ${course.lessons}`;
    
    const enrollButton = document.getElementById('enrollButton');
    enrollButton.textContent = userProgress[course.id] ? 'Continue' : 'Enroll';
    enrollButton.onclick = () => enrollCourse(course.id);

    modal.classList.remove('hidden');
    setTimeout(() => modalContent.classList.replace('modal-closed', 'modal-open'), 10);
}

// Enroll in a course
function enrollCourse(courseId) {
    if (!userProgress[courseId]) {
        userProgress[courseId] = { progress: 0 };
        localStorage.setItem('userProgress', JSON.stringify(userProgress));
        renderCourses();
        renderProgress();
    }
    document.getElementById('courseModal').classList.add('hidden');
}

// Update progress (simulate lesson completion)
function updateProgress(courseId) {
    if (userProgress[courseId]) {
        userProgress[courseId].progress = Math.min(userProgress[courseId].progress + (100 / courses.find(c => c.id === courseId).lessons), 100);
        localStorage.setItem('userProgress', JSON.stringify(userProgress));
        renderProgress();
        renderCourses();
    }
}

// Toggle between home and dashboard
function showHome() {
    document.getElementById('homeSection').classList.remove('hidden');
    document.getElementById('dashboardSection').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('homeSection').classList.add('hidden');
    document.getElementById('dashboardSection').classList.remove('hidden');
    renderProgress();
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', debounce(renderCourses, 300));
document.getElementById('categoryFilter').addEventListener('change', renderCourses);
document.getElementById('homeLink').addEventListener('click', showHome);
document.getElementById('dashboardLink').addEventListener('click', showDashboard);
document.getElementById('closeModal').addEventListener('click', () => {
    const modal = document.getElementById('courseModal');
    const modalContent = modal.querySelector('.modal');
    modalContent.classList.replace('modal-open', 'modal-closed');
    setTimeout(() => modal.classList.add('hidden'), 300);
});

// Initial render
renderCourses();