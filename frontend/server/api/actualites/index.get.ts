export default defineEventHandler(async () => {
  const result = await query(`
    SELECT a.*, row_to_json(e.*) as event
    FROM actualites a LEFT JOIN events e ON e.id = a.event_id
    WHERE a.publie = true ORDER BY a.date_publication DESC
  `)
  return result.rows
})
