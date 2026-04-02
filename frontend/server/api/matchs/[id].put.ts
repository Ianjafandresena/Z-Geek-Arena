export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { score1, score2, gagnant_id, statut } = body

  // 1. Update the match
  const res = await query(
    `UPDATE matchs SET score1 = $1, score2 = $2, gagnant_id = $3, statut = $4, updated_at = NOW() 
     WHERE id = $5 RETURNING *`,
    [score1 ?? 0, score2 ?? 0, gagnant_id || null, statut || 'en_attente', id]
  )
  const match = res.rows[0]

  // 2. If winner is set, move them to the next match
  if (match.gagnant_id && match.next_match_id) {
    const nextMatch = await query('SELECT * FROM matchs WHERE id = $1', [match.next_match_id])
    if (nextMatch.rows[0]) {
      const nm = nextMatch.rows[0]
      // Decide if winner goes to joueur1 or joueur2 based on current match ordre
      const field = (match.ordre % 2 !== 0) ? 'joueur1_id' : 'joueur2_id'
      await query(`UPDATE matchs SET ${field} = $1 WHERE id = $2`, [match.gagnant_id, nm.id])
    }
  }

  return match
})
