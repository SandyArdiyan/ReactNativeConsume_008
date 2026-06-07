import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useAuthViewModel } from '../../hooks/useAuthViewModel';

export default function RegisterScreen() {
  const router = useRouter();
  const { handleRegister, loading, error } = useAuthViewModel();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (error) {
      Alert.alert('Pendaftaran Gagal', error);
    }
  }, [error]);

  const onRegisterPress = async () => {
    const cleanUsername = username.trim();
    const cleanEmail = email.trim();

    if (!cleanUsername) {
      Alert.alert('Validasi Gagal', 'Username wajib diisi!');
      return;
    }
    if (cleanUsername.length < 3) {
      Alert.alert('Validasi Gagal', 'Username minimal 3 karakter!');
      return;
    }
    if (/\s/.test(cleanUsername)) {
      Alert.alert('Validasi Gagal', 'Username tidak boleh mengandung spasi!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail) {
      Alert.alert('Validasi Gagal', 'Email wajib diisi!');
      return;
    }
    if (!emailRegex.test(cleanEmail)) {
      Alert.alert('Validasi Gagal', 'Format email salah!');
      return;
    }

    if (!password) {
      Alert.alert('Validasi Gagal', 'Password wajib diisi!');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Validasi Gagal', 'Password minimal 6 karakter!');
      return;
    }

    await handleRegister(cleanUsername, cleanEmail, password);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.card}>
        <ThemedText type="title" style={styles.title}>
          Daftar Akun Ternak
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Silakan isi data diri Anda untuk membuat akun baru
        </ThemedText>

        <ThemedText style={styles.label}>Username</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Masukkan username"
          placeholderTextColor="#94a3b8"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <ThemedText style={styles.label}>Email</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Masukkan email"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <ThemedText style={styles.label}>Password</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Masukkan password"
          placeholderTextColor="#94a3b8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={onRegisterPress}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Daftar Sekarang</ThemedText>
          )}
        </TouchableOpacity>

        <ThemedView style={styles.footer}>
          <ThemedText>Sudah punya akun? </ThemedText>
          <TouchableOpacity onPress={() => router.replace('/')}>
            <ThemedText type="link" style={styles.linkText}>
              Masuk di sini
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  card: { padding: 16, borderRadius: 12 },
  title: { textAlign: 'center', marginBottom: 8 },
  subtitle: { textAlign: 'center', color: '#64748b', fontSize: 14, marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    marginBottom: 16,
  },
  button: { backgroundColor: '#0284c7', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { backgroundColor: '#94a3b8' },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24, backgroundColor: 'transparent' },
  linkText: { fontWeight: '600' },
});