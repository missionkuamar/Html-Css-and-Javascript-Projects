document.addEventListener('DOMContentLoaded', () => {
    const transactionForm = document.getElementById('transaction-form');
    const transactionList = document.getElementById('transaction-list');
    const balanceEl = document.getElementById('balance');
    const incomeEl = document.getElementById('total-income');
    const expenseEl = document.getElementById('total-expense');
    const filterType = document.getElementById('filter-type');
    const filterCategory = document.getElementById('filter-category');

    // Categories
    const categories = {
        income: ['salary', 'freelance'],
        expense: ['food', 'transport', 'bills', 'entertainment', 'other']
    };

    // Initialize transactions from localStorage
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    // Initialize categories in filter dropdown
    function initCategories() {
        filterCategory.innerHTML = '<option value="all">All Categories</option>';
        
        // Add income categories
        categories.income.forEach(cat => {
            filterCategory.innerHTML += `<option value="${cat}">${capitalizeFirstLetter(cat)}</option>`;
        });
        
        // Add expense categories
        categories.expense.forEach(cat => {
            filterCategory.innerHTML += `<option value="${cat}">${capitalizeFirstLetter(cat)}</option>`;
        });
    }

    // Capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Add transaction
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const text = document.getElementById('text').value;
        const amount = +document.getElementById('amount').value;
        const type = document.getElementById('type').value;
        const category = document.getElementById('category').value;

        if (text.trim() === '' || amount <= 0) {
            alert('Please enter valid description and amount');
            return;
        }

        const transaction = {
            id: generateID(),
            text,
            amount,
            type,
            category,
            date: new Date().toISOString()
        };

        transactions.push(transaction);
        updateLocalStorage();
        addTransactionDOM(transaction);
        updateBalance();
        transactionForm.reset();
    });

    // Generate random ID
    function generateID() {
        return Math.floor(Math.random() * 100000000);
    }

    // Add transaction to DOM
    function addTransactionDOM(transaction) {
        const sign = transaction.type === 'income' ? '+' : '-';
        const item = document.createElement('li');
        item.classList.add('transaction', transaction.type);
        item.innerHTML = `
            <div class="transaction-info">
                <span class="transaction-text">${transaction.text}</span>
                <span class="transaction-category">${capitalizeFirstLetter(transaction.category)}</span>
            </div>
            <div>
                <span class="transaction-amount">${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
                <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        transactionList.appendChild(item);
    }

    // Update balance, income, and expense
    function updateBalance() {
        const amounts = transactions.map(transaction => 
            transaction.type === 'income' ? transaction.amount : -transaction.amount
        );

        const balance = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
        const income = amounts
            .filter(item => item > 0)
            .reduce((acc, item) => acc + item, 0)
            .toFixed(2);
        const expense = amounts
            .filter(item => item < 0)
            .reduce((acc, item) => acc + item, 0)
            .toFixed(2);

        balanceEl.textContent = `$${balance}`;
        incomeEl.textContent = `+$${income}`;
        expenseEl.textContent = `-$${Math.abs(expense)}`;
    }

    // Remove transaction by ID
    window.removeTransaction = function(id) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        updateLocalStorage();
        init();
    };

    // Filter transactions
    filterType.addEventListener('change', filterTransactions);
    filterCategory.addEventListener('change', filterTransactions);

    function filterTransactions() {
        const type = filterType.value;
        const category = filterCategory.value;

        const filtered = transactions.filter(transaction => {
            const typeMatch = type === 'all' || transaction.type === type;
            const categoryMatch = category === 'all' || transaction.category === category;
            return typeMatch && categoryMatch;
        });

        transactionList.innerHTML = '';
        filtered.forEach(addTransactionDOM);
    }

    // Update localStorage
    function updateLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    // Initialize app
    function init() {
        transactionList.innerHTML = '';
        transactions.forEach(addTransactionDOM);
        updateBalance();
        initCategories();
    }

    init();
});