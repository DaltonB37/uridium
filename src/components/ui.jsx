import { linkWhatsApp, MSG_PADRAO } from '../config'

export function Logo({ className = '' }) {
  return (
    <a href="#inicio" className={`flex items-center gap-2.5 ${className}`} title="Voltar ao início">
      <img src="./logo-horizontal-escuro.svg" alt="Uridium" width="168" height="32" className="h-8 w-auto" />
    </a>
  )
}

export function IconeInstagram({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconeYouTube({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
    </svg>
  )
}

export function IconeThreads({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className={className}>
      <path d="M16.5 11.2c-.3-2.4-1.9-3.7-4.3-3.7-2.6 0-4.2 1.9-4.2 4.5s1.6 4.4 4 4.4c2 0 3.3-1.1 3.3-2.6 0-1.6-1.4-2.4-3.4-2.4-1.8 0-2.6.8-2.6 1.6" />
      <path d="M19.5 8.5C18.4 5 15.7 3 12 3 6.9 3 4 6.6 4 12s2.9 9 8 9c3.6 0 6.3-1.7 7.4-4.6" />
    </svg>
  )
}

export function IconeZap({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28Z" />
    </svg>
  )
}

export function BotaoZap({ mensagem = MSG_PADRAO, children, className = '' }) {
  return (
    <a
      href={linkWhatsApp(mensagem)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-zap px-6 py-3.5 font-semibold text-espaco shadow-[0_8px_30px_-8px_#25D36699] transition hover:brightness-110 active:scale-[0.98] ${className}`}
    >
      <IconeZap />
      {children}
    </a>
  )
}

export function Secao({ id, titulo, subtitulo, children, className = '', centro = false }) {
  return (
    <section id={id} className={`relative px-5 py-20 md:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">
        {titulo && (
          <header className={`mb-12 max-w-2xl ${centro ? 'mx-auto text-center' : ''}`}>
            <h2 className="text-3xl font-bold md:text-[2.75rem] md:leading-[1.1]">{titulo}</h2>
            {subtitulo && <p className="mt-4 text-lg text-suave">{subtitulo}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}

export function preco(valor) {
  return valor.toLocaleString('pt-BR', Number.isInteger(valor) ? {} : { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
