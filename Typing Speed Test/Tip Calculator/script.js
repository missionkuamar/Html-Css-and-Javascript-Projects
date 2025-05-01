let selectedTip = 15; // Default tip percentage

// Handle tip button clicks
document.querySelectorAll('.tip-btn').forEach(button => {
    button.addEventListener('click', () => {
        selectedTip = parseFloat(button.dataset.tip);
        document.getElementById('customTip').value = '';
        document.querySelectorAll('.tip-btn').forEach(btn => btn.classList.remove('bg-purple-300'));
        button.classList.add('bg-purple-300');
    });
});

// Handle form submission
document.getElementById('tipForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const errorMessage = document.getElementById('errorMessage');
    const result = document.getElementById('result');
    const tipAmount = document.getElementById('tipAmount');
    const totalPerPerson = document.getElementById('totalPerPerson');

    // Reset error and result
    errorMessage.textContent = '';
    result.classList.add('hidden');

    // Get form values
    const bill = parseFloat(document.getElementById('bill').value);
    const customTip = parseFloat(document.getElementById('customTip').value);
    const people = parseInt(document.getElementById('people').value);
    const tipPercentage = !isNaN(customTip) && customTip >= 0 ? customTip : selectedTip;

    // Validation
    if (isNaN(bill) || bill <= 0) {
        errorMessage.textContent = 'Please enter a valid bill amount.';
        return;
    }
    if (isNaN(people) || people < 1) {
        errorMessage.textContent = 'Please enter a valid number of people.';
        return;
    }
    if (tipPercentage < 0) {
        errorMessage.textContent = 'Tip percentage cannot be negative.';
        return;
    }

    // Calculate tip and total
    const tip = (bill * tipPercentage) / 100;
    const total = bill + tip;
    const tipPerPerson = tip / people;
    const totalPerPersonAmount = total / people;

    // Display result
    tipAmount.textContent = `Tip Amount: $${tip.toFixed(2)} ($${tipPerPerson.toFixed(2)} per person)`;
    totalPerPerson.textContent = `Total per Person: $${totalPerPersonAmount.toFixed(2)}`;
    result.classList.remove('hidden');

    // Log result (replace with backend API call if needed)
    console.log({ bill, tipPercentage, people, tip, total, tipPerPerson, totalPerPerson: totalPerPersonAmount });
});