'use strict';

/* =====================================================================
   NÚMERO DO WHATSAPP QUE RECEBE OS PEDIDOS
   Só números, com 55 + DDD. Ex.: '5527999998888'.
   Deixe vazio ('') para o WhatsApp perguntar para qual contato enviar
   (é assim na demonstração).
   ===================================================================== */
const WHATSAPP_NEGOCIO = '';

/* ---------------------------------------------------------------------
   Dados da loja (negócio fictício)
   --------------------------------------------------------------------- */
const LOJA = {
  nome: 'Brasa & Pão',
  endereco: 'Rua das Castanheiras, 418 — Praia da Costa',
  cidade: 'Vila Velha/ES',
  pedidoMinimo: 2500, // centavos (vale para entrega)
  tempoEntrega: '40–55 min',
  tempoRetirada: '20–25 min',
  // minutos desde 00:00 [abre, fecha]; null = fechado. Índice 0 = domingo.
  horarios: {
    0: [1080, 1410], 1: null, 2: [1080, 1410], 3: [1080, 1410],
    4: [1080, 1410], 5: [1080, 1410], 6: [1080, 1410],
  },
};

const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

const BAIRROS = [
  { id: 'praia-da-costa', nome: 'Praia da Costa', taxa: 400 },
  { id: 'itapua', nome: 'Itapuã', taxa: 500 },
  { id: 'centro', nome: 'Centro de Vila Velha', taxa: 500 },
  { id: 'gloria', nome: 'Glória', taxa: 600 },
  { id: 'divino', nome: 'Divino Espírito Santo', taxa: 600 },
  { id: 'praia-de-itaparica', nome: 'Praia de Itaparica', taxa: 700 },
  { id: 'coqueiral', nome: 'Coqueiral de Itaparica', taxa: 800 },
  { id: 'ibes', nome: 'Ibes', taxa: 800 },
  { id: 'jockey', nome: 'Jockey de Itaparica', taxa: 900 },
  { id: 'cobilandia', nome: 'Cobilândia', taxa: 1000 },
];

const PAGAMENTOS = {
  pix: 'Pix',
  cartao: 'Cartão (crédito ou débito)',
  dinheiro: 'Dinheiro',
};

/* ---------------------------------------------------------------------
   Cardápio
   --------------------------------------------------------------------- */
const foto = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=70`;
const op = (id, nome, preco = 0) => ({ id, nome, preco });

const CATEGORIAS = [
  { id: 'burgers', nome: 'Burgers', sub: 'Blend da casa moído todo dia, pão brioche assado aqui.' },
  { id: 'combos', nome: 'Combos', sub: 'Burger + batata + bebida, num preço camarada.' },
  { id: 'porcoes', nome: 'Porções', sub: 'Pra dividir (ou não).' },
  { id: 'bebidas', nome: 'Bebidas', sub: 'Geladas de verdade.' },
  { id: 'sobremesas', nome: 'Sobremesas', sub: 'Guarde um espacinho.' },
];

const G = {
  pao: (primeiro = 'brioche') => {
    const opcoes = [op('brioche', 'Brioche amanteigado'), op('australiano', 'Australiano'), op('sem-gluten', 'Sem glúten', 500)];
    opcoes.sort((a, b) => (a.id === primeiro ? -1 : b.id === primeiro ? 1 : 0));
    return { id: 'pao', titulo: 'Escolha o pão', curto: 'Pão', tipo: 'single', obrigatorio: true, padrao: primeiro, opcoes };
  },
  ponto: () => ({
    id: 'ponto', titulo: 'Ponto da carne', curto: 'Ponto', tipo: 'single', obrigatorio: true,
    opcoes: [op('mal', 'Mal passado'), op('ao-ponto', 'Ao ponto'), op('bem', 'Bem passado')],
  }),
  adicionais: (extra) => ({
    id: 'adicionais', titulo: 'Turbine seu lanche', curto: 'Adicionais', tipo: 'multi', obrigatorio: false, max: 5,
    opcoes: [
      op('bacon', 'Bacon crocante', 500),
      op('cheddar', 'Cheddar extra', 400),
      op('ovo', 'Ovo na chapa', 300),
      op('cebola-caramelizada', 'Cebola caramelizada', 350),
      op('jalapeno', 'Jalapeño', 300),
      extra,
    ],
  }),
  adicionaisVeg: () => ({
    id: 'adicionais', titulo: 'Turbine seu lanche', curto: 'Adicionais', tipo: 'multi', obrigatorio: false, max: 4,
    opcoes: [
      op('abacate', 'Abacate em fatias', 400),
      op('cogumelos', 'Cogumelos salteados', 400),
      op('coalho', 'Queijo coalho grelhado', 500),
      op('cebola-caramelizada', 'Cebola caramelizada', 350),
    ],
  }),
  batataCombo: (grande = false) => ({
    id: 'batata', titulo: grande ? 'Batata grande' : 'Batata', curto: 'Batata', tipo: 'single', obrigatorio: true, padrao: 'rustica',
    opcoes: [
      op('rustica', 'Batata rústica'),
      op('cheddar-bacon', 'Com cheddar e bacon', grande ? 1000 : 700),
      op('onion', 'Trocar por onion rings', grande ? 700 : 500),
    ],
  }),
  bebida: (id = 'bebida', titulo = 'Escolha a bebida', curto = 'Bebida') => ({
    id, titulo, curto, tipo: 'single', obrigatorio: true,
    opcoes: [
      op('cola', 'Refrigerante lata · Cola'),
      op('cola-zero', 'Refrigerante lata · Cola Zero'),
      op('guarana', 'Refrigerante lata · Guaraná'),
      op('agua', 'Água mineral'),
      op('cha', 'Chá gelado da casa', 300),
      op('limonada', 'Limonada suíça', 500),
    ],
  }),
  molhos: () => ({
    id: 'molhos', titulo: 'Molhos extras', curto: 'Molhos extras', tipo: 'multi', obrigatorio: false, max: 3,
    opcoes: [
      op('maionese', 'Maionese da casa', 250),
      op('cheddar', 'Cheddar cremoso', 400),
      op('barbecue', 'Barbecue defumado', 250),
      op('chipotle', 'Maionese de chipotle', 300),
    ],
  }),
  tamanho: (dif) => ({
    id: 'tamanho', titulo: 'Tamanho', curto: 'Tamanho', tipo: 'single', obrigatorio: true, padrao: 'individual',
    opcoes: [op('individual', 'Individual, 300 g'), op('grande', 'Grande, 600 g · serve 2 a 3', dif)],
  }),
};

const ITENS = [
  // ---------------- Burgers
  {
    id: 'smash-classico', cat: 'burgers', nome: 'Smash Clássico', preco: 2690, selos: ['mais'],
    img: foto('1607013251379-e6eecfffe234'),
    desc: 'Dois smash de 80 g prensados na chapa até formar casquinha, cheddar inglês derretido, picles da casa, cebola picadinha e molho especial no brioche amanteigado.',
    grupos: [G.pao(), G.adicionais(op('smash-extra', 'Smash extra (80 g)', 700))],
    remover: ['Picles', 'Cebola', 'Molho especial'],
  },
  {
    id: 'brasa-bacon', cat: 'burgers', nome: 'Brasa Bacon', preco: 3490, selos: ['mais'],
    img: foto('1553979459-d2229ba7433b'),
    desc: 'Blend de costela e acém de 160 g grelhado na brasa, bacon artesanal crocante, queijo prato, cebola roxa e barbecue defumado da casa.',
    grupos: [G.pao(), G.ponto(), G.adicionais(op('carne-extra', 'Carne extra (160 g)', 900))],
    remover: ['Cebola roxa', 'Barbecue'],
  },
  {
    id: 'cheddar-melt', cat: 'burgers', nome: 'Cheddar Melt', preco: 3290, selos: ['novo'],
    img: foto('1565299507177-b0ac66763828'),
    desc: '160 g de blend da casa coberto com cheddar cremoso escorrendo, fatias de bacon e cebola caramelizada na cerveja preta.',
    grupos: [G.pao(), G.ponto(), G.adicionais(op('carne-extra', 'Carne extra (160 g)', 900))],
    remover: ['Bacon', 'Cebola caramelizada'],
  },
  {
    id: 'diablo', cat: 'burgers', nome: 'Diablo', preco: 3390, selos: ['picante'],
    img: foto('1596662951482-0c4ba74a6df6'),
    desc: 'Pão australiano, 160 g de blend, queijo pepper jack, jalapeños na chapa, rúcula e maionese de chipotle que arde no ponto certo.',
    grupos: [G.pao('australiano'), G.ponto(), G.adicionais(op('carne-extra', 'Carne extra (160 g)', 900))],
    remover: ['Jalapeño', 'Rúcula', 'Maionese de chipotle'],
  },
  {
    id: 'casa-salada', cat: 'burgers', nome: 'Casa Salada', preco: 2890,
    img: foto('1568901346375-23c9450c58cd'),
    desc: 'Hambúrguer de 150 g, queijo prato, alface americana, tomate, cebola roxa e maionese verde de ervas. O clássico que nunca erra.',
    grupos: [G.pao(), G.ponto(), G.adicionais(op('carne-extra', 'Carne extra (150 g)', 800))],
    remover: ['Alface', 'Tomate', 'Cebola roxa', 'Maionese verde'],
  },
  {
    id: 'frango-crocante', cat: 'burgers', nome: 'Frango Crocante', preco: 2990,
    img: foto('1606755962773-d324e0a13086'),
    desc: 'Sobrecoxa empanada no panko, crocante por fora e suculenta por dentro, coleslaw de repolho roxo, picles e maionese de páprica defumada.',
    grupos: [G.pao(), G.adicionais(op('frango-extra', 'Frango extra', 800))],
    remover: ['Coleslaw', 'Picles', 'Maionese de páprica'],
  },
  {
    id: 'veggie', cat: 'burgers', nome: 'Veggie da Horta', preco: 3090, selos: ['novo'],
    img: foto('1525059696034-4967a8e1dca2'),
    desc: 'Hambúrguer de grão-de-bico e cogumelos, manga grelhada, mix de folhas, tomate e maionese de limão. Com pão vegano, fica 100% vegetal.',
    grupos: [
      { id: 'pao', titulo: 'Escolha o pão', curto: 'Pão', tipo: 'single', obrigatorio: true, padrao: 'brioche',
        opcoes: [op('brioche', 'Brioche amanteigado'), op('vegano', 'Pão vegano (sem leite e ovos)'), op('sem-gluten', 'Sem glúten', 500)] },
      G.adicionaisVeg(),
    ],
    remover: ['Manga', 'Tomate', 'Maionese de limão'],
  },

  // ---------------- Combos
  {
    id: 'combo-smash', cat: 'combos', nome: 'Combo Smash', preco: 3990, selos: ['mais'],
    img: foto('1594212699903-ec8a3eca50f5'),
    desc: 'Smash Clássico + batata rústica individual + bebida à sua escolha. O favorito da casa.',
    grupos: [G.batataCombo(), G.bebida(), G.adicionais(op('smash-extra', 'Smash extra (80 g)', 700))],
    remover: ['Picles', 'Cebola', 'Molho especial'],
  },
  {
    id: 'combo-brasa', cat: 'combos', nome: 'Combo Brasa', preco: 4690,
    img: foto('1551782450-17144efb9c50'),
    desc: 'Brasa Bacon + batata rústica individual + bebida. Pra quem chega com fome de verdade.',
    grupos: [G.ponto(), G.batataCombo(), G.bebida(), G.adicionais(op('carne-extra', 'Carne extra (160 g)', 900))],
    remover: ['Cebola roxa', 'Barbecue'],
  },
  {
    id: 'combo-dupla', cat: 'combos', nome: 'Combo Dupla', preco: 7490, selos: ['novo'],
    img: foto('1572802419224-296b0aeee0d9'),
    desc: 'Dois Smash Clássicos + batata rústica grande + duas bebidas. Perfeito pra dividir no sofá.',
    grupos: [G.batataCombo(true), G.bebida('bebida1', '1ª bebida', '1ª bebida'), G.bebida('bebida2', '2ª bebida', '2ª bebida')],
    remover: ['Picles', 'Cebola', 'Molho especial'],
  },

  // ---------------- Porções
  {
    id: 'batata-rustica', cat: 'porcoes', nome: 'Batata Rústica', preco: 1890, selos: ['mais'],
    img: foto('1630384060421-cb20d0e0649d'),
    desc: 'Batatas com casca cortadas à mão, fritas duas vezes e finalizadas com sal de alecrim. Acompanha maionese da casa.',
    grupos: [G.tamanho(1000), G.molhos()],
  },
  {
    id: 'batata-brasa', cat: 'porcoes', nome: 'Batata Brasa', preco: 2490, selos: ['novo'],
    img: foto('1573080496219-bb080dd4f877'),
    desc: 'Fritas finas com parmesão ralado na hora, salsinha e alho dourado. Do tipo que some da mesa.',
    grupos: [G.tamanho(1200), G.molhos()],
  },
  {
    id: 'onion-rings', cat: 'porcoes', nome: 'Onion Rings', preco: 2290,
    img: foto('1639024471283-03518883512d'),
    desc: 'Anéis de cebola empanados na massa de cerveja, sequinhos e crocantes, com barbecue defumado para mergulhar.',
    grupos: [G.molhos()],
  },
  {
    id: 'asinhas', cat: 'porcoes', nome: 'Asinhas Diablo', preco: 3290, selos: ['picante'],
    img: foto('1608039755401-742074f0548d'),
    desc: '10 asinhas assadas e finalizadas na brasa com molho de pimenta da casa. Vêm com molho de iogurte e salsão.',
    grupos: [
      { id: 'picancia', titulo: 'Nível de pimenta', curto: 'Pimenta', tipo: 'single', obrigatorio: true,
        opcoes: [op('sem', 'Sem pimenta (só barbecue)'), op('media', 'Picância média'), op('alta', 'Bem picante')] },
      G.molhos(),
    ],
  },
  {
    id: 'iscas-frango', cat: 'porcoes', nome: 'Iscas de Frango', preco: 2790,
    img: foto('1562967914-608f82629710'),
    desc: 'Tirinhas de peito empanadas no panko, crocantes e suculentas, com maionese de mostarda e mel.',
    grupos: [G.molhos()],
  },

  // ---------------- Bebidas
  {
    id: 'limonada', cat: 'bebidas', nome: 'Limonada Suíça 500 ml', preco: 1290, selos: ['mais'],
    img: foto('1621263764928-df1444c5e859'),
    desc: 'Limão tahiti batido com casca, leite condensado e muito gelo. Cremosa e refrescante.',
    grupos: [{ id: 'docura', titulo: 'Doçura', curto: 'Doçura', tipo: 'single', obrigatorio: true, padrao: 'normal',
      opcoes: [op('normal', 'Normal'), op('menos', 'Menos doce'), op('sem', 'Sem açúcar')] }],
  },
  {
    id: 'suco-laranja', cat: 'bebidas', nome: 'Suco de Laranja 500 ml', preco: 1190,
    img: foto('1600271886742-f049cd451bba'),
    desc: 'Laranja espremida na hora, sem água e sem açúcar. Simples e perfeito.',
  },
  {
    id: 'cha-gelado', cat: 'bebidas', nome: 'Chá Gelado da Casa 500 ml', preco: 990,
    img: foto('1556679343-c7306c1976bc'),
    desc: 'Chá preto gelado com limão e um toque de hortelã, adoçado na medida.',
  },
  {
    id: 'refri-lata', cat: 'bebidas', nome: 'Refrigerante lata 350 ml', preco: 690,
    img: 'img/refri.svg',
    desc: 'Bem gelado, direto do freezer.',
    grupos: [{ id: 'sabor', titulo: 'Sabor', curto: 'Sabor', tipo: 'single', obrigatorio: true,
      opcoes: [op('cola', 'Cola'), op('cola-zero', 'Cola Zero'), op('guarana', 'Guaraná'), op('guarana-zero', 'Guaraná Zero'), op('laranja', 'Laranja'), op('limao', 'Limão')] }],
  },
  {
    id: 'agua', cat: 'bebidas', nome: 'Água mineral 500 ml', preco: 450,
    img: 'img/agua.svg',
    desc: 'Natural da serra capixaba.',
    grupos: [{ id: 'gas', titulo: 'Com ou sem gás?', curto: 'Tipo', tipo: 'single', obrigatorio: true, padrao: 'sem',
      opcoes: [op('sem', 'Sem gás'), op('com', 'Com gás', 50)] }],
  },

  // ---------------- Sobremesas
  {
    id: 'brownie-sorvete', cat: 'sobremesas', nome: 'Brownie com Sorvete', preco: 2190, selos: ['mais'],
    img: foto('1551024506-0bccd828d307'),
    desc: 'Brownie quentinho, bola de sorvete de creme e calda de doce de leite. O sorvete vai em embalagem térmica separada.',
  },
  {
    id: 'brownie', cat: 'sobremesas', nome: 'Brownie de Chocolate', preco: 1490,
    img: foto('1606313564200-e75d5e30476c'),
    desc: 'Chocolate 70% com casquinha crocante e centro molhadinho, regado com ganache.',
  },
  {
    id: 'pote-morango', cat: 'sobremesas', nome: 'Pote de Morango', preco: 1690, selos: ['novo'],
    img: foto('1488477181946-6428a0291777'),
    desc: 'Creme de baunilha aveludado com morangos frescos e calda de frutas vermelhas, no potinho de 200 ml.',
  },
  {
    id: 'milkshake', cat: 'sobremesas', nome: 'Milkshake 400 ml', preco: 1890,
    img: foto('1579954115545-a95591f28bfc'),
    desc: 'Sorvete de creme batido na hora, grosso do jeito certo, com chantili por cima.',
    grupos: [{ id: 'sabor', titulo: 'Sabor', curto: 'Sabor', tipo: 'single', obrigatorio: true,
      opcoes: [op('morango', 'Morango'), op('chocolate', 'Chocolate belga'), op('doce-de-leite', 'Doce de leite', 200)] }],
  },
];

const SELOS = {
  mais: { texto: 'Mais pedido', classe: 'selo-mais' },
  novo: { texto: 'Novo', classe: 'selo-novo' },
  picante: { texto: 'Picante', classe: 'selo-picante' },
};

/* =====================================================================
   Lógica pura (sem DOM) — testável no Node
   ===================================================================== */
function fmt(centavos) {
  const neg = centavos < 0;
  const v = Math.abs(Math.round(centavos));
  const reais = Math.floor(v / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const cent = String(v % 100).padStart(2, '0');
  return (neg ? '-' : '') + 'R$ ' + reais + ',' + cent;
}

function parseReais(txt) {
  if (txt == null) return NaN;
  let s = String(txt).replace(/[^\d,.]/g, '');
  if (!s) return NaN;
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  else if (/\.\d{3}$/.test(s)) s = s.replace(/\./g, '');
  const n = Number(s);
  return Number.isFinite(n) ? Math.round(n * 100) : NaN;
}

function getItem(id) { return ITENS.find((i) => i.id === id) || null; }
function getBairro(id) { return BAIRROS.find((b) => b.id === id) || null; }

function selecaoPadrao(item) {
  const sel = {};
  (item.grupos || []).forEach((g) => { sel[g.id] = g.padrao ? [g.padrao] : []; });
  return sel;
}

/** Remove opções inexistentes e respeita os limites de cada grupo. */
function normalizarSelecao(item, sel) {
  const out = {};
  (item.grupos || []).forEach((g) => {
    let ids = Array.isArray(sel && sel[g.id]) ? sel[g.id] : [];
    ids = ids.filter((id, i) => g.opcoes.some((o) => o.id === id) && ids.indexOf(id) === i);
    const max = g.tipo === 'single' ? 1 : (g.max || g.opcoes.length);
    out[g.id] = ids.slice(0, max);
  });
  return out;
}

function precoUnitario(item, sel) {
  let total = item.preco;
  (item.grupos || []).forEach((g) => {
    ((sel && sel[g.id]) || []).forEach((id) => {
      const o = g.opcoes.find((x) => x.id === id);
      if (o) total += o.preco;
    });
  });
  return total;
}

/** Lista de grupos obrigatórios ainda sem escolha. */
function gruposPendentes(item, sel) {
  return (item.grupos || []).filter((g) => g.obrigatorio && !((sel && sel[g.id]) || []).length);
}

function precoLinha(linha) {
  const item = getItem(linha.itemId);
  return item ? precoUnitario(item, linha.sel) * linha.qtd : 0;
}

function descreverLinha(linha) {
  const item = getItem(linha.itemId);
  const unit = precoUnitario(item, linha.sel);
  const detalhes = [];
  (item.grupos || []).forEach((g) => {
    const ids = (linha.sel && linha.sel[g.id]) || [];
    if (!ids.length) return;
    const ops = ids.map((id) => g.opcoes.find((o) => o.id === id)).filter(Boolean);
    if (g.tipo === 'single') {
      const o = ops[0];
      detalhes.push(`${g.curto}: ${o.nome}${o.preco ? ` (+${fmt(o.preco)})` : ''}`);
    } else {
      detalhes.push(`${g.curto}: ` + ops.map((o) => `${o.nome}${o.preco ? ` (+${fmt(o.preco)})` : ''}`).join(', '));
    }
  });
  if (linha.sem && linha.sem.length) detalhes.push('Sem: ' + linha.sem.map((s) => s.toLowerCase()).join(', '));
  if (linha.obs && linha.obs.trim()) detalhes.push('Obs.: ' + linha.obs.trim());
  return { item, unit, total: unit * linha.qtd, detalhes };
}

function totais(carrinho, cliente) {
  const subtotal = carrinho.reduce((s, l) => s + precoLinha(l), 0);
  const bairro = cliente && cliente.tipo === 'entrega' ? getBairro(cliente.bairro) : null;
  const taxa = bairro ? bairro.taxa : 0;
  const qtd = carrinho.reduce((s, l) => s + l.qtd, 0);
  return { subtotal, taxa, total: subtotal + taxa, qtd };
}

/* ---- Horário de funcionamento ---- */
function minutosDoDia(d) { return d.getHours() * 60 + d.getMinutes(); }
function emData(base, minutos) {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  d.setHours(Math.floor(minutos / 60), minutos % 60, 0, 0);
  return d;
}
function hhmm(minutos) {
  const h = Math.floor(minutos / 60), m = minutos % 60;
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
}
function mesmoDia(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function rotuloDia(d, agora) {
  const amanha = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 1);
  if (mesmoDia(d, agora)) return 'hoje';
  if (mesmoDia(d, amanha)) return 'amanhã';
  return DIAS[d.getDay()];
}

function proximaAbertura(agora) {
  for (let i = 0; i < 8; i++) {
    const dia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + i);
    const h = LOJA.horarios[dia.getDay()];
    if (!h) continue;
    const ini = emData(dia, h[0]);
    if (ini > agora) return ini;
  }
  return null;
}

/** forcar: null | 'aberto' | 'fechado' (simulação para demonstração) */
function statusLoja(agora = new Date(), forcar = null) {
  const h = LOJA.horarios[agora.getDay()];
  const m = minutosDoDia(agora);
  let aberto = !!h && m >= h[0] && m < h[1];
  if (forcar === 'aberto') aberto = true;
  if (forcar === 'fechado') aberto = false;
  const fechaEm = aberto ? (h ? h[1] : 1410) : null;
  const proxima = aberto ? null : proximaAbertura(agora);
  return { aberto, fechaEm, proxima, simulado: !!forcar };
}

function textoStatus(st, agora = new Date()) {
  if (st.aberto) return { curto: 'Aberto agora', detalhe: `até ${hhmm(st.fechaEm)}` };
  if (!st.proxima) return { curto: 'Fechado', detalhe: '' };
  const dia = rotuloDia(st.proxima, agora);
  return { curto: 'Fechado agora', detalhe: `abre ${dia} às ${hhmm(minutosDoDia(st.proxima))}` };
}

function valorHorario(d) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}
function lerHorario(v) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(v || '');
  return m ? new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) : null;
}
function rotuloHorario(valor, agora = new Date()) {
  const d = lerHorario(valor);
  if (!d) return '';
  const p = (n) => String(n).padStart(2, '0');
  const dia = rotuloDia(d, agora);
  const nomeDia = dia === 'hoje' || dia === 'amanhã' ? `${dia} (${DIAS[d.getDay()]})` : DIAS[d.getDay()];
  return `${nomeDia}, ${p(d.getDate())}/${p(d.getMonth() + 1)} às ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** Horários de agendamento (de 30 em 30 min) nos 2 próximos dias de funcionamento. */
function horariosAgendamento(agora = new Date()) {
  const grupos = [];
  for (let i = 0; i < 8 && grupos.length < 2; i++) {
    const dia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + i);
    const h = LOJA.horarios[dia.getDay()];
    if (!h) continue;
    const slots = [];
    for (let t = h[0] + 30; t <= h[1] - 30; t += 30) {
      const d = emData(dia, t);
      if (d - agora < 45 * 60000) continue; // antecedência mínima de 45 min
      slots.push({ valor: valorHorario(d), rotulo: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` });
    }
    if (slots.length) {
      const r = rotuloDia(dia, agora);
      const p = (n) => String(n).padStart(2, '0');
      const titulo = (r === 'hoje' || r === 'amanhã' ? `${r[0].toUpperCase() + r.slice(1)} · ${DIAS[dia.getDay()]}` : DIAS[dia.getDay()][0].toUpperCase() + DIAS[dia.getDay()].slice(1)) + `, ${p(dia.getDate())}/${p(dia.getMonth() + 1)}`;
      grupos.push({ titulo, slots });
    }
  }
  return grupos;
}

function precisaAgendar(cliente, st) { return !st.aberto || cliente.quando === 'agendar'; }

/** Valida o pedido. Retorna { campo: mensagem } (vazio = ok). */
function validarPedido(carrinho, cliente, st, agora = new Date()) {
  const e = {};
  const t = totais(carrinho, cliente);
  if (!carrinho.length) e.itens = 'Sua sacola está vazia.';
  if (!cliente.nome || cliente.nome.trim().length < 2) e.nome = 'Diga seu nome para a gente chamar você.';
  if (cliente.tipo !== 'entrega' && cliente.tipo !== 'retirada') e.tipo = 'Escolha entrega ou retirada.';
  if (cliente.tipo === 'entrega') {
    if (!cliente.rua || cliente.rua.trim().length < 3) e.rua = 'Informe a rua.';
    if (!cliente.numero || !cliente.numero.trim()) e.numero = 'Informe o número (ou “s/n”).';
    if (!getBairro(cliente.bairro)) e.bairro = 'Escolha o bairro.';
    if (carrinho.length && t.subtotal < LOJA.pedidoMinimo) e.minimo = `Pedido mínimo para entrega: ${fmt(LOJA.pedidoMinimo)}. Faltam ${fmt(LOJA.pedidoMinimo - t.subtotal)}.`;
  }
  if (precisaAgendar(cliente, st)) {
    const validos = horariosAgendamento(agora).flatMap((g) => g.slots.map((s) => s.valor));
    if (!validos.includes(cliente.horario)) e.horario = 'Escolha um horário para o pedido.';
  }
  if (!PAGAMENTOS[cliente.pagamento]) e.pagamento = 'Escolha a forma de pagamento.';
  if (cliente.pagamento === 'dinheiro' && !cliente.semTroco) {
    const troco = parseReais(cliente.troco);
    if (!Number.isFinite(troco)) e.troco = 'Troco para quanto? Ou marque “não preciso de troco”.';
    else if (troco < t.total) e.troco = `O valor precisa ser maior que o total (${fmt(t.total)}).`;
  }
  return e;
}

function montarMensagem(carrinho, cliente, st, agora = new Date()) {
  const t = totais(carrinho, cliente);
  const L = [];
  L.push(`*NOVO PEDIDO · ${LOJA.nome.toUpperCase()}*`);
  L.push('');
  L.push(`*Cliente:* ${cliente.nome.trim()}`);
  L.push(`*Recebimento:* ${cliente.tipo === 'entrega' ? 'Entrega' : 'Retirada no balcão'}`);
  L.push(precisaAgendar(cliente, st)
    ? `*Quando:* AGENDADO para ${rotuloHorario(cliente.horario, agora)}`
    : '*Quando:* o quanto antes');
  L.push('');
  L.push('*ITENS*');
  carrinho.forEach((l) => {
    const d = descreverLinha(l);
    L.push(`*${l.qtd}x ${d.item.nome}* — ${fmt(d.total)}${l.qtd > 1 ? ` (${fmt(d.unit)} cada)` : ''}`);
    d.detalhes.forEach((x) => L.push(`   • ${x}`));
  });
  L.push('');
  L.push(`Subtotal: ${fmt(t.subtotal)}`);
  if (cliente.tipo === 'entrega') {
    const b = getBairro(cliente.bairro);
    L.push(`Taxa de entrega (${b ? b.nome : '-'}): ${fmt(t.taxa)}`);
  }
  L.push(`*TOTAL: ${fmt(t.total)}*`);
  L.push('');
  let pag = PAGAMENTOS[cliente.pagamento] || '-';
  if (cliente.pagamento === 'pix') pag += ' (aguardo a chave)';
  if (cliente.pagamento === 'cartao') pag += cliente.tipo === 'entrega' ? ' · levar maquininha' : ' · no balcão';
  if (cliente.pagamento === 'dinheiro') {
    if (cliente.semTroco) pag += ' · não preciso de troco';
    else {
      const troco = parseReais(cliente.troco);
      pag += ` · troco para ${fmt(troco)} (levar ${fmt(troco - t.total)})`;
    }
  }
  L.push(`*Pagamento:* ${pag}`);
  if (cliente.tipo === 'entrega') {
    const b = getBairro(cliente.bairro);
    L.push(`*Endereço:* ${cliente.rua.trim()}, ${cliente.numero.trim()}${cliente.compl && cliente.compl.trim() ? ` — ${cliente.compl.trim()}` : ''}`);
    L.push(`${b ? b.nome : ''} · ${LOJA.cidade}`);
    if (cliente.ref && cliente.ref.trim()) L.push(`Referência: ${cliente.ref.trim()}`);
  }
  L.push('');
  L.push('_Pedido feito pelo cardápio digital_');
  return L.join('\n');
}

function linkWhatsApp(msg, numero = WHATSAPP_NEGOCIO) {
  const n = String(numero || '').replace(/\D/g, '');
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(msg)}` : `https://wa.me/?text=${encodeURIComponent(msg)}`;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LOJA, BAIRROS, ITENS, CATEGORIAS, fmt, parseReais, getItem, selecaoPadrao, normalizarSelecao,
    precoUnitario, gruposPendentes, precoLinha, descreverLinha, totais, statusLoja, textoStatus,
    horariosAgendamento, rotuloHorario, validarPedido, montarMensagem, linkWhatsApp,
  };
}

/* =====================================================================
   Interface
   ===================================================================== */
if (typeof document !== 'undefined') (function () {
  const CHAVE = 'brasa-e-pao:v1';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const semMovimento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ICONES = {
    fechar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    mais: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
    menos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
    lixo: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>',
    zap: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4.5 19.5l1.1-3.9A8.2 8.2 0 1 1 8.6 18.7z"/><path d="M9.2 8.6c.3-.6.7-.6 1-.5l.7 1.6c.1.3 0 .5-.2.7l-.5.6c.6 1.2 1.6 2.1 2.8 2.7l.6-.6c.2-.2.5-.3.7-.2l1.6.8c.2.3.1.8-.4 1.2-.6.5-1.5.6-2.6.1a8 8 0 0 1-4-4c-.4-1.1-.2-2 .3-2.4z" fill="currentColor" stroke="none"/></svg>',
    sacola: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/></svg>',
    fogo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c2 3 4 5 3 8 1.5-.6 2.4-2 2.5-3.5C20 9 21 12 20 15a8 8 0 0 1-16 0c0-3 2-5.5 4-6.5 0 1.6.6 2.8 1.8 3.4C9 8.5 10 5 12 2z" fill="currentColor"/></svg>',
    estrela: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z" fill="currentColor"/></svg>',
    lapis: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  };

  /* ---------------- Estado + persistência ---------------- */
  const CLIENTE_PADRAO = { nome: '', tipo: 'entrega', rua: '', numero: '', compl: '', ref: '', bairro: '', quando: 'agora', horario: '', pagamento: '', troco: '', semTroco: false };
  const estado = { carrinho: [], cliente: { ...CLIENTE_PADRAO }, forcar: null, tentouEnviar: false, enviado: false };

  const params = new URLSearchParams(location.search);
  if (params.get('aberto') === '1') estado.forcar = 'aberto';
  if (params.get('fechado') === '1') estado.forcar = 'fechado';

  function carregar() {
    try {
      const raw = localStorage.getItem(CHAVE);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (Array.isArray(d.carrinho)) {
        estado.carrinho = d.carrinho.filter((l) => l && getItem(l.itemId)).map((l) => {
          const item = getItem(l.itemId);
          return {
            uid: String(l.uid || Math.random().toString(36).slice(2)),
            itemId: l.itemId,
            sel: normalizarSelecao(item, l.sel || {}),
            sem: Array.isArray(l.sem) ? l.sem.filter((s) => (item.remover || []).includes(s)) : [],
            obs: typeof l.obs === 'string' ? l.obs.slice(0, 140) : '',
            qtd: Math.min(20, Math.max(1, parseInt(l.qtd, 10) || 1)),
          };
        });
      }
      if (d.cliente && typeof d.cliente === 'object') {
        Object.keys(CLIENTE_PADRAO).forEach((k) => {
          if (typeof d.cliente[k] === typeof CLIENTE_PADRAO[k]) estado.cliente[k] = d.cliente[k];
        });
      }
      if (d.forcar === 'aberto' && !params.has('fechado')) estado.forcar = estado.forcar || 'aberto';
    } catch (_) { /* sem storage: segue sem persistir */ }
  }
  function salvar() {
    try {
      localStorage.setItem(CHAVE, JSON.stringify({ carrinho: estado.carrinho, cliente: estado.cliente, forcar: estado.forcar }));
    } catch (_) { /* ignora */ }
  }

  const status = () => statusLoja(new Date(), estado.forcar);

  /* ---------------- Cabeçalho / status ---------------- */
  function renderStatus() {
    const st = status();
    const tx = textoStatus(st);
    const el = $('#status');
    el.className = 'info status ' + (st.aberto ? 'is-aberto' : 'is-fechado');
    el.innerHTML = `<span class="ponto" aria-hidden="true"></span><span><b>${tx.curto}</b> <span class="status-det">${esc(tx.detalhe)}</span></span>`;

    const aviso = $('#aviso');
    if (!st.aberto) {
      aviso.hidden = false;
      aviso.className = 'aviso aviso-fechado';
      aviso.innerHTML = `<div class="aviso-txt"><strong>Estamos fechados agora${st.proxima ? ` · ${esc(tx.detalhe)}` : ''}.</strong> Pode montar seu pedido normalmente: na sacola você agenda para quando a chapa estiver quente.</div>
        <button type="button" class="aviso-demo" data-simular="aberto">Simular loja aberta <small>(demonstração)</small></button>`;
    } else if (st.simulado) {
      aviso.hidden = false;
      aviso.className = 'aviso aviso-simulado';
      aviso.innerHTML = `<div class="aviso-txt"><strong>Modo demonstração:</strong> simulando a loja aberta.</div>
        <button type="button" class="aviso-demo" data-simular="real">Voltar ao horário real</button>`;
    } else {
      aviso.hidden = true;
      aviso.innerHTML = '';
    }
    renderBarra();
  }

  /* ---------------- Cardápio ---------------- */
  function seloHTML(s) {
    const x = SELOS[s];
    if (!x) return '';
    const ic = s === 'picante' ? ICONES.fogo : s === 'mais' ? ICONES.estrela : '';
    return `<span class="selo ${x.classe}">${ic}${x.texto}</span>`;
  }

  function renderCardapio() {
    $('#cats').innerHTML = CATEGORIAS.map((c, i) =>
      `<a class="cat${i === 0 ? ' ativa' : ''}" href="#cat-${c.id}" data-cat="${c.id}"${i === 0 ? ' aria-current="true"' : ''}>${c.nome}</a>`).join('');

    $('#cardapio').innerHTML = CATEGORIAS.map((c) => {
      const itens = ITENS.filter((i) => i.cat === c.id);
      return `<section class="secao" id="cat-${c.id}" aria-labelledby="h-${c.id}">
        <div class="secao-cabeca"><h2 id="h-${c.id}">${c.nome}</h2><p>${c.sub}</p></div>
        <ul class="itens">${itens.map((it) => `
          <li><button type="button" class="item" data-item="${it.id}">
            <span class="item-txt">
              ${it.selos && it.selos.length ? `<span class="item-selos">${it.selos.map(seloHTML).join('')}</span>` : ''}
              <span class="item-nome">${esc(it.nome)}</span>
              <span class="item-desc">${esc(it.desc)}</span>
              <span class="item-rodape"><span class="item-preco">${fmt(it.preco)}</span><span class="item-nasacola" data-nasacola="${it.id}" hidden></span></span>
            </span>
            <span class="item-foto"><img src="${it.img}" alt="" loading="lazy" decoding="async" width="300" height="300"><span class="item-add" aria-hidden="true">${ICONES.mais}</span></span>
          </button></li>`).join('')}
        </ul>
      </section>`;
    }).join('');
  }

  function renderNaSacola() {
    const cont = {};
    estado.carrinho.forEach((l) => { cont[l.itemId] = (cont[l.itemId] || 0) + l.qtd; });
    $$('[data-nasacola]').forEach((el) => {
      const n = cont[el.dataset.nasacola] || 0;
      el.hidden = !n;
      el.textContent = n ? `${n} na sacola` : '';
    });
  }

  /* Destaca a categoria visível */
  function ativarCategoria(id) {
    const trilho = $('#cats');
    $$('.cat', trilho).forEach((a) => {
      const on = a.dataset.cat === id;
      a.classList.toggle('ativa', on);
      if (on) {
        a.setAttribute('aria-current', 'true');
        const alvo = a.offsetLeft - (trilho.clientWidth - a.offsetWidth) / 2;
        trilho.scrollTo({ left: Math.max(0, alvo), behavior: semMovimento() ? 'auto' : 'smooth' });
      } else a.removeAttribute('aria-current');
    });
  }
  let catAtual = null, travaSpy = 0;
  function spy() {
    if (Date.now() < travaSpy) return;
    const navH = $('.cats').getBoundingClientRect().bottom;
    let atual = CATEGORIAS[0].id;
    CATEGORIAS.forEach((c) => {
      const s = document.getElementById('cat-' + c.id);
      if (s && s.getBoundingClientRect().top <= navH + 24) atual = c.id;
    });
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 4) atual = CATEGORIAS[CATEGORIAS.length - 1].id;
    if (atual !== catAtual) { catAtual = atual; ativarCategoria(atual); }
  }

  /* ---------------- Folhas (modais) ---------------- */
  const pilha = [];
  const DUR = () => (semMovimento() ? 0 : 280);
  function fundoInerte(on) {
    ['#topo', '#aviso', '.cats', '#cardapio', '.rodape', '#barra', '.pular'].forEach((s) => { const el = $(s); if (el) el.inert = on; });
  }
  function abrirFolha(el, foco) {
    const anterior = document.activeElement;
    pilha.forEach((p) => { p.el.inert = true; });
    pilha.push({ el, anterior });
    fundoInerte(true);
    document.body.classList.add('travado');
    el.hidden = false; el.inert = false;
    const veu = $('#veu');
    veu.hidden = false;
    veu.style.zIndex = String(40 + pilha.length * 2 - 1);
    el.style.zIndex = String(40 + pilha.length * 2);
    requestAnimationFrame(() => requestAnimationFrame(() => { el.classList.add('aberta'); veu.classList.add('ativo'); }));
    setTimeout(() => { const f = foco || $('[data-fechar]', el); if (f) f.focus({ preventScroll: true }); }, 60);
  }
  function fecharFolha() {
    const topo = pilha.pop();
    if (!topo) return;
    const el = topo.el;
    el.classList.remove('aberta');
    setTimeout(() => { if (!el.classList.contains('aberta')) el.hidden = true; }, DUR());
    const veu = $('#veu');
    if (!pilha.length) {
      veu.classList.remove('ativo');
      setTimeout(() => { if (!pilha.length) veu.hidden = true; }, DUR());
      fundoInerte(false);
      document.body.classList.remove('travado');
    } else {
      const novo = pilha[pilha.length - 1];
      novo.el.inert = false;
      veu.style.zIndex = String(40 + pilha.length * 2 - 1);
    }
    if (topo.anterior && document.contains(topo.anterior) && !topo.anterior.closest('[inert]')) topo.anterior.focus({ preventScroll: true });
  }
  const folhaAberta = (el) => pilha.some((p) => p.el === el);

  /* ---------------- Folha do item ---------------- */
  let edicao = null; // { item, sel, sem, obs, qtd, uid|null }

  function abrirItem(itemId, linha) {
    const item = getItem(itemId);
    if (!item) return;
    edicao = {
      item,
      uid: linha ? linha.uid : null,
      sel: linha ? JSON.parse(JSON.stringify(linha.sel)) : selecaoPadrao(item),
      sem: linha ? linha.sem.slice() : [],
      obs: linha ? linha.obs : '',
      qtd: linha ? linha.qtd : 1,
      tentou: false,
    };
    const el = $('#folha-item');
    el.innerHTML = folhaItemHTML(edicao);
    atualizarItem();
    abrirFolha(el);
    $('.folha-corpo', el).scrollTop = 0;
  }

  function folhaItemHTML(ed) {
    const it = ed.item;
    const grupos = (it.grupos || []).map((g) => {
      const multi = g.tipo === 'multi';
      const tag = g.obrigatorio ? 'Obrigatório' : multi ? `Opcional · até ${g.max}` : 'Opcional';
      return `<fieldset class="grupo" data-grupo="${g.id}">
        <legend><span class="grupo-titulo">${esc(g.titulo)}</span><span class="grupo-tag${g.obrigatorio ? ' obrig' : ''}">${tag}</span></legend>
        <p class="grupo-erro" id="erro-${g.id}" hidden>Escolha uma opção para continuar.</p>
        ${g.opcoes.map((o) => `<label class="opcao">
          <input type="${multi ? 'checkbox' : 'radio'}" name="g-${g.id}" value="${o.id}"${(ed.sel[g.id] || []).includes(o.id) ? ' checked' : ''}>
          <span class="opcao-nome">${esc(o.nome)}</span>
          <span class="opcao-preco">${o.preco ? '+ ' + fmt(o.preco) : ''}</span>
        </label>`).join('')}
      </fieldset>`;
    }).join('');
    const remover = (it.remover || []).length ? `<fieldset class="grupo" data-remover>
        <legend><span class="grupo-titulo">Quer tirar algum ingrediente?</span><span class="grupo-tag">Opcional</span></legend>
        ${it.remover.map((r) => `<label class="opcao"><input type="checkbox" name="sem" value="${esc(r)}"${ed.sem.includes(r) ? ' checked' : ''}><span class="opcao-nome">Sem ${esc(r.toLowerCase())}</span><span class="opcao-preco"></span></label>`).join('')}
      </fieldset>` : '';
    return `
      <button type="button" class="fechar fechar-flutuante" data-fechar aria-label="Fechar">${ICONES.fechar}</button>
      <div class="folha-corpo">
        <div class="fi-foto"><img src="${it.img}" alt="${esc(it.nome)}" width="600" height="400"></div>
        <div class="fi-info">
          ${it.selos && it.selos.length ? `<div class="item-selos">${it.selos.map(seloHTML).join('')}</div>` : ''}
          <h2 id="fi-titulo">${esc(it.nome)}</h2>
          <p class="fi-desc">${esc(it.desc)}</p>
          <p class="fi-base">${fmt(it.preco)}</p>
        </div>
        <form class="fi-form" id="fi-form" novalidate>
          ${grupos}
          ${remover}
          <div class="grupo grupo-obs">
            <label for="fi-obs" class="grupo-titulo">Alguma observação?</label>
            <textarea id="fi-obs" maxlength="140" rows="2" placeholder="Ex.: cortar ao meio, molho à parte">${esc(ed.obs)}</textarea>
            <small class="contador" id="fi-cont" aria-live="polite">${ed.obs.length}/140</small>
          </div>
        </form>
      </div>
      <div class="folha-rodape fi-rodape">
        <div class="qtd" role="group" aria-label="Quantidade">
          <button type="button" data-qtd="-1" aria-label="Diminuir quantidade">${ICONES.menos}</button>
          <output id="fi-qtd" aria-live="polite">${ed.qtd}</output>
          <button type="button" data-qtd="1" aria-label="Aumentar quantidade">${ICONES.mais}</button>
        </div>
        <button type="button" class="btn btn-primario fi-add" id="fi-add">
          <span>${ed.uid ? 'Atualizar' : 'Adicionar'}</span><span id="fi-total"></span>
        </button>
      </div>`;
  }

  function lerFormItem() {
    const el = $('#folha-item');
    const it = edicao.item;
    (it.grupos || []).forEach((g) => {
      edicao.sel[g.id] = $$(`input[name="g-${g.id}"]:checked`, el).map((i) => i.value);
    });
    edicao.sem = $$('input[name="sem"]:checked', el).map((i) => i.value);
    edicao.obs = $('#fi-obs', el).value;
  }

  function atualizarItem() {
    const el = $('#folha-item');
    const it = edicao.item;
    // limite de escolhas em grupos múltiplos
    (it.grupos || []).filter((g) => g.tipo === 'multi').forEach((g) => {
      const marcados = (edicao.sel[g.id] || []).length;
      $$(`input[name="g-${g.id}"]`, el).forEach((i) => { i.disabled = !i.checked && marcados >= g.max; });
    });
    const pend = gruposPendentes(it, edicao.sel);
    (it.grupos || []).forEach((g) => {
      const err = $(`#erro-${g.id}`, el);
      const falta = edicao.tentou && pend.includes(g);
      if (err) err.hidden = !falta;
      const fs = $(`[data-grupo="${g.id}"]`, el);
      if (fs) fs.classList.toggle('com-erro', falta);
    });
    $('#fi-qtd', el).textContent = edicao.qtd;
    $('[data-qtd="-1"]', el).disabled = edicao.qtd <= 1;
    $('[data-qtd="1"]', el).disabled = edicao.qtd >= 20;
    $('#fi-total', el).textContent = fmt(precoUnitario(it, edicao.sel) * edicao.qtd);
    $('#fi-cont', el).textContent = `${edicao.obs.length}/140`;
  }

  function confirmarItem() {
    const it = edicao.item;
    const pend = gruposPendentes(it, edicao.sel);
    if (pend.length) {
      edicao.tentou = true;
      atualizarItem();
      const fs = $(`#folha-item [data-grupo="${pend[0].id}"]`);
      fs.scrollIntoView({ behavior: semMovimento() ? 'auto' : 'smooth', block: 'center' });
      const primeiro = $('input', fs);
      if (primeiro) setTimeout(() => primeiro.focus({ preventScroll: true }), semMovimento() ? 0 : 300);
      if (!semMovimento()) { fs.classList.remove('tremer'); void fs.offsetWidth; fs.classList.add('tremer'); }
      toast(`Falta escolher: ${pend.map((g) => g.titulo.toLowerCase()).join(', ')}`);
      return;
    }
    const linha = {
      uid: edicao.uid || Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      itemId: it.id,
      sel: normalizarSelecao(it, edicao.sel),
      sem: edicao.sem.slice(),
      obs: edicao.obs.trim().slice(0, 140),
      qtd: edicao.qtd,
    };
    if (edicao.uid) {
      const i = estado.carrinho.findIndex((l) => l.uid === edicao.uid);
      if (i >= 0) estado.carrinho[i] = linha; else estado.carrinho.push(linha);
      toast('Item atualizado');
    } else {
      // junta com item idêntico já na sacola
      const igual = estado.carrinho.find((l) => l.itemId === linha.itemId && JSON.stringify(l.sel) === JSON.stringify(linha.sel) && JSON.stringify(l.sem) === JSON.stringify(linha.sem) && l.obs === linha.obs);
      if (igual) igual.qtd = Math.min(20, igual.qtd + linha.qtd); else estado.carrinho.push(linha);
      toast(`${linha.qtd}x ${it.nome} na sacola`);
      pulsarBarra();
    }
    estado.enviado = false;
    salvar();
    fecharFolha();
    aposMudarCarrinho();
  }

  /* ---------------- Barra da sacola ---------------- */
  function renderBarra() {
    const barra = $('#barra');
    const t = totais(estado.carrinho, estado.cliente);
    if (!t.qtd) { barra.hidden = true; document.body.classList.remove('com-barra'); return; }
    barra.hidden = false;
    document.body.classList.add('com-barra');
    const st = status();
    $('#barra-qtd').textContent = t.qtd;
    $('#barra-rotulo').textContent = st.aberto ? 'Ver sacola' : 'Ver sacola e agendar';
    $('#barra-total').textContent = fmt(t.subtotal);
    $('#barra-btn').setAttribute('aria-label', `Ver sacola: ${t.qtd} ${t.qtd === 1 ? 'item' : 'itens'}, ${fmt(t.subtotal)}${st.aberto ? '' : '. Loja fechada, agende seu pedido'}`);
  }
  function pulsarBarra() {
    if (semMovimento()) return;
    const b = $('#barra-btn');
    b.classList.remove('pulso'); void b.offsetWidth; b.classList.add('pulso');
  }

  /* ---------------- Sacola / checkout ---------------- */
  function abrirSacola() {
    const el = $('#folha-sacola');
    estado.enviado = false;
    el.innerHTML = sacolaHTML();
    preencherSacola();
    abrirFolha(el);
  }

  function sacolaHTML() {
    const c = estado.cliente;
    return `
      <div class="folha-cabeca">
        <h2 id="fs-titulo">${ICONES.sacola}Sua sacola</h2>
        <button type="button" class="fechar" data-fechar aria-label="Fechar sacola">${ICONES.fechar}</button>
      </div>
      <div class="folha-corpo" id="fs-corpo">
        <div id="fs-vazia" class="vazia" hidden>
          <img src="img/prato.svg" alt="" width="120" height="120">
          <p><strong>Sua sacola está vazia.</strong><br>Que tal começar pelo Smash Clássico?</p>
          <button type="button" class="btn btn-primario" data-fechar>Ver cardápio</button>
        </div>
        <div id="fs-conteudo">
          <section class="bloco" aria-labelledby="h-itens">
            <h3 id="h-itens">Itens</h3>
            <ul class="linhas" id="fs-itens"></ul>
            <button type="button" class="link-add" data-fechar>${ICONES.mais} Adicionar mais itens</button>
          </section>

          <section class="bloco" aria-labelledby="h-receber">
            <h3 id="h-receber">Como você quer receber?</h3>
            <div class="segmentado" role="radiogroup" aria-labelledby="h-receber">
              <label><input type="radio" name="tipo" value="entrega"${c.tipo === 'entrega' ? ' checked' : ''}><span><b>Entrega</b><small>${LOJA.tempoEntrega}</small></span></label>
              <label><input type="radio" name="tipo" value="retirada"${c.tipo === 'retirada' ? ' checked' : ''}><span><b>Retirada</b><small>no balcão · ${LOJA.tempoRetirada}</small></span></label>
            </div>
            <div id="campos-entrega" class="campos">
              <div class="campo">
                <label for="f-bairro">Bairro</label>
                <select id="f-bairro" name="bairro" aria-describedby="e-bairro">
                  <option value="">Selecione o bairro</option>
                  ${BAIRROS.map((b) => `<option value="${b.id}">${b.nome} · entrega ${fmt(b.taxa)}</option>`).join('')}
                </select>
                <small class="erro" id="e-bairro"></small>
              </div>
              <div class="campo">
                <label for="f-rua">Rua / avenida</label>
                <input id="f-rua" name="rua" autocomplete="address-line1" placeholder="Ex.: Av. Champagnat" aria-describedby="e-rua">
                <small class="erro" id="e-rua"></small>
              </div>
              <div class="campo-linha">
                <div class="campo campo-num">
                  <label for="f-numero">Número</label>
                  <input id="f-numero" name="numero" inputmode="numeric" autocomplete="off" placeholder="123" aria-describedby="e-numero">
                  <small class="erro" id="e-numero"></small>
                </div>
                <div class="campo">
                  <label for="f-compl">Complemento <span class="opc">(opcional)</span></label>
                  <input id="f-compl" name="compl" autocomplete="address-line2" placeholder="Apto, bloco, casa">
                </div>
              </div>
              <div class="campo">
                <label for="f-ref">Ponto de referência <span class="opc">(opcional)</span></label>
                <input id="f-ref" name="ref" placeholder="Ex.: em frente à padaria">
              </div>
              <p class="nota">Não achou seu bairro? Chame a gente no WhatsApp que a gente vê se chega aí.</p>
            </div>
            <div id="info-retirada" class="info-retirada" hidden>
              <strong>Retire no balcão</strong>
              <span>${esc(LOJA.endereco)}, ${LOJA.cidade}</span>
              <span>Fica pronto em ${LOJA.tempoRetirada}. Sem taxa de entrega.</span>
            </div>
          </section>

          <section class="bloco" aria-labelledby="h-quando">
            <h3 id="h-quando">Quando?</h3>
            <div id="quando-fechado" class="alerta-fechado" hidden></div>
            <div id="quando-opcoes" class="segmentado" role="radiogroup" aria-labelledby="h-quando">
              <label><input type="radio" name="quando" value="agora"${c.quando !== 'agendar' ? ' checked' : ''}><span><b>O quanto antes</b><small id="quando-agora-tempo"></small></span></label>
              <label><input type="radio" name="quando" value="agendar"${c.quando === 'agendar' ? ' checked' : ''}><span><b>Agendar</b><small>escolha o horário</small></span></label>
            </div>
            <div class="campo" id="campo-horario" hidden>
              <label for="f-horario">Horário do pedido</label>
              <select id="f-horario" name="horario" aria-describedby="e-horario"></select>
              <small class="erro" id="e-horario"></small>
            </div>
          </section>

          <section class="bloco" aria-labelledby="h-pag">
            <h3 id="h-pag">Pagamento <span class="sub-h">na entrega ou no balcão</span></h3>
            <div class="pagamentos" role="radiogroup" aria-labelledby="h-pag" aria-describedby="e-pagamento">
              <label><input type="radio" name="pagamento" value="pix"${c.pagamento === 'pix' ? ' checked' : ''}><span><b>Pix</b><small>chave enviada na conversa</small></span></label>
              <label><input type="radio" name="pagamento" value="cartao"${c.pagamento === 'cartao' ? ' checked' : ''}><span><b>Cartão</b><small>crédito ou débito</small></span></label>
              <label><input type="radio" name="pagamento" value="dinheiro"${c.pagamento === 'dinheiro' ? ' checked' : ''}><span><b>Dinheiro</b><small>levamos troco</small></span></label>
            </div>
            <small class="erro" id="e-pagamento"></small>
            <div id="campos-troco" class="campos" hidden>
              <div class="campo">
                <label for="f-troco">Troco para quanto?</label>
                <div class="input-prefixo"><span aria-hidden="true">R$</span><input id="f-troco" name="troco" inputmode="decimal" placeholder="100,00" aria-describedby="e-troco"></div>
                <small class="erro" id="e-troco"></small>
              </div>
              <label class="check"><input type="checkbox" id="f-semtroco"> Não preciso de troco</label>
            </div>
          </section>

          <section class="bloco" aria-labelledby="h-dados">
            <h3 id="h-dados">Seu nome</h3>
            <div class="campo">
              <label for="f-nome" class="sr-only">Seu nome</label>
              <input id="f-nome" name="nome" autocomplete="name" placeholder="Como podemos te chamar?" aria-describedby="e-nome">
              <small class="erro" id="e-nome"></small>
            </div>
          </section>

          <section class="bloco resumo" aria-labelledby="h-resumo">
            <h3 id="h-resumo">Resumo</h3>
            <dl id="fs-resumo"></dl>
            <p class="erro erro-min" id="e-minimo"></p>
            <p class="nota nota-zap">${ICONES.zap}Ao enviar, o WhatsApp abre com o pedido prontinho. É só tocar em enviar: sem cadastro e sem taxa de aplicativo.</p>
          </section>
        </div>

        <div id="fs-sucesso" class="sucesso" hidden tabindex="-1">
          <div class="sucesso-ico">${ICONES.check}</div>
          <h3>Pedido pronto no WhatsApp!</h3>
          <p>Confira a mensagem e toque em <b>enviar</b>. A gente confirma em instantes por lá.</p>
          <div class="sucesso-acoes">
            <button type="button" class="btn btn-zap" id="fs-reabrir">${ICONES.zap}Abrir o WhatsApp de novo</button>
            <button type="button" class="btn btn-claro" id="fs-novo">Já enviei · começar novo pedido</button>
          </div>
        </div>
      </div>
      <div class="folha-rodape fs-rodape" id="fs-rodape">
        <button type="button" class="btn btn-zap fs-enviar" id="fs-enviar">${ICONES.zap}<span id="fs-enviar-txt">Enviar pedido pelo WhatsApp</span><span class="fs-enviar-total" id="fs-enviar-total"></span></button>
      </div>`;
  }

  function preencherSacola() {
    const c = estado.cliente;
    const el = $('#folha-sacola');
    $('#f-bairro', el).value = getBairro(c.bairro) ? c.bairro : '';
    $('#f-rua', el).value = c.rua;
    $('#f-numero', el).value = c.numero;
    $('#f-compl', el).value = c.compl;
    $('#f-ref', el).value = c.ref;
    $('#f-troco', el).value = c.troco;
    $('#f-semtroco', el).checked = c.semTroco;
    $('#f-nome', el).value = c.nome;
    renderHorarios();
    atualizarSacola();
  }

  function renderHorarios() {
    const sel = $('#f-horario');
    if (!sel) return;
    const grupos = horariosAgendamento(new Date());
    const validos = grupos.flatMap((g) => g.slots.map((s) => s.valor));
    if (!validos.includes(estado.cliente.horario)) estado.cliente.horario = '';
    sel.innerHTML = '<option value="">Escolha um horário</option>' + grupos.map((g) =>
      `<optgroup label="${esc(g.titulo)}">${g.slots.map((s) => `<option value="${s.valor}">${s.rotulo}</option>`).join('')}</optgroup>`).join('');
    sel.value = estado.cliente.horario;
  }

  function renderLinhas() {
    const ul = $('#fs-itens');
    ul.innerHTML = estado.carrinho.map((l) => {
      const d = descreverLinha(l);
      return `<li class="linha" data-uid="${l.uid}">
        <img src="${d.item.img}" alt="" width="64" height="64" loading="lazy">
        <div class="linha-txt">
          <div class="linha-topo"><span class="linha-nome">${esc(d.item.nome)}</span><span class="linha-preco">${fmt(d.total)}</span></div>
          ${d.detalhes.length ? `<ul class="linha-det">${d.detalhes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
          <div class="linha-acoes">
            <div class="qtd qtd-p" role="group" aria-label="Quantidade de ${esc(d.item.nome)}">
              <button type="button" data-acao="menos" aria-label="${l.qtd > 1 ? 'Diminuir quantidade' : 'Remover ' + esc(d.item.nome)}">${l.qtd > 1 ? ICONES.menos : ICONES.lixo}</button>
              <output>${l.qtd}</output>
              <button type="button" data-acao="mais" aria-label="Aumentar quantidade"${l.qtd >= 20 ? ' disabled' : ''}>${ICONES.mais}</button>
            </div>
            <button type="button" class="link-acao" data-acao="editar">${ICONES.lapis}Editar</button>
            <button type="button" class="link-acao link-perigo" data-acao="remover">${ICONES.lixo}Remover</button>
          </div>
        </div>
      </li>`;
    }).join('');
  }

  function atualizarSacola(opts = {}) {
    const el = $('#folha-sacola');
    if (!el || el.hidden && !folhaAberta(el)) return;
    if (!$('#fs-conteudo', el)) return;
    const c = estado.cliente;
    const st = status();
    const vazia = !estado.carrinho.length;

    if (estado.enviado) {
      $('#fs-conteudo', el).hidden = true;
      $('#fs-vazia', el).hidden = true;
      $('#fs-sucesso', el).hidden = false;
      $('#fs-rodape', el).hidden = true;
      return;
    }
    $('#fs-sucesso', el).hidden = true;
    $('#fs-vazia', el).hidden = !vazia;
    $('#fs-conteudo', el).hidden = vazia;
    $('#fs-rodape', el).hidden = vazia;
    if (vazia) return;

    if (!opts.semLinhas) renderLinhas();

    // entrega x retirada
    $('#campos-entrega', el).hidden = c.tipo !== 'entrega';
    $('#info-retirada', el).hidden = c.tipo !== 'retirada';

    // quando
    const fech = $('#quando-fechado', el);
    if (!st.aberto) {
      fech.hidden = false;
      const tx = textoStatus(st);
      fech.innerHTML = `<strong>Estamos fechados agora</strong> (${esc(tx.detalhe)}). Escolha um horário e seu pedido entra na fila assim que a chapa esquentar.`;
      $('#quando-opcoes', el).hidden = true;
      $('#campo-horario', el).hidden = false;
    } else {
      fech.hidden = true;
      $('#quando-opcoes', el).hidden = false;
      $('#campo-horario', el).hidden = c.quando !== 'agendar';
      $('#quando-agora-tempo', el).textContent = c.tipo === 'entrega' ? LOJA.tempoEntrega : LOJA.tempoRetirada;
    }

    // pagamento
    $('#campos-troco', el).hidden = c.pagamento !== 'dinheiro';
    $('#f-troco', el).disabled = c.semTroco;

    // resumo
    const t = totais(estado.carrinho, c);
    const b = getBairro(c.bairro);
    $('#fs-resumo', el).innerHTML = `
      <div><dt>Subtotal (${t.qtd} ${t.qtd === 1 ? 'item' : 'itens'})</dt><dd>${fmt(t.subtotal)}</dd></div>
      ${c.tipo === 'entrega' ? `<div><dt>Entrega${b ? ` · ${esc(b.nome)}` : ''}</dt><dd>${b ? fmt(t.taxa) : '<span class="muted">escolha o bairro</span>'}</dd></div>` : '<div><dt>Retirada no balcão</dt><dd>grátis</dd></div>'}
      <div class="total"><dt>Total</dt><dd>${fmt(t.total)}</dd></div>`;
    $('#fs-enviar-total', el).textContent = fmt(t.total);
    $('#fs-enviar-txt', el).textContent = precisaAgendar(c, st) ? 'Agendar pelo WhatsApp' : 'Enviar pedido pelo WhatsApp';

    mostrarErros();
  }

  const CAMPOS_ERRO = { nome: 'f-nome', rua: 'f-rua', numero: 'f-numero', bairro: 'f-bairro', horario: 'f-horario', troco: 'f-troco', pagamento: null, minimo: null };
  function mostrarErros() {
    const el = $('#folha-sacola');
    const erros = validarPedido(estado.carrinho, estado.cliente, status(), new Date());
    // pedido mínimo aparece sempre (é informação útil), o resto só depois de tentar enviar
    Object.keys(CAMPOS_ERRO).forEach((k) => {
      const msg = (estado.tentouEnviar || k === 'minimo') ? (erros[k] || '') : '';
      const alvo = $('#e-' + k, el);
      if (alvo) alvo.textContent = msg;
      const campo = CAMPOS_ERRO[k] && $('#' + CAMPOS_ERRO[k], el);
      if (campo) { if (msg) campo.setAttribute('aria-invalid', 'true'); else campo.removeAttribute('aria-invalid'); }
    });
    return erros;
  }

  function enviarPedido() {
    estado.tentouEnviar = true;
    const st = status();
    const erros = mostrarErros();
    const ordem = ['minimo', 'bairro', 'rua', 'numero', 'horario', 'pagamento', 'troco', 'nome'];
    const primeiro = ordem.find((k) => erros[k]);
    if (primeiro) {
      const alvo = $('#e-' + primeiro);
      const campo = CAMPOS_ERRO[primeiro] ? $('#' + CAMPOS_ERRO[primeiro]) : null;
      (campo || alvo).scrollIntoView({ behavior: semMovimento() ? 'auto' : 'smooth', block: 'center' });
      if (campo && !campo.disabled) setTimeout(() => campo.focus({ preventScroll: true }), semMovimento() ? 0 : 300);
      toast(erros[primeiro]);
      return;
    }
    const msg = montarMensagem(estado.carrinho, estado.cliente, st, new Date());
    abrirWhats(msg);
    estado.ultimaMensagem = msg;
    estado.enviado = true;
    atualizarSacola();
    setTimeout(() => { const s = $('#fs-sucesso'); if (s) s.focus({ preventScroll: true }); $('#fs-corpo').scrollTop = 0; }, 50);
  }

  function abrirWhats(msg) {
    const url = linkWhatsApp(msg);
    const w = window.open(url, '_blank', 'noopener');
    if (!w) location.href = url;
  }

  function aposMudarCarrinho() {
    renderBarra();
    renderNaSacola();
    if (folhaAberta($('#folha-sacola'))) atualizarSacola();
  }

  /* ---------------- Toast ---------------- */
  let toastT;
  function toast(txt) {
    const t = $('#toast');
    t.textContent = txt;
    t.classList.add('visivel');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('visivel'), 2600);
  }

  /* ---------------- Selo da agência: reserva espaço só enquanto existe ---------------- */
  function observarSelo() {
    const atualizar = () => document.body.classList.toggle('sem-selo', !document.querySelector('.selo-demo'));
    new MutationObserver(atualizar).observe(document.body, { childList: true });
    setTimeout(atualizar, 0);
  }

  /* ---------------- Eventos ---------------- */
  function ligarEventos() {
    // abrir item
    $('#cardapio').addEventListener('click', (e) => {
      const b = e.target.closest('[data-item]');
      if (b) abrirItem(b.dataset.item);
    });

    // categorias
    $('#cats').addEventListener('click', (e) => {
      const a = e.target.closest('[data-cat]');
      if (!a) return;
      e.preventDefault();
      const alvo = document.getElementById('cat-' + a.dataset.cat);
      travaSpy = Date.now() + (semMovimento() ? 50 : 700);
      catAtual = a.dataset.cat;
      ativarCategoria(a.dataset.cat);
      alvo.scrollIntoView({ behavior: semMovimento() ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', '#cat-' + a.dataset.cat);
    });
    let rafSpy = 0;
    window.addEventListener('scroll', () => {
      if (rafSpy) return;
      rafSpy = requestAnimationFrame(() => { rafSpy = 0; spy(); });
    }, { passive: true });

    // barra
    $('#barra-btn').addEventListener('click', abrirSacola);

    // simular aberto/real (demonstração)
    $('#aviso').addEventListener('click', (e) => {
      const b = e.target.closest('[data-simular]');
      if (!b) return;
      estado.forcar = b.dataset.simular === 'aberto' ? 'aberto' : null;
      salvar();
      renderStatus();
      toast(estado.forcar ? 'Simulando loja aberta' : 'Voltamos ao horário real');
    });

    // véu e fechar
    $('#veu').addEventListener('click', fecharFolha);
    document.addEventListener('click', (e) => {
      const f = e.target.closest('[data-fechar]');
      if (f && pilha.length && f.closest('.folha') === pilha[pilha.length - 1].el) fecharFolha();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && pilha.length) { e.preventDefault(); fecharFolha(); }
    });

    // folha do item
    const fi = $('#folha-item');
    fi.addEventListener('change', (e) => {
      if (!edicao) return;
      lerFormItem();
      // rádio obrigatório: ao escolher, avança suave? mantém simples
      atualizarItem();
      if (e.target.type === 'checkbox' && e.target.name !== 'sem') {
        const g = (edicao.item.grupos || []).find((x) => 'g-' + x.id === e.target.name);
        if (g && g.max && (edicao.sel[g.id] || []).length >= g.max && e.target.checked) toast(`Máximo de ${g.max} adicionais`);
      }
    });
    fi.addEventListener('input', (e) => {
      if (e.target.id === 'fi-obs' && edicao) { edicao.obs = e.target.value; atualizarItem(); }
    });
    fi.addEventListener('click', (e) => {
      if (!edicao) return;
      const q = e.target.closest('[data-qtd]');
      if (q) { edicao.qtd = Math.min(20, Math.max(1, edicao.qtd + Number(q.dataset.qtd))); atualizarItem(); }
      if (e.target.closest('#fi-add')) confirmarItem();
    });
    fi.addEventListener('submit', (e) => e.preventDefault());

    // folha da sacola
    const fs = $('#folha-sacola');
    fs.addEventListener('click', (e) => {
      const acao = e.target.closest('[data-acao]');
      if (acao) {
        const uid = acao.closest('[data-uid]').dataset.uid;
        const i = estado.carrinho.findIndex((l) => l.uid === uid);
        if (i < 0) return;
        const l = estado.carrinho[i];
        const a = acao.dataset.acao;
        if (a === 'mais') l.qtd = Math.min(20, l.qtd + 1);
        if (a === 'menos') { if (l.qtd > 1) l.qtd -= 1; else { estado.carrinho.splice(i, 1); toast(`${getItem(l.itemId).nome} removido`); } }
        if (a === 'remover') { estado.carrinho.splice(i, 1); toast(`${getItem(l.itemId).nome} removido`); }
        if (a === 'editar') { abrirItem(l.itemId, l); return; }
        salvar();
        aposMudarCarrinho();
        // mantém o foco num lugar sensato após re-render
        const mesmo = $(`[data-uid="${uid}"] [data-acao="${a}"]`, fs);
        if (mesmo) mesmo.focus({ preventScroll: true });
        else { const f = $('#fs-itens [data-acao]', fs) || $('[data-fechar]', fs); if (f) f.focus({ preventScroll: true }); }
        return;
      }
      if (e.target.closest('#fs-enviar')) enviarPedido();
      if (e.target.closest('#fs-reabrir') && estado.ultimaMensagem) abrirWhats(estado.ultimaMensagem);
      if (e.target.closest('#fs-novo')) {
        estado.carrinho = [];
        estado.enviado = false;
        estado.tentouEnviar = false;
        estado.cliente.troco = '';
        estado.cliente.horario = '';
        estado.cliente.quando = 'agora';
        salvar();
        fecharFolha();
        aposMudarCarrinho();
        toast('Sacola limpa. Bom apetite!');
      }
    });
    const campoParaCliente = { 'f-nome': 'nome', 'f-rua': 'rua', 'f-numero': 'numero', 'f-compl': 'compl', 'f-ref': 'ref', 'f-bairro': 'bairro', 'f-horario': 'horario', 'f-troco': 'troco' };
    fs.addEventListener('input', (e) => {
      const k = campoParaCliente[e.target.id];
      if (!k) return;
      estado.cliente[k] = e.target.value;
      salvar();
      atualizarSacola({ semLinhas: true });
    });
    fs.addEventListener('change', (e) => {
      const t = e.target;
      if (t.name === 'tipo' || t.name === 'quando' || t.name === 'pagamento') estado.cliente[t.name] = t.value;
      else if (t.id === 'f-semtroco') estado.cliente.semTroco = t.checked;
      else if (campoParaCliente[t.id]) estado.cliente[campoParaCliente[t.id]] = t.value;
      else return;
      salvar();
      atualizarSacola({ semLinhas: true });
    });

    // fallback de imagem
    document.addEventListener('error', (e) => {
      const img = e.target;
      if (img && img.tagName === 'IMG' && !img.dataset.fallback) { img.dataset.fallback = '1'; img.src = 'img/prato.svg'; }
    }, true);

    // atualiza status a cada minuto e quando volta para a aba
    setInterval(() => { renderStatus(); if (folhaAberta($('#folha-sacola'))) { renderHorarios(); atualizarSacola({ semLinhas: true }); } }, 60000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) renderStatus(); });
  }

  /* ---------------- Início ---------------- */
  function iniciar() {
    carregar();
    renderCardapio();
    renderStatus();
    renderNaSacola();
    ligarEventos();
    observarSelo();
    spy();
  }
  iniciar();
})();
