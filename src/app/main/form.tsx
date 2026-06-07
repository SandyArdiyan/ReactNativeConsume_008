import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useHewanViewModel } from '../../hooks/useHewanViewModel';

export default function AddHewanScreen() {
  const [nama, setNama] = useState('');
  const [jenis, setJenis] = useState('');
  const [harga, setHarga] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { addHewan, loading, error } = useHewanViewModel();
  const router = useRouter();

  const formatDateToString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setTanggalLahir(selectedDate);
    }
  };

  const onSubmit = () => {
    const cleanNama = nama.trim();
    const cleanJenis = jenis.trim();
    const numericHarga = Number(harga);

    if (!cleanNama) {
      Alert.alert('Validasi Gagal', 'Nama Hewan wajib diisi!');
      return;
    }

    if (!cleanJenis) {
      Alert.alert('Validasi Gagal', 'Jenis Hewan wajib diisi!');
      return;
    }

    if (!harga || isNaN(numericHarga) || numericHarga <= 0) {
      Alert.alert('Validasi Gagal', 'Harga harus berupa angka lebih besar dari 0!');
      return;
    }

    addHewan({
      nama: cleanNama,
      jenis: cleanJenis,
      harga: numericHarga,
      tanggal_lahir: formatDateToString(tanggalLahir),
      status: 'tersedia'
    }, () => {
      router.back();
    });
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        <ThemedView style={styles.header}>
          <ThemedText type="title">Tambah Ternak Baru</ThemedText>
        </ThemedView>

        <ThemedView style={styles.form}>
          {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

          <TextInput
            style={styles.input}
            placeholder="Nama Hewan"
            placeholderTextColor="#94a3b8"
            value={nama}
            onChangeText={setNama}
          />

          <TextInput
            style={styles.input}
            placeholder="Jenis (contoh: Sapi Limosin)"
            placeholderTextColor="#94a3b8"
            value={jenis}
            onChangeText={setJenis}
          />

          <TextInput
            style={styles.input}
            placeholder="Harga (Rupiah)"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={harga}
            onChangeText={(text) => {
              setHarga(text.replace(/[^0-9]/g, ''));
            }}
          />

          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.dateText}>
              Tanggal Lahir : {formatDateToString(tanggalLahir)}
            </ThemedText>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={tanggalLahir}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeDate}
              maximumDate={new Date()}
            />
          )}

          <TouchableOpacity style={styles.submitButton} onPress={onSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.submitButtonText}>Simpan ke Database</ThemedText>
            )}
          </TouchableOpacity>
        </ThemedView>

      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: 24 },
  header: { marginVertical: 24 },
  form: { gap: 16 },
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
  datePickerButton: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#0f172a',
  },
  submitButton: {
    backgroundColor: '#0284c7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: '#ef4444', textAlign: 'center', fontWeight: '600' },
});