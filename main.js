/* ============================================
   RENTHLY — MAIN JAVASCRIPT
   Navbar + Hero Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initParticles();
    initScrollAnimations();
    initMockupInteractions();
});

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    // Scroll effect — shrink island on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
    
    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
    
    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && mobileMenu.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });
}

/* ============================================
   FLOATING PARTICLES
   ============================================ */
function initParticles() {
    const container = document.getElementById('particles');
    const particleCount = 25;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(container, i);
    }
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random positioning and timing
    const left = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = 6 + Math.random() * 8;
    const size = 2 + Math.random() * 3;
    
    particle.style.left = `${left}%`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random opacity variation
    particle.style.opacity = 0.3 + Math.random() * 0.5;
    
    container.appendChild(particle);
}

/* ============================================
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================ */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
        '.pan-in-up, .pan-in-left, .pan-in-right, .float-animation'
    );
    
    animatedElements.forEach(el => {
        // Pause animations initially if below fold
        if (!isElementInViewport(el)) {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        }
    });
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/* ============================================
   MOCKUP INTERACTIONS
   ============================================ */
function initMockupInteractions() {
    const mockupBig = document.querySelector('.mockup-big');
    const chartBars = document.querySelectorAll('.chart-bar');
    
    // Animate chart bars on hover over the big mockup
    if (mockupBig) {
        mockupBig.addEventListener('mouseenter', () => {
            chartBars.forEach((bar, i) => {
                setTimeout(() => {
                    bar.style.transform = 'scaleY(1.05)';
                    setTimeout(() => {
                        bar.style.transform = 'scaleY(1)';
                    }, 200);
                }, i * 50);
            });
        });
    }
    
    // Parallax effect on mouse move for mockups
    const heroRight = document.querySelector('.hero-right');
    if (heroRight && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            const xPercent = (clientX / innerWidth - 0.5) * 2;
            const yPercent = (clientY / innerHeight - 0.5) * 2;
            
            const smallMockups = document.querySelectorAll('.mockup-small');
            smallMockups.forEach((mockup, i) => {
                const depth = (i + 1) * 8;
                const x = xPercent * depth;
                const y = yPercent * depth;
                mockup.style.transform = `translate(${x}px, ${y}px)`;
            });
            
            if (mockupBig) {
                const x = xPercent * -5;
                const y = yPercent * -5;
                mockupBig.style.transform = `perspective(1000px) rotateY(${x * 0.3}deg) rotateX(${y * 0.2}deg)`;
            }
        });
    }
}

/* ============================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});