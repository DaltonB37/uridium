/*
  Basalto Seminovos — revenda de carros com atendimento pelo WhatsApp (demonstração).
  HTML/CSS/JS puro. Os carros são desenhados em SVG, cada um na cor de verdade dele.
*/
'use strict';

// Número de WhatsApp da loja: só dígitos, com DDI e DDD (ex.: '5527999998888').
// Deixe vazio para o WhatsApp abrir e a pessoa escolher o contato (bom para demonstração).
const WHATSAPP_NEGOCIO = '';

const LOJA = {
  nome: 'Basalto Seminovos',
  endereco: 'Av. Carlos Lindenberg, 3480 — Cobilândia, Vila Velha/ES',
  mapa: 'Av. Carlos Lindenberg, Cobilândia, Vila Velha - ES',
};

// Taxa de referência do simulador (ao mês). Só estimativa: o banco define a taxa final.
const TAXA_MENSAL = 0.0189;
const ENTRADA_PADRAO = 30; // % usado na parcela "a partir de" dos cards
const PRAZO_PADRAO = 48;

const TIPOS = {
  hatch: 'Hatch',
  sedan: 'Sedã',
  suv: 'SUV',
  picape: 'Picape',
};

// Estoque, na ordem de destaque da vitrine.
const CARROS = [
  {
    id: 'corolla-xei-2021', marca: 'Toyota', modelo: 'Corolla', versao: 'XEi 2.0', tipo: 'sedan',
    ano: 2021, anoModelo: 2022, km: 61000, cambio: 'Automático', cambioDet: 'Automático CVT, 10 marchas simuladas',
    combustivel: 'Flex', cor: 'Preto Eclipse', hex: '#1E2124', preco: 129900, motor: '2.0 16V · 177 cv', portas: 4, placa: 7,
    selos: ['Único dono', 'Revisado na Toyota'],
    opcionais: ['Central multimídia 9"', 'Android Auto e CarPlay', 'Bancos em couro', 'Ar digital', 'Câmera de ré', '7 airbags', 'Piloto automático'],
    desc: 'Sedã mais vendido do segmento, com todas as revisões feitas na concessionária e manual com carimbos. Rodou quase só estrada entre Vila Velha e Guarapari.',
  },
  {
    id: 'compass-longitude-2022', marca: 'Jeep', modelo: 'Compass', versao: 'Longitude 1.3 T270', tipo: 'suv',
    ano: 2022, anoModelo: 2022, km: 44800, cambio: 'Automático', cambioDet: 'Automático de 6 marchas',
    combustivel: 'Flex', cor: 'Cinza Granite', hex: '#7C8288', preco: 149900, motor: '1.3 Turbo · 185 cv', portas: 4, placa: 2,
    selos: ['Revisado', 'Garantia de fábrica'],
    opcionais: ['Teto solar', 'Painel digital', 'Multimídia 10"', 'Frenagem autônoma', 'Faróis full LED', 'Chave presencial', 'Rodas aro 18'],
    desc: 'SUV médio com motor turbo econômico e acabamento de carro bem mais caro. Pneus novos e revisão de 40 mil km feita.',
  },
  {
    id: 'onix-lt-2022', marca: 'Chevrolet', modelo: 'Onix', versao: 'LT 1.0 Turbo', tipo: 'hatch',
    ano: 2022, anoModelo: 2022, km: 38500, cambio: 'Automático', cambioDet: 'Automático de 6 marchas',
    combustivel: 'Flex', cor: 'Branco Summit', hex: '#EEEEEA', preco: 79900, motor: '1.0 Turbo · 116 cv', portas: 4, placa: 1,
    selos: ['Único dono', 'Revisado'],
    opcionais: ['MyLink com Android Auto e CarPlay', 'Wi-Fi nativo', 'Ar-condicionado', '6 airbags', 'Sensor de ré', 'Controle de estabilidade'],
    desc: 'O primeiro carro ideal: econômico, automático e barato de manter. Uma dona só, sempre na garagem, com manual e chave reserva.',
  },
  {
    id: 'strada-volcano-2023', marca: 'Fiat', modelo: 'Strada', versao: 'Volcano 1.3 Cabine Dupla', tipo: 'picape',
    ano: 2023, anoModelo: 2023, km: 24600, cambio: 'Manual', cambioDet: 'Manual de 5 marchas',
    combustivel: 'Flex', cor: 'Vermelho Montecarlo', hex: '#B3201F', preco: 109900, motor: '1.3 Firefly · 107 cv', portas: 4, placa: 5,
    selos: ['Baixa km', 'Revisado'],
    opcionais: ['Multimídia 7"', 'Capota marítima', 'Rodas de liga aro 16', 'Câmera de ré', 'Ar-condicionado', 'Direção elétrica'],
    desc: 'A picape que serve para o trabalho durante a semana e para a praia no fim de semana. Caçamba protegida e sem marcas de carga.',
  },
  {
    id: 't-cross-highline-2022', marca: 'Volkswagen', modelo: 'T-Cross', versao: 'Highline 1.4 TSI', tipo: 'suv',
    ano: 2022, anoModelo: 2023, km: 35200, cambio: 'Automático', cambioDet: 'Automático de 6 marchas',
    combustivel: 'Flex', cor: 'Azul Biscay', hex: '#2F4E7A', preco: 134900, motor: '1.4 TSI · 150 cv', portas: 4, placa: 9,
    selos: ['Único dono', 'Laudo aprovado'],
    opcionais: ['Painel digital Active Info', 'Teto solar panorâmico', 'Bancos em couro', 'Multimídia VW Play', 'Sensores de estacionamento', 'Faróis full LED'],
    desc: 'Versão topo de linha, com o motor mais forte da família. Banco traseiro corrediço e porta-malas enorme para quem tem criança.',
  },
  {
    id: 'hb20-comfort-2021', marca: 'Hyundai', modelo: 'HB20', versao: 'Comfort 1.0', tipo: 'hatch',
    ano: 2021, anoModelo: 2021, km: 52300, cambio: 'Manual', cambioDet: 'Manual de 5 marchas',
    combustivel: 'Flex', cor: 'Prata Sand', hex: '#B9BBB8', preco: 62900, motor: '1.0 12V · 80 cv', portas: 4, placa: 3,
    selos: ['Revisado', 'IPVA 2026 pago'],
    opcionais: ['Multimídia 8"', 'Ar-condicionado', 'Direção elétrica', 'Vidros e travas elétricas', 'Sensor de ré'],
    desc: 'Hatch econômico de verdade, perfeito para o dia a dia na cidade. Pneus em ótimo estado e revisão recente de embreagem.',
  },
  {
    id: 'hilux-srv-2020', marca: 'Toyota', modelo: 'Hilux', versao: 'SRV 2.8 4x4 Diesel', tipo: 'picape',
    ano: 2020, anoModelo: 2020, km: 89000, cambio: 'Automático', cambioDet: 'Automático de 6 marchas',
    combustivel: 'Diesel', cor: 'Branco Perolizado', hex: '#F3F1EA', preco: 229900, motor: '2.8 Turbodiesel · 204 cv', portas: 4, placa: 8,
    selos: ['Revisado na Toyota', 'Laudo aprovado'],
    opcionais: ['Tração 4x4 com reduzida', 'Bancos em couro', 'Ar digital', 'Multimídia', 'Controle de descida', '7 airbags', 'Estribos'],
    desc: 'Picape média mais pedida do Espírito Santo. Usada em fazenda em Domingos Martins, sem uso pesado de carga. Todas as revisões na rede.',
  },
  {
    id: 'kicks-sv-2021', marca: 'Nissan', modelo: 'Kicks', versao: 'SV 1.6', tipo: 'suv',
    ano: 2021, anoModelo: 2022, km: 58700, cambio: 'Automático', cambioDet: 'Automático CVT',
    combustivel: 'Flex', cor: 'Prata Classic', hex: '#A7ABAE', preco: 94900, motor: '1.6 16V · 114 cv', portas: 4, placa: 6,
    selos: ['Revisado'],
    opcionais: ['Multimídia 8"', 'Câmera de ré', 'Ar digital', 'Chave presencial', 'Controle de estabilidade', 'Rodas de liga'],
    desc: 'SUV compacto confortável e econômico, com câmbio CVT suave no trânsito da Terceira Ponte. Ótimo custo-benefício.',
  },
  {
    id: 'civic-exl-2020', marca: 'Honda', modelo: 'Civic', versao: 'EXL 2.0', tipo: 'sedan',
    ano: 2020, anoModelo: 2020, km: 67900, cambio: 'Automático', cambioDet: 'Automático CVT',
    combustivel: 'Flex', cor: 'Cinza Modern Steel', hex: '#4F555B', preco: 124900, motor: '2.0 16V · 155 cv', portas: 4, placa: 4,
    selos: ['Único dono', 'Laudo aprovado'],
    opcionais: ['Bancos em couro', 'Multimídia com GPS', 'Ar digital dual zone', 'Câmera de ré', 'Partida por botão', 'Paddle shift'],
    desc: 'Sedã esportivo, espaçoso e com fama de não dar problema. Interior muito bem cuidado e pintura original.',
  },
  {
    id: 'onix-plus-premier-2023', marca: 'Chevrolet', modelo: 'Onix Plus', versao: 'Premier 1.0 Turbo', tipo: 'sedan',
    ano: 2023, anoModelo: 2023, km: 29400, cambio: 'Automático', cambioDet: 'Automático de 6 marchas',
    combustivel: 'Flex', cor: 'Prata Switchblade', hex: '#BFC2C4', preco: 96900, motor: '1.0 Turbo · 116 cv', portas: 4, placa: 0,
    selos: ['Baixa km', 'Garantia de fábrica'],
    opcionais: ['Bancos em couro', 'Carregador por indução', 'Alerta de ponto cego', 'Ar digital', 'Câmera de ré', 'Wi-Fi nativo'],
    desc: 'Sedã compacto completo, com porta-malas de 469 litros e consumo de carro popular. Ainda na garantia de fábrica.',
  },
  {
    id: 'renegade-sport-2020', marca: 'Jeep', modelo: 'Renegade', versao: 'Sport 1.8', tipo: 'suv',
    ano: 2020, anoModelo: 2020, km: 71400, cambio: 'Automático', cambioDet: 'Automático de 6 marchas',
    combustivel: 'Flex', cor: 'Verde Recon', hex: '#5B6A4E', preco: 82900, motor: '1.8 16V · 139 cv', portas: 4, placa: 2,
    selos: ['Revisado'],
    opcionais: ['Multimídia 7"', 'Controle de tração', 'Ar-condicionado', 'Sensor de ré', 'Rodas de liga aro 16'],
    desc: 'O SUV de visual mais marcante da categoria, posição de dirigir alta e acabamento robusto. Correia e fluidos trocados.',
  },
  {
    id: 'mobi-like-2022', marca: 'Fiat', modelo: 'Mobi', versao: 'Like 1.0', tipo: 'hatch',
    ano: 2022, anoModelo: 2022, km: 33100, cambio: 'Manual', cambioDet: 'Manual de 5 marchas',
    combustivel: 'Flex', cor: 'Azul Jazz', hex: '#3B6FA6', preco: 52900, motor: '1.0 Fire · 75 cv', portas: 4, placa: 1,
    selos: ['Único dono', 'IPVA 2026 pago'],
    opcionais: ['Ar-condicionado', 'Direção elétrica', 'Vidros elétricos dianteiros', 'Rádio com Bluetooth'],
    desc: 'Compacto, fácil de estacionar e muito econômico: o mais barato do pátio. Ótimo para aplicativo ou primeiro carro.',
  },
];
const CARROS_POR_ID = Object.fromEntries(CARROS.map((c) => [c.id, c]));

const MARCAS_TROCA = ['Chevrolet', 'Fiat', 'Volkswagen', 'Hyundai', 'Toyota', 'Renault', 'Honda', 'Jeep', 'Nissan', 'Ford',
  'Peugeot', 'Citroën', 'Mitsubishi', 'Kia', 'BYD', 'Caoa Chery', 'Outra'];

/* ---------------------------------------------------------------- */
/* Utilidades                                                        */
/* ---------------------------------------------------------------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

const fmtBRL0 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtBRL2 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtNum = new Intl.NumberFormat('pt-BR');
const limpa = (s) => String(s).replace(/ /g, ' ');
const brl = (v) => limpa(fmtBRL0.format(v));
const brl2 = (v) => limpa(fmtBRL2.format(v));
const km = (v) => `${fmtNum.format(v)} km`;
const pct = (v) => `${String(v).replace('.', ',')}%`;
const taxaTxt = `${(TAXA_MENSAL * 100).toFixed(2).replace('.', ',')}%`;
const soDigitos = (s) => String(s || '').replace(/\D/g, '');

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function semAcento(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }

function nomeCarro(c) { return `${c.marca} ${c.modelo} ${c.versao}`; }
function anoTxt(c) { return c.ano === c.anoModelo ? String(c.ano) : `${c.ano}/${c.anoModelo}`; }

// Tabela Price: parcela fixa.
function parcela(valorFinanciado, meses, taxa = TAXA_MENSAL) {
  if (valorFinanciado <= 0) return 0;
  return valorFinanciado * taxa / (1 - Math.pow(1 + taxa, -meses));
}
function parcelaPadrao(preco) {
  return parcela(preco * (1 - ENTRADA_PADRAO / 100), PRAZO_PADRAO);
}

function linkWhatsApp(texto) {
  const numero = String(WHATSAPP_NEGOCIO || '').replace(/\D/g, '');
  return numero
    ? `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
    : `https://wa.me/?text=${encodeURIComponent(texto)}`;
}
function abrirWhatsApp(texto) {
  const url = linkWhatsApp(texto);
  const janela = window.open(url, '_blank');
  if (janela) janela.opener = null;
  else window.location.href = url;
}

// Clareia (+) ou escurece (-) uma cor hex.
function tom(hex, qtd) {
  const n = parseInt(hex.slice(1), 16);
  const ajusta = (c) => Math.max(0, Math.min(255, Math.round(qtd >= 0 ? c + (255 - c) * qtd : c * (1 + qtd))));
  const r = ajusta(n >> 16), g = ajusta((n >> 8) & 255), b = ajusta(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

/* ---------------------------------------------------------------- */
/* Ilustração dos carros (vista lateral, frente para a direita)      */
/* ---------------------------------------------------------------- */
const FORMAS = {
  hatch: {
    corpo: 'M30 96 C30 82 31 66 36 58 C44 46 64 41 100 40 L178 40 C198 40 216 52 238 66 L284 72 C299 74 306 82 306 93 L306 99 C306 102 304 104 301 104 L270 104 A28 28 0 0 0 214 104 L106 104 A28 28 0 0 0 50 104 L35 104 C32 104 30 101 30 96 Z',
    vidros: ['M42 64 C47 54 60 48 84 47 L90 47 L90 66 Z', 'M96 47 L150 47 L150 67 L96 66 Z', 'M156 47 L176 47 C192 47 206 54 222 67 L156 67 Z'],
    portas: ['M153 69 L152 102', 'M93 68 L95 100'],
    rodas: [78, 242], r: 21, friso: 'M36 82 L298 82',
    farol: 'M290 76 C298 77 303 80 304 85 L290 84 Z', lanterna: 'M31 68 L40 67 L40 80 L30 81 Z',
  },
  sedan: {
    corpo: 'M14 96 C14 85 18 78 30 75 L72 69 C90 52 110 42 142 40 L194 40 C214 40 230 50 250 66 L288 72 C301 74 308 82 308 93 L308 99 C308 102 306 104 303 104 L270 104 A28 28 0 0 0 214 104 L106 104 A28 28 0 0 0 50 104 L19 104 C16 104 14 101 14 96 Z',
    vidros: ['M88 68 C102 55 118 48 142 47 L160 47 L160 68 Z', 'M166 47 L192 47 C206 47 220 54 236 67 L166 68 Z'],
    portas: ['M163 70 L161 102', 'M100 72 L104 100'],
    rodas: [78, 242], r: 21, friso: 'M28 84 L300 84',
    farol: 'M292 76 C300 77 305 80 306 85 L292 84 Z', lanterna: 'M15 80 L30 78 L30 87 L14 88 Z',
  },
  suv: {
    corpo: 'M14 98 L15 62 C16 50 24 38 44 35 L194 32 C212 32 226 42 246 58 L290 65 C302 67 308 75 308 87 L308 99 C308 102 306 104 303 104 L270 104 A30 30 0 0 0 210 104 L110 104 A30 30 0 0 0 50 104 L19 104 C16 104 14 102 14 98 Z',
    vidros: ['M40 41 L74 40 L74 60 L24 60 C26 50 32 43 40 41 Z', 'M80 40 L146 39 L146 60 L80 60 Z', 'M152 39 L192 39 C206 39 218 46 233 60 L152 60 Z'],
    portas: ['M149 62 L148 102', 'M77 62 L80 100'],
    rodas: [80, 240], r: 24, friso: 'M18 78 L302 78', rack: 'M50 31 L188 28', saia: true,
    farol: 'M292 68 C301 70 306 74 307 80 L292 79 Z', lanterna: 'M15 50 L26 50 L26 64 L15 64 Z',
  },
  picape: {
    corpo: 'M10 100 L10 62 L118 62 L122 36 C123 30 128 27 136 27 L196 27 C210 27 222 37 238 55 L290 63 C302 65 308 73 308 85 L308 99 C308 102 306 104 303 104 L274 104 A30 30 0 0 0 214 104 L110 104 A30 30 0 0 0 50 104 L14 104 C11 104 10 102 10 100 Z',
    vidros: ['M130 34 L170 34 L170 56 L130 56 Z', 'M176 34 L196 34 C208 34 218 42 230 56 L176 56 Z'],
    portas: ['M173 58 L172 102', 'M126 58 L126 100'],
    rodas: [80, 244], r: 24, friso: 'M12 74 L302 74', cacamba: 'M10 62 L118 62', saia: true,
    farol: 'M292 70 C301 72 306 76 307 81 L292 80 Z', lanterna: 'M11 66 L20 66 L20 80 L11 80 Z',
  },
};

let idSvg = 0;
function svgCarro(tipo, hex, rotulo) {
  const f = FORMAS[tipo] || FORMAS.sedan;
  const id = `g${++idSvg}`;
  const claro = parseInt(hex.slice(1), 16) > 0xB0B0B0;
  const roda = (cx) => `
    <circle class="pneu" cx="${cx}" cy="104" r="${f.r}"/>
    <circle class="roda" cx="${cx}" cy="104" r="${f.r * 0.62}"/>
    <circle class="roda-in" cx="${cx}" cy="104" r="${f.r * 0.42}"/>
    <circle class="roda" cx="${cx}" cy="104" r="${f.r * 0.16}"/>`;
  // SUVs e picapes ganham saia e para-lamas em plástico preto, como os de verdade.
  const arco = (cx) => {
    const a = 34; // caixa de roda (30) + borda de 4

    return `<path d="M${cx - a} 104 A${a} ${a} 0 0 1 ${cx + a} 104 Z" fill="#23272B"/>`;
  };
  const saia = f.saia
    ? `<clipPath id="${id}c"><rect x="0" y="95" width="320" height="12"/></clipPath>
       <path d="${f.corpo}" fill="#23272B" clip-path="url(#${id}c)"/>${f.rodas.map(arco).join('')}`
    : '';
  const extra = [
    saia,
    f.rack ? `<path d="${f.rack}" stroke="#15181B" stroke-width="3.5" stroke-linecap="round"/>` : '',
    f.cacamba ? `<path d="${f.cacamba}" stroke="${tom(hex, -0.35)}" stroke-width="3" stroke-linecap="round"/>` : '',
  ].join('');
  const aria = rotulo ? `role="img" aria-label="${esc(rotulo)}"` : 'aria-hidden="true"';
  return `<svg class="svg-carro" viewBox="0 0 320 136" ${aria} focusable="false">
    <defs>
      <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${tom(hex, 0.28)}"/>
        <stop offset=".45" stop-color="${hex}"/>
        <stop offset="1" stop-color="${tom(hex, -0.4)}"/>
      </linearGradient>
    </defs>
    <ellipse class="sombra" cx="160" cy="127" rx="150" ry="6"/>
    <path d="${f.corpo}" fill="url(#${id})"/>
    ${claro ? `<path class="contorno" d="${f.corpo}"/>` : ''}
    ${extra}
    ${f.vidros.map((v) => `<path class="vidro" d="${v}"/>`).join('')}
    <path class="friso" d="${f.friso}"/>
    ${f.portas.map((p) => `<path class="friso" d="${p}"/>`).join('')}
    <path class="farol" d="${f.farol}"/>
    <path class="lanterna" d="${f.lanterna}"/>
    ${f.rodas.map(roda).join('')}
  </svg>`;
}

// Ícone pequeno (silhueta) para os filtros de tipo.
function iconeTipo(tipo) {
  const f = FORMAS[tipo];
  return `<svg viewBox="0 0 320 136" aria-hidden="true" focusable="false"><path d="${f.corpo}"/>${f.rodas.map((cx) => `<circle cx="${cx}" cy="104" r="${f.r}"/>`).join('')}</svg>`;
}

/* ---------------------------------------------------------------- */
/* App                                                               */
/* ---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const reduzMovimento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rolarPara = (el) => el && el.scrollIntoView({ behavior: reduzMovimento ? 'auto' : 'smooth', block: 'start' });

  // Filtros grudam logo abaixo do topo fixo.
  const topo = $('#topo');
  const filtrosEl = $('#filtros');
  const ajustaTopo = () => {
    const h = topo.offsetHeight;
    filtrosEl.style.top = `${h}px`;
    document.documentElement.style.scrollPaddingTop = `${h + 12}px`;
  };
  ajustaTopo();
  window.addEventListener('resize', ajustaTopo);

  // Hero
  $('#hero-carro').innerHTML = svgCarro('suv', '#B4BAC0'); // prata claro para destacar no fundo escuro
  $('#fato-qtd').textContent = CARROS.length;

  // Links fixos
  $('#link-mapa').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(LOJA.mapa)}`;
  $('#fab-zap').href = linkWhatsApp(`Olá, ${LOJA.nome}! Vim pelo site e quero ajuda para escolher um carro.`);

  /* ---------- Estoque e filtros ---------- */
  const estado = { tipo: '', busca: '', preco: '', cambio: '', ordem: 'destaque' };
  const grade = $('#grade');
  const vazio = $('#vazio');
  const qtdEl = $('#resultado-qtd');
  const limparBtn = $('#limpar-filtros');
  const tiposEl = $('#filtro-tipos');

  function renderTipos() {
    const opcoes = [['', 'Todos', CARROS.length], ...Object.entries(TIPOS).map(([k, n]) => [k, n, CARROS.filter((c) => c.tipo === k).length])];
    tiposEl.innerHTML = opcoes.map(([k, n, q]) => `
      <button type="button" class="tipo" data-tipo="${k}" aria-pressed="${estado.tipo === k}">
        ${k ? iconeTipo(k) : ''}${n} <small>${q}</small>
      </button>`).join('');
  }

  function filtrados() {
    const termo = semAcento(estado.busca.trim());
    let lista = CARROS.filter((c) => {
      if (estado.tipo && c.tipo !== estado.tipo) return false;
      if (estado.cambio && c.cambio !== estado.cambio) return false;
      if (estado.preco) {
        const [min, max] = estado.preco.split('-').map(Number);
        if (c.preco < min || c.preco > max) return false;
      }
      if (termo) {
        const alvo = semAcento(`${c.marca} ${c.modelo} ${c.versao} ${c.cor} ${TIPOS[c.tipo]} ${c.ano}`);
        if (!termo.split(/\s+/).every((t) => alvo.includes(t))) return false;
      }
      return true;
    });
    const ord = {
      menor: (a, b) => a.preco - b.preco,
      maior: (a, b) => b.preco - a.preco,
      km: (a, b) => a.km - b.km,
      ano: (a, b) => b.anoModelo - a.anoModelo || a.km - b.km,
    }[estado.ordem];
    if (ord) lista = lista.slice().sort(ord);
    return lista;
  }

  function cardHTML(c) {
    const nome = nomeCarro(c);
    const msg = mensagemInteresse(c);
    return `
      <li>
        <article class="carro">
          <button type="button" class="carro-arte" data-abrir="${c.id}" aria-label="Ver ficha do ${esc(nome)}">
            <span class="carro-tipo">${TIPOS[c.tipo]}</span>
            ${svgCarro(c.tipo, c.hex)}
          </button>
          <div class="carro-corpo">
            <div>
              <p class="carro-marca">${esc(c.marca)} · ${anoTxt(c)}</p>
              <h3 class="carro-nome"><button type="button" data-abrir="${c.id}">${esc(c.modelo)}</button></h3>
              <p class="carro-versao">${esc(c.versao)} · ${esc(c.cor)}</p>
            </div>
            <ul class="specs" aria-label="Resumo">
              <li>${km(c.km)}</li><li>${c.cambio}</li><li>${c.combustivel}</li>
            </ul>
            <ul class="selos" aria-label="Destaques">${c.selos.map((s) => `<li class="selo">${esc(s)}</li>`).join('')}</ul>
            <div class="carro-preco">
              <div>
                <p class="preco">${brl(c.preco)}</p>
                <p class="preco-parcela">ou ${PRAZO_PADRAO}x de ${brl2(parcelaPadrao(c.preco))}*</p>
              </div>
            </div>
            <div class="carro-acoes">
              <button type="button" class="btn btn-linha-escura" data-abrir="${c.id}">Ver ficha</button>
              <a class="btn btn-zap" href="${linkWhatsApp(msg)}" target="_blank" rel="noopener" aria-label="Tenho interesse no ${esc(nome)}, abrir WhatsApp">
                <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-zap"/></svg>Interesse
              </a>
            </div>
          </div>
        </article>
      </li>`;
  }

  function renderEstoque() {
    const lista = filtrados();
    grade.innerHTML = lista.map(cardHTML).join('');
    vazio.hidden = lista.length > 0;
    grade.hidden = lista.length === 0;
    qtdEl.textContent = lista.length === 1 ? '1 carro encontrado' : `${lista.length} carros encontrados`;
    if (lista.length) qtdEl.textContent += ` · *parcela estimada com ${ENTRADA_PADRAO}% de entrada`;
    const temFiltro = estado.tipo || estado.busca || estado.preco || estado.cambio;
    limparBtn.hidden = !temFiltro;
    $$('.tipo', tiposEl).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tipo === estado.tipo)));
    const desejo = [estado.tipo && TIPOS[estado.tipo], estado.cambio && `câmbio ${estado.cambio.toLowerCase()}`, estado.busca && `"${estado.busca.trim()}"`,
      estado.preco && $('#filtro-preco').selectedOptions[0].textContent.toLowerCase()].filter(Boolean).join(', ');
    $('#vazio-zap').href = linkWhatsApp(`Olá, ${LOJA.nome}! Estou procurando um carro${desejo ? ` (${desejo})` : ''}. Podem me avisar quando chegar algum assim?`);
  }

  function limparFiltros() {
    Object.assign(estado, { tipo: '', busca: '', preco: '', cambio: '' });
    $('#filtro-busca').value = '';
    $('#filtro-preco').value = '';
    $('#filtro-cambio').value = '';
    renderEstoque();
  }

  tiposEl.addEventListener('click', (e) => {
    const b = e.target.closest('.tipo');
    if (!b) return;
    estado.tipo = b.dataset.tipo;
    renderEstoque();
  });
  let tBusca;
  $('#filtro-busca').addEventListener('input', (e) => {
    clearTimeout(tBusca);
    tBusca = setTimeout(() => { estado.busca = e.target.value; renderEstoque(); }, 150);
  });
  $('#filtro-preco').addEventListener('change', (e) => { estado.preco = e.target.value; renderEstoque(); });
  $('#filtro-cambio').addEventListener('change', (e) => { estado.cambio = e.target.value; renderEstoque(); });
  $('#filtro-ordem').addEventListener('change', (e) => { estado.ordem = e.target.value; renderEstoque(); });
  limparBtn.addEventListener('click', limparFiltros);
  $('#vazio-limpar').addEventListener('click', limparFiltros);

  /* ---------- Ficha do carro ---------- */
  const modal = $('#modal-carro');
  const modalConteudo = $('#modal-conteudo');
  let carroAberto = null;
  let quemAbriu = null;

  function mensagemInteresse(c) {
    return [
      `Olá, ${LOJA.nome}! Tenho interesse neste carro que vi no site:`,
      '',
      `*${nomeCarro(c)}*`,
      `Ano ${anoTxt(c)} · ${km(c.km)} · ${c.cambio} · ${c.cor}`,
      `Preço anunciado: ${brl(c.preco)}`,
      '',
      'Ele ainda está disponível?',
    ].join('\n');
  }

  function abrirFicha(id, origem) {
    const c = CARROS_POR_ID[id];
    if (!c) return;
    carroAberto = c;
    quemAbriu = origem || document.activeElement;
    const ficha = [
      ['Ano', anoTxt(c)], ['Quilometragem', km(c.km)], ['Câmbio', c.cambioDet], ['Combustível', c.combustivel],
      ['Motor', c.motor], ['Cor', c.cor], ['Portas', String(c.portas)], ['Final da placa', String(c.placa)],
    ];
    modalConteudo.innerHTML = `
      <div class="mc-topo">
        <p class="mc-cor"><i style="background:${c.hex}"></i>${esc(c.cor)}</p>
        <button type="button" class="mc-fechar" data-fechar aria-label="Fechar ficha">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
        ${svgCarro(c.tipo, c.hex, `Ilustração do ${nomeCarro(c)} na cor ${c.cor}`)}
      </div>
      <div class="mc-corpo">
        <div>
          <p class="carro-marca">${esc(c.marca)} · ${TIPOS[c.tipo]}</p>
          <h2 id="mc-nome">${esc(c.modelo)} ${esc(c.versao)}</h2>
          <ul class="selos" aria-label="Destaques">${c.selos.map((s) => `<li class="selo">${esc(s)}</li>`).join('')}<li class="selo">Laudo cautelar</li></ul>
          <p class="mc-desc">${esc(c.desc)}</p>
          <dl class="ficha">${ficha.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
          <div class="mc-opc">
            <h3>Principais itens</h3>
            <ul>${c.opcionais.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>
          </div>
        </div>
        <aside class="mc-lado" aria-label="Preço e contato">
          <div class="mc-preco-box">
            <p class="rot">Preço à vista</p>
            <p class="preco">${brl(c.preco)}</p>
            <p class="estimativa">ou ${PRAZO_PADRAO}x de <strong>${brl2(parcelaPadrao(c.preco))}</strong> com ${ENTRADA_PADRAO}% de entrada</p>
            <p class="miudo">Valor estimado, sujeito à análise de crédito.</p>
          </div>
          <a class="btn btn-zap" href="${linkWhatsApp(mensagemInteresse(c))}" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-zap"/></svg>Tenho interesse
          </a>
          <button type="button" class="btn btn-linha-escura" data-acao="simular">Simular outra entrada ou prazo</button>
          <button type="button" class="btn btn-linha-escura" data-acao="testdrive">Agendar test drive</button>
        </aside>
      </div>`;
    if (!modal.open) modal.showModal();
    modal.scrollTop = 0;
    const fechar = $('.mc-fechar', modal);
    if (fechar) fechar.focus();
  }

  grade.addEventListener('click', (e) => {
    const b = e.target.closest('[data-abrir]');
    if (b) abrirFicha(b.dataset.abrir, b);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.closest('[data-fechar]')) { modal.close(); return; }
    const acao = e.target.closest('[data-acao]');
    if (!acao || !carroAberto) return;
    const c = carroAberto;
    quemAbriu = null; // o foco vai para o formulário, não volta para o card
    modal.close();
    if (acao.dataset.acao === 'simular') {
      simCarro.value = c.id;
      simPreco.value = fmtNum.format(c.preco);
      atualizaSim();
      rolarPara($('#simulador'));
      setTimeout(() => simEntrada.focus({ preventScroll: true }), reduzMovimento ? 0 : 450);
    } else {
      tdCarro.value = c.id;
      tdCarro.removeAttribute('aria-invalid');
      $('#td-carro-erro').hidden = true;
      rolarPara($('#test-drive'));
      setTimeout(() => { const d = $('input[name="dia"]:checked', tdDias); if (d) d.focus({ preventScroll: true }); }, reduzMovimento ? 0 : 450);
    }
  });
  modal.addEventListener('close', () => {
    if (quemAbriu && document.contains(quemAbriu)) quemAbriu.focus();
    carroAberto = null;
  });

  /* ---------- Opções de carro nos formulários ---------- */
  const opcoesCarros = CARROS.map((c) => `<option value="${c.id}">${esc(`${c.marca} ${c.modelo} ${c.versao} · ${anoTxt(c)} · ${brl(c.preco)}`)}</option>`).join('');

  /* ---------- Simulador ---------- */
  const simCarro = $('#sim-carro');
  const simPreco = $('#sim-preco');
  const simEntrada = $('#sim-entrada');
  const simErro = $('#sim-preco-erro');
  simCarro.innerHTML = `${opcoesCarros}<option value="outro">Outro valor (digitar)</option>`;
  $('#sim-taxa').textContent = taxaTxt;

  function precoSim() { return Number(soDigitos(simPreco.value)); }

  function calculaSim() {
    const preco = precoSim();
    const entradaPct = Number(simEntrada.value);
    const prazo = Number(($('input[name="prazo"]:checked') || {}).value || PRAZO_PADRAO);
    const entrada = Math.round(preco * entradaPct / 100);
    const financiado = preco - entrada;
    const p = parcela(financiado, prazo);
    return { preco, entradaPct, entrada, prazo, financiado, parcela: p, total: entrada + p * prazo };
  }

  function precoValido(v) { return v >= 10000 && v <= 1000000; }

  function atualizaSim() {
    const s = calculaSim();
    const ok = precoValido(s.preco);
    simEntrada.style.setProperty('--pct', `${(s.entradaPct / Number(simEntrada.max)) * 100}%`);
    const entradaTxt = ok ? `${brl(s.entrada)} (${pct(s.entradaPct)})` : pct(s.entradaPct);
    $('#sim-entrada-valor').textContent = entradaTxt;
    simEntrada.setAttribute('aria-valuetext', entradaTxt);
    $('#sim-prazo-txt').textContent = `${s.prazo}x`;
    $('#sim-parcela').textContent = ok ? brl2(s.parcela) : 'R$ —';
    $('#sim-financiado').textContent = ok ? brl(s.financiado) : '—';
    $('#sim-total').textContent = ok ? brl(Math.round(s.total)) : '—';
  }

  simCarro.addEventListener('change', () => {
    const c = CARROS_POR_ID[simCarro.value];
    if (c) simPreco.value = fmtNum.format(c.preco);
    else { simPreco.value = ''; simPreco.focus(); }
    simErro.hidden = true; simPreco.removeAttribute('aria-invalid');
    atualizaSim();
  });
  simPreco.addEventListener('input', () => {
    const v = soDigitos(simPreco.value).slice(0, 7);
    simPreco.value = v ? fmtNum.format(Number(v)) : '';
    const c = CARROS_POR_ID[simCarro.value];
    if (!c || c.preco !== Number(v)) {
      const igual = CARROS.find((x) => x.preco === Number(v));
      simCarro.value = igual ? igual.id : 'outro';
    }
    if (precoValido(Number(v))) { simErro.hidden = true; simPreco.removeAttribute('aria-invalid'); }
    atualizaSim();
  });
  simEntrada.addEventListener('input', atualizaSim);
  $('#sim-prazos').addEventListener('change', atualizaSim);

  $('#form-sim').addEventListener('submit', (e) => {
    e.preventDefault();
    const s = calculaSim();
    if (!precoValido(s.preco)) {
      simErro.hidden = false; simPreco.setAttribute('aria-invalid', 'true'); simPreco.focus();
      return;
    }
    const c = CARROS_POR_ID[simCarro.value];
    const linhas = [
      `Olá, ${LOJA.nome}! Fiz uma simulação de financiamento no site:`,
      '',
      `*Carro:* ${c ? `${nomeCarro(c)} ${anoTxt(c)}` : 'outro carro'}`,
      `*Valor:* ${brl(s.preco)}`,
      `*Entrada:* ${brl(s.entrada)} (${pct(s.entradaPct)})`,
      `*Prazo:* ${s.prazo}x`,
      `*Parcela estimada:* ${brl2(s.parcela)}`,
      `_Estimativa com taxa de ${taxaTxt} a.m., sujeita à análise de crédito._`,
    ];
    if ($('#sim-troca').checked) linhas.push('', 'Tenho um carro para dar na troca como parte da entrada.');
    linhas.push('', 'Podem fazer a análise de crédito para mim?');
    abrirWhatsApp(linhas.join('\n'));
  });

  simPreco.value = fmtNum.format(CARROS[0].preco);
  atualizaSim();

  /* ---------- Avaliação na troca ---------- */
  const trMarca = $('#tr-marca');
  const trAno = $('#tr-ano');
  const trKm = $('#tr-km');
  trMarca.insertAdjacentHTML('beforeend', MARCAS_TROCA.map((m) => `<option>${m}</option>`).join(''));
  const anoAtual = new Date().getFullYear();
  for (let a = anoAtual + 1; a >= anoAtual - 20; a--) trAno.insertAdjacentHTML('beforeend', `<option>${a}</option>`);
  trAno.insertAdjacentHTML('beforeend', `<option value="antes de ${anoAtual - 20}">Antes de ${anoAtual - 20}</option>`);
  $('#tr-interesse').insertAdjacentHTML('beforeend', opcoesCarros);

  trKm.addEventListener('input', () => {
    const v = soDigitos(trKm.value).slice(0, 7);
    trKm.value = v ? fmtNum.format(Number(v)) : '';
  });

  function validar(campos) {
    let primeiro = null;
    campos.forEach(([el, erroEl, ok]) => {
      erroEl.hidden = ok;
      if (ok) el.removeAttribute('aria-invalid');
      else { el.setAttribute('aria-invalid', 'true'); if (!primeiro) primeiro = el; }
    });
    if (primeiro) primeiro.focus();
    return !primeiro;
  }

  [[trMarca, '#tr-marca-erro'], [$('#tr-modelo'), '#tr-modelo-erro'], [trAno, '#tr-ano-erro'], [trKm, '#tr-km-erro']].forEach(([el, sel]) => {
    el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => {
      if (el.value.trim()) { $(sel).hidden = true; el.removeAttribute('aria-invalid'); }
    });
  });

  $('#form-troca').addEventListener('submit', (e) => {
    e.preventDefault();
    const modelo = $('#tr-modelo').value.trim();
    const ok = validar([
      [trMarca, $('#tr-marca-erro'), !!trMarca.value],
      [$('#tr-modelo'), $('#tr-modelo-erro'), modelo.length >= 2],
      [trAno, $('#tr-ano-erro'), !!trAno.value],
      [trKm, $('#tr-km-erro'), soDigitos(trKm.value).length > 0],
    ]);
    if (!ok) return;
    const nome = $('#tr-nome').value.trim();
    const estadoCarro = ($('input[name="estado"]:checked') || {}).value || '';
    const interesse = CARROS_POR_ID[$('#tr-interesse').value];
    const linhas = [
      `Olá, ${LOJA.nome}!${nome ? ` Aqui é ${nome}.` : ''} Quero uma avaliação do meu carro na troca:`,
      '',
      `*Carro:* ${trMarca.value} ${modelo}`,
      `*Ano:* ${trAno.value}`,
      `*Quilometragem:* ${trKm.value} km`,
      `*Estado:* ${estadoCarro}`,
    ];
    if (interesse) linhas.push('', `Tenho interesse em trocar pelo *${nomeCarro(interesse)} ${anoTxt(interesse)}* (${brl(interesse.preco)}).`);
    linhas.push('', 'Posso mandar as fotos por aqui.');
    abrirWhatsApp(linhas.join('\n'));
  });

  /* ---------- Test drive ---------- */
  const tdCarro = $('#td-carro');
  const tdDias = $('#td-dias');
  tdCarro.insertAdjacentHTML('beforeend', opcoesCarros);

  // Próximos 6 dias com a loja aberta (domingo fechado), a partir de amanhã.
  const dias = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  while (dias.length < 6) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) dias.push(new Date(d));
  }
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const amanhaData = new Date();
  amanhaData.setDate(amanhaData.getDate() + 1);
  tdDias.innerHTML = dias.map((dia, i) => {
    const semana = cap(dia.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''));
    const data = dia.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const amanha = dia.toDateString() === amanhaData.toDateString();
    return `<label><input type="radio" name="dia" value="${i}" ${i === 0 ? 'checked' : ''}><span>${amanha ? 'Amanhã' : semana}<small>${data}</small></span></label>`;
  }).join('');

  const tdTarde = $('input[name="periodo"][value="tarde"]');
  const tdManha = $('input[name="periodo"][value="manha"]');
  function atualizaPeriodos() {
    const i = Number(($('input[name="dia"]:checked', tdDias) || {}).value || 0);
    const sabado = dias[i].getDay() === 6;
    tdTarde.disabled = sabado;
    if (sabado && tdTarde.checked) tdManha.checked = true;
    $('#td-manha-hora').textContent = sabado ? '8h às 13h' : '8h às 12h';
    $('#td-sabado').hidden = !sabado;
  }
  tdDias.addEventListener('change', atualizaPeriodos);
  atualizaPeriodos();

  tdCarro.addEventListener('change', () => { if (tdCarro.value) { $('#td-carro-erro').hidden = true; tdCarro.removeAttribute('aria-invalid'); } });
  $('#td-nome').addEventListener('input', (e) => { if (e.target.value.trim()) { $('#td-nome-erro').hidden = true; e.target.removeAttribute('aria-invalid'); } });

  $('#form-td').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = $('#td-nome').value.trim();
    const ok = validar([
      [tdCarro, $('#td-carro-erro'), !!tdCarro.value],
      [$('#td-nome'), $('#td-nome-erro'), nome.length >= 2],
    ]);
    if (!ok) return;
    const c = CARROS_POR_ID[tdCarro.value];
    const dia = dias[Number(($('input[name="dia"]:checked', tdDias) || {}).value || 0)];
    const diaTxt = dia.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });
    const manha = tdManha.checked;
    const horario = manha ? (dia.getDay() === 6 ? 'manhã (8h às 13h)' : 'manhã (8h às 12h)') : 'tarde (13h às 18h)';
    abrirWhatsApp([
      `Olá, ${LOJA.nome}! Aqui é ${nome}. Quero agendar um test drive:`,
      '',
      `*Carro:* ${nomeCarro(c)} ${anoTxt(c)} (${km(c.km)})`,
      `*Dia:* ${diaTxt}`,
      `*Período:* ${horario}`,
      '',
      'Qual horário fica bom para vocês?',
    ].join('\n'));
  });

  /* ---------- Início ---------- */
  renderTipos();
  renderEstoque();
});
