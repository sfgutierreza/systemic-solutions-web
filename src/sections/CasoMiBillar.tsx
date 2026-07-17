import { motion } from 'framer-motion'
import {
  LayoutGrid,
  Boxes,
  ShoppingCart,
  Wallet,
  Settings,
  ExternalLink,
  Rocket,
  Building2,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MIBILLAR_URL } from '@/lib/contact'

const modules = [
  { icon: LayoutGrid, label: 'Mesas', hint: 'Ocupación y tiempos' },
  { icon: Boxes, label: 'Productos', hint: 'Stock y costos' },
  { icon: ShoppingCart, label: 'Venta', hint: 'Consumo por mesa' },
  { icon: Wallet, label: 'Finanzas', hint: 'Gastos y resultados', highlight: true },
  { icon: Settings, label: 'Ajustes', hint: 'Usuarios y negocio' },
]

const points = [
  {
    icon: Rocket,
    title: 'En producción, no en maqueta',
    body: 'Billares reales lo usan a diario para cobrar y cerrar caja. Nosotros lo desplegamos y lo mantenemos.',
  },
  {
    icon: Building2,
    title: 'Hecho para escalar',
    body: 'Cada cliente con sus datos aparte. La misma base atiende de un cliente a cien sin reescribir nada.',
  },
  {
    icon: RefreshCw,
    title: 'Crece con el cliente',
    body: 'El módulo de Finanzas nació del pedido de un cliente: lo diseñamos, construimos y desplegamos sin tocar el resto del sistema.',
  },
]

export default function CasoMiBillar() {
  return (
    <section id="caso" className="relative bg-slate-50 py-28">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600">
            Caso real
          </span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            No solo lo construimos.
            <br />
            Lo <span className="text-brand-teal-text">operamos</span>.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            MiBillar es nuestro SaaS propio: el sistema con el que billares del
            Perú manejan mesas, ventas y finanzas todos los días.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          {/* Mock de los módulos */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/5"
          >
            <div className="flex items-center gap-1.5 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              <span className="ml-3 font-mono text-xs text-slate-500">
                mibillar.vercel.app
              </span>
            </div>

            <div className="rounded-2xl bg-slate-50/80 p-4">
              <p className="px-2 pb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Módulos
              </p>
              <ul className="space-y-1.5">
                {modules.map((m) => (
                  <li
                    key={m.label}
                    className={`flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl px-3 py-2.5 ${
                      m.highlight
                        ? 'bg-teal-400/10 ring-1 ring-teal-400/30'
                        : 'bg-white'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        m.highlight ? 'bg-teal-400/20' : 'bg-slate-100'
                      }`}
                    >
                      <m.icon
                        className={`h-4 w-4 ${
                          m.highlight ? 'text-teal-600' : 'text-slate-500'
                        }`}
                        strokeWidth={2.2}
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-slate-900">
                        {m.label}
                      </span>
                      <span className="block text-xs text-slate-600">
                        {m.hint}
                      </span>
                    </span>
                    {m.highlight && (
                      <span className="ml-11 basis-full whitespace-nowrap rounded-full bg-teal-400/20 px-2 py-0.5 text-center text-[10px] font-semibold text-teal-800 sm:ml-auto sm:basis-auto">
                        pedido de un cliente
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Puntos */}
          <div className="space-y-8">
            {points.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex gap-4"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                  <p.icon className="h-5 w-5 text-teal-600" strokeWidth={2.2} />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {p.body}
                  </p>
                </div>
              </motion.div>
            ))}

            <Button
              asChild
              size="lg"
              variant="outline"
              className="gap-2 rounded-xl border-slate-300 bg-white px-6"
            >
              <a href={MIBILLAR_URL} target="_blank" rel="noopener noreferrer">
                Ver MiBillar en vivo <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
