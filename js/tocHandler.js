import { Handler } from "/js/paged.esm.js";

class TOCHandler extends Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
  }

  afterRendered(pages) {
    // Find all links in the ToC
    const tocLinks = document.querySelectorAll('.toc a');
    
    tocLinks.forEach(link => {
      const targetId = link.getAttribute('href');
      
      if (targetId && targetId.startsWith('#')) {
        // Find the target element in the document
        const idToSearch = targetId.substring(1);
        const targetElement = document.getElementById(idToSearch);
        
        if (targetElement) {
          // Find which page this element is on by traversing up to .pagedjs_page
          const page = targetElement.closest('.pagedjs_page');
          
          if (page) {
            // Get the page number that Paged.js generated
            const pageNumber = page.dataset.pageNumber;
            
            // Inject the page number visually into the link
            let numSpan = link.querySelector('.page-num');
            if (!numSpan) {
              numSpan = document.createElement('span');
              numSpan.className = 'page-num';
              
              // We append the page number to the end of the link
              link.appendChild(numSpan);
            }
            numSpan.textContent = pageNumber;
          }
        }
      }
    });
  }
}

export { TOCHandler };
