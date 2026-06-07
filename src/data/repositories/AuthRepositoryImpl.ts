import apiClient from '../api/apiClient';

export class AuthRepositoryImpl {
  async login(email: string, password: string) {
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response.data;
  }

  async register(username: string, email: string, password: string) {
    try {
      const response = await apiClient.post('/api/auth/register', { username, email, password });
      return response.data;
    } catch (error: any) {
      // Menangkap dan mencetak error asli dari server Railway ke Terminal VS Code
      console.log("=== ERROR DARI BACKEND ===");
      console.log("Status:", error.response?.status);
      console.log("Pesan API:", error.response?.data);
      console.log("==========================");
      throw error;
    }
  }
}