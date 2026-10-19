/* ============================================================
   render.js — injecte le contenu de data.js dans les pages
   (identique pour tous les clients : ne pas modifier)
   ============================================================ */
(function () {
  'use strict';
  var D = window.SITE_DATA;
  if (!D) { document.documentElement.classList.add('ready'); return; }

  var NB = ' ', NNB = ' ';
  var page = document.body.getAttribute('data-page');
  // Page générée au déploiement (scripts/build.mjs) : le contenu est déjà dans le HTML,
  // render.js ne le reconstruit pas et se contente de brancher les comportements.
  var pre = document.documentElement.hasAttribute('data-prerendered');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Typographie française ──────────────────────────────────
     Pas d'espace avant « , » et « . » ; espace fine insécable avant « ; ! ? »,
     insécable avant « : » et dans « » ; nombres et unités liés. */
  function fr(s) {
    return String(s)
      .replace(/\s+([,.])(?![.\d])/g, '$1')
      .replace(/[  ]+([;!?])/g, NNB + '$1')
      .replace(/[  ]+:/g, NB + ':')
      .replace(/«\s*/g, '«' + NB).replace(/\s*»/g, NB + '»')
      .replace(/(\d) (?=\d{3}(?!\d))/g, '$1' + NNB)
      .replace(/(\d) (?=(m²|km|kg|h|min|%|€)(?![\p{L}]))/gu, '$1' + NB)
      .replace(/\bh (?=\d)/g, 'h' + NB);
  }
  function num(n) { return Number(n).toLocaleString('fr-FR'); }
  function m2(n) { return num(n) + NB + 'm²'; }

  /* ── Outils DOM ─────────────────────────────────────────── */
  function get(path, root) {
    return String(path).split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, root || D);
  }
  function el(tag, attrs) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (attrs[k] == null || attrs[k] === false) continue;
      if (k === 'text') n.textContent = fr(attrs[k]);
      else if (k === 'raw') n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
    }
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c == null || c === false) continue;
      (Array.isArray(c) ? c : [c]).forEach(function (x) { n.appendChild(typeof x === 'string' ? document.createTextNode(fr(x)) : x); });
    }
    return n;
  }
  function rich(node, text) { // *mot* → <em>mot</em>
    node.textContent = '';
    String(text).split(/(\*[^*]+\*)/).forEach(function (part) {
      if (!part) return;
      if (part.charAt(0) === '*') node.appendChild(el('em', { text: part.slice(1, -1) }));
      else node.appendChild(document.createTextNode(fr(part)));
    });
  }
  function slot(name) { return document.querySelector('[data-slot="' + name + '"]'); }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }

  function picture(img, o) {
    o = o || {};
    var widths = img.widths || [480, 800, 1200];
    function set(src, ext) {
      return widths.map(function (w) { return 'images/' + src + '-' + w + '.' + ext + ' ' + w + 'w'; }).join(', ');
    }
    var p = document.createElement('picture');
    if (o.mobile) {
      var mw = o.mobile.widths || [480, 800, 1200];
      ['avif', 'webp'].forEach(function (ext) {
        p.appendChild(el('source', { media: '(max-width: 767px)', type: 'image/' + ext, sizes: '100vw',
          srcset: mw.map(function (w) { return 'images/' + o.mobile.src + '-' + w + '.' + ext + ' ' + w + 'w'; }).join(', ') }));
      });
    }
    ['avif', 'webp'].forEach(function (ext) {
      p.appendChild(el('source', { type: 'image/' + ext, sizes: o.sizes || '100vw', srcset: set(img.src, ext) }));
    });
    var r = String(img.ratio || '4/3').split('/');
    var ratio = parseFloat(r[0]) / parseFloat(r[1] || 1);
    var fallbackW = widths.filter(function (w) { return w >= 800; })[0] || widths[widths.length - 1];
    p.appendChild(el('img', {
      src: 'images/' + img.src + '-' + fallbackW + '.webp', alt: img.alt || '',
      width: fallbackW, height: Math.round(fallbackW / ratio),
      loading: o.eager ? null : 'lazy', decoding: 'async', fetchpriority: o.eager ? 'high' : null,
    }));
    return p;
  }
  function ph(img, o) {
    var d = el('div', { 'class': 'ph', 'data-parallax': (o && o.parallax) ? '' : null });
    d.appendChild(picture(img, o));
    return d;
  }
  function setRatio(node, r, rm) {
    node.setAttribute('data-r', r); node.style.setProperty('--r', r);
    if (rm) { node.setAttribute('data-rm', rm); node.style.setProperty('--rm', rm); }
  }
  function applyRatios() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-r]'), function (n) {
      n.style.setProperty('--r', n.getAttribute('data-r'));
      if (n.hasAttribute('data-rm')) n.style.setProperty('--rm', n.getAttribute('data-rm'));
    });
  }
  function project(slug) { return D.projects.filter(function (p) { return p.slug === slug; })[0]; }
  function typeLabel(id) { var t = D.types.filter(function (x) { return x.id === id; })[0]; return t ? t.label : id; }

  /* ── Méta et liaisons statiques ─────────────────────────── */
  document.documentElement.lang = D.site.lang || 'fr';
  if (D.site.palette) document.documentElement.setAttribute('data-palette', D.site.palette);
  var meta = D.meta[page];
  if (meta && !pre) {
    document.title = fr(meta.title);
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', fr(meta.description));
  }
  if (!pre) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-t]'), function (n) {
      var v = get(n.getAttribute('data-t')); if (v != null) n.textContent = fr(v);
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-rich]'), function (n) {
      var v = get(n.getAttribute('data-rich')); if (v != null) rich(n, v);
    });
  } else applyRatios();

  /* ── En-tête et pied de page ────────────────────────────── */
  (function header() {
    var s = slot('header'); if (!s || pre) return;
    var parts = D.site.name.split(' & ');
    var brand = el('a', { 'class': 'brand', href: '/' });
    brand.appendChild(document.createTextNode(parts[0] + ' '));
    if (parts[1]) {
      brand.appendChild(el('span', { raw: '&' }));
      brand.appendChild(document.createTextNode(' ' + parts[1]));
    }
    if (D.site.suffix) brand.appendChild(el('span', { 'class': 'sub', text: ' ' + D.site.suffix }));
    var btn = el('button', { type: 'button', 'class': 'menu-btn', 'aria-expanded': 'false', 'aria-controls': 'site-nav' },
      el('span', { 'data-label': true, text: D.menuLabel }), el('span', { 'class': 'bars', 'aria-hidden': 'true' }));
    var ul = el('ul');
    D.nav.forEach(function (n) {
      var a = el('a', { href: n.href, text: n.label, 'aria-current': n.page === page ? 'page' : null });
      ul.appendChild(el('li', null, a));
    });
    var nav = el('nav', { 'class': 'nav', id: 'site-nav', 'aria-label': D.ui.mainLabel }, ul);
    s.appendChild(el('div', { 'class': 'grid' }, brand, btn, nav));
  })();

  (function footer() {
    var s = slot('footer'); if (!s || pre) return;
    var a = D.agency;
    function col(c, content) {
      var d = el('div', { 'class': 'col' }, el('span', { 'class': 'label', text: c.label }));
      content.forEach(function (x, i) { if (i) d.appendChild(document.createElement('br')); d.appendChild(typeof x === 'string' ? document.createTextNode(fr(x)) : x); });
      return d;
    }
    var g = el('div', { 'class': 'grid' },
      page !== 'projects' ? null : el('p', { 'class': 'big' }, el('a', { href: D.footer.ctaHref, text: D.footer.cta })),
      col(a.address, a.address.lines),
      col({ label: a.contactLabel }, [el('a', { href: 'tel:' + a.phone.href, text: a.phone.display }), a.email && el('a', { href: 'mailto:' + a.email.href, text: a.email.display })].filter(Boolean)),
      col(a.hours, a.hours.lines));
    var row = el('p', { 'class': 'demo' });
    if (D.site.demo) row.appendChild(el('span', { text: D.site.demo }));
    row.appendChild(el('span', { text: D.footer.copyright }));
    if (D.footer.legal) row.appendChild(el('a', { href: D.footer.legal.href, text: D.footer.legal.label }));
    g.appendChild(row);
    s.appendChild(g);
  })();

  /* ── Bandeau « démonstration » (fixe, toutes les pages) ───── */
  (function banner() {
    if (pre || !D.site.banner || document.querySelector('.demo-banner')) return;
    document.body.appendChild(el('p', { 'class': 'demo-banner', role: 'note', text: D.site.banner }));
  })();

  /* ── Cartes de projet ───────────────────────────────────── */
  function card(p, cls, sizes, level) {
    var meta = el('div', { 'class': 'meta' },
      el(level || 'h3', { text: p.name }), el('span', { 'class': 'label', text: String(p.year) }),
      el('p', { text: p.place + ' · ' + typeLabel(p.type) + ' · ' + m2(p.surface) }),
      el('p', { text: p.intention }));
    return el('a', { 'class': 'work ' + (cls || ''), href: '/projets#' + p.slug },
      ph(p.cover, { sizes: sizes, parallax: true }), meta);
  }

  /* ── Accueil ────────────────────────────────────────────── */
  function arrow() { return el('span', { 'class': 'arr', 'aria-hidden': 'true', raw: '→' }); }
  function btn(cls, link) { return el('a', { 'class': 'btn ' + cls, href: link.href }, el('span', { text: link.label }), arrow()); }
  function statValue(it) {
    if (it.value != null) return it.value;
    if (it.from === 'years') return new Date().getFullYear() - D.site.founded;
    if (it.from === 'count') return D.projects.length;
    if (it.from === 'surface') return D.projects.reduce(function (t, p) { return t + p.surface; }, 0);
    return 0;
  }
  function splitWords(h) { // un mot par <span> : le titre apparaît mot par mot (voir style.css)
    var t = h.textContent; h.textContent = '';
    t.split(' ').forEach(function (w, i, all) {
      h.appendChild(el('span', { 'class': 'w' }, el('span', { raw: w })));
      if (i < all.length - 1) h.appendChild(document.createTextNode(' '));
    });
  }
  function home() {
    if (pre) return;
    var h = D.home, hp = project(h.hero.project), hs = slot('hero');
    if (hs) {
      var d = ph(h.hero.image, { eager: true, sizes: '100vw', mobile: { src: h.hero.image.mobile, widths: [480, 800, 1200] } });
      setRatio(d, h.hero.image.ratio, h.hero.image.mobileRatio || h.hero.image.ratio);
      hs.appendChild(d);
      if (hp) hs.appendChild(el('figcaption', null, el('span', { text: hp.name + ', ' + hp.place + ' · ' + hp.year })));
    }
    var h1 = document.querySelector('.hero h1'); if (h1) splitWords(h1);
    var hc = slot('hero-cta');
    if (hc) { hc.appendChild(btn('btn-paper', h.hero.primary)); hc.appendChild(btn('btn-line', h.hero.secondary)); }

    // Ce que nous faisons
    var sv = slot('services');
    if (sv) h.services.items.forEach(function (it) {
      var p = project(it.project);
      sv.appendChild(el('li', null, el('a', { 'class': 'metier', href: '/projets?type=' + it.type },
        ph(p.cover, { sizes: '(max-width: 767px) 100vw, 32vw', parallax: true }),
        el('div', { 'class': 'meta' },
          el('h3', { text: it.title }),
          el('p', { text: it.text }),
          el('span', { 'class': 'more-link' }, el('span', { text: it.cta }), arrow())))));
    });

    // Chiffres clés : la valeur finale est dans le HTML, main.js la fait monter à l'apparition
    var st = slot('stats');
    if (st) h.stats.items.forEach(function (it) {
      var v = statValue(it);
      st.appendChild(el('li', { 'class': 'stat' },
        el('span', { 'class': 'num', 'data-count': String(v), text: num(v) }),
        el('p', { 'class': 'stat-label', text: it.label })));
    });

    // Projets à la une
    var sl = h.featured.slugs.map(project).filter(Boolean), ft = slot('featured');
    sl.forEach(function (p) { ft.appendChild(card(p, '', '(max-width: 1023px) 100vw, 50vw')); });
    ft.appendChild(el('a', { 'class': 'hs-end', href: '/projets' },
      el('span', { 'class': 'label', text: h.featured.note }),
      el('span', { 'class': 'hs-end-cta' }, el('span', { text: h.featured.cta }), arrow())));
    var fc = slot('featured-count');
    if (fc) fc.textContent = fr(sl.length + ' ' + h.featured.of + ' ' + D.projects.length);

    // Comment on travaille
    var sp = slot('steps');
    if (sp) h.steps.items.forEach(function (it) {
      sp.appendChild(el('li', null, el('span', { 'class': 'label', text: it.duration }),
        el('h3', { text: it.title }), el('p', { text: it.text })));
    });

    // Contact
    var ca = slot('contact-actions'), A = D.agency;
    if (ca) {
      ca.appendChild(btn('btn-paper', h.hero.secondary));
      ca.appendChild(el('a', { 'class': 'contact-link', href: 'tel:' + A.phone.href, text: A.phone.display }));
      if (A.email) ca.appendChild(el('a', { 'class': 'contact-link', href: 'mailto:' + A.email.href, text: A.email.display }));
    }
  }

  /* ── Projets : liste, filtre, fiche ─────────────────────── */
  function projects() {
    var P = D.projectsPage, grid = slot('grid'), filters = slot('filters'), count = slot('count');
    var listView = document.querySelector('[data-view="list"]'), detail = document.querySelector('[data-view="detail"]');
    var current = 'all', listScroll = 0;
    var wanted = new URLSearchParams(location.search).get('type'); // lien depuis l'accueil : /projets?type=logements
    if (wanted && D.types.some(function (t) { return t.id === wanted; })) current = wanted;

    function drawFilters() {
      clear(filters);
      filters.setAttribute('aria-label', P.filterLabel);
      filters.appendChild(el('span', { 'class': 'label', text: P.filterLabel }));
      var items = [{ id: 'all', label: P.filterAll, n: D.projects.length }].concat(D.types.map(function (t) {
        return { id: t.id, label: t.label, n: D.projects.filter(function (p) { return p.type === t.id; }).length };
      })).filter(function (i) { return i.n > 0; });
      items.forEach(function (i) {
        filters.appendChild(el('button', { type: 'button', 'data-type': i.id, 'aria-pressed': i.id === current ? 'true' : 'false', text: i.label + ' (' + i.n + ')' }));
      });
    }
    function drawGrid() {
      clear(grid);
      var list = D.projects.filter(function (p) { return current === 'all' || p.type === current; });
      list.forEach(function (p, i) {
        var pos = i % 4;
        var sizes = (pos === 0 || pos === 3) ? '(max-width: 767px) 100vw, 58vw' : '(max-width: 767px) 100vw, 33vw';
        var c = card(p, '', sizes, 'h2'); c.setAttribute('data-pos', String(pos));
        grid.appendChild(c);
      });
      count.textContent = fr(list.length + ' ' + (list.length > 1 ? P.countMany : P.countOne));
      if (window.Reveal) window.Reveal.scan(grid);
    }
    filters.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-type]'); if (!b) return;
      current = b.getAttribute('data-type');
      Array.prototype.forEach.call(filters.querySelectorAll('button'), function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      drawGrid();
    });

    function drawDetail(p) {
      clear(detail);
      var idx = D.projects.indexOf(p), prev = D.projects[(idx + D.projects.length - 1) % D.projects.length], next = D.projects[(idx + 1) % D.projects.length];
      var first = p.images[0], r = String(first.ratio).split('/'), wide = parseFloat(r[0]) / parseFloat(r[1]) >= 1.3;
      var big = ph(first, { eager: true, sizes: '100vw' });
      setRatio(big, wide ? '2.2/1' : '1.6/1', wide ? '4/3' : '4/5');
      var rows = ['place', 'year', 'surface', 'programme', 'mission', 'client', 'type'].filter(function (k) { return k === 'type' || p[k] != null; });
      var dl = el('dl');
      rows.forEach(function (k) {
        var v = k === 'surface' ? m2(p.surface) : k === 'type' ? typeLabel(p.type) : String(p[k]);
        dl.appendChild(el('div', { 'class': 'row' }, el('dt', { text: P.factLabels[k] }), el('dd', { text: v })));
      });
      var gallery = el('div', { 'class': 'grid detail-gallery' });
      p.images.slice(1).forEach(function (im) {
        gallery.appendChild(el('figure', null, ph(im, { sizes: '(max-width: 767px) 100vw, 56vw' }), im.caption && el('figcaption', { text: im.caption })));
      });
      function navLink(q, label) {
        return el('a', { href: '#' + q.slug }, el('span', { 'class': 'label', text: label }), el('strong', { text: q.name }));
      }
      detail.appendChild(el('div', { 'class': 'detail-head band-strong' },
        el('div', { 'class': 'grid detail-top' },
          el('a', { 'class': 'back', href: '/projets', 'data-back': true, text: '← ' + P.back }),
          el('span', { 'class': 'label r', text: typeLabel(p.type) + ' · ' + p.year })),
        el('div', { 'class': 'grid' }, el('h1', { 'class': 'page-title', tabindex: '-1', text: p.name }))));
      detail.appendChild(el('figure', { 'class': 'bleed' }, big, first.caption && el('figcaption', null, el('span', { text: first.caption }), el('span', { 'class': 'figs', text: p.place + ' · ' + m2(p.surface) }))));
      var intro = el('div', { 'class': 'grid detail-intro' },
        el('p', { 'class': 'intention', text: p.intention }),
        el('div', { 'class': 'sheet' }, el('h2', { text: P.sheet }), dl),
        el('div', { 'class': 'detail-text' }, p.text.map(function (t) { return el('p', { text: t }); })));
      detail.appendChild(intro);
      detail.appendChild(gallery);
      detail.appendChild(el('nav', { 'class': 'detail-nav band-soft', 'aria-label': P.back }, el('div', { 'class': 'grid' }, navLink(prev, P.prev), navLink(next, P.next))));
    }

    function swap(fn, instant) {
      // transition liste ↔ fiche : jamais au premier affichage ; une transition avortée ne doit pas lever d'erreur
      if (document.startViewTransition && !reduce && !instant) {
        var t = document.startViewTransition(fn);
        ['ready', 'finished'].forEach(function (k) { if (t[k] && t[k].catch) t[k].catch(function () {}); });
      } else fn();
      if (window.Reveal) window.Reveal.scan(document.body);
    }
    function route(initial) {
      var slug = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
      var p = slug && project(slug);
      if (p) {
        if (detail.hidden) listScroll = window.scrollY;
        swap(function () {
          drawDetail(p);
          listView.hidden = true; detail.hidden = false;
          document.title = fr(p.name + ' — ' + D.site.name);
          window.scrollTo(0, 0);
        }, initial);
        var h1 = detail.querySelector('h1'); if (h1 && !initial) h1.focus({ preventScroll: true });
      } else {
        var wasDetail = !detail.hidden;
        swap(function () {
          listView.hidden = false; detail.hidden = true; clear(detail);
          document.title = fr(D.meta.projects.title);
          if (wasDetail) window.scrollTo(0, listScroll);
        }, initial);
      }
    }
    if (!pre || current !== 'all') { drawFilters(); drawGrid(); }
    window.addEventListener('hashchange', function () { route(false); });
    route(true);
  }

  /* ── Agence et contact ──────────────────────────────────── */
  function agency() {
    var A = D.agency;
    if (pre) { drawForm(slot('form'), slot('sent'), A); return; }
    var ai = slot('agency-image');
    if (ai) {
      var d = ph(A.image, { eager: true, sizes: '100vw', parallax: true });
      setRatio(d, A.image.ratio, '4/3');
      ai.appendChild(d);
      if (A.imageCaption) ai.appendChild(el('figcaption', null, el('span', { text: A.imageCaption })));
    }
    var intro = slot('agency-intro');
    A.intro.forEach(function (t) { intro.appendChild(el('p', { text: t })); });

    var tc = slot('team-count'); if (tc) tc.textContent = fr(A.teamCountLabel || '');
    var team = slot('team');
    A.team.forEach(function (m) {
      team.appendChild(el('li', { 'class': 'member' }, ph(m.image, { sizes: '(max-width: 479px) 100vw, (max-width: 1023px) 50vw, 24vw' }),
        el('h3', { text: m.name }), el('p', { 'class': 'role', text: m.role }), m.text && el('p', { text: m.text })));
    });

    var ci = slot('contact-info');
    function block(c, nodes) {
      var d = el('div', null, el('span', { 'class': 'label', text: c.label }));
      nodes.forEach(function (n, i) { if (i) d.appendChild(document.createElement('br')); d.appendChild(typeof n === 'string' ? document.createTextNode(fr(n)) : n); });
      ci.appendChild(d);
    }
    block(A.address, A.address.lines);
    block(A.phone, [el('a', { href: 'tel:' + A.phone.href, text: A.phone.display })]);
    block(A.email, [el('a', { href: 'mailto:' + A.email.href, text: A.email.display })]);
    block(A.hours, A.hours.lines);
    if (A.access) block(A.access, A.access.lines);

    drawMap(slot('map'), A.map);
    drawForm(slot('form'), slot('sent'), A);
  }

  function svg(tag, attrs, text) {
    var n = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text) n.textContent = fr(text);
    return n;
  }
  function drawMap(fig, m) {
    if (!fig || !m) return;
    var s = svg('svg', { viewBox: '0 0 600 400', role: 'img', 'aria-labelledby': 'map-title' });
    s.appendChild(svg('title', { id: 'map-title' }, m.title));
    s.appendChild(svg('path', { 'class': 'river', d: m.river }));
    m.streets.forEach(function (d) { s.appendChild(svg('path', { 'class': 'street', d: d })); });
    if (m.main) s.appendChild(svg('path', { 'class': 'main', d: m.main }));
    m.labels.forEach(function (l) { s.appendChild(svg('text', { 'class': 'maplabel', x: l.x, y: l.y }, l.text)); });
    if (m.metro) s.appendChild(svg('rect', { 'class': 'metro', x: m.metro.x - 7, y: m.metro.y - 7, width: 14, height: 14 }));
    s.appendChild(svg('circle', { 'class': 'pin', cx: m.marker.x, cy: m.marker.y, r: 10 }));
    s.appendChild(svg('text', { 'class': 'pinlabel', x: m.marker.x + 18, y: m.marker.y + 5 }, m.marker.label));
    fig.appendChild(s);
    fig.appendChild(el('figcaption', null, el('span', { text: m.caption })));
  }

  function drawForm(form, sent, A) {
    if (!form) return;
    var F = A.form, f = F.fields;
    function field(id, type, cfg, o) {
      o = o || {};
      var input;
      if (type === 'textarea') input = el('textarea', { id: id, name: id, rows: '6', required: o.required, autocomplete: 'off' });
      else if (type === 'select') {
        input = el('select', { id: id, name: id });
        input.appendChild(el('option', { value: '', text: cfg.placeholder }));
        D.types.forEach(function (t) { input.appendChild(el('option', { value: t.id, text: t.label })); });
        input.appendChild(el('option', { value: 'autre', text: cfg.other }));
      } else input = el('input', { id: id, name: id, type: type, autocomplete: o.autocomplete, required: o.required });
      if (o.required) input.setAttribute('aria-required', 'true');
      input.setAttribute('aria-describedby', 'err-' + id);
      return el('div', { 'class': 'field' + (o.full ? ' full' : '') }, el('label', { 'for': id, text: cfg.label }), input, el('p', { 'class': 'err', id: 'err-' + id }));
    }
    if (!pre) {
      form.appendChild(field('f-name', 'text', f.name, { required: true, autocomplete: 'name' }));
      form.appendChild(field('f-email', 'email', f.email, { required: true, autocomplete: 'email' }));
      form.appendChild(field('f-phone', 'tel', f.phone, { autocomplete: 'tel' }));
      form.appendChild(field('f-type', 'select', f.type));
      form.appendChild(field('f-message', 'textarea', f.message, { required: true, full: true }));
      form.appendChild(el('button', { type: 'submit', 'class': 'submit', text: F.submit }));
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault(); // démonstration : rien n'est envoyé
      var firstBad = null;
      ['f-name', 'f-email', 'f-message'].forEach(function (id) {
        var i = form.querySelector('#' + id), err = form.querySelector('#err-' + id), v = i.value.trim(), msg = '';
        if (!v) msg = F.errorRequired;
        else if (id === 'f-email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = F.errorEmail;
        err.textContent = fr(msg);
        if (msg) { i.setAttribute('aria-invalid', 'true'); firstBad = firstBad || i; } else i.removeAttribute('aria-invalid');
      });
      if (firstBad) { firstBad.focus(); return; }
      clear(sent);
      sent.setAttribute('role', 'status');
      sent.appendChild(el('h3', { text: F.successTitle }));
      sent.appendChild(el('p', { text: F.successText }));
      var again = el('button', { type: 'button', text: F.reset });
      again.addEventListener('click', function () { form.reset(); sent.hidden = true; form.hidden = false; form.querySelector('input').focus(); });
      sent.appendChild(again);
      form.hidden = true; sent.hidden = false; sent.focus();
    });
  }

  try {
    if (page === 'home') home();
    else if (page === 'projects') projects();
    else if (page === 'agency') agency();
  } finally {
    document.documentElement.classList.add('ready');
  }
})();
