import { User } from '@clerk/backend';
import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {

    constructor(private readonly imagesService: ImagesService) {}

    @Get()
    getAiGeneratedImages(@CurrentUser() user: User) {
        return this.imagesService.getAiGeneratedImages({ userId: user.id });
    }
}
