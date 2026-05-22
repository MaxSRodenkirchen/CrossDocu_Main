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

    function scrollToPage(event) {
        if (event.deltaY > 0) {
            goToPage(currentPage + 1);
        } else if (event.deltaY < 0) {
            goToPage(currentPage - 1);
        }
    }

    container.addEventListener("wheel", scrollToPage);

    // Keyboard navigation
    window.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
            goToPage(currentPage + 1);
        } else if (event.key === "ArrowLeft") {
            goToPage(currentPage - 1);
        }
    });

    // Expose functions for buttons
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

    // Initialize first page state
    goToPage(currentPage);
}