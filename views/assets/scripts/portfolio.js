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
    
    document.querySelector('#displayImg').src = imgAddress;
    document.querySelector('#caption').innerText = text;
    document.querySelector('#modal').style.display = 'block';
}

function closeModal() {
    document.querySelector('#modal').style.display = 'none';

}

document.onkeydown = function (evt) {
    evt = evt || window.event;
    
    if (evt.key === 'Escape' && document.querySelector('#modal').style.display === 'block') {
        closeModal();
    }
};
