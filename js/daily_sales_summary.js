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

    loadTodaySales();
    setupMidnightReset();
});

function loadTodaySales() {
    const salesLog = JSON.parse(localStorage.getItem('rmv_sales_log')) || [];
    const todayStr = new Date().toDateString();

    const todayOrders = salesLog.filter(order => {
        return new Date(order.timestamp).toDateString() === todayStr;
    });

    const summaryMap = {
        "SLIM GALLON": { qty: 0, sales: 0 },
        "ROUND GALLON": { qty: 0, sales: 0 },
        "BOTTLED WATER 1L": { qty: 0, sales: 0 },
        "BOTTLED WATER 500ML": { qty: 0, sales: 0 },
        "BOTTLED WATER 350ML": { qty: 0, sales: 0 }
    };

    todayOrders.forEach(order => {
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

function setupMidnightReset() {
    const now = new Date();
    const midnight = new Date();
    
    midnight.setHours(24, 0, 0, 0);
    
    const timeUntilMidnight = midnight.getTime() - now.getTime();
    
    setTimeout(() => {
        loadTodaySales();
        setInterval(loadTodaySales, 86400000);
    }, timeUntilMidnight);
}