import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { AuthRepositoryImpl } from '../data/repositories/AuthRepositoryImpl';

const authRepo = new AuthRepositoryImpl();

export const useAuthViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authRepo.login(email, password);
      await SecureStore.setItemAsync('user_token', result.token);
      router.replace('/main');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await authRepo.register(username, email, password);
      router.replace('/'); // Sudah diperbaiki agar kembali ke halaman login (index)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('user_token');
    router.replace('/');
  };

  return { handleLogin, handleRegister, handleLogout, loading, error };
};