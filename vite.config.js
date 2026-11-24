import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' = caminhos relativos: o site funciona no GitHub Pages,
// em qualquer hospedagem e no seu domínio futuro sem mudar nada.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
