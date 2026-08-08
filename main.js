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