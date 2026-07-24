import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { renderClozeText } from './clozeParser'

marked.use({
  gfm: true,
  breaks: false,
})

export function renderMarkdown(text: string): string {
  const html = marked.parse(text) as string
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'del', 'code', 'pre',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'a', 'img', 'hr',
      'span', 'div',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'aria-label', 'target', 'rel'],
  })
}

export function renderClozeMarkdown(
  rawText: string,
  activeClozeIndex: number,
  revealed: boolean,
): string {
  const parsed = marked.parse(rawText) as string
  const withCloze = renderClozeText(parsed, activeClozeIndex, revealed)
  return DOMPurify.sanitize(withCloze, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'del', 'code', 'pre',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'a', 'img', 'hr',
      'span', 'div',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'aria-label', 'target', 'rel'],
  })
}
