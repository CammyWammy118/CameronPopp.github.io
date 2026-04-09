/* =============================================
   SCROLL PROGRESS BAR
   ============================================= */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  progressBar.style.width = (scrolled * 100) + '%';
}, { passive: true });


/* =============================================
   SCROLL REVEAL
   ============================================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* =============================================
   STAGGERED CHILDREN
   ============================================= */
document.querySelectorAll('.stagger').forEach(parent => {
  Array.from(parent.children).forEach((child, i) => {
    child.style.transitionDelay = (i * 0.08) + 's';
    child.classList.add('reveal');
    revealObserver.observe(child);
  });
});


/* =============================================
   ACTIVE NAV ON SCROLL
   ============================================= */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('nav ul a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => navObserver.observe(s));


/* =============================================
   3D CARD TILT
   ============================================= */
function initTilt(selector, intensity = 7) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform =
        `perspective(700px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

initTilt('.cert-card:not(.featured)', 6);
initTilt('.project-card', 5);
initTilt('.achievement-card', 4);


/* =============================================
   COUNT-UP (hero stats)
   ============================================= */
function countUp(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const start    = performance.now();

  const tick = (now) => {
    const p    = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);           // cubic ease-out
    el.textContent = Math.floor(ease * target);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  };

  requestAnimationFrame(tick);
}

const statsEl = document.querySelector('.hero-stats');
if (statsEl) {
  const statsObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      statsEl.querySelectorAll('.count').forEach(countUp);
      statsObserver.unobserve(statsEl);
    }
  }, { threshold: 0.5 });
  statsObserver.observe(statsEl);
}
