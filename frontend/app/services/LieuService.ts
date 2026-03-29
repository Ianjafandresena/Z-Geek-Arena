import { ApiService } from './ApiService'
import type { Lieu } from '~/types/models'

export class LieuService extends ApiService {
  async getAll(): Promise<Lieu[]> {
    return this.get<Lieu[]>('lieux')
  }

  async getById(id: number): Promise<Lieu> {
    return this.get<Lieu>(`lieux/${id}`)
  }

  async create(data: Partial<Lieu>): Promise<Lieu> {
    return this.post<Lieu>('lieux', data)
  }

  async update(id: number, data: Partial<Lieu>): Promise<Lieu> {
    return this.put<Lieu>(`lieux/${id}`, data)
  }

  async remove(id: number): Promise<void> {
    return this.delete(`lieux/${id}`)
  }
}
