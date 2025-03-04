import { Body, Controller, Get, Post, Req, UsePipes } from '@nestjs/common';
import { GenerateImage, TrainModel } from '@repo/common/zod.schema';
import { Page, Response } from '@repo/common/types';
import {
  type GenerateImageInput,
  type TrainModelInput,
} from '@repo/common/inferred-types';
import { AiService } from './ai.service';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { PaginationPage } from '../../shared/pagination';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('train')
  @UsePipes(new ZodValidationPipe(TrainModel))
  trainModel(@Body() body: TrainModelInput): Promise<Response<string>> {
    return this.aiService.trainModel({ body, userId: '' });
  }

  @Get('models')
  getModels(@Req() request: Request, @PaginationPage() page: Page) {
    // return {
    //   data: data.map(omitShard),
    //   links: { next: nextLink({ nextPage, request }) },
    // };
  }

  @Post('generate')
  @UsePipes(new ZodValidationPipe(GenerateImage))
  generateImage(@Body() body: GenerateImageInput) {
    return this.aiService.generateImage({ body, userId: '' });
  }
}
