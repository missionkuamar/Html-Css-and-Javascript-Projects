let isLoginMode = true;

function toggleForm() {
    isLoginMode = !isLoginMode;
    const formTitle = document.getElementById('formTitle');
    const nameField = document.getElementById('nameField');
    const confirmPasswordField = document.getElementById('confirmPasswordField');
    const submitButton = document.getElementById('submitButton');
    const toggleText = document.getElementById('toggleText');
    const toggleLink = document.getElementById('toggleLink');
    const errorMessage = document.getElementById('errorMessage');

    errorMessage.textContent = '';
    document.getElementById('authForm').reset();

    if (isLoginMode) {
        formTitle.textContent = 'Login';
        nameField.classList.add('hidden');
        confirmPasswordField.classList.add('hidden');
        submitButton.textContent = 'Login';
        toggleText.textContent = "Don't have an account?";
        toggleLink.textContent = 'Sign Up';
    } else {
        formTitle.textContent = 'Sign Up';
        nameField.classList.remove('hidden');
        confirmPasswordField.classList.remove('hidden');
        submitButton.textContent = 'Sign Up';
        toggleText.textContent = 'Already have an account?';
        toggleLink.textContent = 'Login';
    }
}

document.getElementById('authForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    errorMessage.textContent = '';

    if (isLoginMode) {
        // Basic login validation
        if (!email || !password) {
            errorMessage.textContent = 'Please fill in all fields.';
            return;
        }
        // Simulate login (replace with actual backend call)
        console.log('Login attempt:', { email, password });
        errorMessage.textContent = 'Login successful (simulated)!';
        errorMessage.classList.remove('text-red-500');
        errorMessage.classList.add('text-green-500');
    } else {
        const name = document.getElementById('name').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Basic signup validation
        if (!name || !email || !password || !confirmPassword) {
            errorMessage.textContent = 'Please fill in all fields.';
            return;
        }
        if (password !== confirmPassword) {
            errorMessage.textContent = 'Passwords do not match.';
            return;
        }
        // Simulate signup (replace with actual backend call)
        console.log('Signup attempt:', { name, email, password });
        errorMessage.textContent = 'Signup successful (simulated)!';
        errorMessage.classList.remove('text-red-500');
        errorMessage.classList.add('text-green-500');
    }
});