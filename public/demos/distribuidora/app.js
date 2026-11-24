/* =====================================================================
   Maré Alta Distribuidora — app de pedidos (PWA)
   HTML/CSS/JS puro. Os dados ficam salvos no próprio celular (localStorage).
   ===================================================================== */
'use strict';

/* Número de WhatsApp que recebe os pedidos.
   Vazio ('') = o WhatsApp pergunta para qual contato enviar (ideal para demonstração).
   Para usar de verdade, preencha só com números, com DDI 55 + DDD. Ex.: '5527999998888'. */
const WHATSAPP_NEGOCIO = '';

/* ---------------------------------------------------------------------
   Dados da loja
   --------------------------------------------------------------------- */
const LOJA = {
  nome: 'Maré Alta Distribuidora',
  nomeCurto: 'Maré Alta',
  endereco: 'Rua das Castanheiras, 418 — Jardim Camburi, Vitória/ES',
  fuso: 'America/Sao_Paulo', // Espírito Santo usa o mesmo horário de Brasília
  pedidoMinimo: 2000,         // valores em centavos
  tempoEntrega: '30–45 min',
};

// Dia da semana (0 = domingo) → [abre, fecha] em horas cheias
const HORARIOS = { 0: [9, 20], 1: [8, 23], 2: [8, 23], 3: [8, 23], 4: [8, 23], 5: [8, 23], 6: [8, 23] };
const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

// Taxas de entrega por bairro (centavos). taxa null = fora da área.
const BAIRROS = [
  { id: 'jardim-camburi', nome: 'Jardim Camburi', cidade: 'Vitória', taxa: 400, gratisAcima: 12000 },
  { id: 'bairro-de-fatima', nome: 'Bairro de Fátima', cidade: 'Serra', taxa: 600 },
  { id: 'mata-da-praia', nome: 'Mata da Praia', cidade: 'Vitória', taxa: 600 },
  { id: 'goiabeiras', nome: 'Goiabeiras', cidade: 'Vitória', taxa: 600 },
  { id: 'jardim-da-penha', nome: 'Jardim da Penha', cidade: 'Vitória', taxa: 700 },
  { id: 'republica', nome: 'Bairro República', cidade: 'Vitória', taxa: 700 },
  { id: 'praia-do-canto', nome: 'Praia do Canto', cidade: 'Vitória', taxa: 900 },
  { id: 'laranjeiras', nome: 'Laranjeiras', cidade: 'Serra', taxa: 1000 },
  { id: 'fora', nome: 'Outro bairro (fora da área)', cidade: '', taxa: null },
];

const CATEGORIAS = [
  { id: 'combos', nome: 'Combos', icone: { t: 'kit', c: '#FF5A3C' } },
  { id: 'cervejas', nome: 'Cervejas', icone: { t: 'lata', c: '#E8A317', c2: '#FFF6DA' } },
  { id: 'refrigerantes', nome: 'Refrigerantes', icone: { t: 'pet', c: '#5A1F14', c2: '#E53935', tampa: '#E53935' } },
  { id: 'aguas', nome: 'Águas', icone: { t: 'galao' } },
  { id: 'gas', nome: 'Gás', icone: { t: 'botijao', c: '#E8483B', c2: '#9E2A20' } },
  { id: 'gelo-carvao', nome: 'Gelo e carvão', icone: { t: 'gelo', c: '#1E7FE0' } },
  { id: 'destilados', nome: 'Destilados', icone: { t: 'destilado', c: '#B9802F', c2: '#2D2D2D' } },
];

/* Produtos: preços em centavos. "un" = quantas unidades a embalagem tem (para mostrar o preço por unidade). */
const PRODUTOS = [
  // Cervejas
  { id: 'pilsen-350', cat: 'cervejas', nome: 'Cerveja pilsen lata 350ml', desc: 'Leve e trincando de gelada, direto do freezer.', tag: 'Mais pedida',
    img: { t: 'lata', c: '#E8A317', c2: '#FFF6DA' },
    opcoes: [{ id: 'un', rotulo: 'Unidade', preco: 399 }, { id: 'fd12', rotulo: 'Fardo c/ 12', preco: 4490, un: 12 }] },
  { id: 'pilsen-473', cat: 'cervejas', nome: 'Cerveja pilsen latão 473ml', desc: 'O latão que rende mais na resenha.',
    img: { t: 'lata', c: '#C8261C', c2: '#FFE9A8' },
    opcoes: [{ id: 'un', rotulo: 'Unidade', preco: 549 }, { id: 'fd12', rotulo: 'Fardo c/ 12', preco: 5990, un: 12 }] },
  { id: 'puromalte-330', cat: 'cervejas', nome: 'Cerveja puro malte long neck 330ml', desc: 'Mais encorpada, 100% malte.',
    img: { t: 'longneck', c: '#1F6B3A', c2: '#F5EBD0' },
    opcoes: [{ id: 'un', rotulo: 'Unidade', preco: 649 }, { id: 'pk6', rotulo: 'Pack c/ 6', preco: 3690, un: 6 }] },
  { id: 'pilsen-600', cat: 'cervejas', nome: 'Cerveja pilsen garrafa 600ml', desc: 'Retornável: devolva os cascos na próxima entrega.',
    img: { t: 'longneck', c: '#7A4A12', c2: '#FFF1C9' },
    opcoes: [{ id: 'un', rotulo: 'Unidade', preco: 950 }, { id: 'cx12', rotulo: 'Caixa c/ 12', preco: 10900, un: 12 }] },
  { id: 'ipa-500', cat: 'cervejas', nome: 'Cerveja IPA artesanal 500ml', desc: 'Lupulada e aromática, de cervejaria capixaba.', tag: 'Artesanal',
    img: { t: 'longneck', c: '#C0561B', c2: '#FFF4E0' },
    opcoes: [{ id: 'un', rotulo: 'Unidade', preco: 1690 }] },
  { id: 'semalcool-350', cat: 'cervejas', nome: 'Cerveja sem álcool lata 350ml', desc: 'Todo o sabor, zero álcool.',
    img: { t: 'lata', c: '#1C5FB8', c2: '#E3F0FF' },
    opcoes: [{ id: 'un', rotulo: 'Unidade', preco: 499 }, { id: 'fd12', rotulo: 'Fardo c/ 12', preco: 5590, un: 12 }] },

  // Refrigerantes
  { id: 'cola-2l', cat: 'refrigerantes', nome: 'Refrigerante cola 2L', desc: 'O clássico para o almoço de domingo.', tag: 'Mais pedido',
    img: { t: 'pet', c: '#4A1A10', c2: '#E53935', tampa: '#E53935' },
    opcoes: [{ id: 'un', rotulo: 'Unidade', preco: 1099 }, { id: 'fd6', rotulo: 'Fardo c/ 6', preco: 6290, un: 6 }] },
  { id: 'guarana-2l', cat: 'refrigerantes', nome: 'Refrigerante guaraná 2L', desc: 'Geladinho, do jeito que todo mundo gosta.',
    img: { t: 'pet', c: '#2E7D32', c2: '#FFFFFF', tampa: '#1B5E20' },
    opcoes: [{ id: 'un', rotulo: 'Unidade', preco: 899 }, { id: 'fd6', rotulo: 'Fardo c/ 6', preco: 5090, un: 6 }] },
  { id: 'laranja-2l', cat: 'refrigerantes', nome: 'Refrigerante laranja 2L', desc: 'Sabor laranja, sem cafeína.',
    img: { t: 'pet', c: '#F57C00', c2: '#FFF3E0', tampa: '#E65100' },
    opcoes: [{ id: 'un', rotulo: 'Unidade', preco: 849 }, { id: 'fd6', rotulo: 'Fardo c/ 6', preco: 4790, un: 6 }] },
  { id: 'cola-350', cat: 'refrigerantes', nome: 'Refrigerante cola lata 350ml', desc: 'Lata individual, pronta para a marmita.',
    img: { t: 'lata', c: '#D32F2F', c2: '#FFFFFF' },
    opcoes: [{ id: 'un', rotulo: 'Unidade', preco: 449 }, { id: 'fd12', rotulo: 'Fardo c/ 12', preco: 4990, un: 12 }] },
  { id: 'tonica-350', cat: 'refrigerantes', nome: 'Água tônica lata 350ml', desc: 'Para o gin ou para beber pura.',
    img: { t: 'lata', c: '#9CCC65', c2: '#FFFFFF' },
    opcoes: [{ id: 'un', rotulo: 'Unidade', preco: 499 }, { id: 'pk6', rotulo: 'Pack c/ 6', preco: 2790, un: 6 }] },
  { id: 'energetico-473', cat: 'refrigerantes', nome: 'Energético lata 473ml', desc: 'Para a balada ou para o drink.',
    img: { t: 'lata', c: '#212121', c2: '#C6FF00' },
    opcoes: [{ id: 'un', rotulo: 'Unidade', preco: 990 }, { id: 'pk6', rotulo: 'Pack c/ 6', preco: 5690, un: 6 }] },

  // Águas
  { id: 'galao-20l', cat: 'aguas', nome: 'Água mineral 20L (galão)', desc: 'Trocamos o galão vazio na hora da entrega.', tag: 'Entrega rápida',
    img: { t: 'galao' },
    opcoes: [{ id: 'recarga', rotulo: 'Recarga (troca)', preco: 1400 }, { id: 'novo', rotulo: 'Galão novo + água', preco: 4500 }] },
  { id: 'agua-500', cat: 'aguas', nome: 'Água mineral sem gás 500ml', desc: 'Garrafinha para levar na bolsa.',
    img: { t: 'garrafinha', c: '#BFE3FF', c2: '#1E88E5', tampa: '#1E88E5' },
    opcoes: [{ id: 'un', rotulo: 'Unidade', preco: 250 }, { id: 'fd12', rotulo: 'Fardo c/ 12', preco: 2490, un: 12 }] },
  { id: 'agua-gas-500', cat: 'aguas', nome: 'Água mineral com gás 500ml', desc: 'Gaseificada e bem gelada.',
    img: { t: 'garrafinha', c: '#BFE3FF', c2: '#43A047', tampa: '#43A047' },
    opcoes: [{ id: 'un', rotulo: 'Unidade', preco: 350 }, { id: 'fd12', rotulo: 'Fardo c/ 12', preco: 3690, un: 12 }] },
  { id: 'agua-1500', cat: 'aguas', nome: 'Água mineral 1,5L', desc: 'Para a geladeira de casa.',
    img: { t: 'pet', c: '#BFE3FF', c2: '#1E88E5', tampa: '#1E88E5' },
    opcoes: [{ id: 'un', rotulo: 'Unidade', preco: 450 }, { id: 'fd6', rotulo: 'Fardo c/ 6', preco: 2390, un: 6 }] },
  { id: 'coco-1l', cat: 'aguas', nome: 'Água de coco 1L', desc: 'Natural, sem conservantes.',
    img: { t: 'caixa', c: '#7CB342' },
    opcoes: [{ id: 'un', rotulo: 'Unidade', preco: 1290 }] },

  // Gás
  { id: 'gas-p13', cat: 'gas', nome: 'Botijão de gás P13 (13kg)', desc: 'Uso doméstico. Lacrado, com nota fiscal e teste de vazamento.', tag: 'Até 40 min',
    img: { t: 'botijao', c: '#E8483B', c2: '#9E2A20' },
    opcoes: [{ id: 'recarga', rotulo: 'Recarga (troca)', preco: 11990 }, { id: 'novo', rotulo: 'Botijão novo + gás', preco: 29900 }] },
  { id: 'gas-p45', cat: 'gas', nome: 'Botijão de gás P45 (45kg)', desc: 'Para comércio, restaurantes e condomínios.',
    img: { t: 'botijao', c: '#1565C0', c2: '#0D3C7A' },
    opcoes: [{ id: 'recarga', rotulo: 'Recarga (troca)', preco: 44900 }] },
  { id: 'kit-registro', cat: 'gas', nome: 'Registro + mangueira 80cm', desc: 'Regulador novo e mangueira dentro da validade.',
    img: { t: 'mangueira', c: '#F2A33A' },
    opcoes: [{ id: 'un', rotulo: 'Kit', preco: 4990 }] },

  // Gelo e carvão
  { id: 'gelo-5', cat: 'gelo-carvao', nome: 'Gelo em cubos 5kg', desc: 'Água filtrada, cubos que não grudam.', tag: 'Mais pedido',
    img: { t: 'gelo', c: '#1E7FE0' },
    opcoes: [{ id: 'un', rotulo: 'Saco 5kg', preco: 1290 }] },
  { id: 'gelo-2', cat: 'gelo-carvao', nome: 'Gelo em cubos 2kg', desc: 'Na medida para o drink.',
    img: { t: 'gelo', c: '#4FA3F0' },
    opcoes: [{ id: 'un', rotulo: 'Saco 2kg', preco: 690 }] },
  { id: 'gelo-barra', cat: 'gelo-carvao', nome: 'Gelo em barra 10kg', desc: 'Ideal para caixa térmica: dura muito mais.',
    img: { t: 'gelo', c: '#0D47A1' },
    opcoes: [{ id: 'un', rotulo: 'Barra 10kg', preco: 1990 }] },
  { id: 'carvao-3', cat: 'gelo-carvao', nome: 'Carvão vegetal 3kg', desc: 'Pega fogo rápido, brasa duradoura.',
    img: { t: 'carvao' },
    opcoes: [{ id: 'un', rotulo: 'Saco 3kg', preco: 1890 }] },
  { id: 'carvao-5', cat: 'gelo-carvao', nome: 'Carvão vegetal 5kg', desc: 'Para o churrasco da família toda.',
    img: { t: 'carvao' },
    opcoes: [{ id: 'un', rotulo: 'Saco 5kg', preco: 2790 }] },
  { id: 'acendedor', cat: 'gelo-carvao', nome: 'Acendedor em gel 500g', desc: 'Acende a churrasqueira sem fumaça preta.',
    img: { t: 'acendedor' },
    opcoes: [{ id: 'un', rotulo: 'Frasco', preco: 1290 }] },

  // Destilados
  { id: 'vodka-1l', cat: 'destilados', nome: 'Vodka nacional 1L', desc: 'Tridestilada, para caipiroska e drinks.',
    img: { t: 'destilado', c: '#CFE8F7', c2: '#1E3A5F' },
    opcoes: [{ id: 'un', rotulo: 'Garrafa', preco: 3290 }] },
  { id: 'cachaca-700', cat: 'destilados', nome: 'Cachaça de alambique 700ml', desc: 'Envelhecida em barril de madeira.',
    img: { t: 'destilado', c: '#D9A441', c2: '#5D3A12' },
    opcoes: [{ id: 'un', rotulo: 'Garrafa', preco: 3990 }] },
  { id: 'gin-750', cat: 'destilados', nome: 'Gin seco 750ml', desc: 'Notas cítricas, ótimo com tônica.',
    img: { t: 'destilado', c: '#A5D6C8', c2: '#1B4D3E' },
    opcoes: [{ id: 'un', rotulo: 'Garrafa', preco: 5990 }] },
  { id: 'whisky-1l', cat: 'destilados', nome: 'Whisky 8 anos 1L', desc: 'Blend envelhecido 8 anos.',
    img: { t: 'destilado', c: '#B9802F', c2: '#2D2D2D' },
    opcoes: [{ id: 'un', rotulo: 'Garrafa', preco: 10990 }] },
  { id: 'vinho-750', cat: 'destilados', nome: 'Vinho tinto seco 750ml', desc: 'Suave e frutado, vai bem com churrasco.',
    img: { t: 'vinho', c: '#3B0D18', c2: '#7A1028' },
    opcoes: [{ id: 'un', rotulo: 'Garrafa', preco: 3490 }] },

  // Combos (o preço "de" é calculado somando os itens avulsos)
  { id: 'kit-churrasco', cat: 'combos', nome: 'Kit Churrasco', desc: '2 fardos de pilsen 350ml, 2 gelos 5kg e 1 carvão 5kg.', tag: 'Mais vendido',
    img: { t: 'kit', c: '#FF5A3C', cores: ['#E8A317', '#E8A317', '#2B2B2B'] }, preco: 12990,
    itens: [['pilsen-350', 'fd12', 2], ['gelo-5', 'un', 2], ['carvao-5', 'un', 1]] },
  { id: 'kit-resenha', cat: 'combos', nome: 'Kit Resenha', desc: '1 fardo de latão 473ml, 2 refrigerantes cola 2L e 1 gelo 5kg.',
    img: { t: 'kit', c: '#0B5BD3', cores: ['#C8261C', '#4A1A10', '#DFF1FF'] }, preco: 8490,
    itens: [['pilsen-473', 'fd12', 1], ['cola-2l', 'un', 2], ['gelo-5', 'un', 1]] },
  { id: 'kit-casa', cat: 'combos', nome: 'Kit Casa Abastecida', desc: 'Recarga de gás P13 e 2 recargas de água 20L.',
    img: { t: 'kit', c: '#12A150', cores: ['#E8483B', '#9FD3FF', '#9FD3FF'] }, preco: 13990,
    itens: [['gas-p13', 'recarga', 1], ['galao-20l', 'recarga', 2]] },
  { id: 'kit-drinks', cat: 'combos', nome: 'Kit Drinks', desc: '1 vodka 1L, 4 energéticos 473ml e 1 gelo 5kg.',
    img: { t: 'kit', c: '#7B3FE4', cores: ['#CFE8F7', '#212121', '#212121'] }, preco: 7690,
    itens: [['vodka-1l', 'un', 1], ['energetico-473', 'un', 4], ['gelo-5', 'un', 1]] },
  { id: 'kit-aniversario', cat: 'combos', nome: 'Kit Aniversário', desc: '4 refrigerantes cola 2L, 4 guaraná 2L e 2 gelos 5kg.',
    img: { t: 'kit', c: '#F2A33A', cores: ['#4A1A10', '#2E7D32', '#4A1A10'] }, preco: 9490,
    itens: [['cola-2l', 'un', 4], ['guarana-2l', 'un', 4], ['gelo-5', 'un', 2]] },
];

/* ---------------------------------------------------------------------
   Lógica pura (testável fora do navegador)
   --------------------------------------------------------------------- */
const MAPA_PRODUTOS = {};
PRODUTOS.forEach((p) => { MAPA_PRODUTOS[p.id] = p; });

// Combos viram produtos de uma opção só, com o preço "de" somado dos itens.
PRODUTOS.filter((p) => p.cat === 'combos').forEach((p) => {
  p.de = p.itens.reduce((s, [pid, oid, q]) => s + MAPA_PRODUTOS[pid].opcoes.find((o) => o.id === oid).preco * q, 0);
  p.opcoes = [{ id: 'kit', rotulo: 'Kit completo', preco: p.preco }];
});

function brl(centavos) {
  const neg = centavos < 0;
  const c = Math.abs(Math.round(centavos));
  const reais = String(Math.floor(c / 100)).replace(/\B(?=(\d{3})+$)/g, '.');
  return (neg ? '-' : '') + 'R$ ' + reais + ',' + String(c % 100).padStart(2, '0');
}

// Lê valores digitados como "100", "100,50", "R$ 1.250,00" ou "50.5". Retorna centavos ou NaN.
function lerReais(texto) {
  let s = String(texto == null ? '' : texto).replace(/[^\d.,]/g, '');
  if (!s) return NaN;
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  else if (!/^\d+\.\d{1,2}$/.test(s)) s = s.replace(/\./g, '');
  const n = Number(s);
  return Number.isFinite(n) ? Math.round(n * 100) : NaN;
}

const chaveItem = (pid, oid) => pid + '|' + oid;

function acharItem(chave) {
  const [pid, oid] = String(chave).split('|');
  const produto = MAPA_PRODUTOS[pid];
  const opcao = produto && produto.opcoes.find((o) => o.id === oid);
  return opcao ? { produto, opcao } : null;
}

function linhasDoCarrinho(carrinho) {
  return Object.keys(carrinho || {}).map((chave) => {
    const qtd = carrinho[chave];
    const it = acharItem(chave);
    if (!it || !(qtd > 0)) return null;
    return { chave, produto: it.produto, opcao: it.opcao, qtd, unit: it.opcao.preco, total: it.opcao.preco * qtd };
  }).filter(Boolean);
}

function alterarQtd(carrinho, chave, delta) {
  const novo = Object.assign({}, carrinho);
  if (!acharItem(chave)) return novo;
  const q = Math.max(0, Math.min(99, (novo[chave] || 0) + delta));
  if (q === 0) delete novo[chave]; else novo[chave] = q;
  return novo;
}

function calcularTotais(carrinho, bairroId) {
  const linhas = linhasDoCarrinho(carrinho);
  const subtotal = linhas.reduce((s, l) => s + l.total, 0);
  const qtdItens = linhas.reduce((s, l) => s + l.qtd, 0);
  const bairro = BAIRROS.find((b) => b.id === bairroId) || null;
  let taxa = 0, freteGratis = false, foraArea = false, faltaFreteGratis = 0;
  if (bairro) {
    if (bairro.taxa == null) foraArea = true;
    else if (bairro.gratisAcima != null && subtotal >= bairro.gratisAcima) freteGratis = true;
    else {
      taxa = bairro.taxa;
      if (bairro.gratisAcima != null) faltaFreteGratis = bairro.gratisAcima - subtotal;
    }
  }
  const faltaMinimo = Math.max(0, LOJA.pedidoMinimo - subtotal);
  return { linhas, subtotal, qtdItens, bairro, taxa, freteGratis, faltaFreteGratis, foraArea, semBairro: !bairro, faltaMinimo, total: subtotal + taxa };
}

/* dados: { nome, endereco, complemento, bairro, pagamento, troco, semTroco, obs } */
function validarPedido(dados, totais) {
  const erros = [];
  if (!totais.linhas.length) erros.push({ campo: null, msg: 'Seu carrinho está vazio.' });
  else if (totais.faltaMinimo > 0) erros.push({ campo: null, msg: `O pedido mínimo é ${brl(LOJA.pedidoMinimo)}. Faltam ${brl(totais.faltaMinimo)}.` });
  if (!dados.nome || dados.nome.trim().length < 2) erros.push({ campo: 'nome', msg: 'Informe seu nome.' });
  if (!dados.endereco || dados.endereco.trim().length < 5) erros.push({ campo: 'endereco', msg: 'Informe a rua e o número.' });
  if (!dados.bairro) erros.push({ campo: 'bairro', msg: 'Escolha o bairro para calcular a entrega.' });
  else if (totais.foraArea) erros.push({ campo: 'bairro', msg: 'Ainda não entregamos nesse bairro. Você pode retirar no balcão.' });
  if (!['pix', 'dinheiro', 'cartao'].includes(dados.pagamento)) erros.push({ campo: 'pagamento', msg: 'Escolha a forma de pagamento.' });
  if (dados.pagamento === 'dinheiro' && !dados.semTroco) {
    const v = lerReais(dados.troco);
    if (!String(dados.troco || '').trim()) erros.push({ campo: 'troco', msg: 'Diga para quanto precisa de troco ou marque "Não preciso de troco".' });
    else if (!Number.isFinite(v)) erros.push({ campo: 'troco', msg: 'Digite um valor válido. Ex.: 100,00' });
    else if (v < totais.total) erros.push({ campo: 'troco', msg: `O valor precisa ser igual ou maior que o total (${brl(totais.total)}).` });
  }
  return erros;
}

function criarPedido(numero, dados, totais, quando, foraHorario) {
  const trocoPara = dados.pagamento === 'dinheiro' && !dados.semTroco ? lerReais(dados.troco) : null;
  return {
    numero,
    data: quando.toISOString(),
    linhas: totais.linhas.map((l) => ({
      pid: l.produto.id, oid: l.opcao.id, nome: l.produto.nome,
      rotulo: l.produto.opcoes.length > 1 ? l.opcao.rotulo : '',
      combo: l.produto.cat === 'combos' ? l.produto.desc : '',
      qtd: l.qtd, unit: l.unit, total: l.total,
    })),
    subtotal: totais.subtotal, taxa: totais.taxa, freteGratis: totais.freteGratis, total: totais.total,
    bairro: totais.bairro ? totais.bairro.nome : '', cidade: totais.bairro ? totais.bairro.cidade : '',
    pagamento: dados.pagamento, trocoPara: trocoPara != null && trocoPara > totais.total ? trocoPara : null,
    cliente: { nome: dados.nome.trim(), endereco: dados.endereco.trim(), complemento: (dados.complemento || '').trim() },
    obs: (dados.obs || '').trim(),
    foraHorario: !!foraHorario,
  };
}

function dataHora(iso) {
  const d = new Date(iso);
  const p = new Intl.DateTimeFormat('pt-BR', { timeZone: LOJA.fuso, day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).formatToParts(d);
  const g = (t) => (p.find((x) => x.type === t) || {}).value;
  return `${g('day')}/${g('month')}/${g('year')} às ${g('hour')}:${g('minute')}`;
}

const NOME_PAGAMENTO = { pix: 'Pix', dinheiro: 'Dinheiro', cartao: 'Cartão na entrega' };

function montarMensagem(p) {
  const L = [];
  L.push(`🛒 *Pedido nº ${p.numero} — ${LOJA.nome}*`);
  L.push(dataHora(p.data));
  L.push('');
  L.push('*Itens*');
  p.linhas.forEach((l) => {
    L.push(`• ${l.qtd}x ${l.nome}${l.rotulo ? ` (${l.rotulo})` : ''} — ${brl(l.total)}`);
    if (l.combo) L.push(`   _${l.combo}_`);
  });
  L.push('');
  L.push(`Subtotal: ${brl(p.subtotal)}`);
  L.push(`Entrega (${p.bairro}): ${p.freteGratis ? 'GRÁTIS' : brl(p.taxa)}`);
  L.push(`*Total: ${brl(p.total)}*`);
  L.push('');
  let pag = `💳 *Pagamento:* ${NOME_PAGAMENTO[p.pagamento]}`;
  if (p.pagamento === 'dinheiro') pag += p.trocoPara ? ` — troco para ${brl(p.trocoPara)} (levar ${brl(p.trocoPara - p.total)} de troco)` : ' — não preciso de troco';
  if (p.pagamento === 'pix') pag += ' — aguardo a chave Pix para pagar';
  if (p.pagamento === 'cartao') pag += ' — levar a maquininha';
  L.push(pag);
  L.push('');
  L.push('📍 *Entrega*');
  L.push(`Nome: ${p.cliente.nome}`);
  L.push(`Endereço: ${p.cliente.endereco}`);
  if (p.cliente.complemento) L.push(`Complemento/referência: ${p.cliente.complemento}`);
  L.push(`Bairro: ${p.bairro}${p.cidade ? ` — ${p.cidade}/ES` : ''}`);
  if (p.obs) { L.push(''); L.push(`📝 *Observações:* ${p.obs}`); }
  if (p.foraHorario) { L.push(''); L.push('⏰ Pedido feito com a loja fechada: pode entregar assim que abrir.'); }
  L.push('');
  L.push('_Pedido feito pelo app da Maré Alta_');
  return L.join('\n');
}

function urlWhatsApp(mensagem, numero) {
  const n = String(numero == null ? WHATSAPP_NEGOCIO : numero).replace(/\D/g, '');
  return (n ? `https://wa.me/${n}?text=` : 'https://wa.me/?text=') + encodeURIComponent(mensagem);
}

// Dia da semana e minutos desde a meia-noite no fuso da loja.
function horaDaLoja(d) {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: LOJA.fuso, weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(d);
  const g = (t) => (p.find((x) => x.type === t) || {}).value;
  return { dia: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday')), min: (Number(g('hour')) % 24) * 60 + Number(g('minute')) };
}

function statusLoja(d) {
  const { dia, min } = horaDaLoja(d || new Date());
  const [abre, fecha] = HORARIOS[dia];
  if (min >= abre * 60 && min < fecha * 60) {
    const resta = fecha * 60 - min;
    return { aberto: true, titulo: 'Aberto agora', detalhe: resta <= 60 ? `fecha em ${resta} min` : `até as ${fecha}h`, dia };
  }
  if (min < abre * 60) return { aberto: false, titulo: 'Fechado', detalhe: `abre hoje às ${abre}h`, dia };
  const amanha = (dia + 1) % 7;
  return { aberto: false, titulo: 'Fechado', detalhe: `abre amanhã às ${HORARIOS[amanha][0]}h`, dia };
}

function normalizar(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function filtrarProdutos(termo, cat) {
  const palavras = normalizar(termo).split(/\s+/).filter(Boolean);
  return PRODUTOS.filter((p) => {
    if (cat && cat !== 'todos' && p.cat !== cat) return false;
    if (!palavras.length) return true;
    const alvo = normalizar(`${p.nome} ${p.desc} ${(CATEGORIAS.find((c) => c.id === p.cat) || {}).nome}`);
    return palavras.every((w) => alvo.includes(w));
  });
}

// Recoloca no carrinho os itens de um pedido antigo (ignora o que não existe mais).
function repetirPedido(carrinho, pedido) {
  let novo = Object.assign({}, carrinho);
  let adicionados = 0;
  pedido.linhas.forEach((l) => {
    const ch = chaveItem(l.pid, l.oid);
    if (acharItem(ch)) { novo = alterarQtd(novo, ch, l.qtd); adicionados += l.qtd; }
  });
  return { carrinho: novo, adicionados };
}

/* ---------------------------------------------------------------------
   Ilustrações (SVG desenhado aqui mesmo, sem fotos de marcas)
   --------------------------------------------------------------------- */
function onda(cor, y, x) {
  x = x == null ? 25 : x;
  return `<path d="M${x} ${y}q3.5-3 7 0t7 0" stroke="${cor}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
}

function desenho(img) {
  const c = img.c || '#0B5BD3', c2 = img.c2 || '#fff', tampa = img.tampa || '#E53935';
  switch (img.t) {
    case 'lata':
      return `<rect x="19" y="11" width="26" height="45" rx="5" fill="${c}"/><rect x="21" y="8" width="22" height="5" rx="2.5" fill="#C9D1DB"/><rect x="19" y="24" width="26" height="16" fill="${c2}"/>${onda(c, 33)}<rect x="21" y="53" width="22" height="4" rx="2" fill="#AEB8C4"/><rect x="22.5" y="13" width="3.5" height="38" rx="1.75" fill="#fff" opacity=".35"/>`;
    case 'longneck':
      return `<rect x="28" y="4" width="8" height="5" rx="1.5" fill="#C9A227"/><path d="M28.5 8h7v10c0 3 6.5 5 6.5 11v26a3 3 0 0 1-3 3H25a3 3 0 0 1-3-3V29c0-6 6.5-8 6.5-11z" fill="${c}"/><rect x="22" y="33" width="20" height="14" fill="${c2}"/>${onda(c, 41, 25)}<rect x="24.5" y="22" width="2.5" height="32" rx="1.25" fill="#fff" opacity=".3"/>`;
    case 'pet':
      return `<rect x="27.5" y="3" width="9" height="6" rx="1.5" fill="${tampa}"/><path d="M28 9h8v3c0 2.5 8 5 8 11v32a3 3 0 0 1-3 3H23a3 3 0 0 1-3-3V23c0-6 8-8.5 8-11z" fill="${c}"/><rect x="20" y="29" width="24" height="14" fill="${c2}"/>${onda(c === '#BFE3FF' ? '#fff' : c, 37)}<rect x="23" y="18" width="3" height="36" rx="1.5" fill="#fff" opacity=".3"/>`;
    case 'garrafinha':
      return `<g transform="translate(9.6 12) scale(.7)">${desenho(Object.assign({}, img, { t: 'pet' }))}</g>`;
    case 'galao':
      return `<rect x="27" y="4" width="10" height="7" rx="2" fill="#0B5BD3"/><path d="M24 11h16l6 7v37a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V18z" fill="#BFE3FF"/><path d="M18 30h28v25a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4z" fill="#5DB2FF" opacity=".6"/><path d="M18 27h28M18 44h28" stroke="#fff" stroke-width="1.8" opacity=".8"/><rect x="21.5" y="16" width="3" height="38" rx="1.5" fill="#fff" opacity=".6"/>`;
    case 'botijao':
      return `<path d="M20 23v-8a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v8" fill="none" stroke="${c}" stroke-width="4.5"/><rect x="29" y="7" width="6" height="8" rx="1" fill="#8A96A3"/><rect x="13" y="20" width="38" height="36" rx="15" fill="${c}"/><rect x="13" y="33" width="38" height="6" fill="#fff" opacity=".28"/><rect x="18" y="53" width="28" height="7" rx="2" fill="${c2}"/><rect x="18" y="24" width="4" height="26" rx="2" fill="#fff" opacity=".3"/>`;
    case 'gelo':
      return `<path d="M15 14h34l-2.5 42a3 3 0 0 1-3 3h-23a3 3 0 0 1-3-3z" fill="#E6F4FF" stroke="#A9D6F7" stroke-width="2" stroke-linejoin="round"/><rect x="14" y="9" width="36" height="7" rx="2" fill="${c}"/><text x="32" y="29" text-anchor="middle" font-family="Figtree, Arial, sans-serif" font-weight="800" font-size="8.5" fill="${c}">GELO</text><g fill="#fff" stroke="#8CC8F2" stroke-width="1.6"><rect x="21" y="35" width="9" height="9" rx="2" transform="rotate(-12 25.5 39.5)"/><rect x="33" y="36" width="9" height="9" rx="2" transform="rotate(10 37.5 40.5)"/><rect x="27" y="46" width="9" height="9" rx="2" transform="rotate(4 31.5 50.5)"/></g>`;
    case 'carvao':
      return `<path d="M16 12h32l3 44a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3z" fill="#C99A63"/><path d="M16 12l4 3.5 4-3.5 4 3.5 4-3.5 4 3.5 4-3.5 4 3.5 4-3.5" fill="none" stroke="#A97B48" stroke-width="2" stroke-linejoin="round"/><rect x="18" y="21" width="28" height="28" rx="5" fill="#2B2B2B"/><path d="M32 25c3 4 6.5 6 6.5 10.5a6.5 6.5 0 0 1-13 0c0-3 2-4.5 3-6.5.5 2 1.5 3 2.5 3 0-2.5-.8-4.4 1-7z" fill="#FF7A1A"/><path d="M32 33c1.4 1.8 3 3 3 5a3 3 0 0 1-6 0c0-1.6 1-2.4 1.6-3.4.4 1 .9 1.4 1.4 1.4z" fill="#FFC21A"/><path d="M20 47l4-4 5 3 4-4 5 3 4-3 4 5z" fill="#444"/>`;
    case 'destilado':
      return `<rect x="28" y="4" width="8" height="9" rx="1.5" fill="${c2}"/><path d="M27 12h10v5l7 5v33a3 3 0 0 1-3 3H23a3 3 0 0 1-3-3V22l7-5z" fill="${c}"/><rect x="23" y="31" width="18" height="16" rx="2" fill="#FFF8E7"/><path d="M27 37h10M28.5 41.5h7" stroke="${c2}" stroke-width="1.8" stroke-linecap="round"/><rect x="22.5" y="24" width="2.5" height="30" rx="1.25" fill="#fff" opacity=".35"/>`;
    case 'vinho':
      return `<rect x="29" y="3" width="6" height="9" rx="1" fill="${c2}"/><path d="M29 11h6v9c0 3 7 5 7 12v24a3 3 0 0 1-3 3H25a3 3 0 0 1-3-3V32c0-7 7-9 7-12z" fill="${c}"/><rect x="22" y="37" width="20" height="13" fill="#F3E9D6"/><path d="M27 43.5h10" stroke="${c2}" stroke-width="2" stroke-linecap="round"/><rect x="24.5" y="26" width="2.5" height="28" rx="1.25" fill="#fff" opacity=".25"/>`;
    case 'caixa':
      return `<path d="M20 17l5-8h14l5 8v39a3 3 0 0 1-3 3H23a3 3 0 0 1-3-3z" fill="${c}"/><path d="M20 17h24" stroke="#fff" stroke-width="1.5" opacity=".6"/><circle cx="32" cy="38" r="8.5" fill="#6B4423"/><circle cx="32" cy="38" r="5.5" fill="#FFF7E6"/><rect x="23" y="21" width="2.5" height="33" rx="1.25" fill="#fff" opacity=".3"/>`;
    case 'mangueira':
      return `<circle cx="32" cy="39" r="16" fill="none" stroke="${c}" stroke-width="5"/><circle cx="32" cy="39" r="8" fill="none" stroke="${c}" stroke-width="5"/><rect x="21" y="7" width="22" height="13" rx="4" fill="#8A96A3"/><rect x="30" y="19" width="4" height="6" fill="#8A96A3"/><rect x="38" y="10" width="13" height="5" rx="2.5" fill="#E53935"/><circle cx="32" cy="13.5" r="3" fill="#C9D1DB"/>`;
    case 'acendedor':
      return `<rect x="25" y="7" width="14" height="8" rx="2" fill="#E53935"/><rect x="19" y="14" width="26" height="43" rx="6" fill="#FFF3E0" stroke="#F2B66D" stroke-width="2"/><path d="M32 25c3.5 4.5 7 7 7 12a7 7 0 0 1-14 0c0-3.4 2.2-5 3.3-7.3.5 2.2 1.6 3.3 2.7 3.3 0-2.8-.9-5 1-8z" fill="#FF7A1A"/><path d="M32 34c1.5 2 3.2 3.2 3.2 5.3a3.2 3.2 0 0 1-6.4 0c0-1.7 1-2.6 1.7-3.6.4 1 1 1.5 1.5 1.5z" fill="#FFC21A"/>`;
    case 'kit': {
      const [a, b, d] = img.cores || ['#E8A317', '#E8A317', '#DFF1FF'];
      return `<rect x="12" y="15" width="11" height="22" rx="3" fill="${a}"/><rect x="12" y="13" width="11" height="3" rx="1.5" fill="#C9D1DB"/><path d="M27.5 6h5v8c0 2 4 3.5 4 7.5V36h-13V21.5c0-4 4-5.5 4-7.5z" fill="${b}"/><rect x="38" y="17" width="14" height="20" rx="3" fill="${d}" stroke="#fff" stroke-opacity=".5" stroke-width="1.5"/><rect x="8" y="31" width="48" height="25" rx="5" fill="${c}"/><path d="M8 40h48M8 48h48" stroke="#000" opacity=".13" stroke-width="2"/><rect x="25" y="34" width="14" height="4" rx="2" fill="#fff" opacity=".65"/>`;
    }
    default:
      return '';
  }
}

function svgProduto(img, rotulo) {
  return `<svg viewBox="0 0 64 64" ${rotulo ? `role="img" aria-label="${rotulo}"` : 'aria-hidden="true"'} focusable="false">${desenho(img)}</svg>`;
}

/* ---------------------------------------------------------------------
   Exporta para testes no Node e para aqui se não houver navegador
   --------------------------------------------------------------------- */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LOJA, HORARIOS, BAIRROS, CATEGORIAS, PRODUTOS, brl, lerReais, chaveItem, acharItem, linhasDoCarrinho, alterarQtd, calcularTotais, validarPedido, criarPedido, montarMensagem, urlWhatsApp, statusLoja, horaDaLoja, filtrarProdutos, repetirPedido, normalizar, svgProduto, desenho };
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') iniciarApp();

/* =====================================================================
   Interface
   ===================================================================== */
function iniciarApp() {
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Armazenamento local (protegido contra falhas) ---------- */
  const CH = { carrinho: 'mareAlta.carrinho', pedidos: 'mareAlta.pedidos', cliente: 'mareAlta.cliente', numero: 'mareAlta.numero', avisoInstalar: 'mareAlta.avisoInstalar' };
  const ler = (k, padrao) => { try { const v = localStorage.getItem(k); return v == null ? padrao : JSON.parse(v); } catch (e) { return padrao; } };
  const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem espaço ou modo privado */ } };

  const estado = {
    carrinho: {},
    categoria: 'todos',
    busca: '',
    opcaoSel: {},
    aba: 'inicio',
  };
  // limpa itens que não existem mais no cardápio
  linhasDoCarrinho(ler(CH.carrinho, {})).forEach((l) => { estado.carrinho[l.chave] = l.qtd; });

  const salvarCarrinho = () => gravar(CH.carrinho, estado.carrinho);
  const pedidos = () => ler(CH.pedidos, []);

  /* ---------- Toast ---------- */
  let timerToast;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('visivel');
    clearTimeout(timerToast);
    timerToast = setTimeout(() => el.classList.remove('visivel'), 2200);
  }

  /* ---------- Status da loja ---------- */
  function renderStatus() {
    const st = statusLoja(new Date());
    $('#status-titulo').textContent = st.titulo;
    $('#status-detalhe').textContent = st.detalhe;
    $('#status-loja').classList.toggle('fechado', !st.aberto);
    const h = horaDaLoja(new Date()).min / 60;
    $('#saudacao').textContent = h < 5 ? 'Boa noite!' : h < 12 ? 'Bom dia!' : h < 18 ? 'Boa tarde!' : 'Boa noite!';
    $$('#tabela-horarios tr').forEach((tr) => tr.classList.toggle('hoje', Number(tr.dataset.dia) === st.dia));
    return st;
  }

  /* ---------- Cartões de produto ---------- */
  function opcaoAtual(p) {
    if (estado.opcaoSel[p.id]) return p.opcoes.find((o) => o.id === estado.opcaoSel[p.id]) || p.opcoes[0];
    return p.opcoes.find((o) => estado.carrinho[chaveItem(p.id, o.id)]) || p.opcoes[0];
  }

  function stepperHTML(chave, nome, compacto) {
    const q = estado.carrinho[chave] || 0;
    if (!q) {
      return `<button type="button" class="btn-add${compacto ? ' btn-add-mini' : ''}" data-acao="mais" data-chave="${chave}" aria-label="Adicionar ${esc(nome)}"><span aria-hidden="true">+</span>${compacto ? '' : ' Adicionar'}</button>`;
    }
    return `<div class="stepper" role="group" aria-label="Quantidade de ${esc(nome)}">
      <button type="button" data-acao="menos" data-chave="${chave}" aria-label="Diminuir ${esc(nome)}">${q === 1 ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 7V4.5h4V7M7 7l1 13h8l1-13" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>' : '−'}</button>
      <output aria-live="polite">${q}</output>
      <button type="button" data-acao="mais" data-chave="${chave}" aria-label="Aumentar ${esc(nome)}">+</button>
    </div>`;
  }

  function cardProdutoHTML(p) {
    const op = opcaoAtual(p);
    const chave = chaveItem(p.id, op.id);
    const nomeOp = p.opcoes.length > 1 ? `${p.nome}, ${op.rotulo}` : p.nome;
    let opcoes = '';
    if (p.opcoes.length > 1) {
      opcoes = `<div class="opcoes" role="radiogroup" aria-label="Embalagem de ${esc(p.nome)}">${p.opcoes.map((o) => {
        const q = estado.carrinho[chaveItem(p.id, o.id)] || 0;
        return `<button type="button" role="radio" aria-checked="${o.id === op.id}" class="opcao" data-acao="opcao" data-pid="${p.id}" data-oid="${o.id}">
          <span class="opcao-rot">${esc(o.rotulo)}${q ? ` <i class="opcao-q">${q}</i>` : ''}</span>
          <b>${brl(o.preco)}</b>${o.un ? `<small>${brl(o.preco / o.un)}/un</small>` : ''}
        </button>`;
      }).join('')}</div>`;
    }
    const preco = p.de
      ? `<span class="preco"><s>${brl(p.de)}</s> ${brl(op.preco)}</span><span class="economia">Economize ${brl(p.de - op.preco)}</span>`
      : `<span class="preco">${brl(op.preco)}</span>${op.un ? `<span class="por-un">${brl(op.preco / op.un)} a unidade</span>` : ''}`;
    return `<div class="produto-img" style="--tinta:${p.img.c || '#0B5BD3'}">${svgProduto(p.img)}${p.tag ? `<span class="tag">${esc(p.tag)}</span>` : ''}</div>
      <div class="produto-info">
        <h3>${esc(p.nome)}</h3>
        <p class="produto-desc">${esc(p.desc)}</p>
        ${opcoes}
        <div class="produto-rodape"><div class="precos">${preco}</div>${stepperHTML(chave, nomeOp)}</div>
      </div>`;
  }

  function renderProdutos() {
    const lista = $('#lista-produtos');
    const busca = estado.busca.trim();
    const cat = busca ? 'todos' : estado.categoria;
    const achados = filtrarProdutos(busca, cat);
    let html = '';
    if (busca) {
      html += `<p class="lista-info">${achados.length ? `${achados.length} ${achados.length === 1 ? 'resultado' : 'resultados'} para “${esc(busca)}”` : `Nada encontrado para “${esc(busca)}”. Tente “cerveja”, “gás” ou “gelo”.`}</p>`;
      html += achados.map((p) => `<article class="produto" data-pid="${p.id}">${cardProdutoHTML(p)}</article>`).join('');
    } else {
      const cats = cat === 'todos' ? CATEGORIAS : CATEGORIAS.filter((c) => c.id === cat);
      cats.forEach((c) => {
        const itens = achados.filter((p) => p.cat === c.id);
        if (!itens.length) return;
        html += `<section class="grupo" aria-labelledby="grupo-${c.id}"><h2 class="grupo-titulo" id="grupo-${c.id}">${esc(c.nome)}</h2>${itens.map((p) => `<article class="produto" data-pid="${p.id}">${cardProdutoHTML(p)}</article>`).join('')}</section>`;
      });
    }
    lista.innerHTML = html;
    $('#bloco-banners').hidden = !!busca;
    $('#bloco-combos').hidden = !!busca || estado.categoria === 'combos';
  }

  // Atualiza só um cartão (mantém o foco no botão equivalente)
  function atualizarCard(pid) {
    const p = MAPA_PRODUTOS[pid];
    $$(`.produto[data-pid="${pid}"]`).forEach((art) => {
      const ativo = document.activeElement;
      const tinhaFoco = art.contains(ativo);
      const acaoFoco = tinhaFoco ? ativo.dataset.acao : null;
      const oidFoco = tinhaFoco ? ativo.dataset.oid : null;
      art.innerHTML = cardProdutoHTML(p);
      if (tinhaFoco) {
        const alvo = (oidFoco && art.querySelector(`[data-oid="${oidFoco}"]`)) || art.querySelector(`[data-acao="${acaoFoco}"]`) || art.querySelector('.btn-add, .stepper button:last-child');
        if (alvo) alvo.focus();
      }
    });
    $$(`.combo[data-pid="${pid}"] .combo-acao`).forEach((el) => { el.innerHTML = stepperHTML(chaveItem(pid, 'kit'), p.nome, true); });
  }

  function renderCombos() {
    $('#combos').innerHTML = PRODUTOS.filter((p) => p.cat === 'combos').map((p) => `
      <article class="combo" data-pid="${p.id}" style="--cor:${p.img.c}">
        <div class="combo-img">${svgProduto(p.img)}<span class="combo-off">-${Math.round((1 - p.preco / p.de) * 100)}%</span></div>
        <h3>${esc(p.nome)}</h3>
        <p>${esc(p.desc)}</p>
        <div class="combo-rodape">
          <div><s>${brl(p.de)}</s><b>${brl(p.preco)}</b></div>
          <div class="combo-acao">${stepperHTML(chaveItem(p.id, 'kit'), p.nome, true)}</div>
        </div>
      </article>`).join('');
  }

  function renderChips() {
    const todas = [{ id: 'todos', nome: 'Todos', icone: null }].concat(CATEGORIAS);
    $('#chips').innerHTML = todas.map((c) => `<button type="button" class="chip" data-acao="categoria" data-cat="${c.id}" aria-pressed="${estado.categoria === c.id}">${c.icone ? svgProduto(c.icone) : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" fill="currentColor" opacity=".85"/></svg>'}<span>${esc(c.nome)}</span></button>`).join('');
  }

  function escolherCategoria(cat, rolar) {
    estado.categoria = cat;
    if (estado.busca) { estado.busca = ''; $('#campo-busca').value = ''; $('#busca-limpar').hidden = true; }
    $$('.chip').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
    const chipAtivo = $(`.chip[data-cat="${cat}"]`);
    if (chipAtivo) chipAtivo.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduzMovimento ? 'auto' : 'smooth' });
    renderProdutos();
    if (rolar) {
      const alvo = $('.chips-wrap');
      const y = alvo.getBoundingClientRect().top + window.scrollY - $('.topo').offsetHeight;
      window.scrollTo({ top: y, behavior: reduzMovimento ? 'auto' : 'smooth' });
    }
  }

  /* ---------- Contadores ---------- */
  function atualizarContadores() {
    const t = calcularTotais(estado.carrinho, $('#f-bairro').value);
    const badge = $('#badge-carrinho');
    badge.hidden = !t.qtdItens;
    if (badge.textContent !== String(t.qtdItens)) {
      badge.textContent = t.qtdItens;
      if (!reduzMovimento) { badge.classList.remove('pulo'); void badge.offsetWidth; badge.classList.add('pulo'); }
    }
    $('.nav-item[data-aba="carrinho"]').setAttribute('aria-label', t.qtdItens ? `Carrinho, ${t.qtdItens} ${t.qtdItens === 1 ? 'item' : 'itens'}` : 'Carrinho');
    $('#barra-qtd').textContent = t.qtdItens;
    $('#barra-total').textContent = brl(t.subtotal);
    $('#barra-carrinho').hidden = !t.qtdItens || estado.aba !== 'inicio';
  }

  function mudarQtd(chave, delta) {
    const antes = estado.carrinho[chave] || 0;
    estado.carrinho = alterarQtd(estado.carrinho, chave, delta);
    salvarCarrinho();
    const it = acharItem(chave);
    if (!it) return;
    atualizarCard(it.produto.id);
    atualizarContadores();
    if (estado.aba === 'carrinho') renderCarrinho();
    if (delta > 0 && antes === 0) toast(`${it.produto.nome}${it.produto.opcoes.length > 1 ? ` (${it.opcao.rotulo})` : ''} no carrinho`);
  }

  /* ---------- Carrinho e checkout ---------- */
  function renderCarrinho() {
    const t = calcularTotais(estado.carrinho, $('#f-bairro').value);
    const vazio = !t.linhas.length;
    $('#carrinho-vazio').hidden = !vazio;
    $('#form-pedido').hidden = vazio;
    $('#btn-limpar').hidden = vazio;
    $('#itens-carrinho').innerHTML = t.linhas.map((l) => `
      <li class="item">
        <div class="item-img">${svgProduto(l.produto.img)}</div>
        <div class="item-info">
          <p class="item-nome">${esc(l.produto.nome)}</p>
          <p class="item-op">${l.produto.opcoes.length > 1 || l.produto.de ? esc(l.opcao.rotulo) + ' · ' : ''}${brl(l.unit)} cada</p>
          <p class="item-total">${brl(l.total)}</p>
        </div>
        ${stepperHTML(l.chave, l.produto.nome + (l.produto.opcoes.length > 1 ? ', ' + l.opcao.rotulo : ''))}
      </li>`).join('');
    renderResumo(t);
  }

  function renderResumo(t) {
    t = t || calcularTotais(estado.carrinho, $('#f-bairro').value);
    $('#r-subtotal').textContent = brl(t.subtotal);
    $('#r-taxa-rotulo').textContent = t.bairro && !t.foraArea ? `Entrega · ${t.bairro.nome}` : 'Taxa de entrega';
    $('#r-taxa').innerHTML = t.semBairro ? '<span class="cinza">escolha o bairro</span>' : t.foraArea ? '<span class="cinza">fora da área</span>' : t.freteGratis ? '<span class="gratis">Grátis</span>' : brl(t.taxa);
    $('#r-total').textContent = brl(t.total);
    $('#btn-enviar-texto').textContent = t.linhas.length ? `Enviar pedido · ${brl(t.total)}` : 'Enviar pedido pelo WhatsApp';

    const dica = $('#dica-bairro');
    if (t.semBairro) dica.textContent = 'A taxa aparece assim que você escolher.';
    else if (t.foraArea) dica.innerHTML = '<span class="txt-alerta">Ainda não entregamos nesse bairro. Retire no balcão ou fale com a gente.</span>';
    else if (t.freteGratis) dica.innerHTML = '<span class="txt-ok">Entrega grátis neste pedido! 🎉</span>';
    else if (t.faltaFreteGratis > 0) dica.textContent = `Taxa de ${brl(t.taxa)}. Faltam ${brl(t.faltaFreteGratis)} para a entrega sair grátis.`;
    else dica.textContent = `Taxa de entrega: ${brl(t.taxa)}.`;

    const alertas = [];
    if (t.linhas.length && t.faltaMinimo > 0) alertas.push(`Pedido mínimo de ${brl(LOJA.pedidoMinimo)}: adicione mais ${brl(t.faltaMinimo)}.`);
    const st = statusLoja(new Date());
    if (!st.aberto) alertas.push(`Estamos fechados agora (${st.detalhe}). Você pode enviar o pedido e ele sai assim que abrirmos.`);
    $('#alertas').innerHTML = alertas.map((a) => `<p>${esc(a)}</p>`).join('');

    atualizarTroco(t);
  }

  function pagamentoAtual() {
    const r = $('input[name="pagamento"]:checked');
    return r ? r.value : 'pix';
  }

  function atualizarTroco(t) {
    t = t || calcularTotais(estado.carrinho, $('#f-bairro').value);
    const pag = pagamentoAtual();
    $('#bloco-troco').hidden = pag !== 'dinheiro';
    $('#pag-info').textContent = {
      pix: 'Você recebe a chave Pix na confirmação do pedido pelo WhatsApp.',
      dinheiro: 'O entregador leva o troco certinho.',
      cartao: 'Levamos a maquininha: débito ou crédito.',
    }[pag];
    const semTroco = $('#f-sem-troco').checked;
    $('#f-troco').disabled = semTroco;
    const dica = $('#dica-troco');
    const v = lerReais($('#f-troco').value);
    if (semTroco) dica.textContent = '';
    else if (Number.isFinite(v) && v > t.total) dica.innerHTML = `Seu troco: <b>${brl(v - t.total)}</b>`;
    else if (Number.isFinite(v) && v === t.total) dica.textContent = 'Valor exato, sem troco.';
    else dica.textContent = '';
  }

  function lerFormulario() {
    return {
      nome: $('#f-nome').value,
      endereco: $('#f-endereco').value,
      complemento: $('#f-complemento').value,
      bairro: $('#f-bairro').value,
      pagamento: pagamentoAtual(),
      troco: $('#f-troco').value,
      semTroco: $('#f-sem-troco').checked,
      obs: $('#f-obs').value,
    };
  }

  function limparErros() {
    $$('.campo-erro').forEach((e) => e.remove());
    $$('[aria-invalid="true"]').forEach((e) => { e.removeAttribute('aria-invalid'); e.removeAttribute('aria-describedby'); });
  }

  function mostrarErros(erros) {
    limparErros();
    const ids = { nome: 'f-nome', endereco: 'f-endereco', bairro: 'f-bairro', troco: 'f-troco' };
    let primeiro = null;
    const gerais = [];
    erros.forEach((e, i) => {
      const campo = e.campo && $('#' + ids[e.campo]);
      if (campo) {
        const p = document.createElement('p');
        p.className = 'campo-erro';
        p.id = 'erro-' + i;
        p.textContent = e.msg;
        const bloco = campo.closest('.campo');
        bloco.appendChild(p);
        campo.setAttribute('aria-invalid', 'true');
        campo.setAttribute('aria-describedby', p.id);
        if (!primeiro) primeiro = campo;
      } else gerais.push(e.msg);
    });
    if (gerais.length) $('#alertas').innerHTML = gerais.map((m) => `<p>${esc(m)}</p>`).join('');
    if (primeiro) {
      primeiro.focus({ preventScroll: true });
      primeiro.scrollIntoView({ block: 'center', behavior: reduzMovimento ? 'auto' : 'smooth' });
    }
    toast(erros[0].msg);
  }

  function abrirLink(url) {
    const w = window.open(url, '_blank');
    if (w) { try { w.opener = null; } catch (e) { /* ok */ } } else window.location.href = url;
  }

  function enviarPedido(ev) {
    ev.preventDefault();
    const dados = lerFormulario();
    const t = calcularTotais(estado.carrinho, dados.bairro);
    const erros = validarPedido(dados, t);
    if (erros.length) { mostrarErros(erros); return; }
    limparErros();

    const numero = (ler(CH.numero, 1026) || 1026) + 1;
    gravar(CH.numero, numero);
    const st = statusLoja(new Date());
    const pedido = criarPedido(numero, dados, t, new Date(), !st.aberto);
    const url = urlWhatsApp(montarMensagem(pedido));

    gravar(CH.pedidos, [pedido].concat(pedidos()).slice(0, 15));
    gravar(CH.cliente, { nome: dados.nome.trim(), endereco: dados.endereco.trim(), complemento: dados.complemento.trim(), bairro: dados.bairro, pagamento: dados.pagamento });

    abrirLink(url);

    estado.carrinho = {};
    salvarCarrinho();
    $('#f-obs').value = '';
    $('#f-troco').value = '';
    $('#f-sem-troco').checked = false;
    renderCarrinho();
    renderProdutos();
    renderCombos();
    atualizarContadores();
    renderPedidos();

    $('#sucesso-numero').textContent = numero;
    $('#sucesso-zap').href = url;
    $('#sucesso-fora').hidden = st.aberto;
    abrirDialogo($('#dlg-sucesso'));
  }

  /* ---------- Meus pedidos ---------- */
  function renderPedidos() {
    const lista = pedidos();
    $('#pedidos-vazio').hidden = lista.length > 0;
    $('#lista-pedidos').innerHTML = lista.map((p) => {
      const qtd = p.linhas.reduce((s, l) => s + l.qtd, 0);
      return `<li class="pedido">
        <div class="pedido-cab">
          <div><p class="pedido-num">Pedido nº ${p.numero}</p><p class="pedido-data">${esc(dataHora(p.data))}</p></div>
          <span class="pedido-status">Enviado pelo WhatsApp</span>
        </div>
        <div class="pedido-imgs" aria-hidden="true">${p.linhas.slice(0, 4).map((l) => { const pr = MAPA_PRODUTOS[l.pid]; return pr ? `<span>${svgProduto(pr.img)}</span>` : ''; }).join('')}${p.linhas.length > 4 ? `<span class="mais">+${p.linhas.length - 4}</span>` : ''}</div>
        <ul class="pedido-itens">${p.linhas.map((l) => `<li><span>${l.qtd}x ${esc(l.nome)}${l.rotulo ? ` <small>(${esc(l.rotulo)})</small>` : ''}</span><span>${brl(l.total)}</span></li>`).join('')}</ul>
        <p class="pedido-rodape"><span>${qtd} ${qtd === 1 ? 'item' : 'itens'} · ${esc(NOME_PAGAMENTO[p.pagamento] || '')} · ${esc(p.bairro)}</span><b>${brl(p.total)}</b></p>
        <button type="button" class="btn btn-largo" data-acao="repetir" data-num="${p.numero}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M18.5 3v4h-4M5.5 21v-4h4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Pedir de novo
        </button>
      </li>`;
    }).join('');
  }

  /* ---------- Loja ---------- */
  function renderLoja() {
    $('#tabela-horarios tbody').innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => `<tr data-dia="${d}"><th scope="row">${DIAS[d]}</th><td>${HORARIOS[d][0]}h às ${HORARIOS[d][1]}h</td></tr>`).join('');
    $('#lista-bairros').innerHTML = BAIRROS.filter((b) => b.taxa != null).map((b) => `<li><span>${esc(b.nome)} <small>${esc(b.cidade)}</small></span><b>${brl(b.taxa)}${b.gratisAcima ? `<small>grátis acima de ${brl(b.gratisAcima)}</small>` : ''}</b></li>`).join('');
    $('#info-minimo').textContent = brl(LOJA.pedidoMinimo);
    $('#loja-minimo').textContent = brl(LOJA.pedidoMinimo);
    $('#f-bairro').innerHTML = '<option value="">Selecione o bairro</option>' + BAIRROS.map((b) => `<option value="${b.id}">${esc(b.nome)}${b.taxa != null ? ` — ${b.gratisAcima ? `${brl(b.taxa)} (grátis acima de ${brl(b.gratisAcima)})` : brl(b.taxa)}` : ''}</option>`).join('');
  }

  /* ---------- Artes decorativas ---------- */
  function renderArtes() {
    const artes = {
      churras: [{ t: 'carvao' }, { t: 'lata', c: '#E8A317', c2: '#FFF6DA' }, { t: 'gelo', c: '#1E7FE0' }],
      gas: [{ t: 'botijao', c: '#E8483B', c2: '#9E2A20' }],
      agua: [{ t: 'galao' }, { t: 'garrafinha', c: '#BFE3FF', c2: '#1E88E5', tampa: '#1E88E5' }],
      carrinho: [{ t: 'kit', c: '#0B5BD3', cores: ['#E8A317', '#4A1A10', '#DFF1FF'] }],
      pedidos: [{ t: 'galao' }, { t: 'botijao', c: '#E8483B', c2: '#9E2A20' }],
    };
    $$('[data-arte]').forEach((el) => { el.innerHTML = (artes[el.dataset.arte] || []).map((i) => svgProduto(i)).join(''); });
    const kit = MAPA_PRODUTOS['kit-churrasco'];
    $('#banner-de').textContent = brl(kit.de);
    $('#banner-por').textContent = brl(kit.preco);
  }

  /* ---------- Carrossel de promoções ---------- */
  function iniciarBanners() {
    const trilho = $('#banners');
    const pontos = $$('#banner-pontos span');
    const slides = $$('.banner', trilho);
    let atual = 0, parado = reduzMovimento;
    const marcar = () => pontos.forEach((p, i) => p.classList.toggle('ativo', i === atual));
    trilho.addEventListener('scroll', () => {
      const i = Math.round(trilho.scrollLeft / trilho.clientWidth);
      if (i !== atual) { atual = i; marcar(); }
    }, { passive: true });
    ['pointerdown', 'focusin', 'touchstart'].forEach((ev) => trilho.addEventListener(ev, () => { parado = true; }, { passive: true }));
    marcar();
    setInterval(() => {
      if (parado || document.hidden || estado.aba !== 'inicio' || $('#bloco-banners').hidden) return;
      atual = (atual + 1) % slides.length;
      trilho.scrollTo({ left: atual * trilho.clientWidth, behavior: 'smooth' });
      marcar();
    }, 5000);
  }

  /* ---------- Abas (com o botão voltar do celular funcionando) ---------- */
  const ABAS = ['inicio', 'carrinho', 'pedidos', 'loja'];
  function mostrarAba(aba, ancora) {
    if (!ABAS.includes(aba)) aba = 'inicio';
    const mudou = aba !== estado.aba;
    estado.aba = aba;
    ABAS.forEach((a) => {
      const v = $('#view-' + a);
      v.hidden = a !== aba;
      if (a === aba && mudou && !reduzMovimento) { v.classList.remove('entrando'); void v.offsetWidth; v.classList.add('entrando'); }
    });
    $$('.nav-item').forEach((n) => { if (n.dataset.aba === aba) n.setAttribute('aria-current', 'page'); else n.removeAttribute('aria-current'); });
    if (aba === 'carrinho') renderCarrinho();
    if (aba === 'pedidos') renderPedidos();
    atualizarContadores();
    if (ancora && $('#' + ancora)) setTimeout(() => $('#' + ancora).scrollIntoView({ behavior: reduzMovimento ? 'auto' : 'smooth', block: 'start' }), 30);
    else if (mudou) window.scrollTo(0, 0);
  }
  function irPara(aba, ancora) {
    if (location.hash !== '#' + aba) { estado.ancoraPendente = ancora; location.hash = aba; } else mostrarAba(aba, ancora);
  }
  window.addEventListener('hashchange', () => {
    const anc = estado.ancoraPendente; estado.ancoraPendente = null;
    mostrarAba(location.hash.slice(1) || 'inicio', anc);
  });

  /* ---------- Instalação (PWA) ---------- */
  let pedidoInstalacao = null;
  const ehIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const instalado = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  function atualizarInstalar() {
    const ja = instalado();
    const podeMostrar = !ja && (pedidoInstalacao || ehIOS);
    $$('.btn-instalar-topo').forEach((b) => { b.hidden = !podeMostrar; });
    $('#btn-instalar-loja').hidden = ja;
    $('#instalado-msg').hidden = !ja;
    $('#aviso-instalar').hidden = !podeMostrar || ler(CH.avisoInstalar, false);
  }

  async function instalar() {
    if (pedidoInstalacao) {
      pedidoInstalacao.prompt();
      try {
        const escolha = await pedidoInstalacao.userChoice;
        if (escolha && escolha.outcome === 'accepted') toast('Instalando o app…');
      } catch (e) { /* ignorado */ }
      pedidoInstalacao = null;
      atualizarInstalar();
      return;
    }
    $('#passos-ios').hidden = !ehIOS;
    $('#passos-outros').hidden = ehIOS;
    abrirDialogo($('#dlg-instalar'));
  }

  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); pedidoInstalacao = e; atualizarInstalar(); });
  window.addEventListener('appinstalled', () => { pedidoInstalacao = null; atualizarInstalar(); toast('App instalado! Procure o ícone da Maré Alta na tela inicial.'); });

  function abrirDialogo(dlg) {
    dlg.returnValue = '';
    if (typeof dlg.showModal === 'function') { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute('open', '');
  }
  $$('dialog').forEach((dlg) => {
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close ? dlg.close() : dlg.removeAttribute('open'); });
  });

  /* ---------- Espaço para o selo de demonstração ---------- */
  // Se o visitante fechar o selo, a barra de navegação volta ao tamanho normal.
  new MutationObserver((muts) => {
    muts.forEach((m) => m.removedNodes.forEach((n) => { if (n.classList && n.classList.contains('selo-demo')) document.documentElement.classList.add('sem-selo'); }));
  }).observe(document.body, { childList: true });
  window.addEventListener('load', () => { setTimeout(() => { if (!document.querySelector('.selo-demo')) document.documentElement.classList.add('sem-selo'); }, 1500); });

  /* ---------- Eventos ---------- */
  document.addEventListener('click', (e) => {
    const alvo = e.target.closest('[data-acao]');
    if (!alvo) return;
    const acao = alvo.dataset.acao;
    if (acao === 'mais') mudarQtd(alvo.dataset.chave, 1);
    else if (acao === 'menos') mudarQtd(alvo.dataset.chave, -1);
    else if (acao === 'opcao') { estado.opcaoSel[alvo.dataset.pid] = alvo.dataset.oid; atualizarCard(alvo.dataset.pid); }
    else if (acao === 'categoria') { if (estado.aba !== 'inicio') { mostrarAba('inicio'); location.hash = 'inicio'; } escolherCategoria(alvo.dataset.cat, true); }
    else if (acao === 'ir-aba') irPara(alvo.dataset.aba, alvo.dataset.ancora);
    else if (acao === 'instalar') instalar();
    else if (acao === 'ver-pedidos') { const d = $('#dlg-sucesso'); if (d.close) d.close(); else d.removeAttribute('open'); irPara('pedidos'); }
    else if (acao === 'fechar-aviso-instalar') { gravar(CH.avisoInstalar, true); atualizarInstalar(); }
    else if (acao === 'limpar-carrinho') {
      if (window.confirm('Tirar todos os itens do carrinho?')) {
        estado.carrinho = {}; salvarCarrinho(); renderCarrinho(); renderProdutos(); renderCombos(); atualizarContadores(); toast('Carrinho esvaziado');
      }
    } else if (acao === 'repetir') {
      const p = pedidos().find((x) => String(x.numero) === alvo.dataset.num);
      if (!p) return;
      const r = repetirPedido(estado.carrinho, p);
      estado.carrinho = r.carrinho; salvarCarrinho();
      renderProdutos(); renderCombos(); atualizarContadores();
      toast(r.adicionados ? `Itens do pedido nº ${p.numero} no carrinho` : 'Esses produtos não estão mais disponíveis');
      if (r.adicionados) irPara('carrinho');
    }
  });

  let timerBusca;
  $('#campo-busca').addEventListener('input', (e) => {
    clearTimeout(timerBusca);
    $('#busca-limpar').hidden = !e.target.value;
    timerBusca = setTimeout(() => { estado.busca = e.target.value; renderProdutos(); }, 120);
  });
  $('#form-busca').addEventListener('submit', (e) => { e.preventDefault(); $('#campo-busca').blur(); $('#lista-produtos').scrollIntoView({ behavior: reduzMovimento ? 'auto' : 'smooth' }); });
  $('#busca-limpar').addEventListener('click', () => { $('#campo-busca').value = ''; estado.busca = ''; $('#busca-limpar').hidden = true; renderProdutos(); $('#campo-busca').focus(); });

  $('#form-pedido').addEventListener('submit', enviarPedido);
  $('#f-bairro').addEventListener('change', () => { renderResumo(); atualizarContadores(); });
  $$('input[name="pagamento"]').forEach((r) => r.addEventListener('change', () => atualizarTroco()));
  $('#f-troco').addEventListener('input', () => atualizarTroco());
  $('#f-sem-troco').addEventListener('change', () => atualizarTroco());
  $('#form-pedido').addEventListener('input', (e) => {
    if (e.target.getAttribute('aria-invalid') === 'true') {
      e.target.removeAttribute('aria-invalid');
      const bloco = e.target.closest('.campo');
      const erro = bloco && bloco.querySelector('.campo-erro');
      if (erro) erro.remove();
    }
  });

  /* ---------- Início ---------- */
  renderLoja();
  renderArtes();
  renderChips();
  renderCombos();
  renderProdutos();

  // Dados do último pedido já vêm preenchidos
  const cliente = ler(CH.cliente, null);
  if (cliente) {
    $('#f-nome').value = cliente.nome || '';
    $('#f-endereco').value = cliente.endereco || '';
    $('#f-complemento').value = cliente.complemento || '';
    if (BAIRROS.some((b) => b.id === cliente.bairro)) $('#f-bairro').value = cliente.bairro;
    const r = $(`input[name="pagamento"][value="${cliente.pagamento}"]`);
    if (r) r.checked = true;
  }

  // Atalhos do ícone do app: ?cat=gas, ?aba=pedidos
  const params = new URLSearchParams(location.search);
  if (params.get('cat') && CATEGORIAS.some((c) => c.id === params.get('cat'))) escolherCategoria(params.get('cat'), false);
  const abaInicial = params.get('aba') || location.hash.slice(1) || 'inicio';
  estado.aba = null;
  mostrarAba(abaInicial);
  if (params.get('cat')) setTimeout(() => escolherCategoria(params.get('cat'), true), 50);

  renderStatus();
  setInterval(() => { renderStatus(); if (estado.aba === 'carrinho') renderResumo(); }, 60000);
  atualizarInstalar();
  iniciarBanners();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => { navigator.serviceWorker.register('./service-worker.js').catch(() => { /* sem offline */ }); });
  }
}
