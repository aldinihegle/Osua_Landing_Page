/* =============================================
   OSUA Footwear — Landing Page Scripts
   - Color switcher for product showcase
   - Scroll-triggered reveal animations
   - Header scroll state
   - Mobile nav toggle
   - Smooth scroll with offset for fixed header
   ============================================= */

(function () {
  'use strict';

  /* ── Elements ── */
  const header          = document.getElementById('site-header');
  const navToggle       = document.getElementById('nav-toggle');
  const siteNav         = document.getElementById('site-nav');
  const revealEls       = document.querySelectorAll('.reveal');
  const navLinks        = document.querySelectorAll('a[href^="#"]');
  const colorDots       = document.querySelectorAll('.color-dot');
  const productImg      = document.getElementById('product-main-img');
  const colorNameLabel  = document.getElementById('selected-color-name');

  // Modal elements
  const imageModal      = document.getElementById('image-modal');
  const modalImg        = document.getElementById('modal-img');
  const modalCloseBtn   = document.getElementById('modal-close');
  const clickableImgs   = document.querySelectorAll('.marquee-item img, .product-main-img');

  /* ── 0. Image Modal Logic ── */
  if (imageModal && modalImg && clickableImgs) {
    // Open modal on image click
    clickableImgs.forEach(img => {
      img.addEventListener('click', () => {
        modalImg.src = img.src;
        imageModal.classList.add('open');
        imageModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
      });
    });

    // Close modal function
    const closeModal = () => {
      imageModal.classList.remove('open');
      imageModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(() => { modalImg.src = ''; }, 300); // Clear src after transition
    };

    // Close handlers
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    imageModal.addEventListener('click', (e) => {
      if (e.target === imageModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && imageModal.classList.contains('open')) closeModal();
    });
  }

  /* ── 1. Color Switcher ── */
  colorDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      if (dot.classList.contains('active')) return;

      // Update active state
      colorDots.forEach((d) => {
        d.classList.remove('active');
        d.setAttribute('aria-pressed', 'false');
      });
      dot.classList.add('active');
      dot.setAttribute('aria-pressed', 'true');

      // Update label
      const colorName = dot.dataset.name;
      if (colorNameLabel) colorNameLabel.textContent = colorName;

      // Swap image with fade transition
      if (productImg) {
        productImg.classList.add('switching');
        setTimeout(() => {
          productImg.src = dot.dataset.img;
          productImg.alt = `OSUA Desert Moc — ${colorName}`;
          productImg.classList.remove('switching');
        }, 350);
      }
    });
  });

  /* ── 1. Header scroll state ── */
  function handleHeaderScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // run on load

  /* ── 2. Scroll Reveal (Intersection Observer) ── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // fire once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ── 3. Mobile Nav Toggle ── */
  function openNav() {
    siteNav.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Tutup menu navigasi');
    document.body.style.overflow = 'hidden';
    // Animate hamburger → X
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
  }

  function closeNav() {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Buka menu navigasi');
    document.body.style.overflow = '';
    // Animate X → hamburger
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '1';
    spans[2].style.transform = '';
  }

  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.contains('open');
    if (isOpen) closeNav(); else openNav();
  });

  // Close nav on nav link click (mobile)
  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (siteNav.classList.contains('open')) closeNav();
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && siteNav.classList.contains('open')) closeNav();
  });

  /* ── 4. Smooth scroll with fixed header offset ── */
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || !href.startsWith('#')) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header.offsetHeight;
      const targetTop    = target.getBoundingClientRect().top + window.scrollY;
      const scrollTo     = targetTop - headerHeight - 16;

      window.scrollTo({ top: scrollTo, behavior: 'smooth' });
    });
  });

  /* ── 5. Active nav link highlight on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.site-nav a[href^="#"]');

  function setActiveNav() {
    const scrollMid = window.scrollY + window.innerHeight / 3;

    sections.forEach((section) => {
      const sectionTop    = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const id            = section.getAttribute('id');

      if (scrollMid >= sectionTop && scrollMid < sectionBottom) {
        navItems.forEach((link) => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'rgba(168,144,106,0.9)';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });

  /* ── 6. Platform card click tracking (optional analytics hook) ── */
  document.querySelectorAll('.platform-card, .product-cta-link').forEach((el) => {
    el.addEventListener('click', () => {
      // Placeholder for analytics / tracking
      const label = el.id || el.textContent.trim();
      console.log(`[OSUA] CTA clicked: ${label}`);
    });
  });

  /* ── 7. Subtle parallax on hero headline ── */
  const heroHeadline = document.querySelector('.hero-headline');

  if (heroHeadline && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroHeadline.style.transform = `translateY(${scrolled * 0.12}px)`;
        heroHeadline.style.opacity   = 1 - scrolled / (window.innerHeight * 0.7);
      }
    }, { passive: true });
  }

  /* ── 8. Product card hover focus accessibility ── */
  document.querySelectorAll('.product-card').forEach((card) => {
    card.addEventListener('focusin', () => {
      card.querySelector('.product-overlay').style.opacity = '1';
    });
    card.addEventListener('focusout', () => {
      card.querySelector('.product-overlay').style.opacity = '';
    });
  });

  /* ── Init complete ── */
  console.log('[OSUA] Landing page ready ✓');

})();
