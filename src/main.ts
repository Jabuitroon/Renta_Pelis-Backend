import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

console.log('DATABASE_URL:', process.env.DATABASE_URL); // Verifica que la variable de entorno se esté cargando correctamente
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // Permite utilizar class transformer a nivel global para los dto
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina campos que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si envían campos de más
      transform: true, // Convierte tipos automáticamente
    }),
  );

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
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
  await app.listen(process.env.PORT || 3000);
  console.log(
    `🚀 Server running on http://localhost:${process.env.PORT || 3000}`,
  );
}
bootstrap();
