export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const q = getQuery(event)
  let sql = `SELECT i.*, row_to_json(jo.*) as joueur,
    row_to_json(t.*) as tournoi, row_to_json(ev.*) as event
    FROM inscriptions i
    LEFT JOIN joueurs jo ON jo.id=i.joueur_id
    LEFT JOIN tournois t ON t.id=i.tournoi_id
    LEFT JOIN events ev ON ev.id=i.event_id WHERE 1=1`
  const params: any[] = []; let n = 1
  if (q.tournoi_id) { sql += ` AND i.tournoi_id=$${n}`; params.push(q.tournoi_id); n++ }
  if (q.event_id) { sql += ` AND i.event_id=$${n}`; params.push(q.event_id); n++ }
  if (q.joueur_id) { sql += ` AND i.joueur_id=$${n}`; params.push(q.joueur_id); n++ }
  return (await query(sql, params)).rows
})
