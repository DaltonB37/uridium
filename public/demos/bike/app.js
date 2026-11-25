/*
  Raio Bikes Elétricas — vitrine, comparador, calculadora de economia e agendamentos pelo WhatsApp (demonstração).
  HTML/CSS/JS puro. As bikes são desenhadas em SVG e mudam de cor de verdade.
*/
'use strict';

// Número de WhatsApp da loja: só dígitos, com DDI e DDD (ex.: '5527999998888').
// Deixe vazio para o WhatsApp abrir e a pessoa escolher o contato (bom para demonstração).
const WHATSAPP_NEGOCIO = '';

const LOJA = {
  nome: 'Raio Bikes Elétricas',
  curto: 'Raio Bikes',
  instagram: '@raiobikes.vv',
  endereco: 'Av. Champagnat, 1520 — Praia da Costa, Vila Velha/ES',
  mapa: 'Av. Champagnat, Praia da Costa, Vila Velha - ES',
};

const PARCELAS = 12; // exemplo de parcelamento exibido nos cards

const CATEGORIAS = ['Urbana', 'Dobrável', 'Cargo', 'Trilha', 'Patinete'];

/* Preços em centavos. Velocidade das bikes limitada a 32 km/h (pedal assistido, sem acelerador). */
const MODELOS = [
  {
    id: 'urbana-350', nome: 'Raio Urbana 350', cat: 'Urbana', forma: 'urbana', preco: 649000,
    selos: ['Para o dia a dia'], motor: 350, vel: 32, autonomia: 60, bateria: '36 V · 13 Ah (468 Wh)',
    peso: 24, recarga: '5 a 6 h', aro: '700c', extra: 'Paralamas, bagageiro e farol de LED',
    cores: [{ nome: 'Lima', hex: '#C8F542' }, { nome: 'Grafite', hex: '#4A525B' }, { nome: 'Branco gelo', hex: '#E6ECEE' }],
    desc: 'A bike para trocar o carro no trajeto de casa ao trabalho. Posição confortável, 5 níveis de assistência e bateria que sai do quadro para carregar em casa ou no escritório.',
  },
  {
    id: 'orla', nome: 'Raio Orla', cat: 'Urbana', forma: 'baixo', preco: 529000,
    selos: ['Quadro baixo', 'Novidade'], motor: 250, vel: 32, autonomia: 50, bateria: '36 V · 10,4 Ah (374 Wh)',
    peso: 22, recarga: '4 a 5 h', aro: '26"', extra: 'Cestinha, paralamas e descanso lateral',
    cores: [{ nome: 'Turquesa', hex: '#1FC8B9' }, { nome: 'Coral', hex: '#FF7A59' }, { nome: 'Areia', hex: '#D8C6A2' }],
    desc: 'Quadro baixo para subir e descer sem levantar a perna, de vestido ou de terno. Feita para passear pela orla e resolver a vida no bairro com a cestinha cheia.',
  },
  {
    id: 'dobra-20', nome: 'Raio Dobra 20', cat: 'Dobrável', forma: 'dobravel', preco: 479000,
    selos: ['Cabe no porta-malas'], motor: 250, vel: 32, autonomia: 40, bateria: '36 V · 7,8 Ah (281 Wh)',
    peso: 18, recarga: '3 a 4 h', aro: '20"', extra: 'Dobra no meio e no guidão',
    cores: [{ nome: 'Amarelo', hex: '#FFC83D' }, { nome: 'Preto fosco', hex: '#2A2F34' }, { nome: 'Prata', hex: '#B9C0C7' }],
    desc: 'Dobra em poucos segundos e vai no porta-malas, no elevador ou embaixo da mesa. Ótima para quem mora em apartamento pequeno ou combina carro e bike.',
  },
  {
    id: 'dobra-pro', nome: 'Raio Dobra Pro', cat: 'Dobrável', forma: 'dobravel', preco: 699000,
    selos: ['Bateria maior'], motor: 350, vel: 32, autonomia: 70, bateria: '48 V · 10,4 Ah (499 Wh)',
    peso: 20, recarga: '4 a 5 h', aro: '20"', extra: 'Freio a disco hidráulico e suspensão no garfo',
    cores: [{ nome: 'Azul elétrico', hex: '#3D7BFF' }, { nome: 'Verde menta', hex: '#8EE6C4' }, { nome: 'Grafite', hex: '#4A525B' }],
    desc: 'A dobrável para quem roda bastante: bateria de 48 V, freio hidráulico e suspensão para encarar o calçamento irregular sem sentir no punho.',
  },
  {
    id: 'carga', nome: 'Raio Carga Longtail', cat: 'Cargo', forma: 'cargo', preco: 1190000,
    selos: ['Leva garupa ou entregas'], motor: 350, vel: 32, autonomia: 65, bateria: '48 V · 14 Ah (672 Wh)',
    peso: 33, recarga: '6 a 7 h', aro: '24"', extra: 'Bagageiro longo para até 150 kg no total (ciclista + carga)',
    cores: [{ nome: 'Laranja', hex: '#FF8A2B' }, { nome: 'Verde-oliva', hex: '#8A9A3E' }, { nome: 'Grafite', hex: '#4A525B' }],
    desc: 'Bagageiro comprido para levar a criança na cadeirinha, as compras da semana ou as entregas do seu negócio. Rodas menores deixam o centro de gravidade baixo e a bike estável.',
  },
  {
    id: 'trilha-29', nome: 'Raio Trilha 29', cat: 'Trilha', forma: 'mtb', preco: 899000,
    selos: ['Suspensão dianteira'], motor: 350, vel: 32, autonomia: 80, bateria: '48 V · 14 Ah (672 Wh)',
    peso: 23, recarga: '5 a 6 h', aro: '29"', extra: 'Câmbio de 9 marchas e pneus de cravo',
    cores: [{ nome: 'Petróleo', hex: '#1F8A99' }, { nome: 'Vermelho', hex: '#E8453C' }, { nome: 'Preto', hex: '#30353A' }],
    desc: 'Para quem quer subir o Morro do Moreno pedalando e ainda voltar para casa com bateria. Garfo com suspensão, pneus de cravo e motor que ajuda de verdade na subida.',
  },
  {
    id: 'trilha-full', nome: 'Raio Trilha Full', cat: 'Trilha', forma: 'full', preco: 1490000,
    selos: ['Suspensão total'], motor: 350, vel: 32, autonomia: 90, bateria: '48 V · 17,5 Ah (840 Wh)',
    peso: 26, recarga: '6 a 7 h', aro: '29"', extra: 'Suspensão dianteira e traseira, freios hidráulicos de 4 pistões',
    cores: [{ nome: 'Lima', hex: '#C8F542' }, { nome: 'Titânio', hex: '#7D8791' }],
    desc: 'Topo de linha para trilha: suspensão na frente e atrás, a maior bateria da loja e freios fortes para as descidas de terra da região serrana.',
  },
  {
    id: 'fat', nome: 'Raio Fat Areia', cat: 'Trilha', forma: 'fat', preco: 849000,
    selos: ['Pneu de 4 polegadas'], motor: 350, vel: 32, autonomia: 60, bateria: '48 V · 13 Ah (624 Wh)',
    peso: 29, recarga: '5 a 6 h', aro: '26" × 4"', extra: 'Pneus largos para areia firme, terra e paralelepípedo',
    cores: [{ nome: 'Areia', hex: '#D8C6A2' }, { nome: 'Laranja', hex: '#FF8A2B' }, { nome: 'Preto', hex: '#30353A' }],
    desc: 'Pneus gordos que passam por cima de buraco, paralelepípedo e areia firme. Chama atenção por onde passa e é muito estável, mesmo para quem está voltando a pedalar.',
  },
  {
    id: 'kick-85', nome: 'Patinete Raio Kick 8.5', cat: 'Patinete', forma: 'patinete', preco: 269000,
    selos: ['Dobra em segundos'], motor: 350, vel: 25, autonomia: 25, bateria: '36 V · 7,8 Ah (281 Wh)',
    peso: 14, recarga: '4 a 5 h', aro: '8,5"', extra: 'Pneus maciços (não furam) e farol de LED',
    cores: [{ nome: 'Preto', hex: '#30353A' }, { nome: 'Branco', hex: '#E6ECEE' }, { nome: 'Lima', hex: '#C8F542' }],
    desc: 'Leve, dobrável e sem pneu para furar. Perfeito para o “último quilômetro”: do ponto de ônibus ao trabalho, ou do prédio até a padaria.',
  },
  {
    id: 'kick-max', nome: 'Patinete Raio Kick Max 10', cat: 'Patinete', forma: 'patineteMax', preco: 459000,
    selos: ['Suspensão dupla'], motor: 500, vel: 32, autonomia: 45, bateria: '48 V · 13 Ah (624 Wh)',
    peso: 21, recarga: '6 a 7 h', aro: '10"', extra: 'Suspensão na frente e atrás, freio a disco e seta',
    cores: [{ nome: 'Grafite', hex: '#4A525B' }, { nome: 'Turquesa', hex: '#1FC8B9' }],
    desc: 'Patinete parrudo, com rodas de 10 polegadas e suspensão dupla para rodar com conforto em trajetos maiores. Limitado a 32 km/h, como manda a regra.',
  },
];
const MODELOS_POR_ID = Object.fromEntries(MODELOS.map((m) => [m.id, m]));

/* Calculadora: valores padrão (a pessoa pode ajustar). São médias aproximadas, não preços oficiais. */
const PREMISSAS = [
  { id: 'gasolina', rotulo: 'Gasolina (R$ por litro)', valor: 6.39, passo: 0.01 },
  { id: 'carroKmL', rotulo: 'Carro: km por litro', valor: 11, passo: 0.5 },
  { id: 'motoKmL', rotulo: 'Moto: km por litro', valor: 35, passo: 1 },
  { id: 'passagem', rotulo: 'Passagem de ônibus (R$)', valor: 4.90, passo: 0.05 },
  { id: 'viagens', rotulo: 'Ônibus: passagens por dia', valor: 2, passo: 1 },
  { id: 'appKm', rotulo: 'Carro de app (R$ por km)', valor: 2.30, passo: 0.05 },
  { id: 'kwh', rotulo: 'Energia (R$ por kWh)', valor: 0.95, passo: 0.01 },
  { id: 'whKm', rotulo: 'Consumo da bike (Wh por km)', valor: 12, passo: 1 },
];

const TRANSPORTES = [
  { id: 'carro', nome: 'Carro', icone: '<path d="M5 16V12l2-5h10l2 5v4M5 16h14M5 16v2M19 16v2M3 11h2M19 11h2"/><circle cx="8" cy="13.5" r="1"/><circle cx="16" cy="13.5" r="1"/>' },
  { id: 'moto', nome: 'Moto', icone: '<circle cx="5.5" cy="16" r="3"/><circle cx="18.5" cy="16" r="3"/><path d="M5.5 16 10 10h5l3.5 6M13 7h3l-1 3"/>' },
  { id: 'onibus', nome: 'Ônibus', icone: '<rect x="5" y="3.5" width="14" height="14" rx="2"/><path d="M5 11h14M8 17.5V20M16 17.5V20"/><circle cx="8.5" cy="14.5" r=".8"/><circle cx="15.5" cy="14.5" r=".8"/>' },
  { id: 'app', nome: 'Carro de app', icone: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M10 18.5h4M9.5 9.5l2 2 3-3.5"/>' },
];

const SERVICOS = ['Revisão geral', 'Bateria não segura carga', 'Freios', 'Pneu ou câmara', 'Motor ou display', 'Ajuste de câmbio', 'Outro'];

/* ---------------------------------------------------------------- */
/* Utilidades                                                        */
/* ---------------------------------------------------------------- */

const fmtBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtBRL0 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const fmtNum = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

function formatarPreco(centavos) { return fmtBRL.format(centavos / 100); }
function parcela(m) { return `${PARCELAS}x de ${formatarPreco(Math.ceil(m.preco / PARCELAS))}`; }

function linkWhatsApp(texto) {
  const numero = String(WHATSAPP_NEGOCIO || '').replace(/\D/g, '');
  return numero
    ? `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
    : `https://wa.me/?text=${encodeURIComponent(texto)}`;
}

function escaparHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function hexParaRgb(hex) {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
function rgbParaHex(rgb) {
  return '#' + rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}
function misturar(a, b, t) {
  const A = hexParaRgb(a), B = hexParaRgb(b);
  return rgbParaHex(A.map((v, i) => v + (B[i] - v) * t));
}

/* ---------------------------------------------------------------- */
/* Ilustrações SVG das bikes                                         */
/* ---------------------------------------------------------------- */

const PNEU = '#15191C';
const ARO = '#68717B';
const RAIO = '#9AA3AD';
const PRETO = '#1B1F23';

function pt(p) { return `${p[0]} ${p[1]}`; }
function linha(a, b, cor, w) {
  return `<path d="M${pt(a)} L${pt(b)}" stroke="${cor}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;
}
function arco(cx, cy, r, a1, a2) {
  const rad = (a) => (a * Math.PI) / 180;
  const x1 = cx + r * Math.cos(rad(a1)), y1 = cy + r * Math.sin(rad(a1));
  const x2 = cx + r * Math.cos(rad(a2)), y2 = cy + r * Math.sin(rad(a2));
  const grande = Math.abs(a2 - a1) > 180 ? 1 : 0;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 ${grande} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

function roda(c, r, o) {
  o = o || {};
  const tw = o.fat ? 13 : o.cravo ? 8 : o.patinete ? 9 : 6;
  let raios = '';
  if (!o.patinete) {
    const n = o.fat ? 6 : 12;
    for (let i = 0; i < n; i++) {
      const a = (i * Math.PI * 2) / n;
      const x = c[0] + Math.cos(a) * (r - tw / 2 - 2), y = c[1] + Math.sin(a) * (r - tw / 2 - 2);
      raios += `<path d="M${c[0]} ${c[1]} L${x.toFixed(1)} ${y.toFixed(1)}" stroke="${RAIO}" stroke-width="${o.fat ? 3 : 1}" opacity=".55"/>`;
    }
  } else {
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5;
      raios += `<path d="M${c[0]} ${c[1]} L${(c[0] + Math.cos(a) * (r - 7)).toFixed(1)} ${(c[1] + Math.sin(a) * (r - 7)).toFixed(1)}" stroke="${ARO}" stroke-width="3" stroke-linecap="round"/>`;
    }
  }
  const cravo = o.cravo || o.fat
    ? `<circle cx="${c[0]}" cy="${c[1]}" r="${r + tw / 2 - 1}" fill="none" stroke="${PNEU}" stroke-width="3" stroke-dasharray="3 3.2"/>`
    : '';
  const cubo = o.motor
    ? `<circle cx="${c[0]}" cy="${c[1]}" r="${o.patinete ? 9 : 11}" fill="#2B3137" stroke="${ARO}" stroke-width="2"/><circle cx="${c[0]}" cy="${c[1]}" r="3" fill="${RAIO}"/>`
    : `<circle cx="${c[0]}" cy="${c[1]}" r="4" fill="${ARO}"/>`;
  return `<g class="roda">` +
    `<circle cx="${c[0]}" cy="${c[1]}" r="${r}" fill="none" stroke="${PNEU}" stroke-width="${tw}"/>` + cravo +
    `<circle cx="${c[0]}" cy="${c[1]}" r="${r - tw / 2 - 1}" fill="none" stroke="${ARO}" stroke-width="2.4"/>` +
    `<g class="roda-raios">${raios}<circle cx="${c[0]}" cy="${c[1]}" r="${r - tw / 2 - 1}" fill="none" stroke="none"/></g>` + cubo +
    `</g>`;
}

function bateria(a, b, frac, w) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  const L = len * frac;
  const mx = a[0] + dx * 0.5, my = a[1] + dy * 0.5;
  const h = w || 15;
  return `<g transform="translate(${mx.toFixed(1)} ${my.toFixed(1)}) rotate(${ang.toFixed(1)})">` +
    `<rect x="${(-L / 2).toFixed(1)}" y="${-h + 2}" width="${L.toFixed(1)}" height="${h}" rx="5" fill="${PRETO}"/>` +
    `<rect x="${(L / 2 - 16).toFixed(1)}" y="${-h + 6}" width="9" height="3" rx="1.5" fill="#C8F542"/>` +
    `<rect x="${(L / 2 - 28).toFixed(1)}" y="${-h + 6}" width="9" height="3" rx="1.5" fill="#C8F542" opacity=".7"/>` +
    `</g>`;
}

function guidao(ht, cor) {
  const topo = [ht[0] - 4, ht[1] - 16];
  return linha(ht, topo, PRETO, 6) +
    `<path d="M${pt(topo)} q-6 -4 -20 -2" stroke="${PRETO}" stroke-width="5" fill="none" stroke-linecap="round"/>` +
    `<rect x="${topo[0] - 30}" y="${topo[1] - 5}" width="12" height="7" rx="3.5" fill="#3A4047"/>` +
    `<rect x="${topo[0] - 6}" y="${topo[1] - 3}" width="10" height="6" rx="2" fill="#2B3137"/><rect x="${topo[0] - 4}" y="${topo[1] - 1.5}" width="6" height="3" rx="1" fill="#C8F542"/>`;
}

function selim(st, cor) {
  const topo = [st[0] - 5, st[1] - 16];
  return linha(st, topo, '#8A939C', 4.5) +
    `<path d="M${topo[0] - 16} ${topo[1] - 2} q4 -6 20 -4 q8 1 10 4 q-14 4 -30 0z" fill="${PRETO}"/>`;
}

function pedivela(bb) {
  return `<circle cx="${bb[0]}" cy="${bb[1]}" r="12" fill="none" stroke="#3A4047" stroke-width="3"/>` +
    linha(bb, [bb[0] + 9, bb[1] + 15], '#8A939C', 4.5) +
    `<rect x="${bb[0] + 3}" y="${bb[1] + 14}" width="14" height="4" rx="2" fill="${PRETO}"/>` +
    `<circle cx="${bb[0]}" cy="${bb[1]}" r="4" fill="#8A939C"/>`;
}

function corrente(bb, r) {
  return `<path d="M${bb[0]} ${bb[1] - 12} L${r[0]} ${r[1] - 6} M${bb[0]} ${bb[1] + 12} L${r[0]} ${r[1] + 6}" stroke="#4A525B" stroke-width="1.6" fill="none"/>`;
}

function farol(p) {
  return `<rect x="${p[0] + 2}" y="${p[1] - 4}" width="8" height="8" rx="2" fill="#2B3137"/><rect x="${p[0] + 8}" y="${p[1] - 3}" width="3" height="6" rx="1" fill="#FFF6C8"/>`;
}

const GEOM = {
  urbana: { R: [78, 140], F: [242, 140], r: 48, BB: [150, 144], ST: [134, 72], HT: [220, 66], HB: [226, 90], quadro: 'diamante', paralama: true, bagageiro: true },
  baixo: { R: [78, 142], F: [242, 142], r: 46, BB: [150, 146], ST: [138, 76], HT: [220, 66], HB: [226, 90], quadro: 'baixo', paralama: true, cesta: true },
  dobravel: { R: [92, 154], F: [230, 154], r: 34, BB: [158, 152], ST: [144, 96], HT: [216, 58], HB: [220, 92], quadro: 'dobravel', paralama: true, canoteAlto: true },
  cargo: { R: [80, 148], F: [256, 146], r: 40, BB: [172, 150], ST: [158, 82], HT: [236, 72], HB: [242, 96], quadro: 'diamante', cargo: true, paralama: true },
  mtb: { R: [76, 138], F: [244, 138], r: 50, BB: [148, 144], ST: [136, 80], HT: [222, 62], HB: [228, 86], quadro: 'diamante', cravo: true, suspensao: true },
  full: { R: [76, 138], F: [244, 138], r: 50, BB: [148, 144], ST: [138, 82], HT: [222, 62], HB: [228, 86], quadro: 'full', cravo: true, suspensao: true },
  fat: { R: [80, 138], F: [242, 138], r: 46, BB: [152, 142], ST: [138, 78], HT: [222, 64], HB: [228, 88], quadro: 'diamante', fat: true },
};

function desenharBike(m, corIdx, opts) {
  opts = opts || {};
  const cor = m.cores[corIdx] || m.cores[0];
  const C = cor.hex;
  const Cesc = misturar(C, '#000000', 0.35);
  const uid = 'b' + Math.random().toString(36).slice(2, 8);
  let corpo;
  if (m.forma === 'patinete' || m.forma === 'patineteMax') corpo = desenharPatinete(m, C, Cesc);
  else corpo = desenharQuadro(GEOM[m.forma], C, Cesc);
  const sombra = `<ellipse cx="160" cy="192" rx="128" ry="5" fill="url(#${uid}s)"/>`;
  const titulo = opts.titulo ? `<title>${escaparHtml(m.nome)} na cor ${escaparHtml(cor.nome)}</title>` : '';
  return `<svg class="bike-svg" viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" ${opts.titulo ? 'role="img"' : 'aria-hidden="true" focusable="false"'}>` + titulo +
    `<defs><radialGradient id="${uid}s"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>` +
    sombra + corpo + `</svg>`;
}

function desenharQuadro(g, C, Cesc) {
  const { R, F, r, BB, ST, HT, HB } = g;
  const W = 8; // espessura do tubo
  let s = '';
  const motor = { motor: true, cravo: g.cravo, fat: g.fat };

  // Paralamas e bagageiros atrás das rodas
  let fundo = '';
  if (g.paralama) {
    fundo += `<path d="${arco(R[0], R[1], r + 7, 185, 330)}" stroke="${Cesc}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    fundo += `<path d="${arco(F[0], F[1], r + 7, 205, 345)}" stroke="${Cesc}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  }
  if (g.bagageiro) {
    fundo += `<path d="M${R[0] - 14} ${R[1] - r - 10} H${ST[0] - 4}" stroke="${PRETO}" stroke-width="4" stroke-linecap="round"/>` +
      linha([R[0] - 6, R[1] - r - 10], R, PRETO, 3);
  }
  if (g.cargo) {
    const y = R[1] - r - 12;
    fundo += `<rect x="${R[0] - 44}" y="${y - 4}" width="${ST[0] - R[0] + 40}" height="8" rx="3" fill="${PRETO}"/>` +
      linha([R[0] - 30, y], [R[0] - 10, R[1]], PRETO, 3.5) + linha([R[0] + 30, y], R, PRETO, 3.5) +
      `<rect x="${R[0] - 40}" y="${y + 8}" width="64" height="26" rx="6" fill="${Cesc}" opacity=".9"/>` +
      `<path d="M${R[0] - 34} ${y + 16} h52" stroke="${C}" stroke-width="2" opacity=".7"/>` +
      `<path d="M${R[0] - 12} ${R[1] + r - 4} h34" stroke="${PRETO}" stroke-width="4" stroke-linecap="round"/>`;
  }
  s += fundo;
  s += roda(R, r, motor) + roda(F, r, { cravo: g.cravo, fat: g.fat });
  s += corrente(BB, R);

  // Quadro
  const stTopo = ST;
  if (g.quadro === 'diamante') {
    s += linha(R, BB, Cesc, W - 2) + linha(R, stTopo, Cesc, W - 2);
    s += linha(BB, ST, C, W) + linha(ST, HT, C, W) + linha(BB, HB, C, W + 3);
    s += bateria(BB, HB, 0.62);
  } else if (g.quadro === 'baixo') {
    s += linha(R, BB, Cesc, W - 2) + linha(R, ST, Cesc, W - 2);
    s += linha(BB, ST, C, W);
    s += `<path d="M${BB[0] - 6} ${BB[1] - 4} C${BB[0] + 30} ${BB[1] - 6}, ${HB[0] - 40} ${HB[1] + 40}, ${pt(HB)}" stroke="${C}" stroke-width="${W + 4}" fill="none" stroke-linecap="round"/>`;
    s += bateria([BB[0] + 2, BB[1] - 6], [BB[0] + 44, BB[1] - 26], 1.1, 13);
  } else if (g.quadro === 'dobravel') {
    const base = [BB[0] - 6, BB[1] - 16];
    s += linha(R, BB, Cesc, W - 2) + linha(R, [ST[0] + 2, ST[1] + 10], Cesc, W - 2);
    s += linha(BB, ST, C, W) + linha(base, HB, C, W + 4);
    s += bateria(base, HB, 0.5, 13);
    const meio = [(base[0] + HB[0]) / 2, (base[1] + HB[1]) / 2];
    s += `<circle cx="${meio[0]}" cy="${meio[1] + 1}" r="6" fill="${PRETO}" stroke="#8A939C" stroke-width="2"/>`;
  } else if (g.quadro === 'full') {
    const piv = [BB[0] + 4, BB[1] - 22];
    const meioTop = [ST[0] + (HT[0] - ST[0]) * 0.42, ST[1] + (HT[1] - ST[1]) * 0.42];
    s += `<path d="M${pt(R)} L${BB[0] + 4} ${BB[1] - 6} L${pt(piv)} L${ST[0] - 8} ${ST[1] + 24} Z" stroke="${Cesc}" stroke-width="${W - 2}" fill="none" stroke-linejoin="round"/>`;
    s += linha(BB, ST, C, W) + linha(ST, HT, C, W) + linha(BB, HB, C, W + 3);
    s += `<path d="M${pt(meioTop)} L${ST[0] - 4} ${ST[1] + 22}" stroke="${PRETO}" stroke-width="7" stroke-linecap="round"/>` +
      `<path d="M${meioTop[0] - 3} ${meioTop[1] + 6} L${ST[0] - 1} ${ST[1] + 16}" stroke="#E8453C" stroke-width="3" stroke-linecap="round"/>`;
    s += bateria(BB, HB, 0.6);
  }
  if (g.cesta) {
    s += `<path d="M${HT[0] + 6} ${HT[1] - 2} h26 l-4 22 h-20 z" fill="none" stroke="${Cesc}" stroke-width="3" stroke-linejoin="round"/>` +
      `<path d="M${HT[0] + 10} ${HT[1] + 7} h20 M${HT[0] + 14} ${HT[1] - 2} v22 M${HT[0] + 22} ${HT[1] - 2} v22" stroke="${Cesc}" stroke-width="1.5"/>`;
  }

  // Garfo
  if (g.suspensao) {
    const meioF = [HB[0] + (F[0] - HB[0]) * 0.45, HB[1] + (F[1] - HB[1]) * 0.45];
    s += linha(HB, meioF, PRETO, 9) + linha(meioF, F, '#B9C0C7', 5);
  } else {
    s += `<path d="M${pt(HB)} Q${HB[0] + 8} ${(HB[1] + F[1]) / 2} ${pt(F)}" stroke="${g.quadro === 'dobravel' ? C : Cesc}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  }
  s += linha(HT, HB, C, W + 2);
  s += farol([HB[0], HB[1] - 12]);
  s += guidao(HT, C);
  s += selim(g.canoteAlto ? [ST[0] - 4, ST[1] - 30] : ST, C);
  if (g.canoteAlto) s += linha(ST, [ST[0] - 4, ST[1] - 30], '#8A939C', 4.5);
  s += pedivela(BB);
  return s;
}

function desenharPatinete(m, C, Cesc) {
  const max = m.forma === 'patineteMax';
  const r = max ? 26 : 22;
  const R = [66, 186 - r], F = [254, 186 - r];
  const yDeck = R[1] - 8;
  let s = '';
  // paralama traseiro
  s += `<path d="${arco(R[0], R[1], r + 6, 190, 320)}" stroke="${Cesc}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  s += roda(R, r, { patinete: true, motor: !max }) + roda(F, r, { patinete: true, motor: max });
  // deck e bateria
  s += `<path d="M${R[0] + 6} ${yDeck + 6} L${R[0] + 20} ${yDeck - 6} H${F[0] - 42} L${F[0] - 30} ${yDeck + 6} Z" fill="${C}"/>`;
  s += `<rect x="${R[0] + 22}" y="${yDeck - 10}" width="${F[0] - R[0] - 66}" height="5" rx="2.5" fill="${PRETO}"/>`;
  s += `<rect x="${R[0] + 30}" y="${yDeck + 6}" width="${F[0] - R[0] - 80}" height="8" rx="3" fill="${PRETO}"/>`;
  s += `<rect x="${F[0] - 66}" y="${yDeck - 2}" width="10" height="3" rx="1.5" fill="#C8F542"/>`;
  if (max) {
    s += linha([R[0] + 18, yDeck - 2], [R[0] + 4, R[1] - 2], PRETO, 6) +
      `<path d="M${R[0] + 16} ${yDeck - 4} l-6 -6" stroke="#E8453C" stroke-width="4" stroke-linecap="round"/>`;
  } else {
    s += linha([R[0] + 18, yDeck], R, Cesc, 5);
  }
  // coluna (garfo + mastro)
  const base = [F[0] - 30, yDeck + 2];
  const topo = [F[0] - 14, 34];
  s += linha(base, [F[0] - 8, F[1] - 4], Cesc, 7) + linha([F[0] - 8, F[1] - 4], F, PRETO, 5);
  if (max) s += linha([F[0] - 22, yDeck - 30], [F[0] - 8, F[1] - 4], '#B9C0C7', 5);
  s += linha(base, topo, C, 9);
  s += `<circle cx="${base[0] + 2}" cy="${base[1] - 18}" r="5" fill="${PRETO}" stroke="#8A939C" stroke-width="2"/>`;
  s += farol([topo[0] + 2, topo[1] + 40]);
  // guidão (visto de lado)
  s += `<path d="M${topo[0] - 2} ${topo[1]} h-20" stroke="${PRETO}" stroke-width="6" stroke-linecap="round"/>` +
    `<rect x="${topo[0] - 4}" y="${topo[1] - 5}" width="14" height="8" rx="2" fill="#2B3137"/><rect x="${topo[0] - 1}" y="${topo[1] - 3}" width="8" height="4" rx="1" fill="#C8F542"/>` +
    `<circle cx="${topo[0] - 22}" cy="${topo[1]}" r="5" fill="#3A4047"/>`;
  return s;
}

/* ---------------------------------------------------------------- */
/* App                                                               */
/* ---------------------------------------------------------------- */

(function iniciar() {
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const reduzMovimento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const estado = {
    filtros: { cat: 'Todas', preco: '', ordem: 'destaque' },
    cor: {}, // id -> índice da cor escolhida
    comparar: [],
    modal: null,
    calc: { km: 14, dias: 22, transporte: 'carro', modelo: 'urbana-350', premissas: Object.fromEntries(PREMISSAS.map((p) => [p.id, p.valor])) },
    trDia: null,
  };

  /* ---------- Toasts ---------- */
  const toasts = $('#toasts');
  function toast(msg) {
    const aberto = $$('dialog[open]').pop();
    (aberto || document.body).appendChild(toasts);
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    toasts.appendChild(el);
    setTimeout(() => el.classList.add('sai'), 3000);
    setTimeout(() => el.remove(), 3400);
  }

  function abrirWhatsApp(texto) {
    const url = linkWhatsApp(texto);
    const w = window.open(url, '_blank', 'noopener');
    if (!w) window.location.href = url;
  }

  /* ---------- Links fixos ---------- */
  const saudacao = `Olá, ${LOJA.curto}! Vim pelo site e queria tirar uma dúvida.`;
  ['#topo-zap', '#zap-flutuante', '#loja-zap'].forEach((s) => { $(s).href = linkWhatsApp(saudacao); });
  $('#loja-mapa').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(LOJA.mapa);
  $('#loja-endereco').textContent = LOJA.endereco;
  $('#rodape-endereco').textContent = LOJA.endereco;
  $('#rodape-insta').textContent = LOJA.instagram;

  /* ---------- Hero ---------- */
  const heroModelo = MODELOS_POR_ID['urbana-350'];
  $('#hero-bike').innerHTML = desenharBike(heroModelo, 0);
  $('#hero-nome').textContent = `${heroModelo.nome} · ${formatarPreco(heroModelo.preco)}`;

  /* ---------- Filtros ---------- */
  const catsEl = $('#filtro-cats');
  catsEl.innerHTML = ['Todas'].concat(CATEGORIAS).map((c) =>
    `<button type="button" class="chip" data-cat="${c}" aria-pressed="${c === 'Todas'}">${c}${c === 'Todas' ? '' : ` <span class="chip-qtd">${MODELOS.filter((m) => m.cat === c).length}</span>`}</button>`).join('');
  catsEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    estado.filtros.cat = b.dataset.cat;
    renderGrade();
  });
  $('#filtro-preco').addEventListener('change', (e) => { estado.filtros.preco = e.target.value; renderGrade(); });
  $('#filtro-ordem').addEventListener('change', (e) => { estado.filtros.ordem = e.target.value; renderGrade(); });
  $('#limpar-filtros').addEventListener('click', () => {
    estado.filtros = { cat: 'Todas', preco: '', ordem: 'destaque' };
    $('#filtro-preco').value = '';
    $('#filtro-ordem').value = 'destaque';
    renderGrade();
  });

  function filtrar() {
    const f = estado.filtros;
    let lista = MODELOS.filter((m) => {
      if (f.cat !== 'Todas' && m.cat !== f.cat) return false;
      const reais = m.preco / 100;
      if (f.preco === 'ate5' && reais > 5000) return false;
      if (f.preco === '5a9' && (reais < 5000 || reais > 9000)) return false;
      if (f.preco === 'acima9' && reais <= 9000) return false;
      return true;
    });
    const ord = {
      menor: (a, b) => a.preco - b.preco,
      maior: (a, b) => b.preco - a.preco,
      autonomia: (a, b) => b.autonomia - a.autonomia,
      leve: (a, b) => a.peso - b.peso,
    }[f.ordem];
    if (ord) lista = lista.slice().sort(ord);
    return lista;
  }

  /* ---------- Grade ---------- */
  const grade = $('#grade');

  function iconeSpec(tipo) {
    const d = {
      autonomia: '<path d="M7 4h7l3 3v13H7z"/><path d="M10 10h4M10 14h4"/>',
      vel: '<path d="M4 15a8 8 0 1 1 16 0"/><path d="M12 15l4-5"/>',
      peso: '<path d="M6 9h12l2 11H4z"/><circle cx="12" cy="6" r="2.5"/>',
    }[tipo];
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  }

  function cardHtml(m) {
    const ci = estado.cor[m.id] || 0;
    const noComp = estado.comparar.includes(m.id);
    return `<article class="card" data-id="${m.id}" style="--cor:${m.cores[ci].hex}">
      <button type="button" class="card-arte" data-abrir="${m.id}" aria-label="Ver detalhes de ${escaparHtml(m.nome)}">
        <span class="card-brilho" aria-hidden="true"></span>
        ${desenharBike(m, ci)}
      </button>
      <div class="card-corpo">
        <div class="selos">${m.selos.map((s) => `<span class="selo">${escaparHtml(s)}</span>`).join('')}</div>
        <p class="card-cat">${m.cat} · motor ${m.motor} W</p>
        <h3 class="card-nome">${escaparHtml(m.nome)}</h3>
        <ul class="specs">
          <li>${iconeSpec('autonomia')}<span><strong>até ${m.autonomia} km</strong> autonomia</span></li>
          <li>${iconeSpec('vel')}<span><strong>${m.vel} km/h</strong> máx.</span></li>
          <li>${iconeSpec('peso')}<span><strong>${m.peso} kg</strong></span></li>
        </ul>
        <div class="card-cores" role="group" aria-label="Cores de ${escaparHtml(m.nome)}">
          ${m.cores.map((c, i) => `<button type="button" class="bolinha" style="--c:${c.hex}" data-cor="${i}" aria-pressed="${i === ci}" aria-label="${escaparHtml(c.nome)}" title="${escaparHtml(c.nome)}"></button>`).join('')}
          <span class="cor-nome">${escaparHtml(m.cores[ci].nome)}</span>
        </div>
        <div class="card-preco">
          <p class="preco">${formatarPreco(m.preco)}</p>
          <p class="parcela">ou ${parcela(m)} <span>(exemplo)</span></p>
        </div>
        <div class="card-acoes">
          <button type="button" class="btn btn-primario btn-pequeno" data-abrir="${m.id}">Ver detalhes</button>
          <button type="button" class="btn btn-comparar btn-pequeno" data-comparar="${m.id}" aria-pressed="${noComp}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l4 4 10-10"/></svg>Comparar
          </button>
        </div>
      </div>
    </article>`;
  }

  function renderGrade() {
    const lista = filtrar();
    $$('[data-cat]', catsEl).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === estado.filtros.cat)));
    grade.innerHTML = lista.length
      ? lista.map(cardHtml).join('')
      : '<p class="vazio">Nenhum modelo nessa faixa. Tente outro filtro ou chame a gente no WhatsApp: às vezes tem modelo chegando.</p>';
    $('#resultado-qtd').textContent = `${lista.length} ${lista.length === 1 ? 'modelo' : 'modelos'}`;
    const filtrado = estado.filtros.cat !== 'Todas' || estado.filtros.preco || estado.filtros.ordem !== 'destaque';
    $('#limpar-filtros').hidden = !filtrado;
  }

  grade.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    const id = card.dataset.id;
    const m = MODELOS_POR_ID[id];
    const corBtn = e.target.closest('[data-cor]');
    if (corBtn) {
      const i = Number(corBtn.dataset.cor);
      estado.cor[id] = i;
      card.style.setProperty('--cor', m.cores[i].hex);
      $('.card-arte', card).innerHTML = '<span class="card-brilho" aria-hidden="true"></span>' + desenharBike(m, i);
      $$('[data-cor]', card).forEach((b) => b.setAttribute('aria-pressed', String(b === corBtn)));
      $('.cor-nome', card).textContent = m.cores[i].nome;
      return;
    }
    if (e.target.closest('[data-abrir]')) { abrirModal(id); return; }
    if (e.target.closest('[data-comparar]')) alternarComparar(id);
  });

  /* ---------- Comparar ---------- */
  const barra = $('#comparar-barra');
  function alternarComparar(id) {
    const i = estado.comparar.indexOf(id);
    if (i >= 0) estado.comparar.splice(i, 1);
    else if (estado.comparar.length >= 2) { toast('Dá para comparar dois modelos por vez. Tire um para colocar outro.'); return; }
    else estado.comparar.push(id);
    atualizarComparar();
  }
  function atualizarComparar() {
    $$('[data-comparar]', grade).forEach((b) => b.setAttribute('aria-pressed', String(estado.comparar.includes(b.dataset.comparar))));
    const n = estado.comparar.length;
    barra.hidden = n === 0;
    document.body.classList.toggle('com-barra', n > 0);
    const nomes = estado.comparar.map((id) => MODELOS_POR_ID[id].nome);
    $('#comparar-texto').innerHTML = n === 1
      ? `<strong>${escaparHtml(nomes[0])}</strong> <span>Escolha mais um</span>`
      : `<strong>${escaparHtml(nomes[0])}</strong> <span>×</span> <strong>${escaparHtml(nomes[1] || '')}</strong>`;
    $('#comparar-abrir').disabled = n < 2;
  }
  $('#comparar-limpar').addEventListener('click', () => { estado.comparar = []; atualizarComparar(); });
  $('#comparar-abrir').addEventListener('click', abrirComparacao);

  function abrirComparacao() {
    const [a, b] = estado.comparar.map((id) => MODELOS_POR_ID[id]);
    if (!a || !b) return;
    const melhor = (va, vb, maior) => (va === vb ? ['', ''] : (maior ? va > vb : va < vb) ? ['ganha', ''] : ['', 'ganha']);
    const linhas = [
      ['Preço', formatarPreco(a.preco), formatarPreco(b.preco), melhor(a.preco, b.preco, false)],
      ['Categoria', a.cat, b.cat, ['', '']],
      ['Autonomia', `até ${a.autonomia} km`, `até ${b.autonomia} km`, melhor(a.autonomia, b.autonomia, true)],
      ['Velocidade máx.', `${a.vel} km/h`, `${b.vel} km/h`, ['', '']],
      ['Motor', `${a.motor} W`, `${b.motor} W`, ['', '']],
      ['Bateria', a.bateria, b.bateria, ['', '']],
      ['Peso', `${a.peso} kg`, `${b.peso} kg`, melhor(a.peso, b.peso, false)],
      ['Recarga', a.recarga, b.recarga, ['', '']],
      ['Aro', a.aro, b.aro, ['', '']],
      ['Destaque', a.extra, b.extra, ['', '']],
    ];
    const col = (m) => `<th scope="col"><div class="comp-arte">${desenharBike(m, estado.cor[m.id] || 0)}</div><span>${escaparHtml(m.nome)}</span></th>`;
    $('#comp-tabela').innerHTML = `<table>
      <caption class="visualmente-oculto">Comparação entre ${escaparHtml(a.nome)} e ${escaparHtml(b.nome)}</caption>
      <thead><tr><td></td>${col(a)}${col(b)}</tr></thead>
      <tbody>${linhas.map(([r, va, vb, g]) => `<tr><th scope="row">${r}</th><td class="${g[0]}">${escaparHtml(va)}</td><td class="${g[1]}">${escaparHtml(vb)}</td></tr>`).join('')}</tbody>
      <tfoot><tr><td></td>${[a, b].map((m) => `<td><button type="button" class="btn btn-linha btn-pequeno btn-cheio" data-comp-abrir="${m.id}">Ver e escolher cor</button></td>`).join('')}</tr></tfoot>
    </table>
    <p class="nota">Em destaque: o mais barato, o de maior autonomia e o mais leve.</p>`;
    abrirDialog($('#modal-comp'));
  }
  $('#comp-tabela').addEventListener('click', (e) => {
    const b = e.target.closest('[data-comp-abrir]');
    if (!b) return;
    $('#modal-comp').close();
    abrirModal(b.dataset.compAbrir);
  });

  /* ---------- Dialogs ---------- */
  function abrirDialog(d) {
    if (typeof d.showModal === 'function') { if (!d.open) d.showModal(); }
    else d.setAttribute('open', '');
  }
  $$('dialog').forEach((d) => {
    d.addEventListener('click', (e) => {
      if (e.target === d || e.target.closest('[data-fechar]')) d.close();
    });
  });

  /* ---------- Modal de detalhe ---------- */
  const modal = $('#modal');
  function abrirModal(id) {
    const m = MODELOS_POR_ID[id];
    estado.modal = { id, cor: estado.cor[id] || 0 };
    $('#modal-cat').textContent = `${m.cat} · motor ${m.motor} W`;
    $('#modal-titulo').textContent = m.nome;
    $('#modal-selos').innerHTML = m.selos.map((s) => `<span class="selo">${escaparHtml(s)}</span>`).join('');
    $('#modal-desc').textContent = m.desc;
    $('#modal-cores').innerHTML = m.cores.map((c, i) =>
      `<label class="cor-op"><input type="radio" name="modal-cor" value="${i}" ${i === estado.modal.cor ? 'checked' : ''}><span class="bolinha" style="--c:${c.hex}"></span><span class="visualmente-oculto">${escaparHtml(c.nome)}</span></label>`).join('');
    const ficha = [
      ['Autonomia', `até ${m.autonomia} km*`],
      ['Velocidade máx.', `${m.vel} km/h`],
      ['Motor', `${m.motor} W`],
      ['Bateria', m.bateria],
      ['Peso', `${m.peso} kg`],
      ['Recarga', m.recarga],
      ['Aro', m.aro],
      ['Vem com', m.extra],
    ];
    $('#modal-ficha').innerHTML = ficha.map(([k, v]) => `<div><dt>${k}</dt><dd>${escaparHtml(v)}</dd></div>`).join('') +
      `<p class="ficha-nota">*Autonomia depende do peso, do relevo e do nível de assistência.${m.cat === 'Patinete' ? ' Patinete elétrico: até 32 km/h, sem placa e sem CNH.' : ' Pedal assistido, sem acelerador.'}</p>`;
    $('#modal-preco').textContent = formatarPreco(m.preco);
    $('#modal-parcela').innerHTML = `ou em até ${parcela(m)} <span>(exemplo de parcelamento; condições combinadas no atendimento)</span>`;
    atualizarCorModal();
    abrirDialog(modal);
  }
  function atualizarCorModal() {
    const m = MODELOS_POR_ID[estado.modal.id];
    const c = m.cores[estado.modal.cor];
    $('#modal-arte').style.setProperty('--cor', c.hex);
    $('#modal-arte').innerHTML = desenharBike(m, estado.modal.cor, { titulo: true });
    $('#modal-cor-nome').textContent = c.nome;
  }
  $('#modal-cores').addEventListener('change', (e) => {
    if (e.target.name !== 'modal-cor') return;
    estado.modal.cor = Number(e.target.value);
    estado.cor[estado.modal.id] = estado.modal.cor;
    atualizarCorModal();
    renderGrade();
  });
  $('#modal-quero').addEventListener('click', () => {
    const m = MODELOS_POR_ID[estado.modal.id];
    const c = m.cores[estado.modal.cor];
    abrirWhatsApp(`Olá, ${LOJA.curto}! Quero a *${m.nome}* na cor *${c.nome}* (${formatarPreco(m.preco)}).\nVi no site a opção de ${parcela(m)}. Pode me passar as condições de pagamento e se tem pronta entrega?`);
  });
  $('#modal-tr').addEventListener('click', () => {
    $('#tr-modelo').value = estado.modal.id;
    modal.close();
    const alvo = $('#test-ride');
    alvo.scrollIntoView({ behavior: reduzMovimento ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => $('#tr-nome').focus({ preventScroll: true }), reduzMovimento ? 0 : 500);
  });

  /* ---------- Calculadora ---------- */
  const transpEl = $('#calc-transportes');
  transpEl.innerHTML = TRANSPORTES.map((t) =>
    `<label class="transp"><input type="radio" name="calc-transp" value="${t.id}" ${t.id === estado.calc.transporte ? 'checked' : ''}><span><svg viewBox="0 0 24 24" aria-hidden="true">${t.icone}</svg>${t.nome}</span></label>`).join('');
  $('#premissas-campos').innerHTML = PREMISSAS.map((p) =>
    `<label class="campo campo-mini"><span>${p.rotulo}</span><input type="number" inputmode="decimal" min="0" step="${p.passo}" value="${p.valor}" data-premissa="${p.id}"></label>`).join('') +
    `<button type="button" class="link-btn" id="premissas-reset">Voltar aos valores padrão</button>`;
  const selModelo = $('#calc-modelo');
  selModelo.innerHTML = MODELOS.map((m) => `<option value="${m.id}">${escaparHtml(m.nome)} · ${fmtBRL0.format(m.preco / 100)}</option>`).join('');
  selModelo.value = estado.calc.modelo;

  const kmRange = $('#calc-km-range'), kmNum = $('#calc-km');
  kmRange.addEventListener('input', () => { kmNum.value = kmRange.value; estado.calc.km = Number(kmRange.value); calcular(); });
  kmNum.addEventListener('input', () => {
    const v = Math.max(0, Math.min(150, Number(kmNum.value) || 0));
    estado.calc.km = v;
    kmRange.value = String(Math.min(80, Math.max(2, v)));
    calcular();
  });
  $('#calc-dias').addEventListener('change', (e) => { estado.calc.dias = Number(e.target.value); calcular(); });
  transpEl.addEventListener('change', (e) => { estado.calc.transporte = e.target.value; calcular(); });
  selModelo.addEventListener('change', (e) => { estado.calc.modelo = e.target.value; calcular(); });
  $('#premissas-campos').addEventListener('input', (e) => {
    const id = e.target.dataset.premissa;
    if (!id) return;
    const v = parseFloat(String(e.target.value).replace(',', '.'));
    estado.calc.premissas[id] = isFinite(v) && v >= 0 ? v : 0;
    calcular();
  });
  $('#premissas-campos').addEventListener('click', (e) => {
    if (e.target.id !== 'premissas-reset') return;
    PREMISSAS.forEach((p) => { estado.calc.premissas[p.id] = p.valor; $(`[data-premissa="${p.id}"]`).value = p.valor; });
    calcular();
  });

  function contaAtual() {
    const { km, dias, transporte: t, premissas: P } = estado.calc;
    const kmMes = km * dias;
    if (t === 'carro') return P.carroKmL > 0 ? (kmMes / P.carroKmL) * P.gasolina : 0;
    if (t === 'moto') return P.motoKmL > 0 ? (kmMes / P.motoKmL) * P.gasolina : 0;
    if (t === 'onibus') return P.viagens * P.passagem * dias;
    return kmMes * P.appKm;
  }

  let ultimoCalculo = null;
  function calcular() {
    const { km, dias, transporte, premissas: P, modelo } = estado.calc;
    const m = MODELOS_POR_ID[modelo];
    const kmMes = km * dias;
    const atual = contaAtual();
    const kwhMes = (kmMes * P.whKm) / 1000;
    const bike = kwhMes * P.kwh;
    const economia = Math.max(0, atual - bike);
    const recargas = m.autonomia > 0 ? Math.ceil(kmMes / (m.autonomia * 0.8)) : 0; // usa 80% da autonomia, por segurança
    const meses = economia > 0 ? Math.ceil((m.preco / 100) / economia) : null;
    const nomeT = TRANSPORTES.find((t) => t.id === transporte).nome.toLowerCase();
    ultimoCalculo = { km, dias, nomeT, atual, bike, economia, m, meses, kmMes };

    $('#res-mes').textContent = fmtBRL0.format(economia);
    $('#res-ano').textContent = economia > 0 ? `cerca de ${fmtBRL0.format(economia * 12)} por ano` : 'Coloque os seus números para ver a conta.';
    $('#res-lista').innerHTML =
      `<div><dt>Hoje, de ${nomeT}</dt><dd>${fmtBRL.format(atual)}/mês</dd></div>` +
      `<div><dt>Recarga da bike (${fmtNum.format(kwhMes)} kWh)</dt><dd>${fmtBRL.format(bike)}/mês</dd></div>` +
      `<div><dt>Distância no mês</dt><dd>${fmtNum.format(kmMes)} km</dd></div>`;
    const max = Math.max(atual, bike, 1);
    $('#res-barras').innerHTML =
      `<div class="barra"><span class="barra-rot">${TRANSPORTES.find((t) => t.id === transporte).nome}</span><span class="barra-trilho"><span class="barra-fill barra-atual" style="width:${Math.max(2, (atual / max) * 100)}%"></span></span></div>` +
      `<div class="barra"><span class="barra-rot">Bike elétrica</span><span class="barra-trilho"><span class="barra-fill barra-bike" style="width:${Math.max(2, (bike / max) * 100)}%"></span></span></div>`;
    $('#res-paga').innerHTML = meses
      ? `Com essa economia, a <strong>${escaparHtml(m.nome)}</strong> (${fmtBRL0.format(m.preco / 100)}) se paga em <strong>cerca de ${meses} ${meses === 1 ? 'mês' : 'meses'}</strong>. Você carregaria a bateria umas <strong>${recargas} ${recargas === 1 ? 'vez' : 'vezes'}</strong> por mês.`
      : 'Com esses números a bike não gera economia em dinheiro, mas ainda ganha em tempo, saúde e vaga.';

    $('#premissas-lista').innerHTML = [
      `Carro: ${fmtNum.format(P.carroKmL)} km/l · Moto: ${fmtNum.format(P.motoKmL)} km/l · Gasolina a ${fmtBRL.format(P.gasolina)}`,
      `Ônibus: ${fmtNum.format(P.viagens)} passagens de ${fmtBRL.format(P.passagem)} por dia`,
      `Carro de app: ${fmtBRL.format(P.appKm)} por km, em média`,
      `Bike: ${fmtNum.format(P.whKm)} Wh por km, energia a ${fmtBRL.format(P.kwh)} por kWh`,
    ].map((t) => `<li>${t}</li>`).join('');
  }

  $('#calc-enviar').addEventListener('click', () => {
    const c = ultimoCalculo;
    if (!c) return;
    const L = [
      `Olá, ${LOJA.curto}! Fiz a conta de economia no site:`,
      `• Ando ${fmtNum.format(c.km)} km por dia, ${c.dias} dias por mês (${fmtNum.format(c.kmMes)} km/mês)`,
      `• Hoje vou de ${c.nomeT}: cerca de ${fmtBRL.format(c.atual)} por mês`,
      `• Recarga da bike: cerca de ${fmtBRL.format(c.bike)} por mês`,
      `• Economia estimada: *${fmtBRL0.format(c.economia)} por mês*`,
      `Fiquei de olho na *${c.m.nome}* (${formatarPreco(c.m.preco)}). Pode me ajudar a escolher?`,
    ];
    abrirWhatsApp(L.join('\n'));
  });
  calcular();

  /* ---------- Test ride ---------- */
  const trModelo = $('#tr-modelo');
  trModelo.innerHTML = MODELOS.map((m) => `<option value="${m.id}">${escaparHtml(m.nome)}</option>`).join('');
  const DIAS_SEM = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const diasEl = $('#tr-dias');
  const dias = [];
  const hoje = new Date();
  for (let i = 1; dias.length < 8 && i < 14; i++) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + i);
    if (d.getDay() === 0) continue; // domingo fechado
    dias.push(d);
  }
  const rotDia = (d) => `${DIAS_SEM[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  diasEl.innerHTML = dias.map((d, i) =>
    `<label class="dia"><input type="radio" name="tr-dia" value="${i}"><span><small>${i === 0 ? 'amanhã' : DIAS_SEM[d.getDay()]}</small><strong>${d.getDate()}</strong><small>${['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'][d.getMonth()]}</small></span></label>`).join('');
  diasEl.addEventListener('change', (e) => {
    estado.trDia = dias[Number(e.target.value)];
    $('#tr-dia-erro').hidden = true;
    const sabado = estado.trDia.getDay() === 6;
    $('#tr-sabado').hidden = !sabado;
    $$('input[name="tr-periodo"]').forEach((r, i) => {
      r.disabled = sabado && i > 0;
      if (r.disabled && r.checked) $$('input[name="tr-periodo"]')[0].checked = true;
    });
  });

  function validarNome(input, erro) {
    const ok = input.value.trim().length >= 2;
    $(erro).hidden = ok;
    input.setAttribute('aria-invalid', String(!ok));
    return ok;
  }

  $('#form-tr').addEventListener('submit', (e) => {
    e.preventDefault();
    const okNome = validarNome($('#tr-nome'), '#tr-nome-erro');
    const okDia = !!estado.trDia;
    $('#tr-dia-erro').hidden = okDia;
    if (!okNome) { $('#tr-nome').focus(); return; }
    if (!okDia) { $('input[name="tr-dia"]').focus(); return; }
    const m = MODELOS_POR_ID[trModelo.value];
    const periodo = $('input[name="tr-periodo"]:checked').value;
    abrirWhatsApp([
      `Olá, ${LOJA.curto}! Quero agendar um test ride:`,
      `• Modelo: *${m.nome}*`,
      `• Dia: ${rotDia(estado.trDia)}`,
      `• Período: ${periodo}`,
      `Meu nome é ${$('#tr-nome').value.trim()}.`,
    ].join('\n'));
    toast('Abrimos o WhatsApp com o seu agendamento.');
  });
  $('#tr-nome').addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid') === 'true') validarNome(e.target, '#tr-nome-erro'); });

  /* ---------- Oficina ---------- */
  $('#of-servicos').innerHTML = SERVICOS.map((s) =>
    `<label class="chip-radio"><input type="checkbox" name="of-serv" value="${escaparHtml(s)}" ${s === 'Revisão geral' ? 'checked' : ''}><span>${escaparHtml(s)}</span></label>`).join('');
  $('#of-servicos').addEventListener('change', () => { $('#of-serv-erro').hidden = true; });
  $('#form-of').addEventListener('submit', (e) => {
    e.preventDefault();
    const okNome = validarNome($('#of-nome'), '#of-nome-erro');
    const servs = $$('input[name="of-serv"]:checked').map((i) => i.value);
    $('#of-serv-erro').hidden = servs.length > 0;
    if (!okNome) { $('#of-nome').focus(); return; }
    if (!servs.length) { $('input[name="of-serv"]').focus(); return; }
    const L = [`Olá, ${LOJA.curto}! Quero um orçamento da oficina.`, `• Veículo: ${$('#of-veiculo').value}`];
    const mod = $('#of-modelo').value.trim();
    if (mod) L.push(`• Modelo: ${mod}`);
    L.push(`• Serviço: ${servs.join(', ')}`);
    const obs = $('#of-obs').value.trim();
    if (obs) L.push(`• O que está acontecendo: ${obs}`);
    L.push($('#of-busca').checked ? '• Quero busca e entrega' : '• Levo até a loja');
    L.push(`Meu nome é ${$('#of-nome').value.trim()}.`);
    abrirWhatsApp(L.join('\n'));
    toast('Abrimos o WhatsApp com o seu pedido.');
  });
  $('#of-nome').addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid') === 'true') validarNome(e.target, '#of-nome-erro'); });

  /* ---------- Início ---------- */
  renderGrade();
  atualizarComparar();
})();
