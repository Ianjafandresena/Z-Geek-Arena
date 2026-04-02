export default defineNitroPlugin(async () => {
  try {
    console.log('[ZGA] 🚀 Starting database setup...')
    await runMigrations()
    await runSeed()
    console.log('[ZGA] ✅ Database ready!')
  } catch (error) {
    console.error('[ZGA] ❌ Database setup failed:', error)
  }
})
