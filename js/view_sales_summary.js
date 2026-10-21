document.addEventListener("DOMContentLoaded", () => {
    const backBtn = document.getElementById('back-btn') || document.querySelector('.back-btn') || document.querySelector('button');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    const now = new Date();
    const todayStr = now.getFullYear() + '-' + 
                     String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(now.getDate()).padStart(2, '0');
    
    const startDateInput = document.getElementById('start-date') || document.querySelector('input[type="date"]:first-of-type');
    const endDateInput = document.getElementById('end-date') || document.querySelector('input[type="date"]:last-of-type');
    
    const filterBtn = document.getElementById('btn-filter-date') || 
                      document.getElementById('filter-btn') || 
                      document.querySelector('button[class*="filter"]') ||
                      document.querySelector('.sales-view-panel button') ||
                      Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Filter'));

    if (startDateInput && !startDateInput.value) startDateInput.value = todayStr;
    if (endDateInput && !endDateInput.value) endDateInput.value = todayStr;

    if (filterBtn) {
        filterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadSalesByDateRange();
        });
    }

    loadSalesByDateRange();
});

function loadSalesByDateRange() {
    const salesLog = JSON.parse(localStorage.getItem('rmv_sales_log')) || [];
    
    const startDateInput = document.getElementById('start-date') || document.querySelector('input[type="date"]:first-of-type');
    const endDateInput = document.getElementById('end-date') || document.querySelector('input[type="date"]:last-of-type');

    if (!startDateInput || !endDateInput) return;

    const startDateVal = startDateInput.value;
    const endDateVal = endDateInput.value;

    const summaryMap = {
        "SLIM GALLON": { qty: 0, sales: 0 },
        "ROUND GALLON": { qty: 0, sales: 0 },
        "1L BOTTLED WATER": { qty: 0, sales: 0 },
        "500ML BOTTLED WATER": { qty: 0, sales: 0 },
        "350ML BOTTLED WATER": { qty: 0, sales: 0 },
        "SLIM GALLON SMALL CAP": { qty: 0, sales: 0 },
        "SLIM GALLON BIG CAP": { qty: 0, sales: 0 },
        "ROUND GALLON CAP": { qty: 0, sales: 0 },
        "BOTTLED WATER 350ML CAP": { qty: 0, sales: 0 },
        "BOTTLED WATER 500ML CAP": { qty: 0, sales: 0 },
        "BOTTLED WATER 1L CAP": { qty: 0, sales: 0 },
        "SEAL": { qty: 0, sales: 0 },
        "STICKER": { qty: 0, sales: 0 },
        "GALLON PLASTIC COVER": { qty: 0, sales: 0 }
    };

    salesLog.forEach(order => {
        let orderDate = order.date || '';
        
        if (startDateVal && endDateVal) {
            if (orderDate && (orderDate < startDateVal || orderDate > endDateVal)) return;
        }

        let productKey = order.type ? order.type.toUpperCase().trim() : '';
        
        if (productKey.includes('SLIM GALLON') && !productKey.includes('CAP')) productKey = 'SLIM GALLON';
        if (productKey.includes('ROUND GALLON') && !productKey.includes('CAP')) productKey = 'ROUND GALLON';

        if (summaryMap[productKey]) {
            summaryMap[productKey].qty += parseInt(order.quantity) || 0;
            summaryMap[productKey].sales += parseFloat(order.total) || 0;
        }
    });

    renderSalesSummaryTable(summaryMap);
}

function renderSalesSummaryTable(summaryMap) {
    const listItems = document.querySelectorAll('.sales-list-group li:not(.sales-list-header)');
    let grandTotal = 0;

    listItems.forEach(row => {
        const columns = row.querySelectorAll('span');
        if (columns.length < 4) return;

        let nameSpan = columns[1]; 
        let qtySpan = columns[columns.length - 2];  
        let salesSpan = columns[columns.length - 1]; 

        if (!nameSpan || !qtySpan || !salesSpan) return;

        let productName = nameSpan.textContent.toUpperCase().trim();

        if (productName.includes('SLIM GALLON') && !productName.includes('CAP')) productName = 'SLIM GALLON';
        if (productName.includes('ROUND GALLON') && !productName.includes('CAP')) productName = 'ROUND GALLON';
        if (productName.includes('1L BOTTLED WATER') || productName.includes('BOTTLED WATER 1L')) productName = '1L BOTTLED WATER';
        if (productName.includes('500ML BOTTLED WATER') || productName.includes('BOTTLED WATER 500ML')) productName = '500ML BOTTLED WATER';
        if (productName.includes('350ML BOTTLED WATER') || productName.includes('BOTTLED WATER 350ML')) productName = '350ML BOTTLED WATER';

        if (summaryMap[productName]) {
            const data = summaryMap[productName];
            qtySpan.textContent = data.qty;
            salesSpan.textContent = `₱${data.sales.toFixed(2)}`;
            grandTotal += data.sales;
        } else {
            qtySpan.textContent = "0";
            salesSpan.textContent = "₱0.00";
        }
    });

    const footerTotal = document.querySelector('.summary-total-footer span:last-child') || document.querySelector('.summary-total-footer span');
    if (footerTotal) {
        footerTotal.textContent = `₱${grandTotal.toFixed(2)}`;
    }
}