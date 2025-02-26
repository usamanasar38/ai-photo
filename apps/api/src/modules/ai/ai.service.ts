import { Injectable } from '@nestjs/common';
import { FalAIModel } from './models/fal-ai.model';
import { TrainModelInput } from '@repo/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  private falAiModel = new FalAIModel();

  constructor(private prismaService: PrismaService) {}

  public async trainModel(data: TrainModelInput, userId: string) {
    const { requestId, responseUrl } = await this.falAiModel.trainModel(
      data.zipUrl,
      data.name,
    );
    const modelCreated = await this.prismaService.model.create({
        data: {
          name: data.name,
          type: data.type,
          age: data.age,
          ethinicity: data.ethinicity,
          eyeColor: data.eyeColor,
          bald: data.bald,
          userId: userId,
          zipUrl: data.zipUrl,
          falAiRequestId: request_id,
        },
      });
  }
}
