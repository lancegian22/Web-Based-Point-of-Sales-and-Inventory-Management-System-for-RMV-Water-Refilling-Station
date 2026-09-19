function displayInventoryValues() {
    const activeInventory = JSON.parse(localStorage.getItem('rmv_inventory'));
    if (activeInventory) {
        Object.keys(activeInventory).forEach(key => {
            const dataTargetElement = document.getElementById(`qty-${key}`);
            if (dataTargetElement) {
                dataTargetElement.value = activeInventory[key];
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", displayInventoryValues);