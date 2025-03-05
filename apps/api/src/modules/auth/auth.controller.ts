import { Body, Controller, Headers, Post } from '@nestjs/common';
import { Public } from '../../decorators/public.decorator';
import { ClerkAuthService } from './clerk-auth.service';
import { type UserWebhookEvent } from '@clerk/backend';
import { WebhookRequiredHeaders } from 'svix';

@Controller('auth')
export class AuthController {
  constructor(private readonly clerkAuthService: ClerkAuthService) {}
  @Public()
  @Post('/clerk/webhook')
  handleUserChange(
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
    @Body() payload: UserWebhookEvent,
  ) {
    const svixHeaders: WebhookRequiredHeaders = {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    };
    this.clerkAuthService.handleUserChange({ svixHeaders, payload });
  }
}
