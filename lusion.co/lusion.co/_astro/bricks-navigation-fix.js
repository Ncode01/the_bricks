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
      var slug = link.getAttribute("data-id");
      if (!href) return;
      if (href.indexOf("/projects/") === -1 && href.indexOf("/showcase/") === -1) {
        return;
      }
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      e.preventDefault();
      e.stopImmediatePropagation();
      if (!slug && href.indexOf("/projects/") !== -1) {
        slug = href.split("/projects/")[1];
      } else if (!slug && href.indexOf("/showcase/") !== -1) {
        slug = href.split("/showcase/")[1];
      }
      if (slug) {
        slug = slug.replace(/^\/+|\/+$/g, "");
      }

      window.location.assign(slug ? "/showcase/" + slug + "/" : href);
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

  function normalizeProjectCardTitles() {
    var titles = document.querySelectorAll(".project-item-line-2-inner");
    titles.forEach(function (title) {
      if (!title) {
        return;
      }

      var columns = title.querySelectorAll(".project-item-line-2-inner-list");
      if (!columns.length) {
        title.setAttribute("data-normalized-title", "true");
        return;
      }

      var text = Array.prototype.map
        .call(columns, function (column) {
          var first = column.querySelector("span");
          return first ? first.textContent || "" : column.textContent || "";
        })
        .join("")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
        .replace(/([0-9])([A-Z])/g, "$1 $2")
        .replace(/([A-Z])([0-9])/g, "$1 $2")
        .replace(/\|/g, " | ")
        .replace(/-/g, " - ")
        .replace(/\s+/g, " ")
        .trim();

      if (text) {
        title.textContent = text;
      }

      title.setAttribute("data-normalized-title", "true");
    });
  }

  function scheduleProjectTitleNormalization() {
    normalizeProjectCardTitles();
    [250, 1000, 2500].forEach(function (ms) {
      window.setTimeout(normalizeProjectCardTitles, ms);
    });

    if (!window.MutationObserver || window.__bricksTitleObserverAttached) {
      return;
    }

    window.__bricksTitleObserverAttached = true;
    var observer = new MutationObserver(function () {
      normalizeProjectCardTitles();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function scheduleLoaderDismiss() {
    scheduleProjectTitleNormalization();
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
