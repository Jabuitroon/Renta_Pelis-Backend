import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { envs } from './config/env.load';
console.log('DATABASE_URL:', process.env.DATABASE_URL);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // Permite utilizar class transformer a nivel global para los dto
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: envs.ALLOWED_ORIGINS,
    credentials: true, // Permite cookies
    // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const config = new DocumentBuilder()
    .setTitle('Movies To Rent')
    .setDescription('The API Movies')
    .setVersion('1.0')
    .addTag('movies')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(envs.PORT);
  console.log(`🚀 Server running on http://localhost:${envs.PORT}`);
}
bootstrap();
