import { Global, Module } from '@nestjs/common';
import { ClerkClientProvider } from './clerk-client.provider';
import { PassportModule } from '@nestjs/passport';
import { ClerkStrategy } from './clerk.strategy';
import { APP_GUARD } from '@nestjs/core';
import { ClerkAuthGuard } from './clerk-auth.guard';

@Global()
@Module({
  imports: [PassportModule],
  providers: [ClerkClientProvider, ClerkStrategy, {
    provide: APP_GUARD,
    useClass: ClerkAuthGuard,
  },],
  exports: [],
})
export class AuthModule {}
