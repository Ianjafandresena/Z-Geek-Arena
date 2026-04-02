export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body?.nom || !body?.email || !body?.pseudo) {
    throw createError({ statusCode: 422, statusMessage: 'Nom, email et pseudo requis.' })
  }
  const result = await query(
    'INSERT INTO joueurs (nom,email,pseudo,avatar_url) VALUES ($1,$2,$3,$4) RETURNING *',
    [body.nom, body.email, body.pseudo, body.avatar_url||null]
  )
  setResponseStatus(event, 201)
  return result.rows[0]
})
