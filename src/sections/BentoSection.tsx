import {
  FeatCard,
  Card1,
  Card2,
  Card3,
  Card4,
  Card5,
} from '@/components/ui/agent-bento-grid'

// Los visuales son ilustraciones de nuestro método de trabajo, no capturas de
// un panel que el cliente use: la copy habla de lo que HACEMOS nosotros.
const cards = [
  {
    title: 'Dibujamos el flujo primero',
    description: 'Antes de escribir código definimos por dónde pasa cada conversación: qué entiende, qué consulta y qué responde.',
    visual: <Card1 />,
    colSpan: 'lg:col-span-1',
  },
  {
    title: 'Medimos lo que cuesta',
    description: 'Volumen por canal y costo por conversación. Sabes qué pagas y por qué, sin sorpresas a fin de mes.',
    visual: <Card2 />,
    colSpan: 'lg:col-span-1',
  },
  {
    title: 'Registramos cada paso',
    description: 'Cada acción del agente queda anotada. Si algo sale mal, sabemos exactamente dónde y lo corregimos.',
    visual: <Card3 />,
    colSpan: 'lg:col-span-1',
  },
  {
    title: 'Le damos tu contexto',
    description: 'Tus agentes responden con tu catálogo, tus precios y tus políticas. No improvisan.',
    visual: <Card4 />,
    colSpan: 'lg:col-span-2',
  },
  {
    title: 'Vigilamos las integraciones',
    description: 'Latencia y errores de cada conexión con WhatsApp, correo o tus herramientas.',
    visual: <Card5 />,
    colSpan: 'lg:col-span-1',
  },
]

export default function BentoSection() {
  return (
    <section id="metodo" className="relative bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600">
            Cómo trabajamos
          </span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Nada de
            <br />
            <span className="text-brand-teal-text">cajas negras</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Instrumentamos cada agente que construimos: qué respondió, cuánto
            costó y dónde falló. Así lo mejoramos mes a mes en vez de adivinar.
          </p>
        </div>

        <div className="mt-16 grid w-full max-w-5xl grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 mx-auto">
          {cards.map((c) => (
            <FeatCard
              key={c.title}
              title={c.title}
              description={c.description}
              className={`${c.colSpan} h-[280px]`}
            >
              {c.visual}
            </FeatCard>
          ))}
        </div>
      </div>
    </section>
  )
}
