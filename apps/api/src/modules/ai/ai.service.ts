import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { FalAIModel } from './models/fal-ai.model';
import {
  type TrainModelInput,
  type GenerateImageInput,
} from '@repo/common/inferred-types';
import { PrismaService } from '../prisma/prisma.service';
import { type Response } from '@repo/common/types';
import { IMAGE_GEN_CREDITS } from 'src/shared/constants';

@Injectable()
export class AiService {
  private falAiModel = new FalAIModel();

  constructor(private prismaService: PrismaService) {}

  public async trainModel(
    data: TrainModelInput,
    userId: string,
  ): Promise<Response<string>> {
    const { requestId } = await this.falAiModel.trainModel(
      data.zipUrl,
      data.name,
    );

    const modelCreated = await this.prismaService.model.create({
      data: {
        name: data.name,
        type: data.type,
        age: data.age,
        ethnicity: data.ethnicity,
        eyeColor: data.eyeColor,
        bald: data.bald,
        userId: userId,
        zipUrl: data.zipUrl,
        aiRequestId: requestId,
      },
    });

    return { data: modelCreated.id };
  }

  public async generateImage(body: GenerateImageInput, userId: string) {
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
      userId: userId,
    },
  });

  if ((credits?.amount ?? 0) < IMAGE_GEN_CREDITS) {
    throw new HttpException("Not enough credits", HttpStatus.LENGTH_REQUIRED)
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

    return data.id;
  }
}
