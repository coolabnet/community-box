// Static server that mimics GitHub Pages for e2e deep-link checks.
// vite preview has its own SPA fallback and never serves dist/404.html, so
// it cannot exercise the 404.html -> /?/path -> receiver round trip.
// Usage: node test/e2e/ghpages-server.mjs   (env: GHPAGES_PORT, default 4179)

import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(SCRIPT_DIR, '..', '..', 'dist');
const PREFIX = '/community-box';
const PORT = Number(process.env.GHPAGES_PORT || 4179);
const HOST = '127.0.0.1';

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.md': 'text/markdown; charset=utf-8',
  '.pdf': 'application/pdf',
};

function contentTypeFor(file) {
  return CONTENT_TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
}

async function send404(res) {
  const body = await readFile(path.join(DIST_DIR, '404.html'));
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(body);
}

// Resolve a request to a real file inside dist, or null. Symlinks are followed
// by realpath and rejected when they point outside the real dist directory.
async function resolveInsideDist(candidate, realDist) {
  let real;
  try {
    real = await realpath(candidate);
  } catch {
    return null;
  }
  if (real !== realDist && !real.startsWith(realDist + path.sep)) {
    return null;
  }
  const info = await stat(real);
  if (info.isDirectory()) {
    return resolveInsideDist(path.join(real, 'index.html'), realDist);
  }
  return info.isFile() ? real : null;
}

const REAL_DIST = await realpath(DIST_DIR);

const server = createServer(async (req, res) => {
  try {
    const { pathname } = new URL(req.url || '/', `http://${HOST}`);
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
    const lexical = path.resolve(DIST_DIR, relative);
    if (lexical !== DIST_DIR && !lexical.startsWith(DIST_DIR + path.sep)) {
      return await send404(res);
    }

    // Trailing slash means directory: serve its index.html.
    const candidate = decoded.endsWith('/') ? path.join(lexical, 'index.html') : lexical;
    const target = await resolveInsideDist(candidate, REAL_DIST);
    if (!target) {
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

server.on('error', (err) => {
  console.error(`ghpages-server failed on ${HOST}:${PORT}: ${err.code || err.message}`);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log(`ghpages-server listening on http://${HOST}:${PORT}${PREFIX}/ (dist: ${REAL_DIST})`);
});
