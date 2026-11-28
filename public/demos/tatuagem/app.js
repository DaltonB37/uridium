/* =========================================================
   Nanquim Estúdio de Tatuagem — demonstração
   Portfólio, flash day, orçamento guiado e agenda pelo WhatsApp
   ========================================================= */

// Número do WhatsApp do estúdio (cliente real). Só números, com DDI + DDD.
// Ex.: '5527999998888'. Na demonstração fica vazio: o WhatsApp abre e deixa
// escolher o contato. Preenchido, as mensagens vão direto para esse número
// (https://wa.me/${numero}?text=...).
const WHATSAPP_NEGOCIO = '';

const NEGOCIO = {
  nome: 'Nanquim Estúdio de Tatuagem',
  endereco: 'Rua das Gaivotas, 77 - Itapuã, Vila Velha - ES',
  sinal: 100, // valor do sinal para reservar a sessão (R$)
};

// ---------- TABELA DE PREÇOS DO ORÇAMENTO (edite à vontade) ----------
// Conta usada no site:
//   valor = maior entre (mínimo) e (tamanho em cm × valor por cm do estilo)
//           × fator do local do corpo × (colorida?) × (cobertura?)
// A faixa mostrada vai do valor calculado até "margem" acima dele.
const PRECOS = {
  minimo: 150,            // nenhuma tatuagem sai por menos que isso
  porCm: {                // valor por centímetro (maior lado do desenho)
    fineline: 18,
    oldschool: 22,
    blackwork: 24,
    lettering: 16,
    floral: 20,
    naosei: 20,
  },
  colorida: 1.25,         // colorida: 25% a mais que só preto
  cobertura: 1.4,         // cobertura ou reforma de tatuagem antiga: 40% a mais
  margem: 1.3,            // a faixa vai até 30% acima do valor base
  arredondar: 10,         // arredonda para múltiplos de R$ 10
};

// Locais do corpo. "fator" = quanto o local encarece (pele mais difícil, posição, tempo)
const LOCAIS = [
  { id: 'antebraco', nome: 'Antebraço', fator: 1 },
  { id: 'braco', nome: 'Braço (bíceps)', fator: 1 },
  { id: 'ombro', nome: 'Ombro', fator: 1.1 },
  { id: 'punho', nome: 'Punho', fator: 1 },
  { id: 'mao', nome: 'Mão ou dedos', fator: 1.2 },
  { id: 'peito', nome: 'Peito', fator: 1.15 },
  { id: 'costela', nome: 'Costela', fator: 1.25 },
  { id: 'costas', nome: 'Costas', fator: 1.1 },
  { id: 'nuca', nome: 'Nuca ou pescoço', fator: 1.2 },
  { id: 'coxa', nome: 'Coxa', fator: 1 },
  { id: 'panturrilha', nome: 'Panturrilha', fator: 1 },
  { id: 'tornozelo', nome: 'Tornozelo ou pé', fator: 1.15 },
  { id: 'outro', nome: 'Outro lugar', fator: 1 },
];

const ESTILOS = {
  fineline: 'Fineline',
  oldschool: 'Old school',
  blackwork: 'Blackwork',
  lettering: 'Lettering',
  floral: 'Floral',
  naosei: 'Ainda não sei',
};

// ---------- Agenda ----------
const ARTISTAS = [
  { id: 'lia', nome: 'Lia Nunes', estilos: 'Fineline e floral', bio: 'Traço fino, delicado e cheio de detalhe.', folga: [1], folgaTxt: 'Folga às segundas', desenho: 'crescente' },
  { id: 'caio', nome: 'Caio Prates', estilos: 'Old school e blackwork', bio: 'Contorno grosso, cor chapada e preto sólido.', folga: [3], folgaTxt: 'Folga às quartas', desenho: 'adaga' },
];

// Expediente em minutos desde 0h, por dia da semana (0 = domingo)
const EXPEDIENTE = {
  0: null,
  1: [600, 1140], // 10h–19h
  2: [600, 1140],
  3: [600, 1140],
  4: [600, 1140],
  5: [600, 1140],
  6: [600, 1080], // sábado 10h–18h
};
const DURACOES = [120, 180];  // blocos de sessão: 2h ou 3h
const DIAS_AGENDA = 14;       // mostra os próximos 14 dias (a partir de amanhã)

const DIAS_SEMANA = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const DIAS_CURTO = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const MESES_CURTO = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// ---------- Utilidades ----------
function linkWhatsApp(msg) {
  const numero = String(WHATSAPP_NEGOCIO || '').replace(/\D/g, '');
  const base = numero ? `https://wa.me/${numero}?text=` : 'https://wa.me/?text=';
  return base + encodeURIComponent(msg);
}

function reais(v) {
  return 'R$ ' + Math.round(v).toLocaleString('pt-BR');
}

function hora(min) {
  return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
}

function chaveData(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function dataDeChave(k) {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function dataPorExtenso(k) {
  const d = dataDeChave(k);
  return `${DIAS_SEMANA[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`;
}

function capital(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Hash determinístico -> número em [0, 1) (agenda simulada estável)
function hash01(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

// ---------- Cálculo do orçamento ----------
function calcularOrcamento({ estilo, local, cm, colorida, cobertura }) {
  const porCm = PRECOS.porCm[estilo] || PRECOS.porCm.naosei;
  const l = LOCAIS.find(x => x.id === local);
  let base = Math.max(PRECOS.minimo, cm * porCm);
  base *= l ? l.fator : 1;
  if (colorida) base *= PRECOS.colorida;
  if (cobertura) base *= PRECOS.cobertura;
  const r = PRECOS.arredondar;
  const de = Math.ceil(base / r) * r;
  const ate = Math.ceil((base * PRECOS.margem) / r) * r;
  return { de, ate };
}

function dicaTamanho(cm) {
  if (cm <= 4) return 'pequenininha, do tamanho de uma moeda';
  if (cm <= 8) return 'do tamanho de um cartão de visita';
  if (cm <= 14) return 'mais ou menos a palma da mão';
  if (cm <= 22) return 'mais ou menos o comprimento de uma caneta';
  if (cm <= 30) return 'do tamanho de uma régua escolar';
  return 'peça grande, que fecha uma área inteira';
}

function sessoesTamanho(cm) {
  if (cm <= 8) return 'Normalmente 1 sessão curta (até 2h).';
  if (cm <= 20) return 'Normalmente 1 sessão (até 3h).';
  if (cm <= 30) return 'Pode precisar de 2 sessões.';
  return 'Peça grande: geralmente 3 sessões ou mais.';
}

// ---------- Agenda simulada ----------
function trabalhaNoDia(artista, dow) {
  return !!EXPEDIENTE[dow] && !artista.folga.includes(dow);
}

function horaOcupada(chave, artistaId, h, dow) {
  const chance = dow === 6 ? 0.4 : 0.28;
  return hash01(`${chave}|${artistaId}|${h}`) < chance;
}

function gerarHorarios(chave, artistaId, dur) {
  const dow = dataDeChave(chave).getDay();
  const turno = EXPEDIENTE[dow];
  const artista = ARTISTAS.find(a => a.id === artistaId);
  if (!turno || !artista || !trabalhaNoDia(artista, dow)) return [];
  const [abre, fecha] = turno;
  const lista = [];
  for (let ini = abre; ini + dur <= fecha; ini += 60) {
    let livre = true;
    for (let h = ini; h < ini + dur; h += 60) if (horaOcupada(chave, artistaId, h, dow)) { livre = false; break; }
    lista.push({ inicio: ini, fim: ini + dur, livre });
  }
  return lista;
}

function proximosDias(agora, artistaId, dur) {
  const dias = [];
  const base = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const artista = ARTISTAS.find(a => a.id === artistaId);
  for (let i = 1; i <= DIAS_AGENDA; i++) {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
    const chave = chaveData(d);
    const dow = d.getDay();
    const fechado = !EXPEDIENTE[dow];
    const folga = !fechado && artista ? !trabalhaNoDia(artista, dow) : false;
    const livres = (!fechado && !folga && artista) ? gerarHorarios(chave, artistaId, dur).filter(h => h.livre).length : 0;
    dias.push({ chave, dow, dia: d.getDate(), mes: d.getMonth(), rotulo: i === 1 ? 'Amanhã' : DIAS_CURTO[dow], fechado, folga, livres });
  }
  return dias;
}

function proximoSabado(agora) {
  const d = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const falta = ((6 - d.getDay() + 7) % 7) || 7;
  d.setDate(d.getDate() + falta);
  return chaveData(d);
}

// ---------- Mensagens ----------
function mensagemOrcamento(o) {
  const local = LOCAIS.find(l => l.id === o.local);
  const artista = ARTISTAS.find(a => a.id === o.artista);
  const v = calcularOrcamento(o);
  const linhas = [
    `*Orçamento de tatuagem — ${NEGOCIO.nome}*`,
    '',
    `👤 *Nome:* ${o.nome.trim()}`,
    `🎨 *Estilo:* ${ESTILOS[o.estilo]}`,
    `📍 *Local do corpo:* ${local ? local.nome : '-'}`,
    `📏 *Tamanho aproximado:* ${o.cm} cm (${dicaTamanho(o.cm)})`,
    `🖤 *Cor:* ${o.colorida ? 'Colorida' : 'Só preto'}`,
    `🔁 *Cobertura ou reforma:* ${o.cobertura ? 'Sim, vai cobrir/reformar uma tatuagem' : 'Não, pele livre'}`,
    `✍️ *Artista:* ${artista ? artista.nome : 'Sem preferência'}`,
    `💭 *Ideia:* ${o.ideia.trim()}`,
    `📷 *Referência:* ${o.temFoto ? 'Tenho uma foto e vou mandar aqui na conversa.' : 'Sem foto por enquanto.'}`,
    '',
    `💰 *Estimativa do site:* a partir de ${reais(v.de)} (faixa de ${reais(v.de)} a ${reais(v.ate)})`,
    'Sei que o valor final é confirmado pelo artista. Aguardo o retorno!',
  ];
  return linhas.join('\n');
}

function mensagemAgenda(a) {
  const artista = ARTISTAS.find(x => x.id === a.artista);
  const linhas = [
    `*Pedido de agendamento — ${NEGOCIO.nome}*`,
    '',
    `👤 *Nome:* ${a.nome.trim()}`,
    `✍️ *Artista:* ${artista ? artista.nome : '-'}`,
    `📅 *Data:* ${capital(dataPorExtenso(a.data))}`,
    `⏰ *Horário:* ${hora(a.hora)} às ${hora(a.hora + a.dur)} (sessão de ${a.dur / 60}h)`,
    `🎨 *Tatuagem:* ${a.ideia.trim()}`,
    '',
    `💳 Estou ciente do sinal de ${reais(NEGOCIO.sinal)} por Pix para reservar (descontado do valor final).`,
    'Pode confirmar o horário e me mandar a chave Pix?',
  ];
  return linhas.join('\n');
}

// =========================================================
//  DESENHOS DE FLASH (SVG feitos à mão, viewBox 200 × 200)
// =========================================================
const T = '#141210', V = '#C2361F', V2 = '#8E2414', J = '#2F6B57', M = '#D9A425', P = '#F8F1E0', P2 = '#E2D3B2', A = '#DCD6C8';

const g = (s, conteudo) => `<g stroke="${T}" stroke-width="${s}" stroke-linejoin="round" stroke-linecap="round">${conteudo}</g>`;

function estrela(x, y, r, fill = T, s = 0) {
  return `<path d="M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r}Z" fill="${fill}" stroke-width="${s}"/>`;
}

function poligono(n, r, rot, cx = 100, cy = 100) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (rot + (360 / n) * i) * Math.PI / 180;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join(' L')}Z`;
}

const DESENHOS = {
  rosa(fino) {
    const s = fino ? 1.8 : 5, s2 = fino ? 1.4 : 4;
    const fv = fino ? 'none' : V, fv2 = fino ? 'none' : V2, fj = fino ? 'none' : J;
    return g(s, `
      ${fino ? `<path d="M100 140 C97 156 103 170 100 188" fill="none"/>
      <path d="M100 162 C110 152 122 151 130 156 C122 166 109 168 100 162Z" fill="none"/>
      <path d="M100 174 C90 166 78 166 72 170 C80 178 92 180 100 174Z" fill="none"/>` : ''}
      <path d="M62 122 C40 120 28 134 24 150 C42 152 58 142 66 130Z" fill="${fj}"/>
      <path d="M30 146 C42 140 52 134 62 126" fill="none" stroke-width="${s2 * 0.7}"/>
      <path d="M138 122 C160 118 174 130 178 146 C160 150 144 142 134 130Z" fill="${fj}"/>
      <path d="M172 142 C160 136 150 132 140 126" fill="none" stroke-width="${s2 * 0.7}"/>
      <path d="M60 100 C55 70 80 52 100 54 C122 52 146 68 140 100 C138 124 120 140 100 140 C78 140 62 126 60 100Z" fill="${fv}"/>
      <path d="M76 92 C78 74 94 68 104 70 C118 72 126 82 124 94 C114 88 104 90 100 96 C94 88 84 86 76 92Z" fill="${fv2}" stroke-width="${s2}"/>
      <path d="M92 84 C98 76 112 78 112 86 C112 93 101 95 99 89" fill="none" stroke-width="${s2}"/>
      <path d="M64 108 C78 116 90 112 100 104 C110 112 124 116 136 106" fill="none" stroke-width="${s2}"/>
      <path d="M78 128 C86 122 94 124 100 131 C106 124 116 122 124 128" fill="none" stroke-width="${s2}"/>
      ${fino ? `<circle cx="150" cy="70" r="1.6" fill="${T}" stroke="none"/><circle cx="158" cy="80" r="1.1" fill="${T}" stroke="none"/><circle cx="46" cy="76" r="1.3" fill="${T}" stroke="none"/>`
             : `<path d="M82 64 C88 60 94 58 100 59" stroke="${P}" stroke-width="3.5" fill="none"/>
                <path d="M128 112 C126 118 122 124 116 128" stroke="${P}" stroke-width="3" fill="none"/>
                <path d="M100 30 L100 40 M70 38 L75 46 M130 38 L125 46" fill="none"/>`}`);
  },

  andorinha(fino) {
    const s = fino ? 1.8 : 5;
    const corpo = fino ? 'none' : T, barriga = fino ? 'none' : P, garganta = fino ? 'none' : V;
    const pena = fino ? T : J, sp = fino ? 1.3 : 4;
    return g(s, `
      <path d="M138 88 C124 60 100 38 62 26 C70 44 80 58 84 70 C70 64 58 62 44 62 C62 76 86 92 112 96Z" fill="${corpo}"/>
      <path d="M80 40 C94 54 108 70 122 86 M60 64 C80 74 96 84 112 92" fill="none" stroke="${pena}" stroke-width="${sp}"/>
      <path d="M150 84 C162 82 172 88 176 94 L188 97 L176 101 C170 112 156 118 140 116 C116 114 90 110 66 112 L28 134 L46 108 L22 96 L64 100 C86 94 120 86 150 84Z" fill="${corpo}"/>
      <path d="M176 101 C170 112 156 118 140 116 C120 114 100 111 84 109 C106 105 142 104 176 101Z" fill="${barriga}" stroke-width="${s * 0.6}"/>
      <circle cx="165" cy="105" r="6" fill="${garganta}" stroke-width="${s * 0.6}"/>
      <circle cx="163" cy="91" r="${fino ? 2 : 3}" fill="${fino ? T : P}" stroke="none"/>
      <path d="M118 110 C114 130 102 148 82 164 C108 160 130 144 140 116Z" fill="${corpo}"/>
      <path d="M126 120 C120 136 110 148 98 156" fill="none" stroke="${pena}" stroke-width="${sp}"/>
      ${fino ? `<path d="M30 156 C50 150 62 150 74 156" fill="none" stroke-width="1.2" stroke-dasharray="0.5 6"/>${estrela(40, 40, 5, 'none', 1.2)}` : ''}`);
  },

  adaga() {
    return `<g transform="translate(0 -6)">` + g(5, `
      <path d="M90 80 L110 80 L108 148 L100 180 L92 148Z" fill="${A}"/>
      <path d="M100 84 L100 168" fill="none" stroke-width="3"/>
      <path d="M94 92 L94 140" fill="none" stroke="${P}" stroke-width="3"/>
      <path d="M64 72 C76 64 124 64 136 72 C130 84 70 84 64 72Z" fill="${M}"/>
      <circle cx="62" cy="72" r="6" fill="${M}"/><circle cx="138" cy="72" r="6" fill="${M}"/>
      <rect x="91" y="36" width="18" height="32" rx="4" fill="${V}"/>
      <path d="M91 47 L109 43 M91 57 L109 53" fill="none" stroke-width="3"/>
      <circle cx="100" cy="27" r="9" fill="${M}"/>
      <path d="M100 186 C96 192 95 196 100 199 C105 196 104 192 100 186Z" fill="${V}" stroke-width="2.5"/>
      <path d="M126 150 C123 155 122 158 126 160 C130 158 129 155 126 150Z" fill="${V}" stroke-width="2.5"/>
      ${estrela(150, 110, 9, M, 3)}${estrela(50, 128, 7, M, 3)}`) + `</g>`;
  },

  serpente() {
    const caminho = 'M40 168 C14 138 58 116 100 128 C150 142 184 110 162 80 C142 52 92 72 80 52 C72 36 94 24 112 30';
    return `
      <path d="${caminho}" fill="none" stroke="${T}" stroke-width="24" stroke-linecap="round"/>
      <path d="${caminho}" fill="none" stroke="${P}" stroke-width="12" stroke-dasharray="2.5 9"/>
      <path d="M40 168 C34 176 26 182 14 184" fill="none" stroke="${T}" stroke-width="12" stroke-linecap="round"/>
      <path d="M16 184 C10 185 6 184 3 181" fill="none" stroke="${T}" stroke-width="5" stroke-linecap="round"/>
      <path d="M106 20 C124 12 148 18 152 30 C148 42 124 46 106 40Z" fill="${T}"/>
      <circle cx="133" cy="27" r="3.5" fill="${P}"/>
      <path d="M152 30 L164 30 L171 24 M164 30 L171 36" fill="none" stroke="${V}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="40" cy="60" r="3" fill="${T}"/><circle cx="30" cy="74" r="2" fill="${T}"/><circle cx="172" cy="160" r="3" fill="${T}"/><circle cx="182" cy="146" r="2" fill="${T}"/>`;
  },

  luacheia() {
    return `
      <circle cx="100" cy="100" r="78" fill="none" stroke="${T}" stroke-width="3.5" stroke-dasharray="0.5 9" stroke-linecap="round"/>
      <circle cx="100" cy="100" r="62" fill="${T}"/>
      <circle cx="80" cy="84" r="14" fill="${P}"/><circle cx="82" cy="86" r="8" fill="${T}"/>
      <circle cx="122" cy="72" r="8" fill="${P}"/>
      <circle cx="118" cy="124" r="11" fill="${P}"/><circle cx="116" cy="122" r="5" fill="${T}"/>
      <circle cx="86" cy="130" r="5" fill="${P}"/><circle cx="140" cy="100" r="4" fill="${P}"/><circle cx="66" cy="110" r="3" fill="${P}"/>
      ${estrela(26, 34, 9)}${estrela(176, 168, 10)}${estrela(172, 36, 5)}${estrela(30, 166, 5)}`;
  },

  geometrico() {
    let pontos = '';
    for (let i = 0; i < 36; i++) {
      const a = (i * 10) * Math.PI / 180;
      const r = i % 2 ? 2 : 3.4;
      pontos += `<circle cx="${(100 + 86 * Math.cos(a)).toFixed(1)}" cy="${(100 + 86 * Math.sin(a)).toFixed(1)}" r="${r}" fill="${T}"/>`;
    }
    return `${pontos}` + g(4, `
      <circle cx="100" cy="100" r="72" fill="none" stroke-width="3"/>
      <path d="${poligono(6, 64, 30)}" fill="none"/>
      <path d="${poligono(3, 64, -90)}" fill="${T}"/>
      <path d="${poligono(3, 64, 90)}" fill="none" stroke-width="4"/>
      <circle cx="100" cy="100" r="15" fill="${P}"/>
      <circle cx="100" cy="100" r="5" fill="${T}" stroke="none"/>`);
  },

  crescente() {
    return g(2, `
      <circle cx="100" cy="100" r="84" fill="none" stroke-width="2.2" stroke-dasharray="0.5 7"/>
      <path d="M129 47 A66 66 0 1 0 147 146 A54 54 0 0 1 129 47Z" fill="none"/>
      <path d="M150 52 L150 84" fill="none" stroke-width="1.4"/>
      ${estrela(150, 92, 8, 'none', 1.6)}
      ${estrela(160, 120, 4, T, 0)}${estrela(40, 34, 6, 'none', 1.4)}${estrela(176, 64, 3, T, 0)}
      <circle cx="58" cy="100" r="1.4" fill="${T}" stroke="none"/><circle cx="72" cy="140" r="1.2" fill="${T}" stroke="none"/>`);
  },

  coracao(texto = 'Mãe') {
    return g(5, `
      <path d="M100 20 L100 31 M60 28 L66 37 M140 28 L134 37" fill="none" stroke-width="4"/>
      <path d="M100 172 C60 142 30 114 30 82 C30 58 48 42 68 42 C84 42 94 52 100 64 C106 52 116 42 132 42 C152 42 170 58 170 82 C170 114 140 142 100 172Z" fill="${V}"/>
      <path d="M50 74 C52 63 58 56 68 54" fill="none" stroke="${P}" stroke-width="5"/>
      <path d="M40 100 L10 104 L22 116 L10 130 L40 126Z" fill="${P2}" stroke-width="4"/>
      <path d="M160 100 L190 104 L178 116 L190 130 L160 126Z" fill="${P2}" stroke-width="4"/>
      <path d="M28 94 C70 87 130 87 172 94 L172 122 C130 115 70 115 28 122Z" fill="${P}" stroke-width="4"/>
      <text x="100" y="116" text-anchor="middle" font-family="'Pirata One', 'Old English Text MT', serif" font-size="${Math.min(27, Math.round(130 / (texto.length * 0.48)))}" fill="${T}" stroke="none">${texto}</text>`);
  },

  coragem() {
    return g(4, `
      ${estrela(100, 48, 14, P, 3)}
      <circle cx="70" cy="56" r="2.5" fill="${T}" stroke="none"/><circle cx="130" cy="56" r="2.5" fill="${T}" stroke="none"/>
      <path d="M36 92 L8 88 L18 104 L8 120 L36 116Z" fill="${P2}"/>
      <path d="M164 92 L192 88 L182 104 L192 120 L164 116Z" fill="${P2}"/>
      <path d="M26 84 C60 74 80 94 100 86 C120 78 140 98 174 88 L174 120 C140 130 120 110 100 118 C80 126 60 106 26 116Z" fill="${P}"/>
      <text x="100" y="111" text-anchor="middle" font-family="'Pirata One', 'Old English Text MT', serif" font-size="29" fill="${T}" stroke="none">Coragem</text>
      <path d="M64 146 C84 138 116 138 136 146" fill="none" stroke-width="2.5"/>
      <path d="M100 152 L106 158 L100 164 L94 158Z" fill="${T}" stroke-width="2"/>
      <path d="M78 156 C70 160 64 160 58 156 M122 156 C130 160 136 160 142 156" fill="none" stroke-width="2"/>`);
  },

  lavanda() {
    const hastes = [[100, 178, 72, 44], [100, 178, 104, 30], [100, 178, 134, 50]];
    let out = '';
    for (const [x0, y0, x1, y1] of hastes) {
      out += `<path d="M${x0} ${y0} Q${(x0 + x1) / 2 + 4} ${(y0 + y1) / 2} ${x1} ${y1}" fill="none"/>`;
      const ang = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI;
      for (let k = 0; k < 6; k++) {
        const t = 0.5 + k * 0.1;
        const cx = x0 + (x1 - x0) * t, cy = y0 + (y1 - y0) * t;
        out += `<ellipse cx="${(cx - 5).toFixed(1)}" cy="${cy.toFixed(1)}" rx="3.2" ry="6.5" transform="rotate(${(ang + 90 - 30).toFixed(0)} ${(cx - 5).toFixed(1)} ${cy.toFixed(1)})" fill="none"/>`;
        out += `<ellipse cx="${(cx + 5).toFixed(1)}" cy="${cy.toFixed(1)}" rx="3.2" ry="6.5" transform="rotate(${(ang + 90 + 30).toFixed(0)} ${(cx + 5).toFixed(1)} ${cy.toFixed(1)})" fill="none"/>`;
      }
      out += `<ellipse cx="${x1}" cy="${y1 - 4}" rx="3" ry="6" transform="rotate(${(ang + 90).toFixed(0)} ${x1} ${y1 - 4})" fill="none"/>`;
    }
    out += `<path d="M100 150 C86 138 74 142 78 152 C82 160 94 156 100 150Z M100 150 C114 138 126 142 122 152 C118 160 106 156 100 150Z" fill="none"/>
            <path d="M100 150 L90 172 M100 150 L112 170" fill="none"/>
            <path d="M84 120 C74 112 64 112 58 116 C66 124 76 126 84 120Z" fill="none"/>`;
    return g(1.6, out);
  },

  rosafina() { return DESENHOS.rosa(true); },
  andorinhafina() { return DESENHOS.andorinha(true); },

  cerejas() {
    return g(5, `
      <path d="M70 136 C80 100 100 70 128 50" fill="none" stroke-width="4"/>
      <path d="M134 140 C132 108 130 80 128 50" fill="none" stroke-width="4"/>
      <path d="M128 50 C140 30 164 28 178 34 C168 50 146 58 128 50Z" fill="${J}"/>
      <path d="M136 47 C148 42 160 38 172 36" fill="none" stroke-width="2.5"/>
      <circle cx="66" cy="150" r="25" fill="${V}"/>
      <circle cx="134" cy="156" r="25" fill="${V}"/>
      <path d="M52 142 C54 136 58 132 64 131" fill="none" stroke="${P}" stroke-width="4.5"/>
      <path d="M120 148 C122 142 126 138 132 137" fill="none" stroke="${P}" stroke-width="4.5"/>
      ${estrela(40, 60, 8, M, 3)}`);
  },

  raio() {
    return g(5, `
      <path d="M118 16 L56 112 L94 112 L76 186 L150 82 L108 82 L134 16Z" fill="${M}"/>
      <path d="M116 30 L76 100" fill="none" stroke="${P}" stroke-width="3.5"/>
      <path d="M40 60 L28 54 M44 44 L36 34 M160 130 L172 136 M156 148 L164 158" fill="none" stroke-width="4"/>`);
  },
};

function svgFlash(id, extra = '') {
  return `<svg viewBox="0 0 200 200" aria-hidden="true" focusable="false" ${extra}>${DESENHOS[id]()}</svg>`;
}

// ---------- Portfólio ----------
const FLASHES = [
  { id: 'rosa', nome: 'Rosa tradicional', estilo: 'oldschool', tam: '8 a 12 cm', cm: 10, local: 'Antebraço ou panturrilha', colorida: true, artista: 'caio' },
  { id: 'andorinha', nome: 'Andorinha', estilo: 'oldschool', tam: '7 a 10 cm', cm: 8, local: 'Peito, mão ou antebraço', colorida: true, artista: 'caio' },
  { id: 'adaga', nome: 'Adaga com gotas', estilo: 'oldschool', tam: '10 a 15 cm', cm: 12, local: 'Antebraço ou canela', colorida: true, artista: 'caio' },
  { id: 'crescente', nome: 'Lua crescente e estrelas', estilo: 'fineline', tam: '4 a 7 cm', cm: 5, local: 'Punho, nuca ou atrás da orelha', colorida: false, artista: 'lia' },
  { id: 'andorinhafina', nome: 'Andorinha em traço fino', estilo: 'fineline', tam: '4 a 6 cm', cm: 5, local: 'Punho ou clavícula', colorida: false, artista: 'lia' },
  { id: 'serpente', nome: 'Serpente', estilo: 'blackwork', tam: '15 a 22 cm', cm: 18, local: 'Braço, coxa ou costela', colorida: false, artista: 'caio' },
  { id: 'luacheia', nome: 'Lua cheia', estilo: 'blackwork', tam: '6 a 9 cm', cm: 7, local: 'Ombro ou nuca', colorida: false, artista: 'caio' },
  { id: 'geometrico', nome: 'Geométrico pontilhado', estilo: 'blackwork', tam: '8 a 12 cm', cm: 10, local: 'Antebraço ou costas', colorida: false, artista: 'caio' },
  { id: 'coracao', nome: 'Coração "Mãe"', estilo: 'lettering', tam: '7 a 10 cm', cm: 8, local: 'Braço ou peito', colorida: true, artista: 'caio' },
  { id: 'coragem', nome: 'Faixa "Coragem"', estilo: 'lettering', tam: '10 a 14 cm', cm: 12, local: 'Antebraço ou costela', colorida: false, artista: 'lia' },
  { id: 'lavanda', nome: 'Raminho de lavanda', estilo: 'floral', tam: '6 a 10 cm', cm: 8, local: 'Costela, tornozelo ou antebraço', colorida: false, artista: 'lia' },
  { id: 'rosafina', nome: 'Rosa em traço fino', estilo: 'floral', tam: '6 a 9 cm', cm: 7, local: 'Antebraço ou costela', colorida: false, artista: 'lia' },
];

// ---------- Flash day (preço fechado de vitrine) ----------
const FLASH_DAY = [
  { id: 'cerejas', nome: 'Cerejas', tam: '5 cm', preco: 180, nota: 'Colorida' },
  { id: 'raio', nome: 'Raio', tam: '6 cm', preco: 150, nota: 'Contorno e amarelo' },
  { id: 'andorinha', nome: 'Andorinha', tam: '7 cm', preco: 220, nota: 'Colorida' },
];

// ================= Interface (só no navegador) =================
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', iniciar);
}

function iniciar() {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rolar = (el) => el.scrollIntoView({ behavior: reduzMovimento ? 'auto' : 'smooth', block: 'start' });

  // ---- Toast ----
  let timerAviso;
  function avisar(txt) {
    const el = $('#aviso');
    el.textContent = txt;
    el.classList.add('is-on');
    clearTimeout(timerAviso);
    timerAviso = setTimeout(() => el.classList.remove('is-on'), 2800);
  }

  // ---- Hero ----
  $('#hero-flash').innerHTML = `
    <g transform="translate(14 26) scale(.86)">${DESENHOS.rosa()}</g>
    <g transform="translate(206 8) scale(.9)">${DESENHOS.adaga()}</g>
    <g transform="translate(6 214) scale(.92)">${DESENHOS.andorinha()}</g>
    <g transform="translate(200 218) scale(.92)">${DESENHOS.coracao('Itapuã')}</g>
    ${estrela(200, 210, 10, M, 3).replace('<path', `<path stroke="${T}"`)}
    ${estrela(30, 196, 6)}${estrela(380, 200, 6)}${estrela(196, 30, 5)}`;

  $('#arte-lia').innerHTML = DESENHOS.lavanda();
  $('#arte-caio').innerHTML = DESENHOS.rosa();

  // ---- Portfólio ----
  const grade = $('#grade-flash');
  function renderPortfolio(filtro) {
    const lista = FLASHES.filter(f => filtro === 'todos' || f.estilo === filtro);
    grade.innerHTML = lista.map(f => {
      const n = FLASHES.indexOf(f) + 1;
      return `<li class="flash">
        <button type="button" class="flash__btn" data-flash="${f.id}" aria-label="${esc(f.nome)}, ${ESTILOS[f.estilo]}. Ver detalhes">
          <span class="flash__num" aria-hidden="true">Nº ${String(n).padStart(2, '0')}</span>
          <span class="flash__arte">${svgFlash(f.id)}</span>
          <span class="flash__nome">${esc(f.nome)}</span>
          <span class="flash__estilo">${ESTILOS[f.estilo]} · ${f.tam}</span>
        </button>
      </li>`;
    }).join('');
    $('#contagem-flash').textContent = `${lista.length} desenho${lista.length > 1 ? 's' : ''} ${filtro === 'todos' ? 'no total' : 'em ' + ESTILOS[filtro]}`;
  }
  $('#filtros').addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-filtro]');
    if (!b) return;
    $$('#filtros [data-filtro]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    renderPortfolio(b.dataset.filtro);
  });
  renderPortfolio('todos');

  // ---- Modal do desenho ----
  const modal = $('#modal');
  let flashAberto = null;
  grade.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-flash]');
    if (!b) return;
    const f = FLASHES.find(x => x.id === b.dataset.flash);
    flashAberto = f;
    const artista = ARTISTAS.find(a => a.id === f.artista);
    $('#modal-arte').innerHTML = svgFlash(f.id);
    $('#modal-titulo').textContent = f.nome;
    $('#modal-estilo').textContent = ESTILOS[f.estilo];
    $('#modal-dados').innerHTML = `
      <div><dt>Tamanho sugerido</dt><dd>${f.tam}</dd></div>
      <div><dt>Fica bem em</dt><dd>${f.local}</dd></div>
      <div><dt>Cor</dt><dd>${f.colorida ? 'Colorida' : 'Só preto'}</dd></div>
      <div><dt>Quem faz</dt><dd>${artista.nome}</dd></div>`;
    if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', '');
    b.dataset.ultimo = '1';
  });
  modal.addEventListener('click', (ev) => {
    if (ev.target === modal || ev.target.closest('[data-fechar]')) modal.close();
  });
  modal.addEventListener('close', () => {
    const ult = $('[data-ultimo]');
    if (ult) { delete ult.dataset.ultimo; if (!modal.dataset.saiu) ult.focus(); }
    delete modal.dataset.saiu;
  });
  $('#modal-quero').addEventListener('click', () => {
    const f = flashAberto;
    if (!f) return;
    modal.dataset.saiu = '1';
    modal.close();
    preencherOrcamento({
      estilo: f.estilo, cm: f.cm, colorida: f.colorida, artista: f.artista,
      ideia: `Quero o desenho "${f.nome}" do portfólio (${f.tam}).`,
    });
    avisar(`"${f.nome}" foi para o seu orçamento`);
  });

  // ---- Flash day ----
  const sabado = proximoSabado(new Date());
  const sabadoTxt = dataPorExtenso(sabado);
  $('#flashday-data').textContent = capital(sabadoTxt);
  $('#lista-flashday').innerHTML = FLASH_DAY.map(f => `
    <li class="fd">
      <div class="fd__arte">${svgFlash(f.id)}</div>
      <div class="fd__txt">
        <h3>${f.nome}</h3>
        <p class="fd__info">${f.tam} · ${f.nota}</p>
        <p class="fd__preco"><span>preço fechado</span>${reais(f.preco)}</p>
        <a class="btn btn--mostarda fd__btn" target="_blank" rel="noopener" href="${linkWhatsApp(
          `Olá, ${NEGOCIO.nome}! ⚡\nQuero reservar o flash *${f.nome}* (${f.tam}, ${reais(f.preco)}) no Flash Day de ${sabadoTxt}.\nQual horário ainda tem livre?`)}">Reservar ${f.nome.toLowerCase()}</a>
      </div>
    </li>`).join('');

  // ---- Orçamento ----
  const orc = { nome: '', estilo: null, local: '', cm: 10, colorida: false, cobertura: false, artista: '', ideia: '', temFoto: false };
  const form = $('#form-orcamento');
  const selLocal = $('#orc-local');
  selLocal.innerHTML = '<option value="">Escolha o local</option>' + LOCAIS.map(l => `<option value="${l.id}">${l.nome}</option>`).join('');
  $('#orc-estilos').innerHTML = Object.entries(ESTILOS).map(([id, nome]) => `
    <label class="chip"><input type="radio" name="estilo" value="${id}"><span>${nome}</span></label>`).join('');
  $('#orc-artista').innerHTML = '<option value="">Sem preferência</option>' + ARTISTAS.map(a => `<option value="${a.id}">${a.nome} · ${a.estilos.toLowerCase()}</option>`).join('');

  const range = $('#orc-tamanho');
  function atualizarRange() {
    const min = Number(range.min), max = Number(range.max);
    range.style.setProperty('--pct', `${((orc.cm - min) / (max - min)) * 100}%`);
    $('#orc-tamanho-valor').textContent = `${orc.cm} cm`;
    $('#orc-tamanho-dica').textContent = `${capital(dicaTamanho(orc.cm))}. ${sessoesTamanho(orc.cm)}`;
    range.setAttribute('aria-valuetext', `${orc.cm} centímetros, ${dicaTamanho(orc.cm)}`);
  }

  function lerFormulario() {
    orc.nome = $('#orc-nome').value;
    const e = form.querySelector('input[name="estilo"]:checked');
    orc.estilo = e ? e.value : null;
    orc.local = selLocal.value;
    orc.cm = Number(range.value);
    orc.colorida = form.querySelector('input[name="cor"]:checked').value === 'colorida';
    orc.cobertura = form.querySelector('input[name="cobertura"]:checked').value === 'sim';
    orc.artista = $('#orc-artista').value;
    orc.ideia = $('#orc-ideia').value;
  }

  function atualizarOrcamento() {
    lerFormulario();
    atualizarRange();
    const v = calcularOrcamento({ ...orc, estilo: orc.estilo || 'naosei' });
    $('#valor-de').textContent = reais(v.de);
    $('#valor-faixa').textContent = `Faixa estimada: ${reais(v.de)} a ${reais(v.ate)}`;
    const partes = [
      orc.estilo ? ESTILOS[orc.estilo] : 'Estilo a definir',
      selLocal.value ? LOCAIS.find(l => l.id === orc.local).nome : 'local a definir',
      `${orc.cm} cm`,
      orc.colorida ? 'colorida' : 'só preto',
    ];
    if (orc.cobertura) partes.push('cobertura');
    $('#valor-resumo').textContent = partes.join(' · ');
    // leva a ideia para a agenda, se a pessoa ainda não escreveu lá
    const ag = $('#ag-ideia');
    if (!ag.dataset.mexeu) {
      ag.value = orc.estilo || orc.local ? `${partes.slice(0, 4).join(', ')}${orc.ideia.trim() ? ' — ' + orc.ideia.trim() : ''}` : '';
      agenda.ideia = ag.value;
      atualizarAgenda();
    }
  }
  form.addEventListener('input', atualizarOrcamento);
  form.addEventListener('change', atualizarOrcamento);

  function preencherOrcamento({ estilo, cm, colorida, artista, ideia }) {
    const r = form.querySelector(`input[name="estilo"][value="${estilo}"]`);
    if (r) r.checked = true;
    range.value = cm;
    form.querySelector(`input[name="cor"][value="${colorida ? 'colorida' : 'preto'}"]`).checked = true;
    $('#orc-artista').value = artista || '';
    $('#orc-ideia').value = ideia;
    limparErros();
    atualizarOrcamento();
    rolar($('#orcamento'));
    setTimeout(() => {
      const alvo = !$('#orc-nome').value.trim() ? $('#orc-nome') : !selLocal.value ? selLocal : $('#orc-ideia');
      alvo.focus({ preventScroll: true });
    }, reduzMovimento ? 0 : 500);
  }

  // Foto de referência: só pré-visualização local
  const inpFoto = $('#orc-foto');
  let urlFoto = null;
  inpFoto.addEventListener('change', () => {
    const arq = inpFoto.files && inpFoto.files[0];
    if (urlFoto) { URL.revokeObjectURL(urlFoto); urlFoto = null; }
    if (!arq || !arq.type.startsWith('image/')) {
      orc.temFoto = false;
      $('#foto-previa').hidden = true;
      if (arq) avisar('Escolha um arquivo de imagem (foto ou print).');
      inpFoto.value = '';
      return;
    }
    urlFoto = URL.createObjectURL(arq);
    $('#foto-img').src = urlFoto;
    $('#foto-nome').textContent = arq.name;
    $('#foto-previa').hidden = false;
    orc.temFoto = true;
  });
  $('#foto-remover').addEventListener('click', () => {
    if (urlFoto) URL.revokeObjectURL(urlFoto);
    urlFoto = null; inpFoto.value = ''; orc.temFoto = false;
    $('#foto-previa').hidden = true;
    $('#foto-rotulo').focus();
  });

  function limparErros() {
    $$('.campo__erro', form).forEach(e => { e.textContent = ''; });
    $$('[aria-invalid]', form).forEach(e => e.removeAttribute('aria-invalid'));
  }
  function erro(id, campo, txt) {
    $(id).textContent = txt;
    if (campo) campo.setAttribute('aria-invalid', 'true');
  }

  $('#btn-orcamento').addEventListener('click', () => {
    lerFormulario();
    limparErros();
    const faltas = [];
    if (orc.nome.trim().length < 2) { erro('#erro-orc-nome', $('#orc-nome'), 'Digite seu nome.'); faltas.push($('#orc-nome')); }
    if (!orc.estilo) { erro('#erro-orc-estilo', null, 'Escolha um estilo (ou “Ainda não sei”).'); faltas.push(form.querySelector('input[name="estilo"]')); }
    if (!orc.local) { erro('#erro-orc-local', selLocal, 'Escolha o local do corpo.'); faltas.push(selLocal); }
    if (orc.ideia.trim().length < 5) { erro('#erro-orc-ideia', $('#orc-ideia'), 'Conte em poucas palavras o que você quer tatuar.'); faltas.push($('#orc-ideia')); }
    if (faltas.length) { faltas[0].focus(); avisar('Falta pouco: confira os campos marcados.'); return; }
    window.open(linkWhatsApp(mensagemOrcamento(orc)), '_blank', 'noopener');
    $('#orc-ok').hidden = false;
    $('#orc-ok-foto').hidden = !orc.temFoto;
    $('#orc-ok').focus();
  });

  // ---- Agenda ----
  const agenda = { artista: null, dur: 180, data: null, hora: null, nome: '', ideia: '' };

  function avatarArtista(a) {
    return `<span class="artista__arte${a.id === 'lia' ? ' fino' : ''}">${svgFlash(a.desenho)}</span>`;
  }
  $('#ag-artistas').innerHTML = ARTISTAS.map(a => `
    <label class="artista">
      <input type="radio" name="artista" value="${a.id}">
      <span class="artista__card">
        ${avatarArtista(a)}
        <span class="artista__txt"><strong>${a.nome}</strong><small>${a.estilos}</small><small class="artista__folga">${a.folgaTxt}</small></span>
      </span>
    </label>`).join('');
  $('#ag-duracoes').innerHTML = DURACOES.map(d => `
    <label class="seg"><input type="radio" name="dur" value="${d}" ${d === agenda.dur ? 'checked' : ''}><span>${d / 60} horas<small>${d === 120 ? 'Peças pequenas e médias' : 'Peças maiores ou com cor'}</small></span></label>`).join('');

  function renderDias() {
    const caixa = $('#ag-dias');
    if (!agenda.artista) { caixa.innerHTML = '<p class="vazio">Escolha o artista para ver os dias livres.</p>'; return; }
    const dias = proximosDias(new Date(), agenda.artista, agenda.dur);
    if (agenda.data && !dias.find(d => d.chave === agenda.data && d.livres > 0)) { agenda.data = null; agenda.hora = null; }
    caixa.innerHTML = dias.map(d => {
      const off = d.fechado || d.folga || d.livres === 0;
      const nota = d.fechado ? 'Fechado' : d.folga ? 'Folga' : d.livres === 0 ? 'Lotado' : `${d.livres} livre${d.livres > 1 ? 's' : ''}`;
      return `<label class="dia"><input type="radio" name="dia" value="${d.chave}" ${off ? 'disabled' : ''} ${agenda.data === d.chave ? 'checked' : ''} aria-label="${capital(dataPorExtenso(d.chave))}, ${nota}">
        <span><em>${d.rotulo}</em><b>${d.dia}</b><i>${MESES_CURTO[d.mes]}</i><small>${nota}</small></span></label>`;
    }).join('');
  }

  function renderHorarios() {
    const caixa = $('#ag-horas');
    if (!agenda.data) { caixa.innerHTML = '<p class="vazio">Escolha um dia para ver os horários.</p>'; return; }
    const lista = gerarHorarios(agenda.data, agenda.artista, agenda.dur);
    if (agenda.hora !== null && !lista.find(h => h.inicio === agenda.hora && h.livre)) agenda.hora = null;
    caixa.innerHTML = lista.map(h => `
      <label class="hora"><input type="radio" name="hora" value="${h.inicio}" ${h.livre ? '' : 'disabled'} ${agenda.hora === h.inicio ? 'checked' : ''} aria-label="${hora(h.inicio)} às ${hora(h.fim)}${h.livre ? '' : ', ocupado'}">
        <span>${hora(h.inicio)}<small>até ${hora(h.fim)}</small></span></label>`).join('');
  }

  function prontoAgenda() {
    return agenda.artista && agenda.data && agenda.hora !== null && agenda.nome.trim().length >= 2 && agenda.ideia.trim().length >= 3;
  }

  function atualizarAgenda() {
    const r = $('#ag-resumo');
    if (!agenda.artista || !agenda.data || agenda.hora === null) {
      r.innerHTML = '<p>Escolha artista, dia e horário para ver o resumo.</p>';
    } else {
      const a = ARTISTAS.find(x => x.id === agenda.artista);
      r.innerHTML = `<p><strong>${a.nome}</strong> · ${capital(dataPorExtenso(agenda.data))}<br>${hora(agenda.hora)} às ${hora(agenda.hora + agenda.dur)} (sessão de ${agenda.dur / 60}h)</p>`;
    }
    $('#btn-agenda').classList.toggle('is-bloq', !prontoAgenda());
    $('#btn-agenda').setAttribute('aria-disabled', String(!prontoAgenda()));
  }

  $('#form-agenda').addEventListener('change', (ev) => {
    const t = ev.target;
    if (t.name === 'artista') { agenda.artista = t.value; renderDias(); renderHorarios(); }
    if (t.name === 'dur') { agenda.dur = Number(t.value); renderDias(); renderHorarios(); }
    if (t.name === 'dia') { agenda.data = t.value; agenda.hora = null; renderHorarios(); }
    if (t.name === 'hora') { agenda.hora = Number(t.value); }
    $$('#form-agenda .campo__erro').forEach(e => { e.textContent = ''; });
    atualizarAgenda();
  });
  $('#ag-nome').addEventListener('input', (ev) => { agenda.nome = ev.target.value; ev.target.removeAttribute('aria-invalid'); atualizarAgenda(); });
  $('#ag-ideia').addEventListener('input', (ev) => { agenda.ideia = ev.target.value; ev.target.dataset.mexeu = '1'; ev.target.removeAttribute('aria-invalid'); atualizarAgenda(); });

  $('#btn-agenda').addEventListener('click', () => {
    $$('#form-agenda .campo__erro').forEach(e => { e.textContent = ''; });
    let foco = null;
    const marca = (id, el, txt) => {
      $(id).textContent = txt;
      if (el && el.type !== 'radio') el.setAttribute('aria-invalid', 'true');
      foco = foco || el;
    };
    if (!agenda.artista) marca('#erro-ag-artista', $('#ag-artistas input'), 'Escolha com quem você quer tatuar.');
    else if (!agenda.data) marca('#erro-ag-dia', $('#ag-dias input:not([disabled])'), 'Escolha um dia livre.');
    else if (agenda.hora === null) marca('#erro-ag-hora', $('#ag-horas input:not([disabled])'), 'Escolha um horário livre.');
    if (agenda.nome.trim().length < 2) marca('#erro-ag-nome', $('#ag-nome'), 'Digite seu nome.');
    if (agenda.ideia.trim().length < 3) marca('#erro-ag-ideia', $('#ag-ideia'), 'Conte rapidinho o que vai tatuar.');
    if (foco) { foco.focus(); avisar('Falta pouco: confira os campos marcados.'); return; }
    window.open(linkWhatsApp(mensagemAgenda(agenda)), '_blank', 'noopener');
    avisar('Pedido pronto no WhatsApp. É só tocar em enviar!');
  });

  $$('.sinal-valor').forEach(el => { el.textContent = reais(NEGOCIO.sinal); });

  // ---- Contato ----
  $('#link-mapa').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(NEGOCIO.endereco);
  $('#zap-flutuante').href = linkWhatsApp(`Olá, ${NEGOCIO.nome}! Vim pelo site e quero tirar uma dúvida.`);
  $('#zap-contato').href = linkWhatsApp(`Olá, ${NEGOCIO.nome}! Vim pelo site e quero tirar uma dúvida.`);
  const hoje = new Date().getDay();
  const linhaHoje = $(`#tabela-horario tr[data-dia="${hoje}"]`);
  if (linhaHoje) linhaHoje.classList.add('is-hoje');

  // ---- Topo com borda ao rolar ----
  const topo = $('#topo');
  const aoRolar = () => topo.classList.toggle('is-rolado', window.scrollY > 8);
  window.addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();

  atualizarOrcamento();
  renderDias();
  renderHorarios();
  atualizarAgenda();
}

// Exporta a lógica para testes em Node
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRECOS, LOCAIS, calcularOrcamento, gerarHorarios, proximosDias, proximoSabado, mensagemOrcamento, mensagemAgenda, linkWhatsApp, DESENHOS, FLASHES };
}
