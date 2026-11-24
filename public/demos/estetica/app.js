/* =========================================================
   Ondina Estética Avançada — demonstração
   HTML/CSS/JS puro, sem dependências.
   ========================================================= */

// Número de WhatsApp da clínica: só dígitos, com DDI + DDD (ex.: '5527999998888').
// Deixe vazio ('') para o WhatsApp perguntar para qual contato enviar.
const WHATSAPP_NEGOCIO = '';

const NOME_CLINICA = 'Ondina';

/* ---------- Dados ---------- */

const CATEGORIAS = [
  { id: 'facial', nome: 'Facial' },
  { id: 'corporal', nome: 'Corporal' },
  { id: 'laser', nome: 'Depilação a laser' },
  { id: 'olhar', nome: 'Sobrancelhas & cílios' },
];

const PROS = {
  helena: { nome: 'Helena Moraes', cargo: 'Esteticista e cosmetóloga', ini: 'HM' },
  bianca: { nome: 'Bianca Toledo', cargo: 'Biomédica esteta', ini: 'BT' },
  sem: { nome: 'Sem preferência', cargo: 'A primeira disponível', ini: '—' },
};

const TRATAMENTOS = [
  // Facial
  { id: 'limpeza', cat: 'facial', nome: 'Limpeza de pele profunda', dur: 90, preco: 180, pros: ['helena'],
    desc: 'Higienização, esfoliação, extração cuidadosa de cravos, máscara calmante e fotoproteção. A base de toda rotina de cuidado.',
    indicado: 'Cravos, poros dilatados e oleosidade' },
  { id: 'hidra', cat: 'facial', nome: 'Hidratação facial com LED', dur: 50, preco: 160, pros: ['helena'],
    desc: 'Ativos hidratantes e calmantes associados à luz de LED para devolver conforto e viço à pele.',
    indicado: 'Pele desidratada, sensível ou depois de muito sol' },
  { id: 'peeling', cat: 'facial', nome: 'Peeling químico suave', dur: 45, preco: 220, pros: ['helena', 'bianca'],
    desc: 'Renovação controlada das camadas superficiais da pele, com ácidos escolhidos para o seu fototipo.',
    indicado: 'Manchas leves, textura irregular e falta de luminosidade' },
  { id: 'microag', cat: 'facial', nome: 'Microagulhamento', dur: 60, preco: 350, pros: ['bianca'],
    desc: 'Microperfurações controladas que estimulam a produção natural de colágeno. Com anestésico tópico e material descartável.',
    indicado: 'Marcas de acne, linhas finas e poros aparentes' },
  // Corporal
  { id: 'drenagem', cat: 'corporal', nome: 'Drenagem linfática', dur: 60, preco: 140, pros: ['helena', 'bianca'],
    desc: 'Manobras suaves e ritmadas que estimulam a circulação linfática e trazem sensação de leveza.',
    indicado: 'Retenção de líquidos, inchaço e pós-operatório (com liberação médica)' },
  { id: 'radio', cat: 'corporal', nome: 'Radiofrequência corporal', dur: 50, preco: 220, pros: ['bianca'],
    desc: 'Aquecimento controlado das camadas profundas da pele para estimular colágeno e melhorar a firmeza.',
    indicado: 'Flacidez leve e aspecto de celulite' },
  { id: 'modeladora', cat: 'corporal', nome: 'Massagem modeladora', dur: 60, preco: 150, pros: ['helena'],
    desc: 'Movimentos firmes que ativam a circulação e ajudam no contorno, como complemento de alimentação e exercícios.',
    indicado: 'Contorno corporal e sensação de pernas pesadas' },
  { id: 'pedras', cat: 'corporal', nome: 'Massagem com pedras quentes', dur: 60, preco: 170, pros: ['helena'],
    desc: 'Pedras vulcânicas aquecidas e óleos vegetais para soltar a musculatura e desacelerar a mente.',
    indicado: 'Tensão muscular, estresse e cansaço acumulado' },
  // Depilação a laser
  { id: 'laser-buco', cat: 'laser', nome: 'Buço ou axilas', dur: 15, preco: 90, pros: ['bianca'],
    desc: 'Laser de diodo com ponteira resfriada. Sessões rápidas, ideais para começar.',
    indicado: 'Pelos escuros e grossos; fototipos definidos na avaliação' },
  { id: 'laser-virilha', cat: 'laser', nome: 'Virilha completa', dur: 25, preco: 160, pros: ['bianca'],
    desc: 'Protocolo completo com intensidade ajustada para uma região mais sensível.',
    indicado: 'Foliculite, pelos encravados e praticidade no dia a dia' },
  { id: 'laser-pernas', cat: 'laser', nome: 'Pernas completas', dur: 50, preco: 320, pros: ['bianca'],
    desc: 'Coxas e pernas em uma única sessão, com mapeamento da área para cobertura uniforme.',
    indicado: 'Quem quer se despedir da lâmina e da cera' },
  { id: 'laser-barba', cat: 'laser', nome: 'Barba (contorno) ou costas', dur: 30, preco: 190, pros: ['bianca'],
    desc: 'Para desenhar a barba ou reduzir pelos nas costas, com parâmetros ajustados à pele masculina.',
    indicado: 'Pelos encravados na barba e contorno definido' },
  // Sobrancelhas & cílios
  { id: 'design', cat: 'olhar', nome: 'Design de sobrancelhas', dur: 40, preco: 70, pros: ['helena'],
    desc: 'Mapeamento facial para um desenho que harmoniza com seus traços. Henna opcional (+ R$ 25).',
    indicado: 'Sobrancelhas sem forma definida ou com falhas' },
  { id: 'brow', cat: 'olhar', nome: 'Brow lamination', dur: 60, preco: 160, pros: ['helena'],
    desc: 'Alinha e fixa os fios na direção desejada, com efeito de sobrancelha mais preenchida por algumas semanas.',
    indicado: 'Fios rebeldes, desalinhados ou com falhas leves' },
  { id: 'lash', cat: 'olhar', nome: 'Lash lifting', dur: 60, preco: 150, pros: ['helena'],
    desc: 'Curvatura dos seus próprios cílios, sem extensão, com nutrição dos fios ao final.',
    indicado: 'Cílios retos que não seguram a curvatura' },
  { id: 'extensao', cat: 'olhar', nome: 'Extensão de cílios fio a fio', dur: 120, preco: 220, pros: ['helena'],
    desc: 'Aplicação individual de fios sintéticos leves para um olhar marcado e natural.',
    indicado: 'Quem quer acordar pronta e com mais volume' },
];

const AVALIACAO_GERAL = { id: 'avaliacao', cat: null, nome: 'Avaliação geral (ainda não sei qual tratamento)', pros: ['helena', 'bianca'] };

const PACOTES = [
  { id: 'pele', nome: 'Pele em dia', resumo: '6 limpezas de pele profundas, uma por mês', base: 180 * 6, off: 15,
    itens: ['Plano de cuidados para fazer em casa', 'Mesma profissional em todas as sessões', 'Remarcação flexível'] },
  { id: 'laser', nome: 'Laser 10 sessões', resumo: '10 sessões de depilação a laser na área que você escolher', off: 25, destaque: 'Mais procurado',
    area: true, itens: ['Teste de pele antes da 1ª sessão', 'Parâmetros revisados a cada sessão', 'Intervalos planejados com você'] },
  { id: 'corpo', nome: 'Corpo leve', resumo: '10 sessões de drenagem linfática', base: 140 * 10, off: 20,
    itens: ['Ideal 1 a 2 vezes por semana', 'Orientações de hábitos e hidratação', 'Válido para pós-operatório com liberação médica'] },
  { id: 'olhar', nome: 'Olhar pronto', resumo: '4 designs de sobrancelha com henna + 1 lash lifting', base: 4 * 95 + 150, off: 15,
    itens: ['Um design a cada 3 a 4 semanas', 'Lash lifting quando você preferir', 'Mapeamento facial na primeira visita'] },
];

/* ---------- Utilidades ---------- */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

const fmtBRL = (v) => v.toLocaleString('pt-BR', {
  style: 'currency', currency: 'BRL',
  minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits: 2,
});

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const trat = (id) => (id === 'avaliacao' ? AVALIACAO_GERAL : TRATAMENTOS.find((t) => t.id === id));
const nomeCompleto = (t) => (t.cat === 'laser' ? 'Depilação a laser · ' + t.nome : t.nome);
const nomeCat = (id) => (CATEGORIAS.find((c) => c.id === id) || {}).nome || '';

function linkWhatsApp(msg) {
  const base = WHATSAPP_NEGOCIO ? `https://wa.me/${WHATSAPP_NEGOCIO}?text=` : 'https://wa.me/?text=';
  return base + encodeURIComponent(msg);
}

function abrirWhatsApp(msg) {
  const a = document.createElement('a');
  a.href = linkWhatsApp(msg);
  a.target = '_blank';
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  toast('Abrindo o WhatsApp com a sua mensagem…');
}

let toastTimer;
function toast(txt) {
  const el = $('#toast');
  el.textContent = txt;
  el.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('on'), 3200);
}

const reduzMovimento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function irPara(sel, focoEl) {
  const alvo = $(sel);
  if (!alvo) return;
  alvo.scrollIntoView({ behavior: reduzMovimento() ? 'auto' : 'smooth', block: 'start' });
  if (focoEl) setTimeout(() => focoEl.focus({ preventScroll: true }), reduzMovimento() ? 0 : 450);
}

function hash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return h;
}

/* ---------- Menu ---------- */

function iniciarMenu() {
  const topo = $('#topo');
  const btn = $('.menu-btn');
  const fechar = () => { topo.classList.remove('menu-aberto'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', 'Abrir menu'); };
  btn.addEventListener('click', () => {
    const aberto = topo.classList.toggle('menu-aberto');
    btn.setAttribute('aria-expanded', String(aberto));
    btn.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  });
  $$('#menu a').forEach((a) => a.addEventListener('click', fechar));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fechar(); });
  const onScroll = () => topo.classList.toggle('rolou', window.scrollY > 12);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Tratamentos ---------- */

function iniciarTratamentos() {
  const abas = $('#abas');
  const painel = $('#painel-trat');

  abas.innerHTML = CATEGORIAS.map((c, i) => `
    <button type="button" role="tab" id="aba-${c.id}" aria-controls="painel-trat" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-cat="${c.id}">
      ${esc(c.nome)}
    </button>`).join('');

  function mostrar(cat) {
    $$('[role="tab"]', abas).forEach((b) => {
      const sel = b.dataset.cat === cat;
      b.setAttribute('aria-selected', String(sel));
      b.tabIndex = sel ? 0 : -1;
    });
    painel.setAttribute('aria-labelledby', 'aba-' + cat);
    painel.innerHTML = TRATAMENTOS.filter((t) => t.cat === cat).map((t) => `
      <article class="trat">
        <div class="trat__topo">
          <h3>${esc(t.nome)}</h3>
          <p class="trat__preco"><small>a partir de</small>${fmtBRL(t.preco)}</p>
        </div>
        <p class="trat__desc">${esc(t.desc)}</p>
        <dl class="trat__meta">
          <div><dt><svg aria-hidden="true"><use href="#i-clock"/></svg> Duração</dt><dd>${t.dur} min</dd></div>
          <div><dt><svg aria-hidden="true"><use href="#i-leaf"/></svg> Indicado para</dt><dd>${esc(t.indicado)}</dd></div>
        </dl>
        <button type="button" class="trat__btn" data-agendar="${t.id}">Agendar avaliação <svg aria-hidden="true"><use href="#i-arrow"/></svg></button>
      </article>`).join('');
  }

  abas.addEventListener('click', (e) => {
    const b = e.target.closest('[role="tab"]');
    if (b) mostrar(b.dataset.cat);
  });
  abas.addEventListener('keydown', (e) => {
    const tabs = $$('[role="tab"]', abas);
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let n = null;
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
    if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') n = 0;
    if (e.key === 'End') n = tabs.length - 1;
    if (n === null) return;
    e.preventDefault();
    mostrar(tabs[n].dataset.cat);
    tabs[n].focus();
    tabs[n].scrollIntoView({ block: 'nearest', inline: 'nearest' });
  });
  painel.addEventListener('click', (e) => {
    const b = e.target.closest('[data-agendar]');
    if (b) Agenda.selecionarTratamento(b.dataset.agendar, true);
  });

  mostrar(CATEGORIAS[0].id);
}

/* ---------- Quiz ---------- */

const PERGUNTAS = [
  { id: 'area', titulo: 'O que você quer cuidar primeiro?',
    opcoes: [
      { v: 'facial', t: 'Rosto', s: 'Oleosidade, manchas, textura, viço' },
      { v: 'corporal', t: 'Corpo', s: 'Inchaço, firmeza, contorno, relaxamento' },
      { v: 'laser', t: 'Pelos', s: 'Depilação a laser' },
      { v: 'olhar', t: 'Olhar', s: 'Sobrancelhas e cílios' },
    ] },
  { id: 'objetivo', titulo: 'E qual é o seu principal objetivo?',
    porArea: {
      facial: [
        { v: 'oleosidade', t: 'Cravos, poros e oleosidade', pts: { limpeza: 3, peeling: 1 } },
        { v: 'manchas', t: 'Manchas e textura irregular', pts: { peeling: 3, microag: 1, limpeza: 0.5 } },
        { v: 'marcas', t: 'Marcas de acne e linhas finas', pts: { microag: 3, peeling: 1.2 } },
        { v: 'vico', t: 'Pele opaca, ressecada ou repuxando', pts: { hidra: 3, limpeza: 1 } },
      ],
      corporal: [
        { v: 'inchaco', t: 'Inchaço e retenção de líquidos', pts: { drenagem: 3, modeladora: 1 } },
        { v: 'firmeza', t: 'Firmeza e aspecto de celulite', pts: { radio: 3, modeladora: 1.2 } },
        { v: 'contorno', t: 'Contorno e pernas mais leves', pts: { modeladora: 3, drenagem: 1.5 } },
        { v: 'relaxar', t: 'Relaxar e aliviar tensões', pts: { pedras: 3, drenagem: 1 } },
      ],
      laser: [
        { v: 'buco', t: 'Buço ou axilas', pts: { 'laser-buco': 3, 'laser-virilha': 1 } },
        { v: 'virilha', t: 'Virilha', pts: { 'laser-virilha': 3, 'laser-buco': 1 } },
        { v: 'pernas', t: 'Pernas', pts: { 'laser-pernas': 3, 'laser-virilha': 1.2 } },
        { v: 'barba', t: 'Barba ou costas', pts: { 'laser-barba': 3 } },
      ],
      olhar: [
        { v: 'forma', t: 'Sobrancelhas com mais forma', pts: { design: 3, brow: 1 } },
        { v: 'fios', t: 'Fios alinhados e efeito preenchido', pts: { brow: 3, design: 1.5 } },
        { v: 'curvatura', t: 'Cílios curvados, sem extensão', pts: { lash: 3, brow: 1 } },
        { v: 'volume', t: 'Cílios com mais volume', pts: { extensao: 3, lash: 1 } },
      ],
    } },
  { id: 'pele', titulo: 'Como a sua pele costuma reagir?',
    opcoes: [
      { v: 'sensivel', t: 'Fica vermelha ou irrita com facilidade', adj: { hidra: 2, peeling: -1.5, microag: -1, limpeza: -0.5 },
        nota: 'Como sua pele é reativa, a avaliação inclui teste de sensibilidade e a escolha de ativos mais suaves.' },
      { v: 'manchas', t: 'Mancha com facilidade', adj: { peeling: 1, hidra: 0.5 },
        nota: 'Por ter tendência a manchas, reforçamos a fotoproteção e ajustamos os parâmetros com cautela.' },
      { v: 'tranquila', t: 'Tranquila, raramente reage', adj: {} },
      { v: 'naosei', t: 'Não sei dizer', adj: {}, nota: 'Sem problema: a análise da pele faz parte da avaliação.' },
    ] },
  { id: 'tempo', titulo: 'Quanto tempo você consegue reservar por sessão?',
    opcoes: [
      { v: '30', t: 'Até 30 minutos', s: 'Encaixo entre compromissos', max: 30 },
      { v: '60', t: 'Até 1 hora', s: 'Um horário tranquilo', max: 60 },
      { v: 'livre', t: 'Mais de 1 hora', s: 'Quero um momento sem pressa', max: 999 },
    ] },
  { id: 'periodo', titulo: 'Qual o melhor período para você vir?',
    opcoes: [
      { v: 'manha', t: 'Manhã', s: '9h às 12h' },
      { v: 'tarde', t: 'Tarde', s: '13h às 17h' },
      { v: 'fim', t: 'Fim de tarde', s: '17h às 19h' },
      { v: 'sabado', t: 'Sábado de manhã', s: '8h às 12h' },
    ] },
];

const Quiz = (() => {
  let passo = 0;
  let resp = {};
  const corpo = () => $('#quizCorpo');

  function opcoesDe(p) {
    return p.porArea ? p.porArea[resp.area] : p.opcoes;
  }

  function render(focar) {
    $('#quizProg').style.width = ((passo) / PERGUNTAS.length) * 100 + '%';
    const p = PERGUNTAS[passo];
    const ops = opcoesDe(p);
    corpo().innerHTML = `
      <p class="quiz__passo">Pergunta ${passo + 1} de ${PERGUNTAS.length}</p>
      <h3 class="quiz__titulo" tabindex="-1">${esc(p.titulo)}</h3>
      <div class="quiz__ops" role="group" aria-label="${esc(p.titulo)}">
        ${ops.map((o) => `
          <button type="button" class="quiz__op${resp[p.id] === o.v ? ' sel' : ''}" data-v="${o.v}" aria-pressed="${resp[p.id] === o.v}">
            <span class="quiz__op-t">${esc(o.t)}</span>${o.s ? `<span class="quiz__op-s">${esc(o.s)}</span>` : ''}
          </button>`).join('')}
      </div>
      <div class="quiz__nav">
        ${passo > 0 ? '<button type="button" class="link-btn" data-acao="voltar">← Voltar</button>' : '<span></span>'}
      </div>`;
    if (focar) $('.quiz__titulo', corpo()).focus({ preventScroll: true });
  }

  function escolher(v) {
    const p = PERGUNTAS[passo];
    if (p.id === 'area' && resp.area !== v) delete resp.objetivo;
    resp[p.id] = v;
    $$('.quiz__op', corpo()).forEach((b) => {
      const s = b.dataset.v === v;
      b.classList.toggle('sel', s);
      b.setAttribute('aria-pressed', String(s));
    });
    setTimeout(() => {
      passo++;
      if (passo >= PERGUNTAS.length) resultado();
      else render(true);
    }, reduzMovimento() ? 0 : 220);
  }

  function calcular() {
    const area = resp.area;
    const obj = PERGUNTAS[1].porArea[area].find((o) => o.v === resp.objetivo);
    const pele = PERGUNTAS[2].opcoes.find((o) => o.v === resp.pele);
    const tempo = PERGUNTAS[3].opcoes.find((o) => o.v === resp.tempo);
    const pontos = {};
    TRATAMENTOS.filter((t) => t.cat === area).forEach((t) => {
      let s = (obj.pts[t.id] || 0);
      if (s > 0) s += (pele.adj[t.id] || 0);
      if (t.dur > tempo.max) s -= 1;
      pontos[t.id] = s;
    });
    const ord = Object.keys(pontos).sort((a, b) => pontos[b] - pontos[a]);
    const recs = [trat(ord[0])];
    if (ord[1] && pontos[ord[1]] >= 1) recs.push(trat(ord[1]));
    const notas = [];
    if (pele.nota) notas.push(pele.nota);
    if (recs[0].dur > tempo.max) notas.push(`Esse tratamento leva cerca de ${recs[0].dur} minutos. Na avaliação, vemos com você a melhor forma de encaixá-lo na sua rotina.`);
    if (area === 'laser') notas.push('Depilação a laser costuma pedir de 8 a 10 sessões: vale conhecer o pacote de 10 sessões com 25% de desconto.');
    if (area === 'corporal' && recs[0].id === 'drenagem') notas.push('Drenagem rende mais em sequência: o pacote Corpo leve tem 20% de desconto.');
    return { recs, notas, obj, pele, tempo };
  }

  function rotulo(pid, v) {
    const p = PERGUNTAS.find((x) => x.id === pid);
    const ops = p.porArea ? p.porArea[resp.area] : p.opcoes;
    const o = ops.find((x) => x.v === v);
    return o ? o.t + (o.s && pid === 'periodo' ? ` (${o.s})` : '') : '';
  }

  function mensagem(recs) {
    const sug = recs.map(nomeCompleto).join(' + ');
    return [
      `Olá, ${NOME_CLINICA}! Fiz o quiz no site e gostaria de agendar uma avaliação.`,
      '',
      `*Sugestão do quiz:* ${sug}`,
      `*Área de interesse:* ${rotulo('area', resp.area)}`,
      `*Objetivo:* ${rotulo('objetivo', resp.objetivo)}`,
      `*Minha pele:* ${rotulo('pele', resp.pele)}`,
      `*Tempo por sessão:* ${rotulo('tempo', resp.tempo)}`,
      `*Melhor período:* ${rotulo('periodo', resp.periodo)}`,
      '',
      'Podem me passar os horários disponíveis?',
    ].join('\n');
  }

  function resultado() {
    $('#quizProg').style.width = '100%';
    const { recs, notas } = calcular();
    corpo().innerHTML = `
      <p class="quiz__passo">Sua sugestão</p>
      <h3 class="quiz__titulo" tabindex="-1">${recs.length > 1 ? 'Dois caminhos que combinam com você' : 'Um bom ponto de partida para você'}</h3>
      <div class="quiz__recs">
        ${recs.map((t, i) => `
          <article class="rec">
            <span class="rec__tag">${i === 0 ? 'Mais indicado' : 'Para combinar'}</span>
            <h4>${esc(nomeCompleto(t))}</h4>
            <p>${esc(t.desc)}</p>
            <p class="rec__meta"><span><svg aria-hidden="true"><use href="#i-clock"/></svg> ${t.dur} min</span><span>a partir de <strong>${fmtBRL(t.preco)}</strong></span></p>
          </article>`).join('')}
      </div>
      ${notas.length ? `<ul class="quiz__notas">${notas.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}
      <p class="quiz__aviso">Sugestão inicial e informativa. A indicação final depende da avaliação presencial, e os resultados variam de pessoa para pessoa.</p>
      <div class="quiz__acoes">
        <button type="button" class="btn btn--rosa" data-acao="zap"><svg aria-hidden="true"><use href="#i-whats"/></svg> Agendar avaliação</button>
        <button type="button" class="btn btn--linha" data-acao="agenda">Escolher dia e horário</button>
        <button type="button" class="link-btn link-btn--claro" data-acao="refazer">Refazer o quiz</button>
      </div>`;
    corpo().dataset.recs = recs.map((t) => t.id).join(',');
    $('.quiz__titulo', corpo()).focus({ preventScroll: true });
  }

  function iniciar() {
    corpo().addEventListener('click', (e) => {
      const op = e.target.closest('.quiz__op');
      if (op) return escolher(op.dataset.v);
      const b = e.target.closest('[data-acao]');
      if (!b) return;
      const acao = b.dataset.acao;
      if (acao === 'voltar' && passo > 0) { passo--; render(true); }
      if (acao === 'refazer') { passo = 0; resp = {}; render(true); }
      if (acao === 'zap') abrirWhatsApp(mensagem(corpo().dataset.recs.split(',').map(trat)));
      if (acao === 'agenda') {
        const ids = corpo().dataset.recs.split(',');
        const periodo = resp.periodo;
        Agenda.selecionarTratamento(ids[0], true, ids[1] ? 'Sugestão do quiz para combinar: ' + nomeCompleto(trat(ids[1])) + '.' : '', periodo);
      }
    });
    render(false);
  }

  return { iniciar };
})();

/* ---------- Agendamento ---------- */

const HORARIOS = {
  semana: [
    { per: 'Manhã', id: 'manha', horas: ['09:00', '10:00', '11:00'] },
    { per: 'Tarde', id: 'tarde', horas: ['13:00', '14:00', '15:00', '16:00'] },
    { per: 'Fim de tarde', id: 'fim', horas: ['17:00', '18:00'] },
  ],
  sabado: [
    { per: 'Sábado de manhã', id: 'sabado', horas: ['08:00', '09:00', '10:00', '11:00'] },
  ],
};

const Agenda = (() => {
  const st = { trat: '', pro: 'sem', dia: null, hora: '', periodoPref: '' };
  let dias = [];

  function gerarDias() {
    const lista = [];
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    let uteis = 0;
    while (uteis < 10) {
      d.setDate(d.getDate() + 1);
      const w = d.getDay();
      if (w === 0) continue;
      const sab = w === 6;
      lista.push({ key: d.toISOString().slice(0, 10), date: new Date(d), sab });
      if (!sab) uteis++;
    }
    return lista;
  }

  const fmtDiaLongo = (d) => {
    const s = d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  function prosPermitidos() {
    const t = trat(st.trat);
    return t ? t.pros : ['helena', 'bianca'];
  }

  function livre(diaKey, hora, pro) {
    const lista = pro === 'sem' ? prosPermitidos() : [pro];
    return lista.some((p) => hash(diaKey + hora + p) % 100 >= 38);
  }

  function renderSelect() {
    const sel = $('#agTrat');
    sel.innerHTML = '<option value="">Selecione um tratamento…</option>' +
      `<optgroup label="Ainda não sei"><option value="avaliacao">${esc(AVALIACAO_GERAL.nome)}</option></optgroup>` +
      CATEGORIAS.map((c) => `<optgroup label="${esc(c.nome)}">${
        TRATAMENTOS.filter((t) => t.cat === c.id).map((t) => `<option value="${t.id}">${esc(t.nome)} · a partir de ${fmtBRL(t.preco)}</option>`).join('')
      }</optgroup>`).join('');
  }

  function renderPros() {
    const box = $('#agPros');
    const perm = prosPermitidos();
    box.innerHTML = ['helena', 'bianca', 'sem'].map((id) => {
      const p = PROS[id];
      const ok = id === 'sem' || perm.includes(id);
      return `
        <label class="pro${ok ? '' : ' pro--off'}">
          <input type="radio" name="agPro" value="${id}" ${st.pro === id ? 'checked' : ''} ${ok ? '' : 'disabled'}>
          <span class="pro__av${id === 'sem' ? ' pro__av--sem' : ''}" aria-hidden="true">${id === 'sem' ? '<svg><use href="#i-spark"/></svg>' : p.ini}</span>
          <span class="pro__txt"><strong>${esc(p.nome)}</strong><small>${ok ? esc(p.cargo) : 'Não realiza este tratamento'}</small></span>
        </label>`;
    }).join('');
  }

  function renderDias() {
    $('#agDias').innerHTML = dias.map((d) => {
      const sem = d.date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
      const mes = d.date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
      const sel = st.dia === d.key;
      return `<button type="button" role="radio" class="dia${sel ? ' sel' : ''}${d.sab ? ' dia--sab' : ''}" aria-checked="${sel}" tabindex="${sel || (!st.dia && d === dias[0]) ? 0 : -1}" data-dia="${d.key}" aria-label="${esc(fmtDiaLongo(d.date))}${d.sab ? ', somente manhã' : ''}">
        <span class="dia__sem">${sem}</span><span class="dia__n">${d.date.getDate()}</span><span class="dia__mes">${d.sab ? 'manhã' : mes}</span>
      </button>`;
    }).join('');
  }

  function renderHoras() {
    const box = $('#agHoras');
    const d = dias.find((x) => x.key === st.dia);
    if (!d) { box.innerHTML = '<p class="dica">Escolha um dia para ver os horários livres.</p>'; return; }
    if (st.hora && !livre(st.dia, st.hora, st.pro)) st.hora = '';
    const grupos = d.sab ? HORARIOS.sabado : HORARIOS.semana;
    let total = 0;
    const html = grupos.map((g) => {
      const preferido = st.periodoPref && st.periodoPref === g.id;
      return `
      <div class="horas__grupo">
        <p class="horas__per">${g.per}${preferido ? ' <span class="pill">sua preferência</span>' : ''}</p>
        <div class="horas__lista">
          ${g.horas.map((h) => {
            const ok = livre(st.dia, h, st.pro);
            if (ok) total++;
            const sel = st.hora === h;
            return `<button type="button" class="hora${sel ? ' sel' : ''}" data-hora="${h}" ${ok ? '' : 'disabled'} aria-pressed="${sel}" aria-label="${h}${ok ? '' : ', ocupado'}">${h}</button>`;
          }).join('')}
        </div>
      </div>`;
    }).join('');
    box.innerHTML = html + (total ? '' : '<p class="dica">Sem horários livres neste dia para esta profissional. Tente outro dia ou “Sem preferência”.</p>');
  }

  function atualizarResumo() {
    const t = trat(st.trat);
    const d = dias.find((x) => x.key === st.dia);
    const nome = $('#agNome').value.trim();
    const set = (k, v) => { const el = $(`[data-r="${k}"]`); el.textContent = v || '—'; el.classList.toggle('ok', !!v); };
    set('trat', t ? nomeCompleto(t) : '');
    set('pro', PROS[st.pro].nome);
    set('dia', d ? fmtDiaLongo(d.date) : '');
    set('hora', st.hora);
    set('nome', nome);
  }

  function aoMudarTratamento() {
    const perm = prosPermitidos();
    const dica = $('#agProsDica');
    if (st.pro !== 'sem' && !perm.includes(st.pro)) {
      st.pro = 'sem';
    }
    if (st.trat && perm.length === 1) {
      dica.hidden = false;
      dica.textContent = `Este tratamento é realizado por ${PROS[perm[0]].nome}.`;
    } else dica.hidden = true;
    renderPros();
    renderHoras();
    atualizarResumo();
  }

  function selecionarTratamento(id, rolar, obs, periodo) {
    st.trat = id;
    $('#agTrat').value = id;
    if (obs) {
      const ta = $('#agObs');
      if (!ta.value.includes(obs)) ta.value = (ta.value ? ta.value + ' ' : '') + obs;
    }
    if (periodo) st.periodoPref = periodo;
    aoMudarTratamento();
    if (rolar) irPara('#agendar', $('#agTrat'));
  }

  function mensagem() {
    const t = trat(st.trat);
    const d = dias.find((x) => x.key === st.dia);
    const obs = $('#agObs').value.trim();
    const linhas = [
      `Olá, ${NOME_CLINICA}! Gostaria de agendar uma avaliação.`,
      '',
      `*Nome:* ${$('#agNome').value.trim()}`,
      `*Tratamento:* ${nomeCompleto(t)}`,
      `*Profissional:* ${PROS[st.pro].nome}`,
      `*Data:* ${fmtDiaLongo(d.date)}`,
      `*Horário:* ${st.hora}`,
      `*Primeira vez na clínica:* ${$('#agPrimeira').checked ? 'Sim' : 'Não'}`,
    ];
    if (obs) linhas.push(`*Observações:* ${obs}`);
    linhas.push('', 'Aguardo a confirmação. Até breve!');
    return linhas.join('\n');
  }

  function enviar(e) {
    e.preventDefault();
    const erro = $('#agErro');
    const falta = [];
    let foco = null;
    if (!st.trat) { falta.push('o tratamento'); foco = foco || $('#agTrat'); }
    if (!st.dia) { falta.push('o dia'); foco = foco || $('#agDias .dia'); }
    if (!st.hora) { falta.push('o horário'); foco = foco || $('#agHoras .hora:not([disabled])') || $('#agDias .dia'); }
    const nome = $('#agNome').value.trim();
    if (nome.length < 2) { falta.push('seu nome'); foco = foco || $('#agNome'); }
    $('#agNome').setAttribute('aria-invalid', String(nome.length < 2));
    if (falta.length) {
      const txt = falta.length > 1 ? falta.slice(0, -1).join(', ') + ' e ' + falta[falta.length - 1] : falta[0];
      erro.textContent = `Falta escolher ${txt}.`;
      if (foco) foco.focus();
      return;
    }
    erro.textContent = '';
    abrirWhatsApp(mensagem());
  }

  function iniciar() {
    dias = gerarDias();
    renderSelect();
    renderPros();
    renderDias();
    renderHoras();
    atualizarResumo();

    $('#agTrat').addEventListener('change', (e) => { st.trat = e.target.value; aoMudarTratamento(); });
    $('#agPros').addEventListener('change', (e) => {
      if (e.target.name === 'agPro') { st.pro = e.target.value; renderHoras(); atualizarResumo(); }
    });
    const boxDias = $('#agDias');
    boxDias.addEventListener('click', (e) => {
      const b = e.target.closest('.dia');
      if (!b) return;
      st.dia = b.dataset.dia;
      renderDias();
      renderHoras();
      atualizarResumo();
      $(`.dia[data-dia="${st.dia}"]`).focus();
    });
    boxDias.addEventListener('keydown', (e) => {
      const bs = $$('.dia', boxDias);
      const i = bs.indexOf(document.activeElement);
      if (i < 0) return;
      let n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = Math.min(i + 1, bs.length - 1);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = Math.max(i - 1, 0);
      if (n === null) return;
      e.preventDefault();
      bs[n].click();
    });
    $('#agHoras').addEventListener('click', (e) => {
      const b = e.target.closest('.hora');
      if (!b || b.disabled) return;
      st.hora = b.dataset.hora;
      renderHoras();
      atualizarResumo();
      const nb = $(`.hora[data-hora="${st.hora}"]`);
      if (nb) nb.focus();
    });
    $('#agNome').addEventListener('input', atualizarResumo);
    $('#formAgenda').addEventListener('submit', enviar);
  }

  return { iniciar, selecionarTratamento };
})();

/* ---------- Pacotes ---------- */

function iniciarPacotes() {
  const box = $('#listaPacotes');
  const lasers = TRATAMENTOS.filter((t) => t.cat === 'laser');

  const precoPacote = (p, areaId) => {
    const base = p.area ? trat(areaId).preco * 10 : p.base;
    const final = Math.round(base * (1 - p.off / 100));
    return { base, final, parcela: Math.round((final / 6) * 100) / 100 };
  };

  box.innerHTML = PACOTES.map((p) => {
    const pr = precoPacote(p, lasers[0].id);
    return `
      <article class="pac${p.destaque ? ' pac--dest' : ''}" data-pac="${p.id}">
        ${p.destaque ? `<span class="pac__dest">${esc(p.destaque)}</span>` : ''}
        <p class="pac__off">${p.off}% off</p>
        <h3>${esc(p.nome)}</h3>
        <p class="pac__res">${esc(p.resumo)}</p>
        ${p.area ? `
          <label class="rotulo rotulo--peq" for="pacArea">Área</label>
          <div class="select select--peq"><select id="pacArea">${lasers.map((t) => `<option value="${t.id}">${esc(t.nome)}</option>`).join('')}</select></div>` : ''}
        <p class="pac__preco"><s data-p="base">${fmtBRL(pr.base)}</s> <strong data-p="final">${fmtBRL(pr.final)}</strong></p>
        <p class="pac__parc">ou 6x de <span data-p="parc">${fmtBRL(pr.parcela)}</span> sem juros</p>
        <ul class="pac__itens">${p.itens.map((i) => `<li><svg aria-hidden="true"><use href="#i-check"/></svg>${esc(i)}</li>`).join('')}</ul>
        <button type="button" class="btn ${p.destaque ? 'btn--rosa' : 'btn--verde'} btn--bloco" data-quero="${p.id}">Quero este pacote</button>
      </article>`;
  }).join('') + '<p class="nota pacotes__nota">Pacotes iniciam após a avaliação, que confirma a indicação. Resultados variam de pessoa para pessoa.</p>';

  const areaSel = $('#pacArea');
  if (areaSel) {
    areaSel.addEventListener('change', () => {
      const p = PACOTES.find((x) => x.area);
      const pr = precoPacote(p, areaSel.value);
      const card = areaSel.closest('.pac');
      $('[data-p="base"]', card).textContent = fmtBRL(pr.base);
      $('[data-p="final"]', card).textContent = fmtBRL(pr.final);
      $('[data-p="parc"]', card).textContent = fmtBRL(pr.parcela);
    });
  }

  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-quero]');
    if (!b) return;
    const p = PACOTES.find((x) => x.id === b.dataset.quero);
    const areaId = p.area ? $('#pacArea').value : null;
    const pr = precoPacote(p, areaId);
    const linhas = [
      `Olá, ${NOME_CLINICA}! Tenho interesse no pacote *${p.nome}*.`,
      '',
      `*Inclui:* ${p.resumo}`,
    ];
    if (areaId) linhas.push(`*Área:* ${trat(areaId).nome}`);
    linhas.push(
      `*Valor:* ${fmtBRL(pr.final)} (${p.off}% off) ou 6x de ${fmtBRL(pr.parcela)}`,
      '',
      'Gostaria de agendar a avaliação para começar. Quais horários vocês têm?'
    );
    abrirWhatsApp(linhas.join('\n'));
  });
}

/* ---------- Vale-presente ---------- */

function iniciarVale() {
  const form = $('#formVale');
  const de = $('#vlDe');
  const para = $('#vlPara');
  const msg = $('#vlMsg');
  const outroBox = $('#vlOutroBox');
  const outro = $('#vlOutro');
  const MSG_PADRAO = 'Um momento de cuidado, do jeito que você merece.';

  const valorAtual = () => {
    const v = form.querySelector('input[name="vlValor"]:checked').value;
    if (v === 'outro') {
      const n = Math.round(Number(outro.value));
      return Number.isFinite(n) && n > 0 ? n : 0;
    }
    return Number(v);
  };

  function preview() {
    const ehOutro = form.querySelector('input[name="vlValor"]:checked').value === 'outro';
    outroBox.hidden = !ehOutro;
    const v = valorAtual();
    $('#pvPara').textContent = para.value.trim() || 'alguém especial';
    $('#pvDe').textContent = de.value.trim() || '—';
    $('#pvMsg').textContent = msg.value.trim() || MSG_PADRAO;
    $('#pvValor').textContent = v ? fmtBRL(v) : 'R$ —';
  }

  form.addEventListener('input', preview);
  form.addEventListener('change', (e) => {
    preview();
    if (e.target.name === 'vlValor' && e.target.value === 'outro') outro.focus();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const erro = $('#vlErro');
    const v = valorAtual();
    const falta = [];
    let foco = null;
    if (de.value.trim().length < 2) { falta.push('seu nome'); foco = foco || de; }
    if (para.value.trim().length < 2) { falta.push('o nome de quem vai receber'); foco = foco || para; }
    if (v < 100) { falta.push('um valor a partir de R$ 100'); foco = foco || outro; }
    de.setAttribute('aria-invalid', String(de.value.trim().length < 2));
    para.setAttribute('aria-invalid', String(para.value.trim().length < 2));
    if (falta.length) {
      erro.textContent = 'Informe ' + (falta.length > 1 ? falta.slice(0, -1).join(', ') + ' e ' + falta[falta.length - 1] : falta[0]) + '.';
      if (foco) foco.focus();
      return;
    }
    erro.textContent = '';
    const entrega = form.querySelector('input[name="vlEntrega"]:checked').value;
    const linhas = [
      `Olá, ${NOME_CLINICA}! Quero comprar um *vale-presente*.`,
      '',
      `*De:* ${de.value.trim()}`,
      `*Para:* ${para.value.trim()}`,
      `*Valor:* ${fmtBRL(v)}`,
    ];
    if (msg.value.trim()) linhas.push(`*Mensagem do cartão:* "${msg.value.trim()}"`);
    linhas.push(`*Entrega:* ${entrega}`, '', 'Como faço o pagamento?');
    abrirWhatsApp(linhas.join('\n'));
  });

  preview();
}

/* ---------- Horário de hoje, Instagram, botão flutuante ---------- */

function iniciarExtras() {
  const el = $('#statusHoje');
  const agora = new Date();
  const w = agora.getDay();
  const h = agora.getHours() + agora.getMinutes() / 60;
  const exp = { 1: [9, 19], 2: [9, 19], 3: [9, 19], 4: [9, 19], 5: [9, 19], 6: [8, 12] };
  const hoje = exp[w];
  let txt;
  if (hoje && h >= hoje[0] && h < hoje[1]) txt = `Aberto agora · até as ${hoje[1]}h`;
  else if (hoje && h < hoje[0]) txt = `Fechado agora · abre hoje às ${hoje[0]}h`;
  else {
    const amanha = (w + 1) % 7;
    txt = exp[amanha] ? `Fechado agora · abre amanhã às ${exp[amanha][0]}h` : 'Fechado agora · abre segunda às 9h';
  }
  el.innerHTML = `<span class="ponto${txt.startsWith('Aberto') ? ' ponto--on' : ''}" aria-hidden="true"></span>${esc(txt)}`;

  $('#btnInsta').addEventListener('click', () => toast('Perfil fictício. Na versão final, este botão leva ao Instagram da clínica.'));

  $('#zapFlutuante').href = linkWhatsApp(`Olá, ${NOME_CLINICA}! Vim pelo site e gostaria de mais informações sobre os tratamentos.`);
}

/* ---------- Revelar ao rolar ---------- */

function iniciarRevelar() {
  const alvos = $$('.cab, .pessoa, .difs li, .pac, .faq details, .quiz, .agenda, .vale');
  if (reduzMovimento() || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('anima');
  const io = new IntersectionObserver((ents) => {
    ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('visivel'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  alvos.forEach((a) => { a.classList.add('revela'); io.observe(a); });
}

/* ---------- Início ---------- */

document.addEventListener('DOMContentLoaded', () => {
  iniciarMenu();
  iniciarTratamentos();
  Quiz.iniciar();
  Agenda.iniciar();
  iniciarPacotes();
  iniciarVale();
  iniciarExtras();
  iniciarRevelar();
});
