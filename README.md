# Órbita Digital — site

Site da agência Órbita Digital. Feito com React, Vite e Tailwind CSS.

## Editar os dados da agência
Número do WhatsApp, e-mail, Instagram, planos e preços ficam em **`src/config.js`**.
Mudou e enviou para o GitHub, o site se atualiza sozinho em cerca de 1 minuto.

## Rodar no computador
```
npm install
npm run dev
```

## Gerar os arquivos finais (para levar a outra hospedagem)
```
npm run build
```
A pasta `dist/` contém o site pronto. Basta enviar o conteúdo dela para qualquer hospedagem
(Hostinger, Netlify, Vercel, Cloudflare Pages...). Os caminhos são relativos, então funciona
em qualquer domínio sem alteração.
