/*
  Maré Mansa — vitrine/catálogo com pedido pelo WhatsApp (demonstração).
  HTML/CSS/JS puro. As peças são ilustradas em SVG e mudam de cor de verdade.
*/
'use strict';

// Número de WhatsApp da loja: só dígitos, com DDI e DDD (ex.: '5527999998888').
// Deixe vazio para o WhatsApp abrir e a pessoa escolher o contato (bom para demonstração).
const WHATSAPP_NEGOCIO = '';

const LOJA = {
  nome: 'Maré Mansa',
  instagram: '@maremansa.vv',
  endereco: 'Rua Henrique Moscoso, 1184 — Praia da Costa, Vila Velha/ES',
  mapa: 'Rua Henrique Moscoso, Praia da Costa, Vila Velha - ES',
};

// Valores em centavos para não ter erro de arredondamento.
const CUPONS = {
  BEMVINDA10: { pct: 10, descricao: '10% de boas-vindas' },
};

const ENTREGAS = {
  retirada: { nome: 'Retirar na loja (Praia da Costa)', taxa: 0 },
  local: { nome: 'Entrega local (Vila Velha e Vitória)', taxa: 1200, gratisAcima: 29900 },
  correios: { nome: 'Envio pelos Correios', taxa: null }, // null = a combinar
};

const CATEGORIAS = ['Vestidos', 'Blusas', 'Calças', 'Saias', 'Masculino', 'Acessórios'];
const ORDEM_TAMANHOS = ['PP', 'P', 'M', 'G', 'GG', '36', '38', '40', '42', '44', '46', '48', 'Único'];
const QTD_MAX = 10;

const MEDIDAS = {
  letras: {
    titulo: 'Medidas do corpo, em centímetros',
    cab: ['Tam.', 'Busto', 'Cintura', 'Quadril'],
    linhas: [['PP', '80–84', '62–66', '88–92'], ['P', '85–89', '67–71', '93–97'], ['M', '90–94', '72–76', '98–102'], ['G', '95–100', '77–82', '103–108'], ['GG', '101–106', '83–88', '109–114']],
  },
  numeros: {
    titulo: 'Medidas do corpo, em centímetros',
    cab: ['Tam.', 'Cintura', 'Quadril', 'Coxa'],
    linhas: [['36', '64–67', '90–93', '52'], ['38', '68–71', '94–97', '54'], ['40', '72–75', '98–101', '56'], ['42', '76–79', '102–105', '58'], ['44', '80–84', '106–110', '60'], ['46', '85–89', '111–115', '62']],
  },
  mascLetras: {
    titulo: 'Medidas da peça, em centímetros',
    cab: ['Tam.', 'Tórax', 'Comprimento', 'Ombro'],
    linhas: [['P', '100', '70', '44'], ['M', '106', '72', '46'], ['G', '112', '74', '48'], ['GG', '118', '76', '50']],
  },
  mascNumeros: {
    titulo: 'Medidas do corpo, em centímetros',
    cab: ['Tam.', 'Cintura', 'Quadril', 'Compr.'],
    linhas: [['38', '74–77', '96–99', '47'], ['40', '78–81', '100–103', '48'], ['42', '82–85', '104–107', '49'], ['44', '86–89', '108–111', '50'], ['46', '90–93', '112–115', '51'], ['48', '94–97', '116–119', '52']],
  },
};

// Catálogo, da novidade mais recente para a mais antiga.
const PRODUTOS = [
  {
    id: 'vestido-alca-linho', nome: 'Vestido Midi Alça Fina de Linho', cat: 'Vestidos', forma: 'vestidoAlca',
    preco: 18990, selo: 'novo', medidas: 'letras',
    tamanhos: ['PP', 'P', 'M', 'G', 'GG'], esgotados: ['GG'],
    cores: [{ nome: 'Terracota', hex: '#B5532F' }, { nome: 'Areia', hex: '#D9C3A0' }, { nome: 'Verde-oliva', hex: '#6B7040' }],
    desc: 'Linho com viscose, fresquinho para o calor da orla. Decote reto, alças reguláveis e amarração nas costas. Comprimento midi: 112 cm no M.',
    comp: '55% linho, 45% viscose · lavar à mão',
  },
  {
    id: 'saia-plissada', nome: 'Saia Midi Plissada Acetinada', cat: 'Saias', forma: 'saiaMidi',
    preco: 14990, selo: 'novo', medidas: 'letras',
    tamanhos: ['P', 'M', 'G'], esgotados: [],
    cores: [{ nome: 'Verde-sálvia', hex: '#9DAE93' }, { nome: 'Rosa-chá', hex: '#D9A497' }, { nome: 'Preto', hex: '#232120' }],
    desc: 'Plissado permanente que não desmancha na lavagem, cós com elástico atrás e forro curto. Combina com T-shirt e com camisa de linho.',
    comp: '100% poliéster acetinado · lavar na máquina',
  },
  {
    id: 'pantalona', nome: 'Calça Pantalona de Alfaiataria', cat: 'Calças', forma: 'pantalona',
    preco: 19990, selo: 'novo', medidas: 'numeros',
    tamanhos: ['36', '38', '40', '42', '44', '46'], esgotados: ['36', '46'],
    cores: [{ nome: 'Preto', hex: '#232120' }, { nome: 'Caramelo', hex: '#A8723F' }, { nome: 'Verde-oliva', hex: '#5E6638' }],
    desc: 'Cintura alta, pregas frontais e boca larga que alonga a silhueta. Tecido leve com toque gelado, ótimo para o escritório no verão.',
    comp: '70% viscose, 26% poliéster, 4% elastano',
  },
  {
    id: 'bata-bordada', nome: 'Blusa Bata Bordada à Mão', cat: 'Blusas', forma: 'bata',
    preco: 11990, selo: 'novo', medidas: 'letras',
    tamanhos: ['P', 'M', 'G', 'GG'], esgotados: [],
    cores: [{ nome: 'Off-white', hex: '#F2EBDD' }, { nome: 'Mostarda', hex: '#C9952C' }, { nome: 'Rosa-chá', hex: '#D9A497' }],
    desc: 'Bordado feito à mão por artesãs de Itaúnas no decote. Mangas bufantes com elástico e modelagem soltinha.',
    comp: '100% algodão · lavar à mão, do avesso',
  },
  {
    id: 'camisa-masc-linho', nome: 'Camisa Masculina de Linho Manga Curta', cat: 'Masculino', forma: 'camisaCurta',
    preco: 17990, selo: 'novo', medidas: 'mascLetras',
    tamanhos: ['P', 'M', 'G', 'GG'], esgotados: ['P'],
    cores: [{ nome: 'Branco', hex: '#F5F2EA' }, { nome: 'Azul-céu', hex: '#A9C4D8' }, { nome: 'Areia', hex: '#D9C3A0' }],
    desc: 'Linho puro com bolso no peito e botões de coco. Modelagem reta, fica bonita para dentro ou para fora da bermuda.',
    comp: '100% linho · passar ainda úmida',
  },
  {
    id: 'bolsa-lona', nome: 'Bolsa Sacola de Lona Encerada', cat: 'Acessórios', forma: 'bolsa',
    preco: 8990, selo: 'novo', medidas: null,
    tamanhos: ['Único'], esgotados: [],
    cores: [{ nome: 'Cru', hex: '#E3D6BE' }, { nome: 'Preto', hex: '#232120' }, { nome: 'Terracota', hex: '#B5532F' }],
    desc: 'Cabe a canga, o notebook e a feira. Lona encerada que resiste à água, bolso interno com zíper e etiqueta de couro.',
    comp: '42 × 38 × 14 cm · alça de 60 cm',
  },
  {
    id: 'chemise-listrada', nome: 'Vestido Chemise Listrado', cat: 'Vestidos', forma: 'chemise',
    preco: 21990, precoAntigo: 27490, medidas: 'letras',
    tamanhos: ['P', 'M', 'G', 'GG'], esgotados: ['P'],
    cores: [
      { nome: 'Listra marinho', hex: '#F1ECE2', hex2: '#24344D', padrao: 'listras' },
      { nome: 'Listra ferrugem', hex: '#F1ECE2', hex2: '#A8401F', padrao: 'listras' },
      { nome: 'Off-white', hex: '#EFE8DA' },
    ],
    desc: 'Tricoline de algodão com botões de madrepérola e faixa removível na cintura. Vai do trabalho ao happy hour na orla.',
    comp: '100% algodão · lavar na máquina',
  },
  {
    id: 'camiseta-basica', nome: 'T-shirt Básica de Algodão Peruano', cat: 'Blusas', forma: 'camiseta',
    preco: 6990, medidas: 'letras',
    tamanhos: ['PP', 'P', 'M', 'G', 'GG'], esgotados: ['PP'],
    cores: [{ nome: 'Branco', hex: '#F7F5F0' }, { nome: 'Preto', hex: '#232120' }, { nome: 'Mescla', hex: '#B9B6B0' }, { nome: 'Caramelo', hex: '#B07A45' }],
    desc: 'A básica que não deforma: fio penteado, gola com ribana e caimento reto. Aquela que você compra em todas as cores.',
    comp: '100% algodão peruano · lavar na máquina',
  },
  {
    id: 'vestido-longo-poa', nome: 'Vestido Longo Poá com Fenda', cat: 'Vestidos', forma: 'vestidoLongo',
    preco: 24990, selo: 'ultimas', medidas: 'letras',
    tamanhos: ['P', 'M', 'G'], esgotados: ['G'],
    cores: [
      { nome: 'Preto poá', hex: '#232120', hex2: '#F3ECE1', padrao: 'poa' },
      { nome: 'Vermelho poá', hex: '#A3242B', hex2: '#F3ECE1', padrao: 'poa' },
    ],
    desc: 'Viscose fluida com estampa de poá, fenda lateral e alças finas. Para casamento na praia, aniversário e Réveillon.',
    comp: '100% viscose · lavar à mão',
  },
  {
    id: 'camisa-linho-fem', nome: 'Camisa Oversized de Linho', cat: 'Blusas', forma: 'camisa',
    preco: 15990, precoAntigo: 19990, medidas: 'letras',
    tamanhos: ['P', 'M', 'G'], esgotados: ['G'],
    cores: [{ nome: 'Branco', hex: '#F5F2EA' }, { nome: 'Azul-céu', hex: '#A9C4D8' }, { nome: 'Verde-sálvia', hex: '#A3B09A' }],
    desc: 'Manga longa para dobrar, bolso no peito e comprimento que cobre o quadril. Usa aberta como saída de praia.',
    comp: '100% linho · passar ainda úmida',
  },
  {
    id: 'jeans-reta', nome: 'Calça Jeans Reta Cintura Alta', cat: 'Calças', forma: 'jeans',
    preco: 17990, selo: 'ultimas', medidas: 'numeros',
    tamanhos: ['36', '38', '40', '42', '44'], esgotados: ['38', '44'],
    cores: [{ nome: 'Jeans claro', hex: '#8FA9C4' }, { nome: 'Jeans escuro', hex: '#2F4563' }],
    desc: 'Jeans com 2% de elastano, que veste firme sem apertar. Barra reta com 98 cm de comprimento: dá para fazer a barra aqui na loja.',
    comp: '98% algodão, 2% elastano',
  },
  {
    id: 'saia-envelope', nome: 'Saia Curta Envelope de Linho', cat: 'Saias', forma: 'saiaCurta',
    preco: 11190, precoAntigo: 13990, medidas: 'numeros',
    tamanhos: ['36', '38', '40', '42', '44'], esgotados: ['44'],
    cores: [{ nome: 'Areia', hex: '#D9C3A0' }, { nome: 'Terracota', hex: '#B5532F' }],
    desc: 'Transpassada com amarração lateral e shortinho por baixo. Do almoço de domingo ao passeio no Convento.',
    comp: '55% linho, 45% viscose',
  },
  {
    id: 'bermuda-chino', nome: 'Bermuda Chino com Elastano', cat: 'Masculino', forma: 'bermuda',
    preco: 12990, medidas: 'mascNumeros',
    tamanhos: ['38', '40', '42', '44', '46', '48'], esgotados: ['48'],
    cores: [{ nome: 'Caqui', hex: '#B9A27A' }, { nome: 'Azul-marinho', hex: '#24344D' }, { nome: 'Verde-oliva', hex: '#5E6638' }],
    desc: 'Sarja leve com elastano, bolsos faca e barra dobrada. Comprimento acima do joelho, do jeito que se usa agora.',
    comp: '97% algodão, 3% elastano',
  },
  {
    id: 'camiseta-masc', nome: 'Camiseta Masculina Gola Careca', cat: 'Masculino', forma: 'camisetaMasc',
    preco: 7990, precoAntigo: 9990, medidas: 'mascLetras',
    tamanhos: ['P', 'M', 'G', 'GG'], esgotados: ['GG'],
    cores: [{ nome: 'Off-white', hex: '#EFE8DA' }, { nome: 'Preto', hex: '#232120' }, { nome: 'Verde-musgo', hex: '#4E5B3A' }],
    desc: 'Malha encorpada de 180 g, que não fica transparente. Ombro levemente caído e modelagem reta.',
    comp: '100% algodão · lavar na máquina',
  },
  {
    id: 'bucket-linho', nome: 'Chapéu Bucket de Linho', cat: 'Acessórios', forma: 'bucket',
    preco: 5990, selo: 'ultimas', medidas: null,
    tamanhos: ['Único'], esgotados: [],
    cores: [{ nome: 'Areia', hex: '#D9C3A0' }, { nome: 'Verde-oliva', hex: '#6B7040' }],
    desc: 'Aba média com pespontos e forro de algodão. Dobra na bolsa sem amassar demais. Circunferência de 57 cm.',
    comp: '100% linho, forro 100% algodão',
  },
  {
    id: 'lenco-seda', nome: 'Lenço Estampado de Seda', cat: 'Acessórios', forma: 'lenco',
    preco: 4990, medidas: null,
    tamanhos: ['Único'], esgotados: [],
    cores: [
      { nome: 'Mar', hex: '#2E5A6B', hex2: '#E9B8A8' },
      { nome: 'Ferrugem', hex: '#A8401F', hex2: '#F0D9A8' },
      { nome: 'Oliva', hex: '#5E6638', hex2: '#F3ECE1' },
    ],
    desc: 'Vai no cabelo, no pescoço ou na alça da bolsa. Estampa exclusiva desenhada aqui na loja. 70 × 70 cm.',
    comp: '100% seda · lavar à mão',
  },
];

const PRODUTOS_POR_ID = Object.fromEntries(PRODUTOS.map((p, i) => [p.id, Object.assign(p, { ordem: i })]));

/* ---------------------------------------------------------------- */
/* Utilidades puras (testáveis em node)                              */
/* ---------------------------------------------------------------- */

function formatarPreco(centavos) {
  const negativo = centavos < 0;
  const v = Math.abs(Math.round(centavos));
  const reais = Math.floor(v / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const cents = String(v % 100).padStart(2, '0');
  return (negativo ? '- ' : '') + 'R$ ' + reais + ',' + cents;
}

function descontoPct(p) {
  return p.precoAntigo ? Math.round((1 - p.preco / p.precoAntigo) * 100) : 0;
}

function tamanhoDisponivel(p, tam) {
  return p.tamanhos.includes(tam) && !p.esgotados.includes(tam);
}

function filtrarProdutos(lista, f, desejos) {
  const out = lista.filter((p) => {
    if (f.cat && f.cat !== 'Todas' && p.cat !== f.cat) return false;
    if (f.tam && !tamanhoDisponivel(p, f.tam)) return false;
    if (f.preco === 'ate100' && p.preco > 10000) return false;
    if (f.preco === '100a180' && (p.preco <= 10000 || p.preco > 18000)) return false;
    if (f.preco === 'acima180' && p.preco <= 18000) return false;
    if (f.favoritos && !(desejos && desejos.has(p.id))) return false;
    return true;
  });
  const ordem = f.ordem || 'novidades';
  out.sort((a, b) => {
    if (ordem === 'menor') return a.preco - b.preco || a.ordem - b.ordem;
    if (ordem === 'maior') return b.preco - a.preco || a.ordem - b.ordem;
    return a.ordem - b.ordem;
  });
  return out;
}

function chaveItem(it) {
  return it.id + '|' + it.cor + '|' + it.tam;
}

// Retorna uma NOVA lista (não altera a original).
function adicionarItem(itens, novo) {
  const p = PRODUTOS_POR_ID[novo.id];
  if (!p || !tamanhoDisponivel(p, novo.tam) || !p.cores.some((c) => c.nome === novo.cor)) return itens.slice();
  const qtd = Math.max(1, Math.min(QTD_MAX, Math.floor(novo.qtd || 1)));
  const k = chaveItem(novo);
  const existe = itens.find((i) => chaveItem(i) === k);
  if (existe) {
    return itens.map((i) => (chaveItem(i) === k ? Object.assign({}, i, { qtd: Math.min(QTD_MAX, i.qtd + qtd) }) : i));
  }
  return itens.concat([{ id: novo.id, cor: novo.cor, tam: novo.tam, qtd }]);
}

function alterarQtd(itens, chave, qtd) {
  if (qtd <= 0) return removerItem(itens, chave);
  return itens.map((i) => (chaveItem(i) === chave ? Object.assign({}, i, { qtd: Math.min(QTD_MAX, Math.floor(qtd)) }) : i));
}

function removerItem(itens, chave) {
  return itens.filter((i) => chaveItem(i) !== chave);
}

function normalizarCupom(txt) {
  return String(txt || '').trim().toUpperCase().replace(/\s+/g, '');
}

function calcularTotais(itens, cupomCodigo, entregaId) {
  const linhas = [];
  for (const it of itens) {
    const p = PRODUTOS_POR_ID[it.id];
    if (!p) continue;
    linhas.push({ item: it, produto: p, unit: p.preco, total: p.preco * it.qtd });
  }
  const subtotal = linhas.reduce((s, l) => s + l.total, 0);
  const pecas = linhas.reduce((s, l) => s + l.item.qtd, 0);
  const cupom = CUPONS[normalizarCupom(cupomCodigo)] ? normalizarCupom(cupomCodigo) : '';
  const desconto = cupom ? Math.round((subtotal * CUPONS[cupom].pct) / 100) : 0;
  const base = subtotal - desconto;
  const entId = ENTREGAS[entregaId] ? entregaId : 'retirada';
  const ent = ENTREGAS[entId];
  let frete = ent.taxa;
  if (frete && ent.gratisAcima && base >= ent.gratisAcima) frete = 0;
  const freteACombinar = frete === null;
  const total = base + (frete || 0);
  return { linhas, pecas, subtotal, cupom, desconto, entrega: entId, frete, freteACombinar, total };
}

function montarMensagemPedido(itens, dados) {
  const t = calcularTotais(itens, dados.cupom, dados.entrega);
  const L = [];
  L.push(`Olá, ${LOJA.nome}! Montei minha sacola pelo catálogo e quero finalizar o pedido:`);
  L.push('');
  t.linhas.forEach((l, i) => {
    L.push(`*${i + 1}. ${l.produto.nome}*`);
    L.push(`   Cor: ${l.item.cor} | Tam.: ${l.item.tam} | Qtd.: ${l.item.qtd}`);
    L.push(`   ${l.item.qtd} x ${formatarPreco(l.unit)} = ${formatarPreco(l.total)}`);
    L.push('');
  });
  L.push(`Subtotal (${t.pecas} ${t.pecas === 1 ? 'peça' : 'peças'}): ${formatarPreco(t.subtotal)}`);
  if (t.cupom) L.push(`Cupom ${t.cupom} (-${CUPONS[t.cupom].pct}%): ${formatarPreco(-t.desconto)}`);
  const ent = ENTREGAS[t.entrega];
  const freteTxt = t.freteACombinar ? 'frete a combinar' : t.frete === 0 ? 'grátis' : formatarPreco(t.frete);
  L.push(`Entrega: ${ent.nome} — ${freteTxt}`);
  L.push(`*Total: ${formatarPreco(t.total)}${t.freteACombinar ? ' + frete' : ''}*`);
  L.push('');
  L.push(`Nome: ${String(dados.nome || '').trim()}`);
  if (t.entrega !== 'retirada' && dados.endereco && dados.endereco.trim()) L.push(`Endereço: ${dados.endereco.trim()}`);
  if (dados.pagamento) L.push(`Pagamento: ${dados.pagamento}`);
  if (dados.obs && dados.obs.trim()) L.push(`Observações: ${dados.obs.trim()}`);
  L.push('');
  L.push('Pode confirmar a disponibilidade? Fico no aguardo!');
  return L.join('\n');
}

const DUVIDAS = [
  'Qual tamanho fica melhor em mim?',
  'Tem em outra cor ou tamanho?',
  'Pode separar para eu provar na loja?',
  'Como é o tecido e o caimento?',
];

function montarMensagemProvador(p, d) {
  const L = [];
  L.push(`Olá, ${LOJA.nome}! Vim pelo Provador por WhatsApp e tenho uma dúvida sobre a peça *${p.nome}* (${formatarPreco(p.preco)}).`);
  if (d.duvida) L.push(d.duvida);
  const sobre = [];
  if (d.altura && d.altura.trim()) sobre.push(`tenho ${d.altura.trim()} de altura`);
  if (d.usa) sobre.push(`costumo usar ${d.usa}`);
  if (sobre.length) L.push('Sobre mim: ' + sobre.join(' e ') + '.');
  if (d.extra && d.extra.trim()) L.push(d.extra.trim());
  return L.join('\n');
}

function linkWhatsApp(texto) {
  const numero = String(WHATSAPP_NEGOCIO || '').replace(/\D/g, '');
  return numero
    ? `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
    : `https://wa.me/?text=${encodeURIComponent(texto)}`;
}

/* ---------------------------------------------------------------- */
/* Ilustrações SVG das peças                                         */
/* ---------------------------------------------------------------- */

function hexParaRgb(hex) {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
function rgbParaHex(rgb) {
  return '#' + rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}
function misturar(hexA, hexB, t) {
  const a = hexParaRgb(hexA), b = hexParaRgb(hexB);
  return rgbParaHex(a.map((v, i) => v + (b[i] - v) * t));
}
function luminancia(hex) {
  const [r, g, b] = hexParaRgb(hex).map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function corDeFundo(cor) {
  const base = cor.padrao ? cor.hex2 : cor.hex;
  const lum = luminancia(base);
  // Peças claras ganham fundo mais escuro para não "sumirem" no papel.
  if (lum > 0.55) return misturar(base, '#C9B79C', 0.62);
  return misturar(base, '#F3ECE1', lum < 0.05 ? 0.78 : 0.72);
}

let _uid = 0;

const CABIDE =
  '<path d="M100 25v-5c0-3 6-4 6-9a6 6 0 0 0-12 0" fill="none" stroke="#7d7770" stroke-width="2.4" stroke-linecap="round"/>' +
  '<path d="M63 41 100 24l37 17" fill="none" stroke="#9a7650" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>';
const PRESILHA =
  '<path d="M100 20v-5c0-3 6-4 6-9a6 6 0 0 0-12 0" fill="none" stroke="#7d7770" stroke-width="2.4" stroke-linecap="round"/>' +
  '<path d="M58 22h84" stroke="#7d7770" stroke-width="4" stroke-linecap="round"/>' +
  '<rect x="70" y="20" width="8" height="15" rx="2" fill="#7d7770"/><rect x="122" y="20" width="8" height="15" rx="2" fill="#7d7770"/>';

const FORMAS = {
  vestidoAlca(c, o) {
    const h = o.longo ? 228 : 212;
    const xe = o.longo ? 52 : 44, xd = o.longo ? 148 : 156;
    return CABIDE +
      `<path d="M83 32 L79 66 M117 32 L121 66" stroke="${c.S}" stroke-width="3" stroke-linecap="round"/>` +
      `<path d="M76 64 Q100 76 124 64 L128 106 L${xd} ${h} Q100 ${h + 8} ${xe} ${h} L72 106 Z" fill="${c.F}"/>` +
      `<path d="M76 64 Q100 76 124 64" fill="none" stroke="${c.S}" stroke-width="2.5"/>` +
      `<path d="M72 106 Q100 113 128 106" fill="none" stroke="${c.D}" stroke-width="2"/>` +
      `<path d="M91 114 L80 ${h} M109 114 L120 ${h} M100 115 V${h + 3}" stroke="${c.D}" stroke-width="1.5" opacity=".35"/>` +
      (o.longo ? `<path d="M134 ${h - 1} L126 168" stroke="${c.D}" stroke-width="2" opacity=".7"/>` : '');
  },
  vestidoLongo(c) { return FORMAS.vestidoAlca(c, { longo: true }); },
  chemise(c) {
    let botoes = '';
    [68, 86, 134, 156, 178, 198].forEach((y) => { botoes += `<circle cx="100" cy="${y}" r="2.2" fill="${c.B}"/>`; });
    return CABIDE +
      `<path d="M70 46 L88 40 L100 54 L112 40 L130 46 L150 90 L136 97 L128 80 L130 112 L144 214 Q100 222 56 214 L70 112 L72 80 L64 97 L50 90 Z" fill="${c.F}"/>` +
      `<path d="M136 97 L150 90 M64 97 L50 90" stroke="${c.D}" stroke-width="2.5"/>` +
      `<path d="M100 56 V216" stroke="${c.D}" stroke-width="1.4" opacity=".6"/>` + botoes +
      `<path d="M88 40 L100 58 L112 40 L108 36 L100 48 L92 36 Z" fill="${c.S}"/>` +
      `<path d="M70 108 Q100 114 130 108 L130 119 Q100 125 70 119 Z" fill="${c.S}"/>` +
      `<path d="M104 120 l-9 26 M104 120 l8 24" stroke="${c.S}" stroke-width="4" stroke-linecap="round"/>`;
  },
  bata(c) {
    let pontos = '';
    for (let i = 1; i < 10; i++) {
      const t = i / 10;
      const x = (1 - t) * (1 - t) * 76 + 2 * (1 - t) * t * 100 + t * t * 124;
      const y = (1 - t) * (1 - t) * 48 + 2 * (1 - t) * t * 64 + t * t * 48 + 7;
      pontos += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="${c.E}"/>`;
      if (i % 2) pontos += `<circle cx="${x.toFixed(1)}" cy="${(y + 6).toFixed(1)}" r="1.3" fill="${c.E}"/>`;
    }
    return CABIDE +
      `<path d="M76 48 Q100 64 124 48 L136 52 Q160 58 166 84 Q154 96 140 92 L138 88 L142 154 Q100 162 58 154 L62 88 L60 92 Q46 96 34 84 Q40 58 64 52 Z" fill="${c.F}"/>` +
      `<path d="M76 48 Q100 64 124 48" fill="none" stroke="${c.S}" stroke-width="2.5"/>` + pontos +
      `<path d="M141 86 Q153 90 162 79 M59 86 Q47 90 38 79" fill="none" stroke="${c.D}" stroke-width="1.6" stroke-dasharray="2 3"/>` +
      `<path d="M60 146 Q100 154 140 146" fill="none" stroke="${c.D}" stroke-width="1.4" opacity=".5"/>`;
  },
  camiseta(c) {
    return CABIDE +
      `<path d="M78 42 Q100 56 122 42 L148 52 L166 86 L146 96 L136 78 L138 166 Q100 172 62 166 L64 78 L54 96 L34 86 L52 52 Z" fill="${c.F}"/>` +
      `<path d="M78 42 Q100 56 122 42" fill="none" stroke="${c.S}" stroke-width="4"/>` +
      `<path d="M145 91 L162 82 M55 91 L38 82 M63 159 Q100 165 137 159" fill="none" stroke="${c.D}" stroke-width="1.4" stroke-dasharray="3 3"/>`;
  },
  camisetaMasc(c) {
    return CABIDE +
      `<path d="M77 42 Q100 55 123 42 L152 50 L172 90 L150 100 L140 80 L142 178 Q100 182 58 178 L60 80 L50 100 L28 90 L48 50 Z" fill="${c.F}"/>` +
      `<path d="M77 42 Q100 55 123 42" fill="none" stroke="${c.S}" stroke-width="4.5"/>` +
      `<path d="M149 95 L168 86 M51 95 L32 86 M59 171 Q100 175 141 171" fill="none" stroke="${c.D}" stroke-width="1.4" stroke-dasharray="3 3"/>`;
  },
  camisa(c) {
    let botoes = '';
    [70, 92, 114, 136, 158].forEach((y) => { botoes += `<circle cx="100" cy="${y}" r="2.2" fill="${c.B}"/>`; });
    return CABIDE +
      `<path d="M72 44 L88 38 L100 52 L112 38 L128 44 L150 74 L162 166 L144 170 L134 96 L138 178 Q100 184 62 178 L66 96 L56 170 L38 166 L50 74 Z" fill="${c.F}"/>` +
      `<path d="M143 158 L161 154 M57 158 L39 154" stroke="${c.D}" stroke-width="2"/>` +
      `<path d="M134 96 L131 76 M66 96 L69 76" stroke="${c.D}" stroke-width="1.3" opacity=".5"/>` +
      `<path d="M100 54 V180" stroke="${c.D}" stroke-width="1.4" opacity=".6"/>` + botoes +
      `<path d="M108 76 h18 v17 q-9 4 -18 0 Z" fill="none" stroke="${c.D}" stroke-width="1.5"/>` +
      `<path d="M88 38 L100 56 L112 38 L108 34 L100 46 L92 34 Z" fill="${c.S}"/>`;
  },
  camisaCurta(c) {
    let botoes = '';
    [70, 94, 118, 142, 164].forEach((y) => { botoes += `<circle cx="100" cy="${y}" r="2.3" fill="${c.B}"/>`; });
    return CABIDE +
      `<path d="M70 44 L88 38 L100 52 L112 38 L130 44 L158 96 L138 104 L132 90 L136 180 Q100 186 64 180 L68 90 L62 104 L42 96 Z" fill="${c.F}"/>` +
      `<path d="M139 100 L156 92 M61 100 L44 92" stroke="${c.D}" stroke-width="2"/>` +
      `<path d="M100 54 V182" stroke="${c.D}" stroke-width="1.4" opacity=".6"/>` + botoes +
      `<path d="M74 76 h18 v17 q-9 4 -18 0 Z" fill="none" stroke="${c.D}" stroke-width="1.5"/>` +
      `<path d="M88 38 L100 56 L112 38 L108 34 L100 46 L92 34 Z" fill="${c.S}"/>`;
  },
  pantalona(c) {
    return `<path d="M66 30 L134 30 L138 46 L164 228 L113 228 L100 100 L87 228 L36 228 L62 46 Z" fill="${c.F}"/>` +
      `<path d="M66 30 L134 30 L135 42 L65 42 Z" fill="${c.S}"/>` +
      `<path d="M82 44 L64 226 M118 44 L136 226" stroke="${c.D}" stroke-width="1.5" opacity=".4"/>` +
      `<path d="M89 42 L91 70 M111 42 L109 70 M100 42 V92" stroke="${c.D}" stroke-width="1.5" opacity=".7"/>` +
      `<circle cx="100" cy="36" r="2.4" fill="${c.B}"/>` + PRESILHA;
  },
  jeans(c) {
    const pesponto = '#D9A441';
    return `<path d="M68 30 L132 30 L136 46 L143 228 L108 228 L100 102 L92 228 L57 228 L64 46 Z" fill="${c.F}"/>` +
      `<path d="M68 30 L132 30 L133 41 L67 41 Z" fill="${c.S}"/>` +
      `<path d="M68 49 Q84 50 88 66 M132 49 Q116 50 112 66 M100 41 V80 Q100 88 93 90 M58 219 H92 M108 219 H142" fill="none" stroke="${pesponto}" stroke-width="1.4" stroke-dasharray="3 2.5"/>` +
      `<path d="M80 120 L74 200 M120 120 L126 200" stroke="${c.L}" stroke-width="6" opacity=".25" stroke-linecap="round"/>` +
      `<circle cx="100" cy="35.5" r="2.6" fill="#C8A15A"/>` + PRESILHA;
  },
  saiaMidi(c) {
    let pregas = '';
    for (let i = 1; i < 11; i++) {
      const x1 = 70 + i * 5.4, x2 = 46 + i * 9.8;
      pregas += `M${x1.toFixed(1)} 44 L${x2.toFixed(1)} 201 `;
    }
    return `<path d="M72 30 L128 30 L131 44 L156 198 Q100 208 44 198 L69 44 Z" fill="${c.F}"/>` +
      `<path d="${pregas}" stroke="${c.D}" stroke-width="1.3" opacity=".45"/>` +
      `<path d="M72 30 L128 30 L130 42 L70 42 Z" fill="${c.S}"/>` + PRESILHA;
  },
  saiaCurta(c) {
    return `<path d="M72 30 L128 30 L131 44 L148 128 Q100 137 52 128 L69 44 Z" fill="${c.F}"/>` +
      `<path d="M72 30 L128 30 L130 42 L70 42 Z" fill="${c.S}"/>` +
      `<path d="M126 44 Q112 92 90 133" fill="none" stroke="${c.D}" stroke-width="2"/>` +
      `<path d="M130 48 q14 8 10 30 M130 48 q18 -1 22 18" fill="none" stroke="${c.S}" stroke-width="3.5" stroke-linecap="round"/>` +
      `<circle cx="130" cy="48" r="4" fill="${c.S}"/>` + PRESILHA;
  },
  bermuda(c) {
    return `<path d="M66 30 L134 30 L138 46 L150 140 L108 144 L100 94 L92 144 L50 140 L62 46 Z" fill="${c.F}"/>` +
      `<path d="M66 30 L134 30 L135 42 L65 42 Z" fill="${c.S}"/>` +
      `<path d="M51 130 L93 134 M107 134 L149 130" stroke="${c.D}" stroke-width="2.2"/>` +
      `<path d="M70 44 L64 72 M130 44 L136 72 M100 42 V84" stroke="${c.D}" stroke-width="1.5" opacity=".7"/>` +
      `<circle cx="100" cy="36" r="2.4" fill="${c.B}"/>` + PRESILHA;
  },
  bolsa(c) {
    return `<ellipse cx="100" cy="224" rx="62" ry="5" fill="#1E1B18" opacity=".08"/>` +
      `<path d="M74 106 Q72 44 100 44 Q128 44 126 106" fill="none" stroke="${c.S}" stroke-width="7" stroke-linecap="round"/>` +
      `<path d="M48 100 L152 100 L162 214 Q100 222 38 214 Z" fill="${c.F}"/>` +
      `<path d="M48 100 L152 100 L153 113 L47 113 Z" fill="${c.S}" opacity=".7"/>` +
      `<path d="M47 120 H153" stroke="${c.D}" stroke-width="1.4" stroke-dasharray="3 3"/>` +
      `<rect x="86" y="146" width="28" height="18" rx="2" fill="#8B5A3C"/>` +
      `<path d="M92 155 h16" stroke="#E3C9A8" stroke-width="1.4"/>`;
  },
  bucket(c) {
    return '<g transform="translate(0 18)">' +
      `<ellipse cx="100" cy="176" rx="64" ry="5" fill="#1E1B18" opacity=".08"/>` +
      `<path d="M66 118 L72 70 Q100 54 128 70 L134 118 Z" fill="${c.F}"/>` +
      `<path d="M80 74 Q100 63 120 74 M76 92 Q100 84 124 92" fill="none" stroke="${c.D}" stroke-width="1.3" stroke-dasharray="3 3"/>` +
      `<path d="M68 104 L132 104 L134 118 L66 118 Z" fill="${c.S}"/>` +
      `<path d="M66 116 L134 116 L168 150 Q100 172 32 150 Z" fill="${c.F}"/>` +
      `<path d="M66 116 L134 116 L168 150 Q100 172 32 150 Z" fill="${c.S}" opacity=".18"/>` +
      `<path d="M48 150 Q100 166 152 150 M58 140 Q100 154 142 140" fill="none" stroke="${c.D}" stroke-width="1.3" stroke-dasharray="3 3"/>` +
      '</g>';
  },
  lenco(c) {
    const m = c.M;
    let petalas = '';
    for (let i = 0; i < 8; i++) petalas += `<ellipse cx="100" cy="98" rx="6" ry="14" fill="${m}" transform="rotate(${i * 45} 100 120)"/>`;
    return `<ellipse cx="100" cy="222" rx="60" ry="5" fill="#1E1B18" opacity=".08"/>` +
      '<g transform="rotate(-6 100 120)">' +
      `<rect x="44" y="64" width="112" height="112" rx="3" transform="rotate(45 100 120)" fill="${c.F}"/>` +
      `<rect x="55" y="75" width="90" height="90" transform="rotate(45 100 120)" fill="none" stroke="${m}" stroke-width="4"/>` +
      `<rect x="61" y="81" width="78" height="78" transform="rotate(45 100 120)" fill="none" stroke="${m}" stroke-width="1.2" stroke-dasharray="2 4"/>` +
      petalas + `<circle cx="100" cy="120" r="8" fill="${c.F}"/><circle cx="100" cy="120" r="4" fill="${m}"/>` +
      `<circle cx="100" cy="58" r="3" fill="${m}"/><circle cx="100" cy="182" r="3" fill="${m}"/><circle cx="38" cy="120" r="3" fill="${m}"/><circle cx="162" cy="120" r="3" fill="${m}"/>` +
      '</g>';
  },
};

function paletaDaCor(cor, pid) {
  const base = cor.hex;
  const escura = luminancia(base) < 0.06;
  const S = escura ? misturar(base, '#ffffff', 0.18) : misturar(base, '#000000', 0.16);
  const D = escura ? misturar(base, '#ffffff', 0.32) : misturar(base, '#000000', 0.34);
  const L = misturar(base, '#ffffff', 0.5);
  const B = escura ? misturar(base, '#ffffff', 0.55) : misturar(base, '#3a2a20', 0.45);
  const E = luminancia(base) > 0.6 ? '#A8401F' : misturar(base, '#ffffff', 0.75);
  const F = cor.padrao ? `url(#${pid})` : base;
  return { F, S, D, L, B, E, M: cor.hex2 || L };
}

function definicaoPadrao(cor, pid) {
  if (cor.padrao === 'listras') {
    return `<pattern id="${pid}" width="11" height="11" patternUnits="userSpaceOnUse"><rect width="11" height="11" fill="${cor.hex}"/><rect width="4" height="11" fill="${cor.hex2}"/></pattern>`;
  }
  if (cor.padrao === 'poa') {
    return `<pattern id="${pid}" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="${cor.hex}"/><circle cx="4" cy="4" r="2.3" fill="${cor.hex2}"/><circle cx="12" cy="12" r="2.3" fill="${cor.hex2}"/></pattern>`;
  }
  return '';
}

function desenharPeca(p, corIdx) {
  const cor = p.cores[corIdx] || p.cores[0];
  const pid = 'pd' + (++_uid);
  const c = paletaDaCor(cor, pid);
  const corpo = (FORMAS[p.forma] || FORMAS.camiseta)(c, {});
  return `<svg viewBox="0 0 200 240" role="img" aria-label="${escaparHtml(p.nome)}, cor ${escaparHtml(cor.nome)}" focusable="false"><defs>${definicaoPadrao(cor, pid)}</defs>${corpo}</svg>`;
}

function escaparHtml(s) {
  return String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
}

/* ---------------------------------------------------------------- */
/* Interface (só roda no navegador)                                  */
/* ---------------------------------------------------------------- */

function iniciarLoja() {
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));

  const CHAVES = { sacola: 'maremansa:sacola', desejos: 'maremansa:desejos', checkout: 'maremansa:checkout' };
  const ler = (k, padrao) => {
    try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? padrao : v; } catch (e) { return padrao; }
  };
  const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* modo privado */ } };

  const reduzMovimento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Altura do topo fixo, para a barra de filtros grudar logo abaixo dele.
  const topo = $('#topo');
  const ajustarTopo = () => document.documentElement.style.setProperty('--topo', topo.offsetHeight + 'px');
  ajustarTopo();
  window.addEventListener('resize', ajustarTopo);

  const estado = {
    sacola: ler(CHAVES.sacola, []).filter((i) => i && PRODUTOS_POR_ID[i.id] && i.qtd > 0),
    desejos: new Set(ler(CHAVES.desejos, []).filter((id) => PRODUTOS_POR_ID[id])),
    checkout: Object.assign({ cupom: '', entrega: 'retirada', nome: '', endereco: '', pagamento: 'Pix', obs: '' }, ler(CHAVES.checkout, {})),
    filtros: { cat: 'Todas', tam: '', preco: '', ordem: 'novidades', favoritos: false },
    corCard: {},
    modal: null, // { id, cor, tam, qtd }
  };

  const salvarSacola = () => gravar(CHAVES.sacola, estado.sacola);
  const salvarDesejos = () => gravar(CHAVES.desejos, Array.from(estado.desejos));
  const salvarCheckout = () => gravar(CHAVES.checkout, estado.checkout);

  /* ---------- Toasts ---------- */
  const toasts = $('#toasts');
  function toast(msg, acao) {
    const aberto = $$('dialog[open]').pop();
    (aberto || document.body).appendChild(toasts);
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<span>${escaparHtml(msg)}</span>`;
    if (acao) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = acao.rotulo;
      b.addEventListener('click', () => { el.remove(); acao.fn(); });
      el.appendChild(b);
    }
    toasts.appendChild(el);
    setTimeout(() => el.classList.add('sai'), 3200);
    setTimeout(() => el.remove(), 3600);
  }

  function abrirWhatsApp(texto) {
    const url = linkWhatsApp(texto);
    const w = window.open(url, '_blank', 'noopener');
    if (!w) window.location.href = url;
  }

  /* ---------- Figuras estáticas (capa) ---------- */
  $$('[data-fig]').forEach((el) => {
    const [id, idx] = el.getAttribute('data-fig').split(':');
    const p = PRODUTOS_POR_ID[id];
    if (p) el.innerHTML = desenharPeca(p, Number(idx) || 0);
  });
  const qtdCapa = $('.capa-selo-num');
  if (qtdCapa) qtdCapa.textContent = String(PRODUTOS.length);

  /* ---------- Filtros ---------- */
  const catsEl = $('#filtro-cats');
  catsEl.innerHTML = ['Todas'].concat(CATEGORIAS).map((c) =>
    `<button type="button" class="chip" data-cat="${c}" aria-pressed="${c === 'Todas'}">${c}</button>`).join('') +
    `<button type="button" class="chip chip-fav" data-fav aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 7 4.5c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.6 0 5.6 3.5 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>Favoritos</button>`;

  const tamSel = $('#filtro-tam');
  const todosTams = ORDEM_TAMANHOS.filter((t) => PRODUTOS.some((p) => p.tamanhos.includes(t)));
  tamSel.insertAdjacentHTML('beforeend', todosTams.map((t) => `<option value="${t}">${t}</option>`).join(''));

  catsEl.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.hasAttribute('data-fav')) {
      estado.filtros.favoritos = !estado.filtros.favoritos;
    } else {
      estado.filtros.cat = b.getAttribute('data-cat');
    }
    renderCatalogo();
  });
  tamSel.addEventListener('change', () => { estado.filtros.tam = tamSel.value; renderCatalogo(); });
  $('#filtro-preco').addEventListener('change', (e) => { estado.filtros.preco = e.target.value; renderCatalogo(); });
  $('#filtro-ordem').addEventListener('change', (e) => { estado.filtros.ordem = e.target.value; renderCatalogo(); });
  $('#limpar-filtros').addEventListener('click', () => {
    estado.filtros = { cat: 'Todas', tam: '', preco: '', ordem: 'novidades', favoritos: false };
    tamSel.value = ''; $('#filtro-preco').value = ''; $('#filtro-ordem').value = 'novidades';
    renderCatalogo();
  });

  /* ---------- Catálogo ---------- */
  const grade = $('#grade');
  const iconeCoracao = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 7 4.5c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.6 0 5.6 3.5 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>';

  function selosHtml(p) {
    const s = [];
    if (p.selo === 'novo') s.push('<li class="selo selo-novo">Novo</li>');
    if (p.selo === 'ultimas') s.push('<li class="selo selo-ultimas">Últimas peças</li>');
    if (p.precoAntigo) s.push(`<li class="selo selo-off">-${descontoPct(p)}%</li>`);
    return s.length ? `<ul class="selos">${s.join('')}</ul>` : '';
  }
  function precoHtml(p) {
    return p.precoAntigo
      ? `<span class="preco-antigo"><span class="visualmente-oculto">De </span><s>${formatarPreco(p.precoAntigo)}</s></span> <strong class="preco-atual"><span class="visualmente-oculto">por </span>${formatarPreco(p.preco)}</strong>`
      : `<strong class="preco-atual">${formatarPreco(p.preco)}</strong>`;
  }
  function cardHtml(p) {
    const ci = estado.corCard[p.id] || 0;
    const cor = p.cores[ci];
    const fav = estado.desejos.has(p.id);
    const dots = p.cores.map((c, i) =>
      `<button type="button" class="dot${i === ci ? ' ativo' : ''}" data-dot="${i}" style="--c:${c.hex};--c2:${c.hex2 || c.hex}" aria-label="Ver na cor ${escaparHtml(c.nome)}" aria-pressed="${i === ci}"></button>`).join('');
    return `<article class="card" data-id="${p.id}">
      <div class="card-fig" style="--fundo:${corDeFundo(cor)}">
        ${desenharPeca(p, ci)}
        ${selosHtml(p)}
        <button type="button" class="coracao${fav ? ' ativo' : ''}" data-fav-id="${p.id}" aria-pressed="${fav}" aria-label="Favoritar ${escaparHtml(p.nome)}">${iconeCoracao}</button>
      </div>
      <div class="card-info">
        <p class="card-cat">${p.cat}</p>
        <h3 class="card-nome"><button type="button" class="card-abrir" data-abrir="${p.id}">${escaparHtml(p.nome)}</button></h3>
        <p class="card-preco">${precoHtml(p)}</p>
        <div class="dots" role="group" aria-label="Cores disponíveis">${dots}<span class="dot-nome">${escaparHtml(cor.nome)}</span></div>
      </div>
    </article>`;
  }

  function renderCatalogo() {
    const f = estado.filtros;
    $$('.chip', catsEl).forEach((b) => {
      if (b.hasAttribute('data-fav')) b.setAttribute('aria-pressed', String(f.favoritos));
      else b.setAttribute('aria-pressed', String(b.getAttribute('data-cat') === f.cat));
    });
    $('#btn-favoritos').setAttribute('aria-pressed', String(f.favoritos));
    const lista = filtrarProdutos(PRODUTOS, f, estado.desejos);
    if (!lista.length) {
      grade.innerHTML = f.favoritos && !estado.desejos.size
        ? '<div class="vazio"><p class="vazio-tit">Nenhum favorito ainda.</p><p>Toque no coração das peças que você gostou para guardar aqui. Elas ficam salvas neste celular.</p></div>'
        : '<div class="vazio"><p class="vazio-tit">Nenhuma peça com esses filtros.</p><p>Tente outro tamanho ou faixa de preço, ou pergunte no Provador: às vezes chega reposição na semana.</p></div>';
    } else {
      grade.innerHTML = lista.map(cardHtml).join('');
    }
    $('#resultado-qtd').textContent = lista.length === 1 ? '1 peça' : `${lista.length} peças`;
    const filtrando = f.cat !== 'Todas' || f.tam || f.preco || f.favoritos || f.ordem !== 'novidades';
    $('#limpar-filtros').hidden = !filtrando;
  }

  grade.addEventListener('click', (e) => {
    const fav = e.target.closest('[data-fav-id]');
    if (fav) { alternarDesejo(fav.getAttribute('data-fav-id')); return; }
    const dot = e.target.closest('[data-dot]');
    if (dot) {
      const card = dot.closest('.card');
      const id = card.getAttribute('data-id');
      estado.corCard[id] = Number(dot.getAttribute('data-dot'));
      const novo = document.createElement('div');
      novo.innerHTML = cardHtml(PRODUTOS_POR_ID[id]);
      card.replaceWith(novo.firstElementChild);
      const alvo = grade.querySelector(`.card[data-id="${id}"] [data-dot="${estado.corCard[id]}"]`);
      if (alvo) alvo.focus();
      return;
    }
    const card = e.target.closest('.card');
    if (card) abrirPeca(card.getAttribute('data-id'), estado.corCard[card.getAttribute('data-id')] || 0);
  });

  /* ---------- Favoritos ---------- */
  function alternarDesejo(id) {
    const p = PRODUTOS_POR_ID[id];
    if (!p) return;
    if (estado.desejos.has(id)) { estado.desejos.delete(id); toast('Removido dos favoritos'); }
    else { estado.desejos.add(id); toast('Guardado nos favoritos ♥'); }
    salvarDesejos();
    atualizarContadores();
    $$(`[data-fav-id="${id}"]`).forEach((b) => {
      const ativo = estado.desejos.has(id);
      b.classList.toggle('ativo', ativo);
      b.setAttribute('aria-pressed', String(ativo));
    });
    if (estado.filtros.favoritos) renderCatalogo();
  }

  $('#btn-favoritos').addEventListener('click', () => {
    estado.filtros.favoritos = !estado.filtros.favoritos;
    renderCatalogo();
    if (estado.filtros.favoritos) $('#colecao').scrollIntoView({ behavior: reduzMovimento ? 'auto' : 'smooth' });
  });

  /* ---------- Modal da peça ---------- */
  const modal = $('#modal-peca');
  const modalConteudo = $('#modal-conteudo');

  function tabelaMedidasHtml(p) {
    const m = MEDIDAS[p.medidas];
    if (!m) return '<p class="nota">Tamanho único. Medidas na descrição acima.</p>';
    return `<p class="nota">${m.titulo}</p><div class="tabela-rolagem"><table class="medidas-tab"><thead><tr>${m.cab.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${
      m.linhas.filter((l) => p.tamanhos.includes(l[0])).map((l) => `<tr${estado.modal && estado.modal.tam === l[0] ? ' class="atual"' : ''}><th scope="row">${l[0]}</th>${l.slice(1).map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')
    }</tbody></table></div>`;
  }

  function renderModal() {
    const m = estado.modal;
    const p = PRODUTOS_POR_ID[m.id];
    const cor = p.cores[m.cor];
    const fav = estado.desejos.has(p.id);
    const medidasAberto = modalConteudo.querySelector('details.medidas') && modalConteudo.querySelector('details.medidas').open;
    modalConteudo.innerHTML = `
      <button type="button" class="btn-icone fechar fechar-modal" data-fechar aria-label="Fechar">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      <div class="mp-grid">
        <div class="mp-fig" style="--fundo:${corDeFundo(cor)}">
          ${desenharPeca(p, m.cor)}
          ${selosHtml(p)}
          <p class="mp-fig-legenda">${escaparHtml(cor.nome)}</p>
        </div>
        <div class="mp-info">
          <p class="card-cat">${p.cat}</p>
          <h2 id="mp-nome" class="mp-nome">${escaparHtml(p.nome)}</h2>
          <p class="mp-preco">${precoHtml(p)}${p.precoAntigo ? ` <span class="mp-economia">economize ${formatarPreco(p.precoAntigo - p.preco)}</span>` : ''}</p>
          <p class="mp-parcela">ou 3x de ${formatarPreco(Math.ceil(p.preco / 3))} sem juros</p>
          <p class="mp-desc">${escaparHtml(p.desc)}</p>

          <fieldset class="mp-grupo">
            <legend>Cor: <strong>${escaparHtml(cor.nome)}</strong></legend>
            <div class="mp-cores">
              ${p.cores.map((c, i) => `<label class="cor-op" style="--c:${c.hex};--c2:${c.hex2 || c.hex}"><input type="radio" name="mp-cor" value="${i}"${i === m.cor ? ' checked' : ''}><span class="cor-bola${c.padrao ? ' cor-' + c.padrao : ''}"></span><span class="visualmente-oculto">${escaparHtml(c.nome)}</span></label>`).join('')}
            </div>
          </fieldset>

          <fieldset class="mp-grupo">
            <legend>Tamanho${m.tam ? `: <strong>${m.tam}</strong>` : ''}</legend>
            <div class="mp-tams">
              ${p.tamanhos.map((t) => {
                const esg = p.esgotados.includes(t);
                return `<label class="tam-op${esg ? ' esgotado' : ''}"><input type="radio" name="mp-tam" value="${t}"${m.tam === t ? ' checked' : ''}${esg ? ' disabled' : ''}><span>${t}${esg ? '<span class="visualmente-oculto"> (esgotado)</span>' : ''}</span></label>`;
              }).join('')}
            </div>
            ${p.esgotados.length ? `<p class="nota">Riscado = esgotado. <button type="button" class="link-btn" data-avise>Avise-me quando chegar</button></p>` : ''}
            <p class="erro" id="mp-erro" hidden>Escolha um tamanho para continuar.</p>
          </fieldset>

          <details class="medidas"${medidasAberto ? ' open' : ''}>
            <summary>Tabela de medidas</summary>
            ${tabelaMedidasHtml(p)}
          </details>

          <p class="mp-comp">${escaparHtml(p.comp)}</p>

          <div class="mp-comprar">
            <div class="qtd" role="group" aria-label="Quantidade">
              <button type="button" data-qtd="-1" aria-label="Diminuir quantidade"${m.qtd <= 1 ? ' disabled' : ''}>−</button>
              <output aria-live="polite">${m.qtd}</output>
              <button type="button" data-qtd="1" aria-label="Aumentar quantidade"${m.qtd >= QTD_MAX ? ' disabled' : ''}>+</button>
            </div>
            <button type="button" class="btn btn-primario btn-cheio" data-adicionar><span>Adicionar à sacola</span><small class="add-preco">${formatarPreco(p.preco * m.qtd)}</small></button>
          </div>

          <div class="mp-acoes">
            <button type="button" class="btn-texto${fav ? ' ativo' : ''}" data-fav-id="${p.id}" aria-pressed="${fav}">${iconeCoracao}<span>${fav ? 'Nos favoritos' : 'Favoritar'}</span></button>
            <button type="button" class="btn-texto" data-duvida><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/></svg><span>Tirar dúvida</span></button>
            <button type="button" class="btn-texto" data-compartilhar><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V3M7 8l5-5 5 5M5 13v7h14v-7"/></svg><span>Compartilhar</span></button>
          </div>
        </div>
      </div>`;
  }

  function abrirPeca(id, corIdx) {
    const p = PRODUTOS_POR_ID[id];
    if (!p) return;
    const unico = p.tamanhos.length === 1 && !p.esgotados.includes(p.tamanhos[0]) ? p.tamanhos[0] : '';
    estado.modal = { id, cor: corIdx || 0, tam: unico, qtd: 1 };
    modalConteudo.innerHTML = '';
    renderModal();
    if (!modal.open) modal.showModal();
    modal.scrollTop = 0;
    const fechar = modal.querySelector('.fechar-modal');
    if (fechar) fechar.focus();
  }

  modal.addEventListener('change', (e) => {
    const m = estado.modal;
    if (!m) return;
    if (e.target.name === 'mp-cor') {
      m.cor = Number(e.target.value);
      renderModal();
      const r = modal.querySelector(`input[name="mp-cor"][value="${m.cor}"]`);
      if (r) r.focus();
    } else if (e.target.name === 'mp-tam') {
      m.tam = e.target.value;
      renderModal();
      const r = modal.querySelector(`input[name="mp-tam"][value="${m.tam}"]`);
      if (r) r.focus();
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) { modal.close(); return; }
    const m = estado.modal;
    const p = m && PRODUTOS_POR_ID[m.id];
    if (e.target.closest('[data-fechar]')) { modal.close(); return; }
    if (!p) return;
    const q = e.target.closest('[data-qtd]');
    if (q) {
      m.qtd = Math.max(1, Math.min(QTD_MAX, m.qtd + Number(q.getAttribute('data-qtd'))));
      renderModal();
      const b = modal.querySelector(`[data-qtd="${q.getAttribute('data-qtd')}"]`);
      if (b && !b.disabled) b.focus();
      return;
    }
    const fav = e.target.closest('[data-fav-id]');
    if (fav) { alternarDesejo(p.id); renderModal(); const b = modal.querySelector('[data-fav-id]'); if (b) b.focus(); return; }
    if (e.target.closest('[data-adicionar]')) {
      if (!m.tam) {
        const erro = modal.querySelector('#mp-erro');
        erro.hidden = false;
        const prim = modal.querySelector('input[name="mp-tam"]:not(:disabled)');
        if (prim) prim.focus();
        return;
      }
      estado.sacola = adicionarItem(estado.sacola, { id: p.id, cor: p.cores[m.cor].nome, tam: m.tam, qtd: m.qtd });
      salvarSacola();
      atualizarContadores();
      modal.close();
      abrirSacola();
      toast(`${p.nome.split(' ').slice(0, 2).join(' ')} na sacola!`);
      return;
    }
    if (e.target.closest('[data-duvida]')) {
      const cor = p.cores[m.cor].nome;
      abrirWhatsApp(montarMensagemProvador(p, { duvida: `Estou olhando na cor ${cor}${m.tam ? `, tamanho ${m.tam}` : ''}. Pode me ajudar?` }));
      return;
    }
    if (e.target.closest('[data-avise]')) {
      const esg = p.esgotados.join(', ');
      abrirWhatsApp(`Olá, ${LOJA.nome}! Quero receber um aviso quando chegar reposição da peça *${p.nome}* no tamanho ${esg}, cor ${p.cores[m.cor].nome}.`);
      return;
    }
    if (e.target.closest('[data-compartilhar]')) {
      const url = new URL(window.location.href);
      url.search = '?peca=' + p.id;
      url.hash = '';
      const dados = { title: p.nome + ' · ' + LOJA.nome, text: `${p.nome} por ${formatarPreco(p.preco)} na ${LOJA.nome}`, url: url.toString() };
      if (navigator.share) {
        navigator.share(dados).catch(() => {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(dados.url).then(() => toast('Link da peça copiado'), () => toast('Não foi possível copiar o link'));
      }
    }
  });

  modal.addEventListener('close', () => {
    estado.modal = null;
    if (new URLSearchParams(window.location.search).has('peca')) {
      try { history.replaceState(null, '', window.location.pathname + window.location.hash); } catch (e) { /* ok */ }
    }
  });

  /* ---------- Sacola ---------- */
  const sacola = $('#sacola');
  const ckNome = $('#ck-nome'), ckEnd = $('#ck-endereco'), ckPag = $('#ck-pagamento'), ckObs = $('#ck-obs');
  const cupomInput = $('#cupom-input'), cupomMsg = $('#cupom-msg');

  ckNome.value = estado.checkout.nome || '';
  ckEnd.value = estado.checkout.endereco || '';
  ckObs.value = estado.checkout.obs || '';
  if (estado.checkout.pagamento) ckPag.value = estado.checkout.pagamento;
  if (!ckPag.value) ckPag.selectedIndex = 0;
  cupomInput.value = estado.checkout.cupom || '';
  const radioEnt = $(`input[name="entrega"][value="${estado.checkout.entrega}"]`);
  if (radioEnt) radioEnt.checked = true;

  function abrirSacola() {
    renderSacola();
    if (!sacola.open) sacola.showModal();
  }

  function renderSacola() {
    const t = calcularTotais(estado.sacola, estado.checkout.cupom, estado.checkout.entrega);
    const vazia = !t.linhas.length;
    $('#sacola-vazia').hidden = !vazia;
    $('#checkout').hidden = vazia;
    $('#sacola-rodape').hidden = vazia;
    $('#sacola-qtd').textContent = vazia ? '' : `(${t.pecas})`;
    $('#campo-endereco').hidden = estado.checkout.entrega !== 'local';

    $('#sacola-itens').innerHTML = t.linhas.map((l) => {
      const ci = Math.max(0, l.produto.cores.findIndex((c) => c.nome === l.item.cor));
      const k = chaveItem(l.item);
      return `<li class="item" data-chave="${escaparHtml(k)}">
        <button type="button" class="item-fig" style="--fundo:${corDeFundo(l.produto.cores[ci])}" data-ver="${l.produto.id}" data-cor="${ci}" aria-label="Ver ${escaparHtml(l.produto.nome)}">${desenharPeca(l.produto, ci)}</button>
        <div class="item-info">
          <p class="item-nome">${escaparHtml(l.produto.nome)}</p>
          <p class="item-var">${escaparHtml(l.item.cor)} · Tam. ${escaparHtml(l.item.tam)}</p>
          <div class="item-linha">
            <div class="qtd qtd-peq" role="group" aria-label="Quantidade de ${escaparHtml(l.produto.nome)}">
              <button type="button" data-item-qtd="-1" aria-label="Diminuir">−</button>
              <output>${l.item.qtd}</output>
              <button type="button" data-item-qtd="1" aria-label="Aumentar"${l.item.qtd >= QTD_MAX ? ' disabled' : ''}>+</button>
            </div>
            <strong class="item-total">${formatarPreco(l.total)}</strong>
          </div>
          <button type="button" class="link-btn item-remover" data-remover>Remover</button>
        </div>
      </li>`;
    }).join('');

    const freteTxt = t.freteACombinar ? 'a combinar' : t.frete === 0 ? 'grátis' : formatarPreco(t.frete);
    let falta = '';
    if (t.entrega === 'local' && t.frete > 0) {
      falta = `<p class="resumo-dica">Faltam ${formatarPreco(ENTREGAS.local.gratisAcima - (t.subtotal - t.desconto))} para a entrega grátis.</p>`;
    }
    $('#sacola-resumo').innerHTML = `
      <div><dt>Subtotal</dt><dd>${formatarPreco(t.subtotal)}</dd></div>
      ${t.cupom ? `<div class="resumo-desc"><dt>Cupom ${t.cupom}</dt><dd>${formatarPreco(-t.desconto)}</dd></div>` : ''}
      <div><dt>Entrega</dt><dd>${freteTxt}</dd></div>
      <div class="resumo-total"><dt>Total</dt><dd>${formatarPreco(t.total)}${t.freteACombinar ? ' <small>+ frete</small>' : ''}</dd></div>
      ${falta}`;
  }

  $('#sacola-itens').addEventListener('click', (e) => {
    const li = e.target.closest('.item');
    if (!li) return;
    const k = li.getAttribute('data-chave');
    const item = estado.sacola.find((i) => chaveItem(i) === k);
    if (!item) return;
    const q = e.target.closest('[data-item-qtd]');
    if (q) {
      const d = Number(q.getAttribute('data-item-qtd'));
      estado.sacola = alterarQtd(estado.sacola, k, item.qtd + d);
      salvarSacola(); renderSacola(); atualizarContadores();
      const mesmo = $(`#sacola-itens .item[data-chave="${CSS.escape(k)}"] [data-item-qtd="${d}"]`);
      if (mesmo && !mesmo.disabled) mesmo.focus();
      else if (!estado.sacola.length) $('#sacola .fechar').focus();
      return;
    }
    if (e.target.closest('[data-remover]')) {
      const anterior = estado.sacola.slice();
      estado.sacola = removerItem(estado.sacola, k);
      salvarSacola(); renderSacola(); atualizarContadores();
      toast('Peça removida', { rotulo: 'Desfazer', fn: () => { estado.sacola = anterior; salvarSacola(); renderSacola(); atualizarContadores(); } });
      const prim = $('#sacola-itens .item [data-item-qtd]');
      (prim || $('#sacola .fechar')).focus();
      return;
    }
    const ver = e.target.closest('[data-ver]');
    if (ver) { sacola.close(); abrirPeca(ver.getAttribute('data-ver'), Number(ver.getAttribute('data-cor'))); }
  });

  function aplicarCupom() {
    const cod = normalizarCupom(cupomInput.value);
    cupomMsg.classList.remove('ok', 'ruim');
    if (!cod) {
      estado.checkout.cupom = '';
      cupomMsg.textContent = '';
    } else if (CUPONS[cod]) {
      estado.checkout.cupom = cod;
      cupomInput.value = cod;
      cupomMsg.textContent = `Cupom aplicado: ${CUPONS[cod].descricao}.`;
      cupomMsg.classList.add('ok');
    } else {
      estado.checkout.cupom = '';
      cupomMsg.textContent = 'Cupom não encontrado. Teste o BEMVINDA10.';
      cupomMsg.classList.add('ruim');
    }
    salvarCheckout();
    renderSacola();
  }
  $('#cupom-aplicar').addEventListener('click', aplicarCupom);
  cupomInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); aplicarCupom(); } });
  if (estado.checkout.cupom && CUPONS[estado.checkout.cupom]) {
    cupomMsg.textContent = `Cupom aplicado: ${CUPONS[estado.checkout.cupom].descricao}.`;
    cupomMsg.classList.add('ok');
  }

  $('#checkout').addEventListener('change', (e) => {
    if (e.target.name === 'entrega') { estado.checkout.entrega = e.target.value; salvarCheckout(); renderSacola(); }
    if (e.target === ckPag) { estado.checkout.pagamento = ckPag.value; salvarCheckout(); }
  });
  $('#checkout').addEventListener('input', (e) => {
    if (e.target === ckNome) { estado.checkout.nome = ckNome.value; $('#ck-nome-erro').hidden = true; ckNome.removeAttribute('aria-invalid'); }
    if (e.target === ckEnd) estado.checkout.endereco = ckEnd.value;
    if (e.target === ckObs) estado.checkout.obs = ckObs.value;
    salvarCheckout();
  });
  $('#checkout').addEventListener('submit', (e) => e.preventDefault());

  $('#finalizar').addEventListener('click', () => {
    if (!estado.sacola.length) return;
    if (!ckNome.value.trim()) {
      $('#ck-nome-erro').hidden = false;
      ckNome.setAttribute('aria-invalid', 'true');
      ckNome.focus();
      return;
    }
    const msg = montarMensagemPedido(estado.sacola, {
      cupom: estado.checkout.cupom, entrega: estado.checkout.entrega, nome: ckNome.value,
      endereco: ckEnd.value, pagamento: ckPag.value, obs: ckObs.value,
    });
    abrirWhatsApp(msg);
    toast('Pedido montado! Confirme o envio no WhatsApp.');
  });

  sacola.addEventListener('click', (e) => {
    if (e.target === sacola) { sacola.close(); return; }
    const f = e.target.closest('[data-fechar]');
    if (f) {
      sacola.close();
      const ir = f.getAttribute('data-ir');
      if (ir) $(ir).scrollIntoView({ behavior: reduzMovimento ? 'auto' : 'smooth' });
    }
  });

  $('#btn-sacola').addEventListener('click', abrirSacola);
  $('#fab-sacola').addEventListener('click', abrirSacola);

  function atualizarContadores() {
    const t = calcularTotais(estado.sacola, estado.checkout.cupom, 'retirada');
    const cs = $('#cont-sacola');
    cs.hidden = !t.pecas;
    cs.textContent = String(t.pecas);
    $('#btn-sacola').setAttribute('aria-label', t.pecas ? `Abrir sacola, ${t.pecas} ${t.pecas === 1 ? 'peça' : 'peças'}` : 'Abrir sacola, vazia');
    const cf = $('#cont-favoritos');
    cf.hidden = !estado.desejos.size;
    cf.textContent = String(estado.desejos.size);
    $('#btn-favoritos').setAttribute('aria-label', `Ver favoritos (${estado.desejos.size})`);
    const fab = $('#fab-sacola');
    fab.hidden = !t.pecas;
    $('#fab-qtd').textContent = String(t.pecas);
    $('#fab-total').textContent = formatarPreco(t.subtotal);
    fab.setAttribute('aria-label', `Sacola: ${t.pecas} ${t.pecas === 1 ? 'peça' : 'peças'}, ${formatarPreco(t.subtotal)}`);
    if (sacola.open) renderSacola();
  }

  /* ---------- Provador por WhatsApp ---------- */
  const provPeca = $('#prov-peca');
  provPeca.innerHTML = CATEGORIAS.map((cat) =>
    `<optgroup label="${cat}">${PRODUTOS.filter((p) => p.cat === cat).map((p) => `<option value="${p.id}">${escaparHtml(p.nome)}</option>`).join('')}</optgroup>`).join('');
  $('#prov-duvidas').innerHTML = DUVIDAS.map((d, i) =>
    `<label class="chip-radio"><input type="radio" name="prov-duvida" value="${i}"${i === 0 ? ' checked' : ''}><span>${d}</span></label>`).join('');

  function dadosProvador() {
    const r = $('input[name="prov-duvida"]:checked');
    return {
      duvida: r ? DUVIDAS[Number(r.value)] : '',
      altura: $('#prov-altura').value,
      usa: $('#prov-usa').value,
      extra: $('#prov-extra').value,
    };
  }
  function renderPrevia() {
    const p = PRODUTOS_POR_ID[provPeca.value];
    $('#prov-previa').textContent = p ? montarMensagemProvador(p, dadosProvador()) : '';
  }
  $('#form-provador').addEventListener('input', renderPrevia);
  $('#form-provador').addEventListener('change', renderPrevia);
  $('#form-provador').addEventListener('submit', (e) => {
    e.preventDefault();
    const p = PRODUTOS_POR_ID[provPeca.value];
    if (p) abrirWhatsApp(montarMensagemProvador(p, dadosProvador()));
  });
  renderPrevia();

  /* ---------- Instagram fictício ---------- */
  const POSTS = [
    { id: 'vestido-alca-linho', cor: 1, txt: 'Linho areia para o pôr do sol na Curva da Jurema', curtidas: 412 },
    { id: 'chemise-listrada', cor: 0, txt: 'A chemise que a cliente usou no casamento civil', curtidas: 289 },
    { id: 'camisa-masc-linho', cor: 1, txt: 'Ele também compra aqui: linho azul-céu', curtidas: 198 },
    { id: 'saia-plissada', cor: 1, txt: 'Plissada rosa-chá + T-shirt branca = sexta-feira', curtidas: 355 },
    { id: 'lenco-seda', cor: 0, txt: 'Nosso lenço Mar, desenhado aqui na loja', curtidas: 241 },
    { id: 'pantalona', cor: 1, txt: 'Pantalona caramelo voltou! Corre que é pouca', curtidas: 517 },
  ];
  $('#insta-grade').innerHTML = POSTS.map((post) => {
    const p = PRODUTOS_POR_ID[post.id];
    return `<button type="button" class="post" data-ver="${p.id}" data-cor="${post.cor}" style="--fundo:${corDeFundo(p.cores[post.cor])}">
      ${desenharPeca(p, post.cor)}
      <span class="post-txt">${escaparHtml(post.txt)}</span>
      <span class="post-curtidas" aria-label="${post.curtidas} curtidas">♥ ${post.curtidas}</span>
    </button>`;
  }).join('');
  $('#insta-grade').addEventListener('click', (e) => {
    const b = e.target.closest('[data-ver]');
    if (b) abrirPeca(b.getAttribute('data-ver'), Number(b.getAttribute('data-cor')));
  });
  $('#btn-seguir').addEventListener('click', () => toast(`Na versão real, este botão abre o perfil ${LOJA.instagram}.`));

  /* ---------- Mapa ---------- */
  $('#link-mapa').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(LOJA.mapa);

  /* ---------- Início ---------- */
  renderCatalogo();
  atualizarContadores();
  const pecaUrl = new URLSearchParams(window.location.search).get('peca');
  if (pecaUrl && PRODUTOS_POR_ID[pecaUrl]) abrirPeca(pecaUrl, 0);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciarLoja);
  else iniciarLoja();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PRODUTOS, PRODUTOS_POR_ID, CUPONS, ENTREGAS, formatarPreco, descontoPct, filtrarProdutos, adicionarItem,
    alterarQtd, removerItem, chaveItem, calcularTotais, montarMensagemPedido, montarMensagemProvador, linkWhatsApp,
    desenharPeca, tamanhoDisponivel,
  };
}
