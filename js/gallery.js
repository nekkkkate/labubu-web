const galleryImages = [
    { src: 'images/collection/boo.jpg', caption: 'испугались??' },
    { src: 'images/collection/cuteBoy.jpg', caption: 'ну какой же он милый!' },
    { src: 'images/collection/donuldDuck.jpg', caption: 'мистер Дональд Дак?!' },
    { src: 'images/collection/dreamTeam.jpg', caption: 'не лукавьте - так выглядит счастье:)' },
    { src: 'images/collection/genksta.jpg', caption: 'такое только в кошмарах приснится..' },
    { src: 'images/collection/intelligence.jpg', caption: 'подайте ему чай!' },
    { src: 'images/collection/miumiucor.jpg', caption: 'как насчет парных образов с вашей лабубой?' },
    { src: 'images/collection/photographer.jpg', caption: 'улыбнитесь!' }
];

let currentImageIndex = 0;

function openGalleryModal(index) {
    currentImageIndex = index;
    updateGalleryModal();
    document.getElementById('modal').style.display = 'block';
}

function changeImage(direction) {
    currentImageIndex += direction;

    if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    }

    updateGalleryModal();
}

function updateGalleryModal() {
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const modalCounter = document.getElementById('modal-counter');

    const currentImage = galleryImages[currentImageIndex];

    modalImg.src = currentImage.src;
    modalCaption.textContent = currentImage.caption;
    modalCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;

    modalImg.style.opacity = '0';
    setTimeout(() => {
        modalImg.style.opacity = '1';
    }, 50);
}

document.addEventListener('keydown', function(event) {
    const modal = document.getElementById('modal');
    if (modal && modal.style.display === 'block') {
        if (event.key === 'ArrowLeft') {
            changeImage(-1);
        } else if (event.key === 'ArrowRight') {
            changeImage(1);
        } else if (event.key === 'Escape') {
            closeModal();
        }
    }
});