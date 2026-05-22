(function () {
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  const header = document.getElementById("header");
  const contactForm = document.getElementById("contactForm");
  const toast = document.getElementById("toast");
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const open = nav.classList.toggle("nav--open");
      navToggle.setAttribute("aria-expanded", open);
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.querySelectorAll(".nav__link").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("nav--open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  window.addEventListener("scroll", function () {
    if (header) header.classList.toggle("scrolled", window.scrollY > 40);
    updateActiveNav();
  }, { passive: true });

  function updateActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const links = document.querySelectorAll(".nav__link");
    let current = "";
    sections.forEach(function (sec) {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const id = anchor.getAttribute("href");
      if (id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    });
  });

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { obs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(function () { toast.classList.remove("show"); }, 4000);
  }

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name");
      const business = document.getElementById("business");
      const phone = document.getElementById("phone");
      const email = document.getElementById("email");
      const pkg = document.getElementById("package");
      const message = document.getElementById("message");
      let valid = true;
      [name, business, phone, message].forEach(function (field) {
        field.classList.remove("error");
        if (!field.value.trim()) { field.classList.add("error"); valid = false; }
      });
      const phoneVal = phone.value.replace(/\D/g, "");
      if (phoneVal.length !== 10) { phone.classList.add("error"); valid = false; }
      if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.classList.add("error"); valid = false;
      }
      if (!valid) { showToast("Please fill all required fields correctly."); return; }
      const subject = encodeURIComponent("New Website Inquiry - Web Developers - " + business.value);
      const body = encodeURIComponent(
        "Name: " + name.value + "\nBusiness: " + business.value + "\nPhone: " + phone.value +
        "\nEmail: " + (email.value || "N/A") + "\nPackage: " + (pkg.value || "Not specified") +
        "\n\nProject Details:\n" + message.value
      );
      window.location.href = "mailto:kameshwaran718@gmail.com?subject=" + subject + "&body=" + body;
      showToast("Opening your email app... We will respond within 24 hours!");
      contactForm.reset();
    });
  }
})();
