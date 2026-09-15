# Systemic Solutions — sitio web (systemic.pe)

Web corporativa de Systemic Solutions: software a medida, automatizacion e IA
para negocios en Peru. Tingo Maria, Peru.

Son **paginas estaticas**. No hay framework ni aplicacion: el navegador recibe
el HTML tal cual. La unica dependencia es Tailwind, que compila el CSS.

## Estructura

```
public/     El sitio. Se publica tal cual; todo lo que este aqui es publico.
  systemic-stitch.html    Home (servida en / segun routes de vercel.json)
  caso-mibillar.html      Caso MiBillar
  cosmic-core.js          Visual 3D del sector Servicios (modulo ES)
  systemic-stitch.css     GENERADO por npm run build - no editar a mano
styles/     Entrada de Tailwind (@tailwind base/components/utilities)
brand/      Material de marca interno: tarjeta, portadas, docs. NO se publica.
scripts/    Generadores de la tarjeta, las portadas y los PDFs comerciales
output/     Salida de scripts/ (PDFs, ZIP de imprenta). Fuera de git.
```

## Desarrollo

```bash
npm install
npm run dev     # recompila el CSS al vuelo
npm run serve   # sirve public/ en http://localhost:4173
```

`npm run build` regenera `public/systemic-stitch.css`. **Hay que ejecutarlo
cada vez que se anadan clases de Tailwind al HTML**, o esas clases no tendran
estilo: el CSS solo incluye las clases que Tailwind encuentra en los archivos
listados en `content` de `tailwind.stitch.config.cjs`.

## Deploy

Vercel corre `npm run build` y publica `public/`.

## Dependencias externas en runtime

`cosmic-core.js` importa Three.js desde `esm.sh` (~750 KB). Si ese CDN falla,
el visual 3D no aparece; el resto de la seccion funciona igual.

## Regla de contenido

Nada de metricas, testimonios ni nombres de clientes inventados. Nombrar a un
cliente requiere su permiso.
