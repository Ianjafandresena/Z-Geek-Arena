export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const fields: string[] = []; const values: any[] = []; let i = 1
  for (const key of ['event_id','jeu_id','nom','date_debut','date_fin','phase','format','max_joueurs']) {
    if (body[key] !== undefined) { fields.push(`${key}=$${i}`); values.push(body[key]); i++ }
  }
  if (fields.length === 0) throw createError({ statusCode: 422, statusMessage: 'Aucun champ.' })
  fields.push('updated_at=NOW()'); values.push(id)
  const result = await query(`UPDATE tournois SET ${fields.join(',')} WHERE id=$${i} RETURNING *`, values)
  if (result.rows.length === 0) throw createError({ statusCode: 404, statusMessage: 'Tournoi introuvable.' })
  const t = result.rows[0]
  const ev = await query('SELECT * FROM events WHERE id=$1', [t.event_id])
  const jeu = await query('SELECT * FROM jeux WHERE id=$1', [t.jeu_id])
  return { ...t, event: ev.rows[0], jeu: jeu.rows[0] }
})
