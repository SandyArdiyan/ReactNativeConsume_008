import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useHewanViewModel } from '../../hooks/useHewanViewModel';
import { Ionicons } from '@expo/vector-icons';

export default function FormHewanScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Mendapatkan ID jika sedang dalam mode Edit
  const isEditMode = !!id;

  const [nama, setNama] = useState('');
  const [jenis, setJenis] = useState('');
  const [harga, setHarga] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState(new Date());
  const [status, setStatus] = useState('tersedia');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { addHewan, updateHewan, getHewanById, loading, error } = useHewanViewModel();

  // Load data jika dalam mode Edit
  useEffect(() => {
    if (isEditMode) {
      const loadData = async () => {
        const data = await getHewanById(Number(id));
        if (data) {
          setNama(data.nama);
          setJenis(data.jenis);
          setHarga(data.harga.toString());
          setStatus(data.status || 'tersedia');
          if (data.tanggal_lahir) {
            setTanggalLahir(new Date(data.tanggal_lahir));
          }
        }
      };
      loadData();
    }
  }, [id]);

  const formatDateToString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const onSubmit = () => {
    const cleanNama = nama.trim();
    const cleanJenis = jenis.trim();
    const numericHarga = Number(harga);

    if (!cleanNama || !cleanJenis || !harga || isNaN(numericHarga) || numericHarga <= 0) {
      return Alert.alert('Validasi Gagal', 'Pastikan semua form terisi dengan benar (Harga berupa angka > 0).');
    }

    const payload = {
      nama: cleanNama,
      jenis: cleanJenis,
      harga: numericHarga,
      tanggalLahir: formatDateToString(tanggalLahir),
      status: status
    };

    if (isEditMode) {
      updateHewan(Number(id), payload, () => router.back());
    } else {
      addHewan(payload, () => router.back());
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header dengan Tombol Kembali */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.titleText}>
            {isEditMode ? 'Edit Data Ternak' : 'Tambah Ternak Baru'}
          </ThemedText>
        </View>

        <ThemedView style={styles.form}>
          {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

          <TextInput style={styles.input} placeholder="Nama Hewan" placeholderTextColor="#94a3b8" value={nama} onChangeText={setNama} />
          <TextInput style={styles.input} placeholder="Jenis (contoh: Sapi Limosin)" placeholderTextColor="#94a3b8" value={jenis} onChangeText={setJenis} />
          <TextInput style={styles.input} placeholder="Harga (Rupiah)" placeholderTextColor="#94a3b8" keyboardType="numeric" value={harga} onChangeText={(text) => setHarga(text.replace(/[^0-9]/g, ''))} />

          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
            <ThemedText style={{ color: '#0f172a' }}>{'Tanggal Lahir : ' + formatDateToString(tanggalLahir)}</ThemedText>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker value={tanggalLahir} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(event, date) => { setShowDatePicker(Platform.OS === 'ios'); if (date) setTanggalLahir(date); }} maximumDate={new Date()} />
          )}

          {/* Dropdown Status */}
          <View style={styles.pickerContainer}>
            <Picker selectedValue={status} onValueChange={(itemValue) => setStatus(itemValue)} style={styles.picker}>
              <Picker.Item label="Tersedia" value="tersedia" />
              <Picker.Item label="Terjual" value="terjual" />
              <Picker.Item label="Sakit" value="sakit" />
            </Picker>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={onSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.submitButtonText}>{isEditMode ? 'Simpan Perubahan' : 'Simpan ke Database'}</ThemedText>}
          </TouchableOpacity>
          
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  backButton: { marginRight: 16, padding: 4 },
  titleText: { fontSize: 22 },
  form: { gap: 16 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#0f172a' },
  pickerContainer: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, overflow: 'hidden' },
  picker: { width: '100%', height: 50 },
  submitButton: { backgroundColor: '#0284c7', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: '#ef4444', textAlign: 'center', fontWeight: '600' },
});