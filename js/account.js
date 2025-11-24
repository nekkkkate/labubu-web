function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {
        name: 'Екатерина',
        email: 'labubumail@yandex.ru'
    };

    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');

    if (userName) userName.textContent = userData.name;
    if (userEmail) userEmail.textContent = userData.email;
}

function editAccount() {
    const currentName = document.getElementById('user-name').textContent;
    const currentEmail = document.getElementById('user-email').textContent;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background: linear-gradient(135deg, #fdf8c0, #bdddff);
        padding: 2rem;
        border-radius: 20px;
        border: 3px solid #fbd1ff;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;

    dialog.innerHTML = `
        <h3 style="font-family: 'Amatic SC', cursive; font-size: 2rem; color: #e274e8; text-align: center; margin-bottom: 1.5rem;">Редактировать профиль</h3>
        <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; color: #666;">Имя:</label>
            <input type="text" id="edit-name" value="${currentName}" style="width: 100%; padding: 0.7rem; border: 2px solid #fbd1ff; border-radius: 10px; font-family: 'Poiret One'; font-size: 1rem;">
        </div>
        <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; color: #666;">Email:</label>
            <input type="email" id="edit-email" value="${currentEmail}" style="width: 100%; padding: 0.7rem; border: 2px solid #fbd1ff; border-radius: 10px; font-family: 'Poiret One'; font-size: 1rem;">
        </div>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button class="btn btn-outline" id="edit-cancel" style="padding: 0.7rem 1.5rem;">Отмена</button>
            <button class="btn" id="edit-save" style="padding: 0.7rem 1.5rem;">Сохранить</button>
        </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    document.getElementById('edit-name').focus();

    document.getElementById('edit-save').addEventListener('click', () => {
        const newName = document.getElementById('edit-name').value.trim();
        const newEmail = document.getElementById('edit-email').value.trim();

        if (newName && newEmail) {
            const userData = {
                name: newName,
                email: newEmail
            };

            localStorage.setItem('userData', JSON.stringify(userData));
            loadUserData();
            document.body.removeChild(overlay);
            showNotification('Данные успешно обновлены!', 'success');
        } else {
            showNotification('Пожалуйста, заполните все поля', 'warning');
        }
    });

    document.getElementById('edit-cancel').addEventListener('click', () => {
        document.body.removeChild(overlay);
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
}

function clearOrderHistory() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    if (orders.length === 0) {
        showNotification('История заказов уже пуста', 'info');
        return;
    }

    showConfirm(
        'Вы уверены, что хотите очистить всю историю заказов? Это действие нельзя отменить.',
        function() {
            localStorage.removeItem('orders');
            loadAccount();
            showNotification('История заказов очищена!', 'success');
        }
    );
}

function loadAccount() {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let orderDiv = document.getElementById("orders");
    let clearHistoryBtn = document.getElementById("clear-history-btn");

    if (!orderDiv) return;

    if (orders.length === 0) {
        orderDiv.innerHTML = "<p class='cart-empty'>История заказов пуста</p>";
        if (clearHistoryBtn) clearHistoryBtn.style.display = 'none';
        return;
    }

    if (clearHistoryBtn) clearHistoryBtn.style.display = 'inline-block';

    orders.sort((a, b) => b.id - a.id);

    orderDiv.innerHTML = orders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <h4>Заказ #${order.id}</h4>
                <span class="order-date">${order.date}</span>
            </div>
            <div class="order-details">
                <p><strong>Товаров:</strong> ${order.total} шт.</p>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item-product">
                            <span>${item.title || item.name}</span>
                            <span class="quantity">×${item.quantity}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}