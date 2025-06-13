let currentSlide = 1;
let totalSlides = 1;

function updateSlideNumber() {
    document.getElementById('slideNumber').textContent = `${currentSlide} / ${totalSlides}`;
    updateProgressBar();
}

function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progress = (currentSlide / totalSlides) * 100;
    progressBar.style.width = `${progress}%`;
}

function showSlide(n) {
    const slides = document.querySelectorAll('.slide');
    totalSlides = slides.length;
    
    if (n > totalSlides) {
        currentSlide = 1;
    }
    if (n < 1) {
        currentSlide = totalSlides;
    }
    
    slides.forEach(slide => slide.classList.remove('active'));
    slides[currentSlide - 1].classList.add('active');
    
    updateSlideNumber();
}

function nextSlide() {
    showSlide(currentSlide += 1);
}

function previousSlide() {
    showSlide(currentSlide -= 1);
}

function toggleFullscreen() {
    const elem = document.querySelector('.presentation-container');
    
    if (!document.fullscreenElement) {
        elem.requestFullscreen().catch(err => {
            alert(`Fehler beim Aktivieren des Vollbildmodus: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        previousSlide();
    } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
    } else if (e.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen();
    }
});

// Touch navigation for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        nextSlide();
    }
    if (touchEndX > touchStartX + 50) {
        previousSlide();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    totalSlides = document.querySelectorAll('.slide').length;
    updateSlideNumber();
});