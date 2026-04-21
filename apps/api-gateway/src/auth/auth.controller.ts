import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponse, LoginDto, RegisterDto, UserProfileResponse } from '@app/common';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }
 
    @Post('register')
    async register(@Body() dto: RegisterDto){
        return this.authService.register(dto);
    }
 
    @Post('login')
    async login(@Body() dto : LoginDto){
        return this.authService.login(dto);
    }

    @Get('profile')
    async getProfile(@Headers('authorization') authorization: string) {
        return this.authService.getProfile(authorization);      
    }

}
