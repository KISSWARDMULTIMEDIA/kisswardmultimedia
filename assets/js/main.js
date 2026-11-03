/* ==========================================================================
   Kissward Multimedia — site behaviour
   Vanilla JS, no dependencies. ~9 KB unminified.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ------------------------------------------------------------------ *
   * 1. Header state, back-to-top, mobile action bar
   * ------------------------------------------------------------------ */
  var head = $('#siteHead');
  var toTop = $('#toTop');
  var actionBar = $('#actionBar');
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (head) head.classList.toggle('is-scrolled', y > 12);
    if (toTop) toTop.classList.toggle('is-visible', y > 700);
    if (actionBar) actionBar.classList.toggle('is-visible', y > 520);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------ *
   * 2. Mobile menu (focus trap, Escape, scroll lock)
   * ------------------------------------------------------------------ */
  var burger = $('#burger');
  var menu = $('#menu');
  var menuClose = $('#menuClose');
  var lastFocus = null;

  function menuIsOpen() {
    return menu && menu.classList.contains('is-open');
  }

  function openMenu() {
    if (!menu) return;
    lastFocus = document.activeElement;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    if (menuClose) menuClose.focus();
  }

  function closeMenu(returnFocus) {
    if (!menu) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    if (returnFocus !== false) {
      (lastFocus && document.contains(lastFocus) ? lastFocus : burger || document.body).focus();
    }
  }

  if (burger) burger.addEventListener('click', function () {
    menuIsOpen() ? closeMenu() : openMenu();
  });
  if (menuClose) menuClose.addEventListener('click', function () { closeMenu(); });

  if (menu) {
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { closeMenu(false); });
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!menuIsOpen()) return;
    if (e.key === 'Escape') { closeMenu(); return; }
    if (e.key !== 'Tab') return;
    var focusables = $$('a[href], button:not([disabled]), input, select, textarea', menu)
      .filter(function (el) { return el.offsetParent !== null; });
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Close the sheet if the viewport grows past the desktop breakpoint
  var desktop = window.matchMedia('(min-width: 900px)');
  var onBreakpoint = function (e) { if (e.matches && menuIsOpen()) closeMenu(false); };
  if (desktop.addEventListener) desktop.addEventListener('change', onBreakpoint);
  else if (desktop.addListener) desktop.addListener(onBreakpoint);

  /* ------------------------------------------------------------------ *
   * 3. Scroll reveal
   * ------------------------------------------------------------------ */
  var reveals = $$('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

    reveals.forEach(function (el) {
      // Cards inside a horizontal rail may never intersect vertically — show them now.
      if (el.closest('.testi__grid')) { el.classList.add('is-visible'); return; }
      revealObserver.observe(el);
    });
  }

  /* ------------------------------------------------------------------ *
   * 4. Nav active state
   * ------------------------------------------------------------------ */
  var navLinks = $$('.nav__link');
  var sections = navLinks.map(function (link) {
    var id = link.getAttribute('href');
    return { link: link, el: id && id.charAt(0) === '#' ? $(id) : null };
  }).filter(function (item) { return !!item.el; });

  if (sections.length && 'IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (l) { l.classList.remove('is-active'); });
        var match = sections.filter(function (s) { return s.el === entry.target; })[0];
        if (match) match.link.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { navObserver.observe(s.el); });
  }

  /* ------------------------------------------------------------------ *
   * 5. Counters
   * ------------------------------------------------------------------ */
  var counters = $$('[data-count]');

  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduceMotion) { el.textContent = target; return; }
    var start = null;
    var duration = 1400;
    function step(now) {
      if (start === null) start = now;
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) window.requestAnimationFrame(step);
      else el.textContent = target;
    }
    window.requestAnimationFrame(step);
  }

  if (counters.length && 'IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ------------------------------------------------------------------ *
   * 6. Work grid: expand all + lightbox
   * ------------------------------------------------------------------ */
  var workGrid = $('#workGrid');
  var workMore = $('#workMore');
  var workItems = workGrid ? $$('.work-item', workGrid) : [];
  var COLLAPSED_COUNT = 10;
  var expanded = false;

  function fullSize(img) {
    var srcset = img.getAttribute('srcset');
    if (!srcset) return img.getAttribute('src') || '';
    var best = '';
    var bestWidth = -1;
    srcset.split(',').forEach(function (part) {
      var bits = part.trim().split(/\s+/);
      var width = parseInt(bits[1], 10) || 0;
      if (width > bestWidth) { bestWidth = width; best = bits[0]; }
    });
    return best || img.getAttribute('src') || '';
  }

  if (workMore && workItems.length) {
    workMore.addEventListener('click', function () {
      expanded = !expanded;
      workItems.forEach(function (item, i) {
        if (i < COLLAPSED_COUNT) return;
        item.hidden = !expanded;
        if (expanded) item.classList.add('is-visible');
      });
      workMore.setAttribute('aria-expanded', String(expanded));
      workMore.textContent = expanded ? 'Show fewer projects' : 'View all ' + workItems.length + ' projects';
    });
  }

  var lb = $('#lightbox');
  var lbImg = $('#lbImg');
  var lbCap = $('#lbCap');
  var lbCount = $('#lbCount');
  var lbClose = $('#lbClose');
  var lbPrev = $('#lbPrev');
  var lbNext = $('#lbNext');
  var lbIndex = 0;
  var lbReturnFocus = null;

  var gallery = workItems.map(function (item) {
    var img = $('img', item);
    var label = $('.work-item__label', item);
    return {
      src: img ? fullSize(img) : '',
      alt: img ? (img.getAttribute('alt') || '') : '',
      caption: label ? label.textContent.trim() : ''
    };
  });

  function renderSlide() {
    if (!gallery.length) return;
    var item = gallery[lbIndex];
    lbImg.src = item.src;
    lbImg.alt = item.alt;
    lbCap.textContent = item.caption;
    lbCount.textContent = (lbIndex + 1) + ' / ' + gallery.length;
  }

  function openLightbox(index, trigger) {
    if (!lb || !gallery.length) return;
    lbIndex = Math.max(0, Math.min(index, gallery.length - 1));
    renderSlide();
    lbReturnFocus = trigger || document.activeElement;
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    if (lbClose) lbClose.focus();
  }

  function closeLightbox() {
    if (!lb) return;
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    if (!menuIsOpen()) document.body.classList.remove('is-locked');
    if (lbReturnFocus && document.contains(lbReturnFocus)) lbReturnFocus.focus();
  }

  function stepSlide(delta) {
    if (!gallery.length) return;
    lbIndex = (lbIndex + delta + gallery.length) % gallery.length;
    renderSlide();
  }

  workItems.forEach(function (item, i) {
    item.addEventListener('click', function () { openLightbox(i, item); });
  });

  if (lb) {
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', function () { stepSlide(-1); });
    if (lbNext) lbNext.addEventListener('click', function () { stepSlide(1); });
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lb__stage')) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') { closeLightbox(); return; }
      if (e.key === 'ArrowLeft') { stepSlide(-1); return; }
      if (e.key === 'ArrowRight') { stepSlide(1); return; }
      if (e.key !== 'Tab') return;
      var focusables = [lbClose, lbPrev, lbNext].filter(function (el) { return el && el.offsetParent !== null; });
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ------------------------------------------------------------------ *
   * 7. Testimonial rail dots (mobile only)
   * ------------------------------------------------------------------ */
  var rail = $('#testiTrack');
  var dotsWrap = $('#testiDots');

  if (rail && dotsWrap) {
    var cards = $$('.testi-card', rail);
    var dots = cards.map(function (card, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'testi__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Go to review ' + (i + 1));
      dot.addEventListener('click', function () {
        var left = card.offsetLeft - rail.offsetLeft;
        rail.scrollTo({ left: left, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function syncDots() {
      if (window.innerWidth >= 900) return;
      var centre = rail.scrollLeft + rail.clientWidth * 0.42;
      var closest = 0;
      var best = Infinity;
      cards.forEach(function (card, i) {
        var distance = Math.abs(card.offsetLeft - rail.offsetLeft - centre + card.offsetWidth / 2);
        if (distance < best) { best = distance; closest = i; }
      });
      dots.forEach(function (dot, i) { dot.classList.toggle('is-active', i === closest); });
    }

    var railTick = false;
    rail.addEventListener('scroll', function () {
      if (railTick) return;
      railTick = true;
      window.requestAnimationFrame(function () { syncDots(); railTick = false; });
    }, { passive: true });
    syncDots();
  }

  /* ------------------------------------------------------------------ *
   * 8. Contact form → mailto handoff
   * ------------------------------------------------------------------ */
  var form = $('#contact-form');

  if (form) {
    var status = $('#formStatus');
    var submit = $('.form-submit', form);

    function setStatus(message, tone) {
      if (!status) return;
      status.textContent = message;
      status.hidden = !message;
      status.style.borderColor = tone === 'error' ? 'rgba(180,35,24,.35)' : '';
    }

    function invalid(field, on) {
      if (!field) return;
      if (on) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fname = form.fname;
      var email = form.email;
      var message = form.message;
      var bad = [];

      [fname, email, message].forEach(function (field) { invalid(field, false); });

      if (!fname.value.trim()) bad.push(fname);
      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) bad.push(email);
      if (!message.value.trim()) bad.push(message);

      if (bad.length) {
        bad.forEach(function (field) { invalid(field, true); });
        bad[0].focus();
        setStatus('Please add your name, a valid email address and a short message.', 'error');
        return;
      }

      var service = form.service.value;
      var subject = '[Kissward Multimedia] New enquiry — ' + (service || 'General') + ' — ' + fname.value.trim();
      var body = [
        'Name: ' + fname.value.trim() + ' ' + form.lname.value.trim(),
        'Email: ' + email.value.trim(),
        'Service: ' + (service || 'Not specified'),
        '',
        'Message:',
        message.value.trim()
      ].join('\n');

      window.location.href = 'mailto:kisswardmultimedia@gmail.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);

      setStatus('Opening your email app with the message ready to send.', 'ok');
      if (submit) {
        var original = submit.textContent;
        submit.textContent = 'Opening email…';
        submit.disabled = true;
        window.setTimeout(function () {
          submit.textContent = original;
          submit.disabled = false;
        }, 3500);
      }
    });

    form.addEventListener('input', function (e) {
      if (e.target.matches('input, textarea')) invalid(e.target, false);
    });
  }

  /* ------------------------------------------------------------------ *
   * 9. Hide the floating action bar while the menu is open
   * ------------------------------------------------------------------ */
  if (menu && actionBar) {
    var menuObserver = new MutationObserver(function () {
      actionBar.style.visibility = menu.classList.contains('is-open') ? 'hidden' : '';
    });
    menuObserver.observe(menu, { attributes: true, attributeFilter: ['class'] });
  }

  /* ------------------------------------------------------------------ *
   * 10. Hero logo loop (autoplay muted, respects reduced motion)
   * ------------------------------------------------------------------ */
  var heroLoop = $('#heroLoop');

  if (heroLoop) {
    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function syncHeroLoop() {
      if (motionQuery.matches) {
        heroLoop.pause();
        return;
      }
      var attempt = heroLoop.play();
      if (attempt && attempt.catch) attempt.catch(function () {});
    }

    syncHeroLoop();
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', syncHeroLoop);
    else if (motionQuery.addListener) motionQuery.addListener(syncHeroLoop);
  }
})();
