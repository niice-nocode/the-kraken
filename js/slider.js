document.addEventListener('DOMContentLoaded', () => {
  class QuoteSlider {
    constructor(el) {
      this.wrapper = el;
      this.items = [...el.querySelectorAll('[data-quote-item]')];
      this.progress = el.querySelector('[data-quote-progress]');
      this.current = 0;
      this.duration = parseFloat(el.dataset.quoteSlider) || 2;
      this.isAnimating = false;
      if (this.items.length < 2) return;
      this.init();
    }
    init() {
      this.items.forEach((item, i) => {
        gsap.set(item, { position:'absolute', top:0, left:0, width:'100%', opacity:i===0?1:0, visibility:i===0?'visible':'hidden' });
        this.splitText(item.querySelector('[data-quote-text]'));
        this.splitText(item.querySelector('[data-quote-subtitle]'));
      });
      this.showSlide(0);
      this.startProgress();
    }
    splitText(el) {
      if (!el) return;
      const text = el.textContent;
      el.innerHTML = '';
      text.split(' ').forEach((word, i, arr) => {
        const wrap = document.createElement('span');
        wrap.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:0.1em;';
        const inner = document.createElement('span');
        inner.style.cssText = 'display:inline-block;';
        inner.textContent = word;
        inner.dataset.char = '';
        wrap.appendChild(inner);
        el.appendChild(wrap);
        if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
      });
    }
    startProgress() {
      gsap.fromTo(this.progress, {scaleX:0}, {scaleX:1, duration:this.duration, ease:'none', transformOrigin:'left center', onComplete:()=>this.next()});
    }
    next() {
      if (this.isAnimating) return;
      this.animate(this.current, (this.current + 1) % this.items.length);
    }
    animate(from, to) {
      this.isAnimating = true;
      const tl = gsap.timeline({onComplete:()=>{this.current=to;this.isAnimating=false;this.startProgress();}});
      tl.to(this.items[from].querySelectorAll('[data-char]'), {yPercent:-110, duration:0.5, ease:'power3.in', stagger:0.02});
      tl.set(this.items[from], {opacity:0, visibility:'hidden'});
      gsap.set(this.items[to].querySelectorAll('[data-char]'), {yPercent:110});
      tl.set(this.items[to], {opacity:1, visibility:'visible'});
      tl.to(this.items[to].querySelectorAll('[data-char]'), {yPercent:0, duration:0.6, ease:'power3.out', stagger:0.02});
    }
    showSlide(i) { gsap.set(this.items[i].querySelectorAll('[data-char]'), {yPercent:0}); }
  }
  document.querySelectorAll('[data-quote-slider]').forEach(el => new QuoteSlider(el));
});