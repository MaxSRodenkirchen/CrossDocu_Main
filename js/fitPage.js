export function fitPage() {

    const pagesContainer = document.querySelector('.pagedjs_pages');
    const firstPage = document.querySelector('.pagedjs_page');
    const container = document.querySelector('#content');

    if (!pagesContainer || !firstPage || !container) return;

    pagesContainer.style.transform = 'scale(1)';
    pagesContainer.style.transformOrigin = 'top left';

    const pageWidth = firstPage.offsetWidth;
    const pageHeight = firstPage.offsetHeight;

    const containerWidth = container.offsetWidth;
    const containerHeight = container.clientHeight;

    const scaleWidth = containerWidth / pageWidth;
    const scaleHeight = containerHeight / pageHeight;

    const scale = Math.min(scaleWidth, scaleHeight);

    pagesContainer.style.transform = `scale(${scale})`;
    pagesContainer.style.setProperty('--slide-scale', scale);
    
    // console.log(container);
}
