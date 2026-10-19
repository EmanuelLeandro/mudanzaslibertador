(function () {
  'use strict';
  var WA = '5491127068809';

  /* ===== Medición de anuncios =====
     Completar cuando el dueño tenga las cuentas (y descomentar los tags del <head>):
     - googleAdsId: 'AW-XXXXXXXXX'
     - labels: label de cada acción de conversión creada en Google Ads. */
  var ADS = { googleAdsId: '', labels: { whatsapp: '', phone: '', quote: '' } };

  /* ===== Configuración =====
     GOOGLE_MAPS_KEY: vacío = las sugerencias de direcciones usan Photon/OpenStreetMap (gratis, sin clave).
     Con una clave de Google (Places API (New), restringida por HTTP referrer a tu dominio) usa Google Places.
     Ver README / SEO-y-anuncios.md, sección "Autocompletado de direcciones". */
  var CONFIG = {
    GOOGLE_MAPS_KEY: '',
    // Link de "Dejá tu opinión en Google". Hoy: link para compartir del perfil (abre la ficha; "Escribir una opinión" queda a un toque).
    // Reemplazalo por el link directo de Google Business Profile → "Pedir opiniones" (formato https://g.page/r/XXXX/review),
    // que abre directo la ventana para opinar. Cambialo también en build/v7_review.py (REVIEW_URL) para el href sin JS.
    GOOGLE_REVIEW_URL: 'https://share.google/Xvqq46blmaVdApBMl'
  };

  function track(kind) {
    var page = location.pathname.split('/').pop() || 'index.html';
    var data = { event: 'ml_' + kind, ml_page: page, ml_source: sourceLabel() };
    try { (window.dataLayer = window.dataLayer || []).push(data); } catch (e) {}
    if (kind === 'review_click') {   // no es un contacto ni un lead: evento propio, sin conversión de Ads
      if (typeof window.gtag === 'function') window.gtag('event', 'review_click', { page_location: location.href });
      if (typeof window.fbq === 'function') window.fbq('trackCustom', 'review_click');
      return;
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', kind === 'quote' ? 'generate_lead' : 'contact', { method: kind, page_location: location.href });
      if (ADS.googleAdsId && ADS.labels[kind]) window.gtag('event', 'conversion', { send_to: ADS.googleAdsId + '/' + ADS.labels[kind] });
    }
    if (typeof window.fbq === 'function') {
      window.fbq('track', kind === 'quote' ? 'Lead' : 'Contact', { content_name: kind });
    }
  }

  /* ===== Origen de la visita (UTM / gclid / fbclid) =====
     Se guarda en la sesión para que siga valiendo si la persona navega a otra página. */
  var SRC_NAMES = { google: 'Google', googleads: 'Google', ig: 'Instagram', instagram: 'Instagram', facebook: 'Facebook', fb: 'Facebook', meta: 'Instagram/Facebook' };
  var _src = null;
  function sourceLabel() {
    if (_src !== null) return _src;
    var q = new URLSearchParams(location.search), st = null;
    var s = q.get('utm_source'), m = q.get('utm_medium'), c = q.get('utm_campaign');
    if (!s && (q.get('gclid') || q.get('gbraid') || q.get('wbraid'))) { s = 'google'; m = m || 'cpc'; }
    if (!s && q.get('fbclid')) { s = 'meta'; }
    try {
      if (s) sessionStorage.setItem('ml_src', JSON.stringify({ s: s, m: m, c: c }));
      else if ((st = JSON.parse(sessionStorage.getItem('ml_src') || 'null'))) { s = st.s; m = st.m; c = st.c; }
    } catch (e) {}
    if (!s) return (_src = '');
    var label = SRC_NAMES[String(s).toLowerCase()] || s;
    if (m && /cpc|ppc|paid|ads|social_paid/i.test(m)) label += ' (anuncio)';
    if (c) label += ' · ' + c;
    return (_src = String(label).replace(/[\r\n]+/g, ' ').slice(0, 80));
  }
  function withSource(msg) { var l = sourceLabel(); return l ? msg + '\n\nVengo de: ' + l : msg; }

  // Clicks en WhatsApp y teléfono: conversión + origen en el mensaje
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (/^https:\/\/wa\.me\//.test(href)) {
      try {
        var u = new URL(href), base = u.searchParams.get('text') || 'Hola Mudanzas Libertador, quiero consultar por una mudanza.';
        if (base.indexOf('\n\nVengo de: ') === -1) base = withSource(base);
        a.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(base);
      } catch (err) {}
      track('whatsapp');
    } else if (/^tel:/.test(href)) {
      track('phone');
    }
  }, true);
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  // Header
  var hdr = $('#hdr');
  var wa = document.querySelector('.wa');
  var onScroll = function () { hdr.classList.toggle('is-solid', window.scrollY > 24); if (wa) wa.classList.toggle('is-hidden', window.scrollY < window.innerHeight * 0.6); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Mobile menu
  var burger = $('#burger'), nav = $('#nav');
  function menu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    nav.classList.toggle('open', open); hdr.classList.toggle('menu', open);
  }
  burger.addEventListener('click', function () { menu(burger.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) menu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menu(false); });

  // Reveal
  var rv = $$('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, sib = $$('.reveal', el.parentNode).filter(function (x) { return x.parentNode === el.parentNode; });
        el.style.transitionDelay = Math.min(sib.indexOf(el), 5) * 70 + 'ms';
        el.classList.add('in'); io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  // Quote stepper
  var form = $('#qf'), steps = $$('.qs', form), cur = 0;
  var bar = $('#qf-bar'), num = $('#qf-step'), err = $('#qf-err');
  var fecha = $('#q-fecha'), sinFecha = $('#q-sinfecha');
  var t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset()); fecha.min = t.toISOString().slice(0, 10);
  sinFecha.addEventListener('change', function () { fecha.disabled = sinFecha.checked; if (sinFecha.checked) fecha.value = ''; });

  function show(i, focus) {
    steps[cur].classList.remove('is-active');
    cur = i; steps[cur].classList.add('is-active');
    bar.style.width = ((cur + 1) / steps.length * 100) + '%';
    num.textContent = cur + 1; err.hidden = true;
    if (focus) { var f = $('input:not([type=checkbox]):not([type=radio]):not(:disabled), textarea', steps[cur]); if (f) f.focus({ preventScroll: true }); }
  }
  function valid(i) {
    var bad = [];
    $$('[required]', steps[i]).forEach(function (el) {
      var ok = el.value.trim() !== ''; el.classList.toggle('bad', !ok); el.setAttribute('aria-invalid', String(!ok)); if (!ok) bad.push(el);
    });
    if (bad.length) { err.textContent = 'Completá los campos marcados para seguir.'; err.hidden = false; bad[0].focus(); return false; }
    return true;
  }
  $$('[data-next]', form).forEach(function (b) { b.addEventListener('click', function () { if (valid(cur)) show(cur + 1, true); }); });
  $$('[data-prev]', form).forEach(function (b) { b.addEventListener('click', function () { show(cur - 1, true); }); });
  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT' && cur < steps.length - 1) { e.preventDefault(); if (valid(cur)) show(cur + 1, true); }
  });
  form.addEventListener('input', function (e) { if (e.target.classList.contains('bad') && e.target.value.trim()) { e.target.classList.remove('bad'); e.target.setAttribute('aria-invalid', 'false'); if (!$('.bad', form)) err.hidden = true; } });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!valid(cur)) return;
    var v = function (id) { return $(id).value.trim(); };
    var tipo = $('input[name=tipo]:checked', form);
    var que = [tipo ? tipo.value : '', v('#q-detalle')].filter(Boolean).join(' · ') || 'A detallar';
    var acc = $$('input[name=accesos]:checked', form).map(function (c) { return c.value; }).join(', ') || 'Sin especificar';
    if (v('#q-accdet')) acc += ' (' + v('#q-accdet') + ')';
    var f = fecha.value ? fecha.value.split('-').reverse().join('/') : 'A definir';
    var ctx = form.getAttribute('data-context');
    var msg = ['¡Hola Mudanzas Libertador! Quiero pedir un presupuesto.', ''].concat(ctx ? ['*Consulta:* ' + ctx] : []).concat([
      '*Nombre:* ' + v('#q-nombre'), '*Origen:* ' + v('#q-origen'), '*Destino:* ' + v('#q-destino'),
      '*Fecha:* ' + f, '*Qué se muda:* ' + que, '*Accesos:* ' + acc]).join('\n');
    msg = withSource(msg);
    track('quote');
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });

  // Links to the quote focus the first empty field
  $$('[data-focus-quote]').forEach(function (a) {
    a.addEventListener('click', function () { setTimeout(function () { if (cur === 0) $('#q-origen').focus({ preventScroll: true }); }, 450); });
  });
  /* ===== v4: videos (reels de Instagram) =====
     - Sin "Ahorro de datos" ni "Reducir movimiento": hero en loop y clips que se cargan al entrar en pantalla.
     - Con cualquiera de los dos: solo imágenes (póster). El usuario igual puede abrir un video tocándolo. */
  var mm = function (q) { return !!(window.matchMedia && window.matchMedia(q).matches); };
  var conn = navigator.connection || {};
  var reduceMotion = mm('(prefers-reduced-motion: reduce)');
  var saveData = !!conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');
  var noVideo = reduceMotion || saveData;
  if (noVideo) document.documentElement.classList.add('no-video');

  function loadVideo(v, base) {
    if (v.getAttribute('data-loaded') === base) return;
    v.setAttribute('data-loaded', base);
    v.innerHTML = '';
    [['webm', 'video/webm'], ['mp4', 'video/mp4']].forEach(function (f) {
      var src = document.createElement('source');
      src.src = base + '.' + f[0]; src.type = f[1];
      v.appendChild(src);
    });
    v.load();
  }
  function playVideo(v) { try { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } catch (e) {} }
  function markOn(el, v) { v.addEventListener('playing', function () { el.classList.add('is-on'); }); }

  var hasIO = 'IntersectionObserver' in window;
  var hv = document.querySelector('[data-hero-video]');
  if (hv) {
    if (noVideo) { hv.removeAttribute('autoplay'); }
    else {
      var base = mm('(max-width: 760px), (max-width: 1100px) and (orientation: portrait)') ? hv.getAttribute('data-mobile') : hv.getAttribute('data-desktop');
      hv.poster = base + '-poster.jpg';
      markOn(hv, hv);
      loadVideo(hv, base);
      playVideo(hv);
      if (hasIO) new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) playVideo(hv); else hv.pause(); });
      }).observe(hv);
    }
  }

  var canHover = mm('(hover: hover) and (pointer: fine)');
  var clips = $$('[data-vclip]');
  if (!noVideo && hasIO && clips.length) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var c = e.target, v = c.querySelector('video'), inCard = !!c.closest('.vcard');
        if (e.isIntersecting) {
          loadVideo(v, c.getAttribute('data-vclip'));
          if (!(canHover && inCard)) playVideo(v);   // en compu, las tarjetas de la galería se reproducen al pasar el mouse
        } else v.pause();
      });
    }, { rootMargin: '150px 0px', threshold: 0.2 });
    clips.forEach(function (c) {
      var v = c.querySelector('video');
      markOn(c, v);
      vio.observe(c);
      var card = c.closest('.vcard');
      if (card && canHover) {
        var on = function () { loadVideo(v, c.getAttribute('data-vclip')); playVideo(v); };
        var off = function () { v.pause(); };
        card.addEventListener('mouseenter', on); card.addEventListener('mouseleave', off);
        card.addEventListener('focusin', on); card.addEventListener('focusout', off);
      }
    });
  }

  // Galería: tocar una tarjeta abre el video grande (sin sonido: son recortes; el reel completo está en Instagram)
  var box = document.getElementById('vbox');
  if (box) {
    var bv = box.querySelector('video'), bcap = box.querySelector('.vbox__cap b'), blink = box.querySelector('.vbox__cap a');
    var lastBtn = null;
    var closeBox = function () { bv.pause(); if (box.open && box.close) box.close(); else box.removeAttribute('open'); };
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-open]');
      if (!b) return;
      e.preventDefault();
      lastBtn = b;
      var base = b.getAttribute('data-open');
      bv.poster = base + '.jpg';
      loadVideo(bv, base);
      bcap.textContent = b.getAttribute('data-title') || '';
      blink.href = b.getAttribute('data-reel') || blink.href;
      if (typeof box.showModal === 'function') box.showModal(); else box.setAttribute('open', '');
      if (!reduceMotion) playVideo(bv);
      try { (window.dataLayer = window.dataLayer || []).push({ event: 'ml_video_open', ml_video: base.split('/').pop() }); } catch (err) {}
    });
    box.querySelector('.vbox__x').addEventListener('click', closeBox);
    box.addEventListener('click', function (e) { if (e.target === box || e.target.classList.contains('vbox__in')) closeBox(); });
    box.addEventListener('close', function () { bv.pause(); if (lastBtn) lastBtn.focus({ preventScroll: true }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.hasAttribute('open') && !box.close) closeBox(); });
  }
  /* ===== v6: autocompletado de direcciones (origen / destino) =====
     Proveedor por defecto: Photon (photon.komoot.io, datos © OpenStreetMap), sin clave.
     Si CONFIG.GOOGLE_MAPS_KEY tiene una clave, usa Google Places (API nueva). Si algo falla, el campo
     sigue funcionando como texto libre. Uso responsable: espera 250 ms, mínimo 3 letras, cancela
     pedidos viejos y guarda en caché lo ya buscado. */
  (function () {
    var inputs = $$('input[data-addr]');
    if (!inputs.length || !window.fetch) return;
    var BA = { lat: -34.58, lon: -58.45 };
    var AR_BBOX = '-73.6,-55.1,-53.6,-21.7', AMBA_BBOX = '-59.1,-35.1,-57.8,-34.2';
    var cache = {}, ctrl = null, provider = CONFIG.GOOGLE_MAPS_KEY ? 'google' : 'photon', gReady = null, gToken = null;
    var coarse = mm('(pointer: coarse)');

    function norm(q) {
      return q.replace(/\s+/g, ' ').trim()
        .replace(/^(av|avda|avd)\.?\s+/i, 'Avenida ')
        .replace(/\b(gral)\.?\s+/i, 'General ').replace(/\b(pte)\.?\s+/i, 'Presidente ').replace(/\b(cnel)\.?\s+/i, 'Coronel ')
        .replace(/\b(dr)\.?\s+/i, 'Doctor ').replace(/\b(sta)\.?\s+/i, 'Santa ').replace(/\b(sto)\.?\s+/i, 'Santo ');
    }
    function typedNumber(q) { var m = q.match(/(?:^|\s)(\d{1,5})(?:\s*$|\s*,)/); return m ? m[1] : ''; }
    function tidy(s) { return (s || '').replace(/ (Del|De|La|Las|Los|El) /g, function (m) { return m.toLowerCase(); }); }
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

    // --- Photon
    function photonFormat(p, num) {
      var caba = /Ciudad Autónoma de Buenos Aires/.test(p.state || '') || /Ciudad Autónoma de Buenos Aires/.test(p.city || '');
      var street = p.street, n = p.housenumber, main;
      if (p.type === 'street') { street = p.name; n = num; }
      else if (street && !n) n = num;                     // punto sin altura sobre la calle: conservar la altura tipeada
      if (street) street = street.replace(/^\d+\s*-\s*/, '');   // "643 - Avenida ..." (n° de ruta en OSM)
      if (street) main = tidy(street) + (n ? ' ' + n : '');
      else main = tidy(p.name || '');
      if (!main) return null;
      var parts = [];
      var loc = caba ? (p.district || p.locality) : (p.district || p.locality || p.city);
      if (loc && loc !== main) parts.push(loc);
      if (caba) parts.push('CABA');
      else {
        if (p.city && parts.indexOf(p.city) < 0 && p.city !== main) parts.push(p.city);
        if (p.county && /^Partido/.test(p.county)) parts.push(p.county);
        if (p.state && p.state !== 'Buenos Aires') parts.push(p.state);
        else if (!p.county) parts.push('Buenos Aires');
      }
      var sec = parts.filter(function (x, i, a) { return x && a.indexOf(x) === i; }).join(', ');
      return { main: main, sec: sec, full: main + (sec ? ', ' + sec : ''), zone: caba ? 'CABA' : (p.county || p.city || p.state || '') };
    }
    function photonGet(params, signal) {
      return fetch('https://photon.komoot.io/api/?lang=default&' + params, { signal: signal })
        .then(function (r) { if (!r.ok) throw new Error('photon ' + r.status); return r.json(); })
        .then(function (d) { return d.features || []; });
    }
    function photon(q, signal) {
      var num = typedNumber(q), nq = norm(q);
      return photonGet('q=' + encodeURIComponent(nq) + '&limit=30&lat=' + BA.lat + '&lon=' + BA.lon +
        '&location_bias_scale=0.2&zoom=12&bbox=' + AR_BBOX, signal).then(function (feats) {
        var hit = num && feats.some(function (f) { return f.properties && f.properties.housenumber === num; });
        if (!num || hit) return feats;
        // OSM no tiene esa altura: buscar la calle sola en todo el AMBA para ofrecer cada partido por el que pasa
        var street = nq.replace(new RegExp('(^|\\s)' + num + '(?=\\s*(,|$))'), ' ').replace(/\s+/g, ' ').trim();
        if (street.length < 3) return feats;
        return photonGet('q=' + encodeURIComponent(street) + '&limit=40&layer=street&bbox=' + AMBA_BBOX, signal)
          .then(function (more) { return feats.concat(more); }, function () { return feats; });
      }).then(function (feats) {
          var seen = {}, out = [], exact = [];
          feats.forEach(function (f) {
            var p = f.properties || {};
            if (p.countrycode && p.countrycode !== 'AR') return;
            var s = photonFormat(p, num);
            var c = f.geometry && f.geometry.coordinates;
            if (s) s.d = c ? Math.pow(c[0] - BA.lon, 2) + Math.pow(c[1] - BA.lat, 2) : 99;
            if (!s || seen[s.full.toLowerCase()]) return;
            seen[s.full.toLowerCase()] = 1;
            (num && p.housenumber === num ? exact : out).push(s);
          });
          var byD = function (x, y) { return x.d - y.d; };   // lo más cercano a Buenos Aires primero
          exact.sort(byD); out.sort(byD);
          // variedad: primero una sugerencia por zona (CABA / cada partido), así una avenida larga
          // como Libertador muestra CABA, Vicente López, San Isidro… y no solo barrios porteños
          var pick = exact.slice(0, 6), zones = {};
          pick.forEach(function (x) { zones[x.zone] = 1; });
          out.forEach(function (x) { if (pick.length < 6 && !zones[x.zone]) { zones[x.zone] = 1; pick.push(x); x.used = 1; } });
          out.forEach(function (x) { if (pick.length < 6 && !x.used) pick.push(x); });
          return pick.slice(0, 6);
        });
    }

    // --- Google Places (API nueva), solo si hay clave
    function loadGoogle() {
      if (gReady) return gReady;
      gReady = new Promise(function (res, rej) {
        window.__mlPlacesReady = function () { res(); };
        var sc = document.createElement('script');
        sc.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(CONFIG.GOOGLE_MAPS_KEY) +
          '&libraries=places&loading=async&language=es&region=AR&callback=__mlPlacesReady';
        sc.async = true; sc.onerror = rej; document.head.appendChild(sc);
        setTimeout(function () { rej(new Error('timeout')); }, 8000);
      });
      return gReady;
    }
    function google_(q) {
      return loadGoogle().then(function () {
        var P = window.google.maps.places;
        if (!gToken) gToken = new P.AutocompleteSessionToken();
        return P.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: q, includedRegionCodes: ['ar'], language: 'es', region: 'ar', sessionToken: gToken,
          locationBias: { center: { lat: BA.lat, lng: BA.lon }, radius: 50000 }
        });
      }).then(function (r) {
        return (r.suggestions || []).map(function (s) { return s.placePrediction; }).filter(Boolean).slice(0, 6).map(function (p) {
          var main = p.mainText ? p.mainText.text : p.text.text, sec = p.secondaryText ? p.secondaryText.text.replace(/, Argentina$/, '') : '';
          return { main: main, sec: sec, full: main + (sec ? ', ' + sec : '') };
        });
      });
    }
    function search(q, signal) {
      if (provider === 'google') return google_(q).catch(function () { provider = 'photon'; return photon(q, signal); });
      return photon(q, signal);
    }

    // --- UI (lista en <body> con position:fixed para que ningún overflow la recorte)
    inputs.forEach(function (inp) {
      var list = document.createElement('div');
      list.className = 'ac'; list.hidden = true;
      list.innerHTML = '<ul class="ac__list" role="listbox" id="' + inp.id + '-list" aria-label="Sugerencias de direcciones"></ul><p class="ac__attr"></p>';
      document.body.appendChild(list);
      var ul = list.firstChild, attr = list.lastChild;
      var live = document.createElement('span'); live.className = 'sr'; live.setAttribute('aria-live', 'polite'); inp.parentNode.appendChild(live);
      var items = [], active = -1, timer = null, lastQ = '', picked = '', pressing = false;

      function place() {
        if (list.hidden) return;
        var r = inp.getBoundingClientRect(), vv = window.visualViewport;
        var vh = vv ? vv.height + vv.offsetTop : window.innerHeight;
        var below = vh - r.bottom - 8, above = r.top - (hdr ? hdr.getBoundingClientRect().bottom : 0) - 8;
        var up = below < 180 && above > below;
        list.style.left = Math.max(8, r.left) + 'px';
        list.style.width = Math.min(r.width, window.innerWidth - 16) + 'px';
        list.style.maxHeight = Math.max(140, Math.min(420, up ? above : below)) + 'px';
        if (up) { list.style.top = ''; list.style.bottom = (window.innerHeight - r.top + 6) + 'px'; }
        else { list.style.bottom = ''; list.style.top = (r.bottom + 6) + 'px'; }
        list.classList.toggle('ac--up', up);
      }
      function open(on) {
        list.hidden = !on; inp.setAttribute('aria-expanded', String(on));
        if (!on) { active = -1; inp.removeAttribute('aria-activedescendant'); } else place();
      }
      function setActive(i) {
        var lis = ul.children;
        if (active > -1 && lis[active]) lis[active].setAttribute('aria-selected', 'false');
        active = i;
        if (i > -1 && lis[i]) { lis[i].setAttribute('aria-selected', 'true'); inp.setAttribute('aria-activedescendant', lis[i].id); lis[i].scrollIntoView({ block: 'nearest' }); }
        else inp.removeAttribute('aria-activedescendant');
      }
      function render(res) {
        items = res; active = -1;
        if (!res.length || document.activeElement !== inp) { open(false); live.textContent = ''; return; }
        ul.innerHTML = res.map(function (s, i) {
          return '<li class="ac__opt" role="option" id="' + inp.id + '-opt' + i + '" aria-selected="false"><svg class="ic" aria-hidden="true"><use href="#i-pin"/></svg>' +
            '<span><b>' + esc(s.main) + '</b>' + (s.sec ? '<small>' + esc(s.sec) + '</small>' : '') + '</span></li>';
        }).join('');
        attr.innerHTML = provider === 'google' ? 'powered by Google'
          : 'Datos © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> · Photon';
        open(true);
        live.textContent = res.length + (res.length === 1 ? ' sugerencia' : ' sugerencias');
      }
      function choose(i) {
        var s = items[i]; if (!s) return;
        inp.value = picked = s.full; lastQ = s.full;
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        open(false); gToken = null; live.textContent = 'Elegiste ' + s.full;
      }
      function query() {
        var q = inp.value.trim();
        if (q.length < 3 || q === picked) { if (ctrl) ctrl.abort(); open(false); return; }
        if (q === lastQ && items.length) { render(items); return; }
        lastQ = q;
        var key = provider + '|' + q.toLowerCase();
        if (cache[key]) { render(cache[key]); return; }
        if (ctrl) ctrl.abort();
        ctrl = window.AbortController ? new AbortController() : null;
        search(q, ctrl && ctrl.signal).then(function (res) {
          cache[key] = res;
          if (inp.value.trim() === q) render(res);
        }).catch(function () { /* sin red / límite: el campo sigue como texto libre */ });
      }

      inp.addEventListener('input', function () {
        if (inp.value === picked) return;
        picked = '';
        clearTimeout(timer);
        if (inp.value.trim().length < 3) { if (ctrl) ctrl.abort(); open(false); return; }
        timer = setTimeout(query, 250);
      });
      inp.addEventListener('keydown', function (e) {
        var openNow = !list.hidden && items.length;
        if (e.key === 'ArrowDown') { e.preventDefault(); if (!openNow) { query(); return; } setActive((active + 1) % items.length); }
        else if (e.key === 'ArrowUp') { if (!openNow) return; e.preventDefault(); setActive(active <= 0 ? items.length - 1 : active - 1); }
        else if (e.key === 'Enter') { if (openNow && active > -1) { e.preventDefault(); e.stopPropagation(); choose(active); } else open(false); }
        else if (e.key === 'Escape') { if (openNow) { e.preventDefault(); e.stopPropagation(); open(false); } }
        else if (e.key === 'Tab') open(false);
      });
      inp.addEventListener('focus', function () {
        if (provider === 'google') loadGoogle().catch(function () { provider = 'photon'; });
        if (coarse) setTimeout(function () {   // celular: subir el campo para que el teclado no tape la lista
          var r = inp.getBoundingClientRect(), top = (hdr ? hdr.getBoundingClientRect().height : 64) + 12;
          if (r.top < top || r.top > (window.visualViewport ? window.visualViewport.height : window.innerHeight) * 0.35)
            window.scrollTo({ top: window.scrollY + r.top - top, behavior: reduceMotion ? 'auto' : 'smooth' });
        }, 300);
        if (inp.value.trim().length >= 3 && inp.value !== picked) query();
      });
      inp.addEventListener('blur', function () { setTimeout(function () { if (!pressing) open(false); }, 120); });
      list.addEventListener('mousedown', function (e) { e.preventDefault(); });
      list.addEventListener('touchstart', function () { pressing = true; }, { passive: true });
      list.addEventListener('touchend', function () { setTimeout(function () { pressing = false; }, 400); });
      ul.addEventListener('click', function (e) {
        var li = e.target.closest('.ac__opt'); if (!li) return;
        choose(Array.prototype.indexOf.call(ul.children, li)); inp.focus({ preventScroll: true });
      });
      ul.addEventListener('mousemove', function (e) { var li = e.target.closest('.ac__opt'); if (li) { var i = Array.prototype.indexOf.call(ul.children, li); if (i !== active) setActive(i); } });
      document.addEventListener('pointerdown', function (e) { if (!list.hidden && e.target !== inp && !list.contains(e.target)) open(false); });
      window.addEventListener('scroll', place, { passive: true });
      window.addEventListener('resize', place);
      if (window.visualViewport) { window.visualViewport.addEventListener('resize', place); window.visualViewport.addEventListener('scroll', place); }
    });
  })();
  /* ===== v7: opiniones en Google ===== */
  $$('[data-review]').forEach(function (a) {
    if (CONFIG.GOOGLE_REVIEW_URL) a.href = CONFIG.GOOGLE_REVIEW_URL;
    a.addEventListener('click', function () { track('review_click'); });
  });
})();
