import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * APIKeyGuard checks for a valid X-API-Key header and attaches API key info to the request if valid.
 * Extend this to check keys from env or Supabase as needed.
 */
@Injectable()
export class APIKeyGuard implements CanActivate {
  private readonly validKeys: Set<string>;

  constructor(private readonly reflector: Reflector) {
    // For demo: load from env. Replace with Supabase lookup as needed.
    this.validKeys = new Set((process.env.API_KEYS || '').split(',').map(k => k.trim()).filter(Boolean));
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    if (apiKey && this.validKeys.has(apiKey)) {
      request.apiKey = apiKey;
      return true;
    }
    // Optionally allow public access, or throw for protected routes
    // throw new UnauthorizedException('Invalid or missing API key');
    return true;
  }
}
