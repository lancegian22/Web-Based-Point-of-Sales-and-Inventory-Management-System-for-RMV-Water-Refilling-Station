document.addEventListener("DOMContentLoaded", () => {
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    const filterButtons = document.querySelectorAll('.btn-filter');
    const viewPanels = document.querySelectorAll('.sales-view-panel');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            viewPanels.forEach(panel => panel.classList.remove('active'));

            button.classList.add('active');
            
            const targetId = button.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    loadAllSalesSummaries();
    setupMidnightReset();
});

function loadAllSalesSummaries() {
    const salesLog = JSON.parse(localStorage.getItem('rmv_sales_log')) || [];
    
    calculateAndRenderView(salesLog, 'daily');
    calculateAndRenderView(salesLog, 'weekly');
    calculateAndRenderView(salesLog, 'monthly');
    calculateAndRenderView(salesLog, 'yearly');
}

function calculateAndRenderView(salesLog, timeframe) {
    const now = new Date();
    const todayStr = now.toDateString();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const filteredOrders = salesLog.filter(order => {
        const orderDate = new Date(order.timestamp);
        
        if (timeframe === 'daily') {
            return orderDate.toDateString() === todayStr;
        } else if (timeframe === 'weekly') {
            return orderDate >= sevenDaysAgo && orderDate <= now;
        } else if (timeframe === 'monthly') {
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        } else if (timeframe === 'yearly') {
            return orderDate.getFullYear() === currentYear;
        }
        return false;
    });

    const summaryMap = {
        "SLIM GALLON": { qty: 0, sales: 0 },
        "ROUND GALLON": { qty: 0, sales: 0 },
        "1L BOTTLED WATER": { qty: 0, sales: 0 },
        "500ML BOTTLED WATER": { qty: 0, sales: 0 },
        "350ML BOTTLED WATER": { qty: 0, sales: 0 }
    };

    filteredOrders.forEach(order => {
        let productKey = order.type ? order.type.toUpperCase().trim() : '';
        
        if (productKey === 'BOTTLED WATER 1L') productKey = '1L BOTTLED WATER';
        if (productKey === 'BOTTLED WATER 500ML') productKey = '500ML BOTTLED WATER';
        if (productKey === 'BOTTLED WATER 350ML') productKey = '350ML BOTTLED WATER';

        if (summaryMap[productKey]) {
            summaryMap[productKey].qty += order.quantity;
            summaryMap[productKey].sales += order.total;
        }
    });

    const panel = document.getElementById(`${timeframe}-summary`);
    if (!panel) return;

    const listItems = panel.querySelectorAll('.sales-list-group li:not(.sales-list-header)');
    let grandTotal = 0;

    listItems.forEach(row => {
        const columns = row.querySelectorAll('span');
        if (columns.length < 5) return;

        const productName = columns[1].textContent.toUpperCase().trim();

        if (summaryMap[productName]) {
            const data = summaryMap[productName];
            columns[3].textContent = data.qty;
            columns[4].textContent = `₱${data.sales.toFixed(2)}`;
            grandTotal += data.sales;
        }
    });

    const footerTotal = panel.querySelector('.summary-total-footer span');
    if (footerTotal) {
        footerTotal.textContent = `₱${grandTotal.toFixed(2)}`;
    }
}

let midnightTimer = null;
function setupMidnightReset() {
    if (midnightTimer) clearTimeout(midnightTimer);

    const now = new Date();
    const midnight = new Date();
    
    midnight.setHours(24, 0, 0, 0);
    
    const timeUntilMidnight = midnight.getTime() - now.getTime();
    
    midnightTimer = setTimeout(() => {
        loadAllSalesSummaries();
        setupMidnightReset();
    }, timeUntilMidnight);
}