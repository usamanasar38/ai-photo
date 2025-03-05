import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AiModule } from './modules/ai/ai.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AuthModule, PrismaModule, AiModule, ConfigModule.forRoot({isGlobal: true})],
  controllers: [],
  providers: [],
})
export class AppModule {}
