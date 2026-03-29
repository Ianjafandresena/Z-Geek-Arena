import { ApiService } from './ApiService'

interface LoginResponse {
  user: { id: number; name: string; email: string; role: string }
  token: string
}

export class AuthService extends ApiService {
  async login(email: string, password: string): Promise<LoginResponse> {
    return this.post<LoginResponse>('auth/login', { email, password })
  }

  async register(name: string, email: string, password: string, password_confirmation: string): Promise<LoginResponse> {
    return this.post<LoginResponse>('auth/register', { name, email, password, password_confirmation })
  }

  async me(): Promise<any> {
    return this.get('auth/me')
  }

  async logout(): Promise<void> {
    return this.post('auth/logout', {})
  }
}
