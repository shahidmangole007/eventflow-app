import { AuthResponse, SERVICE_PORTS, UserProfileResponse } from '@app/common';
import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {

    private readonly authServiceUrl = process.env.AUTH_SERVICE_URL || `http://localhost:${SERVICE_PORTS.AUTH_SERVICE}`;

    constructor(private readonly httpService: HttpService) { }

    async register(data: { name: string, email: string, password: string }): Promise<UserProfileResponse> {
        try {
            const responce = await firstValueFrom(this.httpService.post<UserProfileResponse>(`${this.authServiceUrl}/register`, data))
            return responce.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async login(data: { email: string, password: string }) : Promise<AuthResponse>  {
        try {
            const responce = await firstValueFrom(this.httpService.post<AuthResponse>(`${this.authServiceUrl}/login`, data))
            return responce.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }


    async getProfile(token: string) {
        try {
            const responce = await firstValueFrom(
                this.httpService.get(`${this.authServiceUrl}/profile`, {
                    headers: { Authorization: token }
                }),
            )
            return responce.data;
        } catch (error) {
            this.handleError(error);
        }
    }


  private handleError(error: unknown): never {
    const err = error as {
      response?: { data: string | object; status: number };
    };
    if (err.response) {
      throw new HttpException(err.response.data, err.response.status);
    }
    throw new HttpException('Something went wrong', 503);
  }
}
