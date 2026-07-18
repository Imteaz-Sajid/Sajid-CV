/* ===========================
   script.js — Portfolio JS
   =========================== */

(function () {
  'use strict';

  /* ── NAV: sticky scroll effect ── */
  const navHeader = document.getElementById('nav-header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navHeader.classList.toggle('scrolled', y > 10);
    lastScroll = y;
  }, { passive: true });

  /* ── HAMBURGER mobile menu ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  /* Close mobile menu when a link is clicked */
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── ACTIVE NAV LINK on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navItems  = document.querySelectorAll('.nav-link');

  const observerOpts = { rootMargin: '-50% 0px -50% 0px' };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, observerOpts);

  sections.forEach(s => sectionObserver.observe(s));

  /* ── REVEAL ANIMATIONS on scroll ── */
  const revealEls = document.querySelectorAll(
    '.skill-card, .project-card, .timeline-item, .contact-card, ' +
    '.section-header, .hero-badge, .hero-title, .hero-subtitle, ' +
    '.hero-pitch, .hero-cta, .hero-meta'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        /* Stagger children in same parent */
        const siblings = Array.from(
          entry.target.parentElement.querySelectorAll('.reveal')
        );
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = (idx * 60) + 'ms';
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ── TYPED EFFECT on hero subtitle ── */
  const subtitle = document.querySelector('.hero-subtitle');
  if (subtitle) {
    const original = subtitle.textContent.trim();
    subtitle.textContent = '';
    let i = 0;
    const cursor = document.createElement('span');
    cursor.style.cssText = 'border-right: 2px solid #58a6ff; margin-left: 1px; animation: blink 1s step-end infinite;';
    subtitle.appendChild(cursor);

    /* inject blink keyframe */
    const style = document.createElement('style');
    style.textContent = '@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }';
    document.head.appendChild(style);

    function typeChar() {
      if (i < original.length) {
        subtitle.insertBefore(document.createTextNode(original[i]), cursor);
        i++;
        setTimeout(typeChar, 55 + Math.random() * 35);
      } else {
        setTimeout(() => { cursor.remove(); }, 1200);
      }
    }

    /* Start typing after hero animation */
    setTimeout(typeChar, 700);
  }

  /* ── SMOOTH SCROLL polyfill for older browsers ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── PROJECT CARD tilt micro-interaction ── */
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  });

  /* ── PRINT helper: ensure all reveal elements visible ── */
  window.addEventListener('beforeprint', () => {
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible');
      el.style.transitionDelay = '0ms';
    });
  });

})();
