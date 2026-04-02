import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { SERVICE_PORTS } from '@app/common';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @Get()
   getHello(): string {
     return `Auth Service is running on port ${SERVICE_PORTS.AUTH_SERVICE}`;
   } 

   @Post('/register')
    registerUser(@Body() body: { email: string }) {
    return  this.authServiceService.simulateUserRegistration(body.email);
   }
}
