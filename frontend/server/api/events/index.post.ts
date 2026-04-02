export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const body = await readBody(event)
  const result = await query(
    `INSERT INTO events (lieu_id, nom, slug, description, date_debut, date_fin, statut, gradient, image_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [body.lieu_id, body.nom, body.slug, body.description || null, body.date_debut, body.date_fin,
     body.statut || 'a_venir', body.gradient || null, body.image_url || null]
  )
  const ev = result.rows[0]
  const lieu = await query('SELECT * FROM lieux WHERE id = $1', [ev.lieu_id])
  setResponseStatus(event, 201)
  return { ...ev, lieu: lieu.rows[0] || null }
})
