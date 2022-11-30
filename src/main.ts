import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(
    process.env.NODE_ENV === 'production'
      ? '.env'
      : process.env.NODE_ENV === 'stage'
      ? '.stage.env'
      : '.env.dev',
  ),
});
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  await app.listen(3001);
  console.log(process.env.CLIENT_URL);
}

bootstrap();
