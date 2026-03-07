/* Shared site scripts */

(function () {
  "use strict";

  /**
   * Toggle the responsive mobile navigation menu.
   */
  function myFunction() {
    var nav = document.getElementById("myTopnav");
    if (!nav) return;

    if (nav.className === "topnav") {
      nav.className = "topnav responsive";
    } else {
      nav.className = "topnav";
    }
  }

  window.myFunction = myFunction;
})();
