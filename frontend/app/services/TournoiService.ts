import { ApiService } from './ApiService'
import type { Tournoi } from '~/types/models'

export class TournoiService extends ApiService {
  async getAll(eventId?: number): Promise<Tournoi[]> {
    const query = eventId ? `tournois?event_id=${eventId}` : 'tournois'
    return this.get<Tournoi[]>(query)
  }

  async getById(id: number): Promise<Tournoi> {
    return this.get<Tournoi>(`tournois/${id}`)
  }

  async create(data: Partial<Tournoi>): Promise<Tournoi> {
    return this.post<Tournoi>('tournois', data)
  }

  async update(id: number, data: Partial<Tournoi>): Promise<Tournoi> {
    return this.put<Tournoi>(`tournois/${id}`, data)
  }

  async remove(id: number): Promise<void> {
    return this.delete(`tournois/${id}`)
  }
}
