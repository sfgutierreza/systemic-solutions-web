# Prompt maestro — Página web systemic.pe (Systemic Solutions)

> Prompt detallado y fiel al repo actual (`SystemicSolutions-App`). Úsalo para
> regenerar, brief a otra IA, o reescribir la web sin perder el copy real.

---

## 1. Identidad y empresa

- **Marca**: Systemic Solutions
- **Qué es**: agencia peruana de software e inteligencia artificial para negocios locales de provincia (billares, restaurantes, hospedajes).
- **Origen**: Tingo María, Perú (selva). Atiende en todo el Perú.
- **Filosofía de UX (del dueño)**: *"Si puedes usar WhatsApp, puedes usar nuestra app"*. Priorizar experiencia de usuario sobre features. Lenguaje claro, sin jerga de consultora.
- **Contacto real (fuente: `src/lib/contact.ts`)**:
  - WhatsApp: `https://wa.me/51951045601`
  - Teléfono display: `951 045 601`
  - MiBillar (SaaS propio): `https://mibillar.vercel.app`
  - Formulario lead: Web3Forms (`access_key` ya configurada en el repo).

## 2. Stack técnico (evidencia `package.json` / `info.md`)

- **Vite 7** + **React 19** + **TypeScript** (no es Next.js; es SPA).
- **Tailwind CSS 3.4** con tema **shadcn**.
- **framer-motion** (animaciones de entrada, contadores, hover).
- **Radix UI** + componentes en `src/components/ui` (40+).
- Iconos: **lucide-react** + **phosphor-icons**.
- **react-router** (una sola ruta `/` = landing).
- **@vercel/analytics**. Deploy: **Vercel**. Dominio: **systemic.pe** (punto.pe, DNS Vercel).
- Estructura: `src/sections/` (secciones de página), `src/components/ui/`, `src/lib/`, `src/pages/Home.tsx`.

## 3. Paleta de marca (evidencia en los `.tsx`)

- **Teal** `#14b8a6` / `#2dd4bf` (acento principal, usado en botones CTA, checks, títulos).
- **Púrpura** `brand-purple` (#9d5cff / #8B5CF6→600 para texto legible) — automatización/IA.
- **Gris pizarra** `slate-900/50/200` — fondos y texto.
- **Coral** en badge "Más vendido".
- **Excepción deliberada**: el verde `#25D366` es SOLO de WhatsApp (chip del hero y botones). No es color de marca Systemic.
- No reusar el verde de MiBillar como identidad de Systemic (cada producto su color).

## 4. Secciones (orden exacto en `src/sections/`, copy literal del repo)

### Navbar (`Navbar.tsx`)
Fijo, blur. Logo + "Systemic Solutions". Links: Servicios · Planes · Facturación · Proceso · Caso MiBillar. Botón "Escríbenos por WhatsApp" (`WHATSAPP_URL`). Menú hamburguesa en móvil.

### Hero (`Hero.tsx`)
- Visual: sistema solar animado (órbitas con chips: WhatsApp #25D366, Correo #EA4335, Google Workspace #4285F4 en órbita interna; Automatización #9d5cff, Agente IA #2dd4bf en media; Páginas web #2dd4bf, Paneles #94a3b8, Apps #9d5cff en externa).
- Fondo estilo Mintlify (LightLines, líneas de luz teal).
- Copy sugerido (mantener tono): título sobre "software e IA para negocios que funcionan sin complicaciones"; subtítulo "Si puedes usar WhatsApp, puedes usar nuestra app".
- CTA: botón WhatsApp `wa.me/51951045601`.

### Services (`Services.tsx`) — 6 tarjetas
1. **Agentes de IA para WhatsApp** — "Agentes que atienden, venden y agendan por ti las 24 horas. Responden como humanos, trabajan como máquinas." · pill "Atención 24/7"
2. **Páginas web con asistentes inteligentes** — "Sitios modernos con asistentes de IA integrados que convierten visitas en clientes mientras duermes." · pill "Con asistente IA"
3. **SaaS especializados y apps** — "Software a medida para tu industria: plataformas, apps móviles y herramientas internas que escalan contigo." · pill "100% a medida"
4. **Automatización de procesos** — "Flujos automatizados que eliminan el trabajo repetitivo: facturación, seguimientos, inventario y más." · pill "Flujos a medida"
5. **Integración total** — "Conectamos WhatsApp, correo, Google Workspace y tus herramientas favoritas en un solo ecosistema." · pill "WhatsApp · Correo · Workspace"
6. **Paneles y reportes** — "Paneles claros para dueños de negocio: ventas, conversaciones y rendimiento, todo en tiempo real." · pill "Tiempo real"
Título sección: "Todo lo que necesitas para **despegar**". Sub: "Desde el primer mensaje de WhatsApp hasta el reporte mensual: cubrimos todo el ciclo digital de tu negocio."

### CasoMiBillar (`CasoMiBillar.tsx`) — caso de éxito
- Badge: "Para dueños de billar en el Perú".
- Título: "Controla tus mesas y tu **caja** desde el celular".
- Sub: "MiBillar es el sistema con el que billares de todo el Perú —desde la selva de Tingo María hasta la costa y la sierra— manejan mesas, ventas y finanzas todos los días. Sin instalar nada, desde cualquier dispositivo."
- Chips: "Billares de todo el Perú" · "S/ 39.90 al mes" · "Empiezas hoy".
- Mock de módulos: Mesas · Productos · Venta · **Finanzas** (destacado "lo que más usas") · Ajustes.
- Beneficios: "Deja el papel y el Excel" · "Caja que no miente" · "Hecho para tu billar" (multi-negocio).
- FAQ: "¿Tengo que instalar algo? No." · "¿Y si no sé de sistemas? Lo dejamos listo y te enseñamos." · "¿Puedo probarlo? Sí, te lo encendemos el mismo día."
- CTAs: "Empezar con MiBillar" (WhatsApp con texto prellenado) + "Verlo en vivo" (`MIBILLAR_URL`).

### Facturacion (`Facturacion.tsx`) — facturación electrónica SUNAT
- Badge: "Facturación electrónica". Título: "Comprobantes SUNAT **desde la nube**".
- Sub: "Emite boletas, facturas y notas de crédito de forma rápida, segura y 100% conforme a SUNAT, desde cualquier dispositivo. Sin instalar nada."
- Highlights: "Cumplimiento normativo siempre actualizado" · "Soporte técnico 24/7" · "App para Android incluida".
- **Planes (precios reales, IGV incluido)**:
  - **Básico** — S/ 60/mes · 1 usuario · 50 comprobantes.
  - **Empresarial** (destacado "Más vendido") — S/ 90/mes · 2 usuarios · 300 comprobantes.
  - **Corporativo** — S/ 140/mes · 5 usuarios · 500 comprobantes.
- CTA por plan: "Pedir ahora" (WhatsApp con texto "Hola, quiero el plan de Facturación electrónica {nombre}").

### Plans (`Plans.tsx`) — planes principales de la agencia
- Título: "Precios claros para **ti**". Sub: "Sin letra chiquita ni costos escondidos."
- **Planes (precios reales)**:
  - **Presencia** (S/ 299.90 pago único): Sitio web 1 página · Formulario + botón WhatsApp · Dominio .pe primer año · Hosting Vercel (HTTPS) · Mantenimiento opcional S/ 19.90/mes. CTA "Quiero mi web" → `#contacto`.
  - **MiBillar** (S/ 39.90/mes): Mesas, ventas y finanzas · Multi-negocio · Listo y operando · Soporte por WhatsApp · Creado y operado por nosotros. CTA "Ver MiBillar" → `MIBILLAR_URL`.
  - **Automatización IA** (destacado "Más vendido"): Implementación S/ 299 + S/ 79/mes · Agente IA en WhatsApp 24/7 · Atiende, vende y agenda · Con tu catálogo y precios · Panel de ventas y conversaciones · "Implementación en días, no meses". CTA "Automatizar mi negocio" → `#contacto`.
- **Regla de precio**: renderizar el decimal `.90` / `.00` en tamaño menor (UX). Prefijo "S/".
- Cierre: "¿No sabes cuál elegir? Escríbenos por WhatsApp y te ayudamos a elegir."

### Process (`Process.tsx`) — cómo trabajamos
- Título: "De idea a **automatización** en 4 pasos".
- Pasos: 01 Descubrimiento · 02 Diseño a medida · 03 Implementación (días, no meses) · 04 Crecimiento continuo.
- `AgentBentoGrid` (visual animado de método).
- Nube de integraciones (logos texto): WhatsApp · Facebook · Instagram · Yape · Plin · Google Calendar · Gmail.

### StatsBand (`StatsBand.tsx`) — banda oscura (slate-900)
- "MiBillar" — SaaS propio en producción.
- "99.9%" — Disponibilidad garantizada (contador animado; mantener frase por decisión del dueño aunque sea riesgo SLA).
- "24/7" — Agentes trabajando sin descanso.

### BentoSection (`BentoSection.tsx`) — "Cómo trabajamos / método"
- Título: "Nada de **cajas negras**".
- Sub: "Instrumentamos cada agente que construimos: qué respondió, cuánto costó y dónde falló. Así lo mejoramos mes a mes en vez de adivinar."
- 5 cards: "Dibujamos el flujo primero" · "Medimos lo que cuesta" · "Registramos cada paso" · "Le damos tu contexto" (span 2) · "Vigilamos las integraciones".

### Contact (`Contact.tsx`)
- Badge "Hablemos". Título: "Cuéntanos tu **proyecto**".
- Sub: "Conocemos de cerca el día a día de los negocios como el tuyo. Cuéntanos qué proceso te quita tiempo y te armamos una propuesta clara, sin lenguaje de consultora."
- "Atendemos en todo el Perú" (MapPin).
- Botón secundario: "O escríbenos por WhatsApp".
- **Formulario** (react-hook-form + zod, envía a Web3Forms): Nombre (mín 2) · Correo (email) · WhatsApp (opcional) · "¿Qué necesitas?" (mín 10, placeholder "Ej: quiero tomar pedidos por WhatsApp y una web para mi restaurante"). Submit "Enviar mensaje" → toast "¡Listo! Te escribimos pronto por WhatsApp o correo." Pie: "Sin spam. Respondemos el mismo día."

### CTA (`CTA.tsx`) — cierre + footer
- Badge "Primera consulta gratis". Título: "¿Listo para **empezar**?".
- Sub: "Te respondemos el mismo día con una propuesta concreta: qué haríamos, cuánto cuesta y en cuánto tiempo."
- Botones: "Escríbenos por WhatsApp" (teal) + "951 045 601" (tel).
- Footer: logo + "Systemic Solutions" · links (Servicios, Planes, Proceso, Caso MiBillar, Facturación, Contacto) · "© 2026 Systemic Solutions. Todos los derechos reservados."

## 5. Reglas duras de diseño (del dueño / repo)

1. **Español** en todo el copy y la UI.
2. **Mobile-first**; botones grandes (estilo táctil), texto mínimo.
3. **Sin jerga**: copy tipo "si sabes usar WhatsApp, sabes usar nuestra app".
4. **Identidad propia**: Systemic NO usa el verde de MiBillar como marca; teal+púrpura es su paleta.
5. **Animaciones sutiles** con framer-motion (entrada al scroll, contadores), sin recargar.
6. **Toda CTA** lleva a `wa.me/51951045601` o teléfono.
7. **No prometer** funciones inexistentes.
8. Frase "99.9% Disponibilidad garantizada" se mantiene por decisión del dueño (anotar riesgo SLA, no bloquear).
9. Decimales de precio `.90`/`.00` en tamaño menor (ya implementado en `Price`).

## 6. Entregable esperado

Landing page de una sola vista (`/`), responsive (móvil→desktop), deploy en Vercel, con las 11 secciones arriba en ese orden, copy en español y precios exactos (Presencia S/299.90, MiBillar S/39.90/mes, Automatización S/299+S/79/mes, Facturación S/60·90·140/mes). Mantener paleta teal/púrpura y el sistema solar del hero.
