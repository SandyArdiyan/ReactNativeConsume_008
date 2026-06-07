import { APIResponse, Hewan } from "@/domain/entities/Hewan";
import { IHewanRepository } from "@/domain/repositories/IHewanRepository";
import apiClient from "../api/apiClient";

export class HewanRepositoryImpl implements IHewanRepository {
    async getAll(): Promise<APIResponse<Hewan[]>> {
        const response = await apiClient.get<APIResponse<Hewan[]>>('/api/v1/hewan'); // Ditambah /api/v1/
        return response.data;
    }

    async getById(id: number) {
        const response = await apiClient.get(`/api/v1/hewan/${id}`); // Ditambah /api/v1/
        return response.data;
    }

    async create(hewan: Omit<Hewan, 'id'>): Promise<APIResponse<Hewan>> {
        try {
            const response = await apiClient.post<APIResponse<Hewan>>('/api/v1/hewan', hewan); // Ditambah /api/v1/
            return response.data;
        } catch (error: any) {
            console.log("=== ERROR SIMPAN HEWAN ===");
            console.log("Status:", error.response?.status);
            console.log("URL:", error.config?.url);
            console.log("Pesan API:", error.response?.data);
            console.log("==========================");
            throw error;
        }
    }

    async update(id: number, payload: any) {
        const response = await apiClient.put(`/api/v1/hewan/${id}`, payload); // Ditambah /api/v1/
        return response.data;
    }
  
    async delete(id: number): Promise<APIResponse<{ message: string }>> {
        const response = await apiClient.delete<APIResponse<{ message: string }>>(`/api/v1/hewan/${id}`); // Diperbaiki rute dan string interpolation-nya
        return response.data;
    }
}