import APIBase from './httpBase'

export interface PublicUser {
  id: string
  name: string
  email: string
  createdAt: string
}

class AuthService extends APIBase {
  async login(email: string, password: string) {
    const { data } = await this.post<{ token: string; user: PublicUser }>('auth/login', {
      email,
      password,
    })
    return data
  }

  async me(): Promise<PublicUser> {
    const { data } = await this.get<PublicUser>('auth/me')
    return data
  }

  async listUsers(): Promise<PublicUser[]> {
    const { data } = await this.get<PublicUser[]>('auth/users')
    return data
  }

  async createUser(name: string, email: string, password: string): Promise<PublicUser> {
    const { data } = await this.post<PublicUser>('auth/register', {
      name,
      email,
      password,
    })
    return data
  }

  async deleteUser(id: string): Promise<void> {
    await this.delete(`auth/users/${id}`)
  }

  async forgotPassword(email: string): Promise<void> {
    await this.post('auth/forgot-password', { email })
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await this.post('auth/reset-password', { token, password })
  }
}

export const authService = new AuthService()
