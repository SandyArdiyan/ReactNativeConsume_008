import { APIResponse, Hewan } from "../entities/Hewan";

export interface IHewanRepository {
    getAll(): Promise<APIResponse<Hewan[]>>;
    getById(id: number): Promise<APIResponse<Hewan>>;
    create(hewan: Omit<Hewan, 'id'>): Promise<APIResponse<Hewan>>;
    update(id: number, hewan: Partial<Hewan>): Promise<APIResponse<Hewan>>;
    delete(id: number): Promise<APIResponse<{ message: string }>>;
}