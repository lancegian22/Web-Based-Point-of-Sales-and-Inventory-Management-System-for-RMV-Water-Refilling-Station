const BackButton = document.getElementById('BackButton');
const dailySalesSummaryButton = document.getElementById('DailySalesSummaryButton');
const weeklySalesSummaryButton = document.getElementById('WeeklySalesSummaryButton');
const monthlySalesSummaryButton = document.getElementById('MonthlySalesSummaryButton');
const yearlySalesSummaryButton = document.getElementById('YearlySalesSummaryButton');


BackButton.addEventListener('click', function() {
    window.location.href = 'index.html';
});


dailySalesSummaryButton.addEventListener('click', function() {
    window.location.href = 'daily_sales_summary.html';
});

weeklySalesSummaryButton.addEventListener('click', function() {
    window.location.href = 'weekly_sales_summary.html';
});

monthlySalesSummaryButton.addEventListener('click', function() {
    window.location.href = 'monthly_sales_summary.html';
});

yearlySalesSummaryButton.addEventListener('click', function() {
    window.location.href = 'yearly_sales_summary.html';
});