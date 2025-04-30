// Smooth Scroll for Navbar Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  
  // Project Filter
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
  
      const filter = button.getAttribute('data-filter');
      
      projects.forEach(project => {
        if (filter === 'all' || project.getAttribute('data-category') === filter) {
          project.style.display = 'block';
        } else {
          project.style.display = 'none';
        }
      });
    });
  });
  
  // Contact Form Validation
  document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
  
    if (name && email && message) {
      alert('Message sent successfully!'); // Replace with actual backend call
      this.reset();
    } else {
      alert('Please fill in all fields.');
    }
  });