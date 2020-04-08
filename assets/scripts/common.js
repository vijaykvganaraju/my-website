function viewMenu() {

    console.log('click')
    let navButton = document.querySelector('.nav-button').innerHTML;
    let menuState = document.querySelector('.menu').style.display;

    console.log({navButton, menuState});
    
    navButton === 'menu' ? (navButton = 'close', menuState = 'flex') : (navButton = 'menu', menuState = 'none');
    console.log({ navButton, menuState });

    document.querySelector('.nav-button').innerHTML = navButton;
    document.querySelector('.menu').style.display = menuState;
}

window.addEventListener('resize', () => {
    const width = window.innerWidth;

    if (width > 320 && width < 900) {
        document.querySelector('.menu').style.display = 'none';
        document.querySelector('.mobile-specific').style.display = 'flex';


    } else if (width >= 900) {
        document.querySelector('.menu').style.display = 'flex';
        document.querySelector('.mobile-specific').style.display = 'none';

    }

    document.querySelector('#navButtonIcon').innerText = 'menu';

});

