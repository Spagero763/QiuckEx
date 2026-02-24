import { Module } from "@nestjs/common";
import { ScamAlertsController } from "./scam-alerts.controller";
import { ScamAlertsService } from "./scam-alerts.service";
import { CustomThrottlerGuard } from '../common/guards/custom-throttler.guard';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
	imports: [ThrottlerModule.forRoot([
		{
			ttl: 60000,
			limit: 10,
		},
	])],
	controllers: [ScamAlertsController],
	providers: [ScamAlertsService, CustomThrottlerGuard],
	exports: [ScamAlertsService],
})
export class ScamAlertsModule {}
