(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ */
  /* Header scroll state                                                 */
  /* ------------------------------------------------------------------ */
  var header = document.getElementById("header");
  function onScroll() {
    if (window.scrollY > 12) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ------------------------------------------------------------------ */
  /* Mobile nav                                                          */
  /* ------------------------------------------------------------------ */
  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");

  function closeMobileNav() {
    mobileNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  function openMobileNav() {
    mobileNav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  navToggle.addEventListener("click", function () {
    var isOpen = navToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  mobileNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMobileNav);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeMobileNav();
    }
  });

  /* ------------------------------------------------------------------ */
  /* Scroll reveal                                                       */
  /* ------------------------------------------------------------------ */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    revealEls.forEach(function (el, i) {
      el.style.setProperty("--reveal-delay", (i % 4) * 90 + "ms");
    });

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

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
      var isTarget = panel.id === button.getAttribute("aria-controls");
      panel.classList.toggle("is-active", isTarget);
      if (isTarget) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
    });
  }

  tabButtons.forEach(function (btn, i) {
    btn.addEventListener("click", function () {
      activateTab(btn);
    });

    btn.addEventListener("keydown", function (e) {
      var newIndex = null;
      if (e.key === "ArrowRight") newIndex = (i + 1) % tabButtons.length;
      if (e.key === "ArrowLeft") newIndex = (i - 1 + tabButtons.length) % tabButtons.length;
      if (newIndex !== null) {
        e.preventDefault();
        tabButtons[newIndex].focus();
        activateTab(tabButtons[newIndex]);
      }
    });
  });

  /* ------------------------------------------------------------------ */
  /* Review carousel — autoplay, pauses on hover/focus/reduced-motion    */
  /* ------------------------------------------------------------------ */
  var slides = Array.prototype.slice.call(document.querySelectorAll(".review-slide"));
  var dotsWrap = document.getElementById("reviewDots");
  var prevBtn = document.getElementById("reviewPrev");
  var nextBtn = document.getElementById("reviewNext");
  var current = 0;
  var timer = null;
  var AUTOPLAY_MS = 6000;

  slides.forEach(function (_, i) {
    var dot = document.createElement("button");
    dot.className = "review-dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", "Show review " + (i + 1));
    dot.setAttribute("aria-current", i === 0 ? "true" : "false");
    dot.addEventListener("click", function () {
      goTo(i);
      restartAutoplay();
    });
    dotsWrap.appendChild(dot);
  });

  var dots = Array.prototype.slice.call(dotsWrap.children);

  function goTo(index) {
    slides[current].classList.remove("is-active");
    slides[current].setAttribute("hidden", "");
    dots[current].setAttribute("aria-current", "false");

    current = (index + slides.length) % slides.length;

    slides[current].removeAttribute("hidden");
    // force reflow so the transition replays
    void slides[current].offsetWidth;
    slides[current].classList.add("is-active");
    dots[current].setAttribute("aria-current", "true");
  }

  function startAutoplay() {
    if (reduceMotion) return;
    stopAutoplay();
    timer = window.setInterval(function () {
      goTo(current + 1);
    }, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  prevBtn.addEventListener("click", function () {
    goTo(current - 1);
    restartAutoplay();
  });

  nextBtn.addEventListener("click", function () {
    goTo(current + 1);
    restartAutoplay();
  });

  var carousel = document.querySelector(".review-carousel");
  ["mouseenter", "focusin"].forEach(function (evt) {
    carousel.addEventListener(evt, stopAutoplay);
  });
  ["mouseleave", "focusout"].forEach(function (evt) {
    carousel.addEventListener(evt, startAutoplay);
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  startAutoplay();

  /* ------------------------------------------------------------------ */
  /* Footer year                                                         */
  /* ------------------------------------------------------------------ */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------ */
  /* Square booking link placeholder notice                              */
  /* ------------------------------------------------------------------ */
  var squareLink = document.getElementById("squareBookingLink");
  if (squareLink) {
    squareLink.addEventListener("click", function (e) {
      if (squareLink.getAttribute("href") === "#") {
        e.preventDefault();
        window.alert(
          "Online booking isn't connected yet. Once you have your Square Appointments booking link, add it to the \"Book on Square\" button in index.html."
        );
      }
    });
  }
})();
