import { useEffect, useState } from 'react'
import { Menu, X, Check } from 'lucide-react'
import { Logo, BotaoZap } from './ui'

const LINKS = [
  { href: '#como-funciona', rotulo: 'Como funciona' },
  { href: '#planos', rotulo: 'Planos' },
  { href: '#duvidas', rotulo: 'Dúvidas' },
]

export function Cabecalho() {
  const [rolou, setRolou] = useState(false)
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        rolou || aberto ? 'border-b border-borda bg-espaco/85 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-suave transition hover:text-texto">
              {l.rotulo}
            </a>
          ))}
          <BotaoZap className="!px-5 !py-2.5 text-sm">Pedir orçamento</BotaoZap>
        </nav>
        <button
          className="rounded-lg p-2 md:hidden"
          onClick={() => setAberto(!aberto)}
          aria-expanded={aberto}
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
        >
          {aberto ? <X /> : <Menu />}
        </button>
      </div>
      {aberto && (
        <nav className="flex flex-col gap-1 border-t border-borda px-5 pb-6 pt-2 md:hidden" aria-label="Menu do celular">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setAberto(false)} className="py-3 text-lg">
              {l.rotulo}
            </a>
          ))}
          <BotaoZap className="mt-3">Pedir orçamento</BotaoZap>
        </nav>
      )}
    </header>
  )
}

const NICHOS_ORBITA = [
  { nome: 'Barbearia', angulo: '0deg' },
  { nome: 'Clínica', angulo: '60deg' },
  { nome: 'Restaurante', angulo: '120deg' },
  { nome: 'Academia', angulo: '180deg' },
  { nome: 'Estética', angulo: '240deg' },
  { nome: 'Oficina', angulo: '300deg' },
]

function Celular() {
  return (
    <div className="relative z-10 w-[230px] rounded-[2.2rem] border border-borda bg-[#0B141A] p-2 shadow-[0_30px_80px_-20px_#8B5CF680]">
      <div className="overflow-hidden rounded-[1.8rem]">
        <div className="flex items-center gap-2.5 bg-[#1F2C34] px-3.5 py-3">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-zap-escuro font-display text-xs font-bold">BC</div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Barbearia do Caio</p>
            <p className="text-[11px] text-[#8696A0]">online</p>
          </div>
        </div>
        <div className="flex min-h-[290px] flex-col gap-2 bg-[#0B141A] px-3 py-4 text-[13px]">
          <p className="mx-auto mb-1 rounded-md bg-[#182229] px-2 py-0.5 text-[10px] text-[#8696A0]">Mensagem enviada pelo site</p>
          <div className="balao ml-auto max-w-[85%] rounded-lg rounded-tr-none bg-[#005C4B] px-2.5 py-1.5" style={{ animationDelay: '0.6s' }}>
            Olá! Vi o site e quero agendar um corte no sábado de manhã.
            <span className="mt-0.5 block text-right text-[10px] text-[#8696A0]">09:41</span>
          </div>
          <div className="balao max-w-[85%] rounded-lg rounded-tl-none bg-[#1F2C34] px-2.5 py-1.5" style={{ animationDelay: '1.6s' }}>
            Bom dia! Tenho 9h ou 10h30. Qual fica melhor?
            <span className="mt-0.5 block text-right text-[10px] text-[#8696A0]">09:42</span>
          </div>
          <div className="balao ml-auto max-w-[85%] rounded-lg rounded-tr-none bg-[#005C4B] px-2.5 py-1.5" style={{ animationDelay: '2.6s' }}>
            9h, fechado!
            <span className="mt-0.5 block text-right text-[10px] text-[#8696A0]">09:42</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SistemaOrbital() {
  return (
    <div className="relative mx-auto grid aspect-square w-full max-w-[520px] place-items-center [container-type:size]" aria-hidden="true">
      <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,#8B5CF640,transparent_65%)] blur-2xl" />
      <div className="orbita" style={{ width: '62%', height: '62%', '--tempo': '60s' }} />
      <div className="orbita" style={{ width: '96%', height: '96%', '--tempo': '45s' }}>
        {NICHOS_ORBITA.map((n) => (
          <div key={n.nome} className="planeta" style={{ '--angulo': n.angulo, '--raio': '48cqw', '--tempo': '45s' }}>
            <span className="whitespace-nowrap rounded-full border border-borda bg-noite/90 px-3.5 py-1.5 text-xs font-medium text-roxo-claro backdrop-blur">
              {n.nome}
            </span>
          </div>
        ))}
      </div>
      <Celular />
    </div>
  )
}

export function Hero() {
  return (
    <section id="inicio" className="estrelas relative overflow-hidden px-5 pb-20 pt-32 md:pb-28 md:pt-40">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,#8B5CF633,transparent)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-borda bg-noite px-3.5 py-1.5 text-sm text-roxo-claro">
            <span className="h-2 w-2 rounded-full bg-zap" />
            Agência digital para negócios locais
          </p>
          <h1 className="text-[2.6rem] font-extrabold leading-[1.05] sm:text-6xl lg:text-[4.1rem]">
            Seu negócio no Google. Seus clientes no WhatsApp.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-suave md:text-xl">
            Criamos sites rápidos e bonitos para negócios locais. Quem encontra você entende o que você
            vende e chama no WhatsApp com a mensagem já pronta.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <BotaoZap>Pedir orçamento no WhatsApp</BotaoZap>
            <a
              href="#planos"
              className="inline-flex items-center justify-center rounded-full border border-borda px-6 py-3.5 font-semibold transition hover:border-roxo hover:bg-noite"
            >
              Ver planos e preços
            </a>
          </div>
          <ul className="mt-9 grid gap-2.5 text-sm text-suave sm:grid-cols-3">
            {['Pronto em até 7 dias úteis', 'Metade só na entrega', 'O site é seu, sem fidelidade'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-zap" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <SistemaOrbital />
      </div>
    </section>
  )
}
