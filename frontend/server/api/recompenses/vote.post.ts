export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = await query(`
    INSERT INTO votes (joueur_id, categorie_recompense_id, valeur)
    VALUES ($1, $2, $3)
    ON CONFLICT (joueur_id, categorie_recompense_id) DO UPDATE SET valeur=$3, updated_at=NOW()
    RETURNING *
  `, [body.joueur_id, body.categorie_recompense_id, body.valeur])
  const vote = result.rows[0]
  const joueur = await query('SELECT * FROM joueurs WHERE id=$1', [vote.joueur_id])
  const cat = await query('SELECT * FROM categories_recompense WHERE id=$1', [vote.categorie_recompense_id])
  setResponseStatus(event, 201)
  return { ...vote, joueur: joueur.rows[0], categorieRecompense: cat.rows[0] }
})
