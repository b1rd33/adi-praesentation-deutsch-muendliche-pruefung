// Enhanced print functionality for PDF export - Safari optimized
function preparePrintView() {
    // Detect Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    // Add print mode class to body
    document.body.classList.add('print-mode');
    if (isSafari) {
        document.body.classList.add('safari-print');
    }
    
    // Store current state
    window.printOriginalSlide = currentSlide;
    
    // Get all slides and presentation elements
    const slides = document.querySelectorAll('.slide');
    const presentationWrapper = document.querySelector('.presentation-wrapper');
    const presentationContainer = document.querySelector('.presentation-container');
    
    // For Safari, we'll use a different approach
    if (isSafari) {
        // Hide wrapper background
        presentationWrapper.style.background = 'white';
        
        // Make all slides visible in sequence
        slides.forEach((slide, index) => {
            slide.classList.add('print-ready');
            slide.style.display = 'block';
            slide.style.position = 'relative';
            slide.style.pageBreakAfter = index < slides.length - 1 ? 'always' : 'auto';
            slide.style.pageBreakInside = 'avoid';
            slide.style.marginBottom = '20mm';
        });
        
        // Adjust container for print
        presentationContainer.style.width = '297mm';
        presentationContainer.style.height = 'auto';
        presentationContainer.style.overflow = 'visible';
        presentationContainer.style.boxShadow = 'none';
    } else {
        // Original method for Chrome/Firefox
        const printContainer = document.createElement('div');
        printContainer.className = 'print-container';
        printContainer.style.cssText = 'width: 297mm; margin: 0 auto; background: white;';
        
        slides.forEach((slide, index) => {
            const slideWrapper = document.createElement('div');
            slideWrapper.className = 'print-page';
            slideWrapper.style.cssText = `
                width: 297mm;
                height: 210mm;
                margin: 0;
                padding: 0;
                page-break-after: ${index === slides.length - 1 ? 'auto' : 'always'};
                page-break-inside: avoid;
                position: relative;
                background: white;
                overflow: hidden;
            `;
            
            const slideClone = slide.cloneNode(true);
            slideClone.classList.add('print-slide');
            slideClone.classList.remove('active');
            slideClone.style.display = 'flex';
            slideClone.style.width = '100%';
            slideClone.style.height = '100%';
            
            slideWrapper.appendChild(slideClone);
            printContainer.appendChild(slideWrapper);
        });
        
        presentationContainer.style.display = 'none';
        document.body.appendChild(printContainer);
    }
}

function exitPrintView() {
    // Remove print mode classes
    document.body.classList.remove('print-mode', 'safari-print');
    
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isSafari) {
        // Restore Safari-specific changes
        const slides = document.querySelectorAll('.slide');
        const presentationWrapper = document.querySelector('.presentation-wrapper');
        const presentationContainer = document.querySelector('.presentation-container');
        
        // Reset wrapper
        presentationWrapper.style.background = '';
        
        // Reset container
        presentationContainer.style.width = '';
        presentationContainer.style.height = '';
        presentationContainer.style.overflow = '';
        presentationContainer.style.boxShadow = '';
        
        // Reset slides
        slides.forEach(slide => {
            slide.classList.remove('print-ready');
            slide.style.display = '';
            slide.style.position = '';
            slide.style.pageBreakAfter = '';
            slide.style.pageBreakInside = '';
            slide.style.marginBottom = '';
        });
        
        // Restore original slide
        if (window.printOriginalSlide) {
            showSlide(window.printOriginalSlide);
        }
    } else {
        // Chrome/Firefox cleanup
        const printContainer = document.querySelector('.print-container');
        if (printContainer) {
            printContainer.remove();
        }
        
        const presentationContainer = document.querySelector('.presentation-container');
        if (presentationContainer) {
            presentationContainer.style.display = '';
        }
        
        // Reset to current slide view
        if (typeof showSlide === 'function' && typeof currentSlide !== 'undefined') {
            showSlide(currentSlide);
        }
    }
}

// Override default print behavior
window.addEventListener('beforeprint', () => {
    preparePrintView();
});

window.addEventListener('afterprint', () => {
    exitPrintView();
});

// Custom print function with better timing
function printPresentation() {
    preparePrintView();
    
    // Give browser time to render the print view
    setTimeout(() => {
        window.print();
        
        // Ensure cleanup even if user cancels print dialog
        setTimeout(() => {
            if (document.body.classList.contains('print-mode')) {
                exitPrintView();
            }
        }, 1000);
    }, 300);
}