export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const fields: string[] = []
  const values: any[] = []
  let i = 1
  for (const key of ['lieu_id','nom','slug','description','salle','date_debut','date_fin','statut','gradient','image_url']) {
    if (body[key] !== undefined) { 
      fields.push(`${key} = $${i}`); 
      values.push(body[key]); 
      i++ 
    }
  }
  if (fields.length === 0) throw createError({ statusCode: 422, statusMessage: 'Aucun champ à modifier.' })
  fields.push(`updated_at = NOW()`)
  values.push(id)
  const result = await query(`UPDATE events SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, values)
  if (result.rows.length === 0) throw createError({ statusCode: 404, statusMessage: 'Événement introuvable.' })
  const ev = result.rows[0]
  const lieu = await query('SELECT * FROM lieux WHERE id = $1', [ev.lieu_id])
  return { ...ev, lieu: lieu.rows[0] || null }
})
