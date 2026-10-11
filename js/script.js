// == FLOATING NAVIGATION: SHOW AFTER INTRODUCTION ==
document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".floating-nav");
    const menuButton = document.querySelector(".mobile-menu-button");
    const intro = document.querySelector("#home");
    const navLinks = [...document.querySelectorAll(".floating-nav a")];
    const sections = [...document.querySelectorAll("main section[id]")];

    if (!nav || !menuButton || !intro) return;

    function setMenuOpen(open) {
        nav.classList.toggle("is-open", open);
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
        const symbol = menuButton.querySelector("span");
        if (symbol) symbol.textContent = open ? "✕" : "☰";
    }

    function updateNavigation() {
        const passedIntro = intro.getBoundingClientRect().bottom <= 0;
        nav.classList.toggle("is-visible", passedIntro);
        menuButton.classList.toggle("is-visible", passedIntro);
        if (!passedIntro) setMenuOpen(false);

        let activeId = "home";
        const referenceY = window.innerHeight * 0.42;
        for (const section of sections) {
            if (section.getBoundingClientRect().top <= referenceY) activeId = section.id;
        }
        navLinks.forEach(link => {
            const active = link.getAttribute("href") === "#" + activeId;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
        });
    }

    menuButton.addEventListener("click", () => setMenuOpen(!nav.classList.contains("is-open")));
    navLinks.forEach(link => link.addEventListener("click", () => setMenuOpen(false)));
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") setMenuOpen(false);
    });
    document.addEventListener("click", event => {
        if (nav.classList.contains("is-open") && !nav.contains(event.target) && !menuButton.contains(event.target)) {
            setMenuOpen(false);
        }
    });

    let scheduled = false;
    function scheduleUpdate() {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => {
            updateNavigation();
            scheduled = false;
        });
    }
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) setMenuOpen(false);
        scheduleUpdate();
    });
    updateNavigation();
});
