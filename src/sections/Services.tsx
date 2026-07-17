import { motion } from 'framer-motion'
import {
  MessageCircle,
  Globe,
  Layers,
  Workflow,
  Plug,
  BarChart3,
} from 'lucide-react'

// Paleta de marca (teal · púrpura · gris). El verde es la excepción
// deliberada: identifica a WhatsApp, igual que los chips del hero usan los
// colores reales de cada tercero.
const services = [
  {
    icon: MessageCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    title: 'Agentes de IA para WhatsApp',
    description:
      'Agentes que atienden, venden y agendan por ti las 24 horas. Responden como humanos, trabajan como máquinas.',
    pill: '24/7 atención',
    pillBg: 'bg-green-50 text-green-700',
  },
  {
    icon: Globe,
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    title: 'Páginas web con asistentes inteligentes',
    description:
      'Sitios modernos con asistentes de IA integrados que convierten visitas en clientes mientras duermes.',
    pill: 'Con asistente IA',
    pillBg: 'bg-teal-50 text-teal-700',
  },
  {
    icon: Layers,
    iconBg: 'bg-brand-purple-100',
    iconColor: 'text-brand-purple-600',
    title: 'SaaS especializados y apps',
    description:
      'Software a medida para tu industria: plataformas, apps móviles y herramientas internas que escalan contigo.',
    pill: '100% a medida',
    pillBg: 'bg-brand-purple-50 text-brand-purple-700',
  },
  {
    icon: Workflow,
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    title: 'Automatización de procesos',
    description:
      'Flujos automatizados que eliminan el trabajo repetitivo: facturación, seguimientos, inventario y más.',
    pill: 'Flujos a medida',
    pillBg: 'bg-teal-50 text-teal-700',
  },
  {
    icon: Plug,
    iconBg: 'bg-brand-purple-100',
    iconColor: 'text-brand-purple-600',
    title: 'Integración total',
    description:
      'Conectamos WhatsApp, correo, Google Workspace y tus herramientas favoritas en un solo ecosistema.',
    pill: 'WhatsApp · Correo · Workspace',
    pillBg: 'bg-brand-purple-50 text-brand-purple-700',
  },
  {
    icon: BarChart3,
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-500',
    title: 'Dashboards y reportes',
    description:
      'Paneles claros para dueños de negocio: ventas, conversaciones y rendimiento, todo en tiempo real.',
    pill: 'Tiempo real',
    pillBg: 'bg-slate-50 text-slate-600',
  },
]

export default function Services() {
  return (
    <section id="servicios" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-600">
            Servicios
          </span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Todo lo que necesitas
            <br />
            para <span className="text-brand-teal-text">despegar</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Desde el primer mensaje de WhatsApp hasta el reporte mensual:
            cubrimos todo el ciclo digital de tu negocio.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-900/5"
            >
              <span
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${s.iconBg} transition-transform duration-300 group-hover:scale-110`}
              >
                <s.icon className={`h-6 w-6 ${s.iconColor}`} strokeWidth={2.2} />
              </span>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {s.description}
              </p>
              <span
                className={`mt-5 inline-block rounded-full px-3 py-1 text-xs font-semibold ${s.pillBg}`}
              >
                {s.pill}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
