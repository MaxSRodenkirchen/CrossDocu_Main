export function switchPages(totalPages, currentPage = 1) {
    let container = document.getElementById("content");

    function scrollToPage(event) {
        if (currentPage < totalPages && event.deltaY > 0) {
            currentPage++;
        } else if (currentPage > 1 && event.deltaY < 0) {
            currentPage--;
        }

        const targetPage = document.querySelector(`#page-${currentPage}`);
        if (targetPage) {
            targetPage.scrollIntoView();
        }
    }

    container.addEventListener("wheel", scrollToPage);
}