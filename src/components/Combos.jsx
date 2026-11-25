import { Check } from 'lucide-react'
import { Secao, BotaoZap, preco } from './ui'
import { COMBOS } from '../config'

export function Combos() {
  return (
    <Secao
      id="pacotes"
      titulo="Pacotes promocionais"
      subtitulo="Preço de lançamento para quem quer resolver tudo de uma vez. O valor riscado é a soma dos serviços avulsos."
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {COMBOS.map((c) => (
          <article
            key={c.nome}
            className={`relative flex flex-col rounded-3xl p-7 ${
              c.destaque ? 'border-2 border-roxo bg-noite shadow-[0_30px_80px_-30px_#8B5CF6aa]' : 'border border-borda bg-noite/50'
            }`}
          >
            <h3 className="text-lg font-semibold">{c.nome}</h3>
            <p className="mt-1.5 text-sm text-suave">{c.resumo}</p>

            {c.adicional ? (
              <div className="mt-6">
                <p className="text-sm text-suave">
                  Preço do projeto + <s>R$ {preco(c.adicionalDe)}</s>
                </p>
                <p className="flex items-baseline gap-1.5">
                  <span className="text-suave">+ R$</span>
                  <span className="font-display text-4xl font-extrabold">{preco(c.adicional)}</span>
                </p>
              </div>
            ) : (
              <div className="mt-6">
                <p className="text-sm text-suave">
                  de <s>R$ {preco(c.de)}</s> por
                </p>
                <p className="flex items-baseline gap-1.5">
                  <span className="text-suave">R$</span>
                  <span className="font-display text-4xl font-extrabold">{preco(c.por)}</span>
                </p>
                <p className="mt-1 text-xs font-semibold text-zap">Você economiza R$ {preco(c.de - c.por)}</p>
              </div>
            )}

            <ul className="mt-6 flex-1 space-y-2.5 text-sm">
              {c.itens.map((i) => (
                <li key={i} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-zap" /> {i}
                </li>
              ))}
            </ul>

            <BotaoZap
              mensagem={`Olá! Vim pelo site da Uridium e quero o pacote "${c.nome}".`}
              className={`mt-7 w-full !px-4 !py-3 text-sm ${c.destaque ? '' : '!bg-texto !shadow-none'}`}
            >
              Quero este pacote
            </BotaoZap>
          </article>
        ))}
      </div>
    </Secao>
  )
}
