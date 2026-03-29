// ===========================
// BASE API SERVICE
// Classe abstraite pour tous les services API
// Utilise $fetch (ofetch) pour les appels dynamiques
// Envoie automatiquement le token Sanctum
// ===========================

export class ApiService {
  protected baseUrl: string

  constructor() {
    const config = useRuntimeConfig()
    this.baseUrl = config.public.apiBase as string
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    }
    if (import.meta.client) {
      const token = useCookie('admin_token')
      if (token.value) {
        headers['Authorization'] = `Bearer ${token.value}`
      }
    }
    return headers
  }

  protected async get<T>(endpoint: string): Promise<T> {
    return await $fetch<T>(`${this.baseUrl}/${endpoint}`, {
      headers: this.getHeaders()
    })
  }

  protected async post<T>(endpoint: string, body: Record<string, any>): Promise<T> {
    return await $fetch<T>(`${this.baseUrl}/${endpoint}`, {
      method: 'POST',
      body,
      headers: this.getHeaders()
    })
  }

  protected async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const headers = this.getHeaders()
    return await $fetch<T>(`${this.baseUrl}/${endpoint}`, {
      method: 'POST',
      body: formData,
      headers
    })
  }

  protected async put<T>(endpoint: string, body: Record<string, any>): Promise<T> {
    return await $fetch<T>(`${this.baseUrl}/${endpoint}`, {
      method: 'PUT',
      body,
      headers: this.getHeaders()
    })
  }

  protected async delete(endpoint: string): Promise<void> {
    await $fetch(`${this.baseUrl}/${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    })
  }
}
