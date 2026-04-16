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
    }),
  );

  const port = process.env.PORT || SERVICE_PORTS.TICKETS_SERVICE;

  await app.listen(port);
  console.log(`Ticket Service running on port ${port}`);
}
bootstrap();
