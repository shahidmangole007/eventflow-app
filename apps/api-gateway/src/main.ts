import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SERVICE_PORTS } from '@app/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }));
  
    await app.listen(SERVICE_PORTS.API_GATEWAY);
    console.log(`Api Gateway Service is running on port ${SERVICE_PORTS.API_GATEWAY}`);
  
}
bootstrap();
