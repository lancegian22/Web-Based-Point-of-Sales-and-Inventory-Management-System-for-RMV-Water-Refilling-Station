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

function handleBack() {
    window.history.back();
}

function handleHome() {
    window.location.href = 'inventory_management_system.html';
}

function checkEnter(event, stockKey) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addStock(stockKey);
    }
}

function addStock(stockKey) {
    const inputField = document.querySelector(`input[data-stock="${stockKey}"]`);
    if (!inputField || !inputField.value || parseInt(inputField.value) <= 0) return;

    const valueToAdd = parseInt(inputField.value);
    let currentStock = JSON.parse(localStorage.getItem('rmv_inventory')) || zeroInventoryBaseline;

    if (currentStock[stockKey] !== undefined) {
        currentStock[stockKey] = (parseInt(currentStock[stockKey]) || 0) + valueToAdd;
        localStorage.setItem('rmv_inventory', JSON.stringify(currentStock));
        
        inputField.value = '';
        window.location.href = 'quantity_added.html';
    }
}
