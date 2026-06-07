import apiClient from '../api/apiClient';

export class AuthRepositoryImpl {
  async login(email: string, password: string) {
    // Sesuaikan endpoint '/api/auth/login' dengan endpoint asli backend kamu
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response.data;
  }

  async register(username: string, email: string, password: string) {
    // Sesuaikan endpoint '/api/auth/register' dengan endpoint asli backend kamu
    const response = await apiClient.post('/api/auth/register', { username, email, password });
    return response.data;
  }
}