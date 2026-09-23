document.addEventListener("DOMContentLoaded", () => {
    const BackButton = document.getElementById('BackButton');
    const HomeButton = document.getElementById('HomeButton');
    const OkButton = document.getElementById('OkButton');

    if (BackButton) {
        BackButton.addEventListener('click', function() {
            window.location.href = 'view_sales_summary.html';
        });
    }

    if (HomeButton) {
        HomeButton.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

    if (OkButton) {
        OkButton.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

    loadMonthlySales();
});

function loadMonthlySales() {
    const salesLog = JSON.parse(localStorage.getItem('rmv_sales_log')) || [];
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyOrders = salesLog.filter(order => {
        const orderDate = new Date(order.timestamp);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });

    const summaryMap = {
        "SLIM GALLON": { qty: 0, sales: 0 },
        "ROUND GALLON": { qty: 0, sales: 0 },
        "BOTTLED WATER 1L": { qty: 0, sales: 0 },
        "BOTTLED WATER 500ML": { qty: 0, sales: 0 },
        "BOTTLED WATER 350ML": { qty: 0, sales: 0 }
    };

    monthlyOrders.forEach(order => {
        const productKey = order.type;
        if (summaryMap[productKey]) {
            summaryMap[productKey].qty += order.quantity;
            summaryMap[productKey].sales += order.total;
        }
    });

    const gridRows = document.querySelectorAll('.grid-row');
    let grandTotal = 0;

    gridRows.forEach(row => {
        const productLabelElement = row.querySelector('.product-label');
        if (!productLabelElement) return;

        const labelText = productLabelElement.textContent.replace(':', '').toUpperCase().trim();

        if (summaryMap[labelText]) {
            const qtyInput = row.querySelector('.field-quantity, input[type="number"]');
            const salesInput = row.querySelector('.field-sales');

            if (qtyInput) {
                qtyInput.value = summaryMap[labelText].qty;
            }
            if (salesInput) {
                salesInput.value = summaryMap[labelText].sales;
            }

            grandTotal += summaryMap[labelText].sales;
        }
    });

    const grandTotalField = document.getElementById('grandTotal');
    if (grandTotalField) {
        grandTotalField.value = grandTotal;
    }
}