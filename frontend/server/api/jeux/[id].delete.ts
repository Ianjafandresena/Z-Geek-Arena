export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = getRouterParam(event, 'id')
  const result = await query('DELETE FROM jeux WHERE id = $1 RETURNING id', [id])
  if (result.rows.length === 0) throw createError({ statusCode: 404, statusMessage: 'Jeu introuvable.' })
  setResponseStatus(event, 204)
  return null
})
