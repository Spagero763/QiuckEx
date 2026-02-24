
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  NotificationEventType,
  LinkCreatedPayload,
  PaymentDetectedPayload,
  UsernameClaimedPayload,
} from '../events/notification.events';

/**
 * NotificationTransport defines the contract for all notification delivery mechanisms.
 * Implementations can include email, webhook, Telegram, etc.
 */
export interface NotificationTransport {
  /**
   * Send a notification event with the given payload.
   * @param event - The type of notification event.
   * @param payload - The event payload.
   */
  send(event: NotificationEventType, payload: any): Promise<void>;
}

/**
 * LogNotificationTransport is a stub/no-op implementation for development/testing.
 * Replace or extend with real transports as needed.
 */
@Injectable()
export class LogNotificationTransport implements NotificationTransport {
  private readonly logger = new Logger('NotificationTransport');
  async send(event: NotificationEventType, payload: any): Promise<void> {
    this.logger.log(`[Stub] Notification: ${event}`);
    this.logger.debug(`Payload: ${JSON.stringify(payload)}`);
  }
}

/**
 * NotificationService listens for notification events and delegates delivery to the configured transport.
 * Easily extendable for new event types and transports.
 */
@Injectable()
export class NotificationService {
  constructor(private readonly transport: NotificationTransport) {}

  /**
   * Handle link creation events.
   */
  @OnEvent(NotificationEventType.LinkCreated, { async: true })
  async handleLinkCreated(payload: LinkCreatedPayload) {
    await this.transport.send(NotificationEventType.LinkCreated, payload);
  }

  /**
   * Handle payment detected events.
   */
  @OnEvent(NotificationEventType.PaymentDetected, { async: true })
  async handlePaymentDetected(payload: PaymentDetectedPayload) {
    await this.transport.send(NotificationEventType.PaymentDetected, payload);
  }

  /**
   * Handle username claimed events.
   */
  @OnEvent(NotificationEventType.UsernameClaimed, { async: true })
  async handleUsernameClaimed(payload: UsernameClaimedPayload) {
    await this.transport.send(NotificationEventType.UsernameClaimed, payload);
  }
}