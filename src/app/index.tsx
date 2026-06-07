import { Link } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useAuthViewModel } from '../hooks/useAuthViewModel';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, loading, error } = useAuthViewModel();

  const onLoginPress = () => {
    if (!email.trim() || !password) {
      Alert.alert('Validasi Gagal', 'Email dan Password wajib diisi!');
      return;
    }
    handleLogin(email.trim(), password);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        <ThemedView style={styles.heroSection}>
          <ThemedText type="title" style={styles.title}>
            Masuk Akun Ternak
          </ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Kelola data peternakan Anda dengan mudah
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.formContainer}>
          {error && (
            <ThemedText style={styles.errorText}>
              {error}
            </ThemedText>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={onLoginPress}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <ThemedText style={styles.buttonText}>Login</ThemedText>
            )}
          </TouchableOpacity>
        </ThemedView>

        <Link href="/auth/register" asChild>
          <TouchableOpacity style={styles.footerLink}>
            <ThemedText type="link">Belum punya akun? Daftar di sini</ThemedText>
          </TouchableOpacity>
        </Link>

      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  safeArea: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', gap: 20 },
  heroSection: { alignItems: 'center', gap: 8, marginBottom: 10 },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center', color: '#64748b', fontSize: 14 },
  formContainer: { gap: 16, alignSelf: 'stretch' },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0f172a',
  },
  button: {
    backgroundColor: '#0284c7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: '#ef4444', textAlign: 'center', fontSize: 14, fontWeight: '600' },
  footerLink: { marginTop: 32, alignItems: 'center' },
});