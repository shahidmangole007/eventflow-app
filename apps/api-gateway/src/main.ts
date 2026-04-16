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
    }),
  );

  const port = process.env.PORT || SERVICE_PORTS.API_GATEWAY;

  await app.listen(port);
  console.log(`Event Service running on port ${port}`);
}
bootstrap();
