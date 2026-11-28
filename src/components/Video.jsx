import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX, RotateCcw, Play } from 'lucide-react'

/*
  Vídeo de apresentação da Uridium (feito com HyperFrames).
  Começa sem som quando aparece na tela; um toque liga o som e volta pro início.
  Quem pediu "menos movimento" no sistema não tem autoplay: vê o pôster e aperta play.
*/
export function VideoApresentacao() {
  const ref = useRef(null)
  const [mudo, setMudo] = useState(true)
  const [acabou, setAcabou] = useState(false)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduzir) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.4 },
    )
    obs.observe(v)
    return () => obs.disconnect()
  }, [])

  function ligarSom() {
    const v = ref.current
    v.muted = false
    v.currentTime = 0
    setMudo(false)
    setAcabou(false)
    v.play().catch(() => {})
  }

  function alternarSom() {
    const v = ref.current
    v.muted = !v.muted
    setMudo(v.muted)
  }

  function repetir() {
    const v = ref.current
    v.currentTime = 0
    setAcabou(false)
    v.play().catch(() => {})
  }

  return (
    <section id="video" className="relative px-5 pb-16 md:pb-24" aria-label="Vídeo de apresentação">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-borda bg-noite shadow-[0_40px_120px_-40px_#8B5CF6aa]">
          <video
            ref={ref}
            className="block aspect-video w-full"
            src="./video/uridium-apresentacao.mp4"
            poster="./video/uridium-apresentacao.jpg"
            muted
            playsInline
            preload="metadata"
            controls={!mudo}
            onEnded={() => setAcabou(true)}
          >
            <track kind="captions" src="./video/uridium-apresentacao.vtt" srcLang="pt-BR" label="Português" />
          </video>

          {mudo && (
            <button
              onClick={ligarSom}
              aria-label="Assistir ao vídeo com som"
              className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-t from-espaco/80 via-espaco/45 to-espaco/30 transition hover:from-espaco/70 hover:via-espaco/30 hover:to-espaco/10 md:gap-4"
            >
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-espaco/70 px-3 py-1 text-xs font-semibold tracking-wide text-texto backdrop-blur md:left-5 md:top-5">
                <span className="h-2 w-2 rounded-full bg-[#EF4444] motion-safe:animate-pulse" /> Vídeo · 56 s
              </span>
              <span className="relative grid h-16 w-16 place-items-center md:h-24 md:w-24">
                <span className="absolute inset-0 rounded-full bg-[#8B5CF6]/40 motion-safe:animate-ping" />
                <span className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] shadow-[0_10px_40px_-6px_#8B5CF6] transition group-hover:scale-105 md:h-24 md:w-24">
                  <Play className="ml-1 h-7 w-7 fill-current text-white md:h-10 md:w-10" />
                </span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-espaco/75 px-4 py-2 text-sm font-semibold text-texto backdrop-blur md:text-base">
                <Volume2 className="h-4 w-4" /> Toque para assistir com som
              </span>
            </button>
          )}

          {!mudo && (
            <button
              onClick={alternarSom}
              aria-label={ref.current?.muted ? 'Ligar o som' : 'Desligar o som'}
              className="absolute right-4 top-4 rounded-full bg-espaco/80 p-2.5 backdrop-blur transition hover:bg-espaco"
            >
              {ref.current?.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          )}

          {acabou && (
            <button
              onClick={repetir}
              className="absolute inset-0 grid place-items-center bg-espaco/60 backdrop-blur-sm"
              aria-label="Assistir de novo"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-borda bg-noite px-5 py-3 font-semibold">
                <RotateCcw className="h-4 w-4" /> Assistir de novo
              </span>
            </button>
          )}
        </div>
        <p className="mt-4 text-center text-sm text-suave">A Uridium em menos de 1 minuto.</p>
      </div>
    </section>
  )
}
