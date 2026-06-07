export interface Hewan {
    id?: number;
    nama: string;
    jenis: string;
    tanggal_lahir?: string;
    harga: number;
    status?: 'tersedia' | 'terjual';
    created_at?: string;
    updated_at?: string;
}

export interface APIResponse<T> {
    success: boolean;
    message: string;
    data: T;
}