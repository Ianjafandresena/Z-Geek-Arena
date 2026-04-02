export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const body = await readBody(event)
  const result = await query(
    'INSERT INTO jeux (nom, slug, plateforme, image_url) VALUES ($1,$2,$3,$4) RETURNING *',
    [body.nom, body.slug, body.plateforme || null, body.image_url || null]
  )
  setResponseStatus(event, 201)
  return result.rows[0]
})
