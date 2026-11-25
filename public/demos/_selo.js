/*
  Selo de demonstração — aparece em todas as demos.
  Edite AGENCIA abaixo quando o nome e o número da agência estiverem definidos.
*/
(function () {
  var AGENCIA = {
    nome: 'Uridium',          // nome da agência
    whatsapp: '',                     // só números, ex.: '5527999998888' (vazio = o WhatsApp pergunta o contato)
    site: '../../',                   // volta para o site da agência
  };

  // o selo fica em /demos/_selo.js: o site da agência é a pasta acima dele (funciona também em /demos/para/<cliente>/)
  try { if (document.currentScript && document.currentScript.src) AGENCIA.site = new URL('../', document.currentScript.src).href; } catch (e) {}
  var demo = document.currentScript && document.currentScript.getAttribute('data-demo') || 'este projeto';
  var msg = 'Olá! Vi a demonstração "' + demo + '" e quero um site assim para o meu negócio.';
  var zap = 'https://wa.me/' + AGENCIA.whatsapp + '?text=' + encodeURIComponent(msg);

  var css = '' +
    '.selo-demo{position:fixed;left:12px;bottom:12px;z-index:2147483000;display:flex;align-items:center;gap:10px;' +
    'max-width:calc(100vw - 24px);padding:8px 8px 8px 14px;border-radius:999px;background:#0C0816ee;color:#F5F3FF;' +
    'font:500 13px/1.2 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;box-shadow:0 10px 30px -8px #0008;' +
    'border:1px solid #2A2240;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}' +
    '.selo-demo a{color:inherit;text-decoration:none}' +
    '.selo-demo .sd-tag{opacity:.75;white-space:nowrap}' +
    '.selo-demo .sd-cta{white-space:nowrap;padding:7px 12px;border-radius:999px;background:linear-gradient(90deg,#8B5CF6,#D946EF);font-weight:600}' +
    '.selo-demo .sd-x{all:unset;cursor:pointer;padding:4px 6px;opacity:.6}' +
    '@media (max-width:420px){.selo-demo .sd-tag span{display:none}}';

  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var el = document.createElement('div');
  el.className = 'selo-demo';
  el.setAttribute('role', 'note');
  el.innerHTML =
    '<a class="sd-tag" href="' + AGENCIA.site + '">Demonstração <span>· ' + AGENCIA.nome + '</span></a>' +
    '<a class="sd-cta" href="' + zap + '" target="_blank" rel="noopener">Quero um assim</a>' +
    '<button class="sd-x" aria-label="Esconder selo">✕</button>';
  el.querySelector('.sd-x').onclick = function () { el.remove(); };

  if (document.body) document.body.appendChild(el);
  else document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(el); });
})();
