// Clean A4 Presentation Script
let currentSlide = 1;
let totalSlides = 1;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    totalSlides = document.querySelectorAll('.slide').length;
    updateProgress();
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
});

function handleKeyPress(e) {
    switch(e.key) {
        case 'ArrowRight':
        case ' ':
            e.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            previousSlide();
            break;
        case 'Home':
            e.preventDefault();
            goToSlide(1);
            break;
        case 'End':
            e.preventDefault();
            goToSlide(totalSlides);
            break;
    }
}

function showSlide(n) {
    const slides = document.querySelectorAll('.slide');
    
    if (n > totalSlides) currentSlide = 1;
    if (n < 1) currentSlide = totalSlides;
    
    slides.forEach(slide => slide.classList.remove('active'));
    slides[currentSlide - 1].classList.add('active');
    
    updateProgress();
}

function nextSlide() {
    showSlide(currentSlide += 1);
}

function previousSlide() {
    showSlide(currentSlide -= 1);
}

function goToSlide(n) {
    currentSlide = n;
    showSlide(currentSlide);
}

function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    const slideNumber = document.getElementById('slideNumber');
    const progress = (currentSlide / totalSlides) * 100;
    progressBar.style.width = `${progress}%`;
    if (slideNumber) {
        slideNumber.textContent = `${currentSlide} / ${totalSlides}`;
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

function showPrintInstructions() {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    const message = isSafari ? 
        `Safari PDF Export Anleitung:\n\n` +
        `1. Klicke auf "PDF Export"\n` +
        `2. In der Druckvorschau:\n` +
        `   • Wähle "PDF" statt Drucker\n` +
        `   • Stelle "Papierformat: A4" ein\n` +
        `   • Wähle "Ausrichtung: Querformat"\n` +
        `   • Aktiviere "Hintergrundbilder drucken"\n` +
        `   • Deaktiviere "Kopf- und Fußzeilen"\n` +
        `3. Klicke auf "PDF sichern"\n\n` +
        `Falls Probleme auftreten:\n` +
        `• Nutze Chrome oder Firefox für besten Export\n` +
        `• Oder exportiere Folien einzeln mit CMD+P`
        :
        `PDF Export Anleitung:\n\n` +
        `1. Klicke auf "PDF Export"\n` +
        `2. Wähle "Als PDF speichern"\n` +
        `3. Stelle sicher, dass:\n` +
        `   • Layout: Querformat\n` +
        `   • Ränder: Keine\n` +
        `   • Hintergrundgrafiken: Aktiviert\n` +
        `4. Klicke auf "Speichern"`;
    
    alert(message);
}

// Touch navigation for tablets
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndX < touchStartX - 50) nextSlide();
    if (touchEndX > touchStartX + 50) previousSlide();
}