import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
// Analytics de Vercel: primera parte, sin cookies. Se activa solo al habilitar
// "Analytics" en la configuración del proyecto en Vercel. Mide visitas, origen
// y conversión sin tocar el código de nuevo.
import { Analytics } from '@vercel/analytics/react'
// Fuentes auto-hospedadas: sin peticiones a Google, sin FOUT por red externa.
// Variables (un solo archivo cubre 100-900), así font-extrabold (800) es real
// y no un negrita sintético.
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
import '@fontsource-variable/space-grotesk/index.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Analytics />
    </BrowserRouter>
  </StrictMode>,
)
