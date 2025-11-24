(function() {
    'use strict';

    const loadStartTime = performance.timing.navigationStart || Date.now();

    function updateFooterWithLoadTime() {
        const loadEndTime = Date.now();
        const loadTime = loadEndTime - loadStartTime;

        const footer = document.querySelector('footer');
        if (footer) {
            const loadInfo = document.createElement('div');
            loadInfo.className = 'load-time-info';
            loadInfo.innerHTML = `
                <div class="load-time-content">
                    <img src="gif/time.gif" alt="Время загрузки" class="time-gif">
                    <span>Страница загружена за <strong>${loadTime}ms</strong></span>
                </div>
            `;
            footer.appendChild(loadInfo);
        }
    }

    function highlightCurrentPage() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('nav a');

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            const linkPage = linkHref.split('/').pop();

            const currentPageName = currentPage.replace('.html', '');
            const linkPageName = linkPage.replace('.html', '');

            if (currentPageName === linkPageName ||
                (currentPageName === '' && linkPageName === 'index')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function init() {
        updateFooterWithLoadTime();
        highlightCurrentPage();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();