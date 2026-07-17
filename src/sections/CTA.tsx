import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WHATSAPP_URL, PHONE_DISPLAY, PHONE_TEL } from '@/lib/contact'
import logo from '@/assets/logo.png'

export default function CTA() {
  return (
    <>
      {/* CTA final */}
      <section className="relative py-28">
        <div className="mx-auto max-w-7xl px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 px-8 py-20 text-center sm:px-16"
          >
            {/* Decoración playful */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-brand-purple/25 blur-3xl" />
            <div className="pointer-events-none absolute right-1/4 top-10 h-32 w-32 rounded-full bg-slate-400/10 blur-2xl" />

            <span className="relative inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-teal-300">
              Primera consulta gratis
            </span>
            <h2 className="relative mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Cuéntanos qué necesita{' '}
              <span className="text-teal-400">tu negocio</span>
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-slate-400">
              Escríbenos qué proceso te quita más tiempo. Te respondemos el mismo
              día y te decimos con franqueza si podemos ayudarte.
            </p>
            <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="gap-2 rounded-xl bg-teal-400 px-7 font-semibold text-slate-900 hover:bg-teal-300"
              >
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  Escríbenos por WhatsApp <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 rounded-xl border-white/20 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white"
              >
                <a href={PHONE_TEL}>
                  <Phone className="h-4 w-4" /> {PHONE_DISPLAY}
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <a href="#" className="flex items-center gap-2.5">
            <img
              src={logo}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg"
            />
            <span className="text-base font-bold tracking-tight text-slate-900">
              Systemic Solutions
            </span>
          </a>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
            <a href="#servicios" className="hover:text-slate-900">Servicios</a>
            <a href="#proceso" className="hover:text-slate-900">Cómo trabajamos</a>
            <a href="#proceso" className="hover:text-slate-900">Proceso</a>
            <a href="#caso" className="hover:text-slate-900">Caso MiBillar</a>
          </div>
          <p className="text-sm text-slate-500">
            © 2026 Systemic Solutions. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </>
  )
}
