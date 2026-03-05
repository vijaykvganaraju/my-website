function viewMenu() {
    const menu = document.querySelector('.menu');
    const navButtons = document.querySelectorAll('.nav-button');

    if (!menu || navButtons.length === 0) {
        return;
    }

    const shouldOpenMenu = menu.style.display !== 'flex';
    const icon = shouldOpenMenu ? 'close' : 'menu';

    menu.style.display = shouldOpenMenu ? 'flex' : 'none';
    navButtons.forEach((button) => {
        button.innerText = icon;
    });
}

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const menu = document.querySelector('.menu');
    const mobileSpecificItems = document.querySelectorAll('.mobile-specific');
    const navButtons = document.querySelectorAll('.nav-button');

    if (!menu || mobileSpecificItems.length === 0 || navButtons.length === 0) {
        return;
    }

    if (width < 900) {
        menu.style.display = 'none';
        mobileSpecificItems.forEach((item) => {
            item.style.display = 'flex';
        });

    } else {
        menu.style.display = 'flex';
        mobileSpecificItems.forEach((item) => {
            item.style.display = 'none';
        });

    }

    navButtons.forEach((button) => {
        button.innerText = 'menu';
    });

});

function redirectSocial(media) {
    let link = null;
    if (media === 'li') {
        link = 'https://www.linkedin.com/in/vijaykvgan';
    } else if (media === 'tw') {
        link = 'https://twitter.com/vijaykvgan';
    } else if (media === 'in') {
        link = 'https://www.instagram.com/vijaykvgan';
    } else if (media === 'di') {
        link = 'https://discord.gg/C4HSFYN';
    } else if (media === 'yt') {
        link = 'https://www.youtube.com/user/Tejaswi88';
    }

    window.open(link, '_blank', 'noopener');

}
