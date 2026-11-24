// Little celebrations for when a chore or routine is finished: four canvas animations that play over the card.
// Each person chooses their own (kept with their chores). A short one plays for a chore, a bigger one for a routine or the last chore of the day.

export const CELEBRATIONS = [
  { id: 'tape',      label: 'Ticker tape', icon: '🎊', hint: 'Streamers and confetti fall from the top' },
  { id: 'fireworks', label: 'Fireworks',   icon: '🎆', hint: 'Rockets burst across the sky' },
  { id: 'balloons',  label: 'Balloons',    icon: '🎈', hint: 'Colourful balloons float up' },
  { id: 'stars',     label: 'Star shower', icon: '🌟', hint: 'Golden stars twinkle down' },
];

export const DEFAULT_CELEBRATION = 'tape';

const COLOURS = ['#ff5d73', '#ffb020', '#ffe14d', '#4fd1a1', '#3db6cc', '#6f80f2', '#cf6fb6', '#ffffff'];
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = list => list[Math.floor(Math.random() * list.length)];

/**
 * Play a celebration over `host` (an element with a shadow root, or any positioned element).
 * @param style  'tape' | 'fireworks' | 'balloons' | 'stars' | 'off' (the person's own choice; default ticker tape)
 * @param big    a longer, fuller version
 * @param force  play even when the device asks for reduced motion (used by the preview in Chores settings)
 */
export function celebrate(host, style = DEFAULT_CELEBRATION, { big = false, force = false } = {}) {
  if (!host || style === 'off' || !SIMS[style]) return;
  if (!force && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const root = host.renderRoot || host.shadowRoot || host;
  const rect = host.getBoundingClientRect();
  const w = Math.max(rect.width, 200), h = Math.max(rect.height, 200);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement('canvas');
  canvas.width = w * dpr; canvas.height = h * dpr;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:120;';
  root.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const sim = SIMS[style](w, h, big);
  const t0 = performance.now();
  let last = t0;
  const frame = now => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    const alive = sim.step(ctx, dt, (now - t0) / 1000);
    if (alive && now - t0 < (sim.max || 5500)) requestAnimationFrame(frame); else canvas.remove();
  };
  requestAnimationFrame(frame);
}

// ---- ticker tape: rectangles that flutter and long ribbons ---------------------------------

function tape(w, h, big) {
  const n = big ? 240 : 120;
  const spread = big ? 1.4 : 0.8;
  const ps = Array.from({ length: n }, () => {
    const ribbon = Math.random() < 0.3;
    return {
      ribbon, at: rnd(0, spread), x: rnd(0, w), y: rnd(-30, -10), vy: h * rnd(0.3, 0.58), sway: rnd(10, 40), f: rnd(1.5, 4), ph: rnd(0, 6.3),
      rot: rnd(0, 6.3), vr: rnd(-6, 6), c: pick(COLOURS), len: rnd(40, 90), sz: rnd(6, 11),
    };
  });
  return {
    step(ctx, dt, t) {
      let alive = false;
      for (const p of ps) {
        if (t < p.at) { alive = true; continue; }
        p.y += p.vy * dt; p.rot += p.vr * dt;
        const sx = p.x + Math.sin(t * p.f + p.ph) * p.sway;
        if (p.y > h + 100) continue;
        alive = true;
        ctx.fillStyle = ctx.strokeStyle = p.c;
        if (p.ribbon) {
          ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath();
          for (let i = 0; i <= 8; i++) {
            const yy = p.y - i * (p.len / 8), xx = sx + Math.sin(t * 5 + p.ph + i * 0.8) * 7;
            if (i === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
          }
          ctx.stroke();
        } else {
          ctx.save(); ctx.translate(sx, p.y); ctx.rotate(p.rot); ctx.scale(1, Math.cos(t * p.f * 2 + p.ph));
          ctx.fillRect(-p.sz / 2, -p.sz * 0.7, p.sz, p.sz * 1.4); ctx.restore();
        }
      }
      return alive;
    },
  };
}

// ---- fireworks: big shells that flash, burst into trails, glitter and droop ----------------------

function fireworks(w, h, big) {
  const base = Math.max(Math.min(w, h), 380);          // bursts scale with the card, so they are big on a phone too
  const count = big ? 11 : 5;
  const gap = big ? 0.27 : 0.42;
  const shells = Array.from({ length: count }, (_, i) => {
    const x0 = rnd(w * 0.12, w * 0.88);
    return {
      at: i * gap + rnd(0, 0.18), x0, bx: x0 + rnd(-50, 50), by: rnd(h * 0.12, h * 0.5), dur: rnd(0.55, 0.75), state: 'wait',
      kind: pick(['peony', 'peony', 'ring', 'willow']), c: pick(COLOURS.slice(0, 7)), c2: pick(COLOURS.slice(0, 7)),
      R: base * rnd(0.34, 0.5), sparks: [], flash: 0,
    };
  });
  const end = shells[count - 1].at + 0.8 + 2.4;
  return {
    max: 7000,
    step(ctx, dt, t) {
      // dim the scene a little so the colours pop, then bring it back
      const dim = 0.34 * Math.min(1, t / 0.3) * Math.min(1, Math.max(0, (end - t) / 0.7));
      ctx.fillStyle = `rgba(3,8,18,${dim})`; ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      let alive = t < end;
      for (const r of shells) {
        if (r.state === 'done') continue;
        if (t < r.at) continue;
        const k = (t - r.at) / r.dur;
        if (k < 1) {
          const ease = k => 1 - (1 - k) * (1 - k);
          const x = r.x0 + (r.bx - r.x0) * k, y = h + (r.by - h) * ease(k);
          const k2 = Math.max(0, k - 0.12), x2 = r.x0 + (r.bx - r.x0) * k2, y2 = h + (r.by - h) * ease(k2);
          ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(255,226,150,.9)'; ctx.lineWidth = 3.2; ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x, y); ctx.stroke();
          ctx.fillStyle = '#fff6d8'; ctx.beginPath(); ctx.arc(x, y, 3.4, 0, Math.PI * 2); ctx.fill();
          r.state = 'fly';
          continue;
        }
        if (r.state !== 'burst') {
          r.state = 'burst'; r.flash = 1;
          const n = r.kind === 'ring' ? 90 : r.kind === 'willow' ? 110 : (big ? 210 : 170);
          r.sparks = Array.from({ length: n }, (_, i) => {
            const a = r.kind === 'ring' ? (i / n) * Math.PI * 2 : Math.random() * Math.PI * 2;
            let sp;
            if (r.kind === 'ring') sp = r.R * 1.6;
            else if (r.kind === 'willow') sp = r.R * rnd(0.5, 1.3);
            else sp = r.R * 1.7 * Math.sqrt(Math.random());          // a full sphere, denser at the edge
            const inner = r.kind === 'peony' && sp < r.R * 0.8;
            return {
              x: r.bx, y: r.by, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, age: 0, trail: [],
              life: r.kind === 'willow' ? rnd(1.9, 2.6) : rnd(1.3, 2.1), c: r.kind === 'willow' ? '#ffcf5a' : inner ? r.c2 : r.c,
              glitter: Math.random() < 0.35, grav: r.kind === 'willow' ? 190 : 120,
            };
          });
        }
        // the flash of the shell going off
        if (r.flash > 0) {
          const g = ctx.createRadialGradient(r.bx, r.by, 0, r.bx, r.by, r.R * 0.7);
          g.addColorStop(0, `rgba(255,250,235,${0.85 * r.flash})`); g.addColorStop(1, 'rgba(255,250,235,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(r.bx, r.by, r.R * 0.7, 0, Math.PI * 2); ctx.fill();
          r.flash = Math.max(0, r.flash - dt * 5);
        }
        let any = false;
        for (const s of r.sparks) {
          s.age += dt;
          if (s.age > s.life) continue;
          any = true;
          const drag = Math.exp(-1.6 * dt);
          s.vx *= drag; s.vy = s.vy * drag + s.grav * dt;
          s.x += s.vx * dt; s.y += s.vy * dt;
          s.trail.push(s.x, s.y); if (s.trail.length > 14) s.trail.splice(0, 2);
          const fade = Math.max(0, 1 - s.age / s.life);
          const twinkle = s.glitter && s.age > s.life * 0.5 ? (Math.random() < 0.5 ? 0.25 : 1) : 1;
          ctx.globalAlpha = Math.min(1, fade * 1.4) * twinkle;
          ctx.strokeStyle = s.c; ctx.lineWidth = 3 * (0.5 + fade * 0.6); ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(s.trail[0], s.trail[1]);
          for (let i = 2; i < s.trail.length; i += 2) ctx.lineTo(s.trail[i], s.trail[i + 1]);
          ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.globalAlpha *= 0.85; ctx.beginPath(); ctx.arc(s.x, s.y, 1.6 + fade * 1.2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
        if (!any) r.state = 'done';
      }
      return alive || shells.some(r => r.state !== 'done' && t >= r.at);
    },
  };
}

// ---- balloons ------------------------------------------------------------------------------

function balloons(w, h, big) {
  const n = big ? 30 : 14;
  const bs = Array.from({ length: n }, () => ({
    at: rnd(0, big ? 1.4 : 0.8), x: rnd(20, w - 20), y: h + 80, vy: h * rnd(0.3, 0.5), r: rnd(20, 32), c: pick(COLOURS.slice(0, 7)), f: rnd(1, 2.4), ph: rnd(0, 6.3), sway: rnd(14, 34),
  }));
  return {
    step(ctx, dt, t) {
      let alive = false;
      for (const b of bs) {
        if (t < b.at) { alive = true; continue; }
        b.y -= b.vy * dt;
        if (b.y < -120) continue;
        alive = true;
        const x = b.x + Math.sin(t * b.f + b.ph) * b.sway, ry = b.r * 1.25;
        ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.4; ctx.beginPath();
        ctx.moveTo(x, b.y + ry); ctx.bezierCurveTo(x - 8, b.y + ry + 18, x + 8, b.y + ry + 34, x, b.y + ry + 52); ctx.stroke();
        ctx.fillStyle = b.c; ctx.beginPath(); ctx.ellipse(x, b.y, b.r, ry, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x, b.y + ry - 1); ctx.lineTo(x - 5, b.y + ry + 7); ctx.lineTo(x + 5, b.y + ry + 7); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.38)'; ctx.beginPath(); ctx.ellipse(x - b.r * 0.35, b.y - ry * 0.35, b.r * 0.2, ry * 0.32, -0.5, 0, Math.PI * 2); ctx.fill();
      }
      return alive;
    },
  };
}

// ---- star shower ---------------------------------------------------------------------------

function star(ctx, x, y, r, rot) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = rot + (i * Math.PI) / 5 - Math.PI / 2, rr = i % 2 ? r * 0.45 : r;
    if (i === 0) ctx.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); else ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath(); ctx.fill();
}

function stars(w, h, big) {
  const n = big ? 100 : 50;
  const ss = Array.from({ length: n }, () => ({
    at: rnd(0, big ? 1.4 : 0.8), x: rnd(0, w), y: -20, vy: h * rnd(0.28, 0.5), r: rnd(7, 17), rot: rnd(0, 6.3), vr: rnd(-2, 2), tw: rnd(4, 9), ph: rnd(0, 6.3),
    c: pick(['#ffd54a', '#ffe98a', '#ffffff', '#ffb020', '#ffd54a']), sway: rnd(6, 24),
  }));
  return {
    step(ctx, dt, t) {
      ctx.globalCompositeOperation = 'lighter';
      let alive = false;
      for (const s of ss) {
        if (t < s.at) { alive = true; continue; }
        s.y += s.vy * dt; s.rot += s.vr * dt;
        if (s.y > h + 40) continue;
        alive = true;
        const x = s.x + Math.sin(t * 1.6 + s.ph) * s.sway, glow = 0.6 + 0.4 * Math.sin(t * s.tw + s.ph);
        ctx.fillStyle = s.c;
        ctx.globalAlpha = 0.16 * glow; ctx.beginPath(); ctx.arc(x, s.y, s.r * 1.9, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 0.5 + 0.5 * glow; star(ctx, x, s.y, s.r * (0.85 + 0.15 * glow), s.rot);
        ctx.globalAlpha = 0.35 * glow; ctx.fillRect(x - 0.7, s.y - s.r * 2.4, 1.4, s.r * 1.8);   // a little glint above
      }
      ctx.globalAlpha = 1;
      return alive;
    },
  };
}

const SIMS = { tape, fireworks, balloons, stars };
