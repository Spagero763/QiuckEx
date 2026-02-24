import { CustomThrottlerGuard } from './custom-throttler.guard';
import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';

describe('CustomThrottlerGuard', () => {
  const options = {} as ThrottlerModuleOptions;
  const storage = {} as any;
  const reflector = {} as Reflector;

  it('should use API key as tracker if present', async () => {
    const guard = new CustomThrottlerGuard(options, storage, reflector);
    const req = { apiKey: 'trusted-key', ip: '1.2.3.4' };
    await expect(guard['getTracker'](req)).resolves.toBe('trusted-key');
  });

  it('should use IP as tracker if no API key', async () => {
    const guard = new CustomThrottlerGuard(options, storage, reflector);
    const req = { ip: '1.2.3.4' };
    await expect(guard['getTracker'](req)).resolves.toBe('1.2.3.4');
  });

  it('should return higher limit for API key', () => {
    const guard = new CustomThrottlerGuard(options, storage, reflector);
    const context: any = {
      switchToHttp: () => ({ getRequest: () => ({ apiKey: 'trusted-key' }) })
    };
    expect(guard['getLimit'](context)).toBe(100);
  });

  it('should return default limit for public', () => {
    const guard = new CustomThrottlerGuard(options, storage, reflector);
    const context: any = {
      switchToHttp: () => ({ getRequest: () => ({}) })
    };
    expect(guard['getLimit'](context)).toBe(20);
  });
});
