# README — Systemic Solutions (sitio web corporativo)

Web corporativa de Systemic Solutions: agencia de software, IA y automatización
en Perú. Construida con React 19 + Vite 7 + TypeScript + Tailwind CSS + shadcn/ui
+ Framer Motion.

## Stack
- React 19, Vite 7, TypeScript
- Tailwind CSS v3 + shadcn/ui
- Framer Motion (animaciones)
- Vercel Web Analytics (`@vercel/analytics`, sin cookies)
- Deploy: Vercel (auto-deploy desde GitHub)

## Desarrollo local
```bash
npm install
npm run dev      # http://localhost:5173
```

## Build de producción
```bash
npm run build    # genera /dist
npm run preview  # sirve /dist localmente
```

## Deploy (Vercel + GitHub)
1. Subir este repo a GitHub (rama `main`).
2. En Vercel: "Import Git Repository" → seleccionar el repo.
3. Build settings se toman de `vercel.json` (build `npm run build`, output `dist`).
4. Habilitar "Analytics" en la pestaña del proyecto para ver métricas.
5. (Recomendado) Comprar y conectar dominio propio `systemic.pe` en
   Project → Settings → Domains de Vercel, y confirmar que `og:image` /
   `canonical` / `og:url` en `index.html` apuntan a `https://systemic.pe`.

## Notas de ingeniería
- `base: './'` en vite.config para assets relativos (compatible con cualquier host).
- `og:image` usa URL absoluta para vista previa en WhatsApp (ver comentario en index.html).
- Teléfono de contacto centralizado en `src/lib/contact.ts`.
- Code-splitting: react y framer-motion en chunks separados para menor TTI.

© 2026 Systemic Solutions. Todos los derechos reservados.
