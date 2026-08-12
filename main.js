// ============ MOBILE MENU ============
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ============ REVEAL ANIMATIONS ============
// Hero is above the fold, so trigger shortly after load (staggered via --d).
// IntersectionObserver used too, so the pattern still works if reveal
// elements are ever added lower on the page.
const revealEls = document.querySelectorAll('.reveal');

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => io.observe(el));

// Kick the above-the-fold hero elements immediately on load
window.addEventListener('load', () => {
  requestAnimationFrame(() => {
    revealEls.forEach(el => el.classList.add('in'));
  });
});

// ============ SCROLL-LINKED IMAGE SEQUENCE ("reel") ============
(() => {
  const section = document.getElementById('reel');
  const pin = document.getElementById('reelPin');
  const canvas = document.getElementById('reelCanvas');
  if (!section || !pin || !canvas) return;

  const ctx = canvas.getContext('2d');
  const FRAME_COUNT = 240;
  const veil = document.getElementById('reelVeil');
  const loader = document.getElementById('reelLoader');
  const pctEl = document.getElementById('reelPct');

  const frameSrc = (i) => `assets/reel/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`;

  const images = new Array(FRAME_COUNT);
  let loadedCount = 0;
  let highestLoadedIndex = -1;
  let currentIndex = 0;
  let firstDrawn = false;

  function fitAndDraw(img) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    // cover-fit: scale image to fill the canvas, centered, cropping overflow —
    // keeps it sharp and centered on any screen size, mobile included.
    const scale = Math.max(cssW / img.naturalWidth, cssH / img.naturalHeight);
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    const dx = (cssW - drawW) / 2;
    const dy = (cssH - drawH) / 2;
    ctx.drawImage(img, dx, dy, drawW, drawH);
  }

  function draw(index) {
    currentIndex = index;
    // If the exact frame hasn't loaded yet, show the nearest earlier loaded
    // frame instead of a blank canvas — avoids flicker while streaming in.
    let i = index;
    while (i > 0 && !images[i]) i--;
    const img = images[i] || images[highestLoadedIndex];
    if (!img) return;
    fitAndDraw(img);
    if (!firstDrawn) {
      firstDrawn = true;
      canvas.classList.add('ready');
      if (loader) loader.classList.add('hidden');
    }
  }

  // Graceful fallback: if GSAP/ScrollTrigger didn't load (blocked, offline,
  // ad-blocker, etc.), don't leave a broken pinned block or an empty gap —
  // load just the first frame and show it as a plain static image at normal
  // document height so the section still looks intentional.
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    section.style.height = '100svh';
    pin.style.height = '100%';
    const img = new Image();
    img.onload = () => { images[0] = img; highestLoadedIndex = 0; draw(0); };
    img.onerror = () => { if (loader) loader.classList.add('hidden'); };
    img.src = frameSrc(0);
    if (veil) veil.style.opacity = '0';
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  for (let i = 0; i < FRAME_COUNT; i++) {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      images[i] = img;
      loadedCount++;
      if (i > highestLoadedIndex) highestLoadedIndex = i;
      if (pctEl) pctEl.textContent = Math.round((loadedCount / FRAME_COUNT) * 100);
      if (loadedCount === 1) draw(0);
    };
    img.onerror = () => { loadedCount++; };
    img.src = frameSrc(i);
  }

  window.addEventListener('resize', () => draw(currentIndex));

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    pin: pin,
    pinSpacing: false,
    scrub: 0.5, // smooths scroll -> frame mapping so it never feels stuttery
    onUpdate: (self) => {
      const idx = Math.min(FRAME_COUNT - 1, Math.floor(self.progress * FRAME_COUNT));
      draw(idx);
      // fade the veil out over the first 12% of the scroll-through so the
      // section reveals gradually instead of snapping in the instant it pins
      if (veil) veil.style.opacity = String(Math.max(0, 1 - self.progress / 0.12));
    },
  });
})();
