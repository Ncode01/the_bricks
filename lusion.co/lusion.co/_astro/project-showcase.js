(function () {
  "use strict";

  var toggle = document.querySelector(".showcase-menu-toggle");
  var nav = document.querySelector(".showcase-nav");

  if (!toggle || !nav) {
    return;
  }

  function closeMenu() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  document.addEventListener("click", function (event) {
    if (!nav.classList.contains("is-open")) {
      return;
    }

    if (nav.contains(event.target) || toggle.contains(event.target)) {
      return;
    }

    closeMenu();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 812) {
      closeMenu();
    }
  });
})();
