/* Shared navigation, case-study controls and comparisons. */
(function () {
  "use strict";

  var nav = document.getElementById("myTopnav");
  function closeMenu(returnFocus) {
    if (!nav) return;
    nav.classList.remove("responsive");
    var toggle = nav.querySelector(".icon");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation menu");
      if (returnFocus) toggle.focus();
    }
  }

  window.myFunction = function () {
    if (!nav) return;
    var open = nav.classList.toggle("responsive");
    var toggle = nav.querySelector(".icon");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  };

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav && nav.classList.contains("responsive")) {
      closeMenu(true);
    }
  });
  window.matchMedia("(min-width: 781px)").addEventListener("change", function (event) {
    if (event.matches) closeMenu(false);
  });

  window.jumpToSection = function (id) {
    var section = document.getElementById(id);
    if (!section) return;
    var heading = section.querySelector("h1, h2, h3") || section;
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
    section.scrollIntoView({
      behavior: "instant",
      block: "start",
    });
  };

  // Retained for existing inline controls; active sections are observed below.
  window.setActiveView = function (button, id) {
    var current = id || (button && button.dataset.section);
    document.querySelectorAll(".SkipIcon").forEach(function (control) {
      var active = control.dataset.section === current;
      control.classList.toggle("active", active);
      if (active) control.setAttribute("aria-current", "location");
      else control.removeAttribute("aria-current");
    });
  };

  window.initComparisons = function () {
    document.querySelectorAll(".img-comp-container").forEach(function (container, index) {
      if (container.dataset.initialized) return;
      container.dataset.initialized = "true";
      var base = container.querySelector(".img-comp-img:not(.img-comp-overlay) img");
      var before = container.querySelector(".img-comp-overlay img");
      if (!base || !before) return;
      // Keep the image, range and links together even inside Bootstrap flex rows.
      var widget = document.createElement("figure");
      widget.className = "comparisonWidget";
      container.before(widget);
      widget.appendChild(container);
      var section = container.closest("section");
      var heading = section && section.querySelector("h2, h3");
      var name = heading ? heading.textContent.trim() : "Design comparison " + (index + 1);
      var range = document.createElement("input");
      range.type = "range";
      range.min = "0";
      range.max = "100";
      range.value = "50";
      range.className = "img-comp-range";
      range.setAttribute("aria-label", name + ": before and after");
      function update() {
        container.style.setProperty("--split", range.value + "%");
        range.setAttribute(
          "aria-valuetext",
          range.value + "% before, " + (100 - Number(range.value)) + "% after"
        );
      }
      range.addEventListener("input", update);
      container.after(range);
      update();
      var links = document.createElement("p");
      links.className = "comparisonLinks";
      [
        [before, "View full before image"],
        [base, "View full after image"],
      ].forEach(function (item) {
        var link = document.createElement("a");
        link.href = item[0].src;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = item[1];
        link.setAttribute(
          "aria-label",
          name + ": " + item[1].toLowerCase() + " (opens in a new tab)"
        );
        links.appendChild(link);
      });
      range.after(links);
    });
  };

  function initialize() {
    window.initComparisons();
    document.querySelectorAll(".SkipIcon").forEach(function (control) {
      var match = (control.getAttribute("onclick") || "").match(/jumpToSection\('([^']+)'\)/);
      if (match) control.dataset.section = match[1];
      var label = control.parentElement.querySelector("p");
      if (label) {
        control.setAttribute("aria-label", "Jump to " + label.textContent.trim());
        control.removeAttribute("title");
      }
    });
    var sectionNav = document.querySelector(".skipBtns");
    if (sectionNav) {
      sectionNav.setAttribute("role", "navigation");
      sectionNav.setAttribute("aria-label", "Case study sections");
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) window.setActiveView(null, entry.target.id);
          });
        },
        { rootMargin: "-15% 0px -60% 0px", threshold: 0 }
      );
      ["start", "research", "design", "final"].forEach(function (id) {
        var section = document.getElementById(id);
        if (section) observer.observe(section);
      });
    }

    document.querySelectorAll(".carousel").forEach(function (carousel) {
      var section = carousel.closest("section");
      var heading = section && section.querySelector("h2, h3, h4, h5");
      var label = heading ? heading.textContent.trim() : "Project images";
      carousel.setAttribute("role", "region");
      carousel.setAttribute("aria-roledescription", "carousel");
      carousel.setAttribute("aria-label", label);
      var status = document.createElement("p");
      status.className = "carouselStatus";
      status.setAttribute("role", "status");
      carousel.after(status);
      var slides = carousel.querySelectorAll(".carousel-item");
      function update() {
        var activeIndex = 0;
        slides.forEach(function (slide, index) {
          var active = slide.classList.contains("active");
          slide.setAttribute("aria-hidden", String(!active));
          slide.inert = !active;
          if (active) activeIndex = index;
        });
        status.textContent = "Slide " + (activeIndex + 1) + " of " + slides.length;
      }
      update();
      carousel.querySelectorAll("[data-slide]").forEach(function (control) {
        control.setAttribute(
          "aria-label",
          (control.dataset.slide === "next" ? "Next" : "Previous") + " slide: " + label
        );
      });
      if (window.jQuery) {
        window.jQuery(carousel).carousel({ interval: false });
        window.jQuery(carousel).on("slid.bs.carousel", update);
      }
    });

    document.querySelectorAll("[data-persona-card]").forEach(function (card) {
      var heading = card.querySelector(".personaCard__name");
      var name = heading ? heading.textContent.trim() : "this persona";
      var front = card.querySelector(".personaCard__face--front");
      var back = card.querySelector(".personaCard__face--back");
      if (!front || !back) return;
      back.inert = true;
      card.querySelectorAll("[data-persona-toggle]").forEach(function (button) {
        button.setAttribute(
          "aria-label",
          (front.contains(button) ? "Read more about " : "Return to summary for ") + name
        );
        button.addEventListener("click", function () {
          var flipped = card.classList.contains("is-flipped");
          front.inert = flipped;
          back.inert = !flipped;
          var visible = flipped ? back : front;
          var next = visible.querySelector("button");
          if (next) next.focus({ preventScroll: true });
        });
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize);
  else initialize();
})();
