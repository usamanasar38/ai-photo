import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FalAIModel } from './models/fal-ai.model';
import {
  type TrainModelInput,
  type GenerateImageInput,
} from '@repo/common/inferred-types';
import { PrismaService } from '../prisma/prisma.service';
import { type ModelStatusResponse, type FalAiWebHookResponse, type Response } from '@repo/common/types';
import { IMAGE_GEN_CREDITS, TRAIN_MODEL_CREDITS } from '../../shared/constants';
import { Model } from '@prisma/client';
import { MODEL_STATUS } from '@repo/common/constants';

@Injectable()
export class AiService {
  private falAiModel = new FalAIModel();

  constructor(private prismaService: PrismaService) {}

  public async trainModel({
    body,
    userId,
  }: {
    body: TrainModelInput;
    userId: string;
  }): Promise<Response<string>> {
    const { requestId } = await this.falAiModel.trainModel(
      body.zipUrl,
      body.name,
    );

    const modelCreated = await this.prismaService.model.create({
      data: {
        name: body.name,
        type: body.type,
        age: body.age,
        ethnicity: body.ethnicity,
        eyeColor: body.eyeColor,
        bald: body.bald,
        userId: userId,
        zipUrl: body.zipUrl,
        aiRequestId: requestId,
      },
    });

    return { data: modelCreated.id };
  }

  public async getModels({
    userId,
  }: {
    userId: string;
  }): Promise<Response<Model[]>> {
    const models = await this.prismaService.model.findMany({
      where: {
        OR: [{ userId }, { open: true }],
      },
    });

    return { data: models };
  }

  public async generateImage({
    body,
    userId,
  }: {
    body: GenerateImageInput;
    userId: string;
  }): Promise<Response<string>> {
    const model = await this.prismaService.model.findUnique({
      where: {
        id: body.modelId,
      },
    });

    if (!model || !model.tensorPath) {
      throw new NotFoundException('Model not found');
    }

    // check if the user has enough credits
    const credits = await this.prismaService.userCredit.findUnique({
      where: {
        userId,
      },
    });

    if ((credits?.amount ?? 0) < IMAGE_GEN_CREDITS) {
      throw new HttpException('Not enough credits', HttpStatus.LENGTH_REQUIRED);
    }

    const { requestId } = await this.falAiModel.generateImage(
      body.prompt,
      model.tensorPath,
    );

    const data = await this.prismaService.outputImages.create({
      data: {
        prompt: body.prompt,
        userId: userId,
        modelId: body.modelId,
        imageUrl: '',
        aiRequestId: requestId,
      },
    });

    await this.prismaService.userCredit.update({
      where: {
        userId: userId,
      },
      data: {
        amount: { decrement: IMAGE_GEN_CREDITS },
      },
    });

    return { data: data.id };
  }

  public async getModelStatus({
    modelId,
    userId,
  }: {
    modelId: string;
    userId: string;
  }): Promise<Response<ModelStatusResponse>> {
    try {
      const model = await this.prismaService.model.findUnique({
        where: {
          id: modelId,
          userId: userId,
        },
      });

      if (!model) {
        throw new NotFoundException('Model not found');
      }

      // Return basic model info with status
      return {
        data: {
          id: model.id,
          name: model.name,
          status: model.trainingStatus,
          thumbnail: model.thumbnail,
          createdAt: model.createdAt,
          updatedAt: model.updatedAt,
        },
      };
    } catch (error) {
      console.error('Error checking model status:', error);
      throw new InternalServerErrorException('Failed to check model status');
    }
  }

  public async handleFalAiImageTrainWebhook(body: FalAiWebHookResponse): Promise<{
    message: string,
  }> {
    try {
      const requestId = body.request_id as string;

      // First find the model to get the userId
      const model = await this.prismaService.model.findFirst({
        where: {
          aiRequestId: requestId,
        },
      });

      if (!model) {
        console.error('No model found for requestId:', requestId);
        throw new NotFoundException('Model not found');
      }

      const result = await this.falAiModel.getRequestResultFromQueue(requestId);

      // check if the user has enough credits
      const credits = await this.prismaService.userCredit.findUnique({
        where: {
          userId: model.userId,
        },
      });

      if ((credits?.amount ?? 0) < TRAIN_MODEL_CREDITS) {
        console.error('Not enough credits for user:', model.userId);
        throw new HttpException('Not enough credits', 411);
      }

      // Use type assertion to bypass TypeScript type checking
      const resultData = result.data as any;
      const loraUrl = resultData.diffusers_lora_file.url;

      const { imageUrl } =
        await this.falAiModel.generateThumbnailImage(loraUrl);

      console.log('Generated preview image:', imageUrl);

      await this.prismaService.model.updateMany({
        where: {
          aiRequestId: requestId,
        },
        data: {
          trainingStatus: MODEL_STATUS.GENERATED,
          tensorPath: loraUrl,
          thumbnail: imageUrl,
        },
      });

      await this.prismaService.userCredit.update({
        where: {
          userId: model.userId,
        },
        data: {
          amount: { decrement: TRAIN_MODEL_CREDITS },
        },
      });

      console.log(
        'Updated model and decremented credits for user:',
        model.userId,
      );

      return {
        message: 'Webhook processed successfully',
      };
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw new InternalServerErrorException('Error processing webhook');
    }
  }

  public async handleFalAiImageGenerateWebhook(body: FalAiWebHookResponse) {
    const requestId = body.request_id;
    if (body.status === 'ERROR') {
      this.prismaService.outputImages.updateMany({
        where: {
          aiRequestId: requestId,
        },
        data: {
          status: 'Failed',
          imageUrl: body.payload.images[0].url,
        },
      });
      throw new HttpException('', 411);
    }

    await this.prismaService.outputImages.updateMany({
      where: {
        aiRequestId: requestId,
      },
      data: {
        status: 'Generated',
        imageUrl: body.payload.images[0].url,
      },
    });

    return {
      message: 'Webhook received',
    };
  }
}
