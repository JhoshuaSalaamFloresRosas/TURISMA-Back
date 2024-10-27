import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  //Usar validaciones globalmete
  app.useGlobalPipes(new ValidationPipe());

  //inicializar Swagger 
  const config = new DocumentBuilder()
    .setTitle('Proyecto - TURISMA')
    .setDescription('Backend TURISMA')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api',app,document);

  console.log('Memory usage at startup:', process.memoryUsage());

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
