let currentPage = 1;

export function switchPages(totalPages){

addEventListener("mousedown", (event) => { 


        if(currentPage < totalPages && event.buttons == 1){
            currentPage++;
            
        } else if(currentPage > 1 && event.buttons == 2){
            currentPage--;

        }
        
        document.querySelector(`#page-${currentPage}`).scrollIntoView();
    
})


}