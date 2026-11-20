import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Invitation } from './Invitation'
import { DEFAULT_CONFIG, THEMES, encodeConfig, type CardConfig } from '../lib/config'
import { useCard } from '../store'

const input = 'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200'

function Field({ label, max, value, children }: { label: string; max?: number; value?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 flex justify-between text-xs font-medium text-slate-600">
        <span>{label}</span>
        {max ? <span className={value && value.length > max * 0.9 ? 'text-amber-700' : ''}>{value?.length ?? 0}/{max}</span> : null}
      </span>
      {children}
    </label>
  )
}

function Section({ title, children, open = false }: { title: string; children: ReactNode; open?: boolean }) {
  return (
    <details open={open} className="rounded-lg border border-slate-200 bg-white">
      <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-slate-800">{title}</summary>
      <div className="space-y-3 border-t border-slate-100 p-4">{children}</div>
    </details>
  )
}

function load(key: string, fallback: string) {
  try { return localStorage.getItem(key) ?? fallback } catch { return fallback }
}
function save(key: string, v: string) {
  try { localStorage.setItem(key, v) } catch { /* almacenamiento no disponible */ }
}

/** Enlaces cortos y personalizados: https://sitio/?para=Familia%20P%C3%A9rez */
function GuestLinks({ config }: { config: CardConfig }) {
  const [base, setBase] = useState(() => load('tarjeta-base-url', `${location.origin}${location.pathname}`))
  const [raw, setRaw] = useState(() => load('tarjeta-guests', ''))
  const [copied, setCopied] = useState('')
  const guests = raw.split('\n').map((x) => x.trim().slice(0, 60)).filter(Boolean).slice(0, 300)
  const custom = JSON.stringify(config) !== JSON.stringify(DEFAULT_CONFIG)

  const urlFor = (name: string) => {
    const b = base.trim() || `${location.origin}${location.pathname}`
    return `${b}?para=${encodeURIComponent(name)}${custom ? `&c=${encodeConfig(config)}` : ''}`
  }
  const msgFor = (name: string) =>
    `Hola ${name} 🎓\n${config.invite.intro}.\nAbre tu invitación 👇\n${urlFor(name)}`
  const flash = (k: string) => { setCopied(k); setTimeout(() => setCopied(''), 1600) }
  const copy = async (text: string, k: string) => {
    try { await navigator.clipboard.writeText(text); flash(k) } catch { /* copiar manualmente */ }
  }

  return (
    <>
      <Field label="Dirección de la invitación (cuando ya esté publicada)">
        <input className={input} value={base} placeholder="https://promocion2026.vercel.app/"
          onChange={(e) => { setBase(e.target.value); save('tarjeta-base-url', e.target.value) }} />
      </Field>
      <Field label="Invitados (uno por línea, p. ej. “Familia Pérez”)">
        <textarea rows={6} className={input} value={raw}
          onChange={(e) => { setRaw(e.target.value); save('tarjeta-guests', e.target.value) }} />
        <span className="mt-1 block text-xs text-slate-500">{guests.length} invitados · la portada dirá “Para: nombre”</span>
      </Field>
      {custom && (
        <p className="rounded bg-amber-50 p-2 text-xs text-amber-800">
          Hay textos modificados respecto a los valores por defecto, así que los enlaces incluyen toda la configuración y salen largos.
          Cuando termines, copia los cambios a <code>DEFAULT_CONFIG</code> y los enlaces quedarán cortos.
        </p>
      )}
      {guests.length > 0 && (
        <>
          <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white"
            onClick={() => copy(guests.map((g) => `${g}\t${urlFor(g)}`).join('\n'), 'all')}>
            {copied === 'all' ? '¡Copiado!' : 'Copiar lista (nombre → enlace)'}
          </button>
          <ul className="max-h-72 space-y-1 overflow-y-auto">
            {guests.map((g, i) => (
              <li key={i} className="flex items-center gap-2 rounded border border-slate-200 bg-white p-2 text-sm">
                <span className="flex-1 truncate">{g}</span>
                <button className="rounded border border-slate-300 px-2 py-1 text-xs" onClick={() => copy(urlFor(g), `l${i}`)}>
                  {copied === `l${i}` ? '¡Listo!' : 'Enlace'}
                </button>
                <a className="rounded bg-green-600 px-2 py-1 text-xs text-white" target="_blank" rel="noopener noreferrer"
                  href={`https://wa.me/?text=${encodeURIComponent(msgFor(g))}`}>WhatsApp</a>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}

export function Editor() {
  const { config, restart, update, reset, replay } = useCard()
  const [debounced, setDebounced] = useState<CardConfig>(config)
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')
  const [link, setLink] = useState('')
  const [copied, setCopied] = useState(false)
  const first = useRef(true)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(config), 150)
    return () => clearTimeout(t)
  }, [config])
  useEffect(() => { if (first.current) { first.current = false; return } setLink('') }, [config])

  const text = (label: string, get: (c: CardConfig) => string, set: (c: CardConfig, v: string) => void, max = 120, area = false) => (
    <Field label={label} max={max} value={get(config)}>
      {area ? (
        <textarea rows={3} maxLength={max} className={input} value={get(config)} onChange={(e) => update((c) => set(c, e.target.value))} />
      ) : (
        <input maxLength={max} className={input} value={get(config)} onChange={(e) => update((c) => set(c, e.target.value))} />
      )}
    </Field>
  )

  const generate = () => {
    const url = `${location.origin}${location.pathname}?c=${encodeConfig(config)}`
    setLink(url)
    return url
  }
  const copy = async () => {
    const url = link || generate()
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* el usuario puede copiar manualmente */ }
  }
  const whatsapp = () => {
    const url = link || generate()
    const msg = `${config.promo.label} ${config.promo.year}: ${config.invite.eventTitle}. Mira tu invitación 👉 ${url}`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener')
  }

  const dt = config.invite.dateISO.slice(0, 16)

  return (
    <div className="flex min-h-dvh flex-col bg-slate-100 text-slate-900 lg:h-dvh lg:flex-row">
      <div className="flex gap-2 border-b bg-white p-2 lg:hidden">
        {(['edit', 'preview'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 rounded-md py-2 text-sm font-medium ${tab === t ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>
            {t === 'edit' ? 'Editar' : 'Vista previa'}
          </button>
        ))}
      </div>

      <aside className={`${tab === 'edit' ? 'block' : 'hidden'} w-full space-y-3 overflow-y-auto p-4 lg:block lg:w-[460px] lg:shrink-0`}>
        <header className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Editor de invitación</h1>
          <a href="#/" onClick={() => { location.hash = '' }} className="text-xs text-slate-500 underline">Ver tarjeta</a>
        </header>

        <Section title="Textos principales" open>
          {text('Promoción (título)', (c) => c.promo.label, (c, v) => (c.promo.label = v), 24)}
          {text('Año', (c) => c.promo.year, (c, v) => (c.promo.year = v), 8)}
          {text('Lema', (c) => c.promo.motto, (c, v) => (c.promo.motto = v), 40)}
          {text('Institución', (c) => c.promo.school, (c, v) => (c.promo.school = v), 90)}
          {text('Mensaje', (c) => c.promo.message, (c, v) => (c.promo.message = v), 160, true)}
        </Section>

        <Section title="Evento" open>
          {text('Texto de invitación', (c) => c.invite.intro, (c, v) => (c.invite.intro = v), 160, true)}
          {text('Título del evento', (c) => c.invite.eventTitle, (c, v) => (c.invite.eventTitle = v), 50)}
          <Field label="Fecha y hora">
            <input type="datetime-local" className={input} value={dt}
              onChange={(e) => e.target.value && update((c) => (c.invite.dateISO = e.target.value))} />
          </Field>
          {text('Lugar', (c) => c.invite.venue, (c, v) => (c.invite.venue = v), 90)}
          {text('Frase final', (c) => c.invite.closingQuote, (c, v) => (c.invite.closingQuote = v), 100)}
        </Section>

        <Section title="Agenda del evento">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={config.agenda.enabled} onChange={(e) => update((c) => (c.agenda.enabled = e.target.checked))} />
            Mostrar página de agenda
          </label>
          {text('Título', (c) => c.agenda.title, (c, v) => (c.agenda.title = v), 40)}
          <div className="flex gap-3">
            {text('Encabezado hora', (c) => c.agenda.colTime, (c, v) => (c.agenda.colTime = v), 20)}
            {text('Encabezado actividad', (c) => c.agenda.colActivity, (c, v) => (c.agenda.colActivity = v), 30)}
          </div>
          <Field label="Actividades (una por línea: HORA | ACTIVIDAD)">
            <textarea rows={7} className={input + ' font-mono text-xs'}
              defaultValue={config.agenda.items.map((x) => `${x.time} | ${x.activity}`).join('\n')}
              onChange={(e) => {
                const items = e.target.value.split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 12).map((l) => {
                  const k = l.search(/\t|\|/)
                  return k < 0 ? { time: '', activity: l.slice(0, 80) } : { time: l.slice(0, k).trim().slice(0, 14), activity: l.slice(k + 1).trim().slice(0, 80) }
                })
                update((c) => (c.agenda.items = items))
              }} />
            <span className="mt-1 block text-xs text-slate-500">{config.agenda.items.length} actividades · puedes pegar desde Excel (hora, tabulador, actividad)</span>
          </Field>
        </Section>

        <Section title="Nómina de estudiantes">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={config.roster.enabled} onChange={(e) => update((c) => (c.roster.enabled = e.target.checked))} />
            Mostrar página con la nómina
          </label>
          {text('Título', (c) => c.roster.title, (c, v) => (c.roster.title = v), 50)}
          <Field label="Estudiantes (uno por línea: APELLIDOS, NOMBRES)">
            <textarea rows={10} className={input + ' font-mono text-xs'} defaultValue={config.roster.names.join('\n')}
              onChange={(e) => { const v = e.target.value; update((c) => (c.roster.names = v.split('\n').map((x) => x.trim()).filter(Boolean).slice(0, 80))) }} />
            <span className="mt-1 block text-xs text-slate-500">{config.roster.names.length} estudiantes · se numeran automáticamente</span>
          </Field>
        </Section>

        <Section title="Agradecimientos especiales">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={config.thanks.enabled} onChange={(e) => update((c) => (c.thanks.enabled = e.target.checked))} />
            Mostrar página de agradecimientos
          </label>
          {text('Título', (c) => c.thanks.title, (c, v) => (c.thanks.title = v), 80, true)}
          <Field label="Nombres (uno por línea)">
            <textarea rows={5} className={input} defaultValue={config.thanks.names.join('\n')}
              onChange={(e) => { const v = e.target.value; update((c) => (c.thanks.names = v.split('\n').map((x) => x.trim().slice(0, 60)).filter(Boolean).slice(0, 20))) }} />
            <span className="mt-1 block text-xs text-slate-500">{config.thanks.names.length} nombres · aparece después de la nómina</span>
          </Field>
        </Section>

        <Section title="Portada y cierre">
          {text('Texto de portada', (c) => c.cover.tagline, (c, v) => (c.cover.tagline = v), 60)}
          {text('Texto de cierre', (c) => c.cover.closing, (c, v) => (c.cover.closing = v), 60)}
          {text('Aviso “toca para abrir”', (c) => c.cover.tapHint, (c, v) => (c.cover.tapHint = v), 40)}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={config.cover.showLogo} onChange={(e) => update((c) => (c.cover.showLogo = e.target.checked))} />
            Usar el escudo de la institución en la portada (si no, se muestra el birrete)
          </label>
          {text('Nombre del graduado (opcional)', (c) => c.graduate.name, (c, v) => (c.graduate.name = v), 60)}
        </Section>

        <Section title="Tema">
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(THEMES).map(([k, t]) => (
              <button key={k} onClick={() => update((c) => { c.theme.preset = k; c.theme.primary = t.primary; c.theme.accent = t.accent })}
                className={`rounded-md border p-2 text-xs ${config.theme.preset === k ? 'border-amber-600 ring-2 ring-amber-200' : 'border-slate-200'}`}>
                <span className="mb-1 flex h-6 overflow-hidden rounded">
                  <span className="flex-1" style={{ background: t.primary }} /><span className="flex-1" style={{ background: t.accent }} />
                </span>
                {t.name}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <Field label="Color principal">
              <input type="color" className="h-9 w-full" value={config.theme.primary}
                onChange={(e) => update((c) => { c.theme.primary = e.target.value; c.theme.preset = 'custom' })} />
            </Field>
            <Field label="Color de acento">
              <input type="color" className="h-9 w-full" value={config.theme.accent}
                onChange={(e) => update((c) => { c.theme.accent = e.target.value; c.theme.preset = 'custom' })} />
            </Field>
            <Field label="Fondo de las páginas">
              <input type="color" className="h-9 w-full" value={config.theme.paper}
                onChange={(e) => update((c) => (c.theme.paper = e.target.value))} />
            </Field>
          </div>
          <Field label={`Opacidad del fondo: ${Math.round(config.theme.paperOpacity * 100)} %`}>
            <input type="range" min={10} max={100} step={5} className="w-full" value={Math.round(config.theme.paperOpacity * 100)}
              onChange={(e) => update((c) => (c.theme.paperOpacity = Number(e.target.value) / 100))} />
          </Field>
        </Section>

        <Section title="Invitados (WhatsApp, mapa, música)">
          {text('WhatsApp para confirmar (con código de país)', (c) => c.rsvp.whatsapp, (c, v) => (c.rsvp.whatsapp = v), 20)}
          {text('Mensaje de confirmación', (c) => c.rsvp.message, (c, v) => (c.rsvp.message = v), 140)}
          {text('Enlace de Google Maps', (c) => c.invite.mapUrl, (c, v) => (c.invite.mapUrl = v), 500)}
          {text('Música (ruta o URL del mp3; por defecto /musica.mp3)', (c) => c.music.src, (c, v) => (c.music.src = v), 500)}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={config.music.enabled} onChange={(e) => update((c) => (c.music.enabled = e.target.checked))} />
            Reproducir música al abrir
          </label>
        </Section>

        <Section title="Animación y pie de página">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={config.timing.autoAdvance} onChange={(e) => update((c) => (c.timing.autoAdvance = e.target.checked))} />
            Avanzar páginas automáticamente (como en el video)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {([['curtain', 'Apertura de portada (s)'], ['page2At', 'Entra la invitación (s)'], ['inviteStay', 'Permanece la invitación (s)'],
              ['agendaStay', 'Permanece la agenda (s)'], ['rosterStay', 'Permanece la nómina (s)'], ['thanksStay', 'Permanecen los agradecimientos (s)'], ['sweepAfter', 'Barrido dorado tras el cierre (s)']] as const).map(([k, label]) => (
              <Field key={k} label={label}>
                <input type="number" step="0.5" min="0" max="120" className={input} value={config.timing[k]}
                  onChange={(e) => { const v = parseFloat(e.target.value); if (!Number.isNaN(v)) update((c) => (c.timing[k] = v)) }} />
              </Field>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={config.footerBrand.enabled} onChange={(e) => update((c) => (c.footerBrand.enabled = e.target.checked))} />
            Mostrar pantalla final con texto (activa el barrido dorado)
          </label>
          {config.footerBrand.enabled && text('Texto final', (c) => c.footerBrand.text, (c, v) => (c.footerBrand.text = v), 60)}
        </Section>

        <Section title="Enlaces personalizados por invitado">
          <GuestLinks config={config} />
        </Section>

        <section className="space-y-2 rounded-lg border border-amber-300 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold">Compartir</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={generate} className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">Generar enlace</button>
            <button onClick={copy} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">{copied ? '¡Copiado!' : 'Copiar'}</button>
            <button onClick={whatsapp} className="rounded-md bg-green-600 px-3 py-2 text-sm text-white">WhatsApp</button>
          </div>
          {link && <textarea readOnly rows={3} className={input + ' text-xs'} value={link} onFocus={(e) => e.currentTarget.select()} />}
          <button onClick={() => { if (confirm('¿Restablecer todos los textos a los valores originales?')) reset() }}
            className="text-xs text-slate-500 underline">Restablecer valores originales</button>
        </section>
      </aside>

      <main className={`${tab === 'preview' ? 'flex' : 'hidden'} flex-1 flex-col items-center justify-center gap-3 p-4 lg:flex`}>
        <div className="overflow-hidden rounded-[36px] border-[10px] border-slate-900 shadow-2xl"
          style={{ width: 'min(340px, 80vw, calc((100dvh - 90px) * 9 / 16))', aspectRatio: '9 / 16' }}>
          <Invitation config={debounced} restart={restart} />
        </div>
        <button onClick={replay} className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white">▶ Reproducir desde el inicio</button>
      </main>
    </div>
  )
}
