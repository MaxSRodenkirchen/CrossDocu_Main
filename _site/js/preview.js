import { Previewer } from "/js/paged.esm.js";

const previewer = new Previewer();
previewer
    .preview(
        document.querySelector("#content").content,
        ["/styles/preview.css"],
        document.querySelector("#preview")
    )
    .then(flow => {
        console.log("preview rendered, total pages", flow.total, { flow });
    });
