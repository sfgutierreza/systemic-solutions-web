import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WHATSAPP_URL } from '@/lib/contact'
import logo from '@/assets/logo.png'

const links = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Cómo trabajamos', href: '#metodo' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Caso MiBillar', href: '#caso' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2.5">
          {/* alt vacío a propósito: el wordmark de al lado ya dice el nombre,
              repetirlo hace que el lector de pantalla lo lea dos veces. */}
          <img
            src={logo}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-xl shadow-sm"
          />
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Systemic Solutions
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            asChild
            className="rounded-lg bg-slate-900 text-sm font-medium text-white hover:bg-slate-800"
          >
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Escríbenos por WhatsApp
            </a>
          </Button>
        </div>

        <button
          className="md:hidden text-slate-700"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-slate-600"
              >
                {l.label}
              </a>
            ))}
            <Button
              asChild
              className="mt-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
            >
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
              >
                Escríbenos por WhatsApp
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
