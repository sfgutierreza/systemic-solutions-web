import Navbar from '@/sections/Navbar'
import Hero from '@/sections/Hero'
import StatsBand from '@/sections/StatsBand'
import Services from '@/sections/Services'
import Process from '@/sections/Process'
import Plans from '@/sections/Plans'
import CasoMiBillar from '@/sections/CasoMiBillar'
import Facturacion from '@/sections/Facturacion'
import CTA from '@/sections/CTA'
import Contact from '@/sections/Contact'

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      {/* Salta el nav para quien navega con teclado: invisible hasta recibir foco. */}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-slate-900 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido">
        <Hero />
        <Services />
        {/* Process ahora incluye los visuales de "Cómo trabajamos" (fusionado). */}
        <Process />
        <CasoMiBillar />
        <Facturacion />
        <StatsBand />
        <Plans />
        <Contact />
        <CTA />
      </main>
    </div>
  )
}
