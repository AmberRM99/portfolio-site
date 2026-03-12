/* Shared site scripts */

(function () {
  "use strict";

  /**
   * Toggle the responsive mobile navigation menu.
   */
  function myFunction() {
    var nav = document.getElementById("myTopnav");
    if (!nav) return;

    var toggle = nav.querySelector('.icon');
    var isOpen = nav.className !== "topnav";

    if (isOpen) {
      nav.className = "topnav";
      isOpen = false;
    } else {
      nav.className = "topnav responsive";
      isOpen = true;
    }

    if (toggle) {
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    }
  }

  window.myFunction = myFunction;
})();

function initComparisons() {
  var x, i;
  /* Find all elements with an "overlay" class: */
  x = document.getElementsByClassName("img-comp-overlay");
  for (i = 0; i < x.length; i++) {
    /* Once for each "overlay" element:
    pass the "overlay" element as a parameter when executing the compareImages function: */
    compareImages(x[i]);
  }
  function compareImages(img) {
    var range, container, w, h;

    function updateOverlay(percent) {
      var val = Number(percent);
      if (Number.isNaN(val)) val = 50;
      if (val < 0) val = 0;
      if (val > 100) val = 100;
      img.style.width = (w * (val / 100)) + "px";
    }

    function updateDimensions() {
      /* Get the width and height of the parent container (the comparison frame) */
      container = img.parentElement;
      w = container.offsetWidth;
      h = container.offsetHeight;
      /* Keep the overlay width in sync with the range input */
      updateOverlay(range.value);
    }

    /* Create a range input to control the comparison */
    range = document.createElement("input");
    range.type = "range";
    range.min = "0";
    range.max = "100";
    range.value = "50";
    range.className = "img-comp-range";
    range.setAttribute("aria-label", "Compare before and after");
    range.addEventListener("input", function (e) {
      updateOverlay(e.target.value);
    });

    /* Insert the range control below the container */
    container = img.parentElement;
    if (container && container.parentNode) {
      container.parentNode.insertBefore(range, container.nextSibling);
    }

    /* Ensure dimensions are set immediately and once the image has loaded */
    updateDimensions();
    if (!img.complete) {
      img.addEventListener('load', updateDimensions);
    }

    /* Update on window resize */
    window.addEventListener('resize', updateDimensions);
  }
}

// Auto-initialize comparison sliders once the DOM is ready.
// This ensures pages that call initComparisons() in the <head> won't fail.
if (typeof window !== 'undefined') {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initComparisons();
  } else {
    document.addEventListener('DOMContentLoaded', initComparisons);
  }
}
