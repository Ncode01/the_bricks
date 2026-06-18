(function () {
  "use strict";

  // Project cards on the home page use a special SPA zoom transition that can
  // stall on the loading overlay (100%). Force a real navigation instead.
  document.addEventListener(
    "click",
    function (e) {
      var link =
        e.target && e.target.closest
          ? e.target.closest('a.project-item[href*="/projects/"]')
          : null;
      if (!link) return;

      var href = link.getAttribute("href");
      if (!href || href.indexOf("/projects/") === -1) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      e.preventDefault();
      e.stopImmediatePropagation();
      window.location.assign(href);
    },
    true
  );

  function dismissStuckLoader() {
    var preloader = document.getElementById("preloader");
    if (!preloader || preloader.style.display === "none") return;

    var path = window.location.pathname || "";
    var onProjectDetail =
      path.indexOf("/projects/") !== -1 &&
      path !== "/projects" &&
      path !== "/projects/";

    if (!onProjectDetail) return;
    if (!document.getElementById("project-details-title")) return;

    preloader.style.display = "none";
    preloader.style.pointerEvents = "none";
    preloader.style.opacity = "0";

    var overlay = document.getElementById("transition-overlay");
    if (overlay) {
      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
    }
  }

  function scheduleLoaderDismiss() {
    [2000, 4000, 8000].forEach(function (ms) {
      window.setTimeout(dismissStuckLoader, ms);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleLoaderDismiss);
  } else {
    scheduleLoaderDismiss();
  }
})();
