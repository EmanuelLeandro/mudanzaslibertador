(function () {
  'use strict';
  var WA = '5491127068809';

  /* ===== Medición de anuncios =====
     Completar cuando el dueño tenga las cuentas (y descomentar los tags del <head>):
     - googleAdsId: 'AW-XXXXXXXXX'
     - labels: label de cada acción de conversión creada en Google Ads. */
  var ADS = { googleAdsId: '', labels: { whatsapp: '', phone: '', quote: '' } };

  function track(kind) {
    var page = location.pathname.split('/').pop() || 'index.html';
    var data = { event: 'ml_' + kind, ml_page: page, ml_source: sourceLabel() };
    try { (window.dataLayer = window.dataLayer || []).push(data); } catch (e) {}
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
})();
