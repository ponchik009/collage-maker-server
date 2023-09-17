import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ credentials: true, origin: 'http://localhost:3000' });

  await app.listen(parseInt(process.env.PORT));
}
bootstrap();
