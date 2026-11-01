  // ─── Nav active indicator ───
  (function() {
    const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
    const sections = [];
    navLinks.forEach(a => {
      const id = a.getAttribute('href');
      if (id && id.startsWith('#')) {
        const el = document.querySelector(id);
        if (el) sections.push({ el, link: a });
      }
    });
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(a => a.classList.remove('active'));
          const match = sections.find(s => s.el === e.target);
          if (match) match.link.classList.add('active');
        }
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -30% 0px' });
    sections.forEach(s => navObserver.observe(s.el));
  })();

  // ─── Custom Cursor ───
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let rx = 0, ry = 0, mx = 0, my = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; });
  function animateRing() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();
  document.querySelectorAll('a, button, [role="button"], .service-card, .blog-card, .blog-featured, .platform-card, .social-card, .contact-method, .testi-card, .ceo-value-card, .filter-btn, .badge-pill, .expertise-tag, .chip, .app-card, .play-badge-link').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('cursor-hover'); ring && ring.classList.add('cursor-ring-hover'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('cursor-hover'); ring && ring.classList.remove('cursor-ring-hover'); });
  });

  // ─── Hero Particles ───
  (function() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'hero-particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
      p.style.animationDuration = (6 + Math.random() * 8) + 's';
      p.style.animationDelay = (Math.random() * 8) + 's';
      container.appendChild(p);
    }
  })();

  // ─── Counter Animation ───
  (function() {
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = parseInt(el.getAttribute('data-count'));
          const duration = 2000;
          const start = performance.now();
          function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target) + (el.getAttribute('data-count') === '100' ? '%' : '');
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target + (el.getAttribute('data-count') === '100' ? '%' : '');
          }
          requestAnimationFrame(update);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    counters.forEach(c => counterObserver.observe(c));
  })();

  // ─── Navbar scroll + Scroll Progress + Back to Top ───
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  const scrollProgress = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);
    if (backToTop) backToTop.classList.toggle('visible', y > 400);
    if (scrollProgress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = Math.min((y / h) * 100, 100) + '%';
    }
    // Parallax depth
    const heroBg = document.querySelector('.hero-bg');
    const heroGrid = document.querySelector('.hero-grid');
    if (heroBg) heroBg.style.transform = `translateY(${y * 0.08}px)`;
    if (heroGrid) heroGrid.style.transform = `translateY(${y * 0.04}px)`;
  }, { passive: true });

  // ─── Hamburger ───
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }));

  // ─── Scroll Reveal ───
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => observer.observe(el));

  // ─── Portfolio Filter (removed — platform cards now used) ───

  // ─── Contact Form → mailto kisswardmultimedia@gmail.com ───
  document.getElementById('contact-form').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    const fname   = f.fname.value.trim();
    const lname   = f.lname.value.trim();
    const email   = f.email.value.trim();
    const service = f.service.value;
    const message = f.message.value.trim();

    if (!fname || !email || !message) {
      // Show inline error instead of alert()
      let errEl = f.querySelector('.form-error-msg');
      if (!errEl) {
        errEl = document.createElement('p');
        errEl.className = 'form-error-msg';
        errEl.style.cssText = 'color:#ff6b6b;font-size:0.82rem;margin-top:8px;text-align:center;';
        f.querySelector('.form-submit').after(errEl);
      }
      errEl.textContent = '⚠️ Please fill in your name, email, and message before sending.';
      errEl.style.display = 'block';
      setTimeout(() => { errEl.style.display = 'none'; }, 4000);
      return;
    }

    const subject = encodeURIComponent(`[Kissward Multimedia] New Enquiry – ${service || 'General'} – ${fname} ${lname}`);
    const body = encodeURIComponent(
      `Name: ${fname} ${lname}\nEmail: ${email}\nService: ${service || 'Not specified'}\n\nMessage:\n${message}`
    );
    const mailtoLink = `mailto:kisswardmultimedia@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;

    const btn = f.querySelector('.form-submit');
    btn.textContent = '✓ Opening your email app…';
    btn.style.background = '#25d366';
    setTimeout(() => { btn.textContent = 'Send Message →'; btn.style.background = ''; }, 4000);
  });

  // ─── Portfolio Slider ───
  (function() {
    const track      = document.getElementById('sliderTrack');
    const prevBtn    = document.getElementById('sliderPrev');
    const nextBtn    = document.getElementById('sliderNext');
    const dotsWrap   = document.getElementById('sliderDots');
    const counter    = document.getElementById('sliderCounter');
    const slides     = track ? track.querySelectorAll('.portfolio-slide') : [];
    const total      = slides.length;

    // How many slides visible at once depends on viewport
    function visibleCount() {
      return window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3;
    }

    let current = 0;
    let vis = visibleCount();
    const maxIndex = () => total - vis;

    // Build dots
    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      const numDots = maxIndex() + 1;
      for (let i = 0; i <= maxIndex(); i++) {
        const d = document.createElement('button');
        d.className = 'slider-dot' + (i === current ? ' active' : '');
        d.setAttribute('role', 'tab');
        d.setAttribute('aria-label', `Go to slide group ${i+1}`);
        d.setAttribute('aria-selected', i === current ? 'true' : 'false');
        d.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(d);
      }
    }

    function updateDots() {
      if (!dotsWrap) return;
      dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
        d.setAttribute('aria-selected', i === current ? 'true' : 'false');
      });
    }

    function updateCounter() {
      if (counter) counter.textContent = (current + 1) + ' / ' + (maxIndex() + 1);
    }

    function goTo(n) {
      vis = visibleCount();
      current = Math.max(0, Math.min(n, maxIndex()));
      const pct = (100 / vis) * current;
      track.style.transform = `translateX(-${pct}%)`;
      updateDots();
      updateCounter();
    }

    if (total > 0) {
      buildDots();
      updateCounter();
      prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
      nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));

      // Auto-advance
      let auto = setInterval(() => goTo(current + 1 > maxIndex() ? 0 : current + 1), 4000);
      track.parentElement.addEventListener('mouseenter', () => clearInterval(auto));
      track.parentElement.addEventListener('mouseleave', () => {
        auto = setInterval(() => goTo(current + 1 > maxIndex() ? 0 : current + 1), 4000);
      });

      // Touch swipe
      let startX = 0;
      track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
      track.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
      }, { passive: true });

      window.addEventListener('resize', () => {
        buildDots();
        goTo(0);
      });
    }

    // ─── Lightbox ───
    const slides_data = Array.from(slides).map(s => ({
      src: s.querySelector('img').src,
      alt: s.querySelector('img').alt,
      label: s.querySelector('.portfolio-slide-label') ? s.querySelector('.portfolio-slide-label').textContent : ''
    }));
    let lbCurrent = 0;
    const lb        = document.getElementById('lightbox');
    const lbImg     = document.getElementById('lightboxImg');
    const lbCaption = document.getElementById('lightboxCaption');
    const lbClose   = document.getElementById('lightboxClose');
    const lbPrev    = document.getElementById('lightboxPrev');
    const lbNext    = document.getElementById('lightboxNext');

    window.openLightbox = function(idx) {
      lbCurrent = idx;
      showLb();
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    function showLb() {
      if (!lbImg) return;
      lbImg.src = slides_data[lbCurrent].src;
      lbImg.alt = slides_data[lbCurrent].alt;
      if (lbCaption) lbCaption.textContent = slides_data[lbCurrent].label + ' — ' + slides_data[lbCurrent].alt;
    }
    function closeLb() {
      lb && lb.classList.remove('open');
      document.body.style.overflow = '';
    }
    lbClose && lbClose.addEventListener('click', closeLb);
    lb && lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    lbPrev && lbPrev.addEventListener('click', () => { lbCurrent = (lbCurrent - 1 + slides_data.length) % slides_data.length; showLb(); });
    lbNext && lbNext.addEventListener('click', () => { lbCurrent = (lbCurrent + 1) % slides_data.length; showLb(); });
    document.addEventListener('keydown', e => {
      if (!lb || !lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') { lbCurrent = (lbCurrent - 1 + slides_data.length) % slides_data.length; showLb(); }
      if (e.key === 'ArrowRight') { lbCurrent = (lbCurrent + 1) % slides_data.length; showLb(); }
    });
  })();

  // ─── Smooth Anchor Offset ───
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        const y = el.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ─── BLOG ENGINE v2 — Full Article Modal Reader ──────────────────────────────
  const BLOG_CACHE_KEY = 'km_blog_posts_v6';
  const BLOG_CACHE_TS  = 'km_blog_ts_v6';
  const BLOG_TTL_MS    = 24 * 60 * 60 * 1000; // Full 24-hour daily refresh

  // All posts stored here after load so modal can access them
  let BLOG_POSTS_STORE = [];

  const CATEGORIES = [
    { id: 'ai',        label: 'AI Tools',        cls: 'cat-ai',        icon: '🤖', from: '#00d4ff', to: '#0047ab', bg: '#040d1e' },
    { id: 'web',       label: 'Web Dev',          cls: 'cat-web',       icon: '💻', from: '#e8c56a', to: '#b8882a', bg: '#110e00' },
    { id: 'design',    label: 'Design',           cls: 'cat-design',    icon: '🎨', from: '#c97bff', to: '#7b2fff', bg: '#0d0520' },
    { id: 'tools',     label: 'Dev Tools',        cls: 'cat-tools',     icon: '🛠', from: '#5ac87a', to: '#1a8040', bg: '#031509' },
    { id: 'update',    label: 'Software Update',  cls: 'cat-update',    icon: '⚡', from: '#ff9d45', to: '#cc4400', bg: '#150800' },
    { id: 'tech',      label: 'Tech News',        cls: 'cat-tech',      icon: '📱', from: '#ff6b6b', to: '#c0392b', bg: '#1a0505' },
    { id: 'business',  label: 'Business',         cls: 'cat-business',  icon: '📈', from: '#f1c40f', to: '#d4a000', bg: '#1a1400' },
    { id: 'policy',    label: 'Policy & Law',     cls: 'cat-policy',    icon: '⚖', from: '#8e44ad', to: '#5b2c6f', bg: '#0d0315' },
    { id: 'opensource',label: 'Open Source',      cls: 'cat-opensource',icon: '🔓', from: '#2ecc71', to: '#1a7a42', bg: '#031a0b' },
  ];

  function getCat(id) { return CATEGORIES.find(c => c.id === id) || CATEGORIES[0]; }

  function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function readMins(text) {
    return Math.max(3, Math.round((text || '').split(/\s+/).length / 200));
  }

  function esc(str) {
    return (str || '').replace(/[<>&"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
  }

  // Keyword map: per category — used for SVG fallback styling
  const THUMB_KEYWORDS = {
    ai:     ['artificial intelligence','machine learning','neural network','robot','technology','data science','computer','algorithm','futuristic tech'],
    web:    ['web development','coding','programming','software','laptop code','developer','javascript','frontend','website design'],
    design: ['graphic design','ui design','creative studio','typography','branding','color palette','design workspace','illustration'],
    tools:  ['developer tools','productivity','software tools','workspace','command line','tech setup','keyboard','monitor setup'],
    update: ['software update','technology news','digital innovation','tech announcement','product launch','app release'],
    tech:     ['technology','mobile','apple','google','consumer tech','gadget','smartphone','wearable','smart home'],
    business: ['startup','funding','valuation','investment','IPO','revenue','market','enterprise','acquisition'],
    policy:   ['regulation','compliance','law','government','ethics','privacy','EU AI Act','transparency','safety'],
    opensource: ['open source','linux','community','freemium','MIT license','open weight','self-hosted','decentralized'],
  };

  // ── Thumbnail via inline SVG (zero external dependencies) ─────────────────
  // Generates unique SVGs per post using title seed for deterministic colours.

  function titleSeed(title) {
    let h = 0;
    for (let i = 0; i < (title || '').length; i++) { h = (Math.imul(31, h) + title.charCodeAt(i)) | 0; }
    return Math.abs(h);
  }

  function thumbSVG(post, w, h) {
    const cat = getCat(post.category);
    const seed = titleSeed(post.title || '');
    const id = 'g' + seed;
    const words = (post.title || '').split(' ');
    const l1 = words.slice(0,4).join(' ');
    const l2 = words.slice(4,8).join(' ');
    const svgIcon = cat.label.charAt(0);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="${id}1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${cat.from}" stop-opacity="0.3"/><stop offset="100%" stop-color="${cat.to}" stop-opacity="0.1"/></linearGradient><radialGradient id="${id}2" cx="50%" cy="38%" r="55%"><stop offset="0%" stop-color="${cat.from}" stop-opacity="0.22"/><stop offset="100%" stop-color="${cat.bg}" stop-opacity="0"/></radialGradient></defs><rect width="${w}" height="${h}" fill="${cat.bg}"/><rect width="${w}" height="${h}" fill="url(#${id}1)"/><circle cx="${w/2}" cy="${h*0.38}" r="${Math.min(w,h)*0.3}" fill="url(#${id}2)"/><circle cx="${w/2}" cy="${h*0.38}" r="${Math.min(w,h)*0.12}" fill="none" stroke="${cat.from}" stroke-width="1" opacity="0.18"/><text x="${w/2}" y="${h*0.43}" font-family="sans-serif" font-size="${Math.round(h*0.14)}" text-anchor="middle" dominant-baseline="middle" fill="${cat.from}" opacity="0.6">${svgIcon}</text><text x="${w/2}" y="${h*0.68}" font-family="sans-serif" font-size="${Math.round(h*0.047)}" font-weight="700" fill="white" text-anchor="middle" opacity="0.9">${l1}</text>${l2 ? `<text x="${w/2}" y="${h*0.75}" font-family="sans-serif" font-size="${Math.round(h*0.047)}" font-weight="700" fill="white" text-anchor="middle" opacity="0.9">${l2}</text>` : ''}<text x="${w*0.034}" y="${h*0.98}" font-family="sans-serif" font-size="${Math.round(h*0.028)}" fill="${cat.from}" opacity="0.5">KISSWARD MULTIMEDIA · TECH &amp; DESIGN DIGEST</text></svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  // Build card HTML — each card is a single clickable <article> button
  function featuredHTML(post, idx) {
    const cat  = getCat(post.category);
    const mins = readMins(post.excerpt);
    const thumb = thumbSVG(post, 1280, 720);
    return `<article class="blog-featured reveal" itemscope itemtype="https://schema.org/BlogPosting"
        role="button" tabindex="0" aria-label="Read: ${esc(post.title)}"
        data-blog-idx="${idx}"
        style="outline:none;">
      <meta itemprop="headline" content="${esc(post.title)}"/>
      <meta itemprop="datePublished" content="${post.date}"/>
      <meta itemprop="author" content="Kissward Multimedia"/>
      <div class="blog-featured-thumb-wrap">
        <img src="${thumb}" alt="${esc(post.title)}" class="blog-featured-thumb" loading="lazy" width="640" height="360"/>
        <span class="blog-featured-category ${cat.cls}">${cat.label}</span>
      </div>
      <div class="blog-featured-body">
        <div class="blog-featured-meta">
          <time datetime="${post.date}" itemprop="datePublished">${fmtDate(post.date)}</time>
          <span class="sep">·</span><span>${mins} min read</span>
          <span class="sep">·</span><span>${cat.icon} Featured</span>
        </div>
        <h3 class="blog-featured-title" itemprop="name">${esc(post.title)}</h3>
        <p class="blog-featured-excerpt" itemprop="description">${esc(post.excerpt)}</p>
        <span class="blog-read-more">Read Full Article <span class="arrow">→</span></span>
      </div>
    </article>`;
  }

  function cardHTML(post, idx) {
    const cat  = getCat(post.category);
    const mins = readMins(post.excerpt);
    const thumb = thumbSVG(post, 640, 360);
    return `<article class="blog-card reveal" itemscope itemtype="https://schema.org/BlogPosting"
        role="button" tabindex="0" aria-label="Read: ${esc(post.title)}"
        data-blog-idx="${idx}"
        style="outline:none;">
      <meta itemprop="headline" content="${esc(post.title)}"/>
      <meta itemprop="datePublished" content="${post.date}"/>
      <meta itemprop="author" content="Kissward Multimedia"/>
      <div class="blog-card-thumb-wrap">
        <img src="${thumb}" alt="${esc(post.title)}" class="blog-card-thumb" loading="lazy" width="320" height="180"/>
        <span class="blog-card-category ${cat.cls}">${cat.label}</span>
      </div>
      <div class="blog-card-body">
        <div class="blog-card-meta">
          <time datetime="${post.date}">${fmtDate(post.date)}</time>
          <span>·</span><span>${cat.icon}</span>
        </div>
        <h3 class="blog-card-title" itemprop="name">${esc(post.title)}</h3>
        <p class="blog-card-excerpt" itemprop="description">${esc(post.excerpt)}</p>
      </div>
      <div class="blog-card-footer">
        <span class="blog-card-read">Read Article →</span>
        <span class="blog-card-readtime">${mins} min read</span>
      </div>
    </article>`;
  }

  function renderBlog(posts) {
    BLOG_POSTS_STORE = posts;
    const content = document.getElementById('blog-content');
    if (!posts || posts.length === 0) {
      content.innerHTML = `<div class="blog-error"><strong>No posts right now.</strong> Check back soon.</div>`;
      return;
    }

    let html = `<div class="blog-layout">` + featuredHTML(posts[0], 0);
    if (posts[1]) html += cardHTML(posts[1], 1);
    if (posts[2]) html += cardHTML(posts[2], 2);
    html += `</div>`;

    const extras = posts.slice(3, 6);
    if (extras.length) {
      html += `<div class="blog-row">` + extras.map((p, i) => cardHTML(p, i + 3)).join('') + `</div>`;
    }

    content.innerHTML = html;

    // Wire up click/keyboard on every article card
    content.querySelectorAll('[data-blog-idx]').forEach(el => {
      const open = () => openBlogPost(parseInt(el.dataset.blogIdx));
      el.addEventListener('click', open);
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });

    // Cursor hover on cards
    content.querySelectorAll('[data-blog-idx]').forEach(el => {
      el.addEventListener('mouseenter', () => { if (cursor) { cursor.style.width = '20px'; cursor.style.height = '20px'; } });
      el.addEventListener('mouseleave', () => { if (cursor) { cursor.style.width = '12px'; cursor.style.height = '12px'; } });
    });

    // Trigger reveal animation
    content.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      const obs = new IntersectionObserver(es => {
        es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
      }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
      obs.observe(el);
    });

    updateBlogSchema(posts);
  }

  // ── Modal: open & render post ──────────────────────────────────────────────
  const modalOverlay = document.getElementById('blog-modal-overlay');
  const bmInner      = document.getElementById('bm-inner');
  const bmCloseBtn   = document.getElementById('bm-close-btn');

  function openBlogPost(idx) {
    const post = BLOG_POSTS_STORE[idx];
    if (!post) return;
    const cat = getCat(post.category);

    // Inline SVG thumbnail (zero external deps)
    const heroSrc = thumbSVG(post, 1280, 720);

    // Show loading state immediately
    bmInner.innerHTML = `
      <div class="bm-hero" style="aspect-ratio:16/7;overflow:hidden;position:relative;">
        <img src="${heroSrc}" id="bm-hero-img" class="bm-hero-img" alt="${esc(post.title)}" />
        <div class="bm-hero-overlay"></div>
        <span class="bm-cat-badge ${cat.cls}">${cat.icon} ${cat.label}</span>
      </div>
      <div class="bm-body">
        <div class="bm-meta">
          <time datetime="${post.date}">${fmtDate(post.date)}</time>
          <span class="bm-sep">·</span>
          <span>Kissward Multimedia</span>
          <span class="bm-sep">·</span>
          <span id="bm-readtime">calculating…</span>
        </div>
        <h2 class="bm-title">${esc(post.title)}</h2>
        <div class="bm-loading">
          <div class="bm-spinner"></div>
          <span>Writing full article…</span>
        </div>
      </div>`;

    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    modalOverlay.scrollTop = 0;
    document.body.style.overflow = 'hidden';

    // Fetch full article body
    fetchArticleBody(post).then(html => {
      const mins = readMins(html.replace(/<[^>]+>/g, ' '));
      const readtimeEl = bmInner.querySelector('#bm-readtime');
      if (readtimeEl) readtimeEl.textContent = mins + ' min read';

      const loadingEl = bmInner.querySelector('.bm-loading');
      if (loadingEl) {
        loadingEl.outerHTML = `
          <div class="bm-content">${html}</div>
          <div class="bm-footer">
            <div class="bm-footer-by">Published by <strong>Kissward Multimedia</strong> · Accra, Ghana</div>
            <button class="bm-share-btn" onclick="shareBlogPost(${idx})">Share Article ↗</button>
          </div>`;
      }
    }).catch(() => {
      const loadingEl = bmInner.querySelector('.bm-loading');
      if (loadingEl) {
        loadingEl.outerHTML = `<div class="bm-content"><p>${esc(post.excerpt)}</p></div>`;
      }
    });
  }

  function closeBlogModal() {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  bmCloseBtn && bmCloseBtn.addEventListener('click', closeBlogModal);
  modalOverlay && modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeBlogModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) closeBlogModal();
  });

  // Cursor in modal
  bmCloseBtn && bmCloseBtn.addEventListener('mouseenter', () => { if(cursor){cursor.style.width='20px';cursor.style.height='20px';} });
  bmCloseBtn && bmCloseBtn.addEventListener('mouseleave', () => { if(cursor){cursor.style.width='12px';cursor.style.height='12px';} });

  function shareBlogPost(idx) {
    const post = BLOG_POSTS_STORE[idx];
    if (!post) return;
    if (navigator.share) {
      navigator.share({ title: post.title, text: post.excerpt, url: window.location.href + '#blog' }).catch(() => {});
    } else {
      navigator.clipboard && navigator.clipboard.writeText(window.location.href + '#blog').then(() => {
        const btn = document.querySelector('.bm-share-btn');
        if (btn) { const t = btn.textContent; btn.textContent = '✓ Link Copied!'; setTimeout(() => btn.textContent = t, 2200); }
      });
    }
  }

  // ── Fetch full article body ───────────────────────────────────────────────────
  async function fetchArticleBody(post) {
    // If we have a dev.to URL, redirect the user there for the full article
    if (post.url) {
      return `<p>${esc(post.excerpt)}</p>
        <p style="margin-top:24px"><a href="${esc(post.url)}" target="_blank" rel="noopener"
          style="display:inline-block;background:var(--gold);color:#000;font-weight:700;
          padding:12px 24px;border-radius:8px;text-decoration:none;">Read Full Article on dev.to →</a></p>`;
    }
    return `<p>${esc(post.excerpt)}</p>`;
  }
  async function fetchBlogPosts() {
    const today = new Date().toISOString().split('T')[0];

    // Fetch from dev.to API (free, no API key, CORS-enabled)
    const tags = ['ai', 'artificial-intelligence', 'generative-ai', 'webdev', 'design', 'technology', 'machine-learning', 'opensource', 'startup', 'productivity'];
    const url = `https://dev.to/api/articles?tag=${tags.join(',')}&per_page=20`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`dev.to API ${res.status}`);
    const articles = await res.json();
    if (!Array.isArray(articles) || articles.length < 6) throw new Error('Not enough articles');

    // Map dev.to articles to our format, deduplicate, pick best 6
    const seen = new Set();
    const mapped = [];
    const catOrder = ['ai', 'web', 'design', 'tools', 'update'];

    function classify(article) {
      const t = ((article.title || '') + ' ' + (article.description || '') + ' ' + (article.tags || []).join(' ')).toLowerCase();
      if (/ai|artificial intelligence|machine learning|neural|gpt|claude|openai|gemini|llm/.test(t)) return 'ai';
      if (/design|figma|ui|ux|creative|graphic|typography|branding|canva/.test(t)) return 'design';
      if (/webdev|web development|frontend|css|html|javascript|react|vue|angular|nextjs/.test(t)) return 'web';
      if (/tool|productivity|devops|terminal|cli|git|docker|vs.?code|extension/.test(t)) return 'tools';
      return 'update';
    }

    function excerpt(article) {
      return (article.description || '').length > 80
        ? article.description
        : (article.description || '') + ' ' + (article.title ? `Explore how ${article.title.toLowerCase()} is shaping the industry for creatives and developers in Ghana and across Africa.` : '');
    }

    for (const a of articles) {
      const key = (a.title || '').toLowerCase().trim();
      if (seen.has(key) || !a.title || !a.description) continue;
      seen.add(key);
      mapped.push({
        title: a.title,
        excerpt: excerpt(a),
        category: classify(a),
        date: (a.published_at || today).split('T')[0],
        url: a.url || '',
        cover: a.cover_image || '',
        tags: a.tags || [],
      });
    }

    // Sort: prefer articles with cover images, then by category diversity
    const result = [];
    const catsUsed = new Set();
    const pool = [...mapped];

    // Pick one per category first
    for (const cat of catOrder) {
      const idx = pool.findIndex(a => a.category === cat);
      if (idx >= 0) { result.push(pool.splice(idx, 1)[0]); catsUsed.add(cat); }
    }

    // Fill remaining slots from pool (prefer those with cover images)
    pool.sort((a, b) => {
      if (a.cover && !b.cover) return -1;
      if (!a.cover && b.cover) return 1;
      return 0;
    });
    while (result.length < 6 && pool.length) {
      result.push(pool.shift());
    }

    // Assign today's date to all
    result.forEach(p => { p.date = today; });

    return result;
  }

  // ── Load posts (cached or fresh) ─────────────────────────────────────────────
  async function loadBlogPosts(forceRefresh = false) {
    const content = document.getElementById('blog-content');
    if (!forceRefresh) {
      try {
        const ts      = localStorage.getItem(BLOG_CACHE_TS);
        const today   = new Date().toISOString().split('T')[0];
        const cached  = localStorage.getItem(BLOG_CACHE_KEY);
        const cachedDay = ts ? new Date(parseInt(ts)).toISOString().split('T')[0] : null;
        if (ts && cachedDay === today && cached) {
          const posts = JSON.parse(cached);
          if (Array.isArray(posts) && posts.length) {
            renderBlog(posts);
            updateLastUpdated(parseInt(ts));
            return;
          }
        }
      } catch(e) {}
    }

    content.innerHTML = `<div class="blog-loading"><div class="blog-spinner"></div><span>Generating today's tech stories…</span></div>`;

    try {
      const posts = await fetchBlogPosts();
      const now = Date.now();
      try { localStorage.setItem(BLOG_CACHE_KEY, JSON.stringify(posts)); localStorage.setItem(BLOG_CACHE_TS, String(now)); } catch(e) {}
      renderBlog(posts);
      updateLastUpdated(now);
    } catch(err) {
      console.warn('Blog load error:', err);
      const today = new Date().toISOString().split('T')[0];
      const fallback = [
        { title: "Anthropic Launches Claude Fable 5 — New Top-Tier Model Surpasses Opus 4.8 by 10%+", excerpt: "Anthropic released Claude Fable 5 on June 9, 2026 — its most capable model yet, scoring more than 10% higher than Opus 4.8 on key benchmarks. It features a 1M token context window, 128K max output tokens, and new safety guardrails that enabled broad release. The model ID is claude-fable-5, priced at $10/M input tokens and $50/M output tokens. Opus 4 and Sonnet 4 were retired on June 15, with all users migrating to Fable 5 or Opus 4.8. For Ghanaian developers, this means access to frontier reasoning at enterprise API pricing with full safety layers.", category: "ai", date: today },
        { title: "DeepSeek-V4 Pro: 1.6 Trillion Parameters, Million-Token Context Goes Open Weights", excerpt: "DeepSeek released V4-Pro, a Mixture-of-Experts model with 1.6T total parameters (49B activated per token) and million-token context intelligence. Released June 20 under a permissive license, it leads open-source math benchmarks with 96% on GSM8K. Combined with NVIDIA's Nemotron 3 Ultra (announced at Computex 2026), the open-weights ecosystem now rivals closed APIs for most production tasks. African startups can run these models on consumer GPUs for inference — zero API costs, full data privacy, and no latency.", category: "opensource", date: today },
        { title: "Google Gemini 3.5 Pro Launches with Major Reasoning & Agentic Workflow Upgrades", excerpt: "Google launched Gemini 3.5 Pro in mid-June, building on Gemini 3.5 Flash. It delivers major improvements in complex reasoning, long-context understanding, and native agentic workflows. Deep Research Max agents can now autonomously execute multi-step research tasks across web, documents, and databases. Native Google Workspace and Cloud integration is driving rapid enterprise adoption. For digital agencies in Ghana, Gemini 3.5 Pro enables automated client reporting, multilingual content generation, and data analysis — all within the Google ecosystem.", category: "tools", date: today },
        { title: "xAI Grok 5 & OpenAI GPT-5.6 Heat Up the AI Model Arms Race", excerpt: "June 2026 has become the most intense battleground in AI history. xAI rolled out Grok 5 with real-time X platform knowledge and reduced guardrails, gaining popularity among developers and researchers. OpenAI continues rapid iteration with GPT-5.6 efficiency-focused variants. Moonshot AI's Kimi K2.7 Code achieves top-tier coding benchmarks, while NVIDIA's Nemotron 3 Ultra opens new possibilities for self-hosted AI. The message is clear: AI models are commoditising fast — pick the best tool for each job, not the biggest name.", category: "tech", date: today },
        { title: "Zhipu AI Releases GLM-5.2: 753B Open-Source Model Rivals GPT-5.5 at 1/6 the Cost", excerpt: "Z.ai (formerly Zhipu AI) released GLM-5.2 on June 16 under an MIT open-source license — a 753B-parameter Mixture-of-Experts model with 40B active per token and a solid 1M-token context window. It beats GPT-5.5 on FrontierSWE (74.4% vs 72.6%) and Terminal-Bench 2.1 (81.0), while costing 1/4 to 1/6 the API price of comparable closed models. With IndexShare architecture reducing per-token FLOPs by 2.9x at 1M context, it's the strongest open-weight coding model available. For African developers, this means frontier-class agentic coding without API vendor lock-in.", category: "opensource", date: today },
        { title: "Replit Learns Your Preferences & Hermes Launches Scheduled AI Agents", excerpt: "Replit introduced persistent instructions and reusable skills — the platform now remembers brand guidelines, development preferences, design systems, and workflow rules for a personalised AI coding experience. Hermes launched scheduled AI agents for recurring tasks: morning briefings, news summaries, habit tracking, and research updates. Microsoft Copilot computer-use agents also reached GA, operating software interfaces directly. For developers and agencies, autonomous recurring AI workflows are no longer future-tech — they ship today.", category: "tools", date: today },
      ];
      renderBlog(fallback);
      updateLastUpdated(Date.now());
    }
  }

  function updateLastUpdated(ts) {
    const el = document.getElementById('blog-last-updated');
    if (!el) return;
    const d = new Date(ts);
    el.textContent = 'Updated: ' + d.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' }) + ' · ' + d.toLocaleDateString('en-GB', { day:'numeric', month:'short' });
  }

  function updateBlogSchema(posts) {
    const s = document.getElementById('blog-schema');
    if (!s) return;
    s.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "Blog",
      "name": "Kissward Multimedia Tech & Design Digest",
      "url": "https://www.kisswardmultimedia.top/#blog",
      "publisher": { "@type": "Organization", "name": "Kissward Multimedia" },
      "inLanguage": "en-GH",
      "blogPost": posts.slice(0,6).map((p,i) => ({
        "@type": "BlogPosting", "position": i+1,
        "headline": p.title, "description": p.excerpt,
        "datePublished": p.date,
        "author": { "@type": "Organization", "name": "Kissward Multimedia" }
      }))
    }, null, 2);
  }

  function handleNewsletterSignup() {
    const input = document.getElementById('blog-nl-email');
    const btn   = document.getElementById('blog-nl-submit');
    if (!input || !input.value.includes('@')) { input && input.focus(); return; }
    btn.textContent = '✓ Subscribed!';
    btn.style.background = '#4caf50';
    btn.disabled = true;
    input.value = '';
    setTimeout(() => { btn.textContent = 'Subscribe →'; btn.style.background = ''; btn.disabled = false; }, 4000);
  }

  // Init
  loadBlogPosts();
  setInterval(() => loadBlogPosts(true), BLOG_TTL_MS);

  // ── LinkedIn Feed: Claude-generated posts from Kissward Multimedia ────────────
  const LI_CACHE_KEY = 'km_linkedin_posts_v1';
  const LI_CACHE_TS  = 'km_linkedin_posts_ts_v1';
  const LI_TTL_MS    = 24 * 60 * 60 * 1000; // refresh once per day

  const LI_FALLBACK = [
    {
      emoji: '🚀',
      date: 'Latest Update',
      tag: '💻 Website Development',
      text: "Just launched a new e-commerce website for a Ghanaian retail brand — fully mobile-optimised with an integrated Mobile Money payment gateway. Clean UI, fast load times, and built to convert. Proud of the team's work on this one! #WebDevelopment #Ghana #Ecommerce"
    },
    {
      emoji: '🎬',
      date: 'Featured Showcase',
      tag: '🎨 Animation & Motion',
      text: "Behind the scenes of our latest 3D product animation project. From concept sketches to final render — this is why we love what we do. Every frame is intentional. Full video dropping on YouTube soon! #3DAnimation #MotionGraphics #Accra"
    }
  ];

  function liCardHTML(post) {
    const liUrl = 'https://gh.linkedin.com/in/kissward-multimedia-013577100';
    return `<a href="${liUrl}" class="li-post-card" target="_blank" rel="noopener" aria-label="View Kissward Multimedia LinkedIn post">
      <div class="li-post-date">${post.emoji ? post.emoji + ' ' : '📅 '}${post.date}</div>
      <p class="li-post-text">${post.text}</p>
      <span class="li-post-tag">${post.tag} · View on LinkedIn →</span>
    </a>`;
  }

  function renderLinkedIn(posts) {
    const container = document.getElementById('linkedin-feed-container');
    if (!container) return;
    container.innerHTML = posts.map(liCardHTML).join('');
  }

  async function fetchLinkedInPosts() {
    // Return the curated fallback posts directly (no API key needed)
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    return [
      { emoji: '🎬', date: today, tag: '🎨 Animation & Motion', text: "Just wrapped post-production on a new 3D product animation that pushes what's possible with real-time rendering. From concept art to final composite — every frame is a conversation between the brand and its audience. Our team in Accra delivered this in under 72 hours. #3DAnimation #MotionDesign #Accra #GhanaTech" },
      { emoji: '💻', date: today, tag: '💻 Web Development', text: "We rebuilt a client's e-commerce platform from scratch this month — and the numbers speak for themselves: 40% faster load times, 60% better mobile conversion rate, and a 25% increase in average session duration. Modern Jamstack architecture paired with Ghanaian creativity is a powerful combination. #WebDevelopment #Jamstack #UIUX #MadeInGhana" },
    ];
  }

  async function loadLinkedInFeed() {
    // Try cache first
    try {
      const ts = localStorage.getItem(LI_CACHE_TS);
      const now = Date.now();
      if (ts && (now - parseInt(ts)) < LI_TTL_MS) {
        const cached = localStorage.getItem(LI_CACHE_KEY);
        if (cached) {
          const posts = JSON.parse(cached);
          if (Array.isArray(posts) && posts.length) { renderLinkedIn(posts); return; }
        }
      }
    } catch(e) {}

    try {
      const posts = await fetchLinkedInPosts();
      try { localStorage.setItem(LI_CACHE_KEY, JSON.stringify(posts)); localStorage.setItem(LI_CACHE_TS, String(Date.now())); } catch(e) {}
      renderLinkedIn(posts);
    } catch(err) {
      console.warn('LinkedIn feed error:', err);
      renderLinkedIn(LI_FALLBACK);
    }
  }

  loadLinkedInFeed();


