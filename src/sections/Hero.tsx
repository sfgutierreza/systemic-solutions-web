import { motion } from 'framer-motion'
import {
  ArrowRight,
  LayoutGrid,
  Clock,
  MessageCircle,
  Workflow,
  Mail,
  Globe,
  BarChart3,
  Smartphone,
  Bot,
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LightLines } from '@/components/ui/light-lines'
import { SolarSystem, type OrbitConfig } from '@/components/ui/solar-system'
import { WHATSAPP_URL } from '@/lib/contact'

// Los chips de terceros (WhatsApp, Gmail, Google) llevan su color de marca
// real. Los nuestros usan la paleta en variante oscura — los chips van sobre
// fondo negro.
const orbits: OrbitConfig[] = [
  {
    id: 'inner',
    name: 'Canales',
    radiusClass: 'var(--radius-inner)',
    radiusPx: 175,
    speed: 22,
    items: [
      {
        id: 'whatsapp',
        label: 'WhatsApp',
        type: 'Canal principal',
        color: '#25D366',
        svg: <MessageCircle className="h-5 w-5 text-[#25D366]" fill="#25D366" />,
      },
      {
        id: 'email',
        label: 'Correo',
        type: 'Canal',
        color: '#EA4335',
        svg: <Mail className="h-5 w-5 text-[#EA4335]" />,
      },
      {
        id: 'calendar',
        label: 'Google Workspace',
        type: 'Productividad',
        color: '#4285F4',
        svg: <Calendar className="h-5 w-5 text-[#4285F4]" />,
      },
    ],
  },
  {
    id: 'mid',
    name: 'Automatización',
    radiusClass: 'var(--radius-mid)',
    radiusPx: 285,
    speed: 34,
    items: [
      {
        id: 'flujos',
        label: 'Automatización',
        type: 'Procesos',
        color: '#9d5cff',
        svg: <Workflow className="h-5 w-5 text-brand-purple-400" />,
      },
      {
        id: 'agent',
        label: 'Agente IA',
        type: 'Inteligencia',
        color: '#2dd4bf',
        svg: <Bot className="h-5 w-5 text-teal-400" />,
      },
    ],
  },
  {
    id: 'outer',
    name: 'Productos',
    radiusClass: 'var(--radius-outer)',
    radiusPx: 395,
    speed: 50,
    items: [
      {
        id: 'web',
        label: 'Páginas web',
        type: 'Presencia digital',
        color: '#2dd4bf',
        svg: <Globe className="h-5 w-5 text-teal-400" />,
      },
      {
        id: 'dashboard',
        label: 'Dashboards',
        type: 'Reportes',
        color: '#94a3b8',
        svg: <BarChart3 className="h-5 w-5 text-slate-400" />,
      },
      {
        id: 'apps',
        label: 'Apps',
        type: 'Móvil y web',
        color: '#9d5cff',
        svg: <Smartphone className="h-5 w-5 text-brand-purple-400" />,
      },
    ],
  },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-16">
      {/* Fondo estilo Mintlify: líneas de luz fluyendo */}
      <LightLines
        className="opacity-90"
        gradientFrom="#ffffff"
        gradientTo="#f0fdfa"
        lineColor="#14b8a6"
        linesOpacity={0.1}
        lightsOpacity={0.55}
        lightColor="#2dd4bf"
        speedMultiplier={0.8}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-24 pt-16 lg:grid-cols-2 lg:pt-24">
        {/* Columna izquierda */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700">
            <span className="h-2 w-2 rounded-full bg-teal-500" />
            Software · IA · Automatización — Tingo María, Perú
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
            Construimos el software
            <br />
            que <span className="text-brand-teal-text">hace crecer</span>
            <br />
            tu negocio
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-600">
            Agentes de IA para WhatsApp, webs inteligentes, SaaS a medida y
            automatización. Todo conectado: WhatsApp, correo y Google Workspace.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="gap-2 rounded-xl bg-slate-900 px-6 text-white hover:bg-slate-800"
            >
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                Escríbenos por WhatsApp <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="gap-2 rounded-xl border-slate-300 px-6"
            >
              <a href="#servicios">
                <LayoutGrid className="h-4 w-4" /> Ver servicios
              </a>
            </Button>
          </div>

          <p className="mt-10 flex items-center gap-2 text-sm text-slate-600">
            <Clock className="h-4 w-4 text-brand-teal-text" />
            <span className="font-semibold text-slate-900">
              Respuesta el mismo día
            </span>{' '}
            · Atendemos en Tingo María y todo el Perú
          </p>
        </motion.div>

        {/* Columna derecha: Sistema solar */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <SolarSystem
            orbits={orbits}
            centerLogo={
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-400 shadow-lg shadow-teal-400/40">
                <Bot className="h-7 w-7 text-slate-900" strokeWidth={2.2} />
              </span>
            }
            className="mx-auto"
          />

          {/* Tarjetas flotantes */}
          <motion.div
            className="absolute left-0 top-8 rounded-2xl border border-slate-200 bg-white/90 px-5 py-4 shadow-lg shadow-slate-900/5 backdrop-blur"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Atiende por ti
            </p>
            <p className="text-2xl font-extrabold text-brand-teal-text">WhatsApp</p>
            <p className="text-xs text-slate-500">responde, vende y agenda</p>
          </motion.div>

          <motion.div
            className="absolute bottom-10 right-0 rounded-2xl border border-slate-200 bg-white/90 px-5 py-4 shadow-lg shadow-slate-900/5 backdrop-blur"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Todo conectado
            </p>
            <p className="text-2xl font-extrabold text-brand-purple">Workspace</p>
            <p className="text-xs text-slate-500">correo, agenda y reportes</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
