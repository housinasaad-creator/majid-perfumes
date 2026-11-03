/* Page logic: home, shop, product, story, contact, legal. Needs core.js and components.js. */
window.MJPage = (M) => {
  const { t, D, C, ICON, pname, fmt, dig, esc, img, $, $$ } = M;
  const page = document.body.dataset.page;
  const P = D.products;
  const noteName = (id) => { const n = D.notes[id]; return n[M.lang === 'ar' ? 2 : M.lang === 'tr' ? 3 : 1]; };
  const bgv = (p) => `--b1:${p.bg[0]};--b2:${p.bg[1]};--liq:${p.liquid}`;
  const sw = (cur, attr) => P.map((p) => `<button class="sw ${p.id === cur ? 'on' : ''}" ${attr}="${p.id}" style="--s1:${p.bg[0]};--s2:${p.tone}" aria-label="${esc(pname(p))}" title="${esc(pname(p))}"><i></i></button>`).join('');

  // ---------------------------------------------------------------- home
  function home() {
    const hero = $('#heroArt');
    const heroP = M.prod('tadmur-noir');
    const renderHero = () => {
      hero.innerHTML = `<div class="h-arch"></div>${M.picture(heroP.id, 'bottle', '(min-width:1000px) 46vw, 92vw', pname(heroP), 'h-bottle', true)}
        <a class="h-chip" href="product.html?p=${heroP.id}"><b>${esc(pname(heroP))}</b><span>${M.typeLabel(heroP)} · ${t('p.ml')} · <bdi>${fmt(heroP.price)}</bdi></span>${ICON.arrow}</a>`;
    };
    // gold dust
    const dust = $('#dust'); const weak = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 2;
    const n = weak ? 9 : 18; let h = ''; for (let i = 0; i < n; i++) { const r = (a, b) => (a + Math.random() * (b - a)).toFixed(2); h += `<i style="left:${r(2, 98)}%;--s:${r(2, 5)}px;--d:${r(9, 20)}s;--dl:-${r(0, 20)}s;--dx:${r(-30, 30)}px"></i>`; }
    dust.innerHTML = h;
    // parallax while the hero is on screen
    let vis = true, raf = 0; const art = $('.hero-art');
    if ('IntersectionObserver' in window) new IntersectionObserver((e) => { vis = e[0].isIntersecting; }, { threshold: 0 }).observe($('#hero'));
    addEventListener('scroll', () => { if (!vis || raf) return; raf = requestAnimationFrame(() => { raf = 0; const y = Math.min(scrollY, 900); art.style.setProperty('--hy', (y * 0.07).toFixed(1) + 'px'); art.style.setProperty('--hs', (1 + y * 0.00012).toFixed(4)); }); }, { passive: true });

    // collection cards
    const cards = $('#homeCards');
    const renderCards = () => { cards.innerHTML = P.slice(0, 4).map((p, i) => M.card(p, i < 2)).join(''); M.reveal(cards); };

    // showcase: pick a perfume + one of the three views
    let sc = { id: 'tadmur-noir', v: 1 };
    const scArt = $('#scArt'), scSw = $('#scSw');
    const renderShowcase = () => {
      const p = M.prod(sc.id);
      scSw.innerHTML = sw(sc.id, 'data-sc');
      scArt.innerHTML = M.gallery(p, { start: sc.v, sizes: '(min-width:1000px) 46vw, 100vw' }); M.initGallery(scArt);
      const g = $('[data-gal]', scArt); g.addEventListener('view', (e) => { sc.v = ['bottle', 'pack', 'bag'].indexOf(e.detail); $$('.sc-points li').forEach((li, i) => li.classList.toggle('on', i === sc.v)); });
      $$('.sc-points li').forEach((li, i) => li.classList.toggle('on', i === sc.v));
      $('#scName').textContent = pname(p);
    };
    scSw.addEventListener('click', (e) => { const b = e.target.closest('[data-sc]'); if (!b) return; sc.id = b.dataset.sc; renderShowcase(); });
    $$('.sc-points li').forEach((li, i) => li.addEventListener('click', () => { const g = $('[data-gal]', scArt); g && g.go(i); }));

    // anatomy
    let an = { id: 'tadmur-noir' };
    const anRoot = $('#anRoot'), anSw = $('#anSw');
    const renderAnat = () => { anSw.innerHTML = sw(an.id, 'data-an'); anRoot.innerHTML = M.anatomy(M.prod(an.id)); M.initAnatomy(anRoot); anRoot.querySelectorAll('.rv').forEach((e) => e.classList.add('in')); watchAnat(); };
    const watchAnat = () => { const a = $('.anat', anRoot); if (!a) return; if (!('IntersectionObserver' in window)) { a.classList.add('in'); return; } const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { a.classList.add('in'); io.disconnect(); } }, { threshold: 0.25 }); io.observe(a); };
    anSw.addEventListener('click', (e) => { const b = e.target.closest('[data-an]'); if (!b) return; an.id = b.dataset.an; renderAnat(); });

    // line-up banner
    $('#lineArt').innerHTML = `<img src="assets/render/collection-md.webp" srcset="assets/render/collection-md.webp 1000w, assets/render/collection.webp 2000w" sizes="(min-width:1200px) 1100px, 100vw" width="2000" height="1000" alt="" loading="lazy" decoding="async">`;
    // marquee
    const mq = t('marq'); $('#marq').innerHTML = `<div class="mq-t">${[0, 1].map(() => mq.map((s) => `<span>${esc(s)}</span><i></i>`).join('')).join('')}</div>`;

    const all = () => { renderHero(); renderCards(); renderShowcase(); renderAnat(); const q = t('marq'); $('#marq').innerHTML = `<div class="mq-t">${[0, 1].map(() => q.map((s) => `<span>${esc(s)}</span><i></i>`).join('')).join('')}</div>`; };
    all(); M.onLang(all);
  }

  // ---------------------------------------------------------------- shop
  function shop() {
    const q = new URLSearchParams(location.search); let st = { f: q.get('f') || 'all', s: 'featured' };
    const fams = ['all', 'oriental', 'floral', 'fresh', 'woody'].filter((f) => f === 'all' || P.some((p) => p.families.includes(f)));
    const bar = $('#shopBar'), grid = $('#shopGrid');
    const draw = () => {
      let list = P.filter((p) => st.f === 'all' || p.families.includes(st.f));
      if (st.s === 'low') list = [...list].sort((a, b) => a.price - b.price); if (st.s === 'high') list = [...list].sort((a, b) => b.price - a.price);
      bar.innerHTML = `<div class="chips">${fams.map((f) => `<button class="chipb ${st.f === f ? 'on' : ''}" data-f="${f}">${t('shop.' + f)}</button>`).join('')}</div>
        <label class="sortb"><span>${t('shop.sort')}</span><select id="sortSel">${['featured', 'low', 'high'].map((s) => `<option value="${s}" ${st.s === s ? 'selected' : ''}>${t('shop.' + s)}</option>`).join('')}</select></label>
        <span class="cnt">${dig(list.length)} ${t('shop.count')}</span>`;
      grid.innerHTML = list.map((p, i) => M.card(p, i < 3)).join(''); M.reveal(grid);
    };
    bar.addEventListener('click', (e) => { const b = e.target.closest('[data-f]'); if (b) { st.f = b.dataset.f; draw(); } });
    bar.addEventListener('change', (e) => { if (e.target.id === 'sortSel') { st.s = e.target.value; draw(); } });
    $('#shopHelp').href = M.waUrl(t('contact.msg'));
    draw(); M.onLang(() => { draw(); $('#shopHelp').href = M.waUrl(t('contact.msg')); });
  }

  // ---------------------------------------------------------------- product
  function product() {
    const id = new URLSearchParams(location.search).get('p'); const p = M.prod(id);
    if (!p) { location.replace('shop.html'); return; }
    const root = $('#pd'); let opt = { gift: false, qty: 1 };
    const draw = () => {
      const others = P.filter((x) => x.id !== p.id).slice(0, 4);
      root.innerHTML = `
        <div class="wrap pd-grid">
          <div class="pd-gal rv">${M.gallery(p, { eager: true, start: 1 })}</div>
          <div class="pd-info">
            <nav class="crumbs rv" aria-label="breadcrumb"><a href="shop.html">${ICON.left}<span>${t('p.back')}</span></a></nav>
            <p class="eyebrow rv">${M.typeLabel(p)} · ${t('p.ml')}</p>
            <h1 class="rv">${esc(pname(p))}</h1>
            <p class="tag rv">${esc(p.tag[M.lang] || p.tag.en)}</p>
            <p class="price rv"><bdi>${fmt(p.price)}</bdi></p>
            <p class="desc rv">${esc(p.desc[M.lang] || p.desc.en)}</p>
            <div class="nt rv"><h4>${t('p.notes')}</h4>${['top', 'heart', 'base'].map((k) => `<div class="nt-r"><b>${t('an.' + k)}</b><span>${p.notes[k].map((n) => `<em><i style="--c:${D.families[D.notes[n][0]]}"></i>${esc(noteName(n))}</em>`).join('')}</span></div>`).join('')}</div>
            <div class="opts rv">
              <label class="gift big"><input type="checkbox" id="optGift" ${opt.gift ? 'checked' : ''}><i>${ICON.check}</i><span><b>${t('p.gift')} <bdi>+${fmt(C.giftBag)}</bdi></b><small>${t('p.giftT')}</small></span></label>
              <div class="qrow"><span>${t('p.qty')}</span><div class="qty"><button id="qMinus" aria-label="${t('cart.dec')}">${ICON.minus}</button><b id="qVal">${dig(opt.qty)}</b><button id="qPlus" aria-label="${t('cart.inc')}">${ICON.plus}</button></div></div>
            </div>
            <div class="buy rv"><button class="btn gold wide" id="addBtn">${ICON.bag}<span>${t('cta.add')} · <bdi id="addTotal">${fmt((p.price + (opt.gift ? C.giftBag : 0)) * opt.qty)}</bdi></span></button>
              <a class="btn line wide" href="${M.waUrl(t('cart.msg.ask') + ' ' + pname(p))}" target="_blank" rel="noopener">${ICON.wa}<span>${t('cta.ask')}</span></a></div>
            <div class="acc rv"><details><summary>${t('p.how')}</summary><p>${t('p.howT')}</p></details><details><summary>${t('p.pack')}</summary><p>${t('p.packT')}</p></details></div>
          </div>
        </div>
        <section class="sec anat-sec"><div class="wrap"><header class="sec-h rv"><p class="eyebrow">${t('an.eyebrow')}</p><h2>${t('an.title')}</h2><p class="sub">${t('an.sub')}</p></header><div id="pdAnat">${M.anatomy(p)}</div></div></section>
        <section class="sec rel"><div class="wrap"><header class="sec-h rv"><h2>${t('p.also')}</h2></header><div class="cards" id="relCards">${others.map((x) => M.card(x)).join('')}</div></div></section>
        <div class="buybar"><div><b>${esc(pname(p))}</b><span><bdi>${fmt(p.price)}</bdi></span></div><button class="btn gold" id="stickyAdd">${ICON.bag}<span>${t('p.sticky')}</span></button></div>`;
      M.initGallery(root); M.initAnatomy(root); M.reveal(root);
      const a = $('.anat', root); if (a && 'IntersectionObserver' in window) { const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { a.classList.add('in'); io.disconnect(); } }, { threshold: 0.25 }); io.observe(a); } else if (a) a.classList.add('in');
      document.title = pname(p) + ' · MAJID Perfumes';
      const upd = () => { $('#qVal').textContent = dig(opt.qty); $('#addTotal').textContent = fmt((p.price + (opt.gift ? C.giftBag : 0)) * opt.qty); };
      $('#optGift').addEventListener('change', (e) => { opt.gift = e.target.checked; upd(); });
      $('#qMinus').addEventListener('click', () => { opt.qty = Math.max(1, opt.qty - 1); upd(); }); $('#qPlus').addEventListener('click', () => { opt.qty = Math.min(20, opt.qty + 1); upd(); });
      const add = (btn) => { M.addToBag(p.id, opt.qty, opt.gift); const s = btn.querySelector('span'), old = s.innerHTML; btn.classList.add('ok'); s.textContent = t('cta.added'); setTimeout(() => { s.innerHTML = old; btn.classList.remove('ok'); }, 1500); };
      $('#addBtn').addEventListener('click', (e) => add(e.currentTarget)); $('#stickyAdd').addEventListener('click', (e) => add(e.currentTarget));
    };
    M.titleFn = () => pname(p); draw(); M.onLang(draw);
    document.body.classList.add('has-buybar');
  }

  // ---------------------------------------------------------------- story
  function story() {
    const draw = () => {
      $('#storyBody').innerHTML = `
        <div class="wrap narrow"><header class="sec-h rv"><p class="eyebrow">${t('story.eyebrow')}</p><h1>${t('story.title')}</h1><p class="sub">${t('story.text')}</p></header></div>
        <div class="wrap st-rows">
          <div class="st-row rv"><div class="st-img" style="--b1:${P[0].bg[0]};--b2:${P[0].bg[1]}">${M.picture('tadmur-noir', 'bottle', '(min-width:900px) 44vw, 92vw', '')}</div><p>${t('story.p1')}</p></div>
          <div class="st-row alt rv"><div class="st-img" style="--b1:${P[1].bg[0]};--b2:${P[1].bg[1]}">${M.picture('qays-signature', 'pack', '(min-width:900px) 44vw, 92vw', '')}</div><p>${t('story.p2')}</p></div>
          <div class="st-row rv"><div class="st-img" style="--b1:${P[2].bg[0]};--b2:${P[2].bg[1]}">${M.picture('rouge-damas', 'bag', '(min-width:900px) 44vw, 92vw', '')}</div><p>${t('story.p3')}</p></div>
        </div>
        <div class="wrap vals">${[1, 2, 3].map((n) => `<div class="val rv"><h3>${t('story.v' + n)}</h3><p>${t('story.v' + n + 't')}</p></div>`).join('')}</div>
        <div class="wrap center rv"><a class="btn gold" href="shop.html">${t('cta.visitShop')}${ICON.arrow}</a></div>`;
      M.reveal($('#storyBody'));
    };
    draw(); M.onLang(draw);
  }

  // ---------------------------------------------------------------- wholesale (shops and retailers)
  function wholesale() {
    const W = C.wholesale, tiers = W.tiers, price = (p, d) => Math.round(p.price * (1 - d) / 10) * 10;
    let f = { shop: '', person: '', city: '', phone: '', type: 0, qty: 0, note: '' };
    const draw = () => {
      $('#wsBody').innerHTML = `
        <div class="wrap narrow"><header class="sec-h rv"><p class="eyebrow">${t('ws.eyebrow')}</p><h1>${t('ws.title')}</h1><p class="sub">${t('ws.sub')}</p></header></div>
        <div class="wrap vals">${[1, 2, 3].map((n) => `<div class="val rv"><h3>${t('ws.b' + n)}</h3><p>${t('ws.b' + n + 't')}</p></div>`).join('')}</div>
        <div class="wrap"><header class="sec-h left rv"><h2>${t('ws.pricesT')}</h2><p class="sub">${t('ws.pricesS')}</p></header>
          <div class="tbl rv"><table><thead><tr><th>${t('ws.fr')}</th><th>${t('ws.retail')}</th>${tiers.map(([n]) => `<th>${dig(n)}+ ${t('ws.bottles')}</th>`).join('')}</tr></thead>
            <tbody>${P.map((p) => `<tr><td><span class="sw mini" style="--s1:${p.bg[0]};--s2:${p.tone}"><i></i></span>${esc(pname(p))}</td><td><bdi>${fmt(p.price)}</bdi></td>${tiers.map(([, d]) => `<td><b><bdi>${fmt(price(p, d))}</bdi></b></td>`).join('')}</tr>`).join('')}
            <tr class="gt"><td>${t('ws.gift')}</td><td><bdi>${fmt(C.giftBag)}</bdi></td><td colspan="${tiers.length}"><b><bdi>${fmt(W.giftBag)}</bdi></b></td></tr></tbody></table></div>
          <div class="terms rv"><h3>${t('ws.termsT')}</h3><ul>${t('ws.terms').map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div></div>
        <div class="wrap narrow ws-form-w"><header class="sec-h rv"><h2>${t('ws.formT')}</h2><p class="sub">${t('ws.formS')}</p></header>
          <form class="wsf rv" id="wsForm" novalidate>
            <label>${t('ws.shop')}<input name="shop" autocomplete="organization" value="${esc(f.shop)}" required></label>
            <label>${t('ws.person')}<input name="person" autocomplete="name" value="${esc(f.person)}" required></label>
            <label>${t('ws.city')}<input name="city" autocomplete="address-level2" value="${esc(f.city)}" required></label>
            <label>${t('ws.phone')}<input name="phone" type="tel" autocomplete="tel" inputmode="tel" value="${esc(f.phone)}" required></label>
            <label>${t('ws.type')}<select name="type">${t('ws.types').map((x, i) => `<option value="${i}" ${f.type === i ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select></label>
            <label>${t('ws.qty')}<select name="qty">${t('ws.qtys').map((x, i) => `<option value="${i}" ${f.qty === i ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select></label>
            <label class="full">${t('ws.note')}<textarea name="note" rows="3">${esc(f.note)}</textarea></label>
            <p class="err full" id="wsErr" role="alert"></p>
            <button class="btn gold wide full" type="submit">${ICON.wa}<span>${t('ws.send')}</span></button>
            <p class="fine full">${t('ws.fine')}</p>
          </form></div>`;
      M.reveal($('#wsBody'));
      const form = $('#wsForm');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        f = { shop: form.shop.value.trim(), person: form.person.value.trim(), city: form.city.value.trim(), phone: form.phone.value.trim(), type: +form.type.value, qty: +form.qty.value, note: form.note.value.trim() };
        if (!f.shop || !f.person || !f.city || !f.phone) { $('#wsErr').textContent = t('ws.req'); return; }
        $('#wsErr').textContent = '';
        const m = t('ws.msg'), L = [m.hello, '', `${m.shop}: ${f.shop}`, `${m.person}: ${f.person}`, `${m.city}: ${f.city}`, `${m.phone}: ${M.ltr(f.phone)}`, `${m.type}: ${t('ws.types')[f.type]}`, `${m.qty}: ${t('ws.qtys')[f.qty]}`];
        if (f.note) L.push(`${m.note}: ${f.note}`); L.push('', m.thanks);
        window.open(M.waUrl(L.join('\n')), '_blank', 'noopener');
      });
    };
    draw(); M.onLang(draw);
  }

  // ---------------------------------------------------------------- contact
  function contact() {
    const draw = () => {
      const wa = M.waUrl(t('contact.msg')), card = (ic, label, val, href, ltr) => `<${href ? 'a href="' + href + '" target="_blank" rel="noopener"' : 'div'} class="ct rv"><span class="ct-i">${ic}</span><span><small>${label}</small><b ${ltr ? 'dir="ltr"' : ''}>${val}</b></span></${href ? 'a' : 'div'}>`;
      $('#contactBody').innerHTML = `
        <div class="wrap narrow"><header class="sec-h rv"><p class="eyebrow">${t('contact.eyebrow')}</p><h1>${t('contact.title')}</h1><p class="sub">${t('contact.sub')}</p></header></div>
        <div class="wrap ct-grid">
          ${card(ICON.wa, t('contact.wa'), C.waDisplay || t('cta.whatsapp'), wa, true)}
          ${card(ICON.ig, t('contact.ig'), '@' + C.instagram, 'https://instagram.com/' + C.instagram, true)}
          ${card(ICON.arrow, t('contact.mail'), C.email, 'mailto:' + C.email, true)}
          ${card(ICON.arrow, t('contact.tel'), C.phone, '', true)}
          ${card(ICON.arrow, t('contact.addr'), esc(C.address), '', false)}
          ${card(ICON.arrow, t('contact.hours'), t('contact.hoursT'), '', false)}
        </div><p class="wrap fine center">${t('f.sample')}</p>`;
      M.reveal($('#contactBody'));
    };
    draw(); M.onLang(draw);
  }

  // ---------------------------------------------------------------- legal
  function legal() {
    const key = document.body.dataset.doc;
    const draw = () => {
      const d = t('legal.' + key);
      $('#legalBody').innerHTML = `<div class="wrap narrow legal"><header class="sec-h"><h1>${esc(d.title)}</h1><p class="upd">${t('legal.updated')}</p><p class="sub">${esc(d.intro)}</p></header>
        <ol class="lg">${d.sections.map(([h, p]) => `<li><h2>${esc(h)}</h2><p>${esc(p)}</p></li>`).join('')}</ol></div>`;
      document.title = d.title + ' · MAJID Perfumes';
    };
    M.titleFn = () => t('legal.' + key + '.title'); draw(); M.onLang(draw);
  }

  ({ home, shop, product, story, wholesale, contact, legal }[page] || (() => {}))();
};
