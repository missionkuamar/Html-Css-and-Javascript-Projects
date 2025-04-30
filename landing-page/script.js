// Smooth Scroll for Navbar Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  
  // Testimonial Slider Auto-Scroll
  const slider = document.querySelector('.testimonial-slider');
  let isDown = false;
  let startX;
  let scrollLeft;
  
  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  
  slider.addEventListener('mouseleave', () => {
    isDown = false;
  });
  
  slider.addEventListener('mouseup', () => {
    isDown = false;
  });
  
  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });
  
  // Auto-scroll for testimonials
  setInterval(() => {
    slider.scrollLeft += 300;
    if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth) {
      slider.scrollLeft = 0;
    }
  }, 3000);