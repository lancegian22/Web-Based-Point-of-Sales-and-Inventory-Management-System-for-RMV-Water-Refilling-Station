const BackButton = document.getElementById('BackButton');
const viewStocksButton = document.getElementById('ViewStocksButton');
const addStocksButton = document.getElementById('AddStocksButton');
const editStocksButton = document.getElementById('EditStocksButton');
const deleteStocksButton = document.getElementById('DeleteStocksButton');

BackButton.addEventListener('click', function() {
    window.location.href = 'index.html';
});

viewStocksButton.addEventListener('click', function() {
    window.location.href = 'view_stocks.html';
});

addStocksButton.addEventListener('click', function() {
    window.location.href = 'add_stocks.html';
});

editStocksButton.addEventListener('click', function() {
    window.location.href = 'edit_stocks.html';
});

deleteStocksButton.addEventListener('click', function() {
    window.location.href = 'delete_stocks.html';
});