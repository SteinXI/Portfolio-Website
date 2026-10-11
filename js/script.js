// ==========================================
// FLOATING NAVIGATION INTERACTIONS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const nav = document.querySelector(".floating-nav");
    const navLinks = document.querySelectorAll(".floating-nav a");
    const menuButton = document.querySelector(".mobile-menu-button");

    if (!nav || !menuButton) return;

    // --------------------------------------
    // 1. Mobile menu: open and close
    // --------------------------------------

    function setMenuOpen(isOpen) {
        nav.classList.toggle("is-open", isOpen);
        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        menuButton.querySelector("span").textContent =
            isOpen ? "✕" : "☰";
    }

    menuButton.addEventListener("click", () => {
        const isOpen = nav.classList.contains("is-open");
        setMenuOpen(!isOpen);
    });

    // --------------------------------------
    // 2. Navigation link interactions
    // --------------------------------------

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            setMenuOpen(false);
        });
    });

    // Close mobile navigation using Escape
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            setMenuOpen(false);
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", event => {
        if (
            nav.classList.contains("is-open") &&
            !nav.contains(event.target) &&
            !menuButton.contains(event.target)
        ) {
            setMenuOpen(false);
        }
    });

    // --------------------------------------
    // 3. Detect current homepage section
    // --------------------------------------

    const sections = Array.from(
        document.querySelectorAll("main section[id]")
    );

    function updateActiveSection() {

        // Reference point: 42% down the viewport
        const referenceY = window.innerHeight * 0.42;
        let currentSection = "home";
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();

            if (rect.top <= referenceY) {
                currentSection = section.id;
            }
        });

        // Facts & Figures belongs to the Home area
        if (currentSection === "facts") {
            currentSection = "home";
        }

        navLinks.forEach(link => {
            const isActive =
                link.getAttribute("href") === "#" + currentSection;
            link.classList.toggle("active", isActive);
            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    // --------------------------------------
    // 4. Update efficiently while scrolling
    // --------------------------------------

    let scrollScheduled = false;

    function scheduleActiveUpdate() {
        if (scrollScheduled) return;
        scrollScheduled = true;
        requestAnimationFrame(() => {
            updateActiveSection();
            scrollScheduled = false;
        });
    }

    window.addEventListener("scroll", scheduleActiveUpdate, {
        passive: true
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            setMenuOpen(false);
        }
        scheduleActiveUpdate();
    });

    updateActiveSection();
});
