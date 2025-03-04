import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FalAIModel } from './models/fal-ai.model';
import {
  type TrainModelInput,
  type GenerateImageInput,
} from '@repo/common/inferred-types';
import { PrismaService } from '../prisma/prisma.service';
import { Page, PaginatedData, type Response } from '@repo/common/types';
import { IMAGE_GEN_CREDITS } from 'src/shared/constants';
import { getNextPage, queryParameters } from 'src/shared/pagination';
import { Model } from '@prisma/client';

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
        userId: userId,
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
}
