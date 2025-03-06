import { Module } from '@nestjs/common';
import { CommonModule } from './modules/common/common.module';
import { AiModule } from './modules/ai/ai.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ImagesModule } from './modules/images/images.module';

@Module({
  imports: [AuthModule, CommonModule, AiModule, ConfigModule.forRoot({isGlobal: true}), ImagesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
