import apiClient from '../api/apiClient';

export class AuthRepositoryImpl {
  async login(email: string, password: string) {
    const response = await apiClient.post('/api/v1/auth/login', { email, password });
    return response.data;
  }

  async register(username: string, email: string, password: string) {
    try {
      // Kita kembalikan jadi 'username' sesuai permintaan error server barusan
      const response = await apiClient.post('/api/v1/auth/register', { 
        username, // <-- Kembali jadi username
        email, 
        password 
      });
      return response.data;
    } catch (error: any) {
      console.log("=== ERROR DARI BACKEND ===");
      console.log("Status:", error.response?.status);
      console.log("Pesan API:", error.response?.data);
      console.log("==========================");
      throw error;
    }
  }
}