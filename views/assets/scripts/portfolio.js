let lastFocusedProject = null;

function enlarge(id) {
    const divId = '#' + id;
    const selectedProject = document.querySelector(divId);

    if (!selectedProject) {
        return;
    }

    const selectedImage = selectedProject.querySelector('img');
    const selectedCaption = selectedProject.querySelector('.project-name');

    if (!selectedImage || !selectedCaption) {
        return;
    }

    const imgAddress = selectedImage.getAttribute('src');
    const text = selectedCaption.innerText;
    const modal = document.querySelector('#modal');
    const displayImg = document.querySelector('#displayImg');
    const caption = document.querySelector('#caption');
    
    if (!modal || !displayImg || !caption) {
        return;
    }

    lastFocusedProject = selectedProject;
    displayImg.src = imgAddress;
    displayImg.alt = text;
    caption.innerText = text;
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    modal.focus();
}

function closeModal() {
    const modal = document.querySelector('#modal');

    if (!modal) {
        return;
    }

    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');

    if (lastFocusedProject) {
        lastFocusedProject.focus();
    }

}

function handleModalClick(evt) {
    if (evt.target && evt.target.id === 'modal') {
        closeModal();
    }
}

document.onkeydown = function (evt) {
    evt = evt || window.event;
    const modal = document.querySelector('#modal');

    if (evt.key === 'Escape' && modal && modal.style.display === 'block') {
        closeModal();
    }
};
