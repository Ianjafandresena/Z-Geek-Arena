export default defineEventHandler(async () => {
  const result = await query(`
    SELECT j.*, COALESCE((SELECT json_agg(r.* ORDER BY r.ordre) FROM regles r WHERE r.jeu_id = j.id), '[]') as regles
    FROM jeux j
  `)
  return result.rows
})
