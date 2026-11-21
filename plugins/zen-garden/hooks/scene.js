function rng(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const r = rng(11)
const f = n => Math.round(n * 10) / 10
const LEAF = 'M0 0 C 18 -10 62 -10 98 2 C 62 12 18 10 0 0 Z'
const leaf = (x, y, a, s, cls) =>
  `<path d="${LEAF}" class="${cls}" transform="translate(${f(x)} ${f(y)}) rotate(${f(a)}) scale(${f(s)})"/>`

// A bamboo stalk with nodes and leaf clusters; the whole stalk sways, each cluster flutters.
function bamboo({ x, top, lean, dur, delay, w, far, clusters }) {
  const sc = far ? 'far' : ''
  const out = []
  out.push(`<rect x="${x - w / 2}" y="${top}" width="${w}" height="${940 - top}" rx="${w / 2}" class="stalk ${sc}"/>`)
  out.push(`<rect x="${x - w / 2 + 2.5}" y="${top}" width="3" height="${940 - top}" class="hl ${sc}"/>`)
  for (let y = top + 70 + r() * 40; y < 900; y += 112 + r() * 30) {
    out.push(`<rect x="${x - w / 2 - 3}" y="${f(y)}" width="${w + 6}" height="6" rx="3" class="node ${sc}"/>`)
  }
  for (const cy of clusters) {
    const cl = []
    for (const base of [-35, 10, 60, 120, 170, 215]) {
      cl.push(leaf(x, cy, base + (r() - 0.5) * 24, (far ? 0.75 : 1.15) * (0.8 + r() * 0.45), `leaf ${sc}`))
    }
    out.push(
      `<g class="flutter" style="transform-origin:${x}px ${cy}px;animation-delay:-${f(r() * 5)}s;animation-duration:${f(3 + r() * 2)}s">${cl.join('')}</g>`,
    )
  }
  return `<g class="sway" style="animation-duration:${dur}s;animation-delay:-${delay}s;transform-origin:${x}px 900px"><g transform="rotate(${lean} ${x} 900)">${out.join('')}</g></g>`
}

// A leafy branch reaching in from a corner, drawn in front of the screen.
function branch(p, count, sway) {
  const [p0, p1, p2, p3] = p
  const pt = t => {
    const u = 1 - t
    return [
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ]
  }
  const ang = t => {
    const e = 0.01
    const a = pt(Math.max(0, t - e))
    const b = pt(Math.min(1, t + e))
    return (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI
  }
  const out = [`<path d="M${p0} C${p1} ${p2} ${p3}" class="twig"/>`]
  for (let i = 1; i <= count; i++) {
    const t = i / count
    const [x, y] = pt(t)
    const a = ang(t)
    out.push(leaf(x, y, a + 48 + (r() - 0.5) * 16, 1.5 - t * 0.5, 'leaf2'))
    out.push(leaf(x, y, a - 48 + (r() - 0.5) * 16, 1.4 - t * 0.5, 'leaf2 alt'))
  }
  out.push(leaf(p3[0], p3[1], ang(1), 1.2, 'leaf2'))
  return `<g class="${sway}" style="transform-origin:${p0[0]}px ${p0[1]}px">${out.join('')}</g>`
}

// Shoji: pale paper cells divided by wooden bars.
function shoji() {
  const cells = []
  const bars = []
  for (let col = 0; col < 8; col++) {
    for (let row = 0; row < 6; row++) {
      cells.push(`<rect x="${col * 200 + 4}" y="${row * 150 + 3}" width="192" height="144" class="paper"/>`)
    }
  }
  for (let x = 0; x <= 1600; x += 200) {
    bars.push(`<rect x="${x - 4}" y="0" width="8" height="900" class="wood"/>`)
    bars.push(`<rect x="${x - 4}" y="0" width="2" height="900" class="woodhl"/>`)
  }
  for (let y = 0; y <= 900; y += 150) {
    bars.push(`<rect x="0" y="${y - 3}" width="1600" height="6" class="wood"/>`)
    bars.push(`<rect x="0" y="${y - 3}" width="1600" height="1.6" class="woodhl"/>`)
  }
  return { cells: cells.join(''), bars: bars.join('') }
}

function wave(y, amp, period, i, dur) {
  const n = Math.ceil(2200 / (period / 2))
  const d = `M-300 ${y} q${period / 4} ${-amp} ${period / 2} 0` + ` t${period / 2} 0`.repeat(n)
  return {
    path: `<path d="${d}" class="wave" style="animation:w${i} ${dur}s linear infinite"/>`,
    css: `@keyframes w${i}{to{transform:translateX(-${period}px)}}`,
  }
}

function koi(y, dir, dur, delay, body, scale) {
  const flip = dir < 0 ? 'scale(-1 1)' : ''
  return (
    `<g transform="translate(0 ${y}) scale(${scale})"><g class="${dir > 0 ? 'koiR' : 'koiL'}" style="animation-duration:${dur}s;animation-delay:-${delay}s"><g transform="${flip}">` +
    `<g class="tail" style="transform-origin:-48px -2px"><path d="M-46 -2 C -70 -16 -86 -16 -100 -24 C -90 -8 -90 6 -100 20 C -86 16 -70 10 -46 -2 Z" class="${body}"/></g>` +
    `<path d="M60 0 C 42 -17 -10 -17 -50 -2 C -10 15 42 15 60 0 Z" class="${body}"/>` +
    `<ellipse cx="6" cy="-4" rx="22" ry="6" class="koispot"/>` +
    `<path d="M14 -10 C 24 -22 34 -22 38 -26 C 36 -14 30 -8 22 -6 Z" class="${body} fin"/>` +
    `<path d="M14 9 C 24 20 34 20 38 24 C 36 12 30 8 22 6 Z" class="${body} fin"/>` +
    `<circle cx="46" cy="-5" r="2" class="eye"/></g></g></g>`
  )
}

function build() {
  const { cells, bars } = shoji()
  const waves = [wave(792, 7, 220, 0, 14), wave(826, 9, 300, 1, 20), wave(866, 11, 380, 2, 28)]

  const bamboos = [
    bamboo({ x: 520, top: 110, lean: 2, dur: 9, delay: 3, w: 15, far: true, clusters: [140, 260, 380] }),
    bamboo({ x: 800, top: 230, lean: -2, dur: 10, delay: 6, w: 14, far: true, clusters: [250, 360] }),
    bamboo({ x: 1040, top: 150, lean: 3, dur: 8.5, delay: 1, w: 15, far: true, clusters: [170, 290, 410] }),
    bamboo({ x: 1230, top: 280, lean: -3, dur: 9.5, delay: 4, w: 14, far: true, clusters: [300, 420] }),
    bamboo({ x: 300, top: -40, lean: -2.5, dur: 7.5, delay: 2, w: 26, far: false, clusters: [60, 190, 330, 470] }),
    bamboo({ x: 392, top: 90, lean: 3, dur: 8, delay: 5, w: 20, far: false, clusters: [120, 240, 370] }),
    bamboo({ x: 1318, top: -40, lean: 2.5, dur: 7.8, delay: 7, w: 26, far: false, clusters: [80, 210, 350, 490] }),
    bamboo({ x: 1405, top: 120, lean: -3, dur: 8.2, delay: 3, w: 20, far: false, clusters: [150, 270, 400] }),
  ].join('')

  const fireflies = []
  for (let i = 0; i < 18; i++) {
    const x = 230 + r() * 1140
    const y = 160 + r() * 620
    fireflies.push(
      `<g transform="translate(${f(x)} ${f(y)})"><g class="ff" style="animation-duration:${f(7 + r() * 8)}s;animation-delay:-${f(r() * 12)}s"><circle r="11" class="ffg"/><circle r="2.8" class="ffc"/></g></g>`,
    )
  }

  const blown = []
  for (let i = 0; i < 6; i++) {
    blown.push(
      `<g transform="translate(0 ${f(120 + r() * 520)})"><g class="blow" style="animation-duration:${f(15 + r() * 10)}s;animation-delay:-${f(r() * 20)}s">${leaf(0, 0, 0, 0.3 + r() * 0.15, 'leaf2')}</g></g>`,
    )
  }

  const winds = [
    [60, 250, 7.5, 0],
    [-100, 410, 9, 3],
    [140, 560, 8, 5],
    [-40, 170, 10, 2],
    [300, 690, 8.5, 6],
  ]
    .map(
      ([x, y, dur, delay]) =>
        `<path pathLength="1000" class="wind" d="M${x} ${y} C ${x + 220} ${y - 44} ${x + 440} ${y + 36} ${x + 680} ${y} S ${x + 960} ${y - 34} ${x + 1180} ${y - 6} c 34 -10 44 -44 14 -52" style="animation-duration:${dur}s;animation-delay:-${delay}s"/>`,
    )
    .join('')

  const css = `
:root{--b0:#0b110c;--b1:#16241a;--moon:#f3eed2;--glow:#d7c77f;--paper:#f2ecd2;--paperop:.09;--dim:#040704;--dimop:.5;--wood:#0f0a06;--woodop:.88;--woodhl:#b09a63;--stalk:#5a8c4d;--stalkfar:#365a31;--hl:#9cc98a;--node:#3f6b38;--leaf:#6aa75b;--leaffar:#33602f;--leaf2:#8cc572;--leaf2b:#6fae5e;--twig:#4a6e3b;--wave:#a6d9cc;--w0:#1e4a45;--w1:#0f2624;--pad:#4f8a52;--pad2:#78b377;--vig:#0a0f0b;--rip:#a9ddd0}
@media (prefers-color-scheme: light){:root{--b0:#f6f0de;--b1:#e3d9bb;--moon:#fff3c4;--glow:#f7eab9;--paper:#fffaf0;--paperop:.4;--dim:#000;--dimop:0;--wood:#7d6a44;--woodop:.7;--woodhl:#fff7e0;--stalk:#7da36d;--stalkfar:#a8c39a;--hl:#c7dcb9;--node:#648c58;--leaf:#6c9d5e;--leaffar:#a6c196;--leaf2:#5a8b4f;--leaf2b:#4d7c44;--twig:#6a8a5a;--wave:#5d9c92;--w0:#bcd8cd;--w1:#9ec3b8;--pad:#6a9a60;--pad2:#8bb77d;--vig:#f6f0de;--rip:#4e8b82}}
.s-b0{stop-color:var(--b0)}.s-b1{stop-color:var(--b1)}.s-glow{stop-color:var(--glow)}.s-moon{stop-color:var(--moon)}.s-w0{stop-color:var(--w0)}.s-w1{stop-color:var(--w1)}.s-vig{stop-color:var(--vig)}
.moon{fill:var(--moon);opacity:.7}.dim{fill:var(--dim);opacity:var(--dimop)}
.paper{fill:var(--paper);opacity:var(--paperop)}
.wood{fill:var(--wood);opacity:var(--woodop)}.woodhl{fill:var(--woodhl);opacity:.3}
.stalk{fill:var(--stalk);opacity:.95}.stalk.far{fill:var(--stalkfar);opacity:.8}
.hl{fill:var(--hl);opacity:.45}.hl.far{opacity:.18}
.node{fill:var(--node);opacity:.95}.node.far{opacity:.6}
.leaf{fill:var(--leaf);opacity:.92}.leaf.far{fill:var(--leaffar);opacity:.8}
.leaf2{fill:var(--leaf2);opacity:.95}.leaf2.alt{fill:var(--leaf2b)}
.twig{fill:none;stroke:var(--twig);stroke-width:5;stroke-linecap:round}
.wave{fill:none;stroke:var(--wave);stroke-width:2.4;opacity:.55}
.pad{fill:var(--pad)}.pad2{fill:var(--pad2);opacity:.6}
.pet{fill:#f1c4cf}.pet2{fill:#fbe3e8}.core{fill:#e6c15a}
.ring{fill:none;stroke:var(--rip);stroke-width:2;opacity:0;animation:ring 8s ease-out infinite}
.koio{fill:#ee8a3c}.koiw{fill:#f4efe0}.koispot{fill:#fff5e6;opacity:.8}.fin{opacity:.8}.eye{fill:#1b140c}
.wind{fill:none;stroke:#fffbe8;stroke-width:2;stroke-linecap:round;opacity:.16;stroke-dasharray:240 1000;animation:wind 8s linear infinite}
.ffc{fill:#fff4a8}.ffg{fill:#e9dc7a;opacity:.22}
.sway{animation:sway 8s ease-in-out infinite alternate}.sway2{animation:sway2 10s ease-in-out infinite alternate}.swayb{animation:swayb 11s ease-in-out infinite alternate}
.flutter{animation:flutter 4s ease-in-out infinite alternate}
.tail{animation:tail 1.4s ease-in-out infinite alternate}
.koiR{animation:koiR 48s linear infinite}.koiL{animation:koiL 56s linear infinite}
.ff{animation:ff 10s ease-in-out infinite}
.blow{animation:blow 20s linear infinite}
@keyframes sway{from{transform:rotate(-1.8deg)}to{transform:rotate(2deg)}}
@keyframes sway2{from{transform:rotate(-2.5deg)}to{transform:rotate(3deg)}}
@keyframes swayb{from{transform:rotate(2.5deg)}to{transform:rotate(-3deg)}}
@keyframes flutter{from{transform:rotate(-5deg)}to{transform:rotate(5deg)}}
@keyframes tail{from{transform:rotate(-9deg)}to{transform:rotate(9deg)}}
@keyframes koiR{from{transform:translateX(-300px)}to{transform:translateX(1900px)}}
@keyframes koiL{from{transform:translateX(1900px)}to{transform:translateX(-300px)}}
@keyframes ring{0%{transform:scale(.12);opacity:.65}100%{transform:scale(1.4);opacity:0}}
@keyframes wind{from{stroke-dashoffset:170}to{stroke-dashoffset:-1000}}
@keyframes ff{0%,100%{transform:translate(0,0);opacity:.1}25%{transform:translate(26px,-34px);opacity:1}50%{transform:translate(-18px,-64px);opacity:.35}75%{transform:translate(14px,-30px);opacity:1}}
@keyframes blow{0%{transform:translate(-140px,0) rotate(0)}25%{transform:translate(380px,-50px) rotate(120deg)}50%{transform:translate(800px,30px) rotate(260deg)}75%{transform:translate(1250px,-40px) rotate(400deg)}100%{transform:translate(1760px,40px) rotate(540deg)}}
${waves.map(w => w.css).join('')}
@media (prefers-reduced-motion: reduce){.ring{opacity:.3;transform:scale(.7)}.wind{opacity:.25}}
`

  const ring = (cx, cy, delay) =>
    [0, 1, 2]
      .map(
        i =>
          `<ellipse cx="${cx}" cy="${cy}" rx="150" ry="22" class="ring" style="transform-origin:${cx}px ${cy}px;animation-delay:-${f(delay + i * 2.7)}s"/>`,
      )
      .join('')

  const lotus = (x, y) =>
    `<g transform="translate(${x} ${y})">${[-60, -30, 0, 30, 60].map(a => `<ellipse cx="0" cy="-13" rx="6" ry="14" class="pet" transform="rotate(${a})"/>`).join('')}${[-30, 0, 30].map(a => `<ellipse cx="0" cy="-10" rx="4.5" ry="10" class="pet2" transform="rotate(${a})"/>`).join('')}<circle cy="-4" r="4" class="core"/></g>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<style>${css}</style>
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="s-b0"/><stop offset="1" class="s-b1"/></linearGradient>
<radialGradient id="moonglow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" class="s-moon" stop-opacity="0.55"/><stop offset="0.35" class="s-glow" stop-opacity="0.22"/><stop offset="1" class="s-glow" stop-opacity="0"/></radialGradient>
<radialGradient id="lamp" cx="0.5" cy="0.5" r="0.5"><stop offset="0" class="s-glow" stop-opacity="0.34"/><stop offset="1" class="s-glow" stop-opacity="0"/></radialGradient>
<linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="s-w0" stop-opacity="0"/><stop offset="0.3" class="s-w0" stop-opacity="0.8"/><stop offset="1" class="s-w1" stop-opacity="0.96"/></linearGradient>
<radialGradient id="vig" cx="0.5" cy="0.45" r="0.62"><stop offset="0" class="s-vig" stop-opacity="0.62"/><stop offset="0.55" class="s-vig" stop-opacity="0.36"/><stop offset="1" class="s-vig" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="900" fill="url(#sky)"/>
<circle cx="1160" cy="210" r="300" fill="url(#moonglow)"/>
<circle cx="1160" cy="210" r="62" class="moon"/>
<circle cx="360" cy="640" r="340" fill="url(#lamp)"/>
${bamboos}
${cells}
${winds}
${bars}
<rect width="1600" height="900" fill="url(#vig)"/>
<rect y="740" width="1600" height="160" fill="url(#water)"/>
${waves.map(w => w.path).join('')}
${ring(520, 842, 0)}${ring(1080, 856, 3.4)}${ring(1300, 826, 5.9)}
<ellipse cx="520" cy="842" rx="40" ry="11" class="pad"/><ellipse cx="514" cy="840" rx="22" ry="5" class="pad2"/>
<ellipse cx="1080" cy="856" rx="46" ry="12" class="pad"/><ellipse cx="1072" cy="853" rx="26" ry="5" class="pad2"/>
<ellipse cx="1300" cy="826" rx="34" ry="9" class="pad"/>
${lotus(1084, 846)}${lotus(524, 834)}
${koi(852, 1, 48, 8, 'koio', 0.85)}
${koi(812, -1, 56, 26, 'koiw', 0.7)}
${branch([[150, -30], [300, 20], [450, 30], [600, 170]], 9, 'sway2')}
${branch([[1450, -30], [1300, 30], [1150, 40], [1000, 190]], 9, 'swayb')}
${winds}
${blown.join('')}
${fireflies.join('')}
<rect width="1600" height="900" class="dim"/>
</svg>`
}

export const SCENE = build()
