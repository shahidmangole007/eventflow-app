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
    }),
  );

  const port = process.env.PORT || SERVICE_PORTS.EVENT_SERVICE;

  await app.listen(port);
  console.log(`Event Service running on port ${port}`);
}
bootstrap();