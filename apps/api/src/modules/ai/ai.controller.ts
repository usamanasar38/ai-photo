import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { GenerateImage, TrainModel } from '@repo/common/zod.schema';
import { type Response } from '@repo/common/types';
import {
  type GenerateImageInput,
  type TrainModelInput,
} from '@repo/common/inferred-types';
import { AiService } from './ai.service';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { Model } from '@prisma/client';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('train')
  @UsePipes(new ZodValidationPipe(TrainModel))
  trainModel(@Body() body: TrainModelInput): Promise<Response<string>> {
    return this.aiService.trainModel({ body, userId: '' });
  }

  @Get('models')
  getModels(): Promise<Response<Model[]>> {
    return this.aiService.getModels({ userId: '' });
  }

  @Post('generate')
  @UsePipes(new ZodValidationPipe(GenerateImage))
  generateImage(@Body() body: GenerateImageInput) {
    return this.aiService.generateImage({ body, userId: '' });
  }

  @Get('/model/status/:modelId')
  getModelStatus(
    @Param('modelId') modelId: string
  ) {
    return this.aiService.getModelStatus({ modelId, userId: '' });
  }
}
