function addToStorage(itemName, itemImage) {
    let quantity = parseInt(document.getElementById("qty-display-" + itemName).textContent);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existing = cart.find(item => item.name === itemName);
    if (existing) {
        existing.quantity += quantity;
    } else {
        const button = document.querySelector(`button[onclick*="addToStorage('${itemName}'"]`);
        const title = button ? button.closest('.collection-item').querySelector('h3').textContent : itemName;

        cart.push({
            name: itemName,
            image: itemImage,
            quantity: quantity,
            title: title
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    const addButton = document.querySelector(`button[onclick*="addToStorage('${itemName}'"]`);
    if (addButton) {
        addButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            addButton.style.transform = '';
        }, 150);
    }

    showNotification(`Добавлено в корзину: ${itemName} × ${quantity}`, 'success');

    console.log('Текущая корзина:', JSON.parse(localStorage.getItem("cart")));
}

function updateCollectionQuantity(itemName, change) {
    const displayElement = document.getElementById("qty-display-" + itemName);
    let currentQuantity = parseInt(displayElement.textContent);

    let newQuantity = currentQuantity + change;

    if (newQuantity < 1) {
        newQuantity = 1;
    }

    if (newQuantity > 99) {
        newQuantity = 99;
    }

    displayElement.textContent = newQuantity;
}