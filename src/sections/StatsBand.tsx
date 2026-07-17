import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface Stat {
  /** Cuando es un texto fijo (ej. un nombre de producto) no se anima contador. */
  value: number | string
  suffix?: string
  decimals?: number
  label: string
  color: string
}

const stats: Stat[] = [
  { value: 'MiBillar', label: 'SaaS propio en producción', color: 'text-teal-400' },
  { value: 99.9, suffix: '%', decimals: 1, label: 'Disponibilidad garantizada', color: 'text-brand-purple-400' },
  // slate-300, no slate-400: la etiqueta ya es slate-400 y el número perdía toda jerarquía.
  { value: 24, suffix: '/7', label: 'Agentes trabajando sin descanso', color: 'text-slate-300' },
]

function Counter({ value, suffix, decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setDisplay(value)
      return
    }
    const duration = 1600
    const start = performance.now()
    let raf: number
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(value * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])

  return (
    <span ref={ref}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}

export default function StatsBand() {
  return (
    <section className="relative bg-slate-900 py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className={`text-4xl font-extrabold tracking-tight sm:text-5xl ${s.color}`}>
              {typeof s.value === 'number' ? (
                <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
              ) : (
                s.value
              )}
            </p>
            <p className="mt-2 text-sm text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
