import {
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  Check,
  Menu,
  MessageCircle,
  Network,
  Radio,
  ShieldCheck,
  Sparkles,
  Workflow,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { WHATSAPP_URL } from '@/lib/contact'
import NeuralField from '@/components/NeuralField'

const capabilities = [
  {
    id: '01',
    title: 'Automatizamos lo repetitivo',
    detail: 'Conectamos los pasos que hoy dependen de mensajes, hojas de cálculo y seguimiento manual.',
    icon: Workflow,
  },
  {
    id: '02',
    title: 'Construimos herramientas propias',
    detail: 'Diseñamos plataformas web y sistemas a medida alrededor de cómo realmente trabaja tu equipo.',
    icon: Network,
  },
  {
    id: '03',
    title: 'Integramos IA con criterio',
    detail: 'Creamos asistentes y flujos inteligentes que usan tu información, canales y reglas de negocio.',
    icon: Sparkles,
  },
]

const process = [
  ['01', 'Entendemos la operación', 'Identificamos el cuello de botella y la oportunidad de mayor impacto.'],
  ['02', 'Diseñamos una ruta clara', 'Definimos alcance, prioridades y una primera versión útil.'],
  ['03', 'Construimos y mejoramos', 'Implementamos, medimos y seguimos afinando con tu equipo.'],
]

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0e0f10] text-[#e9ecef] selection:bg-[#a5e7ff] selection:text-[#071216]">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[100] focus:rounded-sm focus:bg-[#a5e7ff] focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-[#071216]">
        Saltar al contenido
      </a>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center pt-2 md:pt-2">
        <nav className="pointer-events-auto flex w-[calc(100%-3rem)] max-w-[1440px] items-center justify-between rounded-full border border-[#3c494e]/30 bg-[#0e0e0e]/60 px-6 py-4 shadow-[0_0_20px_rgba(71,214,255,.1)] backdrop-blur-xl md:w-[calc(100%-8rem)] md:px-8">
          <a href="#inicio" className="flex items-center gap-3" aria-label="Systemic Solutions, inicio">
            <span className="font-display text-3xl font-extrabold leading-none tracking-[-0.06em] text-[#e5e2e1] sm:text-4xl">SYSTEMIC</span>
          </a>
          <div className="hidden items-center gap-8 font-mono text-[11px] tracking-[0.12em] text-[#bbc9cf] md:flex">
            <a className="transition hover:text-[#a5e7ff]" href="#capacidades">CAPACIDADES</a>
            <a className="transition hover:text-[#a5e7ff]" href="#proceso">PROCESO</a>
            <a className="transition hover:text-[#a5e7ff]" href="#caso">CASO_REAL</a>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hidden rounded-full bg-[#a5e7ff] px-6 py-2.5 font-mono text-[11px] font-medium tracking-[0.1em] text-[#003543] transition hover:bg-white md:block">
            INICIAR_CONEXIÓN
          </a>
          <button type="button" className="rounded-md p-2 text-[#a5e7ff] md:hidden" aria-expanded={menuOpen} aria-controls="menu-principal" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </nav>
        {menuOpen && <div id="menu-principal" className="mx-auto mt-2 max-w-[1440px] rounded-xl border border-white/10 bg-[#17191b] p-5 md:hidden">
          <div className="flex flex-col gap-4 font-mono text-xs tracking-wider text-[#bbc9cf]">
            <a href="#capacidades" onClick={() => setMenuOpen(false)}>CAPACIDADES</a>
            <a href="#proceso" onClick={() => setMenuOpen(false)}>PROCESO</a>
            <a href="#caso" onClick={() => setMenuOpen(false)}>CASO_REAL</a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-[#a5e7ff]">HABLEMOS →</a>
          </div>
        </div>}
      </header>

      <aside className="group fixed right-0 top-1/2 z-40 hidden w-16 -translate-y-1/2 overflow-hidden rounded-l-xl border-y border-l border-[#3c494e]/50 bg-[#1c1b1b]/80 py-8 shadow-2xl shadow-[#a5e7ff]/5 backdrop-blur-md transition-all duration-500 hover:w-64 md:block">
        <div className="relative flex flex-col gap-8 px-4">
          <a href="#capacidades" className="flex items-center gap-4 transition hover:scale-110"><BarChart3 className="h-6 w-6 shrink-0 text-[#a5e7ff] drop-shadow-[0_0_8px_rgba(71,214,255,.5)]" /><span className="whitespace-nowrap font-mono text-xs text-[#859399] opacity-0 transition-opacity group-hover:opacity-100">DIAGNÓSTICO</span></a>
          <a href="#proceso" className="flex items-center gap-4 rounded bg-[#a5e7ff]/10 py-2 transition hover:scale-110"><Workflow className="h-6 w-6 shrink-0 text-[#a5e7ff] drop-shadow-[0_0_8px_rgba(71,214,255,.5)]" /><span className="whitespace-nowrap font-mono text-xs text-[#a5e7ff] opacity-0 transition-opacity group-hover:opacity-100">FLUJOS</span></a>
          <a href="#caso" className="flex items-center gap-4 transition hover:scale-110"><ShieldCheck className="h-6 w-6 shrink-0 text-[#859399] transition group-hover:text-[#a5e7ff]" /><span className="whitespace-nowrap font-mono text-xs text-[#859399] opacity-0 transition-opacity group-hover:opacity-100">SISTEMAS</span></a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 transition hover:scale-110"><Radio className="h-6 w-6 shrink-0 text-[#859399] transition group-hover:text-[#a5e7ff]" /><span className="whitespace-nowrap font-mono text-xs text-[#859399] opacity-0 transition-opacity group-hover:opacity-100">CONECTAR</span></a>
        </div>
      </aside>

      <main id="contenido">
        <section id="inicio" className="hero-void relative flex h-screen items-center overflow-hidden px-6 sm:px-10">
          <NeuralField />
          <div className="pointer-events-none absolute left-1/2 top-[43%] h-[620px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#47d6ff]/[0.055] blur-[130px]" />
          <div className="relative mx-auto flex w-full max-w-[980px] flex-col items-center text-center">
            <h1 className="animate-hero-title font-display text-5xl font-extrabold leading-[52px] tracking-[-0.02em] text-[#e5e2e1] drop-shadow-[0_0_20px_rgba(165,231,255,.3)] md:text-[80px] md:leading-[88px]"><span className="block">SYSTEMIC</span><span className="block">SOLUTIONS</span></h1>
            <p className="mt-9 font-mono text-[10px] tracking-[0.38em] text-[#a5e7ff] sm:text-xs">ARQUITECTOS DE SOLUCIONES DIGITALES</p>

            <div className="hero-terminal terminal-panel relative mt-16 w-full max-w-[672px] overflow-hidden rounded-xl p-1 sm:mt-16">
              <div className="relative rounded-[10px] bg-[#131313]/60 p-8 text-left backdrop-blur-[40px] sm:p-10">
                <div className="terminal-scanline" />
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex gap-3"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#ffb4ab]" /><span className="h-2.5 w-2.5 rounded-full bg-[#a5e7ff]" /><span className="h-2.5 w-2.5 rounded-full bg-[#d1bcff]" /></div>
                  <div className="flex items-center gap-4"><span className="hidden font-mono text-[10px] tracking-widest text-[#a5e7ff]/40 sm:block">LOC: TINGO_MARÍA // PE</span><span className="rounded bg-white/5 px-2 py-1 font-mono text-[10px] text-[#3c494e]">CORE_V4.0 // STABLE</span></div>
                </div>
                <div className="space-y-6 font-mono text-sm sm:text-base">
                  <p className="text-[#a5e7ff]">› initializing_systemic_core...</p>
                  <p className="text-[#e5e2e1]">› system status: <span className="text-[#d1bcff]">operational</span></p>
                  <p className="text-[#e5e2e1]">› node connections: 1,248,320 active</p>
                </div>
                <div className="mt-7 pt-2">
                  <div className="mb-3 flex justify-between font-mono text-[10px] tracking-widest text-[#859399]"><span>IMPACTO_OPERATIVO</span><span className="text-[#a5e7ff]">EN PROGRESO</span></div>
                  <div className="h-2 overflow-hidden rounded-full border border-white/5 bg-white/5 p-px"><div className="h-full w-[68%] bg-[#a5e7ff] shadow-[0_0_15px_rgba(165,231,255,.8)]" /></div>
                </div>
              </div>
            </div>
          </div>
          <a href="#capacidades" className="absolute bottom-7 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.22em] text-[#859399] transition hover:text-[#a5e7ff]">SCROLL_TO_DISCOVER <ArrowDownRight className="ml-1 inline h-3.5 w-3.5" /></a>
        </section>

        <section id="capacidades" className="border-y border-white/10 bg-[#151617] px-6 py-28 sm:px-10 lg:py-36">
          <div className="mx-auto max-w-[1180px]">
            <div className="grid gap-9 md:grid-cols-[.7fr_1.3fr] md:items-end">
              <p className="font-mono text-xs tracking-[0.2em] text-[#d1bcff]">01 // CAPACIDADES</p>
              <h2 className="max-w-3xl font-display text-4xl font-bold leading-tight tracking-[-0.045em] text-white sm:text-6xl">No partimos de un producto. Partimos de lo que tu operación necesita.</h2>
            </div>
            <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
              {capabilities.map(({ id, title, detail, icon: Icon }) => <article key={id} className="group min-h-[300px] bg-[#151617] p-8 transition hover:bg-[#1d2022]">
                <div className="flex items-start justify-between"><span className="font-mono text-xs text-[#859399]">{id}</span><Icon className="h-6 w-6 text-[#a5e7ff] transition group-hover:drop-shadow-[0_0_8px_#47d6ff]" /></div>
                <h3 className="mt-20 font-display text-2xl font-bold tracking-[-0.035em] text-white">{title}</h3>
                <p className="mt-4 leading-7 text-[#bbc9cf]">{detail}</p>
              </article>)}
            </div>
          </div>
        </section>

        <section id="proceso" className="grid-bg px-6 py-28 sm:px-10 lg:py-36">
          <div className="mx-auto max-w-[1180px]">
            <p className="font-mono text-xs tracking-[0.2em] text-[#a5e7ff]">02 // FORMA_DE_TRABAJAR</p>
            <div className="mt-8 grid gap-14 lg:grid-cols-2 lg:items-end">
              <h2 className="font-display text-4xl font-bold leading-tight tracking-[-0.045em] text-white sm:text-6xl">La tecnología tiene sentido cuando simplifica algo real.</h2>
              <p className="max-w-lg text-lg leading-8 text-[#bbc9cf]">Trabajamos cerca de tu operación para que cada decisión responda a un problema concreto, no a una moda.</p>
            </div>
            <ol className="mt-20 grid gap-7 md:grid-cols-3">
              {process.map(([number, title, detail]) => <li key={number} className="border-t border-[#859399]/50 pt-6"><span className="font-mono text-xs text-[#d1bcff]">{number}</span><h3 className="mt-8 font-display text-2xl font-bold tracking-[-0.03em] text-white">{title}</h3><p className="mt-4 leading-7 text-[#bbc9cf]">{detail}</p></li>)}
            </ol>
          </div>
        </section>

        <section id="caso" className="border-y border-white/10 bg-[#17151b] px-6 py-28 sm:px-10 lg:py-36">
          <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[1fr_.8fr] lg:items-center">
            <div><p className="font-mono text-xs tracking-[0.2em] text-[#d1bcff]">03 // CASO_REAL</p><h2 className="mt-8 font-display text-4xl font-bold leading-tight tracking-[-0.045em] text-white sm:text-6xl">MiBillar: de controlar en papel a operar con claridad.</h2><p className="mt-7 max-w-2xl text-lg leading-8 text-[#bbc9cf]">Construimos un sistema pensado para la operación diaria de un billar: control de mesas, caja, ventas y visibilidad sobre el negocio. Un ejemplo de cómo una solución a medida se adapta al terreno.</p><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-[#a5e7ff] hover:text-white">HABLEMOS DE TU OPERACIÓN <ArrowRight className="h-4 w-4" /></a></div>
            <div className="rounded-2xl border border-[#a5e7ff]/20 bg-[#111315]/80 p-7 shadow-[0_0_70px_rgba(71,214,255,.08)]"><p className="font-mono text-[10px] tracking-[.18em] text-[#859399]">OPERACIÓN_SIMPLIFICADA</p><div className="mt-8 space-y-4">{['Mesas y tiempos en una sola vista', 'Caja y movimientos bajo control', 'Información útil para decidir'].map((item) => <div key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[.025] p-4 text-sm text-[#e5e2e1]"><Check className="h-4 w-4 shrink-0 text-[#a5e7ff]" />{item}</div>)}</div></div>
          </div>
        </section>

        <section className="px-6 py-28 text-center sm:px-10 lg:py-36">
          <div className="mx-auto max-w-3xl"><p className="font-mono text-xs tracking-[0.2em] text-[#a5e7ff]">INICIEMOS_LA_CONVERSACIÓN</p><h2 className="mt-7 font-display text-4xl font-bold leading-tight tracking-[-0.05em] text-white sm:text-6xl">Cuéntanos el proceso que hoy te está frenando.</h2><p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#bbc9cf]">Lo revisamos contigo y te proponemos una ruta clara, sin compromiso.</p><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex items-center gap-2 rounded-xl bg-[#a5e7ff] px-7 py-4 font-mono text-xs font-medium tracking-[0.1em] text-[#003543] transition hover:bg-white"><MessageCircle className="h-4 w-4" /> ESCRIBIR POR WHATSAPP</a></div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 sm:px-10"><div className="mx-auto flex max-w-[1180px] flex-col gap-4 text-center font-mono text-[10px] tracking-[.14em] text-[#859399] sm:flex-row sm:justify-between sm:text-left"><span>© 2026 SYSTEMIC SOLUTIONS</span><span>SOFTWARE · AUTOMATIZACIÓN · IA</span></div></footer>
    </div>
  )
}
