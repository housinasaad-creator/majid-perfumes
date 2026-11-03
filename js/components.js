/* Components: product card, three-view gallery, fragrance anatomy. Needs core.js (window.MJ). */
(() => {
  const M = window.MJ, { t, D, C, ICON, pname, fmt, dig, esc, img, $, $$ } = M;
  const bgv = (p) => `--b1:${p.bg[0]};--b2:${p.bg[1]};--liq:${p.liquid}`;
  const noteName = (id) => { const n = D.notes[id]; return n[M.lang === 'ar' ? 2 : M.lang === 'tr' ? 3 : 1]; };
  const noteLine = (p, n = 3) => [...p.notes.top.slice(0, 1), ...p.notes.heart.slice(0, 1), ...p.notes.base.slice(0, 1)].slice(0, n).map(noteName).join(' · ');
  const oneDigit = (s) => dig(s);

  // ---------------------------------------------------------------- card
  M.card = (p, eager) => `
    <article class="card rv" style="${bgv(p)}" data-id="${p.id}">
      <a class="c-link" href="product.html?p=${p.id}" aria-label="${esc(pname(p))}">
        <div class="frame"><div class="c-art">
          ${M.picture(p.id, 'pack', '(min-width:1000px) 24vw, (min-width:640px) 44vw, 78vw', '', 'v-a', eager)}
          ${M.picture(p.id, 'bottle', '(min-width:1000px) 24vw, (min-width:640px) 44vw, 78vw', '', 'v-b')}
        </div><span class="hov">${t('card.hover')}</span></div>
        <h3 class="c-name">${esc(pname(p))}</h3>
        <p class="c-meta">${M.typeLabel(p)} · ${t('p.ml')}</p>
        <p class="c-notes">${noteLine(p)}</p>
      </a>
      <div class="c-row"><span class="c-price"><bdi>${fmt(p.price)}</bdi></span><button class="btn mini" data-add="${p.id}">${ICON.plus}<span>${t('cta.add')}</span></button></div>
    </article>`;

  // ---------------------------------------------------------------- gallery: bottle / box / bag
  const VIEWS = ['bottle', 'pack', 'bag'];
  M.gallery = (p, opts = {}) => `
    <div class="gal" data-gal="${p.id}" style="${bgv(p)}">
      <div class="g-stage" tabindex="0" role="group" aria-roledescription="carousel" aria-label="${t('p.gallery')}">
        ${VIEWS.map((v, k) => `<div class="g-slide ${k === (opts.start || 0) ? 'on' : ''}" data-v="${v}">${M.picture(p.id, v, opts.sizes || '(min-width:1000px) 46vw, 100vw', pname(p) + ' — ' + t('views.' + v), '', k === (opts.start || 0) && opts.eager)}</div>`).join('')}
        <button class="g-nav prev" aria-label="${t('p.prev')}">${ICON.left}</button><button class="g-nav next" aria-label="${t('p.next')}">${ICON.right}</button>
      </div>
      <div class="g-pick" role="tablist">${VIEWS.map((v, k) => `<button role="tab" class="pick ${k === (opts.start || 0) ? 'on' : ''}" data-v="${v}" aria-selected="${k === (opts.start || 0)}"><span class="pt"><img src="${img(p.id, v, true)}" alt="" width="1000" height="1000" loading="lazy"></span><span class="pl">${t('views.' + v)}</span></button>`).join('')}</div>
    </div>`;
  M.initGallery = (root) => {
    $$('[data-gal]', root).forEach((g) => {
      if (g._init) return; g._init = true;
      const slides = $$('.g-slide', g), picks = $$('.pick', g), stage = $('.g-stage', g); let cur = slides.findIndex((s) => s.classList.contains('on')); if (cur < 0) cur = 0;
      const go = (n) => { cur = (n + slides.length) % slides.length; slides.forEach((s, i) => s.classList.toggle('on', i === cur)); picks.forEach((b, i) => { b.classList.toggle('on', i === cur); b.setAttribute('aria-selected', i === cur); }); g.dispatchEvent(new CustomEvent('view', { detail: VIEWS[cur] })); };
      picks.forEach((b, i) => b.addEventListener('click', () => go(i)));
      $('.prev', g).addEventListener('click', () => go(cur - 1)); $('.next', g).addEventListener('click', () => go(cur + 1));
      stage.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') go(cur + 1); if (e.key === 'ArrowLeft') go(cur - 1); });
      let x0 = null, y0 = 0;
      stage.addEventListener('pointerdown', (e) => { x0 = e.clientX; y0 = e.clientY; });
      stage.addEventListener('pointerup', (e) => { if (x0 === null) return; const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null; if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? cur + 1 : cur - 1); });
      stage.addEventListener('pointercancel', () => { x0 = null; });
      g.go = go;
    });
  };

  // ---------------------------------------------------------------- anatomy
  const tier = (key, ids) => `<div class="band b-${key}"><span class="tier"><b>${t('an.' + key)}</b><small>${t('an.' + key + 'S')}</small></span>
      <ul class="nl">${ids.map((n) => `<li><i style="--c:${D.families[D.notes[n][0]]}"></i>${esc(noteName(n))}</li>`).join('')}</ul></div>`;
  const dial = (label, val, unit, frac) => `<div class="dial" style="--p:${Math.round(frac * 100)}"><div class="d-ring"><svg viewBox="0 0 80 80" aria-hidden="true"><circle class="trk" cx="40" cy="40" r="34"/><circle class="val" cx="40" cy="40" r="34" pathLength="100"/></svg><div class="dv"><b><bdi dir="ltr">${oneDigit(val)}</bdi></b><small>${unit}</small></div></div><span class="dl">${label}</span></div>`;
  M.anatomy = (p) => {
    const [a, b] = p.perf.hours.split('–').map(Number), hoursFrac = ((a + b) / 2) / 12;
    const seasons = ['spring', 'summer', 'autumn', 'winter'];
    return `<div class="anat" style="${bgv(p)}" data-anat="${p.id}">
      <div class="a-stage" data-tilt>
        <i class="halo"></i>
        ${tier('top', p.notes.top)}${tier('heart', p.notes.heart)}${tier('base', p.notes.base)}
        ${M.picture(p.id, 'bottle', '(min-width:1000px) 40vw, 90vw', pname(p), 'a-bottle')}
      </div>
      <div class="a-side">
        <div class="dials">${dial(t('an.longevity'), p.perf.hours, t('an.hours'), hoursFrac)}${dial(t('an.projection'), p.perf.projection + '/5', '', p.perf.projection / 5)}${dial(t('an.intensity'), p.perf.intensity + '/5', '', p.perf.intensity / 5)}</div>
        <div class="wear"><h4>${t('an.wear')}</h4>
          <div class="w-row"><span class="w-l">${t('an.season')}</span><div class="w-i">${seasons.map((s, i) => `<span class="ico ${p.season[i] ? 'on' : ''}" title="${t('an.' + s)}">${ICON[s]}<em>${t('an.' + s)}</em></span>`).join('')}</div></div>
          <div class="w-row"><span class="w-l">${t('an.time')}</span><div class="w-i">${['day', 'night'].map((s) => `<span class="ico ${p.time === s ? 'on' : ''}" title="${t('an.' + s)}">${ICON[s]}<em>${t('an.' + s)}</em></span>`).join('')}</div></div>
          <div class="w-row"><span class="w-l">${t('an.occasion')}</span><div class="w-c">${p.occasions.map((o) => `<span class="chip">${t('an.occ.' + o)}</span>`).join('')}</div></div>
        </div>
      </div></div>`;
  };
  M.initAnatomy = (root) => {
    $$('.a-stage[data-tilt]', root).forEach((st) => {
      if (st._init) return; st._init = true; let raf = 0, tx = 0, ty = 0;
      const apply = () => { raf = 0; st.style.setProperty('--px', tx.toFixed(3)); st.style.setProperty('--py', ty.toFixed(3)); };
      st.addEventListener('pointermove', (e) => { if (e.pointerType === 'touch') return; const r = st.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width - 0.5) * 2; ty = ((e.clientY - r.top) / r.height - 0.5) * 2; if (!raf) raf = requestAnimationFrame(apply); });
      st.addEventListener('pointerleave', () => { tx = ty = 0; if (!raf) raf = requestAnimationFrame(apply); });
    });
    M.reveal && M.reveal(root);
  };
})();
