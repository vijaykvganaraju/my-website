function enlarge(id) {
    const divId = '#' + id;

    const imgAddress = document.querySelector(divId).childNodes[1].getAttribute('src');
    const text = document.querySelector(divId).childNodes[3].innerText;
    
    document.querySelector('#displayImg').src = imgAddress;
    document.querySelector('#caption').innerText = text;;
    document.querySelector('#modal').style.display = 'block';
}

function closeModal() {
    document.querySelector('#modal').style.display = 'none';

}

document.onkeydown = function (evt) {
    evt = evt || window.event;
    
    if (evt.keyCode == 27 && document.querySelector('#modal').style.display ==='block') {
        closeModal();
    }
};