import { useState } from 'react'
import {
  Check, ExternalLink, Circle, Scissors, Truck, Sandwich, Sparkles, Shirt, PenTool, QrCode,
  Clapperboard, Film, Captions, Languages, Mic, LayoutGrid, MessageCircle, MapPin,
} from 'lucide-react'

const Icones = { Scissors, Truck, Sandwich, Sparkles, Shirt, PenTool, QrCode, Clapperboard, Film, Captions, Languages, Mic, LayoutGrid, MessageCircle, MapPin }
import { Secao, BotaoZap, preco } from './ui'
import { PROJETOS, SERVICOS, MANUTENCAO } from '../config'

function Icone({ nome, ...props }) {
  const C = Icones[nome] || Circle
  return <C {...props} />
}

/* Mini "tela de celular" que representa a demo no card */
function PreviaCelular({ projeto }) {
  const [a, b] = projeto.cor
  return (
    <div
      className="relative mx-auto h-44 w-28 rotate-[-6deg] rounded-[1.4rem] border border-white/15 p-1.5 shadow-[0_20px_40px_-15px_#000] transition-transform duration-300 group-hover:rotate-0"
      style={{ background: `linear-gradient(160deg, ${a}, ${b})` }}
      aria-hidden="true"
    >
      <div className="flex h-full flex-col gap-1.5 rounded-[1.05rem] bg-black/25 p-2">
        <div className="mx-auto h-1 w-8 rounded-full bg-white/40" />
        <Icone nome={projeto.icone} className="mx-auto mt-2 h-8 w-8 text-white" strokeWidth={1.75} />
        <div className="mt-2 h-1.5 w-full rounded-full bg-white/50" />
        <div className="h-1.5 w-3/4 rounded-full bg-white/30" />
        <div className="mt-auto grid grid-cols-2 gap-1">
          <div className="h-6 rounded-md bg-white/20" />
          <div className="h-6 rounded-md bg-white/20" />
        </div>
        <div className="h-5 rounded-md bg-[#25D366]" />
      </div>
    </div>
  )
}

export function ProjetosProntos() {
  return (
    <Secao
      id="projetos"
      titulo="Projetos prontos para o seu negócio"
      subtitulo="Abra a demonstração no seu celular e teste de verdade: agende, monte um pedido, envie pelo WhatsApp. Colocamos a sua marca, seus produtos e seus preços."
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {PROJETOS.map((p) => (
          <article key={p.pasta} className="group flex flex-col overflow-hidden rounded-3xl border border-borda bg-noite/60 transition hover:border-roxo/60">
            <div
              className="relative px-6 pb-4 pt-8"
              style={{ background: `radial-gradient(80% 90% at 50% 100%, ${p.cor[0]}33, transparent 70%)` }}
            >
              <PreviaCelular projeto={p} />
            </div>
            <div className="flex flex-1 flex-col p-6 pt-4">
              <p className="text-sm text-roxo-claro">{p.nicho}</p>
              <h3 className="mt-1 text-xl font-semibold">{p.nome}</h3>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-suave">
                {p.itens.map((i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-zap" /> {i}
                  </li>
                ))}
              </ul>
              <p className="mt-5 flex items-baseline gap-1.5">
                <span className="text-sm text-suave">R$</span>
                <span className="font-display text-3xl font-extrabold">{preco(p.preco)}</span>
                <span className="text-sm text-suave">· pronto em {p.prazo}</span>
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <a
                  href={`./demos/${p.pasta}/`}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-borda px-4 py-3 text-sm font-semibold transition hover:border-roxo hover:bg-noite"
                >
                  <ExternalLink className="h-4 w-4" /> Testar demo
                </a>
                <BotaoZap
                  mensagem={`Olá! Vi o projeto "${p.nome}" para ${p.nicho.toLowerCase()} no site e quero um para o meu negócio.`}
                  className="!px-4 !py-3 text-sm"
                >
                  Quero este
                </BotaoZap>
              </div>
            </div>
          </article>
        ))}
        <article className="flex flex-col justify-center rounded-3xl border border-dashed border-borda p-8">
          <h3 className="text-xl font-semibold">Seu nicho não está aqui?</h3>
          <p className="mt-3 text-suave">
            Oficina, pet shop, academia, imobiliária, escola... Partimos do projeto mais parecido e adaptamos para o seu negócio.
          </p>
          <BotaoZap mensagem="Olá! Tenho um negócio que não está nos projetos prontos e quero saber se vocês fazem." className="mt-6 self-start">
            Falar sobre o meu negócio
          </BotaoZap>
        </article>
      </div>
      <p className="mt-6 text-sm text-suave/80">
        Hospedagem gratuita inclusa. Manutenção opcional por R$ {MANUTENCAO}/mês. Domínio próprio (.com.br) é registrado em seu nome, cerca de R$ 40 por ano.
      </p>
    </Secao>
  )
}

const CATEGORIAS = ['Todos', ...new Set(SERVICOS.map((s) => s.cat))]

export function Estudio() {
  const [filtro, setFiltro] = useState('Todos')
  const lista = filtro === 'Todos' ? SERVICOS : SERVICOS.filter((s) => s.cat === filtro)

  return (
    <Secao
      id="servicos"
      className="fundo-faixa"
      titulo="Estúdio: marca, vídeo e redes"
      subtitulo="Serviços avulsos para quem já tem site ou quer começar por outro lado. Preço fechado e entrega rápida."
    >
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filtrar serviços">
        {CATEGORIAS.map((c) => (
          <button
            key={c}
            onClick={() => setFiltro(c)}
            aria-pressed={filtro === c}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filtro === c ? 'bg-texto text-espaco' : 'border border-borda text-suave hover:text-texto'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((s) => (
          <article key={s.nome} className="flex flex-col rounded-2xl border border-borda bg-espaco/60 p-6">
            <div className="flex items-start justify-between gap-4">
              <Icone nome={s.icone} className="h-7 w-7 text-roxo-claro" strokeWidth={1.75} />
              <span className="rounded-full border border-borda px-2.5 py-0.5 text-xs text-suave">{s.cat}</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold">{s.nome}</h3>
            <p className="mt-2 flex-1 text-sm text-suave">{s.desc}</p>
            <div className="mt-5 flex items-center justify-between gap-3">
              <p>
                <span className="font-display text-2xl font-bold">R$ {preco(s.preco)}</span>
                {s.unidade && <span className="ml-1.5 text-sm text-suave">{s.unidade}</span>}
              </p>
              <BotaoZap
                mensagem={`Olá! Quero contratar: ${s.nome} (R$ ${preco(s.preco)}${s.unidade ? ' ' + s.unidade : ''}).`}
                className="!px-4 !py-2 text-sm"
              >
                Pedir
              </BotaoZap>
            </div>
          </article>
        ))}
      </div>
    </Secao>
  )
}
