export function switchPages(totalPages, currentPage = 1) {
    let container = document.getElementById("content");

    function goToPage(pageNumber) {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            currentPage = pageNumber;
            const targetPage = document.querySelector(`#page-${currentPage}`);
            if (targetPage) {
                targetPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                document.querySelectorAll('.pagedjs_page').forEach(page => {
                    page.classList.remove('active-slide');
                });
                targetPage.classList.add('active-slide');
            }
        }
    }

    let lastWheelTime = 0;
    function scrollToPage(event) {
        const now = Date.now();
        if (now - lastWheelTime < 600) return; // 600ms cooldown
        
        if (event.deltaY > 0) {
            lastWheelTime = now;
            goToPage(currentPage + 1);
        } else if (event.deltaY < 0) {
            lastWheelTime = now;
            goToPage(currentPage - 1);
        }
    }

    container.addEventListener("wheel", scrollToPage);

    // Keyboard navigation
    let lastKeyTime = 0;
    window.addEventListener("keydown", (event) => {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;

        const now = Date.now();
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            if (now - lastKeyTime < 300) return; // 300ms cooldown
            lastKeyTime = now;
            
            if (event.key === "ArrowRight") {
                goToPage(currentPage + 1);
            } else if (event.key === "ArrowLeft") {
                goToPage(currentPage - 1);
            }
        }
    });

    // Expose functions for buttons and external scripts
    window.goToPage = goToPage;
    window.nextSlide = () => goToPage(currentPage + 1);
    window.prevSlide = () => goToPage(currentPage - 1);
    
    // Expose fullscreen toggle
    window.toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.getElementById("mainContainer").requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    // Show slide controls if they exist
    const slideControls = document.getElementById("slideControls");
    if (slideControls) slideControls.style.display = "flex";

    // Pin current slide during resize
    window.addEventListener("resize", () => {
        const targetPage = document.querySelector(`#page-${currentPage}`);
        if (targetPage) {
            targetPage.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
    });

    // Initialize first page state
    goToPage(currentPage);
}