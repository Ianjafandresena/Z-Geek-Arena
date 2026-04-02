export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body?.email || !body?.password) {
    throw createError({ statusCode: 422, statusMessage: 'Email et mot de passe requis.' })
  }
  const result = await query('SELECT * FROM users WHERE email = $1', [body.email])
  if (result.rows.length === 0) {
    throw createError({ statusCode: 422, statusMessage: 'Identifiants invalides.' })
  }
  const user = result.rows[0]
  const valid = await comparePassword(body.password, user.password)
  if (!valid) {
    throw createError({ statusCode: 422, statusMessage: 'Identifiants invalides.' })
  }
  if (user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Accès non autorisé.' })
  }
  const token = generateToken(user.id)
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token }
})
