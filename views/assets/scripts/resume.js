const url = './assets/files/resume.pdf';

let pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;

if (!pdfjsLib) {
    updateStatus('Resume preview failed to load. Use the raw document link below.');
}

if (pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js';
}


let pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    zoomLevel = 1,
    canvas = document.querySelector('.pdf-canvas'),
    ctx = canvas ? canvas.getContext('2d') : null,
    resizeTimer = null;

function updateStatus(message) {
    const status = document.querySelector('#resumeStatus');

    if (status) {
        status.textContent = message;
    }
}

function updatePageCount(num) {
    const pageNumber = document.querySelector('#pageNumber');

    if (pageNumber) {
        pageNumber.textContent = num;
    }
}

function updateControls() {
    const prevButton = document.querySelector('#prev-page');
    const nextButton = document.querySelector('#next-page');

    if (!pdfDoc || !prevButton || !nextButton) {
        return;
    }

    prevButton.disabled = pageNum <= 1;
    nextButton.disabled = pageNum >= pdfDoc.numPages;
}

function renderPage(num) {
    if (!pdfDoc || !canvas || !ctx) {
        return;
    }

    pageRendering = true;

    pdfDoc.getPage(num).then(function (page) {
        const initialViewport = page.getViewport({ scale: 1 });
        const container = document.querySelector('.pdf-canvas-div');
        const containerWidth = container ? container.clientWidth : window.innerWidth;
        const fitScale = Math.min(containerWidth / initialViewport.width, 1.5);
        const viewport = page.getViewport({ scale: fitScale * zoomLevel });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        const renderTask = page.render(renderContext);

        renderTask.promise.then(function () {
            pageRendering = false;
            if (pageNumPending !== null) {

                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    }).catch((err) => {
        console.error(err);
        pageRendering = false;
        updateStatus('Resume preview failed to load. Use the raw document link below.');
    });

    updatePageCount(num);
    updateControls();
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
    if (!pdfDoc || pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
}

function zoomIn() {
    if(zoomLevel + 0.25 <= 2) {
        zoomLevel = zoomLevel + 0.25;
        renderPage(pageNum);
    } 
    
}

function zoomOut() {
    if (zoomLevel - 0.25 >= 0.5) {
        zoomLevel = zoomLevel - 0.25;
        renderPage(pageNum);
    }
    
}

window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
        if (pdfDoc) {
            queueRenderPage(pageNum);
        }
    }, 150);
});

if (pdfjsLib && canvas && ctx) {
    pdfjsLib.getDocument(url)
        .promise.then(function (pdfDoc_) {
        pdfDoc = pdfDoc_;
        document.querySelector('#totalPages').textContent = pdfDoc.numPages;
        updateControls();
        renderPage(pageNum);
        }) 
        .catch(err => {
            console.error(err);
            updateStatus('Resume preview failed to load. Use the raw document link below.');
        });
}
