import { handleFileUpload } from '../../utils/upload'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const resultUpload = await handleFileUpload(event)
  const body = (resultUpload?.fields || await readBody(event) || {}) as Record<string, any>
  const imageUrl = resultUpload?.imageUrl || (body.image_url || null)
  
  const res = await query(
    `INSERT INTO actualites (event_id, titre, slug, contenu, extrait, image_url, categorie, publie, date_publication)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [body.event_id || null, body.titre, body.slug, body.contenu, body.extrait || null,
     imageUrl, body.categorie || 'nouvelles', body.publie === 'true' || body.publie === true,
     body.date_publication || new Date().toISOString()]
  )
  setResponseStatus(event, 201)
  return res.rows[0]
})
