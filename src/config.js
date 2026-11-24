// ============================================================
//  DADOS DA AGÊNCIA — edite aqui e o site inteiro se atualiza
// ============================================================

export const AGENCIA = {
  nome: 'Órbita Digital',
  slogan: 'Sites que vendem pelo WhatsApp.',
  // Só números, com 55 + DDD. Ex.: '5527999998888'
  whatsapp: '55XXXXXXXXXXX', // PREENCHER
  email: 'contato@orbitadigital.com.br', // PREENCHER
  instagram: 'https://instagram.com/', // PREENCHER
  cidade: 'Grande Vitória, ES — atendimento em todo o Brasil',
}

export function linkWhatsApp(mensagem) {
  const texto = encodeURIComponent(mensagem)
  return `https://wa.me/${AGENCIA.whatsapp}?text=${texto}`
}

export const MSG_PADRAO =
  'Olá! Vim pelo site da Órbita Digital e quero um orçamento para o site do meu negócio.'

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
