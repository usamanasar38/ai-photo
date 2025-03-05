import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from '@repo/common/types';
import { OutputImages } from '@prisma/client';

@Injectable()
export class ImagesService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getAiGeneratedImages({
    userId,
  }: {
    userId: string;
  }): Promise<Response<OutputImages[]>> {
    const imagesData = await this.prismaService.outputImages.findMany({
      where: {
        userId: userId,
        status: {
          not: 'Failed',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      // skip: parseInt(offset),
      // take: parseInt(limit),
    });

    return { data: imagesData };
  }
}
