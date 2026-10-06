(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;
  var body = document.body;

  /* ------------------------------------------------------------------ */
  /* Intro — monogram, then the doors open onto the hero                 */
  /* ------------------------------------------------------------------ */
  var intro = document.getElementById("intro");
  var INTRO_HOLD_MS = reduceMotion ? 600 : 2300;
  var DOOR_MS = reduceMotion ? 10 : 1400;

  function openIntro() {
    if (!intro || intro.classList.contains("is-opening")) return;
    intro.classList.add("is-opening");
    body.classList.add("intro-open");
    try { sessionStorage.setItem("br-intro-seen", "1"); } catch (e) {}
    window.setTimeout(function () {
      root.classList.add("intro-done");
    }, DOOR_MS);
  }

  if (root.classList.contains("intro-done")) {
    body.classList.add("intro-open");
  } else if (intro) {
    var introTimer = window.setTimeout(openIntro, INTRO_HOLD_MS);
    intro.addEventListener("click", function () {
      window.clearTimeout(introTimer);
      openIntro();
    });
    document.addEventListener("keydown", function onKey() {
      window.clearTimeout(introTimer);
      openIntro();
      document.removeEventListener("keydown", onKey);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Header scroll state                                                 */
  /* ------------------------------------------------------------------ */
  var header = document.getElementById("header");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > window.innerHeight * 0.6);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ------------------------------------------------------------------ */
  /* Full-screen menu                                                    */
  /* ------------------------------------------------------------------ */
  var menuToggle = document.getElementById("menuToggle");
  var menu = document.getElementById("menu");

  function setMenu(open) {
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.querySelector(".sr-only").textContent = open ? "Close menu" : "Menu";
    body.classList.toggle("is-locked", open);
    if (open) {
      menu.hidden = false;
      void menu.offsetWidth;
      menu.classList.add("is-open");
      var first = menu.querySelector("a");
      if (first) first.focus();
    } else {
      menu.classList.remove("is-open");
      window.setTimeout(function () {
        if (!menu.classList.contains("is-open")) menu.hidden = true;
      }, reduceMotion ? 0 : 450);
    }
  }

  menuToggle.addEventListener("click", function () {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { setMenu(false); });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuToggle.focus();
    }
    // Keep focus inside the open menu (toggle + menu links)
    if (e.key === "Tab" && menuToggle.getAttribute("aria-expanded") === "true") {
      var items = [menuToggle].concat(Array.prototype.slice.call(menu.querySelectorAll("a")));
      var i = items.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
    }
  });

  /* ------------------------------------------------------------------ */
  /* Hero room switch — swaps photo and line, and the menu tab below     */
  /* ------------------------------------------------------------------ */
  var hero = document.getElementById("home");
  var roomButtons = Array.prototype.slice.call(document.querySelectorAll(".room-switch-btn"));

  function setRoom(room) {
    hero.setAttribute("data-room", room);
    roomButtons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-room") === room));
    });
    hero.querySelectorAll(".hero-img").forEach(function (img) {
      img.classList.toggle("is-active", img.classList.contains("hero-img--" + room));
    });
    hero.querySelectorAll(".hero-line-text").forEach(function (line) {
      line.hidden = line.getAttribute("data-for") !== room;
    });
    var tab = document.getElementById("tab-" + room);
    if (tab) activateTab(tab);
  }

  roomButtons.forEach(function (btn) {
    btn.addEventListener("click", function () { setRoom(btn.getAttribute("data-room")); });
  });

  /* ------------------------------------------------------------------ */
  /* Service tabs                                                        */
  /* ------------------------------------------------------------------ */
  var tabButtons = Array.prototype.slice.call(document.querySelectorAll(".tab-btn"));
  var tabPanels = Array.prototype.slice.call(document.querySelectorAll(".tab-panel"));

  function activateTab(button) {
    tabButtons.forEach(function (btn) {
      var selected = btn === button;
      btn.setAttribute("aria-selected", String(selected));
      btn.tabIndex = selected ? 0 : -1;
    });
    tabPanels.forEach(function (panel) {
      panel.hidden = panel.id !== button.getAttribute("aria-controls");
    });
  }

  tabButtons.forEach(function (btn, i) {
    btn.addEventListener("click", function () { activateTab(btn); });
    btn.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight") next = (i + 1) % tabButtons.length;
      if (e.key === "ArrowLeft") next = (i - 1 + tabButtons.length) % tabButtons.length;
      if (next !== null) {
        e.preventDefault();
        tabButtons[next].focus();
        activateTab(tabButtons[next]);
      }
    });
  });

  /* ------------------------------------------------------------------ */
  /* Review carousel — autoplay pauses on hover/focus/reduced motion     */
  /* ------------------------------------------------------------------ */
  var slides = Array.prototype.slice.call(document.querySelectorAll(".review-slide"));
  var dotsWrap = document.getElementById("reviewDots");
  var current = 0;
  var timer = null;
  var AUTOPLAY_MS = 7000;

  slides.forEach(function (_, i) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.className = "review-dot";
    dot.setAttribute("aria-label", "Show review " + (i + 1));
    dot.setAttribute("aria-current", i === 0 ? "true" : "false");
    dot.addEventListener("click", function () { goTo(i); restartAutoplay(); });
    dotsWrap.appendChild(dot);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function goTo(index) {
    slides[current].classList.remove("is-active");
    slides[current].hidden = true;
    dots[current].setAttribute("aria-current", "false");
    current = (index + slides.length) % slides.length;
    slides[current].hidden = false;
    void slides[current].offsetWidth;
    slides[current].classList.add("is-active");
    dots[current].setAttribute("aria-current", "true");
  }

  function stopAutoplay() { if (timer) { window.clearInterval(timer); timer = null; } }
  function startAutoplay() {
    if (reduceMotion) return;
    stopAutoplay();
    timer = window.setInterval(function () { goTo(current + 1); }, AUTOPLAY_MS);
  }
  function restartAutoplay() { stopAutoplay(); startAutoplay(); }

  document.getElementById("reviewPrev").addEventListener("click", function () { goTo(current - 1); restartAutoplay(); });
  document.getElementById("reviewNext").addEventListener("click", function () { goTo(current + 1); restartAutoplay(); });

  var carousel = document.querySelector(".review-carousel");
  ["mouseenter", "focusin"].forEach(function (evt) { carousel.addEventListener(evt, stopAutoplay); });
  ["mouseleave", "focusout"].forEach(function (evt) { carousel.addEventListener(evt, startAutoplay); });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopAutoplay(); else startAutoplay();
  });
  startAutoplay();

  /* ------------------------------------------------------------------ */
  /* Footer year                                                         */
  /* ------------------------------------------------------------------ */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------ */
  /* Square booking link placeholder notice                              */
  /* Delete this block once every .js-square-link has a real Square URL. */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll(".js-square-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (link.getAttribute("href") === "#") {
        e.preventDefault();
        var label = link.getAttribute("data-square-label") || "booking";
        window.alert("Online " + label + " isn't connected yet. Add the Square Appointments link to this button's href in index.html.");
      }
    });
  });
})();
