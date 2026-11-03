/* Core: language, header / menu / footer, bag + WhatsApp order, scroll reveal and off-screen pausing. */
(() => {
  'use strict';
  const C = window.MAJID, D = window.MDATA, I = window.I18N;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const LANGS = ['en', 'ar', 'tr'];
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const store = { get: (k) => safe(() => localStorage.getItem(k)), set: (k, v) => safe(() => localStorage.setItem(k, v)) };

  // ---------------------------------------------------------------- language
  let lang = (() => {
    const q = new URLSearchParams(location.search).get('lang');
    if (LANGS.includes(q)) { store.set('mj-lang', q); return q; }
    const s = store.get('mj-lang'); if (LANGS.includes(s)) return s;
    const n = (navigator.language || 'en').slice(0, 2).toLowerCase(); return LANGS.includes(n) ? n : 'en';
  })();
  const dig = (s) => String(s);                      // Western digits in every language (same as the phone number)
  const get = (L, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), I[L]);
  const west = (v) => (typeof v === 'string' ? v.replace(/[\u0660-\u0669]/g, (d) => d.charCodeAt(0) - 1632) : Array.isArray(v) ? v.map(west) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, west(x)])) : v);
  const t = (path) => { const v = get(lang, path); return west(v === undefined ? get('en', path) : v); };
  const fmt = (n) => '₺' + Math.round(n).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US');
  const prod = (id) => D.products.find((p) => p.id === id);
  const pname = (p) => p.name[lang] || p.name.en;
  const note = (id) => D.notes[id][lang === 'ar' ? 2 : lang === 'tr' ? 3 : 1];
  const img = (id, view, md) => `assets/render/${id}-${view}${md ? '-md' : ''}.webp`;
  const picture = (id, view, sizes, alt, cls = '', eager = false) =>
    `<img class="${cls}" src="${img(id, view, true)}" srcset="${img(id, view, true)} 1000w, ${img(id, view)} 1400w" sizes="${sizes}" width="1400" height="1400" alt="${alt}" decoding="async" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---------------------------------------------------------------- icons
  const svg = (inner, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${inner}</svg>`;
  const ICON = {
    bag: svg('<path d="M5.5 8.5h13l-1 11.5h-11l-1-11.5Z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/>'),
    close: svg('<path d="M6 6l12 12M18 6L6 18"/>'), plus: svg('<path d="M12 5v14M5 12h14"/>'), minus: svg('<path d="M5 12h14"/>'),
    arrow: svg('<path d="M4 12h15M13 6l6 6-6 6"/>'), check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    left: svg('<path d="M15 5l-7 7 7 7"/>'), right: svg('<path d="M9 5l7 7-7 7"/>'),
    ig: svg('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".8" fill="currentColor"/>'),
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>',
    spring: svg('<path d="M12 21v-9"/><path d="M12 12C12 8 9 6 5 6c0 4 3 6 7 6z"/><path d="M12 14c0-3 2.4-5 6-5 0 3-2.4 5-6 5z"/>'),
    summer: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8"/>'),
    autumn: svg('<path d="M5 19c0-8 4-13 14-14 0 9-5 14-13 14"/><path d="M5 19l9-9"/>'),
    winter: svg('<path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9"/><path d="M9.5 4.5L12 6.5l2.5-2M9.5 19.5l2.5-2 2.5 2"/>'),
    day: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8"/>'),
    night: svg('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'),
  };

  // ---------------------------------------------------------------- bag
  let bag = (() => { try { const b = JSON.parse(store.get('mj-bag-v1') || '[]'); return Array.isArray(b) ? b.filter((i) => prod(i.id)) : []; } catch (e) { return []; } })();
  const saveBag = () => store.set('mj-bag-v1', JSON.stringify(bag));
  const unit = (i) => prod(i.id).price + (i.gift ? C.giftBag : 0);
  const count = () => bag.reduce((n, i) => n + i.qty, 0);
  const total = () => bag.reduce((n, i) => n + unit(i) * i.qty, 0);
  const typeLabel = (p) => t('p.type.' + p.type);
  function addToBag(id, qty = 1, gift = false) {
    const it = bag.find((i) => i.id === id && !!i.gift === !!gift);
    if (it) it.qty = Math.min(20, it.qty + qty); else bag.push({ id, qty, gift: !!gift });
    saveBag(); syncBag(true);
  }
  function waUrl(text) { return `https://wa.me/${C.wa || ''}?text=${encodeURIComponent(text)}`; }
  const ltr = (s) => (lang === 'ar' ? '\u2066' + s + '\u2069' : s);
  function orderText(f) {
    const m = t('cart.msg'), L = [m.hello, ''];
    bag.forEach((i) => { const p = prod(i.id); L.push(`${ltr(dig(i.qty) + '×')} ${pname(p)} — ${typeLabel(p)} ${ltr(t('p.ml'))} — ${ltr(fmt(unit(i) * i.qty))}`); if (i.gift) L.push(`   ${m.gift}: ${m.yes} (${ltr('+' + fmt(C.giftBag * i.qty))})`); });
    L.push('', `${m.total}: ${ltr(fmt(total()))}`, m.ship, '', `${m.name}: ${f.name}`, `${m.city}: ${f.city}`);
    if (f.address) L.push(`${m.address}: ${f.address}`); if (f.note) L.push(`${m.note}: ${f.note}`);
    L.push('', m.thanks); return L.join('\n');
  }

  // ---------------------------------------------------------------- shared chrome
  const nav = [['shop.html', 'nav.shop'], ['index.html#collection', 'nav.collection'], ['index.html#packaging', 'nav.packaging'], ['story.html', 'nav.story'], ['wholesale.html', 'nav.wholesale'], ['contact.html', 'nav.contact']];
  function chrome() {
    $('#hdr').innerHTML = `
      <div class="hdr-in">
        <button class="ib burger" id="burger" aria-expanded="false" aria-controls="menu" data-i18n-attr="aria-label:nav.menu"><i></i><i></i></button>
        <a class="logo" href="index.html" data-i18n-attr="aria-label:nav.home"><img class="lm" src="assets/img/logo-mark.png" srcset="assets/img/logo-mark.png 1x, assets/img/logo-mark@2x.png 2x" alt="" width="382" height="354"><img class="lw" src="assets/img/logo-word.png" srcset="assets/img/logo-word.png 1x, assets/img/logo-word@2x.png 2x" alt="MAJID" width="798" height="199"></a>
        <div class="hdr-r">
          <a class="shoplink" href="shop.html" data-i18n="nav.shop"></a>
          <div class="langs" role="group" data-i18n-attr="aria-label:nav.lang">${LANGS.map((l) => `<button data-lang="${l}">${l.toUpperCase()}</button>`).join('')}</div>
          <button class="ib bagbtn" id="bagbtn" data-i18n-attr="aria-label:nav.bag">${ICON.bag}<b class="count" id="bagcount">0</b></button>
        </div>
      </div>`;
    $('#menu').innerHTML = `
      <div class="menu-in">
        <a class="m-shop" href="shop.html"><span data-i18n="nav.shop"></span><small>${ICON.arrow}</small></a>
        <nav class="m-nav">${nav.slice(1).map(([h, k]) => `<a href="${h}" data-i18n="${k}"></a>`).join('')}</nav>
        <div class="m-langs" role="group">${LANGS.map((l) => `<button data-lang="${l}">${l === 'ar' ? 'العربية' : l === 'tr' ? 'Türkçe' : 'English'}</button>`).join('')}</div>
        <div class="m-foot"><a href="https://wa.me/${C.wa || ''}" target="_blank" rel="noopener">${ICON.wa}<span>WhatsApp</span><span class="num" dir="ltr">${C.waDisplay || ''}</span></a><a href="https://instagram.com/${C.instagram}" target="_blank" rel="noopener">${ICON.ig}<span>@${C.instagram}</span></a></div>
      </div>`;
    $('#ftr').innerHTML = `
      <div class="wrap ftr-grid">
        <div class="ftr-brand"><img class="fl" src="assets/img/logo-full.png" srcset="assets/img/logo-full.png 1x, assets/img/logo-full@2x.png 2x" alt="MAJID Perfumes" width="919" height="799" loading="lazy"><p data-i18n="f.tag"></p>
          <div class="soc"><a href="https://instagram.com/${C.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ICON.ig}</a><a href="https://wa.me/${C.wa || ''}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICON.wa}</a></div></div>
        <div><h4 data-i18n="f.explore"></h4><ul>${nav.map(([h, k]) => `<li><a href="${h}" data-i18n="${k}"></a></li>`).join('')}</ul></div>
        <div><h4 data-i18n="f.help"></h4><ul><li><a href="privacy.html" data-i18n="f.privacy"></a></li><li><a href="terms.html" data-i18n="f.terms"></a></li><li><a href="shipping.html" data-i18n="f.shipping"></a></li></ul></div>
        <div><h4 data-i18n="f.contact"></h4><address><span dir="ltr">${C.phone}</span><br>${esc(C.address)}<br><a href="mailto:${C.email}" dir="ltr">${C.email}</a></address><p class="sample" data-i18n="f.sample"></p></div>
      </div>
      <div class="wrap ftr-base"><span>© 2026 MAJID Perfumes. <span data-i18n="f.rights"></span></span>${C.credit ? `<a class="credit" href="${C.studioUrl}" target="_blank" rel="noopener"><span data-i18n="f.credit"></span> MOHAMMED Web Studio</a>` : ''}</div>`;
    $('#drawer').innerHTML = `
      <div class="dr-back" data-close></div>
      <div class="dr-panel" role="dialog" aria-modal="true" data-i18n-attr="aria-label:cart.title">
        <header><h2 data-i18n="cart.title"></h2><button class="ib" data-close data-i18n-attr="aria-label:nav.close">${ICON.close}</button></header>
        <div class="dr-body" id="drBody"></div><footer id="drFoot"></footer>
      </div>`;
    const fab = document.createElement('a'); fab.className = 'wa-fab'; fab.id = 'wafab'; fab.target = '_blank'; fab.rel = 'noopener'; fab.innerHTML = ICON.wa; fab.setAttribute('aria-label', 'WhatsApp'); document.body.appendChild(fab);
  }

  // ---------------------------------------------------------------- i18n application
  const subs = [];
  const onLang = (fn) => subs.push(fn);
  function applyI18n(root = document) {
    $$('[data-i18n]', root).forEach((el) => { const v = t(el.dataset.i18n); if (typeof v === 'string') el.textContent = v; });
    $$('[data-i18n-html]', root).forEach((el) => { const v = t(el.dataset.i18nHtml); if (typeof v === 'string') el.innerHTML = v; });
    $$('[data-i18n-attr]', root).forEach((el) => el.dataset.i18nAttr.split(';').forEach((pair) => { const [a, k] = pair.split(':'); const v = t(k); if (typeof v === 'string') el.setAttribute(a, v); }));
  }
  function setLang(l, silent) {
    lang = l; store.set('mj-lang', l);
    const h = document.documentElement; h.lang = l; h.dir = 'ltr';
    $$('[data-lang]').forEach((b) => b.classList.toggle('on', b.dataset.lang === l));
    const m = $('meta[name=description]'); if (m) m.content = t('meta.desc');
    applyI18n(); syncBag(); const tk = document.body.dataset.title, tf = window.MJ && window.MJ.titleFn; document.title = (tf ? tf() + ' · ' : tk ? t(tk) + ' · ' : '') + 'MAJID Perfumes';
    $('#wafab').href = waUrl(t('contact.msg'));
    if (!silent) subs.forEach((fn) => fn());
  }

  // ---------------------------------------------------------------- menu + drawer
  let lastFocus = null;
  function setMenu(open) {
    const m = $('#menu'), b = $('#burger'); m.classList.toggle('open', open); b.classList.toggle('open', open); b.setAttribute('aria-expanded', open); document.documentElement.classList.toggle('noscroll', open || $('#drawer').classList.contains('open'));
  }
  function setDrawer(open) {
    const d = $('#drawer'); if (open) { lastFocus = document.activeElement; step = 'bag'; renderDrawer(); }
    d.classList.toggle('open', open); d.setAttribute('aria-hidden', !open); document.documentElement.classList.toggle('noscroll', open || $('#menu').classList.contains('open'));
    if (open) setTimeout(() => $('.dr-panel [data-close]', d)?.focus(), 60); else if (lastFocus) lastFocus.focus?.();
  }
  let step = 'bag', form = { name: '', city: '', address: '', note: '' };
  function renderDrawer() {
    const body = $('#drBody'), foot = $('#drFoot');
    if (!bag.length) { body.innerHTML = `<div class="dr-empty"><p>${t('cart.empty')}</p><a class="btn gold" href="shop.html">${t('cart.emptyCta')}</a></div>`; foot.innerHTML = ''; return; }
    if (step === 'form') {
      body.innerHTML = `<form class="dr-form" id="orderForm" novalidate><h3>${t('cart.form')}</h3>
        <label>${t('cart.name')}<input name="name" autocomplete="name" value="${esc(form.name)}" required></label>
        <label>${t('cart.city')}<input name="city" autocomplete="address-level2" value="${esc(form.city)}" required></label>
        <label>${t('cart.address')}<textarea name="address" rows="2" autocomplete="street-address">${esc(form.address)}</textarea></label>
        <label>${t('cart.note')}<textarea name="note" rows="2">${esc(form.note)}</textarea></label>
        <p class="err" id="formErr" role="alert"></p><p class="fine">${t('cart.waNote')}</p></form>`;
      foot.innerHTML = `<div class="sum"><span>${t('cart.total')}</span><b><bdi>${fmt(total())}</bdi></b></div>
        <button class="btn gold wide" id="sendWa">${ICON.wa}<span>${t('cart.send')}</span></button>
        <button class="btn line wide" id="copyOrder"><span>${t('cart.copy')}</span></button><button class="link" id="toBag">${t('cart.back')}</button>`;
      return;
    }
    body.innerHTML = `<ul class="lines">${bag.map((i, k) => { const p = prod(i.id); return `<li class="cline" style="--b1:${p.bg[0]};--b2:${p.bg[1]}">
      <a class="th" href="product.html?p=${p.id}"><img src="${img(p.id, 'bottle', true)}" alt="" width="1000" height="1000" loading="lazy"></a>
      <div class="li"><a class="nm" href="product.html?p=${p.id}">${pname(p)}</a><span class="ty">${typeLabel(p)} · ${t('p.ml')}</span>
        <label class="gift"><input type="checkbox" data-gift="${k}" ${i.gift ? 'checked' : ''}><i>${ICON.check}</i><span>${t('cart.gift')} <bdi>+${fmt(C.giftBag)}</bdi></span></label>
        <div class="qr"><div class="qty"><button data-dec="${k}" aria-label="${t('cart.dec')}">${ICON.minus}</button><b>${dig(i.qty)}</b><button data-inc="${k}" aria-label="${t('cart.inc')}">${ICON.plus}</button></div><b class="pr"><bdi>${fmt(unit(i) * i.qty)}</bdi></b></div>
      </div><button class="rm" data-rm="${k}" aria-label="${t('cart.remove')}">${ICON.close}</button></li>`; }).join('')}</ul>`;
    const left = Math.max(0, C.freeShippingOver - total());
    foot.innerHTML = `<div class="sum"><span>${t('cart.sub')}</span><b><bdi>${fmt(total())}</bdi></b></div>
      <p class="fine">${t('cart.ship')} ${left > 0 ? `${t('cart.free')} <bdi>${fmt(C.freeShippingOver)}</bdi>.` : ''}</p>
      <button class="btn gold wide" id="toForm"><span>${t('cart.checkout')}</span>${ICON.arrow}</button>`;
  }
  function syncBag(bump) {
    const n = count(), c = $('#bagcount'); c.textContent = dig(n); c.classList.toggle('on', n > 0);
    if (bump) { const b = $('#bagbtn'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
    if ($('#drawer').classList.contains('open')) renderDrawer();
  }
  function bind() {
    document.addEventListener('click', (e) => {
      const el = e.target.closest('button, a, [data-close]'); if (!el) return;
      if (el.dataset.lang) { setLang(el.dataset.lang); if (el.closest('#menu')) setMenu(false); return; }
      if (el.id === 'burger') { setMenu(!$('#menu').classList.contains('open')); return; }
      if (el.id === 'bagbtn') { setMenu(false); setDrawer(true); return; }
      if (el.hasAttribute('data-close')) { setDrawer(false); return; }
      if (el.closest('#menu') && el.tagName === 'A') { setMenu(false); return; }
      if (el.dataset.add) { addToBag(el.dataset.add, 1, false); const lbl = el.querySelector('span'); if (lbl && !el.dataset.busy) { el.dataset.busy = 1; el.classList.add('ok'); const old = lbl.textContent; lbl.textContent = t('cta.added'); setTimeout(() => { lbl.textContent = old; el.classList.remove('ok'); delete el.dataset.busy; }, 1400); } return; }
      const k = (a) => +el.dataset[a];
      if (el.dataset.inc !== undefined) { bag[k('inc')].qty = Math.min(20, bag[k('inc')].qty + 1); saveBag(); syncBag(); return; }
      if (el.dataset.dec !== undefined) { const i = bag[k('dec')]; i.qty -= 1; if (i.qty < 1) bag.splice(k('dec'), 1); saveBag(); syncBag(); return; }
      if (el.dataset.rm !== undefined) { bag.splice(k('rm'), 1); saveBag(); syncBag(); return; }
      if (el.id === 'toForm') { step = 'form'; renderDrawer(); return; }
      if (el.id === 'toBag') { readForm(); step = 'bag'; renderDrawer(); return; }
      if (el.id === 'sendWa') { if (readForm(true)) window.open(waUrl(orderText(form)), '_blank', 'noopener'); return; }
      if (el.id === 'copyOrder') { if (readForm(true)) { const txt = orderText(form); (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).catch(() => { const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); safe(() => document.execCommand('copy')); ta.remove(); }); const s = el.querySelector('span'); s.textContent = t('cart.copied'); setTimeout(() => { s.textContent = t('cart.copy'); }, 1400); } return; }
    });
    document.addEventListener('change', (e) => { const g = e.target.dataset && e.target.dataset.gift; if (g !== undefined && g !== '') { const i = bag[+g], other = bag.find((x, n) => n !== +g && x.id === i.id && x.gift === e.target.checked); i.gift = e.target.checked; if (other) { other.qty += i.qty; bag.splice(+g, 1); } saveBag(); syncBag(); } });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { setMenu(false); setDrawer(false); } });
    let last = 0; addEventListener('scroll', () => { const y = scrollY; if (Math.abs(y - last) < 4) return; last = y; $('#hdr').classList.toggle('solid', y > 40); }, { passive: true });
    $('#hdr').classList.toggle('solid', scrollY > 40);
  }
  function readForm(validate) {
    const f = $('#orderForm'); if (!f) return true;
    form = { name: f.name.value.trim(), city: f.city.value.trim(), address: f.address.value.trim(), note: f.note.value.trim() };
    if (!validate) return true;
    const err = $('#formErr'); err.textContent = !form.name ? t('cart.nameReq') : !form.city ? t('cart.cityReq') : '';
    if (err.textContent) { (form.name ? f.city : f.name).focus(); return false; } return true;
  }

  // ---------------------------------------------------------------- scroll reveal + pausing what is off-screen
  function motion() {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rv = (root = document) => {
      const els = $$('.rv:not(.in)', root); if (!els.length) return;
      if (reduce || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
      const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      els.forEach((e) => io.observe(e));
    };
    rv(); window.MJ.reveal = rv;
    if ('IntersectionObserver' in window) {
      const off = new IntersectionObserver((es) => es.forEach((en) => en.target.classList.toggle('off', !en.isIntersecting)), { rootMargin: '120% 0px' });
      $$('.sec').forEach((s) => off.observe(s));
      window.MJ.watchOff = (s) => off.observe(s);
    }
  }

  // ---------------------------------------------------------------- public API
  window.MJ = { ltr, C, D, t, get lang() { return lang; }, dig, fmt, prod, pname, note, img, picture, esc, ICON, typeLabel, addToBag, waUrl, onLang, applyI18n, setLang, $, $$, store, safe, LANGS };

  function boot() {
    chrome(); bind(); setLang(lang, true); motion();
    try { (window.MJPage || (() => {}))(window.MJ); } catch (e) { console.error(e); }
    setLang(lang, true);
    window.MJ.reveal && window.MJ.reveal();
    document.documentElement.classList.add('ready');
  }
  if (document.readyState === 'complete') boot(); else document.addEventListener('DOMContentLoaded', boot);     // deferred scripts have all run by then
})();
