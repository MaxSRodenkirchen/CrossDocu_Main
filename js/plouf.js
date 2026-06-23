
import "/js/hooktest.js"
import { Previewer } from "/js/paged.esm.js"


window.switchView = switchView;

function switchView(mode = 'default') {

    const url = new URL(window.location.href);

    if (mode === 'print') {
        url.searchParams.set('view', 'print');
    } else {
        url.searchParams.delete('view');
    }

    history.pushState({}, "", url)

    {# window.location.href = url.toString(); # }

    set();
}

function set() {

    const params = new URLSearchParams(window.location.search);
    const viewMode = params.get('view');

    document.querySelector("#content").innerHTML = ""

    if (viewMode === 'print') {
        const previewer = new Previewer();
        previewer
            .preview(
                document.querySelector("#templateContent").content,
                ["/styles/preview.css"],
                document.querySelector("#content")
            )
            .then(flow => {
                console.log("preview rendered, total pages", flow.total, { flow });
            });

    } else {
        const templateContent = document.querySelector('#templatesource').innerHTML;
        const content = document.querySelector('#content');
        content.innerHTML = templateContent;
    }




};

        }


