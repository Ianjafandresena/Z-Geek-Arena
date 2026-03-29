import { EventService } from '~/services/EventService'
import type { Event } from '~/types/models'

/**
 * Composable pour charger et manipuler les événements.
 * Fait office de Controller dans le pattern MVC.
 */
export function useEvents() {
  const service = new EventService()
  const events = ref<Event[]>([])
  const currentEvent = ref<Event | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Récupère tous les événements depuis l'API
   */
  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      events.value = await service.getAll()
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  /**
   * Récupère un événement par son slug
   */
  async function fetchBySlug(slug: string) {
    loading.value = true
    error.value = null
    try {
      currentEvent.value = await service.getBySlug(slug)
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  /**
   * Crée un nouvel événement
   */
  async function create(data: Partial<Event>): Promise<Event | null> {
    loading.value = true
    error.value = null
    try {
      const created = await service.create(data)
      events.value.push(created)
      return created
    } catch (e: any) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Met à jour un événement existant
   */
  async function update(id: number, data: Partial<Event>): Promise<Event | null> {
    loading.value = true
    error.value = null
    try {
      const updated = await service.update(id, data)
      const idx = events.value.findIndex(e => e.id === id)
      if (idx !== -1) events.value[idx] = updated
      return updated
    } catch (e: any) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Supprime un événement
   */
  async function remove(id: number): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      await service.remove(id)
      events.value = events.value.filter(e => e.id !== id)
      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    events,
    currentEvent,
    loading,
    error,
    fetchAll,
    fetchBySlug,
    create,
    update,
    remove
  }
}
