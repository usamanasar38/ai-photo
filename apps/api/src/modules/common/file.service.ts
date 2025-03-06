import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';

@Injectable()
export class FileService {
  private client: S3Client;
  private bucketName: string | undefined;
  private endpoint: string;

  constructor(private readonly configService: ConfigService) {
    const S3_ENDPOINT = this.configService.get('S3_ENDPOINT');
    this.bucketName = this.configService.get('S3_BUCKET_NAME');

    if (!S3_ENDPOINT) {
      throw new Error('S3_ENDPOINT not found in environment variables');
    }
    this.endpoint = S3_ENDPOINT;

    this.client = new S3Client({
      endpoint: S3_ENDPOINT,
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY')!,
        secretAccessKey: this.configService.get('S3_SECRET_ACCESS_KEY')!,
      },
      forcePathStyle: true,
    });
  }

  async getFileUrl(key: string) {
    return { url: `${this.endpoint}/${key}` };
  }

  async getPresignedSignedUrl() {
    try {
      const key = randomUUID();
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: 'application/zip'
      });

      const url = await getSignedUrl(this.client, command, {
        expiresIn: 60 * 5, // 5 minutes
      });

      return { url, key };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
