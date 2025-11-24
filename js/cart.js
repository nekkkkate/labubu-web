function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartDiv = document.getElementById("cart");
    let cartTotal = document.getElementById("cart-total");
    let totalCount = document.getElementById("total-count");

    if (!cartDiv) return;

    if (cart.length === 0) {
        cartDiv.innerHTML = '<div class="cart-empty">Ваша корзина пуста:(</div>';
        if (cartTotal) cartTotal.style.display = 'none';
        return;
    }

    cartDiv.innerHTML = '';
    let totalItems = 0;

    cart.forEach((item, index) => {
        totalItems += item.quantity;
        cartDiv.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-image" onclick="openModal('${item.image}', '${item.title || item.name}')">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <h4>${item.title || item.name}</h4>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">−</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <button class="btn btn-small btn-outline" onclick="removeItem(${index})">
                        <img src="gif/octopus.gif" alt="Удалить" class="delete-gif">
                        Удалить
                    </button>
                </div>
            </div>
        `;
    });

    if (totalCount) totalCount.textContent = totalItems;
    if (cartTotal) cartTotal.style.display = 'block';
}

function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart[index]) {
        cart[index].quantity += change;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
            showNotification('Товар удален из корзины', 'info');
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
    }
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemName = cart[index].title || cart[index].name;
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    showNotification(`"${itemName}" удален из корзины`, 'info');
}

function clearCart() {
    if (localStorage.getItem("cart") && JSON.parse(localStorage.getItem("cart")).length > 0) {
        showConfirm(
            "Вы уверены, что хотите очистить корзину?",
            function() {
                localStorage.removeItem("cart");
                loadCart();
                showNotification('Корзина очищена', 'success');
            }
        );
    } else {
        showNotification('Корзина уже пуста', 'info');
    }
}

function placeOrder() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        showNotification('Корзина пуста!', 'warning');
        return;
    }

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    const order = {
        id: Date.now(),
        date: new Date().toLocaleDateString('ru-RU'),
        items: cart,
        total: cart.reduce((sum, item) => sum + item.quantity, 0)
    };
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    localStorage.removeItem("cart");

    showNotification(`Заказ оформлен! Товаров: ${order.total}\nСпасибо за покупку!`, 'success', 5000);
    loadCart();

    if (window.opener) {
        window.opener.location.reload();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
});