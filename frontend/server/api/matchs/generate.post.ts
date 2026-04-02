export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const body = await readBody(event)
  const { tournoi_id } = body

  if (!tournoi_id) throw createError({ statusCode: 400, message: 'Missing tournoi_id' })

  // 1. Get all players for this tournament
  const playersRes = await query(
    'SELECT joueur_id FROM inscriptions WHERE tournoi_id = $1 AND statut = $2', 
    [tournoi_id, 'inscrit']
  )
  const playerIds = playersRes.rows.map(r => r.joueur_id)
  
  if (playerIds.length < 2) throw createError({ statusCode: 400, message: 'Not enough players (min 2)' })

  // 2. Clear current matches
  await query('DELETE FROM matchs WHERE tournoi_id = $1', [tournoi_id])

  // 3. Simple Power-of-2 Bracket Generation (Single Elimination)
  // Determine number of rounds
  const numPlayers = playerIds.length
  const rounds = Math.ceil(Math.log2(numPlayers))
  const totalSlots = Math.pow(2, rounds)

  // Create matches for each round (working backwards from final)
  const matchesByRound: any[][] = []
  
  // Create shell matches for each round
  for (let r = 0; r < rounds; r++) {
    const numMatchesInRound = Math.pow(2, rounds - r - 1)
    const matchesInRound: any[] = []
    
    for (let i = 0; i < numMatchesInRound; i++) {
       // Insert into DB
       const res = await query(
         'INSERT INTO matchs (tournoi_id, etape, ordre) VALUES ($1, $2, $3) RETURNING id',
         [tournoi_id, rounds - r, i + 1]
       )
       matchesInRound.push({ id: res.rows[0].id, etape: rounds - r, ordre: i + 1 })
    }
    matchesByRound.push(matchesInRound)
  }

  // Link matches (set next_match_id)
  for (let r = 0; r < rounds - 1; r++) {
    const currentRound = matchesByRound[r]
    const nextRound = matchesByRound[r + 1]
    if (!currentRound || !nextRound) continue
    
    for (let i = 0; i < currentRound.length; i++) {
        const nextIdx = Math.floor(i / 2)
        const nextMatch = nextRound[nextIdx]
        if (nextMatch) {
            await query('UPDATE matchs SET next_match_id = $1 WHERE id = $2', [nextMatch.id, currentRound[i].id])
        }
    }
  }

  // 5. Fill first round with players
  const firstRound = matchesByRound[0]
  if (firstRound) {
    const shuffledPlayers = playerIds.sort(() => Math.random() - 0.5)
    for (let i = 0; i < firstRound.length; i++) {
        const j1 = shuffledPlayers[i * 2] || null
        const j2 = shuffledPlayers[i * 2 + 1] || null
        await query(
            'UPDATE matchs SET joueur1_id = $1, joueur2_id = $2 WHERE id = $3',
            [j1, j2, firstRound[i].id]
        )
    }
  }

  return { success: true, message: 'Bracket généré avec succès', playersCount: numPlayers }
})
