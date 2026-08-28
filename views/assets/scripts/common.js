function setMenuState(isOpen) {
    const menu = document.querySelector('.menu');
    const navButtons = document.querySelectorAll('.nav-button');

    if (!menu || navButtons.length === 0) {
        return;
    }

    const icon = isOpen ? 'close' : 'menu';

    menu.style.display = isOpen ? 'flex' : 'none';
    menu.setAttribute('aria-hidden', String(!isOpen));
    navButtons.forEach((button) => {
        button.innerText = icon;
        button.setAttribute('aria-expanded', String(isOpen));
        button.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });
}

function viewMenu() {
    const menu = document.querySelector('.menu');

    if (!menu || window.innerWidth >= 900) {
        return;
    }

    const shouldOpenMenu = menu.style.display !== 'flex';
    setMenuState(shouldOpenMenu);
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
        setMenuState(false);
        mobileSpecificItems.forEach((item) => {
            item.style.display = 'flex';
        });

    } else {
        menu.style.display = 'flex';
        menu.setAttribute('aria-hidden', 'false');
        mobileSpecificItems.forEach((item) => {
            item.style.display = 'none';
        });

        navButtons.forEach((button) => {
            button.innerText = 'menu';
            button.setAttribute('aria-expanded', 'false');
            button.setAttribute('aria-label', 'Open navigation menu');
        });
    }

});

if (window.innerWidth < 900) {
    setMenuState(false);
} else {
    const menu = document.querySelector('.menu');
    if (menu) {
        menu.setAttribute('aria-hidden', 'false');
    }
}

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
    } else if (media === 'git') {
        link = 'https://github.com/vijaykvganaraju';
    }

    if (link) {
        window.open(link, '_blank', 'noopener');
    }

}
