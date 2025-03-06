import { Body, Controller, FileTypeValidator, Get, Param, ParseFilePipe, Post, UploadedFile, UseInterceptors, UsePipes } from '@nestjs/common';
import { GenerateImage, TrainModel } from '@repo/common/zod.schema';
import { type FalAiWebHookResponse, type Response } from '@repo/common/types';
import {
  type GenerateImageInput,
  type TrainModelInput,
} from '@repo/common/inferred-types';
import { AiService } from './ai.service';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { Model } from '@prisma/client';
import { Public } from '../../decorators/public.decorator';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { User } from '@clerk/backend';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('train')
  @UsePipes(new ZodValidationPipe(TrainModel))
  async trainModel(@CurrentUser() user: User, @Body() payload: TrainModelInput): Promise<Response<string>> {
    return this.aiService.trainModel({ payload, userId: user.id });
  }

  @Get('models')
  getModels(): Promise<Response<Model[]>> {
    return this.aiService.getModels({ userId: '' });
  }

  @Post('generate')
  @UsePipes(new ZodValidationPipe(GenerateImage))
  generateImage(@CurrentUser() user: User, @Body() payload: GenerateImageInput) {
    return this.aiService.generateImage({ payload, userId: user.id });
  }

  @Get('/model/status/:modelId')
  getModelStatus(
    @CurrentUser() user: User,
    @Param('modelId') modelId: string
  ) {
    return this.aiService.getModelStatus({ modelId, userId: user.id });
  }

  // Webhooks
  @Public()
  @Post('/webhook/fal-ai/train')
  handleFalAiImageTrainWebhook(@Body() payload: FalAiWebHookResponse) {
    return this.aiService.handleFalAiImageTrainWebhook(payload)
  }

  @Public()
  @Post('/webhook/fal-ai/image')
  handleFalAiImageGenerateWebhook(@Body() payload: FalAiWebHookResponse) {
    return this.aiService.handleFalAiImageGenerateWebhook(payload)
  }
}
