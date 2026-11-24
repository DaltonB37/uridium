import { Cabecalho, Hero } from './components/Topo'
import {
  Nichos, Beneficios, Comparativo, ComoFunciona, Planos, Pagamento,
  Vantagens, Indicacao, Conversa, Duvidas, ChamadaFinal, Rodape, BotaoFlutuante,
} from './components/Secoes'
import { ProjetosProntos, Estudio } from './components/Catalogo'

export default function App() {
  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-roxo focus:px-4 focus:py-2">
        Pular para o conteúdo
      </a>
      <Cabecalho />
      <main id="conteudo">
        <Hero />
        <Nichos />
        <ProjetosProntos />
        <Beneficios />
        <Comparativo />
        <ComoFunciona />
        <Planos />
        <Estudio />
        <Pagamento />
        <Vantagens />
        <Indicacao />
        <Conversa />
        <Duvidas />
        <ChamadaFinal />
      </main>
      <Rodape />
      <BotaoFlutuante />
    </>
  )
}
