import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 3000);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = createServer(async (request, response) => {
  const requestPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const safePath = normalize(requestPath).replace(/^([.][.][/\\])+/, '');
  const relativePath = safePath === '/' ? '/index.html' : safePath;
  const filePath = safePath === '/manus-routes.json'
    ? join(root, 'public', 'manus-routes.json')
    : join(root, relativePath);

  try {
    const content = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': mime[extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    response.end(content);
  } catch {
    if (extname(relativePath)) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }
    const fallback = await readFile(join(root, 'index.html'));
    response.writeHead(200, { 'Content-Type': mime['.html'] });
    response.end(fallback);
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`odofolio listening on http://0.0.0.0:${port}`);
});
