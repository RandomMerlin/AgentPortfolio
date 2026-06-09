/* ─── Nav: scrolled state + active link ─────────────────────────────────── */
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  highlightNav();
}, { passive: true });

function highlightNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

/* ─── Hamburger menu ─────────────────────────────────────────────────────── */
const toggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  navMenu.classList.toggle('open');
});

navMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
  });
});

/* ─── Scroll-reveal ──────────────────────────────────────────────────────── */
const revealEls = document.querySelectorAll(
  '.course-card, .project-card, .about-grid, .contact-grid, .stat'
);
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));

/* ─── Section headings: animate the gold rule ───────────────────────────── */
const headings = document.querySelectorAll('.section-heading');
const ruleObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('animate-rule');
      ruleObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
headings.forEach(h => ruleObserver.observe(h));

/* ─── Contact form ───────────────────────────────────────────────────────── */
const form = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (window.fireBurst) window.fireBurst();
  formSuccess.hidden = false;
  form.reset();
  setTimeout(() => { formSuccess.hidden = true; }, 5000);
});

/* ─── Pause hero animation when tab hidden ───────────────────────────────── */
document.addEventListener('visibilitychange', () => {
  if (window._heroP5) {
    document.hidden ? window._heroP5.noLoop() : window._heroP5.loop();
  }
});
