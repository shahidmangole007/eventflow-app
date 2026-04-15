import { NestFactory } from '@nestjs/core';

import { SERVICE_PORTS } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { TicketsServiceModule } from './tickets-service.module';

async function bootstrap() {
  const app = await NestFactory.create(TicketsServiceModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

  await app.listen( SERVICE_PORTS.TICKETS_SERVICE);
  console.log(`Ticket Service is running on port ${ SERVICE_PORTS.TICKETS_SERVICE}`);

}
bootstrap();
