import { Handler, registerHandlers } from "/js/paged.esm.js";

class whatever extends Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
  }
  beforeParsed(content) {
    content.querySelectorAll("hr").forEach((h) => {
      h.insertAdjacentHTML(
        "beforebegin",
        `<p class="pd" style="color:red">break</p>`,
      );
      h.remove();
    });
  }
}

registerHandlers(whatever);

class imgFullPage extends Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
  }
  beforeParsed(content) {
    content.querySelectorAll("img").forEach((img) => {
      img.classList.add("paged-fullpage");
      img.style.position = "absolute";
    });
  }

  layoutNode(node) {
    console.log(node.tagName);
    if (node.nodeType == 1 && node.tagName === "EM") {
      console.log(node);
    }
  }
  renderNode(node, sourceNode) {
    console.log(node.tagName);
    if (node.tagName === "EM") {
      console.log(node);
    }
    if (node.classList?.contains("pd")) {
      console.log(node.offsetTop);
      if (node.offsetTop > 600) {
        node.style.fontSize = "3em";
      }
    }
  }

  finalizePage(page) {
    let newpage = this.chunker.addPage();
    console.log(newpage);
    newpage.element
      .querySelector(".pagedjs_page_content")
      .insertAdjacentElement(
        "beforeend",
        page.querySelector(".paged-fullpage"),
      );
    console.log(page);
  }
}

registerHandlers(imgFullPage);
