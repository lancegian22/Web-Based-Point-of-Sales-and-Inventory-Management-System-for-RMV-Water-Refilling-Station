const POSButton = document.getElementById("POSButton");
const InventoryButton = document.getElementById("InventoryButton");
const SalesButton = document.getElementById("SalesButton");

POSButton.addEventListener("click", function() {
    window.location.href = "point_of_sales.html";
});

InventoryButton.addEventListener("click", function() {
    window.location.href = "inventory_management_system.html";
});

SalesButton.addEventListener("click", function() {
    window.location.href = "view_sales_summary.html";
});