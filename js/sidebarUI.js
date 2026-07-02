function highlightCurrentPage() {
    const currentPath = decodeURI(window.location.pathname);
    const links = document.querySelectorAll('#orderedContent li a, #tagsContent li a');
    let activeLink = null;

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) {
            link.classList.remove('active');
            return;
        }

        try {
            const linkPath = decodeURI(new URL(link.href).pathname);
            if (linkPath === currentPath || linkPath === currentPath + '/' || linkPath + '/' === currentPath) {
                link.classList.add('active');
                const group = link.closest('.sidebar-group');
                if (group && group.style.display !== 'none') {
                    activeLink = link;
                }
            } else {
                link.classList.remove('active');
            }
        } catch (e) {
            link.classList.remove('active');
        }
    });
}

export function initMoc() {
    function updateMocVisibility() {
        const activeMocUrl = localStorage.orderedContent;

        document.querySelectorAll('.sidebar-group').forEach(group => {
            group.style.display = 'none';
        });

        document.querySelectorAll('button[data-moc-btn-url]').forEach(btn => {
            btn.classList.remove('active-moc');
            if (activeMocUrl && btn.getAttribute('data-moc-btn-url') === activeMocUrl) {
                btn.classList.add('active-moc');
            }
        });


        if (activeMocUrl) {
            const activeContainer = document.querySelector(`.sidebar-group[data-moc-url="${activeMocUrl}"]`);
            if (activeContainer) {
                activeContainer.style.display = 'block';
                return;
            }
        }

        const defaultSidebar = document.getElementById('sidebar-default');
        if (defaultSidebar) {
            defaultSidebar.style.display = 'block';
        }
    }

    window.switchMoc = function (url) {
        localStorage.orderedContent = url;
        updateMocVisibility();
        highlightCurrentPage();
    };

    document.querySelectorAll('.sidebar-group.moc-sidebar-container:not(#sidebar-default) > h1').forEach(h1 => {
        h1.addEventListener('click', () => {
            switchMoc('');
        });
        h1.style.cursor = "pointer";
    });


    updateMocVisibility();
    highlightCurrentPage();
}

export function initTags() {
    function updateTagVisibility() {
        const activeTag = localStorage.activeTag;

        document.querySelectorAll('.tag-sidebar-group').forEach(group => {
            group.style.display = 'none';
        });

        if (activeTag) {
            const activeContainer = document.querySelector(`.tag-sidebar-group[data-tag-name="${activeTag}"]`);
            if (activeContainer) {
                activeContainer.style.display = 'block';
                return;
            }
        }

        const defaultTags = document.getElementById('tags-default');
        if (defaultTags) {
            defaultTags.style.display = 'block';
        }
    }

    window.switchTag = function (tag) {
        localStorage.activeTag = tag;
        updateTagVisibility();
        highlightCurrentPage();
    };

    window.openTagModule = function (tag) {
        const formattedTag = tag.replace(/-/g, ' ');

        // Find the aList with this tag name in the new sidebar
        const tagLists = document.querySelectorAll('.aTagList');
        let targetList = null;
        tagLists.forEach(list => {
            const h3 = list.querySelector('h3');
            if (h3 && h3.textContent.trim() === formattedTag) {
                targetList = list;
            }
        });

        if (targetList) {
            const isCurrentlyActive = targetList.classList.contains('active');

            if (!isCurrentlyActive) {
                const titleContainer = targetList.querySelector('.aListTitle');
                if (titleContainer) {
                    titleContainer.click(); // This will trigger openLists logic
                }
            }

            setTimeout(() => {
                targetList.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        } else {
            // Fallback for old sidebar behavior
            if (typeof window.switchTag === 'function') {
                window.switchTag(tag);
            }
            const btnToggleTags = document.getElementById('btnToggleTags');
            if (btnToggleTags && !btnToggleTags.classList.contains('active')) {
                btnToggleTags.click();
            }
        }
    };

    updateTagVisibility();
    highlightCurrentPage();
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

            // 1. Ensure the left module tab is open
            const btnToggleSearch = document.getElementById('btnToggleSearch');
            if (btnToggleSearch && !btnToggleSearch.classList.contains('active')) {
                btnToggleSearch.click();
            }

            // 2. Ensure the search accordion is open
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

export function updateModules() {
    // Right Module Bar Logic
    const btnToggleSections = document.getElementById('btnToggleSections');
    const btnToggleViewModes = document.getElementById('btnToggleViewModes');
    const sectionsDiv = document.getElementById('sections');
    const viewModeContainer = document.getElementById('viewModeContainer');
    const configSidebarEl = document.getElementById('config');

    function updateConfigSidebarVisibility() {
        if (!sectionsDiv || !viewModeContainer || !configSidebarEl) return;
        const sectionsVisible = window.getComputedStyle(sectionsDiv).display !== 'none';
        const viewModesVisible = window.getComputedStyle(viewModeContainer).display !== 'none';

        if (!sectionsVisible && !viewModesVisible) {
            configSidebarEl.style.display = 'none';
        } else {
            configSidebarEl.style.display = ''; // fallback to stylesheet
        }
    }

    function setupToggle(btn, contentDiv, storageKey, defaultDisplay, updateVisibilityFn, onToggleFn) {
        if (!btn || !contentDiv) return;

        const savedState = localStorage.getItem(storageKey);
        if (savedState !== null) {
            contentDiv.style.display = savedState === 'true' ? defaultDisplay : 'none';
        }

        btn.classList.toggle('active', window.getComputedStyle(contentDiv).display !== 'none');

        btn.addEventListener('click', () => {
            const isCurrentlyVisible = window.getComputedStyle(contentDiv).display !== 'none';
            const newState = !isCurrentlyVisible;
            contentDiv.style.display = newState ? defaultDisplay : 'none';
            btn.classList.toggle('active', newState);
            localStorage.setItem(storageKey, newState);

            if (onToggleFn) onToggleFn(newState);
            if (updateVisibilityFn) updateVisibilityFn();

            window.dispatchEvent(new Event('resize'));
        });
    }

    const sectionsSavedState = localStorage.getItem('module_sections');
    if (sectionsSavedState !== null) {
        localStorage.setItem('module_viewModes', sectionsSavedState);
    }

    setupToggle(btnToggleSections, sectionsDiv, 'module_sections', 'block', updateConfigSidebarVisibility, (newState) => {
        viewModeContainer.style.display = newState ? 'flex' : 'none';
        btnToggleViewModes.classList.toggle('active', newState);
        localStorage.setItem('module_viewModes', newState);
    });

    setupToggle(btnToggleViewModes, viewModeContainer, 'module_viewModes', 'flex', updateConfigSidebarVisibility, (newState) => {
        sectionsDiv.style.display = newState ? 'block' : 'none';
        btnToggleSections.classList.toggle('active', newState);
        localStorage.setItem('module_sections', newState);
    });
    updateConfigSidebarVisibility();

    function syncHover(btn1, btn2) {
        if (!btn1 || !btn2) return;
        btn1.addEventListener('mouseenter', () => btn2.classList.add('hover-sync'));
        btn1.addEventListener('mouseleave', () => btn2.classList.remove('hover-sync'));
        btn2.addEventListener('mouseenter', () => btn1.classList.add('hover-sync'));
        btn2.addEventListener('mouseleave', () => btn1.classList.remove('hover-sync'));
    }
    syncHover(btnToggleSections, btnToggleViewModes);

    // Left Module Bar Logic
    const btnToggleOrdered = document.getElementById('btnToggleOrdered');
    const btnToggleSearch = document.getElementById('btnToggleSearch');
    const btnToggleTags = document.getElementById('btnToggleTags');

    const orderedContentDiv = document.getElementById('orderedContent');
    const searchContentDiv = document.getElementById('searchContent');
    const tagsContentDiv = document.getElementById('tagsContent');

    const mainSidebarEl = document.getElementById('sidebar');

    function updateMainSidebarVisibility() {
        if (!orderedContentDiv || !searchContentDiv || !tagsContentDiv || !mainSidebarEl) return;
        const orderedVisible = window.getComputedStyle(orderedContentDiv).display !== 'none';
        const searchVisible = window.getComputedStyle(searchContentDiv).display !== 'none';
        const tagsVisible = window.getComputedStyle(tagsContentDiv).display !== 'none';

        if (!orderedVisible && !searchVisible && !tagsVisible) {
            mainSidebarEl.style.display = 'none';
        } else {
            mainSidebarEl.style.display = ''; // fallback to stylesheet
        }
    }

    const leftModules = [
        { btn: btnToggleOrdered, content: orderedContentDiv, key: 'module_orderedLists' },
        { btn: btnToggleSearch, content: searchContentDiv, key: 'module_search' },
        { btn: btnToggleTags, content: tagsContentDiv, key: 'module_tags' }
    ];

    function setupExclusiveToggle(modules, updateVisibilityFn) {
        let activeFound = false;

        modules.forEach(mod => {
            if (!mod.btn || !mod.content) return;
            const savedState = localStorage.getItem(mod.key);
            if (savedState === 'true') {
                if (!activeFound) {
                    mod.content.style.display = '';
                    mod.btn.classList.add('active');
                    activeFound = true;
                } else {
                    mod.content.style.display = 'none';
                    mod.btn.classList.remove('active');
                    localStorage.setItem(mod.key, false);
                }
            } else {
                mod.content.style.display = 'none';
                mod.btn.classList.remove('active');
            }
        });

        modules.forEach(mod => {
            if (!mod.btn || !mod.content) return;
            mod.btn.addEventListener('click', () => {
                const isCurrentlyVisible = window.getComputedStyle(mod.content).display !== 'none';

                modules.forEach(m => {
                    if (!m.btn || !m.content) return;
                    m.content.style.display = 'none';
                    m.btn.classList.remove('active');
                    localStorage.setItem(m.key, false);
                });

                if (!isCurrentlyVisible) {
                    mod.content.style.display = '';
                    mod.btn.classList.add('active');
                    localStorage.setItem(mod.key, true);
                }

                if (updateVisibilityFn) updateVisibilityFn();
                window.dispatchEvent(new Event('resize'));
            });
        });
    }

    setupExclusiveToggle(leftModules, updateMainSidebarVisibility);
    updateMainSidebarVisibility();

    function checkResponsiveSidebars() {
        const mainContainer = document.getElementById('mainContainer');
        if (!mainContainer) return;

        if (mainContainer.scrollWidth > mainContainer.clientWidth + 1) {
            const btnToggleViewModes = document.getElementById('btnToggleViewModes');
            const btnToggleSections = document.getElementById('btnToggleSections');

            let closedConfig = false;
            if (btnToggleViewModes && btnToggleViewModes.classList.contains('active')) {
                btnToggleViewModes.click();
                closedConfig = true;
            } else if (btnToggleSections && btnToggleSections.classList.contains('active')) {
                btnToggleSections.click();
                closedConfig = true;
            }

            if (!closedConfig) {
                const btnToggleOrdered = document.getElementById('btnToggleOrdered');
                const btnToggleSearch = document.getElementById('btnToggleSearch');
                const btnToggleTags = document.getElementById('btnToggleTags');

                if (btnToggleOrdered && btnToggleOrdered.classList.contains('active')) {
                    btnToggleOrdered.click();
                } else if (btnToggleSearch && btnToggleSearch.classList.contains('active')) {
                    btnToggleSearch.click();
                } else if (btnToggleTags && btnToggleTags.classList.contains('active')) {
                    btnToggleTags.click();
                }
            }
        }
    }

    window.addEventListener('resize', checkResponsiveSidebars);
    setTimeout(checkResponsiveSidebars, 100);
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

