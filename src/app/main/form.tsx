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
  const { id } = useLocalSearchParams(); 
  const isEditMode = !!id;

  // State Form
  const [nama, setNama] = useState('');
  const [jenis, setJenis] = useState('');
  const [harga, setHarga] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState(new Date());
  const [status, setStatus] = useState('tersedia'); // Default status
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
          setStatus(data.status || 'tersedia'); // Ambil status dari DB
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
      return Alert.alert('Validasi Gagal', 'Pastikan semua form terisi dengan benar.');
    }

    // PAYLOAD DISESUAIKAN DENGAN BACKEND (tanggal_lahir)
    const payload = {
      nama: cleanNama,
      jenis: cleanJenis,
      harga: numericHarga,
      tanggal_lahir: formatDateToString(tanggalLahir),
      status: status as any // MEMAKSA TYPESCRIPT MENERIMA DATA INI
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
        
        {/* Header */}
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

          {/* Input Nama & Jenis */}
          <TextInput style={styles.input} placeholder="Nama Hewan" placeholderTextColor="#94a3b8" value={nama} onChangeText={setNama} />
          <TextInput style={styles.input} placeholder="Jenis (contoh: Sapi Limosin)" placeholderTextColor="#94a3b8" value={jenis} onChangeText={setJenis} />
          <TextInput style={styles.input} placeholder="Harga (Rupiah)" placeholderTextColor="#94a3b8" keyboardType="numeric" value={harga} onChangeText={(text) => setHarga(text.replace(/[^0-9]/g, ''))} />

          {/* Date Picker */}
          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
            <ThemedText style={{ color: '#0f172a' }}>{`Tanggal Lahir : ${formatDateToString(tanggalLahir)}`}</ThemedText>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker 
              value={tanggalLahir} 
              mode="date" 
              display={Platform.OS === 'ios' ? 'spinner' : 'default'} 
              onValueChange={(event, date) => { 
                setShowDatePicker(Platform.OS === 'ios'); 
                if (date) setTanggalLahir(date); 
              }} 
              onDismiss={() => setShowDatePicker(false)}
              maximumDate={new Date()} 
            />
          )}

          {/* DROPDOWN STATUS (Hanya menyertakan yang didukung DB) */}
          <ThemedText style={styles.label}>Status Ternak:</ThemedText>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={status}
              onValueChange={(itemValue) => setStatus(itemValue)}
              style={styles.picker}
              dropdownIconColor="#0284c7"
            >
              <Picker.Item label="Tersedia" value="tersedia" />
              <Picker.Item label="Terjual" value="terjual" />
            </Picker>
          </View>

          {/* Tombol Simpan */}
          <TouchableOpacity style={styles.submitButton} onPress={onSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.submitButtonText}>
                {isEditMode ? 'Simpan Perubahan' : 'Simpan ke Database'}
              </ThemedText>
            )}
          </TouchableOpacity>
          
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  safeArea: { flex: 1, paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  backButton: { marginRight: 16, padding: 4 },
  titleText: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  form: { gap: 12 },
  label: { fontSize: 14, fontWeight: '600', color: '#64748b', marginBottom: -4 },
  input: { 
    backgroundColor: '#f8fafc', 
    borderWidth: 1, 
    borderColor: '#cbd5e1', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    fontSize: 16, 
    color: '#0f172a' 
  },
  pickerWrapper: { 
    backgroundColor: '#f8fafc', 
    borderWidth: 1, 
    borderColor: '#cbd5e1', 
    borderRadius: 12, 
    overflow: 'hidden',
    justifyContent: 'center'
  },
  picker: { 
    width: '100%', 
    height: 55,
    color: '#0f172a'
  },
  submitButton: { 
    backgroundColor: '#0284c7', 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10,
    elevation: 2
  },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: '#ef4444', textAlign: 'center', fontWeight: '600' },
});