import { ApiService } from './ApiService'
import type { Actualite } from '~/types/models'

export class ActualiteService extends ApiService {
  async getAll(): Promise<Actualite[]> {
    return this.get<Actualite[]>('actualites')
  }

  async getById(id: number | string): Promise<Actualite> {
    return this.get<Actualite>(`actualites/${id}`)
  }

  async getBySlug(slug: string): Promise<Actualite> {
    return this.get<Actualite>(`actualites/${slug}`)
  }

  async create(data: FormData): Promise<Actualite> {
    return this.postFormData<Actualite>('actualites', data)
  }

  async update(id: number | string, data: FormData): Promise<Actualite> {
    return this.postFormData<Actualite>(`actualites/${id}`, data)
  }

  async remove(id: number | string): Promise<void> {
    return this.delete(`actualites/${id}`)
  }
}
