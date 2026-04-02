export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const body = await readBody(event)
  const result = await query(
    'INSERT INTO lieux (nom,adresse,ville,code_postal,pays) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [body.nom, body.adresse||null, body.ville, body.code_postal||null, body.pays||'France']
  )
  setResponseStatus(event, 201)
  return result.rows[0]
})
