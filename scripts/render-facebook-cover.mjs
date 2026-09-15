import { createReadStream, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js');
const { chromium } = require('playwright');

// Las piezas de marca viven en brand/, fuera de public/: son material interno
// y no deben publicarse en el sitio. Ruta derivada del script, no absoluta.
const brandDir = normalize(fileURLToPath(new URL('../brand/', import.meta.url)));
const outputPath = join(brandDir, 'social/systemic-facebook-cover-hd.png');
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

const server = createServer((request, response) => {
  const requestPath = new URL(request.url, 'http://127.0.0.1').pathname.replace(/^[/\\]+/, '');
  const safePath = normalize(requestPath).replace(/^([.][.][\\/])+/, '');
  const filePath = join(brandDir, safePath === '/' ? 'social/systemic-facebook-cover.html' : safePath);

  if (!filePath.startsWith(brandDir) || !existsSync(filePath)) {
    response.writeHead(404).end();
    return;
  }

  response.writeHead(200, { 'Content-Type': contentTypes[extname(filePath)] ?? 'application/octet-stream' });
  createReadStream(filePath).pipe(response);
});

server.listen(0, '127.0.0.1');
await once(server, 'listening');

try {
  const { port } = server.address();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 3280, height: 1248 }, deviceScaleFactor: 1 });
  const response = await page.goto(`http://127.0.0.1:${port}/social/systemic-facebook-cover.html`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: `
    html, body { width: 3280px !important; height: 1248px !important; }
    .cover { transform: scale(2); transform-origin: top left; }
  ` });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: outputPath, type: 'png' });
  await browser.close();
  console.log(outputPath);
} finally {
  server.close();
}
