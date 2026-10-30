// Static server that mimics GitHub Pages for e2e deep-link checks.
// vite preview has its own SPA fallback and never serves dist/404.html, so
// it cannot exercise the 404.html -> /?/path -> receiver round trip.
// Usage: node test/e2e/ghpages-server.mjs   (env: GHPAGES_PORT, default 4174)

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(SCRIPT_DIR, '..', '..', 'dist');
const PREFIX = '/community-box';
const PORT = Number(process.env.GHPAGES_PORT || 4174);

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.md': 'text/markdown; charset=utf-8',
  '.pdf': 'application/pdf',
};

function contentTypeFor(file) {
  return CONTENT_TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
}

async function isFile(p) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}

async function send404(res) {
  const body = await readFile(path.join(DIST_DIR, '404.html'));
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(body);
}

const server = createServer(async (req, res) => {
  try {
    const { pathname } = new URL(req.url || '/', 'http://localhost');
    let decoded;
    try {
      decoded = decodeURIComponent(pathname);
    } catch {
      return await send404(res);
    }

    // Everything must live under the project-page prefix, like GitHub Pages.
    if (decoded === PREFIX) {
      res.writeHead(301, { Location: `${PREFIX}/` });
      return res.end();
    }
    if (!decoded.startsWith(`${PREFIX}/`)) {
      return await send404(res);
    }

    const relative = decoded.slice(PREFIX.length + 1);
    const resolved = path.resolve(DIST_DIR, relative);
    if (resolved !== DIST_DIR && !resolved.startsWith(DIST_DIR + path.sep)) {
      return await send404(res);
    }

    let target = resolved;
    if (decoded.endsWith('/') || (await stat(resolved).then((s) => s.isDirectory(), () => false))) {
      target = path.join(resolved, 'index.html');
    }

    if (!(await isFile(target))) {
      return await send404(res);
    }

    const body = await readFile(target);
    res.writeHead(200, { 'Content-Type': contentTypeFor(target) });
    res.end(body);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Internal error: ${err.message}`);
  }
});

server.listen(PORT, () => {
  console.log(`ghpages-server listening on http://localhost:${PORT}${PREFIX}/ (dist: ${DIST_DIR})`);
});
