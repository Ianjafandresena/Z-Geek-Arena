import { ApiService } from './ApiService'
import type { CategorieRecompense, Vote } from '~/types/models'

export class RecompenseService extends ApiService {
  async getCategories(): Promise<CategorieRecompense[]> {
    return this.get<CategorieRecompense[]>('recompenses')
  }

  async getCategorieById(id: number): Promise<CategorieRecompense> {
    return this.get<CategorieRecompense>(`recompenses/${id}`)
  }

  async submitVote(joueurId: number, categorieId: number, valeur: string): Promise<Vote> {
    return this.post<Vote>('recompenses/vote', {
      joueur_id: joueurId,
      categorie_recompense_id: categorieId,
      valeur
    })
  }
}
