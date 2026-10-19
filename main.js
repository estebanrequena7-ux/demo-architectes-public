/* ============================================================
   main.js — comportements communs : menu mobile, apparitions
   (identique pour tous les clients : ne pas modifier)
   Sans JavaScript, ou avec « prefers-reduced-motion », tout reste
   visible : les apparitions ne sont qu'un enrichissement.
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('ready'); // sécurité : jamais de page masquée si render.js a échoué

  /* ── Menu mobile ────────────────────────────────────────── */
  var btn = document.querySelector('.menu-btn'), nav = document.getElementById('site-nav');
  if (btn && nav) {
    var D = window.SITE_DATA || {};
    var label = btn.querySelector('[data-label]');
    var inert = ['#main', '.site-footer', '.skip'];
    var mq = window.matchMedia('(max-width: 767px)');
    function setOpen(open, restoreFocus) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) { nav.setAttribute('data-open', ''); document.body.setAttribute('data-menu-open', ''); }
      else { nav.removeAttribute('data-open'); document.body.removeAttribute('data-menu-open'); }
      if (label) label.textContent = open ? (D.menuCloseLabel || 'Fermer') : (D.menuLabel || 'Menu');
      inert.forEach(function (s) {
        var n = document.querySelector(s); if (!n) return;
        if (open) n.setAttribute('inert', ''); else n.removeAttribute('inert');
      });
      if (!open && restoreFocus) btn.focus();
    }
    btn.addEventListener('click', function () { setOpen(btn.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') setOpen(false, true);
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(function () { if (!mq.matches) setOpen(false); });
    window.addEventListener('pageshow', function () { setOpen(false); });
  }

  /* ── Apparitions au défilement (transform + opacity) ────── */
  var SELECTOR = '.statement, .services-intro, .sec-head, .work .ph, .work .meta, .member .ph, .detail-gallery .ph, .metier .ph, .metier .meta, .stat, .step-list li, .contact-band .big, .contact-text, .contact-actions, .member, .contact-info > div, .map, .form-wrap > div, .detail-text, .sheet, .detail-gallery figure, .detail-nav .grid, .agency-intro .cols p';
  var io = null;
  // Le masque d'une image (clip-path) la rend « invisible » pour l'observateur : on observe donc son parent
  var watch = typeof WeakMap === 'function' ? new WeakMap() : null;
  // Chiffres clés : le HTML contient la valeur finale ; à l'apparition, elle monte de 0 jusqu'à elle
  function countUp(root) {
    Array.prototype.forEach.call(root.querySelectorAll('[data-count]'), function (n) {
      var to = +n.getAttribute('data-count'), t0 = null, dur = 1800;
      function frame(t) {
        if (t0 === null) t0 = t;
        var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
        n.textContent = Math.round(to * e).toLocaleString('fr-FR');
        if (k < 1) requestAnimationFrame(frame);
      }
      n.textContent = '0';
      requestAnimationFrame(frame);
    });
  }
  function shown(n) { n.classList.add('in'); if (n.matches('.stat')) countUp(n); }
  if ('IntersectionObserver' in window && !reduce) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { var group = watch.get(en.target); if (group) group.forEach(shown); if (en.target.hasAttribute('data-reveal')) shown(en.target); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  }
  var Reveal = {
    scan: function (root) {
      if (!io) return;
      Array.prototype.forEach.call((root || document).querySelectorAll(SELECTOR), function (n) {
        if (n.hasAttribute('data-seen')) return;
        n.setAttribute('data-seen', '');
        if (!n.hasAttribute('data-reveal')) n.setAttribute('data-reveal', n.matches('.ph') ? 'mask' : n.matches('.member') ? 'image' : '');
        var target = n.getAttribute('data-reveal') === 'mask' ? n.parentElement : n;
        if (target !== n) { var g = watch.get(target) || []; g.push(n); watch.set(target, g); }
        var r = target.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92 && r.bottom > 0 && r.left < window.innerWidth) { shown(n); return; } // déjà visible : pas de clignotement
        io.observe(target);
      });
    },
  };
  window.Reveal = Reveal;
  Reveal.scan(document);
  // Sécurité : si l'observateur n'a rien révélé après 4 s (onglet en arrière-plan, etc.), tout s'affiche.
  if (io) setTimeout(function () {
    Array.prototype.forEach.call(document.querySelectorAll('[data-reveal]:not(.in)'), function (n) {
      var r = n.getBoundingClientRect(); if (r.top < window.innerHeight * 1.2 && r.left < window.innerWidth) shown(n);
    });
  }, 4000);

  /* ── Accueil : défilement horizontal, parallaxe, curseur « Voir » ─────
     Tout est coupé avec « prefers-reduced-motion ». Sans JavaScript, la liste
     des projets reste une simple grille. */
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var sec = document.querySelector('[data-hscroll]');
  var wide = window.matchMedia('(min-width: 1024px)');
  var hs = { on: false, travel: 0 };
  if (sec) {
    var pin = sec.querySelector('.hs-pin'), track = sec.querySelector('.hs-track'), bar = sec.querySelector('.hs-bar');
    var measure = function () {
      hs.travel = Math.max(0, track.scrollWidth - pin.clientWidth);
      sec.style.setProperty('--travel', hs.travel + 'px');
    };
    var setMode = function () {
      var want = wide.matches && !reduce;
      if (want === hs.on) { if (want) measure(); return; }
      hs.on = want; sec.classList.toggle('hs-on', want);
      if (want) measure(); else { track.style.transform = ''; bar.style.removeProperty('--p'); sec.style.removeProperty('--travel'); }
    };
    setMode();
    (wide.addEventListener ? wide.addEventListener.bind(wide, 'change') : wide.addListener.bind(wide))(setMode);
    window.addEventListener('load', function () { if (hs.on) { measure(); tick(); } });
    // Au clavier, un projet qui reçoit le focus fait défiler la page jusqu'à lui
    sec.addEventListener('focusin', function (e) {
      if (!hs.on) return;
      var card = e.target.closest('.work, .hs-end'); if (!card) return;
      var x = clamp(card.offsetLeft - (window.innerWidth - card.offsetWidth) / 2, 0, hs.travel);
      window.scrollTo(0, sec.getBoundingClientRect().top + window.pageYOffset + x);
    });
  }

  var inTrack = new WeakMap();
  var SC = 1.14, last = new WeakMap();
  function tick() {
    var vh = window.innerHeight, vw = window.innerWidth;
    if (hs.on) {
      var r = sec.getBoundingClientRect(), p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
      track.style.transform = 'translate3d(' + (-p * hs.travel).toFixed(1) + 'px,0,0)';
      bar.style.setProperty('--p', p.toFixed(4));
    }
    if (reduce) return;
    Array.prototype.forEach.call(document.querySelectorAll('[data-parallax]'), function (el) {
      var b = el.getBoundingClientRect();
      if (b.bottom < -80 || b.top > vh + 80 || b.right < -80 || b.left > vw + 80) return;
      var sy = b.height * (SC - 1) / 2, sx = b.width * (SC - 1) / 2;
      var py = clamp(-(b.top + b.height / 2 - vh / 2) * 0.09, -sy, sy);
      if (!inTrack.has(el)) inTrack.set(el, !!el.closest('.hs-track'));
      var px = (hs.on && inTrack.get(el)) ? clamp(-(b.left + b.width / 2 - vw / 2) * 0.07, -sx, sx) : 0;
      var key = Math.round(py) + ':' + Math.round(px);
      if (last.get(el) === key) return;
      last.set(el, key);
      var pic = el.firstElementChild;
      if (pic) { pic.style.setProperty('--py', py.toFixed(1) + 'px'); pic.style.setProperty('--px', px.toFixed(1) + 'px'); }
    });
  }
  var queued = false;
  function onScroll() { if (queued) return; queued = true; requestAnimationFrame(function () { queued = false; tick(); }); }
  if (sec || document.querySelector('[data-parallax]')) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { if (sec && hs.on) { hs.travel = Math.max(0, track.scrollWidth - pin.clientWidth); sec.style.setProperty('--travel', hs.travel + 'px'); } onScroll(); });
    tick();
  }

  /* Curseur rond « Voir » : souris seulement, jamais au toucher ni avec mouvement réduit */
  if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches && document.querySelector('.work, .metier')) {
    var cur = document.createElement('div');
    cur.className = 'cursor'; cur.setAttribute('aria-hidden', 'true');
    cur.innerHTML = '<i></i><span></span>';
    cur.lastChild.textContent = (window.SITE_DATA && SITE_DATA.ui && SITE_DATA.ui.cursor) || 'Voir';
    document.body.appendChild(cur);
    document.documentElement.classList.add('has-cursor');
    var tx = -200, ty = -200, cx = tx, cy = ty, running = false;
    var loop = function () {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      cur.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
      if (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.3) requestAnimationFrame(loop); else running = false;
    };
    document.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!cur.classList.contains('on') && !running) { cx = tx; cy = ty; }
      if (!running) { running = true; requestAnimationFrame(loop); }
      cur.classList.toggle('on', !!e.target.closest('.work, .metier'));
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', function () { cur.classList.remove('on'); });
  }
})();
