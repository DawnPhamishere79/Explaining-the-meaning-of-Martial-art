/* =========================================================
   Explaining the Meaning of Martial Art — full page
   Frame 1 (Opening → Poem 3) + Frame 2 (Poem 4 → Poem 6)
   ========================================================= */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const DESIGN_W = 1440;
const FRAME2_TOP = 15717;       // frame 2 bắt đầu ngay dưới frame 1
let S = 1;                      // tỉ lệ scale hiện tại

const root = $('#canvas-root');
const wrapper = $('#viewport-wrapper');

/* ---------------- Scale khung 1440 theo bề ngang màn hình ---------------- */
function fit() {
  S = wrapper.clientWidth / DESIGN_W;
  root.style.transform = `scale(${S})`;
  wrapper.style.height = root.offsetHeight * S + 'px';
}
addEventListener('resize', fit);
fit();

/* =========================================================
   0. OPENING
   ========================================================= */

/* Thư pháp tự "viết" ra khi ảnh tải xong */
(function calligraphyWrite() {
  const el = $('#calligraphy-btn');
  const start = () => {
    setTimeout(() => el.classList.add('writing'), 400);
    el.addEventListener('animationend', () => {
      el.classList.remove('writing');
      el.classList.add('written');
    }, { once: true });
  };
  if (el.complete && el.naturalWidth) start();
  else el.addEventListener('load', start, { once: true });
})();

/* Hover chữ đỏ: loang mực & hiện chữ tiếng Anh (giữ nguyên) */
(function openingHover() {
  const btn = $('#calligraphy-btn');
  const enTexts = $$('.opening-en-text');
  let revealed = false;

  btn.addEventListener('mouseenter', () => {
    btn.classList.add('ink-bloomed');
    if (revealed) return;
    revealed = true;
    setTimeout(() => {
      enTexts.forEach((el, i) => setTimeout(() => el.classList.add('revealed'), i * 180));
    }, 350);
  });
  btn.addEventListener('mouseleave', () => btn.classList.remove('ink-bloomed'));
})();

/* Dấu mèo: bật/tắt con trỏ dấu chân & đóng dấu khi click */
(function pawCursor() {
  const sealBtn = $('#cat-seal-btn');
  const cursor = $('#cat-paw-cursor');
  const stamps = $('#paw-stamps-layer');
  let on = false;

  sealBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    on = !on;
    document.body.classList.toggle('paw-cursor-mode', on);
    cursor.classList.toggle('is-visible', on);
  });

  addEventListener('mousemove', (e) => {
    if (!on) return;
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  addEventListener('mousedown', () => { if (on) cursor.classList.add('is-stamped'); });
  addEventListener('mouseup', () => cursor.classList.remove('is-stamped'));

  root.addEventListener('click', (e) => {
    if (!on || e.target === sealBtn) return;
    const rect = root.getBoundingClientRect();
    const stamp = document.createElement('img');
    stamp.src = 'A1 Interactive Assets/0.OPENING/Cat Print.png';
    stamp.alt = '';
    stamp.className = 'stamped-paw';
    stamp.style.left = (e.clientX - rect.left) / S + 'px';
    stamp.style.top = (e.clientY - rect.top) / S + 'px';
    stamp.style.setProperty('--rot', (Math.floor(Math.random() * 36) - 18) + 'deg');
    stamps.appendChild(stamp);
  });
})();

/* =========================================================
   1. FIRST POEM
   ========================================================= */
(function firstPoem() {
  const face = $('#cat-face-hitbox');
  const closed = $('#cat-eyes-closed');
  const open = $('#cat-eyes-open');

  face.addEventListener('mouseenter', () => { closed.style.opacity = '0'; open.style.opacity = '1'; });
  face.addEventListener('mouseleave', () => { closed.style.opacity = '1'; open.style.opacity = '0'; });

  const smoke = $('#incense-smoke');
  const checkSmoke = () => {
    const r = smoke.getBoundingClientRect();
    if (r.top < innerHeight * 0.85 && r.bottom > 0) smoke.classList.add('smoke-active');
  };
  addEventListener('scroll', checkSmoke, { passive: true });
  checkSmoke();

  $$('.tiger-layer').forEach((tiger) => {
    const show = () => { if (smoke.classList.contains('smoke-active')) tiger.classList.add('is-hovered'); };
    tiger.addEventListener('mouseenter', show);
    tiger.addEventListener('mousemove', show);
    tiger.addEventListener('mouseleave', () => tiger.classList.remove('is-hovered'));
  });
})();

/* =========================================================
   1A. TRANSITION — núi hiện dần
   ========================================================= */
(function mountains() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const delay = Number(en.target.dataset.delay || 0);
      setTimeout(() => en.target.classList.add('in-view'), delay);
    });
  }, { threshold: 0.15 });
  $$('.mountain-reveal').forEach((el) => io.observe(el));
})();

/* =========================================================
   2. SECOND POEM
   ========================================================= */
(function secondPoem() {
  const pineHit = $('#pine-scene-hitbox');

  const pineIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) root.classList.add('pine-settled'); });
  }, { threshold: 0.2 });
  pineIO.observe(pineHit);

  pineHit.addEventListener('mouseenter', () => root.classList.add('wind-active'));
  pineHit.addEventListener('mouseleave', () => root.classList.remove('wind-active'));

  const fluteCat = $('#flute-cat-btn');
  const valleyHit = $('#valley-hitbox');
  let opened = false;

  fluteCat.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    $$('.valley-ink-reveal').forEach((el) => el.classList.add('valley-bloomed'));
    valleyHit.classList.add('valley-ready');
  });
  valleyHit.addEventListener('mouseenter', () => {
    if (!opened) return;
    $$('.valley-wind-reveal, .poem2-wind-reveal').forEach((el) => el.classList.add('wind-shown'));
  });
})();

/* =========================================================
   3. THIRD POEM
   ========================================================= */
(function thirdPoem() {
  const cloud = $('#monk-cloud-layer');
  const cloudIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) cloud.classList.add('cloud-floated'); });
  }, { threshold: 0.1 });
  cloudIO.observe(cloud);

  const targets = $$('.monk-reveal-target');
  const reveal = () => targets.forEach((el) => el.classList.add('monk-revealed'));
  $('#monk-cat-reveal-hitbox').addEventListener('mouseenter', reveal);

  const head = $('#monk-head-hitbox');
  const halo = $('#monk-halo');
  head.addEventListener('mouseenter', reveal);
  head.addEventListener('click', (e) => {
    e.stopPropagation();
    halo.classList.toggle('halo-on');
  });

  // Căn mèo / đuôi theo phần pixel thật (bỏ viền trong suốt của PNG)
  function fitVisiblePixels(img, box) {
    const run = () => {
      try {
        const w = img.naturalWidth, h = img.naturalHeight;
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, w, h).data;
        let minX = w, minY = h, maxX = -1, maxY = -1;
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            if (data[(y * w + x) * 4 + 3] > 20) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }
        if (maxX < 0) return;
        const bw = maxX - minX + 1, bh = maxY - minY + 1;
        const s = Math.min(box.width / bw, box.height / bh);
        img.style.width = w * s + 'px';
        img.style.height = h * s + 'px';
        img.style.left = box.left + (box.width - bw * s) / 2 - minX * s + 'px';
        img.style.top = box.top + (box.height - bh * s) / 2 - minY * s + 'px';
      } catch (err) {
        console.warn('fitVisiblePixels: open the page with Live Server (not file://)', err);
      }
    };
    if (img.complete && img.naturalWidth) run();
    else img.addEventListener('load', run, { once: true });
  }

  fitVisiblePixels($('#cat-on-monk-img'), { left: 427, top: 10778, width: 456, height: 460 });
  fitVisiblePixels($('.end-cat-tail'), { left: 668, top: 945, width: 96, height: 255 });
})();

/* =========================================================
   CHỮ THƠ — tách thành từng từ + chuyển động nhẹ
   ========================================================= */
(function poemWords() {
  const poems = $$('[data-anim]');

  // tách chữ: giữ xuống dòng (cả \n lẫn <br>)
  poems.forEach((el) => {
    let text = '';
    el.childNodes.forEach((n) => {
      if (n.nodeType === 3) text += n.textContent;
      else if (n.nodeName === 'BR') text += '\n';
    });
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    el.textContent = '';
    let i = 0;
    lines.forEach((line, li) => {
      if (li) el.appendChild(document.createElement('br'));
      line.split(/\s+/).forEach((word, wi) => {
        if (wi) el.appendChild(document.createTextNode(' '));
        const span = document.createElement('span');
        span.className = 'w';
        span.textContent = word;
        span.style.setProperty('--i', i);
        span.style.setProperty('--s', i % 2 ? 1 : -1);
        el.appendChild(span);
        i++;
      });
    });
    el.dataset.count = i;
  });

  // hiện dần khi scroll tới (trừ #p5Text — hiện khi mây tan)
  const markSettled = (el) => {
    const n = Number(el.dataset.count || 0);
    setTimeout(() => el.classList.add('settled'), n * 70 + 1600);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      markSettled(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: 0.5 });
  poems.forEach((el) => {
    if (el.dataset.anim === 'float') return;
    if (el.id === 'p5Text') {
      new MutationObserver(() => { if (el.classList.contains('in')) markSettled(el); })
        .observe(el, { attributes: true, attributeFilter: ['class'] });
      return;
    }
    io.observe(el);
  });

  // hover từng từ
  const HOLD = { dodge: 700, wave: 500, fade: 1600, drift: 1200, lift: 600 };
  poems.forEach((el) => {
    const type = el.dataset.anim;
    if (type === 'float') return;
    const words = $$('.w', el);

    words.forEach((w, idx) => {
      w.addEventListener('pointerenter', () => {
        if (!el.classList.contains('settled')) return;

        if (type === 'wave') {
          // gió lướt qua: từ được hover + các từ bên cạnh lần lượt nhấc lên
          words.forEach((other, j) => {
            const d = Math.abs(j - idx);
            if (d > 3) return;
            setTimeout(() => {
              other.classList.add('act');
              setTimeout(() => other.classList.remove('act'), HOLD.wave);
            }, d * 60);
          });
          return;
        }

        if (w.classList.contains('act')) return;
        w.classList.add('act');
        setTimeout(() => w.classList.remove('act'), HOLD[type] || 600);
      });
    });
  });
})();

/* =========================================================
   POEM 4 — hover mặt hồ: nước rẽ sóng → lộ layer moon in water
   ========================================================= */
(function poem4() {
  const sec = $('#p4');
  const water = $('#p4Water');
  const top = $('#p4Top');
  const hit = $('#p4Hit');
  const cv = $('#p4Ripples');
  const ctx = cv.getContext('2d');
  const disp = $('#waterDisp');
  const turb = $('#waterTurb');

  const W = 1460, H = 2536, RES = 0.5;
  cv.width = W * RES; cv.height = H * RES;

  const HOVER_R = 380;
  const FULL_R = 3200;
  const FULL_AFTER = 1600;
  const RIPPLE_Y_OFFSET = 0;   // >0 nếu muốn lỗ/sóng nằm cao hơn con trỏ

  let mx = W / 2, my = H * 0.6, cx = mx, cy = my;
  let r = 0, target = 0, hovering = false, full = false, fullTimer = null;
  let rings = [], lastRing = 0, raf = null, t = 0;

  const local = (e) => {
    const b = sec.getBoundingClientRect();
    return [(e.clientX - b.left) / S, (e.clientY - b.top) / S - RIPPLE_Y_OFFSET];
  };
  const addRing = (x, y, k = 1) => {
    rings.push({ x, y, r: 10, a: 0.7 * k, v: 6 * k });
    if (rings.length > 40) rings.shift();
  };
  const start = () => { if (!raf) raf = requestAnimationFrame(frame); };

  hit.addEventListener('pointerenter', (e) => {
    hovering = true;
    [mx, my] = local(e); cx = mx; cy = my;
    target = HOVER_R;
    addRing(mx, my, 1.5);
    clearTimeout(fullTimer);
    fullTimer = setTimeout(() => { full = true; addRing(cx, cy, 2.2); }, FULL_AFTER);
    start();
  });
  hit.addEventListener('pointermove', (e) => {
    [mx, my] = local(e);
    const now = performance.now();
    if (now - lastRing > 130) { addRing(mx, my); lastRing = now; }
  });
  hit.addEventListener('pointerleave', () => {
    hovering = false; full = false; target = 0;
    clearTimeout(fullTimer);
    start();
  });
  hit.addEventListener('click', (e) => {
    [mx, my] = local(e);
    full = true; addRing(mx, my, 2.5);
    start();
  });

  function frame() {
    t++;
    const goal = full ? FULL_R : target;
    r += (goal - r) * (full ? 0.03 : 0.08);
    if (!hovering && !full && r < 0.6) r = 0;
    cx += (mx - cx) * 0.1;
    cy += (my - cy) * 0.1;

    top.style.setProperty('--mx', cx + 'px');
    top.style.setProperty('--my', cy + 'px');
    top.style.setProperty('--r', Math.max(0.5, r) + 'px');

    const active = r > 1 || rings.length > 0;
    water.classList.toggle('rippling', active);
    if (active) {
      disp.setAttribute('scale', (16 + Math.sin(t * 0.06) * 6).toFixed(2));
      turb.setAttribute('baseFrequency',
        `${(0.006 + Math.sin(t * 0.012) * 0.0015).toFixed(4)} ${(0.02 + Math.cos(t * 0.015) * 0.005).toFixed(4)}`);
    }

    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.lineWidth = 2;
    for (let i = rings.length - 1; i >= 0; i--) {
      const g = rings[i];
      g.r += g.v; g.v *= 0.985; g.a *= 0.972;
      if (g.a < 0.02) { rings.splice(i, 1); continue; }
      for (let k = 0; k < 3; k++) {
        const rr = g.r - k * 26;
        if (rr <= 0) continue;
        ctx.strokeStyle = `rgba(235,245,255,${(g.a * (1 - k * 0.3)).toFixed(3)})`;
        ctx.beginPath();
        ctx.ellipse(g.x * RES, g.y * RES, rr * RES, rr * 0.35 * RES, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    if (active || hovering) raf = requestAnimationFrame(frame);
    else { raf = null; ctx.clearRect(0, 0, cv.width, cv.height); }
  }
})();

/* =========================================================
   POEM 5a — mây trôi ra khi hover / click
   ========================================================= */
(function poem5Clouds() {
  const text = $('#p5Text');
  $$('.p5-cloud').forEach((cl) => {
    const go = () => {
      if (cl.classList.contains('gone')) return;
      cl.style.setProperty('--dx', (cl.dataset.dx || 0) * 0.4 + 'px');
      cl.style.setProperty('--dy', (cl.dataset.dy || 0) * 0.4 + 'px');
      cl.classList.add('gone');
      text.classList.add('in');
    };
    cl.addEventListener('pointerenter', go);
    cl.addEventListener('click', go);
  });
})();

/* =========================================================
   POEM 5b — click mặt trời → nền trăng → mặt trăng
   ========================================================= */
(function poem5Sun() {
  const sun = $('#p5Sun');
  const bg = $('#p5MoonBg');
  const moon = $('#p5Moon');
  let busy = false;
  const unlock = (ms) => setTimeout(() => { busy = false; }, ms);

  sun.addEventListener('click', () => {
    if (busy) return;
    busy = true;
    sun.classList.add('hide');
    setTimeout(() => bg.classList.add('show'), 800);
    setTimeout(() => moon.classList.add('show'), 2000);
    unlock(3000);
  });
  moon.addEventListener('click', () => {
    if (busy) return;
    busy = true;
    moon.classList.remove('show');
    setTimeout(() => bg.classList.remove('show'), 600);
    setTimeout(() => sun.classList.remove('hide'), 1400);
    unlock(2600);
  });
})();

/* =========================================================
   POEM 6a — kiếm: hover lửa (giữ nguyên) + kéo thả tới con mèo
   ========================================================= */
(function poem6Sword() {
  const group = $('#swordGroup');
  const flames = $('#p6Flames');
  const hit = $('#swordHit');
  const home = $('#swordHome');

  // tâm lưỡi kiếm trong toạ độ frame 2 (khớp transform-origin trong CSS)
  const BLADE = { x: 589, y: 6854 + 859 };
  // tâm con mèo — thả kiếm trong bán kính SNAP_R quanh đây thì kiếm ở lại với mèo
  const CAT = { x: 650, y: 10590 };
  const SNAP_R = 650;
  // chỗ kiếm nằm cạnh mèo: tâm lưỡi kiếm + góc xoay (58deg = nằm ngang)
  const REST = { x: 645, y: 10930, rot: 58 };

  let locked = false;
  let state = 'home';            // home | dragging | resting | returning
  let drag = null;

  /* lửa khi hover / click (như cũ) — chỉ khi kiếm ở chỗ cũ */
  hit.addEventListener('pointerenter', () => { if (state === 'home') flames.classList.add('ignited'); });
  hit.addEventListener('pointerleave', () => { if (!locked && state !== 'dragging') flames.classList.remove('ignited'); });

  /* kéo thả */
  hit.addEventListener('pointerdown', (e) => {
    if (state === 'returning') return;
    e.preventDefault();
    hit.setPointerCapture(e.pointerId);
    const base = state === 'resting' ? { x: REST.x - BLADE.x, y: REST.y - BLADE.y } : { x: 0, y: 0 };
    drag = {
      id: e.pointerId,
      startX: e.clientX, startY: e.clientY + scrollY,
      cx: e.clientX, cy: e.clientY,
      base, dx: base.x, dy: base.y, moved: 0,
    };
    state = 'dragging';
    group.classList.remove('resting', 'returning');
    group.classList.add('dragging');
    group.style.transform = `translate(${base.x}px, ${base.y}px)`;
    requestAnimationFrame(dragLoop);
  });

  hit.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    drag.cx = e.clientX; drag.cy = e.clientY;
  });

  function dragLoop() {
    if (!drag) return;
    // tự cuộn trang khi kéo sát mép trên / dưới màn hình
    const EDGE = 120;
    if (drag.cy > innerHeight - EDGE) scrollBy(0, Math.min(24, (drag.cy - (innerHeight - EDGE)) / 3));
    else if (drag.cy < EDGE) scrollBy(0, -Math.min(24, (EDGE - drag.cy) / 3));

    drag.dx = drag.base.x + (drag.cx - drag.startX) / S;
    drag.dy = drag.base.y + (drag.cy + scrollY - drag.startY) / S;
    drag.moved = Math.max(drag.moved, Math.hypot(drag.dx - drag.base.x, drag.dy - drag.base.y));
    group.style.transform = `translate(${drag.dx}px, ${drag.dy}px)`;
    requestAnimationFrame(dragLoop);
  }

  const endDrag = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag;
    drag = null;
    group.classList.remove('dragging');

    // chỉ là click (không kéo) → bật/tắt giữ lửa như cũ
    if (d.moved < 6) {
      if (d.base.x || d.base.y) { rest(); return; }
      state = 'home';
      group.style.transform = '';
      locked = !locked;
      flames.classList.toggle('ignited', locked);
      return;
    }

    const bx = BLADE.x + d.dx, by = BLADE.y + d.dy;
    if (Math.hypot(bx - CAT.x, by - CAT.y) < SNAP_R) rest();
    else goHome();
  };
  hit.addEventListener('pointerup', endDrag);
  hit.addEventListener('pointercancel', endDrag);

  function rest() {
    state = 'resting';
    locked = false;
    flames.classList.remove('ignited');
    group.classList.add('resting');
    // ép trình duyệt nhận transform hiện tại trước khi chuyển
    void group.offsetWidth;
    group.style.transform = `translate(${REST.x - BLADE.x}px, ${REST.y - BLADE.y}px) rotate(${REST.rot}deg)`;
  }

  function goHome() {
    state = 'returning';
    group.classList.remove('resting');
    group.classList.add('returning');
    void group.offsetWidth;
    group.style.transform = 'translate(0px, 0px) rotate(0deg)';
    setTimeout(() => {
      group.classList.remove('returning');
      group.style.transform = '';
      state = 'home';
    }, 1150);
  }

  // scroll ngược lên tới chỗ cũ → kiếm bay về
  const homeIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting && state === 'resting') goHome(); });
  }, { threshold: 0.35 });
  homeIO.observe(home);
})();

/* =========================================================
   POEM 6b — hover mèo → hoa sen
   ========================================================= */
(function poem6Cat() {
  const cat = $('#p6Cat');
  const lotus = $('#p6Lotus');
  const hit = $('#catHit');
  const set = (on) => { cat.classList.toggle('gone', on); lotus.classList.toggle('bloom', on); };

  hit.addEventListener('pointerenter', () => set(true));
  hit.addEventListener('pointerleave', () => set(false));
  hit.addEventListener('click', () => set(!cat.classList.contains('gone')));
})();

/* =========================================================
   POEM 6c — mây cuối tan ra
   ========================================================= */
(function poem6EndCloud() {
  const el = $('#endCloud');
  let busy = false;
  function burn() {
    if (busy) return;
    busy = true;
    el.classList.add('burning');
    setTimeout(() => el.classList.remove('burning'), 5000);
    setTimeout(() => { busy = false; }, 8000);
  }
  el.addEventListener('pointerenter', burn);
  el.addEventListener('click', burn);
})();

/* ---------------- Debug: bấm phím D để xem vùng hover ---------------- */
addEventListener('keydown', (e) => {
  if (e.key === 'd' || e.key === 'D') document.body.classList.toggle('debug');
});
