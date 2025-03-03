import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { GenerateImage, TrainModel } from '@repo/common/zod.schema';
import { Response } from '@repo/common/types';
import {
  type GenerateImageInput,
  type TrainModelInput,
} from '@repo/common/inferred-types';
import { AiService } from './ai.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('train')
  @UsePipes(new ZodValidationPipe(TrainModel))
  trainModel(@Body() body: TrainModelInput): Promise<Response<string>> {
    return this.aiService.trainModel(body, '');
  }

  @Post('generate')
  @UsePipes(new ZodValidationPipe(GenerateImage))
  generateImage(@Body() body: GenerateImageInput) {
    return this.aiService.generateImage(body, '');
  }
}
