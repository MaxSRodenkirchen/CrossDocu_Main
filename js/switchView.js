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

    history.pushState({}, "", url)

    setView();
}

// Global 
window.switchView = switchView;

export function setView() {


    const params = new URLSearchParams(window.location.search);
    const viewMode = params.get('view');

    document.querySelector("#content").innerHTML = ""

    if (viewMode === 'print') {
        const previewer = new Previewer();
        previewer
            .preview(
                document.querySelector("#templateContent").content,
                ["/styles/printPreview.css"],
                document.querySelector("#content")
            )
            .then(flow => {
                console.log("preview rendered, total pages", flow.total, { flow });
                fitPage();
                window.addEventListener('resize', fitPage);
                document.querySelector("#content").contentEditable = "true";

            });

    } else if (viewMode === 'slide') {
        const previewer = new Previewer();
        previewer
            .preview(
                document.querySelector("#templateContent").content,
                ["/styles/slidePreview.css"],
                document.querySelector("#content")
            )
            .then(flow => {

                console.log("preview rendered, total pages", flow.total, { flow });
                fitPage();
                window.addEventListener('resize', fitPage);
                document.querySelector("#content").contentEditable = "true";


                switchPages(flow.total);

                
            });

    } else {
        const templateContent = document.querySelector('#templateSource').innerHTML;
        const content = document.querySelector('#content');
        content.innerHTML = templateContent;

        // Paged.js Cleanup: Entferne die Styles, die Paged.js in den <head> geschrieben hat
        document.querySelectorAll('style[data-pagedjs-inserted]').forEach(style => style.remove());

        // Manche Paged.js Versionen vergeben auch andere IDs, wir löschen sicherheitshalber alle pagedjs-Styles:
        document.querySelectorAll('style').forEach(style => {
            if (style.innerHTML.includes('pagedjs') || style.getAttribute('data-pagedjs-inserted')) {
                style.remove();
            }
        });
    }

};

