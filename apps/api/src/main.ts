import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
  });
  app.setGlobalPrefix('api');
  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);
  console.log('server running on port ', PORT);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
