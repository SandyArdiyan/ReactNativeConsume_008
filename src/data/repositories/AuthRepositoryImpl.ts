import apiClient from '../api/apiClient';

export class AuthRepositoryImpl {
  async login(email: string, password: string) {
    // Kita coba rute standar login
    const response = await apiClient.post('/login', { email, password });
    return response.data;
  }

  async register(username: string, email: string, password: string) {
    try {
      // Sando, saya ganti rutenya menjadi '/signup' (karena /register gagal terus)
      // Jika masih 404, kita akan coba rute lain
      const response = await apiClient.post('/signup', { username, email, password });
      return response.data;
    } catch (error: any) {
      console.log("=== CCTV BACKEND ===");
      console.log("Status:", error.response?.status);
      console.log("URL yang ditembak:", error.config?.url);
      console.log("Metode:", error.config?.method);
      console.log("Pesan API:", error.response?.data);
      console.log("====================");
      throw error;
    }
  }
}