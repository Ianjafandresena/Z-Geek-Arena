import { RecompenseService } from '~/services/RecompenseService'
import type { CategorieRecompense } from '~/types/models'

export function useRecompenses() {
  const service = new RecompenseService()
  const categories = ref<CategorieRecompense[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCategories() {
    loading.value = true
    error.value = null
    try {
      categories.value = await service.getCategories()
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function vote(joueurId: number, categorieId: number, valeur: string) {
    try {
      return await service.submitVote(joueurId, categorieId, valeur)
    } catch (e: any) {
      error.value = e.message
      return null
    }
  }

  return { categories, loading, error, fetchCategories, vote }
}
