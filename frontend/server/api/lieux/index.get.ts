export default defineEventHandler(async () => {
  return (await query('SELECT * FROM lieux ORDER BY nom')).rows
})
