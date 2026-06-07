import { APIResponse, Hewan } from "@/domain/entities/Hewan";
import { IHewanRepository } from "@/domain/repositories/IHewanRepository";
import apiClient from "../api/apiClient";

export class HewanRepositoryImpl implements IHewanRepository {
    async getAll(): Promise<APIResponse<Hewan[]>> {
        const response = await apiClient.get<APIResponse<Hewan[]>>('/hewan');
        return response.data;
    }

    async getById(id: number) {
    const response = await apiClient.get(`/api/hewan/${id}`);
    return response.data;
  }


    async create(hewan: Omit<Hewan, 'id'>): Promise<APIResponse<Hewan>> {
        const response = await apiClient.post<APIResponse<Hewan>>('/hewan', hewan);
        return response.data;
    }

    async update(id: number, payload: any) {
    const response = await apiClient.put(`/api/hewan/${id}`, payload);
    return response.data;
    }

  
    async delete(id: number): Promise<APIResponse<{ message: string }>> {
        const response = await apiClient.delete<APIResponse<{ message: string }>>('/hewan/${id}');
        return response.data;
    }
}