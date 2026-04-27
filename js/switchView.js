import { Previewer } from "/js/paged.esm.js"
import { fitPage } from "/js/fitPage.js";
import { switchPages } from "/js/slidesUI.js";


export function switchView(mode = 'default') {
    const url = new URL(window.location.href);

    if (mode === 'print') {
        url.searchParams.set('view', 'print');
    } else if (mode === 'slide') {
        url.searchParams.set('view', 'slide');
    } else {
        url.searchParams.delete('view');
    }
// history.pushState({}, "", url)
    window.location.href = url.toString();
}


window.switchView = switchView;

export function setView() {
    const params = new URLSearchParams(window.location.search);
    const viewMode = params.get('view');
    const content = document.querySelector("#content");

    // content.contentEditable = "true";

    if (viewMode === 'print') {
        const previewer = new Previewer();
        previewer
            .preview(
                document.querySelector("#templateContent").content,
                ["/styles/printPreview.css"],
                content
            )
            .then(flow => {
                console.log("Print preview rendered", flow);
                fitPage();
                window.addEventListener('resize', fitPage);
            });

    } else if (viewMode === 'slide') {
        const previewer = new Previewer();
        previewer
            .preview(
                document.querySelector("#templateContent").content,
                ["/styles/slidePreview.css"],
                content
            )
            .then(flow => {
                console.log("Slide preview rendered", flow);
                fitPage();
                window.addEventListener('resize', fitPage);
                
                switchPages(flow.total);
                content.style.overflow = "hidden";
            });

    } else {
       
        const templateSource = document.querySelector('#templateSource').innerHTML;
        content.innerHTML = templateSource;
        content.style.overflow = "scroll";

        // add webView.css 
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = '/styles/webView.css';
        document.head.appendChild(link);
    }
};

