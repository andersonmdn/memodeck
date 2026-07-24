import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const files = readdirSync('./examples').filter(f => f.endsWith('.md'))

for (const f of files) {
  const text = readFileSync(join('./examples', f), 'utf-8')
  const paragraphs = text.split(/\n\n+/).filter(p => /\{\{c\d+::/.test(p))
  let cards = 0
  for (const p of paragraphs) {
    const indices = new Set([...p.matchAll(/\{\{c(\d+)::/g)].map(m => m[1]))
    cards += indices.size
  }
  console.log(`${f.padEnd(30)} ${paragraphs.length} parágrafos → ${cards} cartões`)
}
