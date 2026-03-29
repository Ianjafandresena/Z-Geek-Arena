import { ApiService } from './ApiService'
import type { Jeu } from '~/types/models'

export class JeuService extends ApiService {
  async getAll(): Promise<Jeu[]> {
    return this.get<Jeu[]>('jeux')
  }

  async getById(id: number): Promise<Jeu> {
    return this.get<Jeu>(`jeux/${id}`)
  }

  async create(data: FormData): Promise<Jeu> {
    return this.postFormData<Jeu>('jeux', data)
  }

  async updateWithImage(id: number, data: FormData): Promise<Jeu> {
    return this.postFormData<Jeu>(`jeux/${id}`, data)
  }

  async remove(id: number): Promise<void> {
    return this.delete(`jeux/${id}`)
  }
}
