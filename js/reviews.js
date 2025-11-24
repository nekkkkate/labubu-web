class ReviewsManager {
    constructor() {
        this.baseUrl = 'https://jsonplaceholder.typicode.com';
        this.reviewsContainer = document.getElementById('reviews-container');
        this.preloader = document.getElementById('reviews-preloader');
        this.errorContainer = document.getElementById('reviews-error');
        this.errorText = document.getElementById('error-text');
        this.reviewTemplate = document.getElementById('review-template');

        this.userReviews = JSON.parse(localStorage.getItem('labubu_user_reviews')) || [];
        this.currentRating = 5;

        this.init();
    }

    init() {
        this.displayAllReviews();
        this.loadReviews();

        document.getElementById('load-reviews-btn').addEventListener('click', () => {
            this.loadReviews();
        });

        document.getElementById('filter-reviews-btn').addEventListener('click', () => {
            this.loadRandomReviews();
        });

        this.initReviewForm();
    }

    initReviewForm() {
        const stars = document.querySelectorAll('.star');
        const ratingValue = document.getElementById('rating-value');
        const submitBtn = document.getElementById('submit-review-btn');

        stars.forEach(star => {
            const starRating = parseInt(star.dataset.rating);
            star.classList.toggle('active', starRating <= this.currentRating);
        });

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.dataset.rating);
                this.currentRating = rating;
                ratingValue.textContent = rating;

                stars.forEach(s => {
                    const starRating = parseInt(s.dataset.rating);
                    s.classList.toggle('active', starRating <= rating);
                });
            });
        });

        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.submitUserReview();
        });
    }

    submitUserReview() {
        const nameInput = document.getElementById('review-name');
        const textInput = document.getElementById('review-text');

        const name = nameInput.value.trim();
        const text = textInput.value.trim();

        if (!name) {
            this.showNotification('Пожалуйста, введите ваше имя', 'warning');
            nameInput.focus();
            return;
        }

        if (!text) {
            this.showNotification('Пожалуйста, напишите ваш отзыв', 'warning');
            textInput.focus();
            return;
        }

        if (text.length < 10) {
            this.showNotification('Отзыв должен содержать хотя бы 10 символов', 'warning');
            textInput.focus();
            return;
        }

        const newReview = {
            id: Date.now(),
            user: {
                name: name,
                email: 'пользователь@labubu.ru',
                id: 'user_' + Date.now()
            },
            text: text,
            rating: this.currentRating,
            date: new Date().toLocaleDateString('ru-RU'),
            isUserReview: true
        };

        this.userReviews.unshift(newReview);
        localStorage.setItem('labubu_user_reviews', JSON.stringify(this.userReviews));

        this.showNotification('Ваш отзыв успешно опубликован!', 'success', 4000);

        nameInput.value = '';
        textInput.value = '';

        this.currentRating = 5;
        document.getElementById('rating-value').textContent = '5';

        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            const starRating = parseInt(star.dataset.rating);
            star.classList.toggle('active', starRating <= 5);
        });

        this.displayAllReviews();
    }

    async loadReviews(userId = null) {
        this.showPreloader();
        this.hideError();

        try {
            const users = await this.fetchUsers(userId);
            const reviews = await Promise.all(
                users.map(user => this.fetchUserPosts(user))
            );

            this.apiReviews = reviews.flat();
            this.displayAllReviews();

        } catch (error) {
            this.handleError(error);
        } finally {
            this.hidePreloader();
        }
    }

    async loadRandomReviews() {
        const randomUserId = Math.floor(Math.random() * 10) + 1;
        this.loadReviews(randomUserId);
    }

    async fetchUsers(userId = null) {
        const url = userId
            ? `${this.baseUrl}/users/${userId}`
            : `${this.baseUrl}/users?_limit=4`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const users = await response.json();
        return Array.isArray(users) ? users : [users];
    }

    async fetchUserPosts(user) {
        const response = await fetch(`${this.baseUrl}/users/${user.id}/posts?_limit=1`);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const posts = await response.json();

        return posts.map(post => ({
            user: user,
            text: post.body,
            rating: Math.floor(Math.random() * 3) + 3,
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
            isUserReview: false
        }));
    }

    displayAllReviews() {
        this.reviewsContainer.innerHTML = '';

        this.userReviews.forEach(review => {
            const reviewElement = this.createReviewElement(review);
            reviewElement.classList.add('user-review', 'new-review');
            this.reviewsContainer.appendChild(reviewElement);
        });

        if (this.apiReviews && this.apiReviews.length > 0) {
            this.apiReviews.forEach(review => {
                const reviewElement = this.createReviewElement(review);
                this.reviewsContainer.appendChild(reviewElement);
            });
        }

        if (this.reviewsContainer.children.length === 0) {
            this.showError('Отзывы не найдены');
        }
    }

    createReviewElement(review) {
        const template = this.reviewTemplate.content.cloneNode(true);
        const reviewCard = template.querySelector('.review-card');

        const avatar = reviewCard.querySelector('.review-avatar');
        const name = reviewCard.querySelector('.review-name');
        const email = reviewCard.querySelector('.review-email');
        const text = reviewCard.querySelector('.review-text');
        const rating = reviewCard.querySelector('.review-rating');
        const date = reviewCard.querySelector('.review-date');

        if (review.isUserReview) {
            avatar.src = `https://api.dicebear.com/6.x/bottts/svg?seed=user${review.id}&backgroundColor=ffd1dc`;
        } else {
            avatar.src = `https://api.dicebear.com/6.x/bottts/svg?seed=${review.user.id}`;
        }
        avatar.alt = `Аватар ${review.user.name}`;

        name.textContent = review.user.name;
        email.textContent = review.user.email.toLowerCase();

        if (review.isUserReview) {
            text.textContent = review.text;
        } else {
            text.textContent = this.generateUniqueReviewText(review);
        }

        rating.innerHTML = this.generateRatingStars(review.rating);

        date.textContent = review.date;

        return reviewCard;
    }

    generateUniqueReviewText(review) {
        const labubuThemes = [
            {
                theme: "Волшебный лес",
                phrases: [
                    "Мои Labubu из Волшебного леса просто очаровательны! Каждая фигурка имеет свой характер.",
                    "Коллекция 'Волшебный лес' превзошла все ожидания. Такие милые и детализированные!",
                    "Labubu из этой коллекции стали настоящими хранителями моего рабочего стола."
                ]
            },
            {
                theme: "Космические исследователи",
                phrases: [
                    "Космические Labubu - это нечто! Они как маленькие пришельцы с другой планеты счастья.",
                    "Эта коллекция просто космос! Каждый персонаж уникален и полон загадок.",
                    "Мои космические исследователи Labubu покорили мое сердце. Рекомендую всем!"
                ]
            },
            {
                theme: "Сладкие мечты",
                phrases: [
                    "Labubu из 'Сладких снов' такие милые, что хочется их всех обнять!",
                    "Эта коллекция просто конфетка! Каждая фигурка дарит улыбку.",
                    "Сладкие Labubu создают атмосферу уюта и радости в моем доме."
                ]
            },
            {
                theme: "Морские глубины",
                phrases: [
                    "Морские Labubu невероятно красивы! Цвета и детали просто завораживают.",
                    "Эта коллекция погружает в подводный мир фантазий. Очень качественное исполнение!",
                    "Labubu-обитатели морских глубин стали моей любимой коллекцией."
                ]
            }
        ];

        const emotions = [
            "Испытываю невероятную радость каждый раз, когда смотрю на них!",
            "Это лучшая покупка за последнее время!",
            "Рекомендую всем ценителям милых вещей!",
            "Качество превосходное, никаких нареканий!",
            "Теперь хочу собрать все коллекции Labubu!",
            "Идеальный подарок для подруги/друга!",
            "Создают уютную атмосферу в комнате!"
        ];

        const randomTheme = labubuThemes[Math.floor(Math.random() * labubuThemes.length)];
        const randomPhrase = randomTheme.phrases[Math.floor(Math.random() * randomTheme.phrases.length)];
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];

        return `${randomPhrase} ${randomEmotion}`;
    }

    generateRatingStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<span class="rating-star">★</span>';
            } else {
                stars += '<span class="rating-star empty">★</span>';
            }
        }
        return stars;
    }

    showNotification(message, type = 'info', duration = 3000) {
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

    showPreloader() {
        if (this.preloader) {
            this.preloader.style.display = 'flex';
        }
    }

    hidePreloader() {
        if (this.preloader) {
            this.preloader.style.display = 'none';
        }
    }

    showError(message) {
        if (this.errorContainer && this.errorText) {
            this.errorText.textContent = message;
            this.errorContainer.style.display = 'block';
        }
    }

    hideError() {
        if (this.errorContainer) {
            this.errorContainer.style.display = 'none';
        }
    }

    handleError(error) {
        console.error('Ошибка загрузки отзывов:', error);

        let errorMessage = 'Не удалось загрузить отзывы. ';

        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage += 'Проверьте подключение к интернету.';
        } else if (error.message.includes('404')) {
            errorMessage += 'Сервер временно недоступен.';
        } else if (error.message.includes('500')) {
            errorMessage += 'Ошибка на сервере. Попробуйте позже.';
        } else {
            errorMessage += 'Попробуйте обновить страницу.';
        }

        this.showError(errorMessage);

        this.showNotification(errorMessage, 'error', 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ReviewsManager();
});

function loadReviews() {
    const manager = new ReviewsManager();
    manager.loadReviews();
}