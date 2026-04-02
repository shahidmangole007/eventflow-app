import { SERVICE_PORTS } from '@app/common';
import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
    private readonly authServiceUrl = `http://localhost:${SERVICE_PORTS.AUTH_SERVICE}`;

    constructor(private readonly httpService: HttpService) { }

    async register(data: { name: string, email: string, password: string }) {
        try {
            const responce = await firstValueFrom(this.httpService.post(`${this.authServiceUrl}/register`, data))
            return responce.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async login(data: { email: string, password: string }) {
        try {
            const responce = await firstValueFrom(this.httpService.post(`${this.authServiceUrl}/login`, data))
            return responce.data;
        } catch (error) {
            this.handleError(error);
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


    private handleError(error: unknown) {
        const err = error as {
            response?: { data: string | object; status: number };
        };
        if (err.response) {
            throw new HttpException(err.response.data, err.response.status);
        }
        throw new HttpException('Something went wrong', 503);
    }
}
