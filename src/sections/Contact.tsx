import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { WEB3FORMS_KEY, WHATSAPP_URL } from '@/lib/contact'

const schema = z.object({
  name: z.string().min(2, 'Escribe tu nombre'),
  email: z.string().email('Email no válido'),
  whatsapp: z.string().optional(),
  message: z.string().min(10, 'Cuéntanos un poco más (mín. 10 caracteres)'),
})

type FormValues = z.infer<typeof schema>

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: 'Nuevo lead — Systemic Solutions',
          from_name: 'Web Systemic Solutions',
          ...values,
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('¡Listo! Te escribimos pronto por WhatsApp o correo.')
        reset()
      } else {
        toast.error('No se pudo enviar. Escríbenos directo por WhatsApp.')
      }
    } catch {
      toast.error('Error de red. Escríbenos directo por WhatsApp.')
    }
  }

  return (
    <section id="contacto" className="relative bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
          {/* Izquierda: copy local */}
          <div>
            <span className="inline-block rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700">
              Hablemos
            </span>
            <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Cuéntanos tu{' '}
              <span className="text-brand-teal-text">negocio</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              En Tingo María y la selva peruana conocemos de cerca el día a día de
              los negocios como el tuyo. Cuéntanos qué proceso te quita tiempo y te
              armamos una propuesta clara, sin lenguaje de consultora.
            </p>
            <div className="mt-8 flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="h-4 w-4 text-brand-teal-text" />
              <span>
                Con base en{' '}
                <span className="font-semibold text-slate-900">
                  Tingo María, Huánuco
                </span>{' '}
                — atendemos a todo el Perú.
              </span>
            </div>
            <Button
              asChild
              variant="outline"
              className="mt-8 gap-2 rounded-xl border-slate-300 px-6"
            >
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                O escríbenos por WhatsApp <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* Derecha: formulario */}
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div className="space-y-5">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Tu nombre"
                  className="mt-1.5"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Correo</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="tucorreo@ejemplo.com"
                  className="mt-1.5"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
                <Input
                  id="whatsapp"
                  {...register('whatsapp')}
                  placeholder="951 045 601"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="message">¿Qué necesita tu negocio?</Label>
                <Textarea
                  id="message"
                  {...register('message')}
                  placeholder="Ej: quiero tomar pedidos por WhatsApp y una web para mi restaurante"
                  className="mt-1.5 min-h-[110px]"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.message.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full gap-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                {isSubmitting ? 'Enviando…' : 'Enviar mensaje'}
              </Button>
              <p className="text-center text-xs text-slate-400">
                Sin spam. Respondemos el mismo día.
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
