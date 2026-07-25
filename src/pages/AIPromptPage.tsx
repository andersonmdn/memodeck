import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { Bot, Copy, CheckCircle, Info, Sparkles, Library } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const PROMPT_VERSION = 2
const STORAGE_KEY = 'memodeck-prompt-version'

const AI_PROMPT = `Você é um gerador de decks de flashcards para o MemoDeck.

## Formato do arquivo

Cada deck é um arquivo de texto com extensão \`.deck.md\`.

### 1. Frontmatter YAML (obrigatório)

O arquivo começa com um bloco YAML entre "---":

---
title: "Título do deck"
description: "Descrição do conteúdo"
tags:
  - tag1
  - tag2
version: 1
---

### 2. Seções com heading # (obrigatório)

Agrupe os cartões por tópico usando headings de nível 1.
Gere no mínimo 4 seções distintas.

# Nome da Seção

### 3. Cartões como parágrafos separados por linha em branco (CRÍTICO)

Cada sentença/cartão deve ser um parágrafo separado dos demais
por uma linha completamente vazia — antes E depois.

CORRETO (cada cartão isolado por linha em branco):

# Seção A

O protocolo {{c1::HTTP}} opera na camada de aplicação.

A porta padrão do HTTPS é {{c1::443}}.

# Seção B

Um índice acelera {{c1::leituras}} mas pode tornar {{c2::escritas}} mais lentas.

INCORRETO (sem linha em branco — gera um único cartão errado):

O protocolo {{c1::HTTP}} opera na camada de aplicação.
A porta padrão do HTTPS é {{c1::443}}.

### 4. Sintaxe cloze: {{cN::resposta}}

- N é um inteiro começando em 1 (c1, c2, c3…)
- Cada índice N único no mesmo parágrafo gera um cartão separado
- O mesmo índice pode aparecer várias vezes no parágrafo (oculta tudo de uma vez)
- Não use HTML — apenas Markdown inline (negrito, itálico, \`código\`)
- Cada cartão deve testar um único conceito isolado

### 5. Tabelas

Permitidas para referência, mas não geram cartões sozinhas.
Coloque-as em parágrafo próprio (linha em branco antes e depois)
e adicione cartões cloze separados após a tabela.

## Exemplo completo

---
title: "Docker"
description: "Conceitos fundamentais de containers Docker"
tags:
  - docker
  - containers
  - devops
version: 1
---

# Conceitos básicos

Um {{c1::container}} é uma unidade isolada de software que empacota código e dependências.

A diferença entre container e VM: containers compartilham o {{c1::kernel}} do host; VMs têm kernel próprio.

{{c1::Docker Hub}} é o registro público padrão de imagens Docker.

# Imagens

Uma imagem Docker é construída a partir de um {{c1::Dockerfile}}.

O comando para construir uma imagem é \`docker {{c1::build}}\`.

Imagens são compostas por {{c1::camadas}} (layers) — cada instrução do Dockerfile cria uma nova camada.

# Containers

\`docker run -d\` executa o container em modo {{c1::detached}} (background).

Para listar containers em execução use \`docker {{c1::ps}}\`; para ver todos use \`docker ps {{c2::-a}}\`.

\`docker {{c1::exec}} -it <id> bash\` abre um terminal interativo dentro do container.

# Volumes e redes

Dados em containers são {{c1::efêmeros}} — use volumes para persistência.

A flag \`-p 8080:80\` mapeia a porta {{c1::80}} do container para a porta {{c2::8080}} do host.

## Checklist antes de retornar

- Frontmatter com title, description, tags e version presente
- Pelo menos 4 seções com heading #
- Cada parágrafo-cartão separado por linha em branco acima e abaixo
- Todo cartão contém pelo menos um {{cN::texto}}
- Nenhum cartão está na mesma linha ou sem linha em branco de outro

## Sua tarefa

Com base na documentação fornecida a seguir, gere um arquivo \`.deck.md\` completo
seguindo todas as regras acima. Retorne apenas o conteúdo do arquivo, sem explicações.`

export function AIPromptPage() {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [isNew, setIsNew] = useState(false)

  useEffect(() => {
    const seen = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10)
    setIsNew(seen < PROMPT_VERSION)
  }, [])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(AI_PROMPT)
    localStorage.setItem(STORAGE_KEY, String(PROMPT_VERSION))
    setIsNew(false)
    setCopied(true)
    setTimeout(() => setCopied(false), 4000)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-accent)]/15">
            <Bot className="h-5 w-5 text-[var(--color-accent)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Criar com IA</h1>
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">
          Copie o prompt, cole em qualquer IA com o conteúdo que quer estudar, salve o resultado e importe na Biblioteca.
        </p>
      </motion.div>

      <div className="space-y-4">
        {/* Como usar */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-accent)]/15">
                <Info className="h-3.5 w-3.5 text-[var(--color-accent)]" />
              </div>
              <CardTitle className="text-sm">Como usar</CardTitle>
            </div>
            <CardDescription>
              <ol className="mt-1 space-y-1 list-decimal list-inside">
                <li>Copie o prompt abaixo</li>
                <li>Cole em qualquer IA (ChatGPT, Claude, Gemini…)</li>
                <li>Adicione a documentação ou texto que deseja transformar em cartões</li>
                <li>Salve o resultado como <code className="text-xs bg-[var(--color-surface-2)] px-1 py-0.5 rounded">nome.deck.md</code></li>
                <li>Importe o arquivo na Biblioteca</li>
              </ol>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <Button variant="secondary" size="sm" onClick={() => navigate('/library')}>
              <Library className="h-4 w-4" />
              Ir para a Biblioteca
            </Button>
          </CardContent>
        </Card>

        {/* Prompt */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm">Prompt</CardTitle>
                  {isNew && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)]/15 px-2 py-0.5 text-[10px] font-medium text-[var(--color-accent)]"
                    >
                      <Sparkles className="h-2.5 w-2.5" />
                      Atualizado
                    </motion.span>
                  )}
                </div>
                <CardDescription>Texto completo com todas as regras do formato</CardDescription>
              </div>
              <Button variant="secondary" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-[var(--color-success)]" />
                    <span className="text-[var(--color-success)]">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <textarea
              readOnly
              value={AI_PROMPT}
              className="w-full h-80 resize-none rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background)] p-3 font-mono text-xs text-[var(--color-text-muted)] focus:outline-none"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
