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

        const mocControls = document.getElementById('mocControls');

        if (activeMocUrl) {
            const activeContainer = document.querySelector(`.sidebar-group[data-moc-url="${activeMocUrl}"]`);
            if (activeContainer) {
                activeContainer.style.display = 'block';
                if (mocControls) mocControls.style.display = 'flex';
                return;
            }
        }

        const defaultSidebar = document.getElementById('sidebar-default');
        if (defaultSidebar) {
            defaultSidebar.style.display = 'block';
        }
        if (mocControls) mocControls.style.display = 'none';
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

    window.navigateMoc = function (direction) {
        const activeMocUrl = localStorage.orderedContent;
        if (!activeMocUrl) return;

        const group = document.querySelector(`.sidebar-group[data-moc-url="${activeMocUrl}"]`);
        if (!group || group.style.display === 'none') return;

        const links = Array.from(group.querySelectorAll('a'));
        if (links.length === 0) return;

        const currentPath = decodeURI(window.location.pathname);
        let currentIndex = links.findIndex(link => {
            const linkPath = decodeURI(new URL(link.href).pathname);
            return linkPath === currentPath || linkPath === currentPath + '/' || linkPath + '/' === currentPath;
        });

        let targetIndex = 0;
        if (currentIndex !== -1) {
            targetIndex = currentIndex + direction;
        } else {
            targetIndex = direction > 0 ? 0 : links.length - 1;
        }

        if (targetIndex >= 0 && targetIndex < links.length) {
            window.location.href = links[targetIndex].href;
        }
    };

    window.addEventListener('keydown', (event) => {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            navigateMoc(-1);
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            navigateMoc(1);
        }
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
        // Zuerst zum entsprechenden Tag wechseln
        window.switchTag(tag);
        
        // Sicherstellen, dass das Tag-Modul in der Sidebar geöffnet ist
        const btnToggleTags = document.getElementById('btnToggleTags');
        if (btnToggleTags && !btnToggleTags.classList.contains('active')) {
            btnToggleTags.click();
        }
    };

    updateTagVisibility();
    highlightCurrentPage();
}

export function initSearch() {
    // Currently empty
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
}
