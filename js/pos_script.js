const products = document.querySelectorAll('.product-card');
const ticketItemsContainer = document.getElementById('ticket-items');
const totalAmountSpan = document.getElementById('total-amount');

const modal = document.getElementById('product-modal');
const modalProductPrice = document.getElementById('modal-product-price');
const modalProductSubtotal = document.getElementById('modal-product-subtotal');
const modalQtyInput = document.getElementById('modal-qty');
const customerNameInput = document.getElementById('customer-name');

const qtyMinusBtn = document.getElementById('qty-minus');
const qtyPlusBtn = document.getElementById('qty-plus');
const addToBasketBtn = document.getElementById('add-to-basket-btn');
const cancelModalBtn = document.getElementById('cancel-modal-btn');

const checkoutModal = document.getElementById('checkout-modal');
const checkoutTotalPayable = document.getElementById('checkout-total-payable');
const amountTenderedInput = document.getElementById('amount-tendered');
const checkoutChangeSpan = document.getElementById('checkout-change');
const confirmTransactBtn = document.getElementById('confirm-transact-btn');
const cancelCheckoutBtn = document.getElementById('cancel-checkout-btn');
const resetBasketBtn = document.getElementById('reset-basket-btn');

let ticket = [];
let activeProduct = null;
let editingIndex = null;
let grandTotal = 0;

products.forEach(product => {
    product.addEventListener('click', () => {
        let name = product.getAttribute('data-name');
        let price = parseFloat(product.getAttribute('data-price')) || 0.00;
        
        if (name === "Slim Gallon") price = 25.00;
        if (name === "Round Gallon") price = 25.00;
        if (name === "1L Bottled Water") price = 10.00;
        if (name === "500ml Bottled Water") price = 6.00;
        if (name === "350ml Bottled Water") price = 5.00;
        
        activeProduct = { name, price };
        editingIndex = null;
        
        modalProductPrice.textContent = `₱${price.toFixed(2)}`;
        modalQtyInput.value = 1;
        customerNameInput.value = '';
        
        calculateModalSubtotal();
        modal.classList.add('active');
    });
});

function calculateModalSubtotal() {
    if (!activeProduct) return;
    const qty = parseInt(modalQtyInput.value);
    const subtotal = activeProduct.price * qty;
    modalProductSubtotal.textContent = `₱${subtotal.toFixed(2)}`;
}

qtyPlusBtn.addEventListener('click', () => {
    let currentQty = parseInt(modalQtyInput.value);
    modalQtyInput.value = currentQty + 1;
    calculateModalSubtotal();
});

qtyMinusBtn.addEventListener('click', () => {
    let currentQty = parseInt(modalQtyInput.value);
    if (currentQty > 1) {
        modalQtyInput.value = currentQty - 1;
        calculateModalSubtotal();
    }
});

cancelModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    activeProduct = null;
    editingIndex = null;
});

addToBasketBtn.addEventListener('click', () => {
    if (!activeProduct) return;
    
    const customerName = customerNameInput.value.trim();
    
    if (!customerName) {
        alert('Customer Name is required!');
        customerNameInput.focus();
        return;
    }
    
    const qty = parseInt(modalQtyInput.value);
    const uniqueTicketKey = `${activeProduct.name} (${customerName})`;
    
    if (editingIndex !== null) {
        ticket[editingIndex] = {
            uniqueKey: uniqueTicketKey,
            name: activeProduct.name,
            customer: customerName,
            price: activeProduct.price,
            quantity: qty
        };
    } else {
        const existingItem = ticket.find(item => item.uniqueKey === uniqueTicketKey);
        if (existingItem) {
            existingItem.quantity += qty;
        } else {
            ticket.push({
                uniqueKey: uniqueTicketKey,
                name: activeProduct.name,
                customer: customerName,
                price: activeProduct.price,
                quantity: qty
            });
        }
    }
    
    modal.classList.remove('active');
    activeProduct = null;
    editingIndex = null;
    updateTicket();
});

function updateTicket() {
    if (ticket.length === 0) {
        ticketItemsContainer.innerHTML = '<div class="empty-ticket-message">No items added yet.</div>';
        totalAmountSpan.textContent = '₱0.00';
        return;
    }
    
    ticketItemsContainer.innerHTML = '';
    let total = 0;
    
    ticket.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const row = document.createElement('div');
        row.className = 'ticket-item-row';

        const details = document.createElement('div');
        details.className = 'ticket-item-details';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'ticket-item-name';
        nameSpan.textContent = `${item.name} - ${item.customer}`;

        const calcSpan = document.createElement('span');
        calcSpan.className = 'ticket-item-calc';
        calcSpan.textContent = `₱${item.price.toFixed(2)} x ${item.quantity}`;

        details.appendChild(nameSpan);
        details.appendChild(calcSpan);

        const rightSection = document.createElement('div');
        rightSection.className = 'ticket-row-right';

        const priceSpan = document.createElement('span');
        priceSpan.className = 'ticket-item-price';
        priceSpan.textContent = `₱${itemTotal.toFixed(2)}`;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'ticket-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn-action-solid edit';
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => editBasketItem(index);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-action-solid delete';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteBasketItem(index);

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);

        rightSection.appendChild(priceSpan);
        rightSection.appendChild(actionsDiv);

        row.appendChild(details);
        row.appendChild(rightSection);
        ticketItemsContainer.appendChild(row);
    });
    
    totalAmountSpan.textContent = `₱${total.toFixed(2)}`;
}

function editBasketItem(index) {
    const item = ticket[index];
    activeProduct = { name: item.name, price: item.price };
    editingIndex = index;

    modalProductPrice.textContent = `₱${item.price.toFixed(2)}`;
    modalQtyInput.value = item.quantity;
    customerNameInput.value = item.customer;

    calculateModalSubtotal();
    modal.classList.add('active');
}

function deleteBasketItem(index) {
    if (confirm('Are you sure that you want to remove this item from the basket?')) {
        ticket.splice(index, 1);
        updateTicket();
    }
}

resetBasketBtn.addEventListener('click', () => {
    if (ticket.length === 0) return;
    if (confirm('Are you sure that you want to clear the entire basket?')) {
        ticket = [];
        updateTicket();
    }
});

document.getElementById('pay-now-btn').addEventListener('click', () => {
    if (ticket.length === 0) {
        alert('No items added yet.');
        return;
    }
    
    grandTotal = ticket.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    checkoutTotalPayable.textContent = `₱${grandTotal.toFixed(2)}`;
    amountTenderedInput.value = '';
    checkoutChangeSpan.textContent = '₱0.00';
    
    checkoutModal.classList.add('active');
});

amountTenderedInput.addEventListener('input', () => {
    const tendered = parseFloat(amountTenderedInput.value) || 0;
    const change = tendered - grandTotal;
    
    if (change >= 0) {
        checkoutChangeSpan.textContent = `₱${change.toFixed(2)}`;
        checkoutChangeSpan.style.color = '#059669';
    } else {
        checkoutChangeSpan.textContent = 'Insufficient Amount';
        checkoutChangeSpan.style.color = '#ef4444';
    }
});

cancelCheckoutBtn.addEventListener('click', () => {
    checkoutModal.classList.remove('active');
});

confirmTransactBtn.addEventListener('click', () => {
    const tendered = parseFloat(amountTenderedInput.value) || 0;
    
    if (tendered < grandTotal) {
        alert('Cannot complete the transaction: The amount given is less than the total amount value.');
        amountTenderedInput.focus();
        return;
    }
    
    const finalChange = tendered - grandTotal;
    
    const salesLog = JSON.parse(localStorage.getItem('rmv_sales_log')) || [];
    const timestamp = new Date().toISOString();

    ticket.forEach(item => {
        let standardProductType = item.name.toUpperCase().trim();
        
        if (standardProductType === '1L BOTTLED WATER') standardProductType = 'BOTTLED WATER 1L';
        if (standardProductType === '500ML BOTTLED WATER') standardProductType = 'BOTTLED WATER 500ML';
        if (standardProductType === '350ML BOTTLED WATER') standardProductType = 'BOTTLED WATER 350ML';

        salesLog.push({
            type: standardProductType,
            quantity: item.quantity,
            total: item.price * item.quantity,
            timestamp: timestamp
        });
    });

    localStorage.setItem('rmv_sales_log', JSON.stringify(salesLog));

    alert(`Transaction Successful!\nTotal: ₱${grandTotal.toFixed(2)}\nReceived: ₱${tendered.toFixed(2)}\nChange: ₱${finalChange.toFixed(2)}`);
    
    ticket = [];
    checkoutModal.classList.remove('active');
    updateTicket();
});

document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
});