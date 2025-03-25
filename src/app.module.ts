import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './todo/todo.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'suho0918',
      database: 'todo_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    TodoModule, // 👈 반드시 추가해야 함!
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/my-react-app/dist'),  // React 빌드된 파일의 경로
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}