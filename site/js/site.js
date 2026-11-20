// Reference-led portfolio behaviour. Native scrolling only: every effect reads scroll position or responds to a click.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  /* ---------- Reveal ---------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  // stagger siblings so lists pop up one after another
  $$('.rv').forEach((el) => { if (el.style.getPropertyValue('--d')) return; const sib = [...el.parentElement.children].filter((c) => c.classList.contains('rv')); const i = sib.indexOf(el); if (i > 0) el.style.setProperty('--d', `${Math.min(i, 8) * 90}ms`); });
  $$('.rv, h1, .band, .work__art, .case__fig').forEach((el) => io.observe(el));

  /* ---------- Hero: the photograph cut into tiles that sit exactly on the page grid's column lines ---------- */
  const hero = $('.hero'), frag = $('[data-frag]');
  let tiles = [], cols = 8, rows = 5, natural = null, mx = -1e4, my = -1e4;
  const pickSrc = () => (frag.clientWidth * Math.min(2, devicePixelRatio || 1) > 1500 ? frag.dataset.src : frag.dataset.srcSm);
  function layout() {
    if (!natural) return;
    const W = frag.clientWidth, H = frag.clientHeight, phone = innerWidth <= 760;
    cols = phone ? 4 : 8; rows = phone ? 6 : 5;
    const m = Math.max(20, innerWidth * 0.045), cw = (W - 2 * m) / cols;
    const xs = [0, ...Array.from({ length: cols - 1 }, (_, i) => m + (i + 1) * cw), W];
    const s = Math.max(W / natural.w, H / natural.h), bw = natural.w * s, bh = natural.h * s;
    const fx = +frag.dataset.fx, fy = +frag.dataset.fy;
    const ox = clamp(W / 2 - fx * bw, W - bw, 0), oy = clamp(H / 2 - fy * bh, H - bh, 0);
    const need = cols * rows;
    if (tiles.length !== need) {
      frag.replaceChildren(); tiles = [];
      for (let i = 0; i < need; i++) { const t = document.createElement('div'); t.className = 't'; frag.appendChild(t); tiles.push({ el: t }); }
    }
    const fpx = ox + fx * bw, fpy = oy + fy * bh, maxD = Math.hypot(W, H);
    tiles.forEach((t, i) => {
      const c = i % cols, r = Math.floor(i / cols), x = xs[c], w = xs[c + 1] - x, y = (r * H) / rows, h = H / rows;
      Object.assign(t, { c, r, x, y, w, h });
      Object.assign(t.el.style, { left: `${x}px`, top: `${y}px`, width: `${Math.ceil(w) + 1}px`, height: `${Math.ceil(h) + 1}px`, backgroundImage: `url("${natural.src}")`, backgroundSize: `${bw}px ${bh}px`, backgroundPosition: `${ox - x}px ${oy - y}px` });
      t.el.style.setProperty('--delay', `${Math.round((Math.hypot(x + w / 2 - fpx, y + h / 2 - fpy) / maxD) * 900)}ms`);
    });
  }
  function renderTiles(p) {
    if (reduce || !tiles.length) return;
    const R = frag.getBoundingClientRect();
    tiles.forEach((t) => {
      const dc = t.c - (cols - 1) / 2, dr = t.r - (rows - 1) / 2;
      let lift = 0;
      if (fine && mx > -1e3) { const d = Math.hypot(R.left + t.x + t.w / 2 - mx, R.top + t.y + t.h / 2 - my); lift = Math.max(0, 1 - d / 220) * -7; }
      t.el.style.transform = (p > 0.001 || lift) ? `translate3d(${(dc * p * 14).toFixed(1)}px, ${(dr * p * 22 + lift).toFixed(1)}px, 0)` : '';
    });
  }
  const img = new Image();
  img.decoding = 'async';
  img.onload = () => {
    natural = { w: img.naturalWidth, h: img.naturalHeight, src: img.src };
    layout();
    requestAnimationFrame(() => requestAnimationFrame(() => frag.classList.add('is-in')));
    setTimeout(() => frag.classList.add('settled'), 2600); // after assembly, tiles follow scroll and pointer without lag
  };
  img.src = pickSrc();
  if (fine && !reduce) {
    hero.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; tick(); });
    hero.addEventListener('pointerleave', () => { mx = my = -1e4; tick(); });
  }

  /* ---------- Navigation: follows the environment beneath it ---------- */
  const nav = $('[data-nav]'), bar = $('[data-progress]'), menu = $('[data-menu]');
  const links = $$('.nav__links a'), targets = links.map((a) => $(a.getAttribute('href')));
  const envs = $$('[data-env]').filter((el) => el.tagName === 'SECTION');
  menu.addEventListener('click', () => { const o = !nav.classList.contains('is-open'); nav.classList.toggle('is-open', o); menu.setAttribute('aria-expanded', String(o)); });
  links.forEach((a) => a.addEventListener('click', () => { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); }));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); menu.focus(); } });

  /* ---------- Case diagrams, constellations, log ---------- */
  const cases = $$('.case').map((c) => { $$('.d-rule, .d-accent', c).forEach((p) => p.getTotalLength && p.style.setProperty('--len', Math.ceil(p.getTotalLength()))); return c; });
  const skyEl = $('[data-sky]'), cap = $('[data-sky-caption]');
  if (skyEl) {
    $$('.c-line', skyEl).forEach((p) => p.style.setProperty('--len', Math.ceil(p.getTotalLength())));
    const bridges = $$('.b-line', skyEl);
    const light = (star) => {
      const id = star.dataset.id;
      $$('.star', skyEl).forEach((s) => s.classList.toggle('is-lit', s === star));
      bridges.forEach((b) => b.classList.toggle('is-lit', b.dataset.a === id || b.dataset.b === id));
      skyEl.classList.add('has-focus'); cap.innerHTML = star.dataset.note; // authored markup in this page
    };
    $$('.star', skyEl).forEach((s) => {
      s.addEventListener('click', () => light(s)); s.addEventListener('focus', () => light(s));
      s.addEventListener('mouseenter', () => fine && light(s));
      s.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); light(s); } });
    });
  }
  const log = $('[data-log]'), bands = $$('.band img'), mist = $('.mist');
  // atmosphere: one fixed photograph per chapter; each loads only when its chapter approaches
  const atmos = $('.atmos'), aImgs = $$('.atmos__img'), aSecs = aImgs.map((im) => document.getElementById(im.dataset.for));
  const big = () => innerWidth * Math.min(2, devicePixelRatio || 1) > 1500;
  const load = (im) => { if (!im.getAttribute('src')) im.src = big() ? im.dataset.srcLg : im.dataset.src; };
  const toast = $('[data-toast]');
  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); toast.textContent = 'Copied'; setTimeout(() => (toast.textContent = ''), 2200); }
    catch { location.href = `mailto:${b.dataset.copy}`; }
  }));

  /* ---------- One frame: read all rects, then write ---------- */
  let ticking = false, lastActive = -1;
  function frame() {
    ticking = false;
    const vh = innerHeight, y = scrollY, docH = document.documentElement.scrollHeight;
    const heroR = hero.getBoundingClientRect();
    const tR = targets.map((t) => t.getBoundingClientRect());
    const eR = envs.map((s) => s.getBoundingClientRect());
    const bR = bands.map((b) => b.parentElement.getBoundingClientRect());
    const cR = cases.map((c) => c.getBoundingClientRect());
    const sR = skyEl && skyEl.getBoundingClientRect(), lR = log && log.getBoundingClientRect(), mR = mist && mist.getBoundingClientRect();
    const navH = nav.offsetHeight;
    const aR = aSecs.map((s) => s.getBoundingClientRect());

    const under = envs[eR.findIndex((r) => r.top <= navH && r.bottom > navH)] || envs[0];
    nav.setAttribute('data-env', under.dataset.env);
    nav.classList.toggle('on-photo', under === hero && innerWidth > 760);
    nav.classList.toggle('is-solid', y > heroR.height - navH);
    bar.style.setProperty('--p', clamp(y / (docH - vh)).toFixed(4));
    let a = -1; tR.forEach((r, i) => { if (r.top <= vh * 0.35) a = i; });
    if (a !== lastActive) { lastActive = a; links.forEach((l, i) => (i === a ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current'))); }

    const hp = clamp(-heroR.top / Math.max(1, heroR.height));
    renderTiles(hp);
    if (!reduce) {
      bR.forEach((r, i) => { if (r.bottom > 0 && r.top < vh) bands[i].style.setProperty('--par', `${((r.top + r.height / 2 - vh / 2) / vh * -60).toFixed(1)}px`); });
      if (mR && mR.bottom > 0 && mR.top < vh) mist.style.setProperty('--mp', clamp((vh - mR.top) / (vh + mR.height)).toFixed(3));
    }
    let on = -1; aR.forEach((r, i) => { if (r.top < vh * 0.6 && r.bottom > vh * 0.4) on = i; });
    aR.forEach((r, i) => { if (r.top < vh * 2 && r.bottom > -vh) load(aImgs[i]); });
    aImgs.forEach((im, i) => {
      im.classList.toggle('is-on', i === on);
      if (i === on && !reduce) im.style.setProperty('--cam', clamp((vh - aR[i].top) / (vh + aR[i].height)).toFixed(3));
    });
    atmos.classList.toggle('is-space', on > -1 && aSecs[on].dataset.env === 'space');
    cases.forEach((c, i) => c.style.setProperty('--draw', reduce ? 1 : clamp((vh * 0.85 - cR[i].top) / (vh * 0.6)).toFixed(3)));
    if (sR) skyEl.style.setProperty('--sky-p', reduce ? 1 : clamp((vh - sR.top) / (vh * 0.9)).toFixed(3));
    if (lR) log.style.setProperty('--log-p', clamp((vh * 0.55 - lR.top) / lR.height).toFixed(3));
  }
  /* ---------- Scroll camera: a lerped playhead (scroll-craft: ~0.18/frame) drives every camera move ---------- */
  const zt = $('.zoomtrip'), ztL = $$('.zt__layer'), ztC = $$('.zt__cap');
  let geo = null, sy = scrollY, camOn = false;
  const top = (el) => el.getBoundingClientRect().top + scrollY;
  function measure() { geo = { heroT: top(hero), heroH: hero.offsetHeight, ztT: zt ? top(zt) : 0, ztH: zt ? zt.offsetHeight : 1, bands: bands.map((b) => ({ t: top(b.parentElement), h: b.parentElement.offsetHeight })) }; frag.style.setProperty('--ox', `${+frag.dataset.fx * 100}%`); frag.style.setProperty('--oy', `${+frag.dataset.fy * 100}%`); }
  const ease = (t) => t * t * (3 - 2 * t);
  function camera(y) {
    if (!geo) measure();
    const vh = innerHeight;
    hero.style.setProperty('--hp', clamp((y - geo.heroT) / geo.heroH).toFixed(4));
    geo.bands.forEach((b, i) => bands[i].style.setProperty('--bs', (1.04 + clamp((y + vh - b.t) / (vh + b.h)) * .2).toFixed(4)));
    if (zt) {
      const p = clamp((y - geo.ztT) / (geo.ztH - vh)), n = ztL.length;
      ztL.forEach((im, i) => {
        const l = p * n - i;
        const fin = i === 0 ? 1 : ease(clamp((l + .25) / .35)), fout = i === n - 1 ? 1 : 1 - ease(clamp((l - .7) / .35));
        im.style.opacity = (fin * fout).toFixed(3);
        im.style.transform = `scale(${(1 + clamp(l + .25, 0, 1.4) * .9).toFixed(4)})`;
        const c = ztC[i], ci = ease(clamp((l - .05) / .25)) * (1 - ease(clamp((l - .6) / .25)));
        c.style.opacity = (i === n - 1 ? ease(clamp((l - .05) / .25)) : ci).toFixed(3);
        c.style.transform = `translate3d(0, ${((1 - ci) * 40).toFixed(1)}px, 0)`;
      });
    }
  }
  function camLoop() {
    sy += (scrollY - sy) * (reduce ? 1 : 0.18);
    if (Math.abs(scrollY - sy) < 0.5) sy = scrollY;
    camera(sy);
    if (sy !== scrollY) requestAnimationFrame(camLoop); else camOn = false;
  }
  const kickCam = () => { if (!camOn) { camOn = true; requestAnimationFrame(camLoop); } };
  function tick() { kickCam(); if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', tick, { passive: true });
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { layout(); measure(); tick(); }, 150); });
  addEventListener('load', () => { measure(); tick(); });
  frame(); camera(scrollY);
})();
