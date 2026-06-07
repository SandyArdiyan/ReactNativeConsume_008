import { useState, useCallback } from 'react';
import { HewanRepositoryImpl } from '../data/repositories/HewanRepositoryImpl';
import { Hewan } from '../domain/entities/Hewan';

const hewanRepo = new HewanRepositoryImpl();

export const useHewanViewModel = () => {
  const [hewanList, setHewanList] = useState<Hewan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHewan = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await hewanRepo.getAll();
      if (res.success || res.data) setHewanList(res.data || res);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil data hewan');
    } finally {
      setLoading(false);
    }
  }, []);

  const getHewanById = async (id: number) => {
    setLoading(true); setError(null);
    try {
      const res = await hewanRepo.getById(id);
      return res.data || res;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil detail data');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addHewan = async (payload: Omit<Hewan, 'id'>, onSuccess: () => void) => {
    setLoading(true); setError(null);
    try {
      await hewanRepo.create(payload);
      await fetchHewan();
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menambahkan hewan');
    } finally {
      setLoading(false);
    }
  };

  const updateHewan = async (id: number, payload: Partial<Hewan>, onSuccess: () => void) => {
    setLoading(true); setError(null);
    try {
      await hewanRepo.update(id, payload);
      await fetchHewan();
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengedit hewan');
    } finally {
      setLoading(false);
    }
  };

  const deleteHewan = async (id: number) => {
    try {
      await hewanRepo.delete(id);
      setHewanList((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menghapus data');
    }
  };

  return { hewanList, loading, error, fetchHewan, getHewanById, addHewan, updateHewan, deleteHewan };
};