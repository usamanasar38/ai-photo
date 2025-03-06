import { Module } from '@nestjs/common';
import { FileController } from './files.controller';
import { ImagesService } from './images.service';

@Module({
  controllers: [FileController],
  providers: [ImagesService],
})
export class FilesModule {}
