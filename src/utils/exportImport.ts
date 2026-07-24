import { db } from '@/storage/db'

export async function exportAllData(): Promise<void> {
  const [decks, cards, reviews, sessions] = await Promise.all([
    db.decks.toArray(),
    db.cards.toArray(),
    db.reviews.toArray(),
    db.sessions.toArray(),
  ])

  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    decks,
    cards,
    reviews,
    sessions,
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `memodeck-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function importBackup(file: File): Promise<{ ok: boolean; message: string }> {
  try {
    const text = await file.text()
    const data = JSON.parse(text) as {
      version: number
      decks: Parameters<typeof db.decks.bulkPut>[0]
      cards: Parameters<typeof db.cards.bulkPut>[0]
      reviews: Parameters<typeof db.reviews.bulkPut>[0]
      sessions: Parameters<typeof db.sessions.bulkPut>[0]
    }

    if (!data.version || !data.decks) {
      return { ok: false, message: 'Arquivo de backup inválido.' }
    }

    await db.transaction('rw', db.decks, db.cards, db.reviews, db.sessions, async () => {
      await db.decks.bulkPut(data.decks)
      await db.cards.bulkPut(data.cards)
      await db.reviews.bulkPut(data.reviews)
      if (data.sessions) await db.sessions.bulkPut(data.sessions)
    })

    return { ok: true, message: `Backup restaurado com sucesso.` }
  } catch {
    return { ok: false, message: 'Erro ao processar o backup. Verifique o arquivo.' }
  }
}

export async function resetAllData(): Promise<void> {
  await db.transaction('rw', db.decks, db.cards, db.reviews, db.sessions, async () => {
    await db.decks.clear()
    await db.cards.clear()
    await db.reviews.clear()
    await db.sessions.clear()
  })
}
