import { Module } from '@nestjs/common';
import { CommonModule } from './modules/common/common.module';
import { AiModule } from './modules/ai/ai.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './modules/files/files.module';

@Module({
  imports: [AuthModule, CommonModule, AiModule, ConfigModule.forRoot({isGlobal: true}), FilesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
