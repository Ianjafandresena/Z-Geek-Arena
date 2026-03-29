import { ApiService } from './ApiService'
import type { Joueur } from '~/types/models'

export class JoueurService extends ApiService {
  async getAll(): Promise<Joueur[]> {
    return this.get<Joueur[]>('joueurs')
  }

  async getById(id: number): Promise<Joueur> {
    return this.get<Joueur>(`joueurs/${id}`)
  }

  async create(data: Partial<Joueur>): Promise<Joueur> {
    return this.post<Joueur>('joueurs', data)
  }

  async update(id: number, data: Partial<Joueur>): Promise<Joueur> {
    return this.put<Joueur>(`joueurs/${id}`, data)
  }

  async remove(id: number): Promise<void> {
    return this.delete(`joueurs/${id}`)
  }
}
