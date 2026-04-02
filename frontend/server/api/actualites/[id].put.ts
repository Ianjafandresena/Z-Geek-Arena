import { handleFileUpload } from '../../utils/upload'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = getRouterParam(event, 'id')
  const resultUpload = await handleFileUpload(event)
  const body = (resultUpload?.fields || await readBody(event) || {}) as Record<string, any>
  const imageUrl = resultUpload?.imageUrl

  const fields: string[] = []
  const values: any[] = []
  let i = 1

  const allowedFields = ['event_id', 'titre', 'slug', 'contenu', 'extrait', 'categorie', 'publie', 'date_publication', 'image_url']
  for (const key of allowedFields) {
    if (body[key] !== undefined) {
      let val = body[key]
      if (key === 'publie') val = (val === 'true' || val === true)
      if (key === 'event_id' && val === '') val = null
      fields.push(`${key} = $${i}`)
      values.push(val)
      i++
    }
  }

  if (imageUrl) {
    fields.push(`image_url = $${i}`)
    values.push(imageUrl)
    i++
  }

  if (fields.length === 0 && !imageUrl) {
    throw createError({ statusCode: 422, statusMessage: 'Aucun champ à modifier.' })
  }

  fields.push(`updated_at = NOW()`)
  values.push(id)
  const result = await query(`UPDATE actualites SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, values)
  if (result.rows.length === 0) throw createError({ statusCode: 404, statusMessage: 'Actualité introuvable.' })
  return result.rows[0]
})
