export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = await query(
    'INSERT INTO inscriptions (joueur_id,tournoi_id,event_id,statut) VALUES ($1,$2,$3,$4) RETURNING *',
    [body.joueur_id, body.tournoi_id||null, body.event_id, body.statut||'inscrit']
  )
  const ins = result.rows[0]
  const joueur = await query('SELECT * FROM joueurs WHERE id=$1', [ins.joueur_id])
  const tournoi = ins.tournoi_id ? (await query('SELECT * FROM tournois WHERE id=$1', [ins.tournoi_id])).rows[0] : null
  const ev = ins.event_id ? (await query('SELECT * FROM events WHERE id=$1', [ins.event_id])).rows[0] : null
  setResponseStatus(event, 201)
  return { ...ins, joueur: joueur.rows[0], tournoi, event: ev }
})
