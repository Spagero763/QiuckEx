import { Module } from '@nestjs/common';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { CustomThrottlerGuard } from '../common/guards/custom-throttler.guard';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [ThrottlerModule.forRoot([
    {
      ttl: 60000,
      limit: 10,
    },
  ])],
  controllers: [LinksController],
  providers: [LinksService, CustomThrottlerGuard],
  exports: [LinksService],
})
export class LinksModule {}
