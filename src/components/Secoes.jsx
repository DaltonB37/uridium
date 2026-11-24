import {
  Search, Smartphone, MessageCircle, Check, Minus, QrCode, CreditCard, Handshake,
  Gauge, PenTool, KeyRound, MapPin, Headphones, Gift, Plus, AtSign, Mail,
} from 'lucide-react'
import { Secao, BotaoZap, Logo, IconeZap, preco } from './ui'
import { AGENCIA, PLANOS, MANUTENCAO, linkWhatsApp } from '../config'

/* ---------- Nichos + benefícios ---------- */
const NICHOS = [
  'Barbearias', 'Salões de beleza', 'Clínicas', 'Dentistas', 'Restaurantes', 'Lanchonetes',
  'Academias', 'Estética', 'Oficinas', 'Pet shops', 'Advogados', 'Professores', 'Lojas de bairro',
]

export function Nichos() {
  const lista = [...NICHOS, ...NICHOS]
  return (
    <section className="border-y border-borda bg-noite/60 py-6" aria-label="Negócios que atendemos">
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <ul className="faixa flex w-max gap-10 font-display text-xl font-semibold text-suave/70 md:text-2xl">
          {lista.map((n, i) => (
            <li key={i} className="flex items-center gap-10" aria-hidden={i >= NICHOS.length}>
              {n} <span className="text-roxo">✦</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const BENEFICIOS = [
  {
    icone: Search,
    titulo: 'Encontrado no Google',
    texto: 'Quem procura "barbearia perto de mim" precisa achar você, não o concorrente. Seu site e seu perfil no Google trabalham juntos.',
  },
  {
    icone: Smartphone,
    titulo: 'Abre rápido no celular',
    texto: 'Quase todo cliente chega pelo celular. O site carrega em segundos e mostra o essencial logo de cara.',
  },
  {
    icone: MessageCircle,
    titulo: 'Leva direto ao WhatsApp',
    texto: 'Um toque e o cliente já está na sua conversa, com a mensagem escrita. Menos atrito, mais pedidos.',
  },
]

export function Beneficios() {
  return (
    <Secao
      className="fundo-pontos isolate"
      titulo="Um site que faz o cliente chamar você"
      subtitulo="Não é cartão de visita digital. É uma página feita para transformar visita em conversa e conversa em venda."
    >
      <div className="grid gap-px overflow-hidden rounded-3xl border border-borda bg-borda md:grid-cols-3">
        {BENEFICIOS.map(({ icone: Icone, titulo, texto }) => (
          <article key={titulo} className="bg-espaco/80 p-8 backdrop-blur-sm">
            <Icone className="h-7 w-7 text-roxo-claro" strokeWidth={1.75} />
            <h3 className="mt-5 text-xl font-semibold">{titulo}</h3>
            <p className="mt-3 text-suave">{texto}</p>
          </article>
        ))}
      </div>
    </Secao>
  )
}

/* ---------- Comparativo ---------- */
const COMPARA = [
  {
    nome: 'Agência tradicional',
    preco: 'R$ 2.500 ou mais',
    linhas: [
      ['Prazo de 30 a 60 dias', false],
      ['Várias reuniões e intermediários', false],
      ['Site completo e personalizado', true],
    ],
  },
  {
    nome: 'Construtor "faça você mesmo"',
    preco: 'R$ 40 a R$ 100 por mês',
    linhas: [
      ['Mensalidade para sempre', false],
      ['Você monta tudo sozinho', false],
      ['Se parar de pagar, o site sai do ar', false],
    ],
  },
]

export function Comparativo() {
  return (
    <Secao
      id="comparativo"
      className="fundo-faixa"
      titulo="Quanto custa ter um site de verdade?"
      subtitulo="Comparamos com os caminhos mais comuns para um pequeno negócio."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {COMPARA.map((c) => (
          <article key={c.nome} className="rounded-3xl border border-borda bg-noite/50 p-7">
            <h3 className="text-lg font-semibold text-suave">{c.nome}</h3>
            <p className="mt-2 font-display text-2xl font-bold">{c.preco}</p>
            <ul className="mt-6 space-y-3 text-sm">
              {c.linhas.map(([t, ok]) => (
                <li key={t} className="flex gap-2.5 text-suave">
                  {ok ? <Check className="h-5 w-5 shrink-0 text-suave" /> : <Minus className="h-5 w-5 shrink-0 text-suave/60" />}
                  {t}
                </li>
              ))}
            </ul>
          </article>
        ))}
        <article className="relative rounded-3xl bg-gradient-to-br from-roxo to-magenta p-px">
          <div className="h-full rounded-[calc(1.5rem-1px)] bg-noite p-7">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-roxo-claro">Uridium</h3>
            <p className="mt-2 font-display text-2xl font-bold">A partir de R$ {preco(PLANOS[0].preco)}</p>
            <ul className="mt-6 space-y-3 text-sm">
              {['Pronto em até 7 dias úteis', 'Pagamento único, sem mensalidade obrigatória', 'O site e os arquivos são seus'].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <Check className="h-5 w-5 shrink-0 text-zap" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
      <p className="mt-5 text-sm text-suave/80">
        Valores de referência de mercado, que variam conforme a região e o profissional.
      </p>
    </Secao>
  )
}

/* ---------- Como funciona ---------- */
const PASSOS = [
  ['Conversa no WhatsApp', 'Você conta sobre o seu negócio em uma conversa rápida. Sem reunião, sem formulário gigante.'],
  ['Proposta e entrada', 'Mandamos o plano ideal e o prazo. Com 50% de entrada, começamos no mesmo dia.'],
  ['Você vê e ajusta', 'Enviamos o link da primeira versão para você ver no seu celular e pedir os ajustes.'],
  ['Site no ar', 'Aprovou, pagou o restante, publicamos. Você recebe o site e todos os arquivos.'],
]

export function ComoFunciona() {
  return (
    <Secao id="como-funciona" className="fundo-orbitas isolate overflow-hidden" titulo="Do primeiro oi ao site no ar" subtitulo="Quatro etapas, tudo pelo WhatsApp.">
      <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {PASSOS.map(([titulo, texto], i) => (
          <li key={titulo} className="relative rounded-3xl border border-borda p-7">
            <span className="font-display text-5xl font-extrabold text-transparent [-webkit-text-stroke:1.5px_#8B5CF6]">
              {i + 1}
            </span>
            <h3 className="mt-4 text-lg font-semibold">{titulo}</h3>
            <p className="mt-2 text-sm text-suave">{texto}</p>
          </li>
        ))}
      </ol>
    </Secao>
  )
}

/* ---------- Planos ---------- */
export function Planos() {
  return (
    <Secao
      id="planos"
      centro
      className="bg-[radial-gradient(ellipse_at_top,#8B5CF61f,transparent_60%)]"
      titulo="Prefere um site sob medida?"
      subtitulo="Criamos do zero, com a cara do seu negócio. Preço fechado, metade para começar e metade só quando você aprovar."
    >
      <div className="grid items-stretch gap-5 lg:grid-cols-3">
        {PLANOS.map((p) => (
          <article
            key={p.nome}
            className={`relative flex flex-col rounded-3xl p-8 text-left ${
              p.destaque
                ? 'border-2 border-roxo bg-noite shadow-[0_30px_80px_-30px_#8B5CF6aa] lg:-my-4 lg:py-12'
                : 'border border-borda bg-noite/40'
            }`}
          >
            {p.destaque && (
              <span className="absolute -top-3.5 left-8 rounded-full bg-gradient-to-r from-roxo to-magenta px-3.5 py-1 text-xs font-semibold">
                Recomendado
              </span>
            )}
            <h3 className="text-xl font-semibold">{p.nome}</h3>
            <p className="mt-1.5 text-sm text-suave">{p.resumo}</p>
            <p className="mt-6 flex items-baseline gap-1.5">
              <span className="text-suave">R$</span>
              <span className="font-display text-5xl font-extrabold">{preco(p.preco)}</span>
            </p>
            <p className="mt-1 text-sm text-suave">
              Pronto em {p.prazo}. Entrada de R$ {preco(p.preco / 2)}.
            </p>
            <ul className="mt-7 flex-1 space-y-3 text-sm">
              {p.itens.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <Check className="h-5 w-5 shrink-0 text-zap" />
                  {item}
                </li>
              ))}
            </ul>
            <BotaoZap
              mensagem={`Olá! Vim pelo site da Uridium e tenho interesse no plano ${p.nome} (R$ ${preco(p.preco)}).`}
              className={`mt-8 w-full ${p.destaque ? '' : '!bg-texto !shadow-none'}`}
            >
              Quero o {p.nome}
            </BotaoZap>
          </article>
        ))}
      </div>
      <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-between gap-4 rounded-2xl border border-borda bg-noite/40 px-6 py-5 text-left sm:flex-row">
        <p>
          <strong className="font-semibold">Manutenção opcional por R$ {MANUTENCAO}/mês.</strong>{' '}
          <span className="text-suave">Trocamos textos e fotos, cuidamos da hospedagem e damos suporte.</span>
        </p>
        <a href={linkWhatsApp('Olá! Quero saber mais sobre a manutenção mensal do site.')} target="_blank" rel="noopener noreferrer" className="shrink-0 text-sm font-semibold text-roxo-claro underline-offset-4 hover:underline">
          Saber mais
        </a>
      </div>
    </Secao>
  )
}

/* ---------- Pagamento ---------- */
export function Pagamento() {
  const formas = [
    { icone: QrCode, titulo: 'Pix', texto: 'Na hora, sem taxa. Começamos assim que o pagamento cair.' },
    { icone: CreditCard, titulo: 'Cartão de crédito', texto: 'Por link de pagamento seguro, com opção de parcelar.' },
    { icone: Handshake, titulo: '50% agora, 50% na entrega', texto: 'Você só paga o restante depois de ver e aprovar o site.' },
  ]
  return (
    <Secao className="fundo-faixa" titulo="Pagamento simples e seguro">
      <div className="grid gap-5 md:grid-cols-3">
        {formas.map(({ icone: Icone, titulo, texto }) => (
          <article key={titulo} className="flex gap-4 rounded-3xl border border-borda p-6">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-roxo/15">
              <Icone className="h-6 w-6 text-roxo-claro" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="font-semibold">{titulo}</h3>
              <p className="mt-1 text-sm text-suave">{texto}</p>
            </div>
          </article>
        ))}
      </div>
    </Secao>
  )
}

/* ---------- Vantagens ---------- */
const VANTAGENS = [
  [Gauge, 'Rápido de verdade', 'Site leve, que abre em segundos até no 4G.'],
  [PenTool, 'Feito para você', 'Nada de modelo genérico. Cores, textos e fotos do seu negócio.'],
  [KeyRound, 'Tudo seu', 'Você recebe os arquivos e pode levar para onde quiser.'],
  [MapPin, 'Foco no local', 'Pensado para quem atende no bairro e na cidade.'],
  [MessageCircle, 'Tudo no WhatsApp', 'Atendimento, aprovação e suporte no app que você já usa.'],
  [Headphones, 'Suporte de gente', 'Fala direto com quem fez o seu site.'],
]

export function Vantagens() {
  return (
    <Secao titulo="Por que a Uridium" subtitulo="O que você ganha trabalhando com uma agência pequena e focada.">
      <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {VANTAGENS.map(([Icone, titulo, texto]) => (
          <div key={titulo} className="flex gap-4">
            <Icone className="mt-0.5 h-6 w-6 shrink-0 text-roxo-claro" strokeWidth={1.75} />
            <div>
              <h3 className="font-semibold">{titulo}</h3>
              <p className="mt-1 text-sm text-suave">{texto}</p>
            </div>
          </div>
        ))}
      </div>
    </Secao>
  )
}

/* ---------- Indique e ganhe ---------- */
export function Indicacao() {
  return (
    <section className="px-5 py-10">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-roxo via-[#A855F7] to-magenta p-8 md:p-14">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border-[28px] border-white/10" />
        <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <Gift className="h-9 w-9" strokeWidth={1.75} />
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">Indique e ganhe R$ 100</h2>
            <p className="mt-3 max-w-lg text-white/85">
              Conhece um negócio que precisa de site? Indique. Se ele fechar com a gente, você recebe
              R$ 100 no Pix ou 2 meses de manutenção grátis.
            </p>
          </div>
          <a
            href={linkWhatsApp('Olá! Quero indicar um negócio para a Uridium.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-espaco px-6 py-4 font-semibold transition hover:bg-noite md:justify-self-end"
          >
            <IconeZap /> Quero indicar
          </a>
        </div>
      </div>
    </section>
  )
}

/* ---------- Conversa de exemplo ---------- */
const CONVERSA = [
  ['cliente', 'Oi! Tenho uma lanchonete e queria um site. Como funciona?'],
  ['agencia', 'Oi! Que bom. Me conta: hoje seus pedidos chegam mais pelo WhatsApp ou pelo iFood?'],
  ['cliente', 'Pelo WhatsApp, mas o pessoal sempre pergunta o cardápio.'],
  ['agencia', 'Então o ideal é o Site Profissional: cardápio com fotos e o botão que já manda o pedido para você. Fica pronto em até 7 dias úteis.'],
  ['cliente', 'Gostei! Como pago?'],
  ['agencia', 'Metade no Pix para começar e metade quando você aprovar. Posso mandar a proposta?'],
]

export function Conversa() {
  return (
    <Secao
      className="fundo-zap"
      titulo="Atendimento sem enrolação"
      subtitulo="Exemplo de como é uma conversa com a gente: perguntas diretas, proposta clara e você no controle."
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="rounded-3xl border border-borda bg-[#0B141A] p-5 md:p-7">
          <div className="space-y-2.5 text-[15px]">
            {CONVERSA.map(([quem, texto], i) => (
              <p
                key={i}
                className={`max-w-[85%] rounded-xl px-3.5 py-2 ${
                  quem === 'cliente' ? 'rounded-tl-none bg-[#1F2C34]' : 'ml-auto rounded-tr-none bg-[#005C4B]'
                }`}
              >
                {texto}
              </p>
            ))}
          </div>
        </div>
        <div>
          <ul className="space-y-5">
            {[
              ['Resposta no mesmo dia', 'Em horário comercial, respondemos rápido.'],
              ['Proposta por escrito', 'Você sabe exatamente o que vai receber, quanto custa e quando fica pronto.'],
              ['Acompanhamento pelo link', 'Você vê o site sendo construído no seu próprio celular.'],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-zap" />
                <div>
                  <p className="font-semibold">{t}</p>
                  <p className="text-sm text-suave">{d}</p>
                </div>
              </li>
            ))}
          </ul>
          <BotaoZap className="mt-8">Começar minha conversa</BotaoZap>
        </div>
      </div>
    </Secao>
  )
}

/* ---------- Dúvidas ---------- */
const DUVIDAS = [
  ['Preciso pagar mensalidade?', `Não. O site tem pagamento único. A manutenção de R$ ${MANUTENCAO}/mês é opcional, para quem quer que a gente cuide das alterações e da hospedagem.`],
  ['Em quanto tempo o site fica pronto?', 'De 5 a 10 dias úteis, conforme o plano. O prazo começa a contar quando recebemos a entrada e as informações do seu negócio (textos, fotos e logo, se tiver).'],
  ['E se eu não tiver fotos ou logo?', 'Sem problema. Usamos imagens de bancos gratuitos e de qualidade, e o plano Presença Completa inclui um logo simples para o seu negócio.'],
  ['Preciso ter domínio (.com.br)?', 'Não para começar: o site pode ir ao ar num endereço gratuito. Quando quiser, você registra o seu domínio (custa cerca de R$ 40 por ano no Registro.br) e nós conectamos.'],
  ['O site é meu mesmo?', 'Sim. Você recebe todos os arquivos. Se um dia quiser trocar de hospedagem ou de profissional, leva tudo com você.'],
  ['Posso pedir alterações depois de pronto?', 'Sim. As rodadas de ajuste do plano valem até a aprovação. Depois disso, alterações entram na manutenção mensal ou são orçadas à parte.'],
  ['Vocês atendem fora do Espírito Santo?', 'Sim. Todo o atendimento é pelo WhatsApp, então atendemos negócios de qualquer cidade do Brasil.'],
]

export function Duvidas() {
  return (
    <Secao id="duvidas" titulo="Perguntas frequentes">
      <div className="max-w-3xl divide-y divide-borda border-y border-borda">
        {DUVIDAS.map(([p, r]) => (
          <details key={p} className="group py-5">
            <summary className="flex items-center justify-between gap-6 text-lg font-medium">
              {p}
              <Plus className="seta h-5 w-5 shrink-0 text-roxo-claro transition-transform" />
            </summary>
            <p className="mt-3 pr-10 text-suave">{r}</p>
          </details>
        ))}
      </div>
    </Secao>
  )
}

/* ---------- Chamada final + rodapé ---------- */
export function ChamadaFinal() {
  return (
    <Secao centro className="horizonte isolate pb-40 md:pb-56">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold md:text-5xl">Vamos colocar o seu negócio em órbita?</h2>
        <p className="mt-5 text-lg text-suave">Mande um oi. A gente responde com uma proposta sob medida.</p>
        <BotaoZap className="mt-9 px-8 py-4 text-lg">Falar no WhatsApp</BotaoZap>
      </div>
    </Secao>
  )
}

export function Rodape() {
  const ano = new Date().getFullYear()
  return (
    <footer className="border-t border-borda px-5 pb-28 pt-14 md:pb-14">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-suave">{AGENCIA.slogan} {AGENCIA.cidade}.</p>
          <p className="mt-3 max-w-sm text-xs leading-relaxed text-suave/70">Por que Uridium? É o nome de um metal que nunca existiu: nasceu em 1986 de um engano com o irídio, um dos metais mais raros da Terra, e virou a moeda mais valiosa dos jogos de nave. Um erro que virou raridade, como o negócio que ninguém consegue copiar.</p>
        </div>
        <nav aria-label="Rodapé">
          <p className="mb-3 font-semibold">Navegue</p>
          <ul className="space-y-2 text-sm text-suave">
            <li><a className="hover:text-texto" href="#como-funciona">Como funciona</a></li>
            <li><a className="hover:text-texto" href="#planos">Planos e preços</a></li>
            <li><a className="hover:text-texto" href="#duvidas">Perguntas frequentes</a></li>
          </ul>
        </nav>
        <div>
          <p className="mb-3 font-semibold">Contato</p>
          <ul className="space-y-2 text-sm text-suave">
            <li><a className="inline-flex items-center gap-2 hover:text-texto" href={linkWhatsApp('Olá! Vim pelo site da Uridium.')} target="_blank" rel="noopener noreferrer"><IconeZap className="h-4 w-4" /> WhatsApp</a></li>
            {AGENCIA.email && <li><a className="inline-flex items-center gap-2 hover:text-texto" href={`mailto:${AGENCIA.email}`}><Mail className="h-4 w-4" /> {AGENCIA.email}</a></li>}
            <li><a className="inline-flex items-center gap-2 hover:text-texto" href={AGENCIA.instagram} target="_blank" rel="noopener noreferrer"><AtSign className="h-4 w-4" /> Instagram</a></li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl text-xs text-suave/70">© {ano} {AGENCIA.nome}. Todos os direitos reservados.</p>
    </footer>
  )
}

export function BotaoFlutuante() {
  return (
    <a
      href={linkWhatsApp('Olá! Vim pelo site da Uridium e quero um orçamento.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-zap text-espaco shadow-[0_10px_30px_-5px_#25D36699] transition hover:scale-105"
    >
      <IconeZap className="h-7 w-7" />
    </a>
  )
}
