import { JeuService } from '~/services/JeuService'
import type { Jeu } from '~/types/models'

export function useJeux() {
  const service = new JeuService()
  const jeux = ref<Jeu[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      jeux.value = await service.getAll()
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function create(formData: FormData): Promise<Jeu | null> {
    loading.value = true
    error.value = null
    try {
      const created = await service.create(formData)
      jeux.value.push(created)
      return created
    } catch (e: any) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function remove(id: number): Promise<boolean> {
    loading.value = true
    try {
      await service.remove(id)
      jeux.value = jeux.value.filter(j => j.id !== id)
      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  return { jeux, loading, error, fetchAll, create, remove }
}
