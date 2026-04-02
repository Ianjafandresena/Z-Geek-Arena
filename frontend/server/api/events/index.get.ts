export default defineEventHandler(async () => {
  const result = await query(`
    SELECT e.*, row_to_json(l.*) as lieu,
      COALESCE((SELECT json_agg(t.*) FROM tournois t WHERE t.event_id = e.id), '[]') as tournois
    FROM events e
    LEFT JOIN lieux l ON l.id = e.lieu_id
    ORDER BY e.date_debut
  `)
  return result.rows.map(r => ({ ...r, lieu: r.lieu, tournois: r.tournois }))
})
