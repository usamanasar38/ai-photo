import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';
import { ImageUploadService } from './image-upload.service';

@Global()
@Module({
  providers: [PrismaService, ImageUploadService],
  exports: [PrismaService, ImageUploadService],
})
export class CommonModule {}
