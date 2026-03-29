import { TournoiService } from '~/services/TournoiService'
import type { Tournoi } from '~/types/models'

export function useTournois() {
  const service = new TournoiService()
  const tournois = ref<Tournoi[]>([])
  const currentTournoi = ref<Tournoi | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(eventId?: number) {
    loading.value = true
    error.value = null
    try {
      tournois.value = await service.getAll(eventId)
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: number) {
    loading.value = true
    error.value = null
    try {
      currentTournoi.value = await service.getById(id)
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function create(data: Partial<Tournoi>): Promise<Tournoi | null> {
    loading.value = true
    error.value = null
    try {
      const created = await service.create(data)
      tournois.value.push(created)
      return created
    } catch (e: any) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function update(id: number, data: Partial<Tournoi>): Promise<Tournoi | null> {
    loading.value = true
    error.value = null
    try {
      const updated = await service.update(id, data)
      const idx = tournois.value.findIndex(t => t.id === id)
      if (idx !== -1) tournois.value[idx] = updated
      return updated
    } catch (e: any) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function remove(id: number): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      await service.remove(id)
      tournois.value = tournois.value.filter(t => t.id !== id)
      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  return { tournois, currentTournoi, loading, error, fetchAll, fetchById, create, update, remove }
}
