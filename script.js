/* ============================================
   TONANTZIN & RAFAEL · Wizard vertical
   ============================================ */

(() => {
  'use strict';

  const track     = document.getElementById('wizardTrack');
  if (!track) return;

  const steps     = Array.from(track.querySelectorAll('.wizard__step'));
  const dots      = Array.from(document.querySelectorAll('.wizard-progress__dot'));
  const prevBtn   = document.getElementById('prevBtn');
  const nextBtn   = document.getElementById('nextBtn');
  const stepCurr  = document.getElementById('stepCurrent');
  const stepLbl   = document.getElementById('stepName');
  const swipeCue  = document.getElementById('swipeCue');

  const STEP_NAMES = ['Apertura', 'Ceremonia', 'Recepción', 'Detalles', 'Regalos', 'Confirmar', 'Despedida'];
  const TOTAL = steps.length;

  let currentStep = 0;
  let cueHidden   = false;
  let isProgrammaticScroll = false;
  let programmaticTimeout  = null;

  /* ---------- Estado inicial ---------- */
  steps[0]?.classList.add('is-active');
  dots[0]?.classList.add('is-active');
  prevBtn?.classList.remove('is-visible');
  nextBtn?.classList.add('is-visible');

  /* ---------- Navegación programática ---------- */
  function goToStep(index, smooth = true) {
    if (index < 0 || index >= TOTAL) return;
    const target = steps[index];
    if (!target) return;

    isProgrammaticScroll = true;
    clearTimeout(programmaticTimeout);

    track.scrollTo({
      top: target.offsetTop,
      behavior: smooth ? 'smooth' : 'auto'
    });

    setActive(index);

    programmaticTimeout = setTimeout(() => {
      isProgrammaticScroll = false;
    }, 800);
  }

  /* ---------- Aplicar estado de step activo ---------- */
  function setActive(index) {
    if (index < 0 || index >= TOTAL) return;
    if (index === currentStep && steps[index].classList.contains('is-active')) return;

    currentStep = index;

    // Marcar step como activo sin remover de los anteriores
    // (las animaciones de entrada solo deben correr la primera vez)
    steps[index].classList.add('is-active');

    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i === index);
      d.classList.toggle('is-passed', i < index);
    });

    if (stepCurr) stepCurr.textContent = (index + 1);
    if (stepLbl)  stepLbl.textContent  = STEP_NAMES[index] || '';

    prevBtn?.classList.toggle('is-visible', index > 0);
    nextBtn?.classList.toggle('is-visible', index < TOTAL - 1);

    if (index > 0 && swipeCue && !cueHidden) {
      swipeCue.classList.add('is-hidden');
      cueHidden = true;
    }

    // Hash de la URL (sin disparar scroll)
    const id = steps[index].id;
    if (id && history.replaceState) {
      history.replaceState(null, '', '#' + id);
    }
  }

  /* ---------- Observer: detectar step en pantalla ---------- */
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      // Solo procesar si NO es scroll programático
      if (isProgrammaticScroll) return;

      // Buscar el step con mayor ratio de intersección
      let best = null;
      let bestRatio = 0;
      entries.forEach((entry) => {
        if (entry.intersectionRatio > bestRatio) {
          bestRatio = entry.intersectionRatio;
          best = entry.target;
        }
      });

      if (best && bestRatio > 0.55) {
        const i = steps.indexOf(best);
        if (i !== -1) setActive(i);
      }
    }, {
      root: track,
      threshold: [0.3, 0.55, 0.7, 0.9]
    });

    steps.forEach((s) => obs.observe(s));
  }

  /* ---------- Botones ---------- */
  prevBtn?.addEventListener('click', () => goToStep(currentStep - 1));
  nextBtn?.addEventListener('click', () => goToStep(currentStep + 1));

  /* ---------- Dots ---------- */
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToStep(i));
  });

  /* ---------- Links de navegación interna ---------- */
  document.querySelectorAll('[data-step-link]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const i = parseInt(link.dataset.stepLink, 10);
      if (!isNaN(i)) goToStep(i);
    });
  });

  // Links de hash (a[href^="#"]) que apuntan a un step
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    if (link.hasAttribute('data-step-link')) return;
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const i  = steps.findIndex((s) => s.id === id);
      if (i !== -1) {
        e.preventDefault();
        goToStep(i);
      }
    });
  });

  /* ---------- Teclado ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.target.matches && e.target.matches('input, textarea, select')) return;

    switch (e.key) {
      case 'ArrowDown':
      case 'PageDown':
      case ' ':
        e.preventDefault();
        goToStep(currentStep + 1);
        break;
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        goToStep(currentStep - 1);
        break;
      case 'Home':
        e.preventDefault();
        goToStep(0);
        break;
      case 'End':
        e.preventDefault();
        goToStep(TOTAL - 1);
        break;
    }
  });

  /* ---------- Deep-link desde URL hash ---------- */
  function applyHashOnLoad() {
    const id = location.hash.slice(1);
    if (!id) return;
    const i = steps.findIndex((s) => s.id === id);
    if (i !== -1 && i !== 0) {
      requestAnimationFrame(() => {
        goToStep(i, false);
      });
    }
  }
  setTimeout(applyHashOnLoad, 60);

  /* ---------- Hash cambia · sincronizar ---------- */
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (!id) return;
    const i = steps.findIndex((s) => s.id === id);
    if (i !== -1 && i !== currentStep) goToStep(i);
  });

  /* ---------- RSVP form ---------- */
  const form = document.getElementById('rsvpForm');
  if (form) {
    const success   = form.querySelector('.rsvp-form__success');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const name   = data.get('name')?.toString().trim();
      const attend = data.get('attend');

      if (!name) {
        flagInvalid(form.querySelector('[name="name"]'));
        return;
      }
      if (!attend) {
        flagInvalid(form.querySelector('[name="attend"]'));
        return;
      }

      submitBtn.disabled = true;
      submitBtn.querySelector('.button__label').textContent = 'Enviando…';

      // TODO: conectar a backend real (Formspree, Firebase, etc.)
      console.log('RSVP payload:', Object.fromEntries(data.entries()));

      await new Promise((r) => setTimeout(r, 900));

      form.querySelectorAll('.field, .field-row, .field--choice').forEach((el) => {
        el.style.transition = 'opacity 0.5s ease';
        el.style.opacity = '0.4';
        el.querySelectorAll('input, select, textarea').forEach((i) => i.disabled = true);
      });
      submitBtn.hidden = true;

      if (success) {
        const msg = attend === 'si'
          ? '✦ Gracias por confirmar. Nos vemos el 24 de octubre.'
          : '✦ Gracias por avisarnos. Te tendremos presente.';
        success.querySelector('em').textContent = msg;
        success.hidden = false;
        success.style.opacity = '0';
        success.style.transform = 'translateY(8px)';
        success.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        requestAnimationFrame(() => {
          success.style.opacity = '1';
          success.style.transform = 'translateY(0)';
        });
      }

      // Auto-avanzar a despedida
      setTimeout(() => goToStep(TOTAL - 1), 2400);
    });

    function flagInvalid(input) {
      if (!input) return;
      try { input.focus(); } catch (e) {}
      input.classList.add('is-invalid');
      setTimeout(() => input.classList.remove('is-invalid'), 1200);
    }
  }

})();
