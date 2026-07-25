# Prompt para gerar arquivos .deck.md (MemoDeck)

Cole este prompt no Copilot (ou outro modelo) substituindo `[TEMA]` pelo assunto desejado.

---

## Prompt

Gere um arquivo `.deck.md` sobre **[TEMA]** no formato MemoDeck com flashcards de dois tipos: **Cloze Deletion** (lacunas) e **Steps** (sequências ordenadas). Escolha automaticamente o melhor formato para cada informação.

### Escolha do formato

Use **Cloze** para conceitos, definições, fórmulas e fatos isolados para memorizar.
Use **Steps** para processos, procedimentos, deploys, checklists, troubleshooting e qualquer coisa com ordem a seguir.
Misture os dois formatos no mesmo arquivo quando fizer sentido.

### Regras obrigatórias de formato

**1. Frontmatter YAML** — sempre no início, entre `---`:

```
---
title: [Título do deck]
description: [Uma frase descrevendo o conteúdo]
tags:
  - tag1
  - tag2
version: 1
---
```

**2. Seções com heading `#`** — agrupe os cards por tópico. Gere no mínimo 4 seções.

**3. Tipo Cloze Deletion** — sintaxe `{{cN::resposta}}`

- `N` é um inteiro começando em 1 (c1, c2, c3…)
- Índices diferentes no mesmo parágrafo geram cards separados
- Cada parágrafo-card deve ser separado por linha em branco acima E abaixo
- Não use HTML — apenas Markdown inline (negrito, itálico, `código`)

**4. Tipo Steps** — bloco de código com linguagem `steps`:

```
```steps
title: Nome descritivo do processo

1. Primeiro passo
2. Segundo passo
3. Terceiro passo
4. Quarto passo
```
```

- O campo `title:` é obrigatório e deve descrever o processo
- Use no mínimo 3 passos (recomendado: 4–8)
- Cada bloco steps deve ser separado por linha em branco acima E abaixo

---

## Exemplo de saída esperada

```markdown
---
title: Docker
description: Conceitos fundamentais de containers Docker
tags:
  - docker
  - containers
  - devops
version: 1
---

# Conceitos básicos

Um {{c1::container}} é uma unidade isolada de software que empacota código e suas dependências.

A diferença entre container e VM: containers compartilham o {{c1::kernel}} do host; VMs têm kernel próprio.

{{c1::Docker Hub}} é o registro público padrão de imagens Docker.

# Imagens

Uma imagem Docker é construída a partir de um {{c1::Dockerfile}}.

O comando para construir uma imagem é `docker {{c1::build}}`.

# Containers

`docker run -d` executa o container em modo {{c1::detached}} (background).

Para listar containers em execução: `docker {{c1::ps}}`; para ver todos: `docker ps {{c2::-a}}`.

# Build e deploy

```steps
title: Deploy de imagem Docker em produção

1. Escrever o Dockerfile na raiz do projeto
2. Buildar a imagem com docker build -t nome:tag .
3. Testar a imagem localmente com docker run
4. Autenticar no registry com docker login
5. Fazer push da imagem com docker push nome:tag
6. Atualizar o serviço no servidor de produção
7. Verificar os logs com docker logs <container>
```
```

---

## Checklist antes de entregar

- [ ] Frontmatter com `title`, `description`, `tags` e `version`
- [ ] Pelo menos 4 seções com heading `#`
- [ ] Conceitos e definições usam formato Cloze (`{{cN::texto}}`)
- [ ] Processos e sequências usam formato Steps (` ```steps `)
- [ ] Cada parágrafo-card separado por linha em branco acima e abaixo
- [ ] Cada bloco steps separado por linha em branco acima e abaixo
- [ ] Blocos steps com `title:` e no mínimo 3 passos
- [ ] Todo card cloze contém pelo menos um `{{cN::texto}}`
