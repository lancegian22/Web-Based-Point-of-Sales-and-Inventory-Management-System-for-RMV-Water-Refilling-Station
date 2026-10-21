document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
});

const cards = document.querySelectorAll('.product-card');
const modalOverlay = document.getElementById('inv-modal-overlay');
const modalTitle = document.getElementById('inv-modal-title');
const modalLabel = document.getElementById('inv-modal-label');
const modalInput = document.getElementById('inv-modal-input');
const modalConfirm = document.getElementById('inv-modal-confirm');
const modalCancel = document.getElementById('inv-modal-cancel');
const errorMsg = document.getElementById('inv-error-msg');

let currentActiveCard = null;
let currentMode = '';

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
}

function hideError() {
    errorMsg.textContent = '';
    errorMsg.style.display = 'none';
}

cards.forEach(card => {
    const itemName = card.querySelector('.product-name').textContent.trim();
    const countDisplay = card.querySelector('.qty-badge');
    
    const savedStock = localStorage.getItem(`stock_${itemName}`);
    if (savedStock !== null) {
        countDisplay.textContent = `Stock: ${savedStock}`;
    }

    card.querySelector('.btn-inv-action.add').addEventListener('click', (e) => {
        e.stopPropagation();
        hideError();
        currentActiveCard = { card, itemName, countDisplay };
        currentMode = 'add';
        
        modalTitle.textContent = `Add Stock - ${itemName}`;
        modalLabel.textContent = "Please enter a quantity to add:";
        modalInput.value = "0";
        modalOverlay.classList.add('active');
    });

    card.querySelector('.btn-inv-action.edit').addEventListener('click', (e) => {
        e.stopPropagation();
        hideError();
        currentActiveCard = { card, itemName, countDisplay };
        currentMode = 'edit';
        
        let currentStr = countDisplay.textContent.replace('Stock:', '').trim();
        modalTitle.textContent = `Edit Stock - ${itemName}`;
        modalLabel.textContent = "Please enter a new total quantity:";
        modalInput.value = currentStr;
        modalOverlay.classList.add('active');
    });

    card.querySelector('.btn-inv-action.delete').addEventListener('click', (e) => {
        e.stopPropagation();
        hideError();
        let currentStr = countDisplay.textContent.replace('Stock:', '').trim();
        const currentStock = parseInt(currentStr) || 0;
        
        currentActiveCard = { card, itemName, countDisplay, currentStock };
        currentMode = 'delete';
        
        modalTitle.textContent = `Remove Stock - ${itemName}`;
        modalLabel.textContent = `Enter quantity to delete (Current: ${currentStock}):`;
        modalInput.value = "0";
        modalOverlay.classList.add('active');
    });
});

modalConfirm.addEventListener('click', () => {
    if (!currentActiveCard) return;
    hideError();

    const parsed = parseInt(modalInput.value);
    if (isNaN(parsed) || parsed < 0) {
        showError('Please enter a valid positive number.');
        return;
    }

    const { countDisplay, currentStock, itemName } = currentActiveCard;
    let currentStr = countDisplay.textContent.replace('Stock:', '').trim();
    let current = parseInt(currentStr) || 0;
    let finalStock = current;

    if (currentMode === 'add' && parsed > 0) {
        finalStock = current + parsed;
    } else if (currentMode === 'edit') {
        finalStock = parsed;
    } else if (currentMode === 'delete') {
        if (currentStock === 0) {
            showError(`Cannot delete stocks: ${itemName} has no quantity in stock.`);
            return;
        }
        if (parsed > currentStock) {
            showError(`You cannot remove ${parsed} items because you only have ${currentStock} in stock.`);
            return;
        }
        if (parsed > 0) {
            finalStock = currentStock - parsed;
        }
    }

    countDisplay.textContent = `Stock: ${finalStock}`;
    
    localStorage.setItem(`stock_${itemName}`, finalStock);

    modalOverlay.classList.remove('active');
    currentActiveCard = null;
});

modalCancel.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    currentActiveCard = null;
    hideError();
});