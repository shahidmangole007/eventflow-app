import { NestFactory } from '@nestjs/core';
import { EventServiceModule } from './event-service.module';
import { SERVICE_PORTS } from '@app/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(EventServiceModule);
  
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }));
  
    await app.listen( SERVICE_PORTS.EVENT_SERVICE);
    console.log(`Event Service is running on port ${SERVICE_PORTS.EVENT_SERVICE}`);
  
}
bootstrap();
