export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = await query(`
    SELECT t.*, row_to_json(j.*) as jeu,
      (SELECT row_to_json(sub.*) FROM (SELECT e.*, row_to_json(l.*) as lieu FROM events e LEFT JOIN lieux l ON l.id=e.lieu_id WHERE e.id=t.event_id) sub) as event,
      COALESCE((SELECT json_agg(jo.*) FROM joueurs jo INNER JOIN inscriptions i ON i.joueur_id=jo.id WHERE i.tournoi_id=t.id),'[]') as joueurs
    FROM tournois t LEFT JOIN jeux j ON j.id=t.jeu_id WHERE t.id=$1
  `, [id])
  if (result.rows.length === 0) throw createError({ statusCode: 404, statusMessage: 'Tournoi introuvable.' })
  return result.rows[0]
})
