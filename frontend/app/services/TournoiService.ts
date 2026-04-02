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

  async remove(id: number | string): Promise<void> {
    return this.delete(`tournois/${id}`)
  }

  async generateBracket(tournoiId: number | string): Promise<any> {
    return this.post('matchs/generate', { tournoi_id: tournoiId })
  }

  async getMatches(tournoiId: number | string): Promise<any[]> {
    return this.get<any[]>(`matchs?tournoi_id=${tournoiId}`)
  }

  async updateMatch(matchId: number | string, data: any): Promise<any> {
    return this.put(`matchs/${matchId}`, data)
  }
}
