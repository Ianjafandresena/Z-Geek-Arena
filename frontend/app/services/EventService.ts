import { ApiService } from './ApiService'
import type { Event } from '~/types/models'

export class EventService extends ApiService {
  async getAll(): Promise<Event[]> {
    return this.get<Event[]>('events')
  }

  async getBySlug(slug: string): Promise<Event> {
    return this.get<Event>(`events/${slug}`)
  }

  async getById(id: number | string): Promise<Event> {
    return this.get<Event>(`events/${id}`)
  }

  async create(data: Partial<Event>): Promise<Event> {
    return this.post<Event>('events', data)
  }

  async update(id: number, data: Partial<Event>): Promise<Event> {
    return this.put<Event>(`events/${id}`, data)
  }

  async remove(id: number): Promise<void> {
    return this.delete(`events/${id}`)
  }
}
