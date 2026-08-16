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

// Kick the above-the-fold hero elements immediately on load; everything
// else (product, services, why, testimonials, faq, cta) waits for the
// IntersectionObserver above so it animates in as the user scrolls to it.
window.addEventListener('load', () => {
  requestAnimationFrame(() => {
    document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('in'));
  });
});

// ============ TIMELINE LINE DRAW-IN (services section) ============
const timelineLine = document.getElementById('timelineLine');
if (timelineLine) {
  const lineIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        lineIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  lineIo.observe(timelineLine);
}

// ============ FAQ ACCORDION ============
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // close any other open item so only one is expanded at a time
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      }
    });
    item.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
});

// ============ TESTIMONIALS HORIZONTAL SCROLL ============
const tTrack = document.getElementById('testimonialsTrack');
const tPrev = document.getElementById('tPrev');
const tNext = document.getElementById('tNext');
if (tTrack && tPrev && tNext) {
  const scrollByCard = (dir) => {
    const card = tTrack.querySelector('.t-card');
    const distance = card ? card.getBoundingClientRect().width + 28 : 300;
    tTrack.scrollBy({ left: dir * distance, behavior: 'smooth' });
  };
  tPrev.addEventListener('click', () => scrollByCard(-1));
  tNext.addEventListener('click', () => scrollByCard(1));
}

// ============ PRODUCT PANEL HORIZONTAL SCROLL ============
const pTrack = document.getElementById('productTrack');
const pPrev = document.getElementById('pPrev');
const pNext = document.getElementById('pNext');
if (pTrack && pPrev && pNext) {
  const scrollByPanel = (dir) => {
    const panel = pTrack.querySelector('.p-panel');
    const distance = panel ? panel.getBoundingClientRect().width : 300;
    pTrack.scrollBy({ left: dir * distance, behavior: 'smooth' });
  };
  pPrev.addEventListener('click', () => scrollByPanel(-1));
  pNext.addEventListener('click', () => scrollByPanel(1));
}