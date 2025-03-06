import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Webhook, WebhookRequiredHeaders } from 'svix';
import { PrismaService } from '../common/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UserWebhookEvent, WebhookEvent } from '@clerk/backend';

@Injectable()
export class ClerkAuthService {
  constructor(
    private prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  public async handleUserChange({
    svixHeaders,
    payload,
  }: {
    svixHeaders: WebhookRequiredHeaders;
    payload: UserWebhookEvent;
  }) {
    try {
      // verify webhook
      const webhookSecret = this.configService.get('CLERK_WEBHOOK_SECRET');
      const wh = new Webhook(webhookSecret);
      wh.verify(JSON.stringify(payload), svixHeaders) as WebhookEvent;
    } catch (err) {
      console.log('Error: Could not verify webhook:', (err as Error).message);
      throw new BadRequestException((err as Error).message);
    }

    const { id } = payload.data;
    const eventType = payload.type;

    try {
      switch (eventType) {
        case 'user.created':
        case 'user.updated': {
          await this.prismaService.user.upsert({
            where: { clerkId: id },
            update: {
              name: `${payload.data.first_name ?? ''} ${payload.data.last_name ?? ''}`.trim(),
              email: payload.data.email_addresses[0].email_address,
              profilePicture: payload.data.image_url,
            },
            create: {
              clerkId: id!,
              name: `${payload.data.first_name ?? ''} ${payload.data.last_name ?? ''}`.trim(),
              email: payload.data.email_addresses[0].email_address,
              profilePicture: payload.data.image_url,
            },
          });
          break;
        }

        case 'user.deleted': {
          await this.prismaService.user.delete({
            where: { clerkId: id },
          });
          break;
        }

        default:
          console.log(`Unhandled event type: ${eventType}`);
          break;
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw new InternalServerErrorException();
    }

    return { message: 'Webhook received' };
  }
}
