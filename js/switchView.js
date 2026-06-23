import { Previewer } from "./paged.esm.js";
import { fitPage } from "./fitPage.js";
import { switchPages } from "./slidesUI.js";

export function switchView(mode = "default") {
  localStorage.setItem("currentView", mode);

  let currentView = mode;
  window.currentView = currentView;

  const url = new URL(window.location.href);

  if (mode === "print") {
    url.searchParams.set("view", "print");
  } else if (mode === "slide") {
    url.searchParams.set("view", "slide");
  } else {
    url.searchParams.delete("view");
  }
  // history.pushState({}, "", url)
  window.location.href = url.toString();
}

window.switchView = switchView;

export function setView() {
  const params = new URLSearchParams(window.location.search);
  let viewMode = params.get("view");

  // Wenn die URL einen Parameter hat, speichern wir ihn.
  // Wenn nicht, holen wir uns den zuletzt gespeicherten Modus aus dem localStorage.
  if (viewMode) {
    localStorage.setItem("currentView", viewMode);
  } else {
    viewMode = localStorage.getItem("currentView") || "default";
  }

  document.body.dataset.view = viewMode;

  // Set active class on view mode buttons
  const buttons = document.querySelectorAll(".viewModeButton");
  buttons.forEach(btn => {
      btn.classList.remove("activeViewButton");
      const onclickAttr = btn.getAttribute("onclick") || "";
      if (viewMode === "print" && onclickAttr.includes("print")) {
          btn.classList.add("activeViewButton");
      } else if (viewMode === "slide" && onclickAttr.includes("slide")) {
          btn.classList.add("activeViewButton");
      } else if ((viewMode === "default" || viewMode === "web") && onclickAttr.includes("web")) {
          btn.classList.add("activeViewButton");
      }
  });

  const content = document.querySelector("#content");

  if (viewMode === "print") {
    const previewer = new Previewer();
    previewer
      .preview(
        document.querySelector("#templateContent").content,
        [window.BASE_URL + "styles/printPreview.css"],
        content,
      )
      .then((flow) => {
        console.log("Print preview rendered", flow);
        fitPage();
        window.addEventListener("resize", fitPage);

        let currentPrintPage = 1;
        window.nextSlide = () => {
          const total = document.querySelectorAll(".pagedjs_page").length;
          if (currentPrintPage < total) {
            currentPrintPage++;
            const el = document.getElementById(`page-${currentPrintPage}`);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        };
        window.prevSlide = () => {
          if (currentPrintPage > 1) {
            currentPrintPage--;
            const el = document.getElementById(`page-${currentPrintPage}`);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        };
        initActiveSectionHighlighting();
      });
  } else if (viewMode === "slide") {
    const previewer = new Previewer();
    previewer
      .preview(
        document.querySelector("#templateContent").content,
        [window.BASE_URL + "styles/slidePreview.css"],
        content,
      )
      .then((flow) => {
        console.log("Slide preview rendered", flow);
        fitPage();
        window.addEventListener("resize", fitPage);

        switchPages(flow.total);
        content.style.overflow = "hidden";

        window.totalPages = flow.total;

        for (let i = 1; i <= flow.total; i++) {
          const targetPage = document.querySelector(`#page-${i}`);
          const rdn = (Math.random() - 0.5) * 2;
          // targetPage.style.transform = `rotate(${rdn}deg)`;
        }
        initActiveSectionHighlighting();
      });
  } else {
    const templateSource = document.querySelector("#templateSource").innerHTML;
    content.innerHTML = templateSource;
    content.style.overflow = "scroll";

    // add webView.css
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = window.BASE_URL + "styles/webView.css";
    document.head.appendChild(link);

    window.nextSlide = () => {
      const headings = Array.from(document.querySelectorAll("#content h1, #content h2, #content h3"));
      if (headings.length === 0) return;

      const container = document.getElementById("midContainer") || window;
      const containerTop = container === window ? 0 : container.getBoundingClientRect().top;
      const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gap')) || 60;

      const nextHeading = headings.find(h => {
        const rect = h.getBoundingClientRect();
        return rect.top - containerTop > gap + 10;
      });

      if (nextHeading) {
        nextHeading.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    window.prevSlide = () => {
      const headings = Array.from(document.querySelectorAll("#content h1, #content h2, #content h3"));
      if (headings.length === 0) return;

      const container = document.getElementById("midContainer") || window;
      const containerTop = container === window ? 0 : container.getBoundingClientRect().top;
      const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gap')) || 60;

      const prevHeading = headings.slice().reverse().find(h => {
        const rect = h.getBoundingClientRect();
        return rect.top - containerTop < gap - 10;
      });

      if (prevHeading) {
        prevHeading.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    initActiveSectionHighlighting();
  }
}

function initActiveSectionHighlighting() {
  const sectionsContainer = document.querySelector("#sections");
  if (!sectionsContainer) return;

  const links = sectionsContainer.querySelectorAll("a");
  if (links.length === 0) return;

  // Click handler for smooth scrolling
  sectionsContainer.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    const targetId = decodeURIComponent(href.slice(1));
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    e.preventDefault();

    const viewMode = document.body.dataset.view || "default";

    if (viewMode === "slide") {
      const pageParent = targetEl.closest(".pagedjs_page");
      if (pageParent) {
        const pageId = pageParent.id;
        const pageNum = parseInt(pageId.replace("page-", ""), 10);
        if (window.goToPage && !isNaN(pageNum)) {
          window.goToPage(pageNum);
        } else {
          pageParent.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    } else if (viewMode === "print") {
      const pageParent = targetEl.closest(".pagedjs_page");
      if (pageParent) {
        pageParent.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    history.pushState(null, null, href);

    links.forEach((a) => a.classList.remove("activeSection"));
    link.classList.add("activeSection");
  });

  // Scroll/Intersection tracking
  const targets = [];
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      const el = document.getElementById(decodeURIComponent(href.slice(1)));
      if (el) targets.push(el);
    }
  });

  if (targets.length > 0) {
    const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gap')) || 60;
    
    const observerOptions = {
      root: null,
      rootMargin: `-${gap}px 0px -60% 0px`, // trigger active section near the top boundary
      threshold: 0
    };

    let activeHeading = null;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeHeading = entry.target;
          updateActiveLink();
        }
      });
    }, observerOptions);

    targets.forEach((target) => observer.observe(target));

    function updateActiveLink() {
      if (!activeHeading) return;
      const id = activeHeading.id;
      links.forEach((link) => {
        const href = link.getAttribute("href");
        if (href === `#${id}`) {
          link.classList.add("activeSection");
        } else {
          link.classList.remove("activeSection");
        }
      });
    }
  }
}
