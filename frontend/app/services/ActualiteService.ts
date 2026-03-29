import { ApiService } from './ApiService'
import type { Actualite } from '~/types/models'

export class ActualiteService extends ApiService {
  async getAll(): Promise<Actualite[]> {
    return this.get<Actualite[]>('actualites')
  }

  async getBySlug(slug: string): Promise<Actualite> {
    return this.get<Actualite>(`actualites/${slug}`)
  }

  async create(data: Partial<Actualite>): Promise<Actualite> {
    return this.post<Actualite>('actualites', data)
  }

  async update(id: number, data: Partial<Actualite>): Promise<Actualite> {
    return this.put<Actualite>(`actualites/${id}`, data)
  }

  async remove(id: number): Promise<void> {
    return this.delete(`actualites/${id}`)
  }
}
