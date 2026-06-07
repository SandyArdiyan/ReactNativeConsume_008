import { Slot, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
// Jika file global.css kamu tidak ada, baris require ini bisa dihapus saja
// require('../global.css'); 

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync('user_token');
      
      // Deteksi apakah pengguna sedang di halaman awal (/) atau di dalam folder /auth/
      const isAuthScreen = (segments as string[]).length === 0 || segments[0] === 'auth';

      if (!token && !isAuthScreen) {
        // Jika belum login dan mencoba masuk ke halaman lain, paksa kembali ke '/' (index.tsx)
        router.replace('/');
      } else if (token && isAuthScreen) {
        // Jika sudah punya token tapi malah berada di halaman login/register, arahkan ke dashboard
        router.replace('/main');
      }
      setIsReady(true);
    };

    checkAuth();
  }, [segments]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0284c7" />
      </View>
    );
  }

  return <Slot />;
}