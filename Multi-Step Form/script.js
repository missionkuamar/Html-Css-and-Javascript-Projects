{/* <script>
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('multiStepForm');
        const steps = document.querySelectorAll('.step');
        const stepIndicators = document.querySelectorAll('.step-indicator');
        const progressBar = document.querySelector('.progress-bar');
        const nextButtons = document.querySelectorAll('.next-step');
        const prevButtons = document.querySelectorAll('.prev-step');
        const successMessage = document.getElementById('successMessage');
        const resetButton = document.getElementById('resetForm');
        
        let currentStep = 1;
        const totalSteps = steps.length;

        // Initialize the form
        updateStepVisibility();
        updateProgressBar();

        // Next button click handler
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (validateStep(currentStep)) {
                    currentStep++;
                    updateStepVisibility();
                    updateProgressBar();
                    updateStepIndicators();
                    
                    // If we're on the review step, populate the review content
                    if (currentStep === 4) {
                        populateReviewContent();
                    }
                }
            });
        });

        // Previous button click handler
        prevButtons.forEach(button => {
            button.addEventListener('click', function() {
                currentStep--;
                updateStepVisibility();
                updateProgressBar();
                updateStepIndicators();
            });
        });

        // Form submission handler
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate the final step
            if (!validateStep(currentStep)) {
                return;
            }
            
            // Here you would typically send the form data to a server
            // For demo purposes, we'll just show the success message
            form.querySelectorAll('.step').forEach(step => {
                step.classList.add('hidden');
            });
            successMessage.classList.remove('hidden');
            
            // You could also collect all form data and log it or send it to a server
            const formData = new FormData(form);
            const formValues = Object.fromEntries(formData.entries());
            console.log('Form submitted with values:', formValues);
        });

        // Reset form handler
        resetButton.addEventListener('click', function() {
            // Reset form fields
            form.reset();
            
            // Reset to step 1
            currentStep = 1;
            updateStepVisibility();
            updateProgressBar();
            updateStepIndicators();
            
            // Hide success message
            successMessage.classList.add('hidden');
        });

        // Update which step is visible
        function updateStepVisibility() {
            steps.forEach(step => {
                const stepNumber = parseInt(step.dataset.step);
                if (stepNumber === currentStep) {
                    step.classList.remove('hidden');
                    step.classList.add('active');
                } else {
                    step.classList.add('hidden');
                    step.classList.remove('active');
                }
            });
        }

        // Update progress bar width
        function updateProgressBar() {
            const progressPercentage = (currentStep / totalSteps) * 100;
            progressBar.style.width = `${progressPercentage}%`;
        }

        // Update step indicator styling
        function updateStepIndicators() {
            stepIndicators.forEach(indicator => {
                const indicatorStep = parseInt(indicator.dataset.step);
                if (indicatorStep < currentStep) {
                    indicator.classList.add('text-blue-600', 'font-bold');
                    indicator.classList.remove('text-gray-500');
                } else if (indicatorStep === currentStep) {
                    indicator.classList.add('text-blue-600', 'font-bold');
                    indicator.classList.remove('text-gray-500');
                } else {
                    indicator.classList.add('text-gray-500');
                    indicator.classList.remove('text-blue-600', 'font-bold');
                }
            });
        }

        // Validate current step before proceeding
        function validateStep(stepNumber) {
            let isValid = true;
            
            if (stepNumber === 1) {
                const firstName = document.getElementById('firstName');
                const lastName = document.getElementById('lastName');
                const email = document.getElementById('email');
                
                if (!firstName.value.trim()) {
                    showError(firstName, 'First name is required');
                    isValid = false;
                }
                
                if (!lastName.value.trim()) {
                    showError(lastName, 'Last name is required');
                    isValid = false;
                }
                
                if (!email.value.trim()) {
                    showError(email, 'Email is required');
                    isValid = false;
                } else if (!isValidEmail(email.value)) {
                    showError(email, 'Please enter a valid email');
                    isValid = false;
                }
            } else if (stepNumber === 2) {
                const username = document.getElementById('username');
                const password = document.getElementById('password');
                const confirmPassword = document.getElementById('confirmPassword');
                
                if (!username.value.trim()) {
                    showError(username, 'Username is required');
                    isValid = false;
                } else if (username.value.trim().length < 4) {
                    showError(username, 'Username must be at least 4 characters');
                    isValid = false;
                }
                
                if (!password.value) {
                    showError(password, 'Password is required');
                    isValid = false;
                } else if (password.value.length < 6) {
                    showError(password, 'Password must be at least 6 characters');
                    isValid = false;
                }
                
                if (password.value !== confirmPassword.value) {
                    showError(confirmPassword, 'Passwords do not match');
                    isValid = false;
                }
            } else if (stepNumber === 3) {
                const interests = document.querySelectorAll('input[name="interests"]:checked');
                if (interests.length === 0) {
                    alert('Please select at least one interest');
                    isValid = false;
                }
            } else if (stepNumber === 4) {
                const agreeTerms = document.getElementById('agreeTerms');
                if (!agreeTerms.checked) {
                    alert('You must agree to the terms and conditions');
                    isValid = false;
                }
            }
            
            return isValid;
        }

        // Show error message for a form field
        function showError(input, message) {
            const formGroup = input.closest('.mb-4');
            let errorElement = formGroup.querySelector('.error-message');
            
            if (!errorElement) {
                errorElement = document.createElement('p');
                errorElement.className = 'error-message text-red-500 text-xs mt-1';
                formGroup.appendChild(errorElement);
            }
            
            errorElement.textContent = message;
            input.classList.add('border-red-500');
            input.focus();
        }

        // Simple email validation
        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        // Populate the review content in the final step
        function populateReviewContent() {
            const reviewContent = document.getElementById('reviewContent');
            const formData = new FormData(form);
            const formValues = Object.fromEntries(formData.entries());
            
            let html = `
                <div class="mb-2"><strong>Name:</strong> ${formValues.firstName} ${formValues.lastName}</div>
                <div class="mb-2"><strong>Email:</strong> ${formValues.email}</div>
                <div class="mb-2"><strong>Username:</strong> ${formValues.username}</div>
                <div class="mb-2"><strong>Newsletter:</strong> ${formValues.newsletter ? 'Subscribed' : 'Not subscribed'}</div>
                <div class="mb-2"><strong>Preferred Communication:</strong> ${formValues.communication}</div>
            `;
            
            // Add interests
            if (formValues.interests) {
                // Handle single selection or multiple selections
                const interests = Array.isArray(formValues.interests) ? 
                    formValues.interests.join(', ') : 
                    formValues.interests;
                html += `<div class="mb-2"><strong>Interests:</strong> ${interests}</div>`;
            }
            
            reviewContent.innerHTML = html;
        }
    });
</script> */}