/**
 * Middleware de protection des routes admin.
 * Vérifie que le token Sanctum est valide en appelant /api/auth/me.
 * Redirige vers /backoffice/login si non authentifié.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // La page login n'a pas besoin de protection
  if (to.path === '/backoffice/login') return

  const token = useCookie('admin_token')

  if (!token.value) {
    return navigateTo('/backoffice/login')
  }

  // Vérifie que le token est encore valide
  const { fetchUser, isAuthenticated } = useAuth()

  if (!isAuthenticated.value) {
    const valid = await fetchUser()
    if (!valid) {
      return navigateTo('/backoffice/login')
    }
  }
})
