/* Service worker da Maré Alta: guarda os arquivos do app para abrir mesmo sem internet. */
const VERSAO = 'mare-alta-v1';
const ARQUIVOS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  '../_selo.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSAO)
      // adiciona um por um: se algum falhar, os outros continuam no cache
      .then((cache) => Promise.all(ARQUIVOS.map((url) => cache.add(url).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((chaves) => Promise.all(chaves.filter((c) => c !== VERSAO).map((c) => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Páginas: tenta a rede primeiro (conteúdo sempre atualizado) e cai no cache se estiver offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => { const copia = res.clone(); caches.open(VERSAO).then((c) => c.put('./index.html', copia)); return res; })
        .catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  // Mesma origem e fontes do Google: responde do cache na hora e atualiza em segundo plano.
  const ehFonte = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (url.origin === self.location.origin || ehFonte) {
    e.respondWith(
      caches.open(VERSAO).then((cache) =>
        cache.match(req).then((emCache) => {
          const daRede = fetch(req)
            .then((res) => { if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()); return res; })
            .catch(() => emCache);
          return emCache || daRede;
        })
      )
    );
  }
});
