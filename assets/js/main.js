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

  function applyFilters(){
    items.forEach((chip) => {
      const chipCat = chip.getAttribute("data-cat") || "";
      const chipIndustries = (chip.getAttribute("data-industry") || "").split(/\s+/);

      const catOK = activeCat === "all" || chipCat === activeCat;
      const indOK = activeIndustry === "all" || chipIndustries.includes(activeIndustry);

      chip.classList.toggle("hidden", !(catOK && indOK));
    });
  }

  function setActive(groupEl, selector, btn){
    groupEl.querySelectorAll(selector).forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  }

  function openMega(){
  mega.classList.add("open");
  trigger.setAttribute("aria-expanded", "true");
  mega.scrollTop = 0; // reset internal scroll if any
}

  function closeMega(){
    mega.classList.remove("open");
    trigger.setAttribute("aria-expanded", "false");
  }

  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    mega.classList.contains("open") ? closeMega() : openMega();
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) closeMega();
  });

  // Close on ESC
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

  // Initial
  applyFilters();
})();
(() => {
  const nav = document.querySelector("header.nav");
  const mega = document.querySelector(".mega");
  if (!nav || !mega) return;

  function positionMega(){
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

  function setActive(i) {
    idx = (i + thumbs.length) % thumbs.length;

    thumbs.forEach(t => t.classList.remove("is-active"));
    const t = thumbs[idx];
    t.classList.add("is-active");

    main.src = t.dataset.src;
    main.alt = t.dataset.alt || "Product image";

    t.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  thumbs.forEach((t, i) => t.addEventListener("click", () => setActive(i)));
  prevBtn?.addEventListener("click", () => setActive(idx - 1));
  nextBtn?.addEventListener("click", () => setActive(idx + 1));

  window.addEventListener("keydown", (e) => {
    // don’t hijack arrows when typing in inputs/textareas
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === "input" || tag === "textarea") return;

    if (e.key === "ArrowLeft") setActive(idx - 1);
    if (e.key === "ArrowRight") setActive(idx + 1);
  });

  setActive(idx);
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


const detectorWrap = document.querySelector(".detector-wrap");
const detectorTrigger = document.querySelector(".detector-trigger");

if (detectorWrap && detectorTrigger) {

  detectorTrigger.addEventListener("click", () => {
    detectorWrap.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!detectorWrap.contains(e.target)) {
      detectorWrap.classList.remove("open");
    }
  });

}

