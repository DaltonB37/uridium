// ============================================================
//  DADOS DA AGÊNCIA — edite aqui e o site inteiro se atualiza
// ============================================================

export const AGENCIA = {
  nome: 'Uridium',
  slogan: 'Sites que vendem pelo WhatsApp.',
  // Só números, com 55 + DDD. Ex.: '5527999998888'
  whatsapp: '55XXXXXXXXXXX', // PREENCHER
  email: '', // PREENCHER quando criar (ex.: o Gmail da agência). Vazio = não aparece no site
  instagram: 'https://instagram.com/', // PREENCHER
  cidade: 'Grande Vitória, ES — atendimento em todo o Brasil',
}

export function linkWhatsApp(mensagem) {
  const texto = encodeURIComponent(mensagem)
  return `https://wa.me/${AGENCIA.whatsapp}?text=${texto}`
}

export const MSG_PADRAO =
  'Olá! Vim pelo site da Uridium e quero um orçamento para o site do meu negócio.'

export const PLANOS = [
  {
    nome: 'Site Essencial',
    preco: 497,
    prazo: 'até 5 dias úteis',
    resumo: 'Para começar a aparecer e receber contatos.',
    itens: [
      'Página única com até 6 seções',
      'Botão de WhatsApp com mensagem pronta',
      'Adaptado para celular',
      'Publicação inclusa',
      '1 rodada de ajustes',
    ],
  },
  {
    nome: 'Site Profissional',
    preco: 897,
    prazo: 'até 7 dias úteis',
    resumo: 'O site completo para vender todo dia.',
    destaque: true,
    itens: [
      'Até 12 seções com animações',
      'Botão de WhatsApp com mensagem pronta',
      'SEO básico para aparecer no Google',
      'Perfil no Google Meu Negócio',
      'Configuração do WhatsApp Business',
      '2 rodadas de ajustes',
    ],
  },
  {
    nome: 'Presença Completa',
    preco: 1497,
    prazo: 'até 10 dias úteis',
    resumo: 'Site, marca e redes sociais prontos juntos.',
    itens: [
      'Tudo do Site Profissional',
      'Logo simples para o seu negócio',
      '10 artes para o Instagram',
      'Catálogo de produtos no WhatsApp',
      '2 rodadas de ajustes',
    ],
  },
]

export const MANUTENCAO = 59

// ------------------------------------------------------------
//  PACOTES PROMOCIONAIS (preço de lançamento)
//  "de" = soma dos preços avulsos deste arquivo. Mude "por" à vontade.
// ------------------------------------------------------------
export const COMBOS = [
  {
    nome: 'Site + Google',
    resumo: 'Para ser achado por quem procura perto de você.',
    itens: ['Site Essencial', 'Perfil no Google Meu Negócio (Maps)'],
    de: 497 + 147,
    por: 597,
  },
  {
    nome: 'Site + WhatsApp pronto',
    resumo: 'Para atender rápido e com cara de empresa.',
    itens: ['Site Essencial', 'WhatsApp Business configurado', 'Cartão digital com QR Code'],
    de: 497 + 147 + 97,
    por: 647,
  },
  {
    nome: 'Começar do zero',
    resumo: 'Para quem ainda não tem nem logo.',
    itens: ['Kit logomarca', 'Site Essencial', 'Google Meu Negócio', 'WhatsApp Business configurado'],
    de: 297 + 497 + 147 + 147,
    por: 897,
    destaque: true,
  },
  {
    nome: 'Projeto pronto + Google + WhatsApp',
    resumo: 'Escolha uma demo e já saia aparecendo no Google.',
    itens: ['Qualquer projeto pronto da lista acima', 'Google Meu Negócio', 'WhatsApp Business configurado'],
    de: null,
    adicional: 197,
    adicionalDe: 147 + 147,
  },
]

// ------------------------------------------------------------
//  PROJETOS PRONTOS (demos funcionais em public/demos/<pasta>)
// ------------------------------------------------------------
export const PROJETOS = [
  {
    pasta: 'barbearia',
    nicho: 'Barbearias e salões',
    nome: 'Site com agendamento',
    icone: 'Scissors',
    cor: ['#F59E0B', '#B45309'],
    preco: 697,
    prazo: '3 dias úteis',
    itens: ['Cliente escolhe serviço, barbeiro, dia e horário', 'Agendamento chega pronto no WhatsApp', 'Clube de assinatura e galeria de cortes'],
  },
  {
    pasta: 'distribuidora',
    nicho: 'Distribuidoras e delivery',
    nome: 'App de pedidos',
    icone: 'Truck',
    cor: ['#22D3EE', '#2563EB'],
    preco: 1297,
    prazo: '5 dias úteis',
    itens: ['Instala no Android e no iPhone, sem loja de apps', 'Carrinho, taxa por bairro e troco', 'Pedido organizado direto no WhatsApp'],
  },
  {
    pasta: 'lanchonete',
    nicho: 'Lanchonetes e restaurantes',
    nome: 'Cardápio digital',
    icone: 'Sandwich',
    cor: ['#FB7185', '#E11D48'],
    preco: 597,
    prazo: '3 dias úteis',
    itens: ['Adicionais, ponto da carne e observações', 'Entrega ou retirada, sem comissão de app', 'Aviso de aberto e fechado automático'],
  },
  {
    pasta: 'estetica',
    nicho: 'Clínicas e estética',
    nome: 'Site com quiz e agenda',
    icone: 'Sparkles',
    cor: ['#A3E635', '#4D7C0F'],
    preco: 997,
    prazo: '5 dias úteis',
    itens: ['Quiz que indica o tratamento ideal', 'Agendamento de avaliação', 'Pacotes e vale-presente'],
  },
  {
    pasta: 'loja',
    nicho: 'Lojas de roupas e acessórios',
    nome: 'Vitrine online',
    icone: 'Shirt',
    cor: ['#F472B6', '#9333EA'],
    preco: 897,
    prazo: '4 dias úteis',
    itens: ['Catálogo com filtros, cores e tamanhos', 'Sacola com cupom de desconto', 'Venda finalizada no WhatsApp'],
  },
]

// ------------------------------------------------------------
//  ESTÚDIO — outros produtos e serviços
// ------------------------------------------------------------
export const SERVICOS = [
  { cat: 'Marca', icone: 'PenTool', nome: 'Kit logomarca', preco: 297, unidade: '', desc: 'Logo em versões para fundo claro e escuro, ícone, paleta de cores, foto de perfil e guia de uso.' },
  { cat: 'Marca', icone: 'QrCode', nome: 'Cartão digital + QR Code', preco: 97, unidade: '', desc: 'Cartão de visita digital com seus links e um QR Code pronto para imprimir no balcão.' },
  { cat: 'Vídeo', icone: 'Clapperboard', nome: 'Vídeo animado para Reels', preco: 197, unidade: 'por vídeo', desc: 'Vídeo de até 30 segundos com animação, texto e trilha, no formato vertical das redes.' },
  { cat: 'Vídeo', icone: 'Film', nome: 'Edição de vídeo', preco: 147, unidade: 'por vídeo', desc: 'Você grava, a gente edita: cortes, ritmo, trilha e legenda. Até 3 minutos.' },
  { cat: 'Vídeo', icone: 'Captions', nome: 'Legendas animadas', preco: 47, unidade: 'por vídeo', desc: 'Legenda no estilo das redes, palavra por palavra, que prende a atenção. Até 3 minutos.' },
  { cat: 'Vídeo', icone: 'Languages', nome: 'Tradução de vídeo', preco: 97, unidade: 'por vídeo', desc: 'Legenda traduzida para inglês ou espanhol, para falar com clientes de fora. Até 5 minutos.' },
  { cat: 'Vídeo', icone: 'Mic', nome: 'Narração com voz natural', preco: 67, unidade: 'por vídeo', desc: 'Locução em português com voz natural para vídeos institucionais e anúncios. Até 1 minuto.' },
  { cat: 'Redes', icone: 'LayoutGrid', nome: 'Pacote de 10 artes', preco: 197, unidade: '', desc: 'Dez artes para Instagram com a sua identidade: promoções, avisos, produtos e datas.' },
  { cat: 'Configuração', icone: 'MessageCircle', nome: 'WhatsApp Business pronto', preco: 147, unidade: '', desc: 'Perfil, catálogo, mensagem de boas-vindas, ausência e respostas rápidas configurados.' },
  { cat: 'Configuração', icone: 'MapPin', nome: 'Google Meu Negócio', preco: 147, unidade: '', desc: 'Seu negócio no Google Maps com fotos, horários e descrição otimizada para ser encontrado.' },
]
