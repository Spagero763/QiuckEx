import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitterModule, EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationService, LogNotificationTransport } from './notification.service';
import { NotificationEventType } from '../events/notification.events';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('NotificationService (Event Hook Verification)', () => {
  let service: NotificationService;
  let eventEmitter: EventEmitter2;
  let module: TestingModule;
  let transport: LogNotificationTransport;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot({
        wildcard: true,
        delimiter: '.',
      })],
      providers: [
        {
          provide: LogNotificationTransport,
          useClass: LogNotificationTransport,
        },
        {
          provide: NotificationService,
          useFactory: (transport: LogNotificationTransport) => new NotificationService(transport),
          inject: [LogNotificationTransport],
        },
      ],
    }).compile();

    await module.init();
    service = module.get<NotificationService>(NotificationService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    transport = module.get<LogNotificationTransport>(LogNotificationTransport);
    jest.spyOn(transport, 'send').mockResolvedValue(undefined);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  it('should react to "link.created" event and call transport', async () => {
    const payload = {
      linkId: 'link123',
      creator: 'user1',
      timestamp: new Date().toISOString(),
    };
    await eventEmitter.emitAsync(NotificationEventType.LinkCreated, payload);
    await sleep(100);
    expect(transport.send).toHaveBeenCalledWith(NotificationEventType.LinkCreated, payload);
  });

  it('should react to "payment.detected" event and call transport', async () => {
    const payload = {
      txHash: '0xabc123',
      amount: '100',
      sender: 'G...sender',
      timestamp: new Date().toISOString(),
    };
    await eventEmitter.emitAsync(NotificationEventType.PaymentDetected, payload);
    await sleep(100);
    expect(transport.send).toHaveBeenCalledWith(NotificationEventType.PaymentDetected, payload);
  });

  it('should react to "username.claimed" event and call transport', async () => {
    const payload = {
      username: 'test_user',
      publicKey: 'G...123',
      timestamp: new Date().toISOString(),
    };
    await eventEmitter.emitAsync(NotificationEventType.UsernameClaimed, payload);
    await sleep(100);
    expect(transport.send).toHaveBeenCalledWith(NotificationEventType.UsernameClaimed, payload);
  });
});
    };

    await eventEmitter.emitAsync('username.claimed', payload);
    
    await sleep(200);

    expect(mockLogger.log).toHaveBeenCalledWith(
      expect.stringContaining('Intent')
    );
  });

  it('should react to "payment.received" event and log intent', async () => {
    const payload = {
      txHash: '0xabc123',
      amount: '100',
      sender: 'G...sender',
    };

    await eventEmitter.emitAsync('payment.received', payload);
    
    await sleep(200);

    expect(mockLogger.log).toHaveBeenCalledWith(
      expect.stringContaining('Intent')
    );
  });
});