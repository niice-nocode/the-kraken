(function () {
  "use strict";

  function initImageReveal() {
    const elements = document.querySelectorAll('[data-gsap="img"]');

    if (!elements.length) return;

    gsap.registerPlugin(ScrollTrigger);

    elements.forEach((el) => {
      gsap.set(el, { clipPath: "inset(0% 0% 100% 0%)" });

      gsap.to(el, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: el,
          start: "top 95%",
          once: true,
        },
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initImageReveal);
  } else {
    initImageReveal();
  }
})();
