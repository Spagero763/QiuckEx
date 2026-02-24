
/**
 * Supported notification event types.
 * Extend this enum to add new notification flows.
 */
export enum NotificationEventType {
  LinkCreated = 'link.created',
  PaymentDetected = 'payment.detected',
  UsernameClaimed = 'username.claimed',
}

/**
 * Payload for link creation notifications.
 */
export interface LinkCreatedPayload {
  linkId: string;
  creator: string;
  timestamp: string;
}

/**
 * Payload for payment detected notifications.
 */
export interface PaymentDetectedPayload {
  txHash: string;
  amount: string;
  sender: string;
  timestamp: string;
}

/**
 * Payload for username claimed notifications.
 */
export interface UsernameClaimedPayload {
  username: string;
  publicKey: string;
  timestamp: string;
}