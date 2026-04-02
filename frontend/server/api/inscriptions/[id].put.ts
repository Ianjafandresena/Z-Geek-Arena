export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const fields: string[] = []; const values: any[] = []; let i = 1
  for (const key of ['statut','classement']) {
    if (body[key] !== undefined) { fields.push(`${key}=$${i}`); values.push(body[key]); i++ }
  }
  if (fields.length === 0) throw createError({ statusCode: 422, statusMessage: 'Aucun champ.' })
  fields.push('updated_at=NOW()'); values.push(id)
  const result = await query(`UPDATE inscriptions SET ${fields.join(',')} WHERE id=$${i} RETURNING *`, values)
  if (result.rows.length === 0) throw createError({ statusCode: 404, statusMessage: 'Inscription introuvable.' })
  return result.rows[0]
})
