import { ApiService } from './ApiService'
import type { Inscription } from '~/types/models'

export class InscriptionService extends ApiService {
  async getAll(tournoiId?: number): Promise<Inscription[]> {
    const query = tournoiId ? `inscriptions?tournoi_id=${tournoiId}` : 'inscriptions'
    return this.get<Inscription[]>(query)
  }

  async create(data: Partial<Inscription>): Promise<Inscription> {
    return this.post<Inscription>('inscriptions', data)
  }

  async update(id: number, data: Partial<Inscription>): Promise<Inscription> {
    return this.put<Inscription>(`inscriptions/${id}`, data)
  }

  async remove(id: number): Promise<void> {
    return this.delete(`inscriptions/${id}`)
  }
}
