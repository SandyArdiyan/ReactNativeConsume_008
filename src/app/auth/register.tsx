import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
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

    if (!cleanUsername) return Alert.alert('Validasi Gagal', 'Username wajib diisi!');
    if (cleanUsername.length < 3) return Alert.alert('Validasi Gagal', 'Username minimal 3 karakter!');
    if (/\s/.test(cleanUsername)) return Alert.alert('Validasi Gagal', 'Username tidak boleh mengandung spasi!');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail) return Alert.alert('Validasi Gagal', 'Email wajib diisi!');
    if (!emailRegex.test(cleanEmail)) return Alert.alert('Validasi Gagal', 'Format email salah!');

    if (!password) return Alert.alert('Validasi Gagal', 'Password wajib diisi!');
    if (password.length < 6) return Alert.alert('Validasi Gagal', 'Password minimal 6 karakter!');

    await handleRegister(cleanUsername, cleanEmail, password);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.card}>
        <Text style={[styles.title, { color: '#0f172a', fontSize: 24, fontWeight: 'bold' }]}>
          {'Daftar Akun Ternak'}
        </Text>
        <Text style={styles.subtitle}>
          {'Silakan isi data diri Anda untuk membuat akun baru'}
        </Text>

        <Text style={styles.label}>{'Username'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan username"
          placeholderTextColor="#94a3b8"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={styles.label}>{'Email'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan email"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>{'Password'}</Text>
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
            <Text style={styles.buttonText}>{'Daftar Sekarang'}</Text>
          )}
        </TouchableOpacity>

        <ThemedView style={styles.footer}>
          <Text style={{ color: '#0f172a' }}>{'Sudah punya akun? '}</Text>
          <TouchableOpacity onPress={() => router.replace('/')}>
            <Text style={styles.linkText}>
              {'Masuk di sini'}
            </Text>
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
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#0f172a' },
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
  linkText: { fontWeight: '600', color: '#0284c7' },
});