function openModal(src, caption) {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');

    if (modal && modalImg && modalCaption) {
        modal.style.display = 'block';
        modalImg.src = src;
        modalCaption.textContent = caption;
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

if (document.getElementById('modal')) {
    window.onclick = function(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            closeModal();
        }
    }
}


function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icons = {
        success: 'gif/ok.gif',
        info: 'gif/info.gif',
        warning: 'gif/warning.gif',
        error: 'gif/error.gif'
    };

    const iconPath = icons[type] || icons.info;

    notification.innerHTML = `
        <div class="notification-content">
            <img src="${iconPath}" alt="${type}" class="notification-icon">
            <span class="notification-message">${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }, duration);

    notification.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    });

}

function showConfirm(message, confirmCallback, cancelCallback) {
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
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;

    dialog.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
        <div style="margin-bottom: 1rem;">
            <img src="gif/sure.gif" alt="Подтверждение" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
        </div>
        <h3 style="font-family: 'Amatic SC', cursive; font-size: 1.8rem; color: #e274e8; margin-bottom: 0.5rem;">Подтверждение</h3>
        <p style="color: #666; line-height: 1.5;">${message}</p>
    </div>
    <div style="display: flex; gap: 1rem; justify-content: center;">
        <button class="btn btn-outline" id="confirm-cancel" style="padding: 0.7rem 1.5rem;">Отмена</button>
        <button class="btn" id="confirm-ok" style="padding: 0.7rem 1.5rem;">ОК</button>
    </div>
`;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    document.getElementById('confirm-ok').addEventListener('click', () => {
        document.body.removeChild(overlay);
        if (confirmCallback) confirmCallback();
    });

    document.getElementById('confirm-cancel').addEventListener('click', () => {
        document.body.removeChild(overlay);
        if (cancelCallback) cancelCallback();
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
            if (cancelCallback) cancelCallback();
        }
    });
}