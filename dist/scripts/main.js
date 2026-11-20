/* ==========================================================================
   AIAA Portfolio — Interactive Controls, Hero Carousel, Filters & Accessibility
   ========================================================================== */

(() => {
  const MOTION_KEY = 'aiaa_reduce_motion';

  // 1. Reduced Motion Toggle
  const motionToggle = document.getElementById('motionToggle');
  const systemPrefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const savedMotion = localStorage.getItem(MOTION_KEY);
  let reduceMotion = savedMotion === 'true' || (savedMotion === null && systemPrefersReduced);

  function applyMotionState() {
    document.body.classList.toggle('reduce-motion', reduceMotion);
    if (motionToggle) {
      motionToggle.setAttribute('aria-pressed', String(reduceMotion));
      motionToggle.title = reduceMotion ? 'Включить плавные анимации' : 'Уменьшить анимацию';
    }
  }
  applyMotionState();

  if (motionToggle) {
    motionToggle.addEventListener('click', () => {
      reduceMotion = !reduceMotion;
      localStorage.setItem(MOTION_KEY, String(reduceMotion));
      applyMotionState();
      if (reduceMotion) pauseHero();
    });
  }

  // 2. Mobile Menu
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (burgerBtn && mobileMenu) {
    const toggleMenu = (forceClose = false) => {
      const willOpen = forceClose ? false : !mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', willOpen);
      burgerBtn.setAttribute('aria-expanded', String(willOpen));
      document.body.style.overflow = willOpen ? 'hidden' : '';
    };
    burgerBtn.addEventListener('click', () => toggleMenu());
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => toggleMenu(true));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) toggleMenu(true);
    });
  }

  // 3. Hero Carousel (Auto-advance 6s, pause on interaction, swipe & keyboard)
  const heroStage = document.getElementById('heroStage');
  let heroTimer = null;
  let heroPaused = false;

  function pauseHero() {
    heroPaused = true;
    if (heroTimer) {
      clearInterval(heroTimer);
      heroTimer = null;
    }
    if (heroStage) heroStage.classList.add('is-paused');
    const playBtn = document.getElementById('heroPlayPause');
    if (playBtn) {
      playBtn.setAttribute('aria-label', 'Возобновить автопрокрутку');
      playBtn.dataset.state = 'paused';
      playBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20"/></svg>';
    }
  }

  if (heroStage) {
    const slides = Array.from(heroStage.querySelectorAll('.hero-slide'));
    const dots = Array.from(heroStage.querySelectorAll('.hero-dot'));
    const counter = document.getElementById('heroCounter');
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');
    const playPauseBtn = document.getElementById('heroPlayPause');
    let current = 0;

    function goToSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((s, i) => {
        s.classList.toggle('is-active', i === current);
        s.setAttribute('aria-hidden', String(i !== current));
      });
      dots.forEach((d, i) => {
        d.classList.remove('is-active');
        // Restart CSS progress animation cleanly
        const bar = d.querySelector('.hero-dot-progress');
        if (bar) {
          bar.style.animation = 'none';
          void bar.offsetWidth;
          bar.style.animation = '';
        }
        if (i === current) d.classList.add('is-active');
        d.setAttribute('aria-current', i === current ? 'true' : 'false');
      });
      if (counter) counter.textContent = `${current + 1} / ${slides.length}`;
    }

    function startAuto() {
      if (reduceMotion) {
        pauseHero();
        return;
      }
      heroPaused = false;
      heroStage.classList.remove('is-paused');
      if (playPauseBtn) {
        playPauseBtn.setAttribute('aria-label', 'Поставить на паузу');
        playPauseBtn.dataset.state = 'playing';
        playPauseBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
      }
      if (heroTimer) clearInterval(heroTimer);
      heroTimer = setInterval(() => {
        if (!heroPaused && !document.hidden) {
          goToSlide(current + 1);
        }
      }, 6000);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(current - 1);
        pauseHero();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(current + 1);
        pauseHero();
      });
    }
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToSlide(idx);
        pauseHero();
      });
    });
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        if (heroPaused) {
          reduceMotion = false;
          startAuto();
        } else {
          pauseHero();
        }
      });
    }

    // Pause on pointer hover / focus inside hero
    heroStage.addEventListener('mouseenter', () => {
      if (!heroPaused) heroStage.classList.add('is-paused');
    });
    heroStage.addEventListener('mouseleave', () => {
      if (!heroPaused && !reduceMotion) heroStage.classList.remove('is-paused');
    });

    // Touch swipe support
    let touchStartX = 0;
    heroStage.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    heroStage.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 45) {
        goToSlide(dx < 0 ? current + 1 : current - 1);
        pauseHero();
      }
    }, { passive: true });

    // Keyboard support when hero focused
    heroStage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { goToSlide(current - 1); pauseHero(); }
      if (e.key === 'ArrowRight') { goToSlide(current + 1); pauseHero(); }
    });

    goToSlide(0);
    startAuto();
  }

  // 4. Featured Projects Horizontal Carousel
  const featuredTrack = document.getElementById('featuredTrack');
  const featuredPrev = document.getElementById('featuredPrev');
  const featuredNext = document.getElementById('featuredNext');
  if (featuredTrack && featuredPrev && featuredNext) {
    const scrollStep = () => Math.min(410, featuredTrack.clientWidth * 0.85);
    featuredPrev.addEventListener('click', () => {
      featuredTrack.scrollBy({ left: -scrollStep(), behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    featuredNext.addEventListener('click', () => {
      featuredTrack.scrollBy({ left: scrollStep(), behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  // 5. Portfolio Category Filters
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.filter;
        filterBtns.forEach((b) => {
          b.classList.toggle('is-active', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });
        projectCards.forEach((card) => {
          const cats = (card.dataset.categories || '').split(',');
          const match = key === 'all' || cats.includes(key);
          card.classList.toggle('is-hidden', !match);
        });
      });
    });
  }

  // 6. Scroll Reveal via IntersectionObserver
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  if (reveals.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('is-visible'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
      reveals.forEach((el) => io.observe(el));
    }
  }

  // 7. Interactive Telegram Message Composer
  const topicChips = Array.from(document.querySelectorAll('.topic-chip'));
  const composerInput = document.getElementById('tgMessageInput');
  const composerLink = document.getElementById('tgComposerBtn');
  if (composerLink) {
    const baseTg = composerLink.dataset.baseUrl || 'https://t.me/yury_zakusov';
    const selectedTopics = new Set();

    function updateTgHref() {
      const parts = [];
      if (selectedTopics.size > 0) {
        parts.push(`Здравствуйте! Интересует: ${Array.from(selectedTopics).join(', ')}.`);
      } else {
        parts.push('Здравствуйте! Хочу обсудить задачу по автоматизации.');
      }
      const userText = composerInput ? composerInput.value.trim() : '';
      if (userText) parts.push(userText);
      const fullMsg = parts.join(' ');
      composerLink.href = `${baseTg}?text=${encodeURIComponent(fullMsg)}`;
    }

    topicChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const val = chip.dataset.topic;
        if (selectedTopics.has(val)) {
          selectedTopics.delete(val);
          chip.classList.remove('is-selected');
        } else {
          selectedTopics.add(val);
          chip.classList.add('is-selected');
        }
        updateTgHref();
      });
    });
    if (composerInput) {
      composerInput.addEventListener('input', updateTgHref);
    }
    updateTgHref();
  }

  // 8. Screenshot Lightbox on Project Pages
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    document.querySelectorAll('[data-lightbox]').forEach((img) => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('open');
      });
    });
    const closeLb = () => lightbox.classList.remove('open');
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLb();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLb();
    });
  }
})();
