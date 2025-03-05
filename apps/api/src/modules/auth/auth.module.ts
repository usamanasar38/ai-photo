import { Global, Module } from '@nestjs/common';
import { ClerkClientProvider } from './clerk-client.provider';
import { PassportModule } from '@nestjs/passport';
import { ClerkStrategy } from './clerk.strategy';
import { APP_GUARD } from '@nestjs/core';
import { ClerkAuthGuard } from './clerk-auth.guard';
import { AuthController } from './auth.controller';
import { ClerkAuthService } from './clerk-auth.service';

@Global()
@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [
    ClerkClientProvider,
    ClerkStrategy,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
    ClerkAuthService,
  ],
  exports: [],
})
export class AuthModule {}
