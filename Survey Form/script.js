document.getElementById('surveyForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const errorMessage = document.getElementById('errorMessage');
    const confirmation = document.getElementById('confirmation');
    const confirmationMessage = document.getElementById('confirmationMessage');

    // Reset error and confirmation
    errorMessage.textContent = '';
    confirmation.classList.add('hidden');

    // Get form values
    const name = document.getElementById('name').value.trim();
    const satisfaction = document.querySelector('input[name="satisfaction"]:checked');
    const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(input => input.value);
    const feedback = document.getElementById('feedback').value.trim();

    // Validation
    if (!name) {
        errorMessage.textContent = 'Please enter your name.';
        return;
    }
    if (!satisfaction) {
        errorMessage.textContent = 'Please select a satisfaction level.';
        return;
    }

    // Prepare confirmation message
    let message = `<strong>Name:</strong> ${name}<br>`;
    message += `<strong>Satisfaction:</strong> ${satisfaction.value}<br>`;
    message += `<strong>Valued Features:</strong> ${interests.length > 0 ? interests.join(', ') : 'None selected'}<br>`;
    message += `<strong>Feedback:</strong> ${feedback || 'No feedback provided'}`;

    // Show confirmation
    confirmationMessage.innerHTML = message;
    confirmation.classList.remove('hidden');

    // Log to console (replace with backend API call)
    console.log({
        name,
        satisfaction: satisfaction.value,
        interests,
        feedback
    });

    // Reset form
    document.getElementById('surveyForm').reset();
});