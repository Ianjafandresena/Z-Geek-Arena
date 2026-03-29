import { JoueurService } from '~/services/JoueurService'
import type { Joueur } from '~/types/models'

export function useJoueurs() {
  const service = new JoueurService()
  const joueurs = ref<Joueur[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      joueurs.value = await service.getAll()
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function create(data: Partial<Joueur>): Promise<Joueur | null> {
    loading.value = true
    error.value = null
    try {
      const created = await service.create(data)
      joueurs.value.push(created)
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
      joueurs.value = joueurs.value.filter(j => j.id !== id)
      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  return { joueurs, loading, error, fetchAll, create, remove }
}
