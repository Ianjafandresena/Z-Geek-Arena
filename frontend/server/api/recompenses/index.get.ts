export default defineEventHandler(async () => {
  return (await query('SELECT * FROM categories_recompense WHERE active=true ORDER BY nom')).rows
})
