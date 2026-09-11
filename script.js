"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     HELPERS
  ========================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const prefersReducedMotion = () =>
    reducedMotionQuery.matches;


  /* =========================================================
     ELEMENTS
  ========================================================= */

  const body = document.body;
  const html = document.documentElement;

  const header = $(".header");
  const nav = $("#nav");
  const menuBtn = $("#menuBtn");

  const progress =
    $(".scroll-progress") ||
    $("#progress");

  const backToTop = $("#backToTop");

  const sections = $$("main section[id]");

  const navLinks = nav
    ? $$('a[href^="#"]', nav)
    : [];

  const typingText = $("#typingText");

  const filterButtons = $$(".project-filter");
  const projectItems = $$(
    ".portfolio-item[data-category]"
  );

  const videoModal = $("#videoModal");
  const videoPlayer = $("#projectVideo");
  const videoError = $("#videoError");

  const videoCloseButtons = videoModal
    ? $$(".video-close", videoModal)
    : [];

  const contactForm = $("#contactForm");
  const formStatus = $("#formStatus");


  /* =========================================================
     PAGE INITIALIZATION
  ========================================================= */

  html.classList.add("js");

  const initializePage = () => {

    body.classList.add("page-loaded");
    body.classList.add("site-ready");

    if (header) {
      header.classList.add("header-open");
    }

    const hero =
      $(".profile-hero") ||
      $(".hero");

    if (hero) {
      hero.classList.add("hero-open");
    }

    /*
      Small delay allows the browser to paint the
      initial state before the final animation state.
    */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        body.classList.add(
          "page-animation-complete"
        );
      });
    });
  };


  if (document.readyState === "complete") {
    initializePage();
  } else {
    window.addEventListener(
      "load",
      initializePage,
      { once: true }
    );
  }


  /* =========================================================
     MOBILE MENU
  ========================================================= */

  const closeMenu = () => {

    if (!menuBtn || !nav) return;

    nav.classList.remove("open");

    menuBtn.setAttribute(
      "aria-expanded",
      "false"
    );

    menuBtn.setAttribute(
      "aria-label",
      "Open navigation menu"
    );

    menuBtn.textContent = "☰";
  };


  const openMenu = () => {

    if (!menuBtn || !nav) return;

    nav.classList.add("open");

    menuBtn.setAttribute(
      "aria-expanded",
      "true"
    );

    menuBtn.setAttribute(
      "aria-label",
      "Close navigation menu"
    );

    menuBtn.textContent = "✕";
  };


  const toggleMenu = () => {

    if (!menuBtn || !nav) return;

    const isOpen =
      nav.classList.contains("open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };


  if (menuBtn && nav) {

    menuBtn.setAttribute(
      "aria-expanded",
      "false"
    );

    menuBtn.setAttribute(
      "aria-label",
      "Open navigation menu"
    );

    menuBtn.addEventListener(
      "click",
      toggleMenu
    );


    $$("a", nav).forEach((link) => {

      link.addEventListener(
        "click",
        () => {
          closeMenu();
        }
      );

    });


    document.addEventListener(
      "click",
      (event) => {

        if (
          !nav.contains(event.target) &&
          !menuBtn.contains(event.target)
        ) {
          closeMenu();
        }

      }
    );


    document.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Escape" &&
          nav.classList.contains("open")
        ) {
          closeMenu();
          menuBtn.focus();
        }

      }
    );

  }


  /* =========================================================
     HEADER SCROLL STATE
  ========================================================= */

  const updateHeader = () => {

    if (!header) return;

    header.classList.toggle(
      "scrolled",
      window.scrollY > 30
    );

  };


  /* =========================================================
     SCROLL PROGRESS
  ========================================================= */

  const updateProgress = () => {

    if (!progress) return;

    const scrollTop = window.scrollY;

    const scrollHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const percentage =
      scrollHeight > 0
        ? (scrollTop / scrollHeight) * 100
        : 0;

    progress.style.width =
      `${Math.min(100, Math.max(0, percentage))}%`;

  };


  /* =========================================================
     BACK TO TOP
  ========================================================= */

  const updateBackToTop = () => {

    if (!backToTop) return;

    backToTop.classList.toggle(
      "show",
      window.scrollY > 500
    );

  };


  if (backToTop) {

    backToTop.addEventListener(
      "click",
      () => {

        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion()
            ? "auto"
            : "smooth"
        });

      }
    );

  }


  /* =========================================================
     ACTIVE NAVIGATION
  ========================================================= */

  const updateActiveNav = () => {

    if (
      !sections.length ||
      !navLinks.length
    ) {
      return;
    }

    const scrollPosition =
      window.scrollY +
      (header ? header.offsetHeight + 80 : 150);

    let currentId =
      sections[0]?.id || "";

    sections.forEach((section) => {

      if (
        scrollPosition >= section.offsetTop
      ) {
        currentId = section.id;
      }

    });


    navLinks.forEach((link) => {

      const href =
        link.getAttribute("href");

      const isActive =
        href === `#${currentId}`;

      link.classList.toggle(
        "current",
        isActive
      );

      if (isActive) {

        link.setAttribute(
          "aria-current",
          "page"
        );

      } else {

        link.removeAttribute(
          "aria-current"
        );

      }

    });

  };


  /* =========================================================
     OPTIMIZED SCROLL
  ========================================================= */

  let scrollTicking = false;

  const handleScroll = () => {

    if (scrollTicking) return;

    scrollTicking = true;

    requestAnimationFrame(() => {

      updateHeader();
      updateProgress();
      updateBackToTop();
      updateActiveNav();

      scrollTicking = false;

    });

  };


  updateHeader();
  updateProgress();
  updateBackToTop();
  updateActiveNav();


  window.addEventListener(
    "scroll",
    handleScroll,
    {
      passive: true
    }
  );


  /* =========================================================
     SMOOTH ANCHOR SCROLL
  ========================================================= */

  $$('a[href^="#"]').forEach((link) => {

    link.addEventListener(
      "click",
      (event) => {

        const targetId =
          link.getAttribute("href");

        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }

        let target = null;

        try {
          target = document.querySelector(
            targetId
          );
        } catch {
          return;
        }

        if (!target) return;

        event.preventDefault();

        const headerHeight =
          header
            ? header.offsetHeight
            : 0;

        const targetPosition =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          16;

        window.scrollTo({

          top: Math.max(
            0,
            targetPosition
          ),

          behavior:
            prefersReducedMotion()
              ? "auto"
              : "smooth"

        });

        closeMenu();

      }
    );

  });


  /* =========================================================
     SCROLL REVEAL
  ========================================================= */

  const animatedElements = $$(
    [
      ".reveal",
      ".reveal-left",
      ".reveal-right",
      ".reveal-zoom",
      ".scroll-animate",
      ".scroll-left",
      ".scroll-right"
    ].join(", ")
  );


  const showElement = (element) => {

    if (!element) return;

    element.classList.add(
      "active",
      "visible",
      "is-visible",
      "show"
    );

  };


  /*
    Hero elements should never wait for
    IntersectionObserver.
  */

  const heroElements = $$(
    "#home .reveal, " +
    "#home .reveal-left, " +
    "#home .reveal-right, " +
    "#home .reveal-zoom"
  );


  heroElements.forEach((element) => {
    showElement(element);
  });


  const scrollElements =
    animatedElements.filter(
      (element) =>
        !heroElements.includes(element)
    );


  if (
    prefersReducedMotion() ||
    !("IntersectionObserver" in window)
  ) {

    scrollElements.forEach(
      showElement
    );

  } else if (scrollElements.length) {

    const observer =
      new IntersectionObserver(
        (entries, observerInstance) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            showElement(
              entry.target
            );

            observerInstance.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.08,
          rootMargin:
            "0px 0px -50px 0px"
        }
      );


    scrollElements.forEach(
      (element) => {

        observer.observe(
          element
        );

      }
    );

  }


  /*
    Safety fallback.
    Prevents hidden content if an observer
    fails on an unusual browser/device.
  */

  window.setTimeout(() => {

    scrollElements.forEach(
      showElement
    );

  }, 3000);


  /* =========================================================
     TYPING EFFECT
  ========================================================= */

  if (typingText) {

    const words =
      (typingText.dataset.texts || "")
        .split("|")
        .map((text) => text.trim())
        .filter(Boolean);


    if (words.length) {

      if (prefersReducedMotion()) {

        typingText.textContent =
          words[0];

      } else {

        let wordIndex = 0;
        let charIndex = 0;
        let deleting = false;

        const typeText = () => {

          const currentWord =
            words[wordIndex];

          typingText.textContent =
            currentWord.substring(
              0,
              charIndex
            );


          let delay = 75;


          if (!deleting) {

            if (
              charIndex <
              currentWord.length
            ) {

              charIndex++;
              delay = 72;

            } else {

              deleting = true;
              delay = 1800;

            }

          } else {

            if (charIndex > 0) {

              charIndex--;
              delay = 38;

            } else {

              deleting = false;

              wordIndex =
                (wordIndex + 1) %
                words.length;

              delay = 350;

            }

          }


          window.setTimeout(
            typeText,
            delay
          );

        };


        typeText();

      }

    }

  }


  /* =========================================================
     PROJECT FILTER
  ========================================================= */

  const setFilterState = (
    selectedFilter
  ) => {

    filterButtons.forEach(
      (button) => {

        const active =
          (
            button.dataset.filter ||
            "all"
          ) === selectedFilter;

        button.classList.toggle(
          "is-active",
          active
        );

        button.setAttribute(
          "aria-pressed",
          String(active)
        );

      }
    );


    projectItems.forEach(
      (project) => {

        const category =
          project.dataset.category ||
          "";

        const shouldShow =
          selectedFilter === "all" ||
          category === selectedFilter;


        project.classList.toggle(
          "is-hidden",
          !shouldShow
        );

        project.setAttribute(
          "aria-hidden",
          String(!shouldShow)
        );


        if (shouldShow) {

          requestAnimationFrame(() => {
            showElement(project);
          });

        }

      }
    );

  };


  filterButtons.forEach((button) => {

    button.addEventListener(
      "click",
      (event) => {

        event.preventDefault();
        event.stopPropagation();

        const filter =
          button.dataset.filter ||
          "all";

        setFilterState(filter);

      }
    );

  });


  /*
    Set initial filter.
  */

  const activeFilter =
    filterButtons.find(
      (button) =>
        button.classList.contains(
          "is-active"
        )
    );

  setFilterState(
    activeFilter?.dataset.filter ||
    "all"
  );


  /* =========================================================
     PROJECT MOUSE POSITION
     No blur / no expensive animation
  ========================================================= */

  $$(".portfolio-item").forEach(
    (card) => {

      card.addEventListener(
        "pointermove",
        (event) => {

          const rect =
            card.getBoundingClientRect();

          if (
            !rect.width ||
            !rect.height
          ) {
            return;
          }

          const x =
            (
              (event.clientX - rect.left) /
              rect.width
            ) * 100;

          const y =
            (
              (event.clientY - rect.top) /
              rect.height
            ) * 100;


          card.style.setProperty(
            "--mouse-x",
            `${x}%`
          );

          card.style.setProperty(
            "--mouse-y",
            `${y}%`
          );

        }
      );


      card.addEventListener(
        "pointerleave",
        () => {

          card.style.setProperty(
            "--mouse-x",
            "50%"
          );

          card.style.setProperty(
            "--mouse-y",
            "50%"
          );

        }
      );

    }
  );


  /* =========================================================
     VIDEO MODAL
  ========================================================= */

  let lastVideoTrigger = null;


  const getVideoURL = (source) => {

    if (!source) return "";

    try {

      return new URL(
        source,
        window.location.href
      ).href;

    } catch {

      return source;

    }

  };


  const showVideoError = () => {

    console.error(
      "Video could not be loaded."
    );

    if (!videoError) return;

    videoError.hidden = false;

    videoError.textContent =
      "動画を読み込めませんでした。動画ファイルのパスを確認してください。";

  };


  const hideVideoError = () => {

    if (!videoError) return;

    videoError.hidden = true;

    videoError.textContent = "";

  };


  const openProjectVideo = (
    source,
    trigger = null
  ) => {

    if (
      !videoModal ||
      !videoPlayer ||
      !source
    ) {

      console.warn(
        "Video source not found:",
        source
      );

      return;

    }


    lastVideoTrigger =
      trigger ||
      document.activeElement;


    const videoURL =
      getVideoURL(source);


    hideVideoError();


    try {
      videoPlayer.pause();
    } catch {}


    videoPlayer.removeAttribute(
      "src"
    );

    videoPlayer.load();


    videoPlayer.setAttribute(
      "playsinline",
      ""
    );

    videoPlayer.setAttribute(
      "webkit-playsinline",
      ""
    );

    videoPlayer.setAttribute(
      "controls",
      ""
    );


    videoPlayer.src =
      videoURL;


    videoModal.classList.add(
      "is-open"
    );

    videoModal.setAttribute(
      "aria-hidden",
      "false"
    );


    body.classList.add(
      "modal-open"
    );


    body.style.overflow =
      "hidden";


    videoPlayer.load();


    if (!prefersReducedMotion()) {

      const playVideo = () => {

        const playPromise =
          videoPlayer.play();

        if (
          playPromise &&
          typeof playPromise.catch ===
          "function"
        ) {

          playPromise.catch(
            (error) => {

              console.log(
                "Autoplay prevented:",
                error
              );

            }
          );

        }

      };


      if (
        videoPlayer.readyState >= 2
      ) {

        playVideo();

      } else {

        videoPlayer.addEventListener(
          "loadeddata",
          playVideo,
          { once: true }
        );

      }

    }

  };


  const closeProjectVideo = () => {

    if (
      !videoModal ||
      !videoPlayer
    ) {
      return;
    }


    try {
      videoPlayer.pause();
    } catch {}


    try {
      videoPlayer.currentTime = 0;
    } catch {}


    videoPlayer.removeAttribute(
      "src"
    );

    videoPlayer.load();


    videoModal.classList.remove(
      "is-open"
    );

    videoModal.setAttribute(
      "aria-hidden",
      "true"
    );


    body.classList.remove(
      "modal-open"
    );


    body.style.overflow = "";


    hideVideoError();


    if (
      lastVideoTrigger &&
      document.contains(lastVideoTrigger) &&
      typeof lastVideoTrigger.focus ===
      "function"
    ) {

      try {
        lastVideoTrigger.focus();
      } catch {}

    }


    lastVideoTrigger = null;

  };


  /* =========================================================
     PROJECT DATA HELPERS
  ========================================================= */

  const getCardVideoSource = (
    card
  ) => {

    if (!card) return "";

    if (card.dataset.video) {
      return card.dataset.video;
    }


    const videoElement =
      card.querySelector(
        "[data-video]"
      );


    if (
      videoElement &&
      videoElement.dataset.video
    ) {

      return videoElement.dataset.video;

    }


    return "";

  };


  const getCardLink = (
    card
  ) => {

    if (!card) return "";

    if (card.dataset.link) {
      return card.dataset.link;
    }


    const projectLink =
      card.querySelector(
        "a.project-btn[href]"
      );


    if (projectLink) {
      return projectLink.href;
    }


    return "";

  };


  const openProjectLink = (
    link,
    card
  ) => {

    if (!link) return;


    const anchor =
      card?.querySelector(
        "a.project-btn[href]"
      );


    const openNewTab =
      anchor &&
      anchor.target === "_blank";


    if (openNewTab) {

      window.open(
        link,
        "_blank",
        "noopener,noreferrer"
      );

    } else {

      window.location.href =
        link;

    }

  };


  const openProject = (
    card,
    trigger
  ) => {

    if (!card) return;


    const videoSource =
      getCardVideoSource(card);

    const projectLink =
      getCardLink(card);


    /*
      Priority:
      Video → Project link
    */

    if (videoSource) {

      openProjectVideo(
        videoSource,
        trigger || card
      );

      return;

    }


    if (projectLink) {

      openProjectLink(
        projectLink,
        card
      );

    }

  };


  /* =========================================================
     PROJECT CARD INTERACTION
  ========================================================= */

  $$(".portfolio-item").forEach(
    (card) => {

      const videoSource =
        getCardVideoSource(card);

      const projectLink =
        getCardLink(card);


      if (
        !videoSource &&
        !projectLink
      ) {
        return;
      }


      card.style.cursor =
        "pointer";


      if (
        !card.hasAttribute(
          "tabindex"
        )
      ) {

        card.setAttribute(
          "tabindex",
          "0"
        );

      }


      /*
        Only add button role if the card
        is acting as a clickable card.
      */

      card.setAttribute(
        "role",
        "button"
      );


      card.addEventListener(
        "click",
        (event) => {

          const clickedLink =
            event.target.closest(
              "a[href]"
            );


          if (clickedLink) {
            return;
          }


          const clickedVideo =
            event.target.closest(
              "[data-video]"
            );


          if (clickedVideo) {
            return;
          }


          event.preventDefault();


          openProject(
            card,
            card
          );

        }
      );


      card.addEventListener(
        "keydown",
        (event) => {

          if (
            event.key !== "Enter" &&
            event.key !== " "
          ) {
            return;
          }


          event.preventDefault();


          openProject(
            card,
            card
          );

        }
      );

    }
  );


  /* =========================================================
     DIRECT VIDEO BUTTONS
  ========================================================= */

  $$("[data-video]").forEach(
    (button) => {

      /*
        Ignore elements that are only
        data attributes on a parent card.
      */

      if (
        button.classList.contains(
          "portfolio-item"
        )
      ) {
        return;
      }


      button.addEventListener(
        "click",
        (event) => {

          event.preventDefault();
          event.stopPropagation();


          const source =
            button.dataset.video;


          openProjectVideo(
            source,
            button
          );

        }
      );

    }
  );


  /* =========================================================
     PROJECT LINKS
  ========================================================= */

  $$(".portfolio-item a[href]").forEach(
    (link) => {

      link.addEventListener(
        "click",
        (event) => {

          event.stopPropagation();

        }
      );

    }
  );


  /* =========================================================
     VIDEO CLOSE BUTTONS
  ========================================================= */

  videoCloseButtons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        (event) => {

          event.preventDefault();
          event.stopPropagation();

          closeProjectVideo();

        }
      );

    }
  );


  /* =========================================================
     CLICK OUTSIDE VIDEO
  ========================================================= */

  if (videoModal) {

    videoModal.addEventListener(
      "click",
      (event) => {

        if (
          event.target ===
          videoModal
        ) {

          closeProjectVideo();

        }

      }
    );

  }


  /* =========================================================
     ESCAPE → CLOSE VIDEO
  ========================================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        videoModal?.classList.contains(
          "is-open"
        )
      ) {

        closeProjectVideo();

      }

    }
  );


  /* =========================================================
     VIDEO EVENTS
  ========================================================= */

  if (videoPlayer) {

    videoPlayer.addEventListener(
      "error",
      () => {

        console.error(
          "Video error:",
          videoPlayer.currentSrc,
          videoPlayer.error
        );

        showVideoError();

      }
    );


    videoPlayer.addEventListener(
      "loadedmetadata",
      () => {

        console.log(
          "Video metadata loaded:",
          videoPlayer.currentSrc
        );

      }
    );

  }


  /* =========================================================
     RIPPLE EFFECT
  ========================================================= */

  const createRipple = (
    button,
    event
  ) => {

    if (
      !button ||
      prefersReducedMotion()
    ) {
      return;
    }


    const rect =
      button.getBoundingClientRect();


    if (
      !rect.width ||
      !rect.height
    ) {
      return;
    }


    const size =
      Math.max(
        rect.width,
        rect.height
      );


    const ripple =
      document.createElement(
        "span"
      );


    ripple.className =
      "ripple";


    ripple.style.width =
      `${size}px`;

    ripple.style.height =
      `${size}px`;


    ripple.style.left =
      `${event.clientX -
        rect.left -
        size / 2}px`;


    ripple.style.top =
      `${event.clientY -
        rect.top -
        size / 2}px`;


    button
      .querySelector(
        ".ripple"
      )
      ?.remove();


    button.appendChild(
      ripple
    );


    ripple.addEventListener(
      "animationend",
      () => {
        ripple.remove();
      },
      { once: true }
    );

  };


  $$(".project-btn, .project-play").forEach(
    (button) => {

      button.addEventListener(
        "click",
        (event) => {

          createRipple(
            button,
            event
          );

        }
      );

    }
  );


  /* =========================================================
     CONTACT FORM
  ========================================================= */

  if (contactForm) {

    contactForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();


        const name =
          $("#name")?.value.trim() ||
          "";

        const email =
          $("#email")?.value.trim() ||
          "";

        const message =
          $("#message")?.value.trim() ||
          "";


        if (
          !name ||
          !email ||
          !message
        ) {

          if (formStatus) {

            formStatus.textContent =
              "すべての必須項目を入力してください。";

            formStatus.className =
              "form-status error";

          }

          return;

        }


        /*
          Basic email validation.
        */

        const emailPattern =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
          !emailPattern.test(email)
        ) {

          if (formStatus) {

            formStatus.textContent =
              "正しいメールアドレスを入力してください。";

            formStatus.className =
              "form-status error";

          }

          return;

        }


        const subject =
          encodeURIComponent(
            `Portfolio Contact from ${name}`
          );


        const bodyText =
          [
            `お名前: ${name}`,
            `メールアドレス: ${email}`,
            "",
            "お問い合わせ内容:",
            message
          ].join("\n");


        const body =
          encodeURIComponent(
            bodyText
          );


        if (formStatus) {

          formStatus.textContent =
            "メールアプリを開いています...";

          formStatus.className =
            "form-status success";

        }


        const mailto =
          "mailto:mr25304046@ga.ttc.ac.jp" +
          `?subject=${subject}` +
          `&body=${body}`;


        window.location.href =
          mailto;


        window.setTimeout(() => {

          contactForm.reset();

        }, 500);

      }
    );

  }


  /* =========================================================
     RESIZE HANDLING
  ========================================================= */

  let resizeTimer = null;


  window.addEventListener(
    "resize",
    () => {

      clearTimeout(
        resizeTimer
      );


      resizeTimer =
        window.setTimeout(() => {

          updateProgress();
          updateActiveNav();


          if (
            window.innerWidth > 900
          ) {

            closeMenu();

          }

        }, 150);

    },
    {
      passive: true
    }
  );


  /* =========================================================
     VISIBILITY CHANGE
  ========================================================= */

  document.addEventListener(
    "visibilitychange",
    () => {

      /*
        Pause project video when user
        switches browser tab.
      */

      if (
        document.hidden &&
        videoPlayer
      ) {

        try {
          videoPlayer.pause();
        } catch {}

      }

    }
  );


  /* =========================================================
     REDUCED MOTION CHANGE
  ========================================================= */

  if (
    typeof reducedMotionQuery.addEventListener ===
    "function"
  ) {

    reducedMotionQuery.addEventListener(
      "change",
      () => {

        if (prefersReducedMotion()) {

          animatedElements.forEach(
            showElement
          );

          if (typingText) {

            const words =
              (typingText.dataset.texts || "")
                .split("|")
                .map(
                  (text) =>
                    text.trim()
                )
                .filter(Boolean);

            if (words.length) {
              typingText.textContent =
                words[0];
            }

          }

        }

      }
    );

  }


  /* =========================================================
     FINAL INITIAL UPDATE
  ========================================================= */

  updateHeader();
  updateProgress();
  updateBackToTop();
  updateActiveNav();

});