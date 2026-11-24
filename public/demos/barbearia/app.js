/* =========================================================
   Dom Navalha Barbearia — demonstração de agendamento online
   ========================================================= */

// Número do WhatsApp da barbearia (cliente real). Só números, com DDI + DDD.
// Ex.: '5527999998888'. Na demonstração fica vazio: o WhatsApp abre e deixa
// escolher o contato. Preenchido, as mensagens vão direto para esse número
// (https://wa.me/${numero}?text=...).
const WHATSAPP_NEGOCIO = '';

const NEGOCIO = {
  nome: 'Dom Navalha Barbearia',
  endereco: 'Rua Inácio Higino, 418 - Praia da Costa, Vila Velha - ES, 29101-430',
};

// ---------- Dados do negócio ----------
const SERVICOS = [
  { id: 'corte', nome: 'Corte', preco: 45, min: 40, desc: 'Máquina e tesoura, acabamento na navalha e finalização com pomada.', conflita: ['combo'] },
  { id: 'barba', nome: 'Barba', preco: 35, min: 30, desc: 'Toalha quente, óleo pré-barba, navalha e balm hidratante.', conflita: ['combo'] },
  { id: 'combo', nome: 'Corte + Barba', preco: 70, min: 70, desc: 'O ritual completo, com R$ 10 de desconto. O mais pedido da casa.', tag: 'Mais pedido', conflita: ['corte', 'barba'] },
  { id: 'sobrancelha', nome: 'Sobrancelha', preco: 15, min: 10, desc: 'Limpeza na navalha, discreta e alinhada ao formato do rosto.' },
  { id: 'pigmentacao', nome: 'Pigmentação', preco: 30, min: 20, desc: 'Preenche falhas da barba ou do corte e realça o desenho.' },
  { id: 'pezinho', nome: 'Pezinho', preco: 15, min: 15, desc: 'Acabamento de nuca e laterais para manter o corte entre visitas.' },
  { id: 'hidratacao', nome: 'Hidratação capilar', preco: 30, min: 20, desc: 'Máscara nutritiva com massagem no couro cabeludo.' },
  { id: 'infantil', nome: 'Corte infantil', preco: 35, min: 30, desc: 'Até 10 anos, com paciência de sobra e cadeirinha especial.' },
];

const BARBEIROS = [
  { id: 'joca', nome: 'Joca Ribeiro', espec: 'Barba e navalha clássica', bio: 'Na cadeira desde 1998', cor: '#9A2A1F', folga: [] },
  { id: 'rafa', nome: 'Rafa Mendes', espec: 'Degradê e desenhos', bio: 'Rei do disfarçado', cor: '#23443A', folga: [] },
  { id: 'dudu', nome: 'Dudu Santana', espec: 'Infantil e pigmentação', bio: 'Folga às segundas', cor: '#8A6420', folga: [1] },
];

// Expediente em minutos desde 0h, por dia da semana (0 = domingo).
const EXPEDIENTE = {
  0: null,
  1: [[540, 720], [780, 1200]], // 9h–12h e 13h–20h
  2: [[540, 720], [780, 1200]],
  3: [[540, 720], [780, 1200]],
  4: [[540, 720], [780, 1200]],
  5: [[540, 720], [780, 1200]],
  6: [[480, 1080]],             // sábado 8h–18h direto
};
const PASSO_MIN = 30;       // grade de horários a cada 30 min
const ANTECEDENCIA_MIN = 30; // para hoje, só horários a partir de agora + 30 min
const DIAS_AGENDA = 10;

const DIAS_SEMANA = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const DIAS_CURTO = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const MESES_CURTO = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// ---------- Utilidades puras (testáveis em Node) ----------
function linkWhatsApp(msg) {
  const numero = String(WHATSAPP_NEGOCIO || '').replace(/\D/g, '');
  const base = numero ? `https://wa.me/${numero}?text=` : 'https://wa.me/?text=';
  return base + encodeURIComponent(msg);
}

function dinheiro(v) {
  return 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function duracao(min) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
}

function hora(min) {
  return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
}

function horaCurta(min) {
  const m = min % 60;
  return `${Math.floor(min / 60)}h${m ? String(m).padStart(2, '0') : ''}`;
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

// Hash determinístico (FNV-1a + mistura) -> número em [0, 1)
function hash01(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function servicosSelecionados(ids) {
  return SERVICOS.filter(s => ids.includes(s.id));
}

function totais(ids) {
  const sel = servicosSelecionados(ids);
  return {
    preco: sel.reduce((a, s) => a + s.preco, 0),
    min: sel.reduce((a, s) => a + s.min, 0),
  };
}

// Alterna um serviço respeitando conflitos (ex.: combo x corte/barba)
function alternarServico(ids, id) {
  if (ids.includes(id)) return ids.filter(x => x !== id);
  const s = SERVICOS.find(x => x.id === id);
  if (!s) return ids;
  const bloqueia = new Set(s.conflita || []);
  return SERVICOS.map(x => x.id).filter(x => x === id || (ids.includes(x) && !bloqueia.has(x)));
}

function trabalhaNoDia(barbeiro, dow) {
  return !!EXPEDIENTE[dow] && !barbeiro.folga.includes(dow);
}

// Ocupação "simulada": cada bloco de 30 min de cada barbeiro em cada data
// é sorteado de forma determinística (mesma data = mesma agenda sempre).
function blocoOcupado(chave, barbeiroId, bloco, dow) {
  const chance = dow === 6 ? 0.3 : dow === 5 ? 0.24 : 0.18;
  return hash01(`${chave}|${barbeiroId}|${bloco}`) < chance;
}

function barbeiroLivre(chave, barbeiroId, inicio, dur, dow) {
  const b0 = Math.floor(inicio / PASSO_MIN);
  const b1 = Math.ceil((inicio + dur) / PASSO_MIN);
  for (let b = b0; b < b1; b++) {
    if (blocoOcupado(chave, barbeiroId, b, dow)) return false;
  }
  return true;
}

// Gera a grade de horários de um dia para a duração total pedida.
// barbeiroSel: id do barbeiro ou 'any' (sem preferência).
function gerarHorarios(chave, barbeiroSel, dur, agora) {
  const dow = dataDeChave(chave).getDay();
  const turnos = EXPEDIENTE[dow];
  if (!turnos || dur <= 0) return [];
  const candidatos = BARBEIROS.filter(b =>
    (barbeiroSel === 'any' || b.id === barbeiroSel) && trabalhaNoDia(b, dow));
  if (!candidatos.length) return [];

  let minimo = -Infinity;
  if (agora && chaveData(agora) === chave) {
    minimo = agora.getHours() * 60 + agora.getMinutes() + ANTECEDENCIA_MIN;
  }

  const lista = [];
  for (const [abre, fecha] of turnos) {
    for (let ini = abre; ini + dur <= fecha; ini += PASSO_MIN) {
      if (ini < minimo) continue;
      const livres = candidatos.filter(c => barbeiroLivre(chave, c.id, ini, dur, dow));
      let barbeiro = null;
      if (livres.length) barbeiro = livres[Math.floor(hash01(`${chave}#${ini}`) * livres.length)].id;
      lista.push({ inicio: ini, fim: ini + dur, disponivel: !!barbeiro, barbeiro });
    }
  }
  return lista;
}

// Próximos dias da agenda (inclui hoje). Domingo aparece como fechado.
function proximosDias(agora, barbeiroSel, dur) {
  const dias = [];
  const base = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  for (let i = 0; i < DIAS_AGENDA; i++) {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
    const chave = chaveData(d);
    const dow = d.getDay();
    const fechado = !EXPEDIENTE[dow];
    const b = barbeiroSel !== 'any' ? BARBEIROS.find(x => x.id === barbeiroSel) : null;
    const folga = !fechado && b ? !trabalhaNoDia(b, dow) : false;
    let livres = 0;
    if (!fechado && !folga) livres = gerarHorarios(chave, barbeiroSel, dur, agora).filter(h => h.disponivel).length;
    dias.push({
      chave, dow, dia: d.getDate(), mes: d.getMonth(),
      rotulo: i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : DIAS_CURTO[dow],
      fechado, folga, livres,
    });
  }
  return dias;
}

function nomeBarbeiro(id) {
  const b = BARBEIROS.find(x => x.id === id);
  return b ? b.nome : '';
}

function montarMensagem(estado) {
  const sel = servicosSelecionados(estado.servicos);
  const t = totais(estado.servicos);
  const barbeiroTxt = estado.barbeiro === 'any'
    ? `Sem preferência (horário livre com ${nomeBarbeiro(estado.barbeiroAtribuido)})`
    : nomeBarbeiro(estado.barbeiro);
  const linhas = [
    `*Novo agendamento — ${NEGOCIO.nome}*`,
    '',
    `👤 *Cliente:* ${estado.nome.trim()}`,
    `✂️ *Serviços:*`,
    ...sel.map(s => `   • ${s.nome} — ${dinheiro(s.preco)} (${duracao(s.min)})`),
    `💈 *Barbeiro:* ${barbeiroTxt}`,
    `📅 *Data:* ${dataPorExtenso(estado.data)}`,
    `⏰ *Horário:* ${hora(estado.hora)} às ${hora(estado.hora + t.min)}`,
    `⏱️ *Duração:* ${duracao(t.min)}`,
    `💰 *Total:* ${dinheiro(t.preco)}`,
  ];
  if (estado.obs && estado.obs.trim()) linhas.push(`📝 *Obs.:* ${estado.obs.trim()}`);
  linhas.push('', 'Pode confirmar meu horário? Obrigado!');
  return linhas.join('\n');
}

// Estado do expediente "agora" (aberto/fechado)
function statusAgora(agora) {
  const dow = agora.getDay();
  const turnos = EXPEDIENTE[dow];
  const m = agora.getHours() * 60 + agora.getMinutes();
  if (turnos) {
    for (const [a, f] of turnos) if (m >= a && m < f) return { aberto: true, texto: `Aberto agora · fecha às ${horaCurta(f)}` };
    const prox = turnos.find(([a]) => a > m);
    if (prox) return { aberto: false, texto: `Fechado agora · abre às ${horaCurta(prox[0])}` };
  }
  for (let i = 1; i <= 7; i++) {
    const d = (dow + i) % 7;
    if (EXPEDIENTE[d]) {
      const quando = i === 1 ? 'amanhã' : DIAS_SEMANA[d];
      return { aberto: false, texto: `Fechado agora · abre ${quando} às ${horaCurta(EXPEDIENTE[d][0][0])}` };
    }
  }
  return { aberto: false, texto: 'Fechado' };
}

// ---------- Galeria (ilustrações SVG geradas) ----------
const ESTILOS = [
  { nome: 'Degradê navalhado', desc: 'Laterais no zero com transição suave', fundo: '#9A2A1F', pele: '#B9784E', cabelo: 'fade' },
  { nome: 'Topete clássico', desc: 'Volume em cima, laterais baixas', fundo: '#23443A', pele: '#E6B48C', cabelo: 'topete' },
  { nome: 'Barba lenhador', desc: 'Barba cheia desenhada na navalha', fundo: '#C9973F', pele: '#8D5534', cabelo: 'curto', barba: 'cheia' },
  { nome: 'Crop francês', desc: 'Franja reta e textura no topo', fundo: '#1C1714', pele: '#F0C8A0', cabelo: 'crop' },
  { nome: 'Social com risca', desc: 'Risca lateral marcada, elegante', fundo: '#24456E', pele: '#C98D62', cabelo: 'social', barba: 'cavanhaque' },
  { nome: 'Buzz cut + desenho', desc: 'Máquina baixa com risco lateral', fundo: '#6E2A4A', pele: '#6B3F26', cabelo: 'buzz' },
];

function svgEstilo(e, i) {
  const tinta = '#1C1714';
  const gid = `g${i}`;
  const cabelos = {
    fade: `<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset=".35" stop-color="${tinta}"/><stop offset="1" stop-color="${tinta}" stop-opacity="0"/></linearGradient>
      <path d="M57 98 C52 50 78 34 100 34 C124 34 150 48 143 98 C140 76 130 66 100 64 C72 64 60 76 57 98Z" fill="url(#${gid})"/>
      <path d="M62 64 C74 44 126 42 138 64 C128 54 112 50 100 50 C88 50 72 54 62 64Z" fill="${tinta}"/>`,
    topete: `<path d="M57 92 C48 52 66 18 110 16 C146 14 160 40 148 60 C152 70 148 82 143 92 C138 72 122 64 100 64 C80 64 63 72 57 92Z" fill="${tinta}"/>
      <path d="M78 34 C96 22 126 20 140 34" fill="none" stroke="#3a302a" stroke-width="4" stroke-linecap="round"/>`,
    curto: `<path d="M58 92 C56 54 78 42 100 42 C122 42 144 54 142 92 C138 70 124 60 100 60 C76 60 62 70 58 92Z" fill="${tinta}"/>`,
    crop: `<path d="M57 94 C52 52 78 38 100 38 C124 38 150 52 143 94 L141 76 C128 70 112 74 100 74 C86 74 72 70 59 76Z" fill="${tinta}"/>
      <path d="M68 74 l4 -8 M80 74 l3 -9 M92 74 l3 -9 M104 74 l3 -9 M116 74 l3 -9 M128 73 l3 -8" stroke="#3a302a" stroke-width="3" stroke-linecap="round"/>`,
    social: `<path d="M57 92 C52 50 84 36 106 36 C132 36 150 54 143 92 C140 72 128 62 114 60 L92 58 C74 62 62 72 57 92Z" fill="${tinta}"/>
      <path d="M86 40 C84 48 86 54 90 58" fill="none" stroke="${e.pele}" stroke-width="2.5" stroke-linecap="round"/>`,
    buzz: `<path d="M58 92 C58 56 78 46 100 46 C122 46 142 56 142 92 C138 68 124 58 100 58 C76 58 62 68 58 92Z" fill="${tinta}" opacity=".75"/>
      <path d="M134 66 l8 6 M132 74 l9 3" stroke="${e.pele}" stroke-width="2.5" stroke-linecap="round"/>`,
  };
  const barbas = {
    cheia: `<path d="M58 100 C58 152 82 176 100 176 C118 176 142 152 142 100 C136 126 122 132 112 130 C106 126 94 126 88 130 C78 132 64 126 58 100Z" fill="${tinta}"/>
      <path d="M84 128 C92 122 108 122 116 128" fill="none" stroke="${e.pele}" stroke-width="3" stroke-linecap="round"/>`,
    cavanhaque: `<path d="M86 136 C86 150 94 156 100 156 C106 156 114 150 114 136 C108 140 92 140 86 136Z" fill="${tinta}"/>
      <path d="M84 124 C92 119 108 119 116 124 C110 127 90 127 84 124Z" fill="${tinta}"/>`,
  };
  return `<svg viewBox="0 0 200 220" role="img" aria-label="Ilustração do estilo ${e.nome}">
    <rect width="200" height="220" fill="${e.fundo}"/>
    <circle cx="100" cy="100" r="78" fill="#F4ECDF" opacity=".08"/>
    <path d="M24 220 C34 176 66 164 100 164 C134 164 166 176 176 220Z" fill="#F4ECDF"/>
    <path d="M84 166 L100 190 L116 166" fill="none" stroke="${e.fundo}" stroke-width="3" opacity=".5"/>
    <rect x="86" y="132" width="28" height="36" rx="6" fill="${e.pele}"/>
    <rect x="86" y="140" width="28" height="12" fill="#000" opacity=".12"/>
    <ellipse cx="58" cy="106" rx="8" ry="13" fill="${e.pele}"/>
    <ellipse cx="142" cy="106" rx="8" ry="13" fill="${e.pele}"/>
    <ellipse cx="100" cy="102" rx="42" ry="52" fill="${e.pele}"/>
    ${cabelos[e.cabelo] || ''}
    <path d="M78 94 h14 M108 94 h14" stroke="${tinta}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="85" cy="104" r="3" fill="${tinta}"/><circle cx="115" cy="104" r="3" fill="${tinta}"/>
    <path d="M100 106 C98 116 96 120 102 121" fill="none" stroke="${tinta}" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>
    ${barbas[e.barba] || ''}
    <path d="M91 134 C96 137 104 137 109 134" fill="none" stroke="${tinta}" stroke-width="3" stroke-linecap="round"/>
  </svg>`;
}

// ================= Interface (só no navegador) =================
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', iniciar);
}

function iniciar() {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rolar = (el) => el.scrollIntoView({ behavior: reduzMovimento ? 'auto' : 'smooth', block: 'start' });

  const estado = {
    passo: 1,
    servicos: [],
    barbeiro: null,
    barbeiroAtribuido: null,
    data: null,
    hora: null,
    nome: '',
    obs: '',
  };

  // ---- Lista de serviços (vitrine) ----
  $('#lista-servicos').innerHTML = SERVICOS.map(s => `
    <li class="servico">
      <div class="servico__topo">
        <h3>${s.nome}${s.tag ? ` <span class="tag">${s.tag}</span>` : ''}</h3>
        <span class="servico__pontos" aria-hidden="true"></span>
        <p class="servico__preco">${dinheiro(s.preco).replace(',00', '')}</p>
      </div>
      <p class="servico__desc">${s.desc}</p>
      <div class="servico__base">
        <span class="servico__dur"><svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>${duracao(s.min)}</span>
        <button type="button" class="link-agendar" data-agendar="${s.id}" aria-label="Agendar ${s.nome}">Agendar →</button>
      </div>
    </li>`).join('');

  $('#lista-servicos').addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-agendar]');
    if (!b) return;
    const id = b.dataset.agendar;
    if (!estado.servicos.includes(id)) estado.servicos = alternarServico(estado.servicos, id);
    validarSelecao();
    renderServicos();
    irPara(1);
    rolar($('#agendar'));
    avisar(`${SERVICOS.find(s => s.id === id).nome} adicionado ao agendamento`);
  });

  // ---- Passo 1: serviços ----
  function renderServicos() {
    $('#op-servicos').innerHTML = SERVICOS.map(s => {
      const on = estado.servicos.includes(s.id);
      return `<button type="button" class="opcao opcao--serv${on ? ' is-on' : ''}" aria-pressed="${on}" data-serv="${s.id}">
        <span class="opcao__check" aria-hidden="true"></span>
        <span class="opcao__txt"><strong>${s.nome}</strong><small>${duracao(s.min)}</small></span>
        <span class="opcao__preco">${dinheiro(s.preco).replace(',00', '')}</span>
      </button>`;
    }).join('');
  }
  $('#op-servicos').addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-serv]');
    if (!b) return;
    estado.servicos = alternarServico(estado.servicos, b.dataset.serv);
    validarSelecao();
    renderServicos();
    atualizar();
    const novo = $(`[data-serv="${b.dataset.serv}"]`);
    if (novo) novo.focus();
  });

  // ---- Passo 2: barbeiros ----
  function avatar(b) {
    const ini = b.nome.split(' ').map(p => p[0]).join('');
    return `<svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true"><circle cx="28" cy="28" r="28" fill="${b.cor}"/><text x="28" y="36" text-anchor="middle" font-family="'Big Shoulders Display', Impact, sans-serif" font-weight="800" font-size="24" fill="#F4ECDF">${ini}</text></svg>`;
  }
  function renderBarbeiros() {
    const opc = [
      ...BARBEIROS.map(b => ({ id: b.id, html: `${avatar(b)}<span class="opcao__txt"><strong>${b.nome}</strong><small>${b.espec}</small><small class="opcao__bio">${b.bio}</small></span>` })),
      { id: 'any', html: `<svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true"><circle cx="28" cy="28" r="27" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4"/><path d="M19 28h18M28 19v18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg><span class="opcao__txt"><strong>Sem preferência</strong><small>Mostra todos os horários livres</small><small class="opcao__bio">Mais opções de horário</small></span>` },
    ];
    $('#op-barbeiros').innerHTML = opc.map(o => {
      const on = estado.barbeiro === o.id;
      return `<button type="button" class="opcao opcao--barb${on ? ' is-on' : ''}" aria-pressed="${on}" data-barb="${o.id}">${o.html}</button>`;
    }).join('');
  }
  $('#op-barbeiros').addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-barb]');
    if (!b) return;
    estado.barbeiro = b.dataset.barb;
    validarSelecao();
    renderBarbeiros();
    atualizar();
    setTimeout(() => irPara(3, true), reduzMovimento ? 0 : 180);
  });

  // ---- Passo 3: dias ----
  function renderDias() {
    const t = totais(estado.servicos);
    const dias = proximosDias(new Date(), estado.barbeiro || 'any', t.min);
    $('#op-dias').innerHTML = dias.map(d => {
      const indisponivel = d.fechado || d.folga || d.livres === 0;
      const nota = d.fechado ? 'Fechado' : d.folga ? 'Folga' : d.livres === 0 ? 'Lotado' : `${d.livres} livre${d.livres > 1 ? 's' : ''}`;
      const on = estado.data === d.chave;
      return `<button type="button" class="dia${on ? ' is-on' : ''}" data-dia="${d.chave}" aria-pressed="${on}" ${indisponivel ? 'disabled' : ''}
        aria-label="${dataPorExtenso(d.chave)} — ${nota}">
        <span class="dia__rot">${d.rotulo}</span>
        <span class="dia__num">${d.dia}</span>
        <span class="dia__mes">${MESES_CURTO[d.mes]}</span>
        <span class="dia__nota">${nota}</span>
      </button>`;
    }).join('');
  }
  $('#op-dias').addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-dia]');
    if (!b || b.disabled) return;
    estado.data = b.dataset.dia;
    estado.hora = null; estado.barbeiroAtribuido = null;
    renderDias();
    atualizar();
    setTimeout(() => irPara(4, true), reduzMovimento ? 0 : 180);
  });

  // ---- Passo 4: horários ----
  function renderHorarios() {
    const t = totais(estado.servicos);
    const lista = estado.data ? gerarHorarios(estado.data, estado.barbeiro, t.min, new Date()) : [];
    const quem = estado.barbeiro === 'any' ? 'qualquer barbeiro' : nomeBarbeiro(estado.barbeiro);
    $('#dica-horario').textContent = estado.data
      ? `${capital(dataPorExtenso(estado.data))} · ${duracao(t.min)} com ${quem}.`
      : 'Escolha um dia primeiro.';
    if (!lista.length) {
      $('#op-horarios').innerHTML = `<p class="vazio">Não há mais horários para esse dia. Que tal escolher outro?</p>`;
      return;
    }
    let ultimoTurno = null;
    $('#op-horarios').innerHTML = lista.map(h => {
      const turno = h.inicio < 720 ? 'Manhã' : h.inicio < 1080 ? 'Tarde' : 'Noite';
      const cab = turno !== ultimoTurno ? `<p class="turno">${turno}</p>` : '';
      ultimoTurno = turno;
      const on = estado.hora === h.inicio;
      return `${cab}<button type="button" class="hora${on ? ' is-on' : ''}" data-hora="${h.inicio}" data-barb="${h.barbeiro || ''}" aria-pressed="${on}" ${h.disponivel ? '' : 'disabled'}
        aria-label="${hora(h.inicio)}${h.disponivel ? '' : ' — ocupado'}">${hora(h.inicio)}</button>`;
    }).join('');
  }
  $('#op-horarios').addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-hora]');
    if (!b || b.disabled) return;
    estado.hora = Number(b.dataset.hora);
    estado.barbeiroAtribuido = b.dataset.barb || null;
    renderHorarios();
    atualizar();
    setTimeout(() => irPara(5, true), reduzMovimento ? 0 : 200);
  });

  // ---- Passo 5: dados + resumo ----
  const inpNome = $('#nome'), inpObs = $('#obs');
  inpNome.addEventListener('input', () => { estado.nome = inpNome.value; $('#erro-nome').textContent = ''; inpNome.removeAttribute('aria-invalid'); atualizar(); });
  inpObs.addEventListener('input', () => { estado.obs = inpObs.value; atualizar(); });

  function renderResumo() {
    if (!estado.data || estado.hora === null) { $('#resumo').innerHTML = ''; return; }
    const sel = servicosSelecionados(estado.servicos);
    const t = totais(estado.servicos);
    const barb = estado.barbeiro === 'any'
      ? `Sem preferência <small>(livre: ${nomeBarbeiro(estado.barbeiroAtribuido)})</small>`
      : nomeBarbeiro(estado.barbeiro);
    $('#resumo').innerHTML = `
      <p class="resumo__tit">Resumo do agendamento</p>
      <dl>
        <div><dt>Serviços</dt><dd>${sel.map(s => `${s.nome} <span>${dinheiro(s.preco)}</span>`).join('<br>')}</dd></div>
        <div><dt>Barbeiro</dt><dd>${barb}</dd></div>
        <div><dt>Data</dt><dd>${capital(dataPorExtenso(estado.data))}</dd></div>
        <div><dt>Horário</dt><dd>${hora(estado.hora)} às ${hora(estado.hora + t.min)} <span>(${duracao(t.min)})</span></dd></div>
        <div class="resumo__total"><dt>Total</dt><dd>${dinheiro(t.preco)}</dd></div>
      </dl>
      <p class="resumo__pag">Pagamento na barbearia: Pix, cartão ou dinheiro.</p>`;
  }

  // ---- Navegação entre passos ----
  function podeAvancar(p) {
    if (p === 1) return estado.servicos.length > 0;
    if (p === 2) return !!estado.barbeiro;
    if (p === 3) return !!estado.data;
    if (p === 4) return estado.hora !== null;
    return true;
  }
  const mensagensBloqueio = {
    1: 'Escolha pelo menos um serviço.',
    2: 'Escolha um barbeiro ou “Sem preferência”.',
    3: 'Escolha um dia disponível.',
    4: 'Escolha um horário livre.',
  };

  function irPara(p, foco) {
    // não deixa pular etapas sem preencher as anteriores
    for (let i = 1; i < p && i <= 4; i++) if (!podeAvancar(i)) { p = i; break; }
    estado.passo = p;
    if (p === 3) renderDias();
    if (p === 4) renderHorarios();
    if (p === 5) renderResumo();
    $$('[data-painel]').forEach(el => { el.hidden = Number(el.dataset.painel) !== p; });
    atualizar();
    if (foco) {
      const painel = $(`[data-painel="${p}"]`);
      const alvo = painel.querySelector('.is-on, button:not([disabled]), input');
      if (p === 5) inpNome.focus({ preventScroll: true });
      else if (alvo) alvo.focus({ preventScroll: true });
      const agenda = $('#agenda');
      if (agenda.getBoundingClientRect().top < 0) rolar(agenda);
    }
  }

  function validarSelecao() {
    // Se mudou serviço/barbeiro, o horário escolhido pode não caber mais
    if (estado.data && estado.hora !== null && estado.barbeiro) {
      const t = totais(estado.servicos);
      const h = gerarHorarios(estado.data, estado.barbeiro, t.min, new Date()).find(x => x.inicio === estado.hora);
      if (!h || !h.disponivel) { estado.hora = null; estado.barbeiroAtribuido = null; }
      else estado.barbeiroAtribuido = h.barbeiro;
    }
    if (estado.data && estado.barbeiro && estado.barbeiro !== 'any') {
      const b = BARBEIROS.find(x => x.id === estado.barbeiro);
      if (!trabalhaNoDia(b, dataDeChave(estado.data).getDay())) { estado.data = null; estado.hora = null; }
    }
  }

  function atualizar() {
    const t = totais(estado.servicos);
    $('#total-valor').textContent = dinheiro(t.preco);
    $('#total-dur').textContent = t.min ? `${duracao(t.min)} · ${estado.servicos.length} serviço${estado.servicos.length > 1 ? 's' : ''}` : 'Escolha um serviço';

    $$('#passos li').forEach(li => {
      const n = Number(li.dataset.passo);
      li.classList.toggle('is-atual', n === estado.passo);
      li.classList.toggle('is-feito', n < estado.passo || (estado.passo === 6));
      if (n === estado.passo) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });

    const p = estado.passo;
    $('#btn-voltar').hidden = p === 1 || p === 6;
    $('#btn-avancar').hidden = p >= 5;
    $('#btn-confirmar').hidden = p !== 5;
    $('#rodape-agenda').hidden = p === 6;
    $('#btn-avancar').classList.toggle('is-bloq', !podeAvancar(p));
    $('#btn-avancar').setAttribute('aria-disabled', String(!podeAvancar(p)));

    const pronto = estado.nome.trim().length >= 2 && podeAvancar(4);
    const conf = $('#btn-confirmar');
    conf.classList.toggle('is-bloq', !pronto);
    conf.setAttribute('aria-disabled', String(!pronto));
    conf.href = pronto ? linkWhatsApp(montarMensagem(estado)) : '#';
    if (p === 5) renderResumo();
  }

  $('#btn-avancar').addEventListener('click', () => {
    if (!podeAvancar(estado.passo)) { avisar(mensagensBloqueio[estado.passo]); return; }
    irPara(estado.passo + 1, true);
  });
  $('#btn-voltar').addEventListener('click', () => irPara(Math.max(1, estado.passo - 1), true));

  // Permite voltar clicando nas etapas já feitas
  $('#passos').addEventListener('click', (ev) => {
    const li = ev.target.closest('li');
    if (!li) return;
    const n = Number(li.dataset.passo);
    if (n < estado.passo && estado.passo !== 6) irPara(n, true);
  });

  $('#btn-confirmar').addEventListener('click', (ev) => {
    if (estado.nome.trim().length < 2) {
      ev.preventDefault();
      $('#erro-nome').textContent = 'Digite seu nome para a barbearia saber quem vem.';
      inpNome.setAttribute('aria-invalid', 'true');
      inpNome.focus();
      return;
    }
    const link = linkWhatsApp(montarMensagem(estado));
    $('#ok-reabrir').href = link;
    const t = totais(estado.servicos);
    const quem = estado.barbeiro === 'any' ? nomeBarbeiro(estado.barbeiroAtribuido) : nomeBarbeiro(estado.barbeiro);
    $('#ok-resumo').textContent = `${capital(dataPorExtenso(estado.data))}, às ${hora(estado.hora)}, com ${quem} · ${dinheiro(t.preco)}`;
    // deixa o link abrir normalmente (target _blank) e mostra a tela de sucesso
    setTimeout(() => irPara(6, true), 50);
  });

  $('#ok-novo').addEventListener('click', () => {
    Object.assign(estado, { servicos: [], barbeiro: null, barbeiroAtribuido: null, data: null, hora: null, obs: '' });
    inpObs.value = '';
    renderServicos(); renderBarbeiros();
    irPara(1, true);
  });

  // ---- Clube ----
  $$('[data-plano]').forEach(a => {
    a.href = linkWhatsApp(`Olá, ${NEGOCIO.nome}! 💈\nQuero assinar o *Clube Dom Navalha — plano ${a.dataset.plano}* (${a.dataset.preco}).\nComo funciona para começar?`);
  });

  // ---- Galeria ----
  $('#galeria-lista').innerHTML = ESTILOS.map((e, i) => `
    <li>
      <button type="button" class="corte" data-estilo="${i}">
        <span class="corte__arte">${svgEstilo(e, i)}</span>
        <span class="corte__txt"><strong>${e.nome}</strong><small>${e.desc}</small></span>
        <span class="corte__mais" aria-hidden="true">Quero esse</span>
      </button>
    </li>`).join('');
  $('#galeria-lista').addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-estilo]');
    if (!b) return;
    const e = ESTILOS[Number(b.dataset.estilo)];
    estado.obs = `Quero o estilo "${e.nome}"`;
    inpObs.value = estado.obs;
    if (!estado.servicos.length) estado.servicos = alternarServico([], e.barba ? 'combo' : 'corte');
    validarSelecao();
    renderServicos();
    irPara(estado.passo === 6 ? 1 : Math.min(estado.passo, 2));
    rolar($('#agendar'));
    avisar(`Estilo "${e.nome}" anotado no agendamento`);
  });

  // ---- Contato / mapa / status ----
  $('#link-mapa').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(NEGOCIO.endereco);
  $('#zap-flutuante').href = linkWhatsApp(`Olá, ${NEGOCIO.nome}! Vim pelo site e quero tirar uma dúvida.`);
  const agora = new Date();
  const st = statusAgora(agora);
  const elSt = $('#status-agora');
  elSt.textContent = st.texto;
  elSt.classList.add(st.aberto ? 'is-aberto' : 'is-fechado');
  const linhaHoje = $(`#tabela-horario tr[data-dia="${agora.getDay()}"]`);
  if (linhaHoje) { linhaHoje.classList.add('is-hoje'); linhaHoje.querySelector('th').insertAdjacentHTML('beforeend', ' <span class="hoje">hoje</span>'); }

  // ---- Aviso (toast) ----
  let timerAviso;
  function avisar(txt) {
    const el = $('#aviso');
    el.textContent = txt;
    el.classList.add('is-on');
    clearTimeout(timerAviso);
    timerAviso = setTimeout(() => el.classList.remove('is-on'), 2600);
  }

  // ---- Topo com sombra ao rolar ----
  const topo = $('#topo');
  const aoRolar = () => topo.classList.toggle('is-rolado', window.scrollY > 8);
  window.addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();

  function capital(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  renderServicos();
  renderBarbeiros();
  irPara(1);
}

// Exporta a lógica para testes em Node
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SERVICOS, BARBEIROS, EXPEDIENTE, linkWhatsApp, dinheiro, duracao, hora, chaveData, dataDeChave,
    dataPorExtenso, hash01, totais, alternarServico, gerarHorarios, proximosDias, montarMensagem, statusAgora, svgEstilo, ESTILOS,
  };
}
