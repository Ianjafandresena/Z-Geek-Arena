export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  // Try by slug first, then by id
  let result = await query(`
    SELECT e.*, row_to_json(l.*) as lieu,
      COALESCE((SELECT json_agg(
        json_build_object('id',t.id,'event_id',t.event_id,'jeu_id',t.jeu_id,'nom',t.nom,
          'date_debut',t.date_debut,'date_fin',t.date_fin,'phase',t.phase,'format',t.format,
          'max_joueurs',t.max_joueurs,'created_at',t.created_at,'updated_at',t.updated_at,
          'jeu',(SELECT row_to_json(j.*) FROM jeux j WHERE j.id = t.jeu_id))
      ) FROM tournois t WHERE t.event_id = e.id), '[]') as tournois,
      COALESCE((SELECT json_agg(a.*) FROM actualites a WHERE a.event_id = e.id), '[]') as actualites
    FROM events e LEFT JOIN lieux l ON l.id = e.lieu_id
    WHERE e.slug = $1
  `, [id])
  if (result.rows.length === 0 && !isNaN(Number(id))) {
    result = await query(`SELECT e.*, row_to_json(l.*) as lieu FROM events e LEFT JOIN lieux l ON l.id = e.lieu_id WHERE e.id = $1`, [id])
  }
  if (result.rows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Événement introuvable.' })
  }
  return result.rows[0]
})
