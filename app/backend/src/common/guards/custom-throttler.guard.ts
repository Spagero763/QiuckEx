import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerStorageService, ThrottlerModuleOptions } from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';

/**
 * CustomThrottlerGuard adjusts rate limits based on API key presence.
 * Trusted API keys get higher limits; public users get defaults.
 */
@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  constructor(
    options: ThrottlerModuleOptions,
    storageService: ThrottlerStorageService,
    reflector: Reflector
  ) {
    super(options, storageService, reflector);
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Use API key as tracker if present, else fallback to IP
    return req.apiKey || req.ip;
  }

  protected getLimit(context: ExecutionContext): number {
    const req = context.switchToHttp().getRequest();
    // Higher limit for valid API keys
    if (req.apiKey) {
      return 100; // Trusted clients
    }
    return 20; // Public default
  }
}
