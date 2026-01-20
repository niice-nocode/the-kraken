function initBasicCustomCursor() {  
  gsap.set(".cursor", {xPercent: -50, yPercent: -50});
  let xTo = gsap.quickTo(".cursor", "x", {duration: 0.05, ease: "none"});
  let yTo = gsap.quickTo(".cursor", "y", {duration: 0.05, ease: "none"});
  window.addEventListener("mousemove", e => {
    xTo(e.clientX);
    yTo(e.clientY);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initBasicCustomCursor();
});