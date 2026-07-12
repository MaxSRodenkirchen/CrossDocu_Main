import { fitPage } from "./fitPage.js";

export function initSidebarToggle() {
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        document.body.classList.add('sidebar-collapsed');
    }

    const btn = document.getElementById('toggleSidebarButton');
    if (btn) {
        btn.onclick = () => {
            const collapsed = document.body.classList.toggle('sidebar-collapsed');
            localStorage.setItem('sidebarCollapsed', collapsed);
            
            let start = performance.now();
            function step() {
                fitPage();
                if (performance.now() - start < 350) { // match 0.3s CSS transition
                    requestAnimationFrame(step);
                }
            }
            requestAnimationFrame(step);
        };
    }
}

export function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchList = document.getElementById('search');

    if (!searchInput || !searchList) return;

    const items = searchList.querySelectorAll('.contentLink');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Prevent accordion toggle when clicking the input
    searchInput.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Ctrl+O / Cmd+O Shortcut
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
            e.preventDefault(); // Prevent default browser file open

            // Ensure the search accordion is open
            if (!searchList.classList.contains('active')) {
                const titleContainer = searchList.querySelector('.aListTitle');
                if (titleContainer) titleContainer.click();
            } else {
                // If already open, just focus
                searchInput.focus();
            }
        }
    });
}

export function openLists() {
    const aLists = document.querySelectorAll('.aList');
    const activeListIdentifier = localStorage.getItem('activeAccordionList');

    function updateStates() {
        const hasActive = Array.from(aLists).some(l => l.classList.contains('active'));
        aLists.forEach(list => {
            if (hasActive) {
                if (!list.classList.contains('active')) {
                    list.classList.add('hide');
                    list.classList.remove('default');
                } else {
                    list.classList.remove('hide');
                    list.classList.remove('default');
                }
            } else {
                list.classList.remove('hide');
                list.classList.remove('active');
                list.classList.add('default');
            }
        });
    }

    aLists.forEach(list => {
        const contentList = list.querySelector('.listOfContent');
        const titleElement = list.querySelector('.aListTitle h3');
        const titleContainer = list.querySelector('.aListTitle');
        const identifier = titleElement ? titleElement.textContent.trim() : null;

        // Restore state from localStorage
        if (identifier && activeListIdentifier === identifier) {
            list.classList.add('active');
            if (contentList) contentList.style.display = "block";
        } else {
            list.classList.remove('active');
            if (contentList) contentList.style.display = "none";
        }

        if (titleContainer) {
            titleContainer.addEventListener('click', function (e) {
                if (e.target.closest('a')) return;

                const isCurrentlyActive = list.classList.contains('active');

                // Close all lists
                aLists.forEach(otherList => {
                    otherList.classList.remove('active');
                    const otherContent = otherList.querySelector('.listOfContent');
                    if (otherContent) otherContent.style.display = "none";
                });

                // If it wasn't active before, open it and save to localStorage
                if (!isCurrentlyActive) {
                    list.classList.add('active');
                    if (contentList) contentList.style.display = "block";
                    if (identifier) localStorage.setItem('activeAccordionList', identifier);

                    if (list.id === 'search') {
                        const searchInput = document.getElementById('searchInput');
                        if (searchInput) setTimeout(() => searchInput.focus(), 50);
                    }
                } else {
                    // If it was active, it's now closed, so clear localStorage
                    localStorage.removeItem('activeAccordionList');
                }

                updateStates();
            });
        }
    });

    // Initiale Zustände setzen (z.B. aus dem localStorage)
    updateStates();
}

export function activeLink() {
    const currentPath = decodeURI(window.location.pathname);
    const contentLinks = document.querySelectorAll('.contentLink');
    const allALists = document.querySelectorAll('.aList');

    allALists.forEach(list => list.classList.remove('containsActive'));

    contentLinks.forEach(linkContainer => {
        const link = linkContainer.querySelector('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) {
            linkContainer.classList.remove('active');
            return;
        }

        try {
            const linkPath = decodeURI(new URL(link.href).pathname);
            if (linkPath === currentPath || linkPath === currentPath + '/' || linkPath + '/' === currentPath) {
                linkContainer.classList.add('active');
                const parentList = linkContainer.closest('.aList');
                if (parentList) {
                    parentList.classList.add('containsActive');
                }
                setTimeout(() => {
                    linkContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            } else {
                linkContainer.classList.remove('active');
            }
        } catch (e) {
            linkContainer.classList.remove('active');
        }
    });

    // Close active aTagList when clicking an internalLink in midContainer
    const midContainer = document.getElementById('midContainer');
    if (midContainer) {
        midContainer.addEventListener('click', (e) => {
            const internalLink = e.target.closest('.internalLink');
            if (internalLink) {
                const activeTagList = document.querySelector('.aTagList.active');
                if (activeTagList) {
                    activeTagList.classList.remove('active');
                    const contentList = activeTagList.querySelector('.listOfContent');
                    if (contentList) contentList.style.display = "none";

                    // Check if the currently saved accordion list is this tag list's identifier
                    const titleElement = activeTagList.querySelector('.aListTitle h3');
                    if (titleElement) {
                        const identifier = titleElement.textContent.trim();
                        if (localStorage.getItem('activeAccordionList') === identifier) {
                            localStorage.removeItem('activeAccordionList');
                        }
                    }
                }
            }
        });
    }
}

