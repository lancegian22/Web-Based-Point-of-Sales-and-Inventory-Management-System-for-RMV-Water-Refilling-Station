const products = document.querySelectorAll('.product-card');
const ticketItemsContainer = document.getElementById('ticket-items');
const totalAmountSpan = document.getElementById('total-amount');
const basketTxnIdDisplay = document.getElementById('basket-txn-id');

const modal = document.getElementById('product-modal');
const modalProductPrice = document.getElementById('modal-product-price');
const modalProductSubtotal = document.getElementById('modal-product-subtotal');
const modalQtyInput = document.getElementById('modal-qty');
const gallonTypeField = document.getElementById('gallon-type-field');
const btnTypeRefill = document.getElementById('btn-type-refill');
const btnTypeBuy = document.getElementById('btn-type-buy');
let selectedGallonMode = 'refill';

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

let ticket = JSON.parse(localStorage.getItem('rmv_active_basket')) || [];
let activeProduct = null;
let editingIndex = null;
let grandTotal = 0;

let activeTxnId = localStorage.getItem('rmv_current_txn_id') || '';

updateTicket();

products.forEach(product => {
    product.addEventListener('click', () => {
        let name = product.getAttribute('data-name');
        let price = parseFloat(product.getAttribute('data-price')) || 0.00;
        
        if (name === "Slim Gallon" || name === "Round Gallon") price = 25.00;
        if (name === "1L Bottled Water") price = 10.00;
        if (name === "500ml Bottled Water") price = 6.00;
        if (name === "350ml Bottled Water") price = 5.00;
        
        if (name === "Slim Gallon Small Cap" || name === "Slim Gallon Big Cap" || name === "Round Gallon Cap") price = 5.00;
        if (name === "Bottled Water 350ml Cap" || name === "Bottled Water 500ml Cap" || name === "Bottled Water 1L Cap") price = 2.00;
        
        if (name === "Seal") price = 1.00;
        if (name === "Sticker") price = 2.00;
        if (name === "Gallon Plastic Cover") price = 3.00;
        
        activeProduct = { name, price };
        editingIndex = null;
        
        modalQtyInput.value = 1;
        
        if (name === "Slim Gallon" || name === "Round Gallon") {
            if (gallonTypeField) gallonTypeField.style.display = 'block';
            setGallonMode('refill');
        } else {
            if (gallonTypeField) gallonTypeField.style.display = 'none';
        }
        
        updateModalPrices();
        modal.classList.add('active');
    });
});

function generateTransactionId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const dateStr = String(now.getDate()).padStart(2, '0');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `TXN-${year}${month}${dateStr}-${randomNum}`;
}

function setGallonMode(mode) {
    selectedGallonMode = mode;
    if (mode === 'refill') {
        btnTypeRefill.style.backgroundColor = '#1e3a8a';
        btnTypeRefill.style.color = '#ffffff';
        btnTypeRefill.style.borderColor = '#1e3a8a';
        
        btnTypeBuy.style.backgroundColor = '#ffffff';
        btnTypeBuy.style.color = '#334155';
        btnTypeBuy.style.borderColor = '#cbd5e1';
    } else {
        btnTypeBuy.style.backgroundColor = '#1e3a8a';
        btnTypeBuy.style.color = '#ffffff';
        btnTypeBuy.style.borderColor = '#1e3a8a';
        
        btnTypeRefill.style.backgroundColor = '#ffffff';
        btnTypeRefill.style.color = '#334155';
        btnTypeRefill.style.borderColor = '#cbd5e1';
    }
}

if (btnTypeRefill) {
    btnTypeRefill.addEventListener('click', () => {
        setGallonMode('refill');
        updateModalPrices();
    });
}

if (btnTypeBuy) {
    btnTypeBuy.addEventListener('click', () => {
        setGallonMode('buy');
        updateModalPrices();
    });
}

function updateModalPrices() {
    if (!activeProduct) return;
    
    let price = activeProduct.price;
    if (activeProduct.name === "Slim Gallon" || activeProduct.name === "Round Gallon") {
        price = selectedGallonMode === 'buy' ? 200.00 : 25.00;
    }
    
    const qty = parseInt(modalQtyInput.value);
    const subtotal = price * qty;
    
    modalProductPrice.textContent = `₱${price.toFixed(2)}`;
    modalProductSubtotal.textContent = `₱${subtotal.toFixed(2)}`;
}

qtyPlusBtn.addEventListener('click', () => {
    let currentQty = parseInt(modalQtyInput.value);
    modalQtyInput.value = currentQty + 1;
    updateModalPrices();
});

qtyMinusBtn.addEventListener('click', () => {
    let currentQty = parseInt(modalQtyInput.value);
    if (currentQty > 1) {
        modalQtyInput.value = currentQty - 1;
        updateModalPrices();
    }
});

cancelModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    activeProduct = null;
    editingIndex = null;
});

addToBasketBtn.addEventListener('click', () => {
    if (!activeProduct) return;
    
    if (!activeTxnId) {
        activeTxnId = generateTransactionId();
        localStorage.setItem('rmv_current_txn_id', activeTxnId);
    }
    
    const qty = parseInt(modalQtyInput.value);
    let finalName = activeProduct.name;
    let finalPrice = activeProduct.price;
    let mode = 'standard';
    
    if (activeProduct.name === "Slim Gallon" || activeProduct.name === "Round Gallon") {
        mode = selectedGallonMode;
        if (selectedGallonMode === 'buy') {
            finalName = `${activeProduct.name} (Buy New)`;
            finalPrice = 200.00;
        } else {
            finalName = `${activeProduct.name} (Refill)`;
            finalPrice = 25.00;
        }
    }
    
    if (editingIndex !== null) {
        ticket[editingIndex] = {
            uniqueKey: finalName,
            name: activeProduct.name,
            displayName: finalName,
            price: finalPrice,
            quantity: qty,
            mode: mode
        };
    } else {
        const existingItem = ticket.find(item => item.uniqueKey === finalName);
        if (existingItem) {
            existingItem.quantity += qty;
        } else {
            ticket.push({
                uniqueKey: finalName,
                name: activeProduct.name,
                displayName: finalName,
                price: finalPrice,
                quantity: qty,
                mode: mode
            });
        }
    }
    
    modal.classList.remove('active');
    activeProduct = null;
    editingIndex = null;
    
    localStorage.setItem('rmv_active_basket', JSON.stringify(ticket));
    updateTicket();
});

function updateTicket() {
    if (ticket.length === 0) {
        ticketItemsContainer.innerHTML = '<div class="empty-ticket-message">No items added yet.</div>';
        totalAmountSpan.textContent = '₱0.00';
        if (basketTxnIdDisplay) basketTxnIdDisplay.style.display = 'none';
        return;
    }
    
    if (basketTxnIdDisplay && activeTxnId) {
        basketTxnIdDisplay.textContent = `Transaction ID: ${activeTxnId}`;
        basketTxnIdDisplay.style.display = 'block';
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
        nameSpan.textContent = item.displayName || item.name;

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
    activeProduct = { name: item.name, price: item.name === "Slim Gallon" || item.name === "Round Gallon" ? 25.00 : item.price };
    editingIndex = index;

    modalQtyInput.value = item.quantity;
        if (item.name === "Slim Gallon" || item.name === "Round Gallon") {
        if (gallonTypeField) gallonTypeField.style.display = 'block';
        setGallonMode(item.mode || 'refill');
    } else {
        if (gallonTypeField) gallonTypeField.style.display = 'none';
    }
    updateModalPrices();
    modal.classList.add('active');
}

function deleteBasketItem(index) {
    if (confirm('Are you sure that you want to remove this item from the basket?')) {
        ticket.splice(index, 1);
        if (ticket.length === 0) {
            activeTxnId = '';
            localStorage.removeItem('rmv_current_txn_id');
        }
        localStorage.setItem('rmv_active_basket', JSON.stringify(ticket));
        updateTicket();
    }
}

resetBasketBtn.addEventListener('click', () => {
    if (ticket.length === 0) return;
    if (confirm('Are you sure that you want to clear the entire basket?')) {
        ticket = [];
        activeTxnId = '';
        localStorage.removeItem('rmv_current_txn_id');
        localStorage.removeItem('rmv_active_basket');
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
confirmTransactBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const activeInputBox = document.activeElement;
    if (activeInputBox && (activeInputBox.tagName === 'INPUT' || activeInputBox.tagName === 'TEXTAREA')) {
        activeInputBox.blur(); 
    }

    const amountTenderedInput = document.getElementById('amount-tendered') || document.getElementById('amount-given');
    const tendered = parseFloat(amountTenderedInput.value) || 0;

    if (tendered < grandTotal) {
        alert('Cannot complete the transaction: The amount given is less than the total amount value.');
        amountTenderedInput.focus();
        return;
    }
    let stockValidationPassed = true;
    let inventoryMap = {};
    const requiredConsumables = ["Seal", "Sticker", "Gallon Plastic Cover"];
    requiredConsumables.forEach(c => {
        const val = localStorage.getItem(`stock_${c}`);
        inventoryMap[c] = val !== null ? parseInt(val) : 0;
    });
    products.forEach(p => {
        const pName = p.getAttribute('data-name');
        let storageName = pName;
        if (pName === "350ml Bottled Water") storageName = "Bottled Water 350ml";
        if (pName === "500ml Bottled Water") storageName = "Bottled Water 500ml";
        if (pName === "1L Bottled Water") storageName = "Bottled Water 1L";
        if (inventoryMap[storageName] === undefined) {
            const val = localStorage.getItem(`stock_${storageName}`);
            inventoryMap[storageName] = val !== null ? parseInt(val) : 0;
        }
    });
    ticket.forEach(item => {
        let storageName = item.name;
        if (item.name === "350ml Bottled Water") storageName = "Bottled Water 350ml";
        if (item.name === "500ml Bottled Water") storageName = "Bottled Water 500ml";
        if (item.name === "1L Bottled Water") storageName = "Bottled Water 1L";
        const isBottledWater = (item.name === "350ml Bottled Water" || item.name === "500ml Bottled Water" || item.name === "1L Bottled Water");
        let currentItemMode = item.mode;
        if (item.displayName && item.displayName.includes("(Buy New)")) {
            currentItemMode = "buy";
        } else if (item.displayName && item.displayName.includes("(Refill)")) {
            currentItemMode = "refill";
        }
        if (item.name === "Slim Gallon" || item.name === "Round Gallon") {
            if (currentItemMode === "buy") {
                if (item.quantity > inventoryMap[storageName]) {
                    alert(`Insufficient Stock for ${item.name} Container!\nAvailable: ${inventoryMap[storageName]}`);
                    stockValidationPassed = false;
                } else {
                    inventoryMap[storageName] -= item.quantity;
                }
            } else if (currentItemMode === "refill") {
                requiredConsumables.forEach(c => {
                    if (item.quantity > inventoryMap[c]) {
                        alert(`Insufficient Stock for Packaging ${c} required during Refill!\nAvailable: ${inventoryMap[c]}`);
                        stockValidationPassed = false;
                    } else {
                        inventoryMap[c] -= item.quantity;
                    }
                });
            }
        } else if (isBottledWater) {
            if (item.quantity > inventoryMap[storageName]) {
                alert(`Insufficient Stock for ${item.name}!\nAvailable: ${inventoryMap[storageName]}`);
                stockValidationPassed = false;
            } else if (item.quantity > inventoryMap["Sticker"]) {
                alert(`Insufficient Stock for Stickers required for ${item.name}!\nAvailable: ${inventoryMap["Sticker"]}`);
                stockValidationPassed = false;
            } else {
                inventoryMap[storageName] -= item.quantity;
                inventoryMap["Sticker"] -= item.quantity;
            }
        } else {
            if (item.quantity > inventoryMap[storageName]) {
                alert(`Insufficient Stock for ${item.name}!\nAvailable: ${inventoryMap[storageName]}`);
                stockValidationPassed = false;
            } else {
                inventoryMap[storageName] -= item.quantity;
            }
        }
    });
        if (!stockValidationPassed) return;
    for (const [key, val] of Object.entries(inventoryMap)) {
        localStorage.setItem(`stock_${key}`, val);
    }
    const finalChange = tendered - grandTotal;
    const salesLog = JSON.parse(localStorage.getItem('rmv_sales_log')) || [];

    const now = new Date();
    const localFilterDate = now.getFullYear() + '-' + 
                            String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                            String(now.getDate()).padStart(2, '0');
    const timestamp = now.toLocaleString(); 

    const finalTxnId = activeTxnId;
    const receiptItemsContainer = document.getElementById('receipt-items-list');
    if (receiptItemsContainer) {
        receiptItemsContainer.innerHTML = '';
        ticket.forEach(item => {
            const itemRow = document.createElement('div');
            itemRow.style.display = 'flex';
            itemRow.style.justifyContent = 'space-between';
            itemRow.style.marginBottom = '5px';
            itemRow.innerHTML = `<div><div>${item.displayName || item.name}</div><div style="font-size: 10px; color: #555;">₱${item.price.toFixed(2)} x ${item.quantity}</div></div><div>₱${(item.price * item.quantity).toFixed(2)}</div>`;
            receiptItemsContainer.appendChild(itemRow);
        });
    }
    const recDate = document.getElementById('receipt-date-time');
    const recTxnId = document.getElementById('receipt-txn-id');
    const recTotal = document.getElementById('receipt-total');
    const recTendered = document.getElementById('receipt-tendered');
    const recChange = document.getElementById('receipt-change');
    if (recDate) recDate.textContent = `DATE: ${timestamp}`;
    if (recTxnId) recTxnId.textContent = `TRANSACTION ID: ${finalTxnId}`;
    if (recTotal) recTotal.textContent = `₱${grandTotal.toFixed(2)}`;
    if (recTendered) recTendered.textContent = `₱${tendered.toFixed(2)}`;
    if (recChange) recChange.textContent = `₱${finalChange.toFixed(2)}`;

    ticket.forEach(item => {
        let standardProductType = item.name.toUpperCase().trim(); 
        
        if (standardProductType.includes('1L BOTTLED WATER') || standardProductType.includes('BOTTLED WATER 1L')) standardProductType = '1L BOTTLED WATER';
        if (standardProductType.includes('500ML BOTTLED WATER') || standardProductType.includes('BOTTLED WATER 500ML')) standardProductType = '500ML BOTTLED WATER';
        if (standardProductType.includes('350ML BOTTLED WATER') || standardProductType.includes('BOTTLED WATER 350ML')) standardProductType = '350ML BOTTLED WATER';
        
        salesLog.push({
            type: standardProductType,
            baseName: item.name,
            date: localFilterDate, 
            quantity: item.quantity,
            total: item.price * item.quantity,
            timestamp: timestamp
        });
    });

        localStorage.setItem('rmv_sales_log', JSON.stringify(salesLog));

    if (checkoutModal) {
        checkoutModal.classList.remove('active');
    }

    const isMobilePhone = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 480;

    if (isMobilePhone) {
        alert(`Transaction Successful!\nTotal: ₱${grandTotal.toFixed(2)}\nChange: ₱${finalChange.toFixed(2)}`);
        
        ticket = [];
        localStorage.removeItem('rmv_active_basket');
        localStorage.removeItem('rmv_current_txn_id');
        
        window.location.reload();
        return; 
    }

    const printAreaBox = document.getElementById('receipt-print-area');
    if (printAreaBox) {
        printAreaBox.style.display = 'block'; 
    }

    setTimeout(() => {
        window.print();
        if (printAreaBox) {
            printAreaBox.style.display = 'none'; 
        }
        
        ticket = [];
        localStorage.removeItem('rmv_active_basket');
        localStorage.removeItem('rmv_current_txn_id');
        window.location.reload();
    }, 150);
});