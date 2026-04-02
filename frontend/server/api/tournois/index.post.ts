export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const body = await readBody(event)
  const result = await query(
    `INSERT INTO tournois (event_id,jeu_id,nom,date_debut,date_fin,phase,format,max_joueurs)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [body.event_id, body.jeu_id, body.nom||null, body.date_debut, body.date_fin||null,
     body.phase||'poules', body.format||'double_elimination', body.max_joueurs||64]
  )
  const t = result.rows[0]
  const ev = await query('SELECT * FROM events WHERE id=$1', [t.event_id])
  const jeu = await query('SELECT * FROM jeux WHERE id=$1', [t.jeu_id])
  setResponseStatus(event, 201)
  return { ...t, event: ev.rows[0], jeu: jeu.rows[0] }
})
