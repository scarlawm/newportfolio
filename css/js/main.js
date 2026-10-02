/* =========================================================
   SHUTTERBUG.HAI / MAIN JS
   ========================================================= */

(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const MOBILE_QUERY = "(max-width: 768px)";
  const MAIN_SECTIONS = 4;

  /*
   * Add your exact Pexels profile URL here.
   * Example:
   * const PEXELS_URL = "https://www.pexels.com/@username/";
   */
  const PEXELS_URL = "https://www.pexels.com/@himanshu-singh-148036179/";

  const workItems = [
    {
      key: "all",
      label: "All Work",
      title: "From a passing moment to a frame worth keeping.",
      description:
        "This is the main contact sheet. Your final photographs will sit here across events, street stories, portraits, editorial work, culture and everything else you shoot.",
      tags: ["Light", "Motion", "People", "Culture"],
      frames: [
        ["FRAME 01", "A moment worth keeping", "Your photograph goes here"],
        ["FRAME 02", "The room changes", "Your photograph goes here"],
        ["FRAME 03", "Kashi after dark", "Your photograph goes here"],
        ["FRAME 04", "A face, a story", "Your photograph goes here"]
      ]
    },
    {
      key: "events",
      label: "Events",
      title: "Moments before they disappear.",
      description:
        "Celebrations, people, stages, chaos and emotion — photographs that keep the atmosphere alive.",
      frames: [
        ["EVENT 01", "The room comes alive", "Add event photograph"],
        ["EVENT 02", "Faces in the crowd", "Add event photograph"],
        ["EVENT 03", "A moment between", "Add event photograph"],
        ["EVENT 04", "The final beat", "Add event photograph"]
      ]
    },
    {
      key: "esports",
      label: "Esports",
      title: "Pressure. Light. Reaction.",
      description:
        "High-energy frames built around timing, expression, atmosphere and split-second decisions.",
      frames: [
        ["ESPORTS 01", "Player focus", "Add esports photograph"],
        ["ESPORTS 02", "Stage light", "Add esports photograph"],
        ["ESPORTS 03", "Reaction", "Add esports photograph"],
        ["ESPORTS 04", "Arena", "Add esports photograph"]
      ]
    },
    {
      key: "street",
      label: "Street",
      title: "Kashi has no pause button.",
      description:
        "Lanes, faces, light, texture and those little moments that happen only once.",
      frames: [
        ["STREET 01", "Ghat light", "Add street photograph"],
        ["STREET 02", "Old lane", "Add street photograph"],
        ["STREET 03", "A passing face", "Add street photograph"],
        ["STREET 04", "Night in Kashi", "Add street photograph"]
      ]
    },
    {
      key: "editorial",
      label: "Editorial",
      title: "Built with light. Finished in frame.",
      description:
        "Concepts, fashion, details and compositions made to carry a mood.",
      frames: [
        ["EDITORIAL 01", "The look", "Add editorial photograph"],
        ["EDITORIAL 02", "Designed light", "Add editorial photograph"],
        ["EDITORIAL 03", "Texture / Form", "Add editorial photograph"],
        ["EDITORIAL 04", "Quiet frame", "Add editorial photograph"]
      ]
    },
    {
      key: "portrait",
      label: "Portrait / Muse",
      title: "People first. Pose second.",
      description:
        "Portraits that keep personality in the room, not just symmetry in the frame.",
      frames: [
        ["PORTRAIT 01", "Character", "Add portrait photograph"],
        ["PORTRAIT 02", "Natural light", "Add portrait photograph"],
        ["PORTRAIT 03", "Muse", "Add portrait photograph"],
        ["PORTRAIT 04", "Close-up", "Add portrait photograph"]
      ]
    },
    {
      key: "holi",
      label: "Holi / Culture",
      title: "Colour with no quiet mode.",
      description:
        "Festival energy, culture, movement and the beautiful chaos of celebrating together.",
      frames: [
        ["HOLI 01", "Colour / crowd", "Add Holi photograph"],
        ["HOLI 02", "Faces", "Add Holi photograph"],
        ["HOLI 03", "Movement", "Add Holi photograph"],
        ["HOLI 04", "Culture", "Add cultural photograph"]
      ]
    }
  ];

  let sectionIndex = 0;
  let workIndex = 0;
  let locked = false;
  let doorsOpen = true;
  let fastShutter = false;
  let observer = null;
  let lastMobileState = isMobile();

  function isMobile() {
    return window.matchMedia(MOBILE_QUERY).matches;
  }

  /* =======================================================
     CONTENT
     ======================================================= */

  function renderDock() {
    const dock = $("#dock");
    if (!dock) return;

    const labels = ["Home", "About", "Work", "Contact"];

    dock.innerHTML = labels.map((label, i) => `
      <button
        type="button"
        class="dock-btn ${i === 0 ? "active" : ""}"
        data-index="${i}"
        aria-label="Go to ${label}"
        aria-current="${i === 0 ? "page" : "false"}"
      >
        ${label}
      </button>
    `).join("");

    $$(".dock-btn", dock).forEach(button => {
      button.addEventListener("click", () => jump(Number(button.dataset.index)));
    });
  }

  function renderWorkTabs() {
    const tabs = $("#workTabs");
    if (!tabs) return;

    tabs.innerHTML = workItems.map((item, i) => `
      <button
        type="button"
        class="work-tab ${i === workIndex ? "active" : ""}"
        data-work-tab="${i}"
        aria-pressed="${i === workIndex}"
      >
        <small>STN-${String(i + 1).padStart(2, "0")}</small>
        <strong>${item.label}</strong>
      </button>
    `).join("");

    $$("[data-work-tab]", tabs).forEach(button => {
      button.addEventListener("click", () => {
        setWorkIndex(Number(button.dataset.workTab));
        setDoors(true);
      });
    });
  }

  function frameMarkup(frame) {
    return `
      <article class="frame">
        <div class="frame-content">
          <span class="frame-code">${frame[0]}</span>
          <h4>${frame[1]}</h4>
          <p>${frame[2]}</p>
        </div>
      </article>
    `;
  }

  function renderWorkLanding() {
    const item = workItems[workIndex];
    const copy = $("#workCopy");
    const gallery = $("#workGallery");

    if (!copy || !gallery || !item) return;

    copy.innerHTML = `
      <div class="work-copy">
        <span class="kicker">${item.key === "all" ? "CONTACT SHEET" : item.label}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="work-tags">
          ${(item.tags || []).map(tag => `<span>${tag}</span>`).join("")}
        </div>
      </div>
    `;

    gallery.innerHTML = item.frames.map(frameMarkup).join("");
  }

  function renderCategoryGalleries() {
    $$("[data-gallery]").forEach(gallery => {
      const item = workItems.find(work => work.key === gallery.dataset.gallery);
      if (!item) return;
      gallery.innerHTML = item.frames.map(frameMarkup).join("");
    });
  }

  function applyPexels() {
    const link = $("#pexelsLink");
    if (!link) return;

    const valid = PEXELS_URL && PEXELS_URL !== "PASTE_YOUR_PEXELS_PROFILE_URL_HERE";

    if (valid) {
      link.href = PEXELS_URL;
      link.textContent = "VIEW PROFILE ↗";
    } else {
      link.href = "https://www.pexels.com/";
      link.textContent = "ADD PROFILE LINK ↗";
    }
  }

  /* =======================================================
     MAIN NAV
     ======================================================= */

  function updateDock() {
    $$(".dock-btn").forEach((button, i) => {
      const active = i === sectionIndex;
      button.classList.toggle("active", active);
      button.setAttribute("aria-current", active ? "page" : "false");
    });
  }

  function updateSectionNumber() {
    const node = $("#secNo");
    if (node) {
      node.textContent = `${String(sectionIndex + 1).padStart(2, "0")} / ${String(MAIN_SECTIONS).padStart(2, "0")}`;
    }
  }

  function showDesktop(next) {
    const track = $("#track");
    if (track) {
      track.style.transform = `translateY(-${next * 100}%)`;
    }
  }

  function getMainSection(next) {
    return document.querySelector(`[data-section="${next}"].page-section, [data-section="${next}"].work-section`);
  }

  function show(next, options = {}) {
    sectionIndex = Math.max(0, Math.min(MAIN_SECTIONS - 1, next));

    updateDock();
    updateSectionNumber();

    if (isMobile()) {
      const target = getMainSection(sectionIndex);

      if (target && options.scroll !== false) {
        target.scrollIntoView({
          behavior: options.instant ? "auto" : "smooth",
          block: "start"
        });
      }

      return;
    }

    showDesktop(sectionIndex);
  }

  function lockNavigation() {
    locked = true;
    window.setTimeout(() => {
      locked = false;
    }, 900);
  }

  function step(direction) {
    if (isMobile() || locked) return;

    const next = Math.max(0, Math.min(MAIN_SECTIONS - 1, sectionIndex + direction));

    if (next !== sectionIndex) {
      lockNavigation();
      show(next);
    }
  }

  function jump(next) {
    if (!isMobile() && locked) return;

    if (!isMobile()) {
      if (next === sectionIndex) return;
      lockNavigation();
    }

    show(next);
  }

  /* =======================================================
     WORK RAIL
     ======================================================= */

  function setWorkIndex(next) {
    workIndex = Math.max(0, Math.min(workItems.length - 1, next));

    renderWorkTabs();
    renderWorkLanding();

    const inner = $("#hinner");
    if (!inner) return;

    if (isMobile()) {
      inner.style.transform = "none";

      const target = document.querySelector(`[data-work-index="${workIndex}"]`);

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    } else {
      inner.style.transform = `translateX(-${workIndex * (100 / 7)}%)`;
    }
  }

  /* =======================================================
     DOORS
     ======================================================= */

  function setDoors(open) {
    doorsOpen = open;

    const doors = $("#doors");
    const button = $("#doorBtn");

    if (doors) doors.classList.toggle("shut", !open);

    if (button) {
      button.textContent = open ? "Close Doors ⇥" : "Open Doors ⇤";
      button.setAttribute("aria-expanded", String(open));
    }
  }

  /* =======================================================
     SHUTTER
     ======================================================= */

  function updateShutter() {
    const value = fastShutter ? "1/500s" : "1/15s";

    const header = $("#shutterTxt");
    const hud = $("#hudShutter");

    if (header) header.textContent = value;
    if (hud) hud.textContent = value;
  }

  /* =======================================================
     MOBILE OBSERVER
     ======================================================= */

  function setupObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    if (!isMobile()) return;

    const sections = $$("[data-section]");

    observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const next = Number(visible.target.dataset.section);

      if (Number.isInteger(next) && next !== sectionIndex) {
        sectionIndex = next;
        updateDock();
        updateSectionNumber();
      }
    }, {
      threshold: [0.25, 0.5, 0.75],
      rootMargin: "-10% 0px -10% 0px"
    });

    sections.forEach(section => observer.observe(section));
  }

  /* =======================================================
     DESKTOP INPUT
     ======================================================= */

  function onWheel(event) {
    if (isMobile()) return;

    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      return;
    }

    event.preventDefault();

    if (Math.abs(event.deltaY) < 20) return;

    step(event.deltaY > 0 ? 1 : -1);
  }

  function onKeydown(event) {
    if (isMobile()) return;

    const active = document.activeElement;
    const typing =
      active &&
      ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName);

    if (typing) return;

    if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowUp" || event.key === "PageUp") {
      event.preventDefault();
      step(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      jump(0);
    } else if (event.key === "End") {
      event.preventDefault();
      jump(MAIN_SECTIONS - 1);
    }
  }

  let touchX = 0;
  let touchY = 0;

  function onTouchStart(event) {
    if (isMobile()) return;

    const touch = event.touches[0];
    if (!touch) return;

    touchX = touch.clientX;
    touchY = touch.clientY;
  }

  function onTouchEnd(event) {
    if (isMobile()) return;

    const touch = event.changedTouches[0];
    if (!touch) return;

    const dx = touchX - touch.clientX;
    const dy = touchY - touch.clientY;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (sectionIndex === 2 && Math.abs(dx) > 45) {
        setWorkIndex(workIndex + (dx > 0 ? 1 : -1));
      }
      return;
    }

    if (Math.abs(dy) > 45) {
      step(dy > 0 ? 1 : -1);
    }
  }

  /* =======================================================
     RESPONSIVE SWITCH
     ======================================================= */

  function onResize() {
    const mobile = isMobile();

    if (mobile === lastMobileState) return;

    lastMobileState = mobile;
    locked = false;

    const track = $("#track");
    const inner = $("#hinner");

    if (mobile) {
      if (track) track.style.transform = "none";
      if (inner) inner.style.transform = "none";
      setupObserver();
    } else {
      if (observer) observer.disconnect();
      observer = null;
      showDesktop(sectionIndex);
      setWorkIndex(workIndex);
    }
  }

  /* =======================================================
     INIT
     ======================================================= */

  function init() {
    renderDock();
    renderWorkTabs();
    renderWorkLanding();
    renderCategoryGalleries();
    applyPexels();
    updateShutter();
    updateSectionNumber();

    const doorButton = $("#doorBtn");
    if (doorButton) {
      doorButton.addEventListener("click", () => setDoors(!doorsOpen));
    }

    const inlineOpen = $("#openDoorsInline");
    if (inlineOpen) {
      inlineOpen.addEventListener("click", () => setDoors(true));
    }

    const shutterButton = $("#shutterBtn");
    if (shutterButton) {
      shutterButton.addEventListener("click", () => {
        fastShutter = !fastShutter;
        updateShutter();
      });
    }

    $$("[data-go]").forEach(button => {
      button.addEventListener("click", event => {
        event.preventDefault();
        jump(Number(button.dataset.go));
      });
    });

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeydown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    setupObserver();

    if (isMobile()) {
      show(0, { scroll: false });
      setWorkIndex(0);
    } else {
      showDesktop(0);
      setWorkIndex(0);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

