import pg from 'pg'

let pool: pg.Pool | null = null

export function getPool(): pg.Pool {
  if (!pool) {
    const dbUrl = process.env.DATABASE_URL
    
    if (!dbUrl) {
      console.error('[ZGA] ❌ DATABASE_URL is not defined in the environment!')
    }
    
    if (dbUrl) {
      // Parse URL manually to avoid SCRAM auth issues
      const url = new URL(dbUrl)
      pool = new pg.Pool({
        host: url.hostname,
        port: parseInt(url.port) || 5432,
        database: url.pathname.slice(1),
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        ssl: { rejectUnauthorized: false }
      })
    } else {
      pool = new pg.Pool()
    }
  }
  return pool
}

export async function query(text: string, params?: any[]) {
  return await getPool().query(text, params)
}
