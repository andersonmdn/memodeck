# MemoDeck

Aplicativo de flashcards com Cloze Deletion, 100% no navegador, sem backend, sem login, sem sincronização.

## Funcionalidades

- **Cloze Deletion** — `{{c1::texto}}` gera cartões automaticamente
- **Importação de decks** — arraste um arquivo `.deck.md` ou selecione manualmente
- **Repetição espaçada** — algoritmo simples e eficiente (não é cópia do SM-2)
- **Estatísticas** — gráfico de revisões, sequência, retenção
- **Offline** — funciona completamente sem internet (PWA)
- **Privacidade total** — nenhum dado sai do seu navegador (IndexedDB)

## Formato dos Decks

Crie arquivos `.deck.md` com frontmatter YAML e clozes no conteúdo:

```markdown
---
title: AWS IAM
description: Conceitos básicos de identidade e acesso
tags:
  - aws
  - security
version: 1
---

# IAM

O {{c1::IAM}} controla identidades e permissões na AWS.

A política {{c2::AdministratorAccess}} concede permissões administrativas completas.

O {{c3::CloudTrail}} registra todas as chamadas de API.
```

Cada `{{cN::resposta}}` gera um cartão independente. Múltiplos clozes no mesmo parágrafo são suportados.

## Atalhos de Teclado

| Tecla | Ação |
|-------|------|
| `Espaço` | Mostrar resposta |
| `1` | Errei |
| `2` | Difícil |
| `3` | Bom |
| `4` | Fácil |
| `Esc` | Sair da sessão |
| `F` | Fullscreen |

## Stack

- React 19 + Vite 8 + TypeScript 5 (strict)
- TailwindCSS v4 + shadcn/ui primitives
- Zustand (estado global)
- Dexie.js (IndexedDB)
- React Router v8
- Framer Motion
- Recharts
- vite-plugin-pwa (PWA + offline)
- Vitest (testes unitários)

## Desenvolvimento

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm test         # testes unitários
npm run build    # build de produção
```

## Deploy

O projeto é hospedado no GitHub Pages. O workflow `.github/workflows/deploy.yml` faz o deploy automático a cada push na branch `main`.

A URL base é `/memodeck/` — configure nas configurações do repositório em **Settings → Pages**.

## Privacidade

- **Nenhum servidor** — o app é 100% estático
- **Nenhum tracking** — sem analytics, sem telemetria
- **Dados locais** — tudo salvo no IndexedDB do seu navegador
- **Exportação** — faça backup em JSON quando quiser

## Licença

MIT
