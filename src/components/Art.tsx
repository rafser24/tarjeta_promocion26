import type { CSSProperties } from 'react'

/* ---------- utilidades ---------- */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const gauss = (r: () => number) => (r() + r() + r() + r() - 2) / 2

/* ---------- gradientes compartidos (van una sola vez dentro de la tarjeta) ---------- */
export function GoldDefs() {
  const stop = (o: number, v: string) => <stop offset={o} style={{ stopColor: `var(${v})` }} />
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          {stop(0, '--gold-300')}{stop(0.5, '--gold-500')}{stop(1, '--gold-700')}
        </linearGradient>
        <linearGradient id="goldFlat" x1="0" y1="0" x2="1" y2="0">
          {stop(0, '--gold-500')}{stop(0.5, '--gold-300')}{stop(1, '--gold-500')}
        </linearGradient>
        <linearGradient id="goldCrown" x1="0" y1="0" x2="1" y2="0">
          {stop(0, '--gold-700')}{stop(0.3, '--gold-300')}{stop(0.65, '--gold-500')}{stop(1, '--gold-700')}
        </linearGradient>
        <linearGradient id="goldTop" x1="0" y1="0" x2="1" y2="1">
          {stop(0, '--gold-300')}{stop(0.55, '--gold-500')}{stop(1, '--gold-700')}
        </linearGradient>
        <linearGradient id="paperRoll" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffaf0" /><stop offset="0.6" stopColor="#f1e3c8" /><stop offset="1" stopColor="#d9c39b" />
        </linearGradient>
        <linearGradient id="ribbon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6C25A" /><stop offset="1" stopColor="#D98A1F" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/* ---------- birrete ---------- */
function CapShapes() {
  return (
    <g>
      {/* copa */}
      <path d="M60 80 C57 132 68 164 142 172 C214 174 232 138 227 76 Z" fill="url(#goldCrown)" />
      <path d="M62 124 C90 146 190 150 226 124" fill="none" stroke="var(--gold-700)" strokeOpacity=".35" strokeWidth="2" />
      {/* grosor del tablero */}
      <path d="M10 66 L128 112 L292 62 L292 71 L128 122 L10 75 Z" fill="var(--gold-700)" />
      {/* cara superior */}
      <path d="M10 66 L174 26 L292 62 L128 112 Z" fill="url(#goldTop)" />
      <path d="M10 66 L174 26 L232 44 L70 90 Z" fill="#fff" fillOpacity=".16" />
      <path d="M10 66 L174 26 L292 62 L128 112 Z" fill="none" stroke="var(--gold-300)" strokeOpacity=".7" strokeWidth="1" />
      {/* botón y cordón */}
      <ellipse cx="150" cy="70" rx="8" ry="4.6" fill="var(--gold-700)" />
      <ellipse cx="150" cy="68.6" rx="6.5" ry="3.6" fill="var(--gold-300)" />
      <path d="M150 70 Q226 78 286 63" fill="none" stroke="var(--gold-300)" strokeWidth="2.2" strokeDasharray="2.2 2.4" />
      {/* borla */}
      <rect x="284" y="63" width="3.4" height="62" fill="var(--gold-500)" />
      <path d="M277 124 H295 L298 172 Q286 178 274 172 Z" fill="url(#goldCrown)" />
      {[279, 283, 287, 291].map((x) => (
        <line key={x} x1={x} y1="128" x2={x + (x - 285) * 0.2} y2="172" stroke="var(--gold-700)" strokeOpacity=".5" />
      ))}
      <rect x="276" y="121" width="20" height="6" rx="3" fill="var(--gold-300)" />
    </g>
  )
}

export function Cap({ style, className }: { style?: CSSProperties; className?: string }) {
  return (
    <svg viewBox="0 0 310 184" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible', ...style }} className={className} aria-hidden>
      <CapShapes />
    </svg>
  )
}

export function CapDiploma({ style }: { style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 340 250" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible', ...style }} aria-hidden>
      <g transform="translate(40,0) scale(.9)"><CapShapes /></g>
      <g transform="translate(6,150) rotate(-9 100 30)">
        <rect x="14" y="10" width="205" height="44" rx="22" fill="url(#paperRoll)" />
        <ellipse cx="22" cy="32" rx="12" ry="22" fill="#e9d7b3" stroke="#c9b283" strokeWidth="1.5" />
        <ellipse cx="22" cy="32" rx="5" ry="13" fill="none" stroke="#c9b283" strokeWidth="1.2" />
        <ellipse cx="214" cy="32" rx="9" ry="22" fill="#f4e8cf" stroke="#d3be93" strokeWidth="1.2" />
      </g>
      {/* moño */}
      <g transform="translate(96,178) rotate(-9)">
        <path d="M0 0 C-30 -26 -46 -6 -34 12 C-26 22 -10 12 0 0Z" fill="url(#ribbon)" stroke="#B9731A" strokeWidth="1" />
        <path d="M0 0 C30 -26 46 -6 34 12 C26 22 10 12 0 0Z" fill="url(#ribbon)" stroke="#B9731A" strokeWidth="1" />
        <path d="M-2 4 L-26 44 L-12 40 L-2 52 L6 12Z" fill="url(#ribbon)" stroke="#B9731A" strokeWidth="1" />
        <path d="M4 4 L28 40 L14 38 L8 52 L-2 12Z" fill="url(#ribbon)" stroke="#B9731A" strokeWidth="1" />
        <rect x="-8" y="-7" width="16" height="16" rx="5" fill="#F0B545" stroke="#B9731A" strokeWidth="1" />
      </g>
    </svg>
  )
}

/* ---------- acuarela marino + polvo de oro ---------- */
const GLITTER = (() => {
  const r = mulberry32(7)
  return Array.from({ length: 900 }, () => {
    const x = r() * 400
    const edge = 44 + Math.sin(x / 38) * 6
    const y = edge + 8 + gauss(r) * 26
    return { x, y, r: 0.35 + Math.pow(r(), 3) * 2.8, o: 0.4 + r() * 0.6 }
  })
})()
const SPECK = (() => {
  const r = mulberry32(21)
  return Array.from({ length: 70 }, () => ({ x: r() * 400, y: 8 + r() * 36, r: 0.4 + r() * 1, o: 0.2 + r() * 0.5 }))
})()

export function Watercolor({ flip, style }: { flip?: boolean; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 400 130" preserveAspectRatio="none" aria-hidden
      style={{ width: '100%', height: '100%', display: 'block', transform: flip ? 'scaleY(-1)' : undefined, ...style }}>
      <defs>
        <filter id="wcRough" x="-10%" y="-10%" width="120%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.05" numOctaves="3" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="26" />
        </filter>
        <filter id="wcBlur6"><feGaussianBlur stdDeviation="8" /></filter>
        <filter id="wcBlur14"><feGaussianBlur stdDeviation="14" /></filter>
        <linearGradient id="wcFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" /><stop offset=".72" stopColor="#fff" /><stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id="wcMask"><rect width="400" height="130" fill="url(#wcFade)" /></mask>
      </defs>
      <g mask="url(#wcMask)">
        {/* nubes doradas difusas */}
        <g filter="url(#wcBlur14)" opacity=".8">
          <ellipse cx="60" cy="68" rx="70" ry="16" fill="var(--gold-500)" />
          <ellipse cx="220" cy="74" rx="90" ry="15" fill="var(--gold-300)" />
          <ellipse cx="350" cy="66" rx="70" ry="17" fill="var(--gold-500)" />
        </g>
        {/* azul marino con borde irregular */}
        <g filter="url(#wcRough)">
          <path d="M-30 -30 H430 V44 C395 62 365 40 330 56 S262 44 226 60 S150 40 112 58 S40 44 -2 56 S-30 50 -30 50 Z" fill="var(--navy)" />
          <path d="M-30 20 H430 V30 C380 40 340 22 300 36 S210 24 170 38 S80 24 40 36 S-10 30 -30 30Z" fill="#fff" fillOpacity=".05" />
        </g>
        {/* banda dorada */}
        <g filter="url(#wcBlur6)">
          <path d="M-20 52 C30 38 70 60 120 50 S210 44 250 56 S340 46 420 54" fill="none" stroke="url(#goldFlat)" strokeWidth="16" strokeOpacity=".6" />
        </g>
        <path d="M-20 49 C30 36 70 56 120 47 S210 41 250 53 S340 43 420 51" fill="none" stroke="var(--gold-300)" strokeWidth="2.4" strokeOpacity=".7" filter="url(#wcBlur6)" />
        {/* polvo de oro */}
        {GLITTER.map((g, i) => (
          <circle key={i} cx={g.x} cy={g.y} r={g.r} fill="url(#gold)" opacity={g.o} />
        ))}
        {SPECK.map((g, i) => (
          <circle key={`s${i}`} cx={g.x} cy={g.y} r={g.r} fill="var(--gold-300)" opacity={g.o} />
        ))}
        {/* bruma blanca hacia el papel */}
        <g filter="url(#wcBlur14)" fill="var(--paper)">
          <ellipse cx="40" cy="104" rx="80" ry="18" opacity=".95" />
          <ellipse cx="190" cy="108" rx="110" ry="20" opacity=".98" />
          <ellipse cx="340" cy="102" rx="90" ry="18" opacity=".95" />
        </g>
      </g>
    </svg>
  )
}

/* ---------- laurel ---------- */
function bez(t: number, p: number[][]) {
  const u = 1 - t
  const x = u ** 3 * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t ** 3 * p[3][0]
  const y = u ** 3 * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t ** 3 * p[3][1]
  const dx = 3 * u * u * (p[1][0] - p[0][0]) + 6 * u * t * (p[2][0] - p[1][0]) + 3 * t * t * (p[3][0] - p[2][0])
  const dy = 3 * u * u * (p[1][1] - p[0][1]) + 6 * u * t * (p[2][1] - p[1][1]) + 3 * t * t * (p[3][1] - p[2][1])
  return { x, y, a: (Math.atan2(dy, dx) * 180) / Math.PI }
}
/* Rama de laurel abierta, en forma de "(" : nace abajo y las hojas crecen hacia la punta (arriba). */
const BRANCH_CURVE = [[47, 82], [5, 64], [1, 26], [37, 5]]

function LaurelBranchShape() {
  const n = 9
  const leaves = Array.from({ length: n }, (_, i) => ({ ...bez(0.1 + (i / (n - 1)) * 0.78, BRANCH_CURVE), k: i / (n - 1) }))
  const tip = bez(0.99, BRANCH_CURVE)
  const leaf = 'M0 0 C4 -3 11 -3 17 0 C11 3 4 3 0 0Z'
  return (
    <g>
      <path d={`M${BRANCH_CURVE[0]} C${BRANCH_CURVE[1]} ${BRANCH_CURVE[2]} ${BRANCH_CURVE[3]}`} fill="none" stroke="url(#gold)" strokeWidth="1.5" strokeLinecap="round" />
      {leaves.map((l, i) => {
        const sc = 0.62 + Math.sin(l.k * Math.PI * 0.85 + 0.3) * 0.28
        return [-1, 1].map((side) => (
          <g key={`${i}${side}`} transform={`translate(${l.x} ${l.y}) rotate(${l.a + side * 50}) scale(${sc})`}>
            <path d={leaf} fill="url(#gold)" stroke="var(--gold-700)" strokeWidth=".4" strokeOpacity=".5" />
          </g>
        ))
      })}
      <g transform={`translate(${tip.x} ${tip.y}) rotate(${tip.a}) scale(.62)`}>
        <path d={leaf} fill="url(#gold)" stroke="var(--gold-700)" strokeWidth=".4" strokeOpacity=".5" />
      </g>
    </g>
  )
}

export function LaurelBranch({ flip, style }: { flip?: boolean; style?: CSSProperties }) {
  return (
    <svg viewBox="-2 -4 66 90" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined, ...style }} aria-hidden>
      <LaurelBranchShape />
    </svg>
  )
}

/* ---------- destellos dorados (adorno lateral de los textos) ---------- */
const star = (cx: number, cy: number, r: number) =>
  `M${cx} ${cy - r} Q${cx} ${cy} ${cx + r} ${cy} Q${cx} ${cy} ${cx} ${cy + r} Q${cx} ${cy} ${cx - r} ${cy} Q${cx} ${cy} ${cx} ${cy - r}Z`

export function Sparkles({ flip, style }: { flip?: boolean; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 44 70" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined, ...style }} aria-hidden>
      <path d={star(24, 24, 15)} fill="url(#gold)" />
      <path d={star(24, 24, 15)} fill="none" stroke="var(--gold-700)" strokeWidth=".4" strokeOpacity=".5" />
      <path d={star(9, 55, 7)} fill="url(#gold)" />
      <path d={star(35, 58, 4.5)} fill="url(#gold)" />
      <circle cx="37" cy="8" r="1.7" fill="var(--gold-500)" />
      <circle cx="6" cy="31" r="1.2" fill="var(--gold-300)" />
      <circle cx="22" cy="66" r="1.2" fill="var(--gold-500)" opacity=".8" />
    </svg>
  )
}

/* ---------- divisor ---------- */
export function Divider({ style }: { style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 140 12" style={{ width: '100%', height: 'auto', display: 'block', ...style }} aria-hidden>
      <path d="M0 6 H56 M84 6 H140" stroke="var(--gold-500)" strokeWidth="1" />
      <path d="M70 1.5 L75.5 6 L70 10.5 L64.5 6Z" fill="none" stroke="var(--gold-500)" strokeWidth="1" />
      <circle cx="70" cy="6" r="1.3" fill="var(--gold-500)" />
      <path d="M60 6 l2.2 -2.2 l2.2 2.2 l-2.2 2.2z M75.6 6 l2.2 -2.2 l2.2 2.2 l-2.2 2.2z" fill="var(--gold-500)" />
    </svg>
  )
}

/* ---------- fondo azul texturizado (portada y cierre) ---------- */
export function NavyPaper() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--navy)', overflow: 'hidden' }} aria-hidden>
      <svg width="100%" height="100%" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
        <filter id="paperTex" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="3" result="n" />
          <feDiffuseLighting in="n" lightingColor="#b6c6ee" surfaceScale="2.2" diffuseConstant="1">
            <feDistantLight azimuth="50" elevation="58" />
          </feDiffuseLighting>
        </filter>
        <rect width="100%" height="100%" filter="url(#paperTex)" opacity=".22" style={{ mixBlendMode: 'soft-light' }} />
        <rect width="100%" height="100%" filter="url(#paperTex)" opacity=".1" style={{ mixBlendMode: 'overlay' }} />
      </svg>
      {/* pliegues verticales */}
      {['24%', '74%'].map((l) => (
        <div key={l} style={{ position: 'absolute', top: 0, bottom: 0, left: l, width: '1.1cqw',
          background: 'linear-gradient(90deg, rgba(0,0,0,.45), rgba(0,0,0,.12) 35%, rgba(255,255,255,.05))' }} />
      ))}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, rgba(255,255,255,.05), rgba(0,0,0,.28))' }} />
    </div>
  )
}
