import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';
import { FileService } from './file.service';

@Global()
@Module({
  providers: [PrismaService, FileService],
  exports: [PrismaService, FileService],
})
export class CommonModule {}
