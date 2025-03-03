import { Injectable, NotFoundException } from '@nestjs/common';
import { FalAIModel } from './models/fal-ai.model';
import {
  type TrainModelInput,
  type GenerateImageInput,
} from '@repo/common/inferred-types';
import { PrismaService } from '../prisma/prisma.service';
import { type Response } from '@repo/common/types';

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

    const { requestId } = await this.falAiModel.generateImage(
      body.prompt,
      model.tensorPath,
    );

    return requestId;
  }
}
