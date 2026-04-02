import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import type { H3Event } from 'h3'

const getSecret = () => process.env.JWT_SECRET || 'dev-secret-change-me'

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, getSecret(), { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, getSecret()) as { userId: number }
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed)
}

export async function requireAuth(event: H3Event) {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Token manquant.' })
  }
  const payload = verifyToken(authHeader.slice(7))
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: 'Token invalide.' })
  }
  const result = await query('SELECT id, name, email, role FROM users WHERE id = $1', [payload.userId])
  if (result.rows.length === 0) {
    throw createError({ statusCode: 401, statusMessage: 'Utilisateur introuvable.' })
  }
  return result.rows[0]
}
