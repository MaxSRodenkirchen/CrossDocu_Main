import { Previewer } from "/js/paged.esm.js";
import { fitPage } from "/js/fitPage.js";
import { switchPages } from "/js/slidesUI.js";

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

  const content = document.querySelector("#content");

  if (viewMode === "print") {
    const previewer = new Previewer();
    previewer
      .preview(
        document.querySelector("#templateContent").content,
        ["/styles/printPreview.css"],
        content,
      )
      .then((flow) => {
        console.log("Print preview rendered", flow);
        fitPage();
        window.addEventListener("resize", fitPage);
      });
  } else if (viewMode === "slide") {
    const previewer = new Previewer();
    previewer
      .preview(
        document.querySelector("#templateContent").content,
        ["/styles/slidePreview.css"],
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
          targetPage.style.transform = `rotate(${rdn}deg)`;
          console.log(rdn);
        }
      });
  } else {
    const templateSource = document.querySelector("#templateSource").innerHTML;
    content.innerHTML = templateSource;
    content.style.overflow = "scroll";

    // add webView.css
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "/styles/webView.css";
    document.head.appendChild(link);
  }
}
