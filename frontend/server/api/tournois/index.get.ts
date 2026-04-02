export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  let sql = `SELECT t.*, row_to_json(e.*) as event, row_to_json(j.*) as jeu
    FROM tournois t LEFT JOIN events e ON e.id = t.event_id LEFT JOIN jeux j ON j.id = t.jeu_id`
  const params: any[] = []
  if (q.event_id) { sql += ' WHERE t.event_id = $1'; params.push(q.event_id) }
  sql += ' ORDER BY t.date_debut'
  return (await query(sql, params)).rows
})
