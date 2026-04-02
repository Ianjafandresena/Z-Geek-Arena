export default defineEventHandler(async (event) => {
  await requireAuth(event)
  return (await query('SELECT * FROM joueurs ORDER BY nom')).rows
})
