(function () {
  "use strict";

  // Utiliser des fonctions fléchées pour la cohérence
  const select = (el, all = false) => {
    el = el.trim();
    return all ? [...document.querySelectorAll(el)] : document.querySelector(el);
  };

  const on = (type, el, listener, all = false) => {
    const selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  const onscroll = (el, listener) => el.addEventListener("scroll", listener);

  const navbarlinksActive = () => {
    const navbarlinks = select("#navbar .scrollto", true);
    const position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      const section = select(navbarlink.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };

  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  const scrollto = (el) => {
    const header = select("#header");
    const offset = header ? header.offsetHeight : 0;
    const elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: "smooth",
    });
  };

  // Header scroll class
  const headerScrolled = () => {
    const selectHeader = select("#header");
    const selectTopbar = select("#topbar");
    if (selectHeader) {
      if (window.scrollY > 100) {
        selectHeader.classList.add("header-scrolled");
        selectTopbar?.classList.add("topbar-scrolled");
      } else {
        selectHeader.classList.remove("header-scrolled");
        selectTopbar?.classList.remove("topbar-scrolled");
      }
    }
  };

  window.addEventListener("load", headerScrolled);
  onscroll(document, headerScrolled);

  // Mobile nav toggle
  on("click", ".mobile-nav-toggle", function (e) {
    select("#navbar").classList.toggle("navbar-mobile");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  // Scroll with offset on links with a class name .scrollto
  on("click", ".scrollto", function (e) {
    if (select(this.hash)) {
      e.preventDefault();
      const navbar = select("#navbar");
      if (navbar.classList.contains("navbar-mobile")) {
        navbar.classList.remove("navbar-mobile");
        const navbarToggle = select(".mobile-nav-toggle");
        navbarToggle.classList.toggle("bi-list");
        navbarToggle.classList.toggle("bi-x");
      }
      scrollto(this.hash);
    }
  }, true);

  // Scroll with offset on page load with hash links in the URL
  window.addEventListener("load", () => {
    if (window.location.hash && select(window.location.hash)) {
      scrollto(window.location.hash);
    }
  });

  // Back to top button
  const backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      backtotop.classList.toggle("active", window.scrollY > 100);
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  // Médiathèque
  document.addEventListener("DOMContentLoaded", function() {
    const videosUrl = "/path/to/your/videos.json"; // Remplacez par le chemin vers vos données vidéo
    const playlistContainer = document.querySelector("#playlist-videos");

    function createVideoElement(video) {
      const videoElement = document.createElement("div");
      videoElement.className = "col-md-4 mb-4";
      videoElement.innerHTML = `
        <div class="card">
          <img src="${video.thumbnail}" class="card-img-top" alt="${video.title}">
          <div class="card-body">
            <h5 class="card-title">${video.title}</h5>
            <p class="card-text">${video.description}</p>
            <a href="${video.url}" class="btn btn-primary" target="_blank">Regarder</a>
          </div>
        </div>
      `;
      return videoElement;
    }

    fetch(videosUrl)
      .then(response => response.json())
      .then(videos => {
        videos.forEach(video => {
          const videoElement = createVideoElement(video);
          playlistContainer.appendChild(videoElement);
        });
      })
      .catch(error => console.error("Erreur lors du chargement des vidéos:", error));
  });
})();