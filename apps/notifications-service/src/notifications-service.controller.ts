import { Controller, Get, Logger } from '@nestjs/common';
import { NotificationsServiceService } from './notifications-service.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { KAFKA_TOPICS } from '@app/kafka';

@Controller()
export class NotificationsServiceController {
  private readonly logger = new Logger(NotificationsServiceController.name);

  constructor(
    private readonly notificationsServiceService: NotificationsServiceService,
  ) {}

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      service: 'notification-service',
    };
  }

  @EventPattern(KAFKA_TOPICS.USER_REGISTERED)
  async handleUserRegistered(
    @Payload() data: { userId: string; email: string; name: string },
  ) {
    this.logger.log(`Received user registered event: ${JSON.stringify(data)}`);
    await this.notificationsServiceService.sendWelcomeEmail(data);
  }

  @EventPattern(KAFKA_TOPICS.TICKET_PURCHASED)
  async handleTicketPurchased(@Payload() data: any) {
    try {
      this.logger.log(`Received ticket purchase event: ${JSON.stringify(data)}`);
      await this.notificationsServiceService.sendTicketPurchasedEmail(data);
    } catch (error) {
      await this.notificationsServiceService.retryOrDLQ(data, error);
    }
  }

  @EventPattern(KAFKA_TOPICS.TICKETS_CANCELED)
  async handleTicketCancelled(
    @Payload() data: { ticketId: string; userId: string },
  ) {
    this.logger.log(
      `Received ticket cancellation event: ${JSON.stringify(data)}`,
    );
    await this.notificationsServiceService.sendTicketCancelledEmail(data);
  }

  @EventPattern(KAFKA_TOPICS.EMAIL_RETRY)
  async handleEmailRetry(@Payload() data: any) {
    try {
      this.logger.log(`Retry attempt ${data.retryCount}`);
      await this.notificationsServiceService.sendTicketPurchasedEmail(data);
    } catch (error) {
      await this.notificationsServiceService.retryOrDLQ(data, error);
    }
  }

  @EventPattern(KAFKA_TOPICS.EMAIL_DLQ)
  async handleDLQ(@Payload() data: any) {
    this.logger.error(`DLQ event received: ${JSON.stringify(data)}`);
    await this.notificationsServiceService.handleDLQ(data);
  }
}