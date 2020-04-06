function redirectSocial(media) {
    console.log(media);
    let link = null;
    if (media === 'li') {
        link = 'https://www.linkedin.com/in/vijay-ganaraju-2a0982126';
    } else if (media === 'tw') {
        link = 'https://twitter.com/vijaykvganaraju';
    } else if (media === 'in') {
        link = 'https://www.instagram.com/vijaykvganaraju';
    } else if (media === 'di') {
        link = 'https://discord.gg/C4HSFYN';
    } else if (media === 'yt') {
        link = 'https://www.youtube.com/user/Tejaswi88';
    }

    window.open(link, '_blank');
    
}