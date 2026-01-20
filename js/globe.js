function initAcceleratingGlobe() {
  document.querySelectorAll('[data-accelerating-globe]').forEach(function(globe) {
    const circles = globe.querySelectorAll('[data-accelerating-globe-circle]');
    if (circles.length < 8) return; // Min 8

    const tl = gsap.timeline({
      repeat: -1,
      defaults: { duration: 1, ease: "none" }
    });

    const widths = [
      ["50%", "37.5%"],
      ["37.5%", "25%"],
      ["25%", "12.5%"],
      ["calc(12.5% + 1px)", "calc(0% + 1px)"],
      ["calc(0% + 1px)", "calc(12.5% + 1px)"],
      ["12.5%", "25%"],
      ["25%", "37.5%"],
      ["37.5%", "50%"]
    ];

    circles.forEach((el, i) => {
      const [fromW, toW] = widths[i];
      tl.fromTo(el, { width: fromW }, { width: toW }, i === 0 ? 0 : "<");
    });

    let lastY = window.scrollY;
    let lastT = performance.now();
    let stopTimeout;

    function onScroll() {
      const now = performance.now();
      const dy = window.scrollY - lastY;
      const dt = now - lastT;
      lastY = window.scrollY;
      lastT = now;

      const velocity = dt > 0 ? (dy / dt) * 1000 : 0; // px/s
      const boost = Math.abs(velocity * 0.005);
      const targetScale = boost + 1;

      tl.timeScale(targetScale);

      clearTimeout(stopTimeout);
      stopTimeout = setTimeout(() => {
        gsap.to(tl, {
          timeScale: 1,
          duration: 0.6,
          ease: "power2.out",
          overwrite: true
        });
      }, 100);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
  });
}

// Initialize Accelerating Globe on Scroll
document.addEventListener('DOMContentLoaded', function() {
  initAcceleratingGlobe();
});