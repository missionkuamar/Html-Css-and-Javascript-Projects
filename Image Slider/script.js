let currentIndex = 0;
const slides = document.querySelectorAll('#slider img');
const totalSlides = slides.length;
const slider = document.getElementById('slider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Show slide based on index
function showSlide(index) {
    if (index >= totalSlides) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = totalSlides - 1;
    } else {
        currentIndex = index;
    }
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Event listeners for buttons
prevBtn.addEventListener('click', () => {
    showSlide(currentIndex - 1);
});

nextBtn.addEventListener('click', () => {
    showSlide(currentIndex + 1);
});

// Auto-slide every 5 seconds
setInterval(() => {
    showSlide(currentIndex + 1);
}, 5000);

// Initialize slider
showSlide(currentIndex);