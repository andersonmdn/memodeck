import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { Bot, Copy, CheckCircle, Info, Sparkles, Library, FileText, ListOrdered } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const PROMPT_VERSION = 3
const STORAGE_KEY = 'memodeck-prompt-version'

const AI_PROMPT = `Você é um gerador de decks de flashcards para o MemoDeck.

O MemoDeck suporta dois tipos de conteúdo: Cloze Deletion e Steps (sequências ordenadas).
Escolha automaticamente o melhor formato para cada informação.

## Regra de escolha do formato

Use CLOZE para:
- Conceitos, definições, fórmulas
- Termos técnicos e seus significados
- Fatos isolados para memorizar

Use STEPS para:
- Processos, procedimentos, fluxos
- Checklists e sequências de etapas
- Deploy, troubleshooting, onboarding
- Qualquer coisa que tenha uma ordem a seguir

Misture os dois formatos no mesmo arquivo quando fizer sentido.

---

## Formato do arquivo

Cada deck é um arquivo de texto com extensão \`.deck.md\`.

### Frontmatter YAML (obrigatório)

\`\`\`
---
title: "Título do deck"
description: "Descrição do conteúdo"
tags:
  - tag1
  - tag2
version: 1
---
\`\`\`

### Seções com heading # (obrigatório)

Agrupe os cartões por tópico usando headings de nível 1.
Gere no mínimo 4 seções distintas.

---

## Tipo 1: Cloze Deletion

Sintaxe: \`{{cN::resposta}}\`

- N é um inteiro começando em 1 (c1, c2, c3…)
- Cada índice único no mesmo parágrafo gera um cartão separado
- Cada parágrafo-cartão deve ser separado por uma linha em branco acima E abaixo
- Não use HTML — apenas Markdown inline (negrito, itálico, \`código\`)

Exemplo:

\`\`\`
O protocolo {{c1::HTTP}} opera na camada de {{c2::aplicação}}.

O comando \`docker {{c1::exec}} -it <id> bash\` abre um terminal interativo.
\`\`\`

---

## Tipo 2: Steps (sequências ordenadas)

Sintaxe: bloco de código com linguagem \`steps\`

\`\`\`
\`\`\`steps
title: Nome descritivo do processo

1. Primeiro passo
2. Segundo passo
3. Terceiro passo
4. Quarto passo
5. Quinto passo
\`\`\`
\`\`\`

Regras para Steps:
- O campo \`title:\` é obrigatório e deve descrever o processo
- Use no mínimo 3 passos (recomendado: 4–8 passos)
- Cada passo deve ser uma ação concisa e clara
- Cada bloco steps deve ser separado por uma linha em branco acima E abaixo

---

## Exemplo completo

\`\`\`
---
title: "Docker — Conceitos e Operações"
description: "Containers, imagens e deploy com Docker"
tags:
  - docker
  - devops
  - containers
version: 1
---

# Conceitos básicos

Um {{c1::container}} é uma unidade isolada de software que empacota código e dependências.

A diferença entre container e VM: containers compartilham o {{c1::kernel}} do host; VMs têm kernel próprio.

{{c1::Docker Hub}} é o registro público padrão de imagens Docker.

# Imagens

Uma imagem Docker é construída a partir de um {{c1::Dockerfile}}.

O comando para construir uma imagem é \`docker {{c1::build}}\`.

# Containers

\`docker run -d\` executa o container em modo {{c1::detached}} (background).

Para listar containers em execução: \`docker {{c1::ps}}\`; para ver todos: \`docker ps {{c2::-a}}\`.

# Build e deploy

\`\`\`steps
title: Deploy de imagem Docker em produção

1. Escrever o Dockerfile na raiz do projeto
2. Buildar a imagem com docker build -t nome:tag .
3. Testar a imagem localmente com docker run
4. Autenticar no registry com docker login
5. Fazer push da imagem com docker push nome:tag
6. Atualizar o serviço no servidor de produção
7. Verificar os logs com docker logs <container>
\`\`\`

# Volumes e redes

Dados em containers são {{c1::efêmeros}} — use volumes para persistência.

A flag \`-p 8080:80\` mapeia a porta {{c1::80}} do container para a porta {{c2::8080}} do host.
\`\`\`

---

## Checklist antes de retornar

- Frontmatter com title, description, tags e version presente
- Pelo menos 4 seções com heading #
- Conceitos e definições usam formato Cloze ({{cN::texto}})
- Processos e sequências usam formato Steps (\`\`\`steps)
- Cada parágrafo-cartão separado por linha em branco acima e abaixo
- Cada bloco steps separado por linha em branco acima e abaixo
- Blocos steps com pelo menos 3 passos e um title descritivo
- Todo cartão cloze contém pelo menos um {{cN::texto}}

## Sua tarefa

Com base na documentação fornecida a seguir, gere um arquivo \`.deck.md\` completo
seguindo todas as regras acima. Escolha automaticamente Cloze ou Steps para cada
informação. Retorne apenas o conteúdo do arquivo, sem explicações.`

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
        {/* Tipos de conteúdo */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-accent)]/15">
                  <Info className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                </div>
                <CardTitle className="text-sm">Dois tipos de conteúdo</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-4 space-y-3">
              <div className="flex items-start gap-3 rounded-lg bg-[var(--color-surface-2)] p-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--color-accent)]/15 mt-0.5">
                  <FileText className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--color-text)]">Cloze Deletion</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    Para conceitos, definições e fatos — a IA oculta partes do texto que você precisa lembrar.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-[var(--color-surface-2)] p-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 mt-0.5">
                  <ListOrdered className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--color-text)]">Steps</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    Para processos, deploys, procedimentos e sequências — exercícios de ordenação e reconhecimento gerados automaticamente.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Como usar */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Como usar</CardTitle>
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
        </motion.div>

        {/* Prompt */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.11 }}>
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
                  <CardDescription>Inclui regras para Cloze e Steps com exemplos</CardDescription>
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
        </motion.div>
      </div>
    </div>
  )
}
