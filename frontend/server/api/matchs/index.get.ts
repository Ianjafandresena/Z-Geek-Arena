export default defineEventHandler(async (event) => {
  const queryParams = getQuery(event)
  const tournoiId = queryParams.tournoi_id
  
  if (!tournoiId) {
    throw createError({ statusCode: 400, statusMessage: 'tournoi_id est requis' })
  }

  const result = await query(`
    SELECT m.*, 
      row_to_json(j1.*) as joueur1, 
      row_to_json(j2.*) as joueur2, 
      row_to_json(g.*) as gagnant
    FROM matchs m
    LEFT JOIN joueurs j1 ON j1.id = m.joueur1_id
    LEFT JOIN joueurs j2 ON j2.id = m.joueur2_id
    LEFT JOIN joueurs g ON g.id = m.gagnant_id
    WHERE m.tournoi_id = $1
    ORDER BY m.etape DESC, m.ordre ASC
  `, [tournoiId])

  return result.rows
})
