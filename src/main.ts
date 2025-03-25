import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정 추가
  app.enableCors({
    origin: 'http://localhost:5173', // React 애플리케이션 주소
    methods: 'GET,POST,PUT,DELETE', // 필요한 HTTP 메소드
    allowedHeaders: 'Content-Type, Authorization', // 필요한 헤더
  });

  await app.listen(3000);
}
bootstrap();
