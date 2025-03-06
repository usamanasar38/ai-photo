import { User } from '@clerk/backend';
import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { ImagesService } from './images.service';
import { FileService } from '../common/file.service';

@Controller('files')
export class FileController {

    constructor(private readonly imagesService: ImagesService, private readonly fileService: FileService) {}

    @Get('/images')
    getAiGeneratedImages(@CurrentUser() user: User) {
        return this.imagesService.getAiGeneratedImages({ userId: user.id });
    }

    @Get('/presigned-url')
    getPresignedUrl() {
        return { data: this.fileService.getPresignedSignedUrl() };
    }
}
