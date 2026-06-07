import { LoginResponse, RegisterResponse } from '@/domain/entities/Auth';

export interface IAuthRepository {
    login(email: string, password: string): Promise<LoginResponse>;
    register(username: string, email: string, password: string): Promise<RegisterResponse>;
}