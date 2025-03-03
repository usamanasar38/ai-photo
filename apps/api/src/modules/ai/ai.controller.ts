import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { GenerateImage, TrainModel } from '@repo/common/zod.schema';
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
  trainModel(@Body() data: TrainModelInput) {
    return this.aiService.trainModel(data, '');
  }

  @Post('generate')
  @UsePipes(new ZodValidationPipe(GenerateImage))
  generateImage(@Body() data: GenerateImageInput) {}
}
