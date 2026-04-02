export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = await query(`
    SELECT j.*,
      COALESCE((SELECT json_agg(r.* ORDER BY r.ordre) FROM regles r WHERE r.jeu_id = j.id), '[]') as regles,
      COALESCE((SELECT json_agg(json_build_object('id',t.id,'nom',t.nom,'event',(SELECT row_to_json(e.*) FROM events e WHERE e.id = t.event_id)))
        FROM tournois t WHERE t.jeu_id = j.id), '[]') as tournois
    FROM jeux j WHERE j.id = $1
  `, [id])
  if (result.rows.length === 0) throw createError({ statusCode: 404, statusMessage: 'Jeu introuvable.' })
  return result.rows[0]
})
