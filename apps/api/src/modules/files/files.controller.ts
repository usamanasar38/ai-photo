import { User } from '@clerk/backend';
import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { ImagesService } from './images.service';
import { FileService } from '../common/file.service';
import { Public } from '../../decorators/public.decorator';

@Controller('files')
export class FileController {

    constructor(private readonly imagesService: ImagesService, private readonly fileService: FileService) {}

    @Get('/images')
    getAiGeneratedImages(@CurrentUser() user: User) {
        return this.imagesService.getAiGeneratedImages({ userId: user.id });
    }

    @Public()
    @Get('/presigned-url')
    async getPresignedUrl() {
        const data = await this.fileService.getPresignedSignedUrl();
        return { data };
    }
}
