/**
 * AutoLease MX — main.js
 * ─────────────────────────────────────────────────────────────
 * Módulos:
 *  1. Cursor personalizado
 *  2. Barra de progreso de scroll
 *  3. Navbar (scroll + burger)
 *  4. Hero slideshow
 *  5. Animaciones GSAP + ScrollTrigger
 *  6. Contadores animados
 *  7. Slider de servicios
 *  8. Scroll-to-top
 *  9. Validación del formulario
 * ─────────────────────────────────────────────────────────────
 */

/* ═══════════════════════════════════════════════════════════════
   1. CURSOR PERSONALIZADO (GSAP quickTo)
═══════════════════════════════════════════════════════════════ */
function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor || window.matchMedia('(pointer: coarse)').matches) {
    if (cursor) cursor.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.15, ease: 'none' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.15, ease: 'none' });

  document.addEventListener('mousemove', (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  });

  // Agrandar sobre links y botones
  document.querySelectorAll('a, button, .al-card, .al-branch-card, .dot').forEach(el => {
    el.addEventListener('mouseenter', () => gsap.to(cursor, { scale: 2.5, duration: 0.2 }));
    el.addEventListener('mouseleave', () => gsap.to(cursor, { scale: 1, duration: 0.2 }));
  });
}

/* ═══════════════════════════════════════════════════════════════
   2. BARRA DE PROGRESO DE SCROLL
═══════════════════════════════════════════════════════════════ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0) + '%';
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════════════
   3. NAVBAR
═══════════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const burger  = document.getElementById('burger');
  const navMenu = document.getElementById('nav-menu');

  // Scroll → fondo oscuro
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Burger toggle
  burger.addEventListener('click', () => {
    navMenu.classList.toggle('is-open');
  });

  // Cerrar al hacer click en un link
  navMenu.querySelectorAll('.al-navbar__link, .al-navbar__cta').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('is-open'));
  });

  // Animación de entrada con GSAP
  gsap.from('#navbar', {
    y: -80,
    opacity: 0,
    duration: 0.8,
    delay: 0.2,
    ease: 'power3.out',
  });
}

/* ═══════════════════════════════════════════════════════════════
   4. HERO SLIDESHOW
   - Crossfade GSAP entre imágenes cada 4 segundos
   - Dots indicadores
═══════════════════════════════════════════════════════════════ */
function initHeroSlideshow() {
  const slides  = document.querySelectorAll('.al-hero__slide');
  const dots    = document.querySelectorAll('.dot');
  let current   = 0;
  let timer;

  function goTo(index) {
    const prev = current;
    current = index;

    // Fade out anterior
    gsap.to(slides[prev], { opacity: 0, duration: 1.2, ease: 'power2.inOut' });
    slides[prev].classList.remove('active');

    // Fade in nuevo
    slides[current].classList.add('active');
    gsap.fromTo(slides[current], { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.inOut' });

    // Dots
    dots.forEach(d => d.classList.remove('active'));
    dots[current].classList.add('active');
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  // Auto-play cada 4 segundos
  timer = setInterval(next, 4000);

  // Click en dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      goTo(parseInt(dot.dataset.index));
      timer = setInterval(next, 4000);
    });
  });

  // Animación de entrada del contenido del hero
  const tl = gsap.timeline({ delay: 0.5 });
  tl.from('#hero-eyebrow', { y: 80, opacity: 0, duration: 1, ease: 'expo.out' })
    .from('#hero-title',   { y: 80, opacity: 0, duration: 1, ease: 'expo.out' }, '-=0.7')
    .from('#hero-desc',    { y: 60, opacity: 0, duration: 0.9, ease: 'expo.out' }, '-=0.7')
    .from('#hero-btns',    { y: 40, opacity: 0, duration: 0.8, ease: 'expo.out' }, '-=0.6');
}

/* ═══════════════════════════════════════════════════════════════
   5. ANIMACIONES GSAP + ScrollTrigger
═══════════════════════════════════════════════════════════════ */
function initScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // ── Beneficios cards (stagger) ────────────────────────────────
  gsap.from('.benefit-card', {
    scrollTrigger: { trigger: '.al-benefits', start: 'top 75%' },
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
  });

  // ── Servicios cards (entrada lateral) ────────────────────────
  gsap.from('.al-service-card', {
    scrollTrigger: { trigger: '.al-services', start: 'top 75%' },
    x: 80,
    opacity: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power3.out',
  });

  // ── Steps (aparición de cada paso) ───────────────────────────
  gsap.from('.step-item', {
    scrollTrigger: { trigger: '.al-steps', start: 'top 75%' },
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out',
  });

  // ── Línea de pasos animada ────────────────────────────────────
  gsap.to('#steps-line', {
    scrollTrigger: { trigger: '.al-steps', start: 'top 70%' },
    strokeDashoffset: 0,
    duration: 1.2,
    ease: 'power2.out',
    delay: 0.4,
  });

  // ── Sucursales cards ──────────────────────────────────────────
  gsap.from('.al-branch-card', {
    scrollTrigger: { trigger: '.al-branches', start: 'top 75%' },
    y: 50,
    opacity: 0,
    duration: 0.7,
    stagger: 0.12,
    ease: 'power3.out',
  });

  // ── Contacto columnas desde lados opuestos ────────────────────
  gsap.from('#contact-left', {
    scrollTrigger: { trigger: '.al-contact', start: 'top 75%' },
    x: -100,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
  });
  gsap.from('#contact-right', {
    scrollTrigger: { trigger: '.al-contact', start: 'top 75%' },
    x: 100,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
  });

  // ── Footer fade-in ────────────────────────────────────────────
  gsap.from('.al-footer', {
    scrollTrigger: { trigger: '.al-footer', start: 'top 90%' },
    opacity: 0,
    y: 40,
    duration: 0.9,
    ease: 'power2.out',
  });

  // ── Parallax en stats ─────────────────────────────────────────
  gsap.to('#stats-bg', {
    scrollTrigger: {
      trigger: '.al-stats',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
    y: '30%',
    ease: 'none',
  });
}

/* ═══════════════════════════════════════════════════════════════
   6. CONTADORES ANIMADOS
   - Se activan al entrar en pantalla con ScrollTrigger
   - Usan gsap.to + snap:1 para enteros
═══════════════════════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.al-stat__num');

  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target, 10);

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          innerHTML: target,
          duration: 2,
          ease: 'power2.out',
          snap: { innerHTML: 1 },
          onUpdate: function() {
            counter.textContent = Math.round(parseFloat(counter.innerHTML)).toLocaleString('es-MX');
          },
        });
      },
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   7. SLIDER DE SERVICIOS (flechas + touch)
═══════════════════════════════════════════════════════════════ */
function initServicesSlider() {
  const slider   = document.getElementById('services-slider');
  const btnPrev  = document.getElementById('slider-prev');
  const btnNext  = document.getElementById('slider-next');
  const cardW    = 320; // ancho aprox de cada card + gap

  btnNext.addEventListener('click', () => {
    slider.scrollBy({ left: cardW, behavior: 'smooth' });
  });
  btnPrev.addEventListener('click', () => {
    slider.scrollBy({ left: -cardW, behavior: 'smooth' });
  });

  // Touch swipe
  let startX = 0;
  slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) slider.scrollBy({ left: diff > 0 ? cardW : -cardW, behavior: 'smooth' });
  });
}

/* ═══════════════════════════════════════════════════════════════
   8. SCROLL-TO-TOP
═══════════════════════════════════════════════════════════════ */
function initScrollTop() {
  const btn = document.getElementById('scroll-top');

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ═══════════════════════════════════════════════════════════════
   9. VALIDACIÓN DEL FORMULARIO
═══════════════════════════════════════════════════════════════ */
function initForm() {
  const form    = document.getElementById('contact-form');
  const errorEl = document.getElementById('form-error');

  form.addEventListener('submit', (e) => {
    const nombre  = form.querySelector('[name="nombre"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const mensaje = form.querySelector('[name="mensaje"]').value.trim();

    // Validar campos requeridos
    if (!nombre || !email || !mensaje) {
      e.preventDefault();
      errorEl.style.display = 'block';
      gsap.from(errorEl, { y: -10, opacity: 0, duration: 0.3 });
      return;
    }

    // Validar formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      e.preventDefault();
      errorEl.querySelector('p').innerHTML = '<i class="fas fa-triangle-exclamation"></i> Ingresa un correo electrónico válido.';
      errorEl.style.display = 'block';
      gsap.from(errorEl, { y: -10, opacity: 0, duration: 0.3 });
      return;
    }

    errorEl.style.display = 'none';
  });

  // Ocultar error al escribir
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => { errorEl.style.display = 'none'; });
  });
}

/* ═══════════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initScrollProgress();
  initNavbar();
  initHeroSlideshow();
  initScrollAnimations();
  initCounters();
  initServicesSlider();
  initScrollTop();
  initForm();
});
