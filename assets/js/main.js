const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const siteHeader = document.querySelector(".site-header");
const currentPage = window.location.pathname.split("/").pop() || "index.html";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll(".nav-links a").forEach((link) => {
  const linkPage = link.getAttribute("href")?.split("?")[0];

  if (linkPage === currentPage) {
    link.setAttribute("aria-current", "page");
  }
});

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const updateHeader = () => {
  if (!siteHeader) return;
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (!prefersReducedMotion) {
  let parallaxQueued = false;

  const parallaxTick = () => {
    document.documentElement.style.setProperty("--hero-shift", `${Math.min(window.scrollY * 0.16, 90)}px`);
    parallaxQueued = false;
  };

  parallaxTick();
  window.addEventListener("scroll", () => {
    if (!parallaxQueued) {
      parallaxQueued = true;
      window.requestAnimationFrame(parallaxTick);
    }
  }, { passive: true });
}

const revealItems = document.querySelectorAll(".section-head, .text-block, .image-frame, .feature, .deliverable, .mini-card, .table-wrap, .cta-inner");

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  revealItems.forEach((item) => item.classList.add("reveal"));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });

  revealItems.forEach((item) => revealObserver.observe(item));
}
