// Scroll reveal using IntersectionObserver (no libraries needed)
const revealEls = document.querySelectorAll(".reveal");

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add("show");
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// Optional: highlight current page link
(() => {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === path) {
      a.style.color = "var(--text)";
      a.style.borderColor = "var(--line)";
      a.style.background = "rgba(255,255,255,.03)";
    }
  });
})();

// ===== Shared nav dropdown closer =====
function closeAllNavDropdowns(except = null) {
  const productsTrigger = document.querySelector(".mega-trigger");
  const productsMenu = document.querySelector(".mega");

  const radioactiveTrigger = document.querySelector(".radmega-trigger");
  const radioactiveMenu = document.querySelector(".radmega");

  const detectorWrap = document.querySelector(".detector-wrap");
  const detectorTrigger = document.querySelector(".detector-trigger");

  if (except !== "products" && productsMenu && productsTrigger) {
    productsMenu.classList.remove("open");
    productsTrigger.setAttribute("aria-expanded", "false");
  }

  if (except !== "radioactive" && radioactiveMenu && radioactiveTrigger) {
    radioactiveMenu.classList.remove("open");
    radioactiveTrigger.setAttribute("aria-expanded", "false");
  }

  if (except !== "detector" && detectorWrap && detectorTrigger) {
    detectorWrap.classList.remove("open");
    detectorTrigger.setAttribute("aria-expanded", "false");
  }
}

// ===== Mega dropdown open/close + filtering =====
(() => {
  const wrap = document.querySelector(".mega-wrap");
  if (!wrap) return;

  const trigger = wrap.querySelector(".mega-trigger");
  const mega = wrap.querySelector(".mega");
  const filters = wrap.querySelector("[data-mega-filters]");
  const cats = wrap.querySelector("[data-mega-cats]");
  const items = wrap.querySelectorAll("[data-mega-items] .chip");

  let activeIndustry = "all";
  let activeCat = "all";

  function isMobile() {
    return window.innerWidth <= 900;
  }

  function applyFilters() {
    items.forEach((chip) => {
      const chipCat = chip.getAttribute("data-cat") || "";
      const chipIndustries = (chip.getAttribute("data-industry") || "").split(/\s+/);

      const catOK = activeCat === "all" || chipCat === activeCat;
      const indOK = activeIndustry === "all" || chipIndustries.includes(activeIndustry);

      chip.classList.toggle("hidden", !(catOK && indOK));
    });
  }

  function setActive(groupEl, selector, btn) {
    groupEl.querySelectorAll(selector).forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  }

  function openMega() {
  closeAllNavDropdowns("products");
  mega.classList.add("open");
  trigger.setAttribute("aria-expanded", "true");

  if (!isMobile()) {
    mega.scrollTop = 0;
  }
}

  function closeMega() {
    mega.classList.remove("open");
    trigger.setAttribute("aria-expanded", "false");
  }

  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    mega.classList.contains("open") ? closeMega() : openMega();
  });

  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) closeMega();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMega();
  });

  filters?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-industry]");
    if (!btn) return;

    activeIndustry = btn.getAttribute("data-industry");
    setActive(filters, "button[data-industry]", btn);
    applyFilters();
  });

  cats?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-cat]");
    if (!btn) return;

    activeCat = btn.getAttribute("data-cat");
    setActive(cats, "button[data-cat]", btn);
    applyFilters();
  });

  applyFilters();
})();

// ===== Position mega menu under nav on desktop only =====
(() => {
  const nav = document.querySelector("header.nav");
  const mega = document.querySelector(".mega");
  if (!nav || !mega) return;

  function isMobile() {
    return window.innerWidth <= 900;
  }

  function positionMega() {
    if (isMobile()) {
      mega.style.top = "";
      mega.style.left = "";
      mega.style.right = "";
      return;
    }

    const rect = nav.getBoundingClientRect();
    mega.style.top = `${Math.round(rect.bottom)}px`;
  }

  window.addEventListener("resize", positionMega);
  window.addEventListener("scroll", positionMega, { passive: true });
  positionMega();
})();

/* ===========================
   Product gallery slider
=========================== */
(function () {
  const gallery = document.querySelector("[data-gallery]");
  if (!gallery) return;

  const main = gallery.querySelector("[data-gallery-main]");
  const thumbsWrap = gallery.querySelector("[data-gallery-thumbs]");
  const thumbs = Array.from(gallery.querySelectorAll(".p-thumb"));
  const prevBtn = gallery.querySelector(".p-nav.prev");
  const nextBtn = gallery.querySelector(".p-nav.next");

  if (!main || !thumbsWrap || thumbs.length === 0) return;

  let idx = thumbs.findIndex(t => t.classList.contains("is-active"));
  if (idx < 0) idx = 0;

  function setActive(i, scrollThumb = true) {
    idx = (i + thumbs.length) % thumbs.length;

    thumbs.forEach(t => t.classList.remove("is-active"));
    const t = thumbs[idx];
    t.classList.add("is-active");

    main.src = t.dataset.src;
    main.alt = t.dataset.alt || "Product image";

    if (scrollThumb) {
      t.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }

  thumbs.forEach((t, i) => {
    t.addEventListener("click", () => setActive(i, true));
  });

  prevBtn?.addEventListener("click", () => setActive(idx - 1, true));
  nextBtn?.addEventListener("click", () => setActive(idx + 1, true));

  window.addEventListener("keydown", (e) => {
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === "input" || tag === "textarea") return;

    if (e.key === "ArrowLeft") setActive(idx - 1, true);
    if (e.key === "ArrowRight") setActive(idx + 1, true);
  });

  // Initial load: update image, but DO NOT scroll page
  setActive(idx, false);
})();

/* ===========================
   Tabs
=========================== */
(function () {
  const tabs = document.querySelector("[data-tabs]");
  if (!tabs) return;

  const btns = Array.from(tabs.querySelectorAll(".tab-btn"));
  const panels = Array.from(tabs.querySelectorAll(".tab-panel"));

  function openTab(id) {
    btns.forEach(b => b.classList.toggle("active", b.dataset.tab === id));
    panels.forEach(p => p.classList.toggle("active", p.id === id));
  }

  btns.forEach(b => {
    b.addEventListener("click", () => openTab(b.dataset.tab));
  });

  // ensure first is active
  const first = btns.find(b => b.classList.contains("active")) || btns[0];
  if (first) openTab(first.dataset.tab);
})();

function setImage(thumb){
  const main = document.getElementById("mainImage");
  main.src = thumb.src;

  document.querySelectorAll(".product-thumbs img")
    .forEach(img => img.classList.remove("active"));

  thumb.classList.add("active");
}

(() => {
  const slides = document.querySelectorAll(".home-hero-slide");
  if (!slides.length) return;

  let i = 0;
  const intervalMs = 4500; // adjust speed

  setInterval(() => {
    slides[i].classList.remove("is-active");
    i = (i + 1) % slides.length;
    slides[i].classList.add("is-active");
  }, intervalMs);
})();

const toggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (toggle && navLinks) {
  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("is-open");

    const isOpen = navLinks.classList.contains("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      navLinks.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

const detectorWrap = document.querySelector(".detector-wrap");
const detectorTrigger = document.querySelector(".detector-trigger");
const detectorMenu = document.querySelector(".detector-menu");
const nav = document.querySelector("header.nav");

if (detectorWrap && detectorTrigger && detectorMenu && nav) {

  function isMobile() {
    return window.innerWidth <= 900;
  }

  function positionDetectorMenu() {
    if (isMobile()) {
      detectorMenu.style.top = "";
      detectorMenu.style.left = "";
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const triggerRect = detectorTrigger.getBoundingClientRect();
    const menuWidth = detectorMenu.offsetWidth || 220;

    detectorMenu.style.top = `${Math.round(navRect.bottom)}px`;
    detectorMenu.style.left = `${Math.round(triggerRect.left + (triggerRect.width / 2) - (menuWidth / 2))}px`;
  }

  detectorTrigger.addEventListener("click", (e) => {
  e.stopPropagation();

  const willOpen = !detectorWrap.classList.contains("open");

  if (willOpen) {
    closeAllNavDropdowns("detector");
    detectorWrap.classList.add("open");
    detectorTrigger.setAttribute("aria-expanded", "true");
    positionDetectorMenu();
  } else {
    detectorWrap.classList.remove("open");
    detectorTrigger.setAttribute("aria-expanded", "false");
  }
});

  window.addEventListener("resize", () => {
    if (detectorWrap.classList.contains("open")) {
      positionDetectorMenu();
    }
  });

  window.addEventListener("scroll", () => {
    if (!isMobile() && detectorWrap.classList.contains("open")) {
      positionDetectorMenu();
    }
  }, { passive: true });

  document.addEventListener("click", (e) => {
    if (!detectorWrap.contains(e.target)) {
      detectorWrap.classList.remove("open");
    }
  });
}

// ===== Radioactive Measurement mega menu =====
(() => {
  const wrap = document.querySelector(".radmega-wrap");
  if (!wrap) return;

  const trigger = wrap.querySelector(".radmega-trigger");
  const mega = wrap.querySelector(".radmega");

  function isMobile() {
    return window.innerWidth <= 900;
  }

  function openMega() {
  closeAllNavDropdowns("radioactive");
  mega.classList.add("open");
  trigger.setAttribute("aria-expanded", "true");

  if (!isMobile()) {
    mega.scrollTop = 0;
  }
}

  function closeMega() {
    mega.classList.remove("open");
    trigger.setAttribute("aria-expanded", "false");
  }

  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    mega.classList.contains("open") ? closeMega() : openMega();
  });

  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) closeMega();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMega();
  });
})();

// ===== Position Radioactive Measurement mega menu under nav on desktop only =====
(() => {
  const nav = document.querySelector("header.nav");
  const mega = document.querySelector(".radmega");
  if (!nav || !mega) return;

  function isMobile() {
    return window.innerWidth <= 900;
  }

  function positionMega() {
    if (isMobile()) {
      mega.style.top = "";
      mega.style.left = "";
      mega.style.right = "";
      return;
    }

    const rect = nav.getBoundingClientRect();
    mega.style.top = `${Math.round(rect.bottom)}px`;
  }

  window.addEventListener("resize", positionMega);
  window.addEventListener("scroll", positionMega, { passive: true });
  positionMega();
})();
