import { ActualiteService } from '~/services/ActualiteService'
import type { Actualite } from '~/types/models'

export function useActualites() {
  const service = new ActualiteService()
  const actualites = ref<Actualite[]>([])
  const currentArticle = ref<Actualite | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      actualites.value = await service.getAll()
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchBySlug(slug: string) {
    loading.value = true
    error.value = null
    try {
      currentArticle.value = await service.getBySlug(slug)
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function create(data: Partial<Actualite>) {
    loading.value = true
    try {
      const created = await service.create(data)
      actualites.value.push(created)
      return created
    } catch (e: any) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function remove(id: number) {
    loading.value = true
    try {
      await service.remove(id)
      actualites.value = actualites.value.filter(a => a.id !== id)
      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  return { actualites, currentArticle, loading, error, fetchAll, fetchBySlug, create, remove }
}
