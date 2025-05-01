document.addEventListener('DOMContentLoaded', () => {
    const cartItems = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const discountEl = document.getElementById('discount');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    const applyCouponBtn = document.getElementById('apply-coupon');
    const couponCodeInput = document.getElementById('coupon-code');

    // Sample product data
    const products = [
        { id: 1, name: "Wireless Earbuds", price: 99.99, image: "https://via.placeholder.com/80" },
        { id: 2, name: "Smart Watch", price: 199.99, image: "https://via.placeholder.com/80" },
        { id: 3, name: "Bluetooth Speaker", price: 59.99, image: "https://via.placeholder.com/80" }
    ];

    // Cart state
    let cart = [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 1 }
    ];

    // Discount codes
    const discountCodes = {
        "SAVE10": 10, // 10% discount
        "SAVE20": 20  // 20% discount
    };

    let appliedDiscount = 0;

    // Render cart items
    function renderCart() {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }

        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (!product) return;

            const cartItemEl = document.createElement('div');
            cartItemEl.className = 'cart-item';
            cartItemEl.innerHTML = `
                <div class="item-info">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="item-details">
                        <h3>${product.name}</h3>
                        <p>$${product.price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="item-controls">
                    <div class="quantity-controls">
                        <button class="decrease-btn" data-id="${product.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-btn" data-id="${product.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${product.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(cartItemEl);
        });

        updateTotals();
    }

    // Update cart totals
    function updateTotals() {
        let subtotal = 0;

        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) subtotal += product.price * item.quantity;
        });

        const discountAmount = (subtotal * appliedDiscount) / 100;
        const tax = (subtotal - discountAmount) * 0.10;
        const total = subtotal - discountAmount + tax;

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        discountEl.textContent = `-$${discountAmount.toFixed(2)}`;
        taxEl.textContent = `$${tax.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
    }

    // Event delegation for buttons
    cartItems.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const productId = parseInt(target.dataset.id);

        if (target.classList.contains('increase-btn')) {
            increaseQuantity(productId);
        } else if (target.classList.contains('decrease-btn')) {
            decreaseQuantity(productId);
        } else if (target.classList.contains('remove-item')) {
            removeItem(productId);
        }
    });

    // Increase quantity
    function increaseQuantity(productId) {
        const item = cart.find(item => item.id === productId);
        if (item) item.quantity++;
        renderCart();
    }

    // Decrease quantity
    function decreaseQuantity(productId) {
        const item = cart.find(item => item.id === productId);
        if (item && item.quantity > 1) {
            item.quantity--;
        } else {
            removeItem(productId);
        }
        renderCart();
    }

    // Remove item
    function removeItem(productId) {
        cart = cart.filter(item => item.id !== productId);
        renderCart();
    }

    // Apply coupon
    applyCouponBtn.addEventListener('click', () => {
        const code = couponCodeInput.value.trim().toUpperCase();
        if (discountCodes[code]) {
            appliedDiscount = discountCodes[code];
            alert(`Coupon applied: ${appliedDiscount}% off!`);
            updateTotals();
        } else {
            alert("Invalid coupon code");
        }
    });

    // Initialize cart
    renderCart();
});