import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Copy, CheckCircle, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const AI_PROMPT = `Você é um gerador de decks de flashcards para o MemoDeck.

## Formato do arquivo

Cada deck é um arquivo de texto com extensão \`.deck.md\`.

### Frontmatter (obrigatório)

O arquivo começa com um bloco YAML entre "---":

---
title: "Título do deck"
description: "Descrição opcional"
tags: [tag1, tag2]
---

### Cartões (cloze deletion)

Cada parágrafo do corpo pode conter um ou mais marcadores de cloze no formato:

  {{cN::texto a ocultar}}

onde N é um número inteiro (c1, c2, c3...).

Regras:
- Cada índice N único dentro de um mesmo parágrafo gera um cartão separado.
- O parágrafo completo é armazenado em cada cartão. Ao estudar, apenas o
  cloze ativo fica oculto; os demais aparecem destacados.
- Parágrafos são separados por uma linha em branco.
- O mesmo índice pode aparecer várias vezes no mesmo parágrafo
  (para ocultar múltiplas ocorrências de uma vez).
- Não use HTML — apenas Markdown inline (negrito, itálico, \`código\`).
- Cada cartão deve testar um único conceito isolado.
- O arquivo deve ser salvo com a extensão \`.deck.md\`.

## Exemplo completo

---
title: "Fundamentos de Python"
description: "Conceitos básicos da linguagem Python"
tags: [python, programação]
---

A função {{c1::print()}} exibe texto no terminal.

Listas em Python são criadas com {{c1::colchetes}} e são {{c2::mutáveis}}.

O operador {{c1::**}} realiza {{c2::exponenciação}} em Python.

Em Python, \`None\` representa a {{c1::ausência de valor}} e é equivalente ao
{{c2::null}} de outras linguagens.

## Sua tarefa

Com base na documentação fornecida a seguir, gere um arquivo \`.deck.md\` completo
seguindo todas as regras acima. Retorne apenas o conteúdo do arquivo, sem explicações.`

export function AIPromptPage() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(AI_PROMPT)
    setCopied(true)
    setTimeout(() => setCopied(false), 4000)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <Bot className="h-6 w-6 text-[--color-accent]" />
          <h1 className="text-2xl font-bold text-[--color-text]">Prompt para IA</h1>
        </div>
        <p className="text-sm text-[--color-text-muted]">
          Copie o prompt abaixo, cole na sua IA favorita e forneça a documentação que quiser transformar em flashcards.
        </p>
      </motion.div>

      <div className="space-y-4">
        {/* Como usar */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-[--color-accent]" />
              <CardTitle className="text-sm">Como usar</CardTitle>
            </div>
            <CardDescription>
              <ol className="mt-1 space-y-1 list-decimal list-inside">
                <li>Copie o prompt abaixo</li>
                <li>Cole em qualquer IA (ChatGPT, Claude, Gemini…)</li>
                <li>Adicione a documentação ou texto que deseja transformar em cartões</li>
                <li>Salve o resultado como <code className="text-xs bg-[--color-surface-2] px-1 py-0.5 rounded">nome.deck.md</code> e importe na Biblioteca</li>
              </ol>
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Prompt */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Prompt</CardTitle>
                <CardDescription>Texto completo com todas as regras do formato</CardDescription>
              </div>
              <Button variant="secondary" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-[--color-success]" />
                    <span className="text-[--color-success]">Copiado!</span>
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
              className="w-full h-80 resize-none rounded-md border border-[--color-border-subtle] bg-[--color-background] p-3 font-mono text-xs text-[--color-text-muted] focus:outline-none"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
