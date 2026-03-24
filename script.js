const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const revealItems = document.querySelectorAll(".reveal");
const sectionNodes = document.querySelectorAll("main section[id]");
const yearElement = document.getElementById("year");
const contactForm = document.getElementById("contact-form");
const formNote = document.getElementById("form-note");

const updateHeaderState = () => {
  if (!siteHeader) {
    return;
  }

  siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
};

const closeMenu = () => {
  if (!menuToggle || !siteNav) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
};

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    siteNav.classList.toggle("is-open", !isExpanded);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Node)) {
      return;
    }

    if (!siteNav.contains(target) && !menuToggle.contains(target)) {
      closeMenu();
    }
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

revealItems.forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${(index % 4) * 90}ms`);
});

window.addEventListener("scroll", updateHeaderState, { passive: true });
window.addEventListener("load", updateHeaderState);

const updateActiveNav = () => {
  const currentSection = Array.from(sectionNodes).find((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= 160 && rect.bottom >= 160;
  });

  const currentId = currentSection?.id || "";

  navLinks.forEach((link) => {
    const linkTarget = link.getAttribute("href")?.replace("#", "") || "";
    link.classList.toggle("is-active", linkTarget === currentId);
  });
};

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

window.addEventListener("scroll", updateActiveNav, { passive: true });
window.addEventListener("load", updateActiveNav);

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const whatsappMessage = encodeURIComponent(
      `Hello Mama Nuraah, my name is ${name}. My phone number is ${phone}. ${message}`
    );

    if (formNote) {
      formNote.textContent = "Opening WhatsApp so you can send your private request directly.";
    }

    window.open(`https://wa.me/27726202896?text=${whatsappMessage}`, "_blank", "noopener");
  });
}
