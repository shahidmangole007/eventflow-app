import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { SERVICE_PORTS } from '@app/common';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || SERVICE_PORTS.AUTH_SERVICE;

  await app.listen(port);
  console.log(`Event Service running on port ${port}`);
}
bootstrap();