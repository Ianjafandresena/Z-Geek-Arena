import { AuthService } from '~/services/AuthService'

interface AdminUser {
  id: number
  name: string
  email: string
  role: string
}

export function useAuth() {
  const service = new AuthService()
  
  // Use Nuxt useState for state sharing between client and server (hydratation)
  const adminUser = useState<AdminUser | null>('auth_user', () => null)
  const isAuthenticated = useState<boolean>('auth_authenticated', () => false)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const token = useCookie('admin_token', { maxAge: 60 * 60 * 24 * 7 }) // 7 jours

  /**
   * Connexion admin
   */
  async function login(email: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      const res = await service.login(email, password)
      console.log('Login success:', res)
      
      // Mise à jour de l'état global
      token.value = res.token
      adminUser.value = res.user
      isAuthenticated.value = true
      
      return true
    } catch (e: any) {
      console.error('Login error:', e)
      error.value = e.data?.message || e.message || 'Identifiants invalides.'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Inscription d'un nouveau admin (doit être connecté)
   */
  async function register(name: string, email: string, password: string, password_confirmation: string): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      await service.register(name, email, password, password_confirmation)
      return true
    } catch (e: any) {
      error.value = e.message || 'Erreur lors de la création.'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Récupère l'utilisateur courant à partir du token
   */
  async function fetchUser(): Promise<boolean> {
    if (!token.value) return false
    try {
      const user = await service.me()
      adminUser.value = user
      isAuthenticated.value = true
      return true
    } catch {
      token.value = null
      adminUser.value = null
      isAuthenticated.value = false
      return false
    }
  }

  /**
   * Déconnexion
   */
  async function logout() {
    try {
      await service.logout()
    } catch {
      // Ignorer les erreurs de déconnexion
    }
    token.value = null
    adminUser.value = null
    isAuthenticated.value = false
    navigateTo('/backoffice/login')
  }

  return {
    adminUser,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    fetchUser,
    logout
  }
}
