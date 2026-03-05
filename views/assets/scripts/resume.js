const url = './assets/files/resume.pdf';

let pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;

if (!pdfjsLib) {
    throw new Error('PDF.js library failed to load');
}

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js';


let pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1.5,
    canvas = document.querySelector('.pdf-canvas'),
    ctx = canvas.getContext('2d');

function renderPage(num) {
    pageRendering = true;

    pdfDoc.getPage(num).then(function (page) {
        var viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        var renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        var renderTask = page.render(renderContext);

        renderTask.promise.then(function () {
            pageRendering = false;
            if (pageNumPending !== null) {

                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });

    document.querySelector('#pageNumber').textContent = num;
}

function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

function prevPage() {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
}

function nextPage() {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
}

function zoomIn() {
    if(scale + 0.3 <= 3) {
        scale = scale + 0.3;
        renderPage(pageNum);
    } 
    
}

function zoomOut() {
    if (scale - 0.3 > 0.5) {
        scale = scale - 0.3;
        renderPage(pageNum);
    }
    
}


pdfjsLib.getDocument(url)
    .promise.then(function (pdfDoc_) {
        pdfDoc = pdfDoc_;
        document.querySelector('#totalPages').textContent = pdfDoc.numPages;
        renderPage(pageNum);
    }) 
    .catch(err => {
        console.error(err);
    });
