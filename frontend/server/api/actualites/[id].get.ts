export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  // Try by slug first, then by id
  let result = await query('SELECT a.*, row_to_json(e.*) as event FROM actualites a LEFT JOIN events e ON e.id=a.event_id WHERE a.slug=$1', [id])
  if (result.rows.length === 0 && !isNaN(Number(id))) {
    result = await query('SELECT a.*, row_to_json(e.*) as event FROM actualites a LEFT JOIN events e ON e.id=a.event_id WHERE a.id=$1', [id])
  }
  if (result.rows.length === 0) throw createError({ statusCode: 404, statusMessage: 'Actualité introuvable.' })
  return result.rows[0]
})
