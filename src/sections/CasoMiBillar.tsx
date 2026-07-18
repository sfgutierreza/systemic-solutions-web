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
  MapPin,
  Check,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MIBILLAR_URL, WHATSAPP_URL } from '@/lib/contact'

const modules = [
  { icon: LayoutGrid, label: 'Mesas', hint: 'Ocupación y tiempos' },
  { icon: Boxes, label: 'Productos', hint: 'Stock y costos' },
  { icon: ShoppingCart, label: 'Venta', hint: 'Consumo por mesa' },
  { icon: Wallet, label: 'Finanzas', hint: 'Gastos y resultados', highlight: true },
  { icon: Settings, label: 'Ajustes', hint: 'Usuarios y negocio' },
]

const benefits = [
  {
    icon: Rocket,
    title: 'Deja el papel y el Excel',
    body: 'Registra cada mesa y cada consumo desde el celular. Sabes cuánto entró y cuánto salió al cerrar la noche.',
  },
  {
    icon: Wallet,
    title: 'Caja que no miente',
    body: 'Ventas, gastos y resultados en tiempo real. Sin cuentas que no cuadran ni "se me perdió la boleta".',
  },
  {
    icon: Building2,
    title: 'Hecho para tu billar',
    body: 'Multi-negocio si tienes más de un local. Cada uno con sus datos aparte, desde el mismo sistema.',
  },
]

const faq = [
  '¿Tengo que instalar algo? No. Abres desde el celular o la computadora.',
  '¿Y si no sé de sistemas? Lo dejamos listo y te enseñamos. Soporte por WhatsApp.',
  '¿Puedo probarlo? Sí. Te lo encendemos el mismo día y empiezas a usarlo.',
]

export default function CasoMiBillar() {
  return (
    <section id="caso" className="relative bg-slate-50 py-28">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700">
            Para dueños de billar en Tingo María
          </span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Controla tus mesas y tu{' '}
            <span className="text-brand-teal-text">caja</span> desde el celular
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            MiBillar es el sistema con el que billares de la selva manejan mesas,
            ventas y finanzas todos los días. Sin instalar nada, desde cualquier
            dispositivo.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-brand-teal-text" /> Tingo María, Perú
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-brand-teal-text" /> S/ 39.90 al mes
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-brand-teal-text" /> Empiezas hoy
            </span>
          </div>
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
                        lo que más usas
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Beneficios + CTA */}
          <div className="space-y-6">
            {benefits.map((p, i) => (
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

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">
                ¿Tienes dudas?
              </p>
              <ul className="mt-2 space-y-1.5">
                {faq.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal-text" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="gap-2 rounded-xl bg-teal-400 px-7 font-semibold text-slate-900 hover:bg-teal-300"
              >
                <a
                  href={`${WHATSAPP_URL}?text=${encodeURIComponent('Hola, quiero empezar con MiBillar para mi billar en Tingo María (S/ 39.90/mes)')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Empezar con MiBillar <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 rounded-xl border-slate-300 bg-white px-6"
              >
                <a href={MIBILLAR_URL} target="_blank" rel="noopener noreferrer">
                  Verlo en vivo <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
