export function fitPage() {
    const pagesContainer = document.querySelector('.pagedjs_pages');
    const firstPage = document.querySelector('.pagedjs_page');
    const viewport = document.getElementById('midContainer');

    if (!pagesContainer || !firstPage || !viewport) return;

    pagesContainer.style.transformOrigin = 'top left';

    const viewMode = document.body.dataset.view;

    if (!firstPage.dataset.targetWidth) {
        const computedStyle = window.getComputedStyle(firstPage);
        const marginTop = parseFloat(computedStyle.marginTop) || 0;
        const marginBottom = parseFloat(computedStyle.marginBottom) || 0;
        const marginLeft = parseFloat(computedStyle.marginLeft) || 0;
        const marginRight = parseFloat(computedStyle.marginRight) || 0;

        firstPage.dataset.targetWidth = firstPage.offsetWidth + marginLeft + marginRight;
        firstPage.dataset.targetHeight = firstPage.offsetHeight + marginTop + marginBottom;
        firstPage.dataset.targetPrintWidth = firstPage.offsetWidth * 2;
    }

    let targetWidth = parseFloat(firstPage.dataset.targetWidth);
    const targetHeight = parseFloat(firstPage.dataset.targetHeight);

    if (viewMode === "print") {
        targetWidth = parseFloat(firstPage.dataset.targetPrintWidth);
    }

    const containerWidth = viewport.clientWidth;
    const containerHeight = viewport.clientHeight;

    const scaleWidth = containerWidth / targetWidth;
    const scaleHeight = viewMode === "slide" ? (containerHeight / targetHeight) : Infinity;

    const scale = Math.min(scaleWidth, scaleHeight);

    // Center horizontally in both modes, center vertically only in slide mode
    const scaledWidth = targetWidth * scale;
    const offsetX = Math.max(0, (containerWidth - scaledWidth) / 2);

    if (viewMode === "slide") {
        const scaledHeight = targetHeight * scale;
        const offsetY = Math.max(0, (containerHeight - scaledHeight) / 2);
        
        pagesContainer.style.transform = `translateX(${offsetX}px) scale(${scale})`;
        pagesContainer.style.setProperty('--slide-offset-y', `${offsetY / scale}px`);
    } else {
        pagesContainer.style.transform = `translateX(${offsetX}px) scale(${scale})`;
        pagesContainer.style.removeProperty('--slide-offset-y');
    }

    pagesContainer.style.setProperty('--slide-scale', scale);
}
