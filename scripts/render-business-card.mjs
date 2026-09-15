import { createReadStream, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { once } from 'node:events';
import { createRequire } from 'node:module';

const require = createRequire('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js');
const { chromium } = require('playwright');
const publicDir = normalize('C:/Users/User/OneDrive/Documentos/SystemicSolutions-App/public');
const outputDir = join(publicDir, 'print');
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

const server = createServer((request, response) => {
  const requestPath = new URL(request.url, 'http://127.0.0.1').pathname.replace(/^[/\\]+/, '');
  const safePath = normalize(requestPath).replace(/^([.][.][\\/])+/, '');
  const filePath = join(publicDir, safePath || 'print/systemic-business-card.html');
  if (!filePath.startsWith(publicDir) || !existsSync(filePath)) {
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
  const page = await browser.newPage({ viewport: { width: 1134, height: 1322 }, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:${port}/print/systemic-business-card.html`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.locator('#front').screenshot({ path: join(outputDir, 'systemic-business-card-front.png') });
  await page.locator('#back').screenshot({ path: join(outputDir, 'systemic-business-card-back.png') });
  await page.pdf({
    path: join(outputDir, 'systemic-business-card-print.pdf'),
    width: '96mm',
    height: '56mm',
    printBackground: true,
    scale: 0.321,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  await browser.close();
  console.log(outputDir);
} finally {
  server.close();
}
