import { SERVICE_PORTS } from "@app/common";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "apps/api-gateway/src/app.module";
// import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }));
  
    await app.listen(process.env.port ?? SERVICE_PORTS.TICKETS_SERVICE);
    console.log(`Api Gateway Service is running on port ${process.env.PORT ?? SERVICE_PORTS.TICKETS_SERVICE}`);
  
}
bootstrap();
