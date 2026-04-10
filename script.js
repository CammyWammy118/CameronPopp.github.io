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
}, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* =============================================
   STAGGERED CHILDREN
   ============================================= */
document.querySelectorAll('.stagger').forEach(parent => {
  Array.from(parent.children).forEach((child, i) => {
    child.style.transitionDelay = (i * 0.07) + 's';
    child.classList.add('reveal');
    revealObserver.observe(child);
  });
});


/* =============================================
   ACTIVE NAV ON SCROLL
   ============================================= */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.3 });

sections.forEach(s => navObserver.observe(s));


/* =============================================
   3D CARD TILT
   ============================================= */
function initTilt(selector, intensity = 6) {
  document.querySelectorAll(selector).forEach(card => {
    let frame;

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'border-color 0.25s, background 0.25s, box-shadow 0.25s';
    });

    card.addEventListener('mousemove', e => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform =
          `perspective(800px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) translateY(-4px)`;
      });
    });

    card.addEventListener('mouseleave', () => {
      if (frame) cancelAnimationFrame(frame);
      card.style.transition = 'border-color 0.25s, background 0.25s, box-shadow 0.25s, transform 0.4s cubic-bezier(0.22,1,0.36,1)';
      card.style.transform = '';
    });
  });
}

initTilt('.cert-card:not(.featured)', 5);
initTilt('.project-card', 5);
initTilt('.hero-stat', 4);


/* =============================================
   COUNT-UP ANIMATION
   ============================================= */
function countUp(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const start    = performance.now();

  const tick = (now) => {
    const p    = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  };

  requestAnimationFrame(tick);
}

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const statsObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      heroStats.querySelectorAll('.count').forEach(countUp);
      statsObserver.unobserve(heroStats);
    }
  }, { threshold: 0.5 });
  statsObserver.observe(heroStats);
}


/* =============================================
   CUSTOM CURSOR
   ============================================= */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

if (cursorDot && cursorRing) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX  = mouseX;
  let ringY  = mouseY;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  }, { passive: true });

  // Smooth ring follow via lerp
  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Hover state on interactive elements
  const hoverTargets = document.querySelectorAll(
    'a, button, .cert-card, .project-card, .hero-stat, .pill, .tag'
  );
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.classList.add('hovering');
      cursorRing.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('hovering');
      cursorRing.classList.remove('hovering');
    });
  });

  // Hide cursor when it leaves the window
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity  = '0';
    cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity  = '1';
    cursorRing.style.opacity = '1';
  });
}


/* =============================================
   TYPEWRITER / ROTATING ROLES
   ============================================= */
const rolesEl = document.getElementById('roles-text');
if (rolesEl) {
  const roles = [
    'design in SOLIDWORKS.',
    'build things from scratch.',
    'solder my own keyboards.',
    "going to CSU for engineering.",
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let deleting  = false;

  function typeRole() {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      rolesEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeRole, 2200);
        return;
      }
      setTimeout(typeRole, 68);
    } else {
      charIndex--;
      rolesEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting   = false;
        roleIndex  = (roleIndex + 1) % roles.length;
        setTimeout(typeRole, 380);
        return;
      }
      setTimeout(typeRole, 34);
    }
  }

  // Kick off after the hero animation settles
  setTimeout(typeRole, 1400);
}
