/* ============================================
   RENTHLY - MAIN.JS
   Scroll Animations & Interactions
   ============================================ */

(function() {
  'use strict';

  /* ─── Intersection Observer Config ─── */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  /* ─── Animation Types Map ─── */
  const animationMap = {
    'pan-up': 'panInUp',
    'pan-down': 'panInDown',
    'pan-left': 'panInLeft',
    'pan-right': 'panInRight',
    'pop-up': 'popUp',
    'pop-spring': 'popInSpring',
    'fade': 'fadeIn'
  };

  /* ─── Stagger Groups ─── */
  const staggerGroups = new Map();

  /* ─── Main Observer ─── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;

        // Check for stagger group
        const groupName = el.dataset.staggerGroup;
        if (groupName) {
          handleStaggerGroup(groupName, el);
        } else {
          triggerAnimation(el);
        }

        // Unobserve after animation triggers (unless repeat is set)
        if (!el.dataset.repeat) {
          observer.unobserve(el);
        }
      }
    });
  }, observerOptions);

  /* ─── Trigger Single Element Animation ─── */
  function triggerAnimation(el) {
    const animType = el.dataset.anim || 'pan-up';
    const delay = parseFloat(el.dataset.animDelay) || 0;
    const duration = parseFloat(el.dataset.animDuration) || 0;

    // Apply animation via inline style for dynamic control
    const animName = animationMap[animType] || animationMap['pan-up'];

    el.style.animationDelay = delay + 's';
    if (duration > 0) {
      el.style.animationDuration = duration + 's';
    }
    el.style.animationFillMode = 'forwards';
    el.style.animationTimingFunction = 'cubic-bezier(0.16, 1, 0.3, 1)';
    el.style.animationName = animName;

    // Add visible class for CSS fallback
    el.classList.add('anim-visible');

    // Fire custom event
    el.dispatchEvent(new CustomEvent('anim:start', { detail: { type: animType } }));

    // Clean up animation style after it completes
    const totalDuration = (duration || getDefaultDuration(animType)) + delay;
    setTimeout(() => {
      el.style.animationName = '';
      el.style.animationDelay = '';
      el.style.animationDuration = '';
      el.dispatchEvent(new CustomEvent('anim:end'));
    }, totalDuration * 1000 + 100);
  }

  /* ─── Handle Stagger Groups ─── */
  function handleStaggerGroup(groupName, el) {
    if (!staggerGroups.has(groupName)) {
      staggerGroups.set(groupName, { elements: [], triggered: false });
    }

    const group = staggerGroups.get(groupName);
    group.elements.push(el);

    if (!group.triggered) {
      group.triggered = true;
      const staggerDelay = parseFloat(el.dataset.staggerDelay) || 0.12;
      const baseDelay = parseFloat(el.dataset.baseDelay) || 0;

      // Sort by data-stagger-index if present
      group.elements.sort((a, b) => {
        const ia = parseInt(a.dataset.staggerIndex) || 0;
        const ib = parseInt(b.dataset.staggerIndex) || 0;
        return ia - ib;
      });

      group.elements.forEach((item, index) => {
        const itemDelay = baseDelay + (index * staggerDelay);
        item.dataset.animDelay = itemDelay;
        triggerAnimation(item);
      });
    }
  }

  /* ─── Get Default Duration ─── */
  function getDefaultDuration(type) {
    const durations = {
      'pop-spring': 0.8,
      'pop-up': 0.6,
      'fade': 0.8,
      default: 0.9
    };
    return durations[type] || durations.default;
  }

  /* ─── Initialize Animations ─── */
  function initAnimations() {
    // Find all elements with data-anim or data-stagger-group
    const animElements = document.querySelectorAll('[data-anim], [data-stagger-group]');
    animElements.forEach(el => {
      el.classList.add('anim-hidden');
      observer.observe(el);
    });

    // Also observe elements with .anim-hidden that don't have data attributes
    const hiddenElements = document.querySelectorAll('.anim-hidden:not([data-anim]):not([data-stagger-group])');
    hiddenElements.forEach(el => {
      el.dataset.anim = 'pan-up';
      observer.observe(el);
    });
  }

  /* ─── Smooth Scroll for Nav Links ─── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /* ─── Nav Scroll Effect ─── */
  function initNavScroll() {
    const nav = document.querySelector('.dynamic-island');
    if (!nav) return;

    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScroll = window.scrollY;

          if (currentScroll > 100) {
            nav.style.background = 'rgba(20, 20, 20, 0.85)';
            nav.style.backdropFilter = 'blur(30px) saturate(1.6)';
            nav.style.borderColor = 'rgba(255, 253, 245, 0.08)';
          } else {
            nav.style.background = '';
            nav.style.backdropFilter = '';
            nav.style.borderColor = '';
          }

          lastScroll = currentScroll;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ─── Parallax Effect for Mockups ─── */
  function initParallax() {
    const heroVisuals = document.querySelector('.hero-visuals');
    if (!heroVisuals) return;

    const mockups = heroVisuals.querySelectorAll('.browser-mockup');

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroHeight = document.querySelector('.hero').offsetHeight;
          const progress = Math.min(scrollY / heroHeight, 1);

          mockups.forEach((mockup, index) => {
            const speed = (index + 1) * 0.15;
            const yOffset = scrollY * speed * 0.3;
            const currentTransform = mockup.style.transform || '';

            // Apply subtle parallax without breaking the float animation
            mockup.style.setProperty('--parallax-y', `${yOffset}px`);
          });

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ─── Mouse Move Glow Effect ─── */
  function initMouseGlow() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const horizon = hero.querySelector('.hero-horizon');
    if (!horizon) return;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const moveX = (x - 0.5) * 60;
      const moveY = (y - 0.5) * 30;

      horizon.style.transform = `translateX(calc(-50% + ${moveX}px)) translateY(${moveY}px)`;
    });

    hero.addEventListener('mouseleave', () => {
      horizon.style.transform = '';
    });
  }

  /* ─── Button Ripple Effect ─── */
  function initRipple() {
    document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: rippleEffect 0.6s ease-out;
          pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  /* ─── Add Ripple Keyframe dynamically ─── */
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes rippleEffect {
      to {
        transform: scale(2.5);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(rippleStyle);

  /* ─── Initialize Everything ─── */
  function init() {
    initAnimations();
    initSmoothScroll();
    initNavScroll();
    initParallax();
    initMouseGlow();
    initRipple();

    console.log('🚀 Renthly animations initialized');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();