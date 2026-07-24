# Prompt para gerar arquivos .deck.md (MemoDeck)

Cole este prompt no Copilot (ou outro modelo) substituindo `[TEMA]` pelo assunto desejado.

---

## Prompt

Gere um arquivo `.deck.md` sobre **[TEMA]** no formato MemoDeck para estudo com flashcards de lacunas (cloze deletion).

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

**2. Seções com heading `#`** — agrupe os cards por tópico:

```
# Nome da Seção
```

Cada grupo temático deve ter seu próprio heading antes dos cards.

**3. Cada frase/card é um parágrafo separado por linha em branco**

> CRÍTICO: uma linha em branco (linha vazia) DEVE aparecer antes E depois de cada parágrafo-card.
> Nunca coloque dois cards consecutivos sem uma linha completamente vazia entre eles.

Formato correto:
```
# Seção A

O protocolo {{c1::HTTP}} opera na camada de aplicação.

A porta padrão do HTTPS é {{c1::443}}.

# Seção B

Um índice de banco de dados acelera {{c1::leituras}} mas pode tornar {{c2::escritas}} mais lentas.
```

Formato INCORRETO (sem linha em branco — gera um único card errado):
```
O protocolo {{c1::HTTP}} opera na camada de aplicação.
A porta padrão do HTTPS é {{c1::443}}.
```

**4. Sintaxe cloze** — `{{cN::resposta}}`

- `N` é um número inteiro começando em 1
- Dentro do mesmo parágrafo, `{{c1::x}}` e `{{c2::y}}` geram **dois cards diferentes** para o mesmo parágrafo
- Clozes com o mesmo número no mesmo parágrafo (`{{c1::x}} ... {{c1::y}}`) são uma **única lacuna** com duas revelações
- Use lacunas simples quando o conceito for direto; use múltiplas quando houver relação entre termos

**5. Tabelas são permitidas** mas não geram cards — use-as só para referência:

```
| Método | Idempotente |
|--------|-------------|
| GET    | sim         |
| POST   | não         |
```

Coloque a tabela em seu próprio parágrafo (separado por linhas em branco) e adicione cards cloze depois.

**6. Quantidade**: gere entre 20 e 40 cards distribuídos em pelo menos 4 seções `#`.

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

Imagens são compostas por {{c1::camadas}} (layers) sobrepostas — cada instrução do Dockerfile cria uma nova camada.

# Containers

`docker run -d` executa o container em modo {{c1::detached}} (background).

Para listar containers em execução use `docker {{c1::ps}}`; para ver todos (incluindo parados) use `docker ps {{c2::-a}}`.

`docker {{c1::exec}} -it <id> bash` abre um terminal interativo dentro do container.

# Volumes e redes

Dados em containers são {{c1::efêmeros}} — use volumes para persistência.

`docker volume create` cria um volume gerenciado pelo {{c1::Docker}}.

A flag `-p 8080:80` mapeia a porta {{c1::80}} do container para a porta {{c2::8080}} do host.
```

---

## Checklist antes de entregar

- [ ] Frontmatter presente com `title`, `description`, `tags` e `version`
- [ ] Pelo menos 4 seções com heading `#`
- [ ] Cada parágrafo-card separado por **linha em branco acima e abaixo**
- [ ] Todo card contém pelo menos um `{{cN::texto}}`
- [ ] Nenhum parágrafo-card é continuação direta (sem linha em branco) de outro
