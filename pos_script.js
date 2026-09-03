const AddOrdersButton = document.getElementById("AddOrdersButton");
const ViewSalesSummaryButton = document.getElementById("ViewSalesSummaryButton");
const BackButton = document.getElementById("BackButton");

AddOrdersButton.addEventListener("click", function() {
    window.location.href = "add_orders.html";
});

ViewSalesSummaryButton.addEventListener("click", function() {
    window.location.href = "view_sales_summary.html";
});

BackButton.addEventListener("click", function() {
    window.location.href = "index.html";
});