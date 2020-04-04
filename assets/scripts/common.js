function viewMenu() {


    let navButton = document.querySelector("#navButtonIcon").innerText;
    let menuState = document.querySelector(".menu").style.display;

    navButton === "menu" ? (navButton = "close", menuState = "flex") : (navButton = "menu", menuState = "none");

    document.querySelector("#navButtonIcon").innerHTML = navButton;
    document.querySelector(".menu").style.display = menuState;
}

window.addEventListener("resize", () => {
    const width = window.innerWidth;

    if (width > 320 && width < 900) {
        document.querySelector(".menu").style.display = "none";

    } else if (width >= 900) {
        document.querySelector(".menu").style.display = "flex";

    }

    document.querySelector("#navButtonIcon").innerText = "menu";

});

