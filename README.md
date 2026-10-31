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
| `sitemap.xml` / `robots.txt` | Mapa do site para o Google (Search Console) |

Site estático, sem etapa de build. Para testar localmente, basta abrir o `index.html` no navegador
ou rodar um servidor simples:

```bash
python3 -m http.server 8000
```

## Publicação

Publicado pelo **GitHub Pages** a partir da branch `main` (pasta raiz).
Em **Settings → Pages**, selecione *Deploy from a branch* → `main` → `/ (root)`.
