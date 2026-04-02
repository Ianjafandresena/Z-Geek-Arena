export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = getRouterParam(event, 'id')
  const result = await query('SELECT * FROM joueurs WHERE id=$1', [id])
  if (result.rows.length === 0) throw createError({ statusCode: 404, statusMessage: 'Joueur introuvable.' })
  const joueur = result.rows[0]
  const inscriptions = await query(`
    SELECT i.*, row_to_json(t.*) as tournoi, row_to_json(j.*) as jeu
    FROM inscriptions i LEFT JOIN tournois t ON t.id=i.tournoi_id LEFT JOIN jeux j ON j.id=t.jeu_id
    WHERE i.joueur_id=$1`, [id])
  const votes = await query(`
    SELECT v.*, row_to_json(c.*) as "categorieRecompense"
    FROM votes v LEFT JOIN categories_recompense c ON c.id=v.categorie_recompense_id
    WHERE v.joueur_id=$1`, [id])
  return { ...joueur, inscriptions: inscriptions.rows, votes: votes.rows }
})
