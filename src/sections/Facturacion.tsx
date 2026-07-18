import { motion } from 'framer-motion'
import { Check, ArrowRight, FileText, Smartphone, ShieldCheck, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WHATSAPP_URL } from '@/lib/contact'

interface FactPlan {
  name: string
  price: string
  suffix: string
  users: string
  docs: string
  highlight?: boolean
}

const plans: FactPlan[] = [
  {
    name: 'Básico',
    price: 'S/. 60',
    suffix: '+ IGV · mensual',
    users: '1 usuario',
    docs: '50 comprobantes',
  },
  {
    name: 'Empresarial',
    price: 'S/. 90',
    suffix: '+ IGV · mensual',
    users: '2 usuarios',
    docs: '300 comprobantes',
    highlight: true,
  },
  {
    name: 'Corporativo',
    price: 'S/. 140',
    suffix: '+ IGV · mensual',
    users: '5 usuarios',
    docs: '500 comprobantes',
  },
]

const highlights = [
  { icon: ShieldCheck, text: 'Cumplimiento normativo siempre actualizado' },
  { icon: Clock, text: 'Soporte técnico 24/7' },
  { icon: Smartphone, text: 'App para Android incluida' },
]

export default function Facturacion() {
  return (
    <section id="facturacion" className="relative bg-white py-28">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-600">
            Facturación electrónica
          </span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Comprobantes SUNAT{' '}
            <span className="text-brand-teal-text">desde la nube</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Emite boletas, facturas y notas de crédito de forma rápida, segura y
            100% conforme a SUNAT, desde cualquier dispositivo. Sin instalar nada.
          </p>
        </div>

        {/* Puntos clave */}
        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {highlights.map((h) => (
            <div key={h.text} className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <h.icon className="h-5 w-5 text-brand-teal-text" strokeWidth={2.2} />
              {h.text}
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-slate-500">
          Planes para cada tamaño de negocio — solución en la nube, 100% conforme a
          SUNAT, con soporte técnico 24/7 y app para Android.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
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
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${
                    p.highlight ? 'bg-teal-400 text-slate-900' : 'bg-teal-50 text-teal-600'
                  }`}
                >
                  <FileText className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <h3
                  className={`text-xl font-bold ${p.highlight ? 'text-white' : 'text-slate-900'}`}
                >
                  {p.name}
                </h3>
              </div>

              <div className="mt-6">
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-extrabold tracking-tight ${
                      p.highlight ? 'text-white' : 'text-slate-900'
                    } sm:text-5xl`}
                  >
                    {p.price}
                  </span>
                </div>
                <p className={`mt-1 text-sm ${p.highlight ? 'text-slate-300' : 'text-slate-500'}`}>
                  {p.suffix}
                </p>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                <li className="flex items-start gap-2.5">
                  <Check
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      p.highlight ? 'text-teal-400' : 'text-teal-600'
                    }`}
                  />
                  <span className={`text-sm leading-relaxed ${p.highlight ? 'text-slate-300' : 'text-slate-600'}`}>
                    {p.users}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      p.highlight ? 'text-teal-400' : 'text-teal-600'
                    }`}
                  />
                  <span className={`text-sm leading-relaxed ${p.highlight ? 'text-slate-300' : 'text-slate-600'}`}>
                    {p.docs}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      p.highlight ? 'text-teal-400' : 'text-teal-600'
                    }`}
                  />
                  <span className={`text-sm leading-relaxed ${p.highlight ? 'text-slate-300' : 'text-slate-600'}`}>
                    Soporte técnico 24/7
                  </span>
                </li>
              </ul>

              <Button
                asChild
                size="lg"
                className={`mt-8 w-full gap-2 rounded-xl ${
                  p.highlight
                    ? 'bg-teal-400 text-slate-900 hover:bg-teal-300'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                <a
                  href={`${WHATSAPP_URL}?text=${encodeURIComponent('Hola, quiero el plan de Facturación electrónica ' + p.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pedir ahora <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
