document.getElementById('bmiForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const errorMessage = document.getElementById('errorMessage');
    const result = document.getElementById('result');
    const bmiValue = document.getElementById('bmiValue');
    const bmiCategory = document.getElementById('bmiCategory');

    // Reset error and result
    errorMessage.textContent = '';
    result.classList.add('hidden');

    // Get form values
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);

    // Validation
    if (isNaN(weight) || weight <= 0) {
        errorMessage.textContent = 'Please enter a valid weight.';
        return;
    }
    if (isNaN(height) || height <= 0) {
        errorMessage.textContent = 'Please enter a valid height.';
        return;
    }

    // Calculate BMI
    const bmi = weight / (height * height);
    const bmiRounded = bmi.toFixed(1);

    // Determine BMI category
    let category;
    if (bmi < 18.5) {
        category = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal weight';
    } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
    } else {
        category = 'Obese';
    }

    // Display result
    bmiValue.textContent = bmiRounded;
    bmiCategory.textContent = `Category: ${category}`;
    result.classList.remove('hidden');

    // Log result (replace with backend API call if needed)
    console.log({ weight, height, bmi: bmiRounded, category });
});