import { motion } from 'framer-motion'
import { AgentBentoGrid } from '@/components/ui/agent-bento-grid'

// El teal es demasiado claro para texto blanco (2.16:1): sobre teal va navy,
// igual que la S del logo. Sobre púrpura y gris el blanco sí pasa.
const steps = [
  {
    num: '01',
    color: 'bg-teal-400',
    textColor: 'text-slate-900',
    title: 'Descubrimiento',
    description:
      'Analizamos tus procesos y detectamos dónde la IA y la automatización generan más impacto.',
  },
  {
    num: '02',
    // purple-600 en vez del 500 (#8B5CF6): sobre el 500 ni blanco ni navy
    // llegan a 4.5:1 (luminancia media). El 600 con blanco da 5.70:1.
    color: 'bg-brand-purple-600',
    textColor: 'text-white',
    title: 'Diseño a medida',
    description:
      'Diseñamos tus agentes, flujos de automatización e integraciones según las reglas de tu negocio.',
  },
  {
    num: '03',
    color: 'bg-slate-500',
    textColor: 'text-white',
    title: 'Implementación',
    description:
      'Desplegamos todo en días, no meses: WhatsApp, web, dashboards y apps listas para usar.',
  },
  {
    num: '04',
    color: 'bg-teal-400',
    textColor: 'text-slate-900',
    title: 'Crecimiento continuo',
    description:
      'Monitoreamos métricas, mejoramos los agentes y escalamos contigo mes a mes.',
  },
]

// Solo herramientas que el público objetivo (dueños de negocio en Perú) usa a
// diario y que realmente integramos. Nada de logos de oficina gringa de relleno.
const logos = [
  'WhatsApp',
  'Facebook',
  'Instagram',
  'Yape',
  'Plin',
  'Google Calendar',
  'Gmail',
]

export default function Process() {
  return (
    <section id="proceso" className="relative py-28">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-600">
            Proceso
          </span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            De idea a <span className="text-brand-teal-text">automatización</span>
            <br />
            en 4 pasos
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
            >
              <span
                className={`inline-flex h-10 items-center rounded-full ${s.color} px-4 text-sm font-extrabold ${s.textColor}`}
              >
                {s.num}
              </span>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Visuales de cómo operamos: los "cuadritos" animados.
            Fusionado desde BentoSection para no duplicar la sección "método". */}
        <div className="mt-20">
          <AgentBentoGrid />
        </div>

        {/* Nube de integraciones */}
        <div className="mt-24 text-center">
          <p className="text-sm font-medium text-slate-500">
            Integramos las herramientas que ya usas todos los días
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {logos.map((l) => (
              <span
                key={l}
                className="text-xl font-bold text-slate-500 transition-colors hover:text-slate-900"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
