const zeroInventoryBaseline = {
    "slim-gallon": 0,
    "round-gallon": 0,
    "bottled-350ml": 0,
    "bottled-500ml": 0,
    "bottled-1l": 0,
    "slim-small-cap": 0,
    "slim-big-cap": 0,
    "round-cap": 0,
    "bottled-350ml-cap": 0,
    "bottled-500ml-cap": 0,
    "bottled-1l-cap": 0,
    "seal": 0,
    "sticker": 0,
    "gallon-plastic": 0
};

if (!localStorage.getItem('rmv_inventory')) {
    localStorage.setItem('rmv_inventory', JSON.stringify(zeroInventoryBaseline));
}

function preventSubmit(e) {
    e.preventDefault();
}

function checkEnter(event, stockKey) {
    if (event.key === 'Enter') {
        event.preventDefault();
        editStock(stockKey);
    }
}

function editStock(stockKey) {
    const inputField = document.querySelector(`input[data-stock="${stockKey}"]`);
    if (!inputField || inputField.value.trim() === "" || parseInt(inputField.value) < 0) return;

    const newValue = parseInt(inputField.value);

    sessionStorage.setItem('pending_edit_key', stockKey);
    sessionStorage.setItem('pending_edit_value', newValue);
    
    inputField.value = '';
    window.location.href = 'edit_confirmation.html';
}

function loadCurrentInventoryAsPlaceholders() {
    const currentStock = JSON.parse(localStorage.getItem('rmv_inventory'));
    if (currentStock) {
        Object.keys(currentStock).forEach(key => {
            const inputField = document.querySelector(`input[data-stock="${key}"]`);
            if (inputField) {
                inputField.placeholder = currentStock[key];
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", loadCurrentInventoryAsPlaceholders);