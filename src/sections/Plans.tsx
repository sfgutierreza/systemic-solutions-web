import { motion } from 'framer-motion'
import { Check, ArrowRight, Bot, Globe, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WHATSAPP_URL, MIBILLAR_URL } from '@/lib/contact'

interface Plan {
  name: string
  icon: typeof Globe
  highlight?: boolean
  /** Precio en soles. setup=null => solo recurrente. */
  setup?: number
  monthly: number
  /** Texto del sufijo de precio, ej. "/mes". */
  cadence: string
  features: string[]
  cta: string
  href: string
  ctaVariant?: 'default' | 'outline'
}

const plans: Plan[] = [
  {
    name: 'Presencia',
    icon: Globe,
    monthly: 299.9,
    cadence: 'pago único',
    features: [
      'Sitio web 1 página (inicio, servicios, contacto)',
      'Formulario + botón de WhatsApp',
      'Dominio .pe incluido el primer año',
      'Hosting en Vercel (rápido, HTTPS)',
      'Mantenimiento S/ 19.90/mes (renovación + ediciones)',
    ],
    cta: 'Quiero mi web',
    href: '#contacto',
    ctaVariant: 'outline',
  },
  {
    name: 'MiBillar',
    icon: LayoutGrid,
    monthly: 39.9,
    cadence: '/mes',
    features: [
      'Mesas, ventas y finanzas para tu billar',
      'Multi-negocio (más de un local)',
      'Listo y operando, sin instalación',
      'Soporte por WhatsApp',
      'Creado y operado por nosotros',
    ],
    cta: 'Ver MiBillar',
    href: MIBILLAR_URL,
    ctaVariant: 'outline',
  },
  {
    name: 'Automatización IA',
    icon: Bot,
    highlight: true,
    setup: 299,
    monthly: 79,
    cadence: '/mes',
    features: [
      'Agente de IA en WhatsApp 24/7',
      'Atiende, responde y agenda por ti',
      'Con tu catálogo y precios',
      'Dashboard de ventas y conversaciones',
      'Implementación en días, no meses',
    ],
    cta: 'Automatizar mi negocio',
    href: '#contacto',
  },
]

/** Render del precio con el decimal (.90 / .00) en tamaño menor. */
function Price({ value, cadence, prefix, highlight }: { value: number; cadence: string; prefix?: string; highlight?: boolean }) {
  const [int, dec] = value.toFixed(2).split('.')
  return (
    <div className="flex items-baseline gap-1">
      {prefix && <span className="text-lg font-bold text-slate-900">{prefix}</span>}
      <span className={`text-4xl font-extrabold tracking-tight ${highlight ? 'text-white' : 'text-slate-900'} sm:text-5xl`}>
        {int}
      </span>
      <span className="text-xl font-bold text-slate-400">.{dec}</span>
      <span className="ml-1 text-sm font-medium text-slate-500">{cadence}</span>
    </div>
  )
}

export default function Plans() {
  return (
    <section id="planes" className="relative bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-600">
            Planes
          </span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Precios claros para{' '}
            <span className="text-brand-teal-text">tu negocio</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Sin letra chiquita. Tu negocio merece tecnología de primera.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex flex-col rounded-3xl border p-8 shadow-sm ${
                p.highlight
                  ? 'border-teal-400 bg-slate-900 text-white shadow-xl shadow-teal-400/10'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal-400 px-4 py-1 text-xs font-bold text-slate-900">
                  Más vendido
                </span>
              )}

              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${
                    p.highlight ? 'bg-teal-400 text-slate-900' : 'bg-teal-50 text-teal-600'
                  }`}
                >
                  <p.icon className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <h3
                  className={`text-xl font-bold ${
                    p.highlight ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {p.name}
                </h3>
              </div>

              <div className="mt-6">
                {p.setup !== undefined && (
                  <p
                    className={`mb-1 text-sm ${
                      p.highlight ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    Setup S/ {p.setup.toFixed(2).replace('.00', '')} · luego
                  </p>
                )}
                <Price value={p.monthly} cadence={p.cadence} prefix="S/" highlight={p.highlight} />
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        p.highlight ? 'text-teal-400' : 'text-teal-600'
                      }`}
                    />
                    <span
                      className={`text-sm leading-relaxed ${
                        p.highlight ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                className={`mt-8 w-full gap-2 rounded-xl ${
                  p.highlight
                    ? 'bg-teal-400 text-slate-900 hover:bg-teal-300'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
                variant={p.ctaVariant}
              >
                <a href={p.href} target={p.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                  {p.cta} <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          ¿No estás seguro cuál funciona para ti?{' '}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-600 hover:underline">
            Escríbenos por WhatsApp
          </a>{' '}
          y te ayudamos a elegir.
        </p>
      </div>
    </section>
  )
}
