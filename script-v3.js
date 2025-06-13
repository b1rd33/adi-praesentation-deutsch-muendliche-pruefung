let currentSlide = 1;
const totalSlides = 15;
let slideCache = {};

// Initialize presentation
document.addEventListener('DOMContentLoaded', function() {
    loadSlide(1);
    updateNavigationState();
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Preload adjacent slides
    preloadAdjacentSlides();
});

// Load a specific slide
async function loadSlide(slideNumber) {
    const container = document.getElementById('slideContainer');
    
    // Check cache first
    if (slideCache[slideNumber]) {
        container.innerHTML = slideCache[slideNumber];
        updateProgressBar();
        return;
    }
    
    // Show loading state
    container.innerHTML = '<div class="loading">Folie wird geladen</div>';
    
    try {
        const response = await fetch(`slides/slide-${String(slideNumber).padStart(2, '0')}.html`);
        if (!response.ok) {
            throw new Error('Slide not found');
        }
        
        const content = await response.text();
        slideCache[slideNumber] = content;
        container.innerHTML = content;
        
        // Add slide class for styling
        container.classList.add('slide', 'active');
        
        updateProgressBar();
        preloadAdjacentSlides();
        
    } catch (error) {
        container.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100%; text-align: center;">
                <div>
                    <h2 style="color: var(--brown-primary); margin-bottom: 20px;">Folie ${slideNumber} nicht gefunden</h2>
                    <p style="color: #666;">Diese Folie ist noch nicht erstellt.</p>
                </div>
            </div>
        `;
    }
}

// Preload adjacent slides for smooth navigation
function preloadAdjacentSlides() {
    const next = currentSlide + 1;
    const prev = currentSlide - 1;
    
    if (next <= totalSlides && !slideCache[next]) {
        fetch(`slides/slide-${String(next).padStart(2, '0')}.html`)
            .then(response => response.text())
            .then(content => slideCache[next] = content)
            .catch(() => {}); // Silent fail for missing slides
    }
    
    if (prev >= 1 && !slideCache[prev]) {
        fetch(`slides/slide-${String(prev).padStart(2, '0')}.html`)
            .then(response => response.text())
            .then(content => slideCache[prev] = content)
            .catch(() => {}); // Silent fail for missing slides
    }
}

// Navigation functions
function nextSlide() {
    if (currentSlide < totalSlides) {
        currentSlide++;
        loadSlide(currentSlide);
        updateNavigationState();
    }
}

function previousSlide() {
    if (currentSlide > 1) {
        currentSlide--;
        loadSlide(currentSlide);
        updateNavigationState();
    }
}

function goToSlide(slideNumber) {
    if (slideNumber >= 1 && slideNumber <= totalSlides) {
        currentSlide = slideNumber;
        loadSlide(currentSlide);
        updateNavigationState();
    }
}

// Update navigation state
function updateNavigationState() {
    const slideNumberElement = document.getElementById('slideNumber');
    slideNumberElement.textContent = `${currentSlide} / ${totalSlides}`;
    
    // Update button states
    const prevButton = document.querySelector('button[onclick="previousSlide()"]');
    const nextButton = document.querySelector('button[onclick="nextSlide()"]');
    
    prevButton.disabled = currentSlide === 1;
    nextButton.disabled = currentSlide === totalSlides;
    
    // Style disabled buttons
    if (prevButton.disabled) {
        prevButton.style.opacity = '0.5';
        prevButton.style.cursor = 'not-allowed';
    } else {
        prevButton.style.opacity = '1';
        prevButton.style.cursor = 'pointer';
    }
    
    if (nextButton.disabled) {
        nextButton.style.opacity = '0.5';
        nextButton.style.cursor = 'not-allowed';
    } else {
        nextButton.style.opacity = '1';
        nextButton.style.cursor = 'pointer';
    }
}

// Update progress bar
function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progress = (currentSlide / totalSlides) * 100;
    progressBar.style.width = progress + '%';
}

// Keyboard navigation
function handleKeyboardNavigation(e) {
    switch(e.key) {
        case 'ArrowLeft':
            previousSlide();
            break;
        case 'ArrowRight':
            nextSlide();
            break;
        case 'Home':
            goToSlide(1);
            break;
        case 'End':
            goToSlide(totalSlides);
            break;
        case 'f':
        case 'F':
            if (!e.ctrlKey && !e.metaKey) {
                toggleFullscreen();
            }
            break;
    }
}

// Fullscreen functionality
function toggleFullscreen() {
    const elem = document.documentElement;
    
    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// Print functionality
function printPresentation() {
    window.print();
}

// Show print instructions
function showPrintInstructions() {
    alert(`Safari Druck-Anleitung:
    
1. Klicken Sie auf "PDF Export"
2. Im Druckdialog:
   - Format: A4
   - Ausrichtung: Querformat
   - Skalierung: 100%
   - Ränder: Minimal
3. Klicken Sie auf "PDF" > "Als PDF sichern"
4. Speichern Sie die Datei

Tipp: Die Präsentation ist für A4 Querformat optimiert.`);
}