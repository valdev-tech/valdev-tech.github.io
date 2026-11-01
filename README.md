# ValDev — Soluções em Tecnologia

Site institucional da **ValDev**: desenvolvimento de sites, sistemas, programas e consultoria em tecnologia sob medida para o seu negócio.

🌐 **Site:** https://valdev-tech.github.io/

## Estrutura

| Arquivo | Descrição |
|---|---|
| `index.html` | Página única: Início, Serviços, Soluções, Como trabalhamos, Diferenciais, Dúvidas e Contato |
| `style.css` | Estilos, tema claro/escuro e responsividade |
| `script.js` | Menu mobile, tema, animações, FAQ e envio do formulário (Formspree) |
| `favicon.svg` | Logo/ícone da ValDev |
| `og-image.png` | Imagem de prévia ao compartilhar o link (1200×630) |
| `privacidade.html` | Política de Privacidade (LGPD) |
| `404.html` | Página de "não encontrado" personalizada |
| `sitemap.xml` / `robots.txt` | Mapa do site para o Google (Search Console) |

Site estático, sem etapa de build. Para testar localmente, basta abrir o `index.html` no navegador
ou rodar um servidor simples:

```bash
python3 -m http.server 8000
```

## Publicação

Publicado pelo **GitHub Pages** a partir da branch `main` (pasta raiz).
Em **Settings → Pages**, selecione *Deploy from a branch* → `main` → `/ (root)`.

## Ícones

Os ícones são SVG embutidos no próprio HTML (sprite no início do `<body>`), sem bibliotecas externas.
Para usar um ícone: `<svg class="icon" aria-hidden="true"><use href="#i-NOME"></use></svg>`.
Para adicionar um novo, copie o `<path>` do ícone em [Font Awesome Free](https://fontawesome.com/search?o=r&m=free)
para um novo `<symbol id="i-NOME" viewBox="...">` no sprite.
Ícones: Font Awesome Free 6.5.2 — licença CC BY 4.0.
