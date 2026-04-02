export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const cat = await query('SELECT * FROM categories_recompense WHERE id=$1', [id])
  if (cat.rows.length === 0) throw createError({ statusCode: 404, statusMessage: 'Catégorie introuvable.' })
  const votes = await query(`
    SELECT v.*, row_to_json(jo.*) as joueur
    FROM votes v LEFT JOIN joueurs jo ON jo.id=v.joueur_id
    WHERE v.categorie_recompense_id=$1`, [id])
  return { ...cat.rows[0], votes: votes.rows }
})
