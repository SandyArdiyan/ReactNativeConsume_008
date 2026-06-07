import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useHewanViewModel } from '../../hooks/useHewanViewModel';
import { Ionicons } from '@expo/vector-icons';

export default function MainScreen() {
  const { hewanList, loading, error, fetchHewan, deleteHewan } = useHewanViewModel();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchHewan();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHewan();
    setRefreshing(false);
  };

  const handleDelete = (id: number, nama: string) => {
    Alert.alert(
      'Hapus Data',
      `Yakin ingin menghapus ${nama}?`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', onPress: () => deleteHewan(id), style: 'destructive' },
      ]
    );
  };

  // Fungsi untuk menentukan warna berdasarkan status
  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'tersedia') return '#16a34a'; // Hijau
    if (s === 'terjual') return '#dc2626'; // Merah
    if (s === 'sakit') return '#ea580c'; // Orange
    if (s === 'karantina') return '#ca8a04'; // Kuning
    return '#64748b'; // Abu-abu (Default)
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <ThemedText style={styles.hewanName}>{item.nama}</ThemedText>
        <View style={styles.actionButtons}>
          <Link href={{ pathname: '/main/form', params: { id: item.id } }} asChild>
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="pencil" size={20} color="#0284c7" />
            </TouchableOpacity>
          </Link>
          <TouchableOpacity onPress={() => handleDelete(item.id, item.nama)} style={styles.deleteBtn}>
            <Ionicons name="trash" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
      
      <ThemedText style={styles.detailText}>{`Jenis: ${item.jenis}`}</ThemedText>
      
      {/* Cek apakah ada harga atau umur di database untuk ditampilkan */}
      {item.harga ? (
        <ThemedText style={styles.detailText}>{`Harga: Rp ${item.harga}`}</ThemedText>
      ) : null}
      
      {item.umur ? (
        <ThemedText style={styles.detailText}>{`Umur: ${item.umur} bulan`}</ThemedText>
      ) : null}

      {/* Tampilan Status yang dikasih Warna */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '1A' }]}>
          <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status ? item.status.toUpperCase() : 'TIDAK DIKETAHUI'}
          </ThemedText>
        </View>
      </View>

    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.header}>
          <ThemedText type="title" style={{color: '#0f172a'}}>{'Daftar Ternak'}</ThemedText>
          <Link href="/main/form" asChild>
            <TouchableOpacity style={styles.addBtn}>
              <Ionicons name="add" size={20} color="#fff" />
              <ThemedText style={styles.addBtnText}>{'Tambah'}</ThemedText>
            </TouchableOpacity>
          </Link>
        </View>

        {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

        {loading && !refreshing ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#0284c7" />
          </View>
        ) : (
          <FlatList
            data={hewanList}
            keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>{'Belum ada data ternak.'}</ThemedText>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff'
  },
  addBtn: {
    flexDirection: 'row',
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
  },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  errorText: { color: '#ef4444', textAlign: 'center', margin: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: 20, gap: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hewanName: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  actionButtons: { flexDirection: 'row', gap: 12 },
  editBtn: { padding: 4 },
  deleteBtn: { padding: 4 },
  detailText: { fontSize: 14, color: '#64748b', marginBottom: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#64748b' },
  
  // Style Baru untuk Status
  statusContainer: {
    marginTop: 10,
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});