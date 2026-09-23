    const HomeButton = document.getElementById('HomeButton');
    const BackButton = document.getElementById('BackButton');
    const ConfirmButton = document.getElementById('ConfirmButton');

    HomeButton.addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    BackButton.addEventListener('click', function() {
        window.location.href = 'point_of_sales.html'; 
    });

    ConfirmButton.addEventListener('click', function(event) {
        event.preventDefault();
        const customerName = document.getElementById('customerName').value;
        const containerType = document.getElementById('containerType');
        
        const selectedText = containerType.options[containerType.selectedIndex].text;
        const price = document.getElementById('price').value;
        const quantity = document.getElementById('quantity').value;
        const total = document.getElementById('total').value;

        localStorage.setItem('customerName', customerName);
        localStorage.setItem('containerType', selectedText);
        localStorage.setItem('price', price);
        localStorage.setItem('quantity', quantity);
        localStorage.setItem('total', total);

        let salesLog = JSON.parse(localStorage.getItem('rmv_sales_log')) || [];
        
        const newOrder = {
            id: 'order_' + Date.now(),
            customer: customerName,
            type: selectedText.toUpperCase().trim(),
            price: parseFloat(price) || 0,
            quantity: parseInt(quantity) || 0,
            total: parseFloat(total) || 0,
            timestamp: new Date().toISOString()
        };

        salesLog.push(newOrder);
        localStorage.setItem('rmv_sales_log', JSON.stringify(salesLog));

        window.location.href = 'order_confirmation.html';
    });

    function updatePriceAndTotal() {
        const containerDropdown = document.getElementById('containerType');
        const priceInput = document.getElementById('price');
        const selectedPrice = containerDropdown.value;
        
        if (selectedPrice) {
            priceInput.value = selectedPrice;
        } else {
            priceInput.value = "0";
        }
        calculateTotal();
    }

    function calculateTotal() {
        const price = parseFloat(document.getElementById('price').value) || 0;
        const quantity = parseInt(document.getElementById('quantity').value) || 0;
        const totalInput = document.getElementById('total');
        const total = price * quantity;
        totalInput.value = total;
    }