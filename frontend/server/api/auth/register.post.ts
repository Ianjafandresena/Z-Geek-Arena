export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const body = await readBody(event)
  if (!body?.name || !body?.email || !body?.password || !body?.password_confirmation) {
    throw createError({ statusCode: 422, statusMessage: 'Tous les champs sont requis.' })
  }
  if (body.password !== body.password_confirmation) {
    throw createError({ statusCode: 422, statusMessage: 'Les mots de passe ne correspondent pas.' })
  }
  const existing = await query('SELECT id FROM users WHERE email = $1', [body.email])
  if (existing.rows.length > 0) {
    throw createError({ statusCode: 422, statusMessage: 'Cet email est déjà utilisé.' })
  }
  const hashed = await hashPassword(body.password)
  const result = await query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
    [body.name, body.email, hashed, 'admin']
  )
  const user = result.rows[0]
  const token = generateToken(user.id)
  setResponseStatus(event, 201)
  return { user, token }
})
