import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
