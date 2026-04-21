import { Inject, Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email.service';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_SERVICE, KAFKA_TOPICS } from '@app/kafka';
import { failed_events } from '@app/database/schema/failed_events';
import { DatabaseService } from '@app/database';

@Injectable()
export class NotificationsServiceService {
  private readonly logger = new Logger(NotificationsServiceService.name);
  private readonly MAX_RETRIES = 3;

  constructor(
    private readonly emailService: EmailService,
    private readonly dbService: DatabaseService,
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
  ) {}

  async sendWelcomeEmail(data: {
    userId: string;
    email: string;
    name: string;
  }) {
    const html = `
      <h1>Welcome to EventFlow, ${data.name}! 🎉</h1>
      <p>Your account has been created successfully.</p>
      <p>You can now:</p>
      <ul>
        <li>Browse and discover events</li>
        <li>Purchase tickets</li>
        <li>Create your own events</li>
      </ul>
      <p>Happy eventing!</p>
    `;

    await this.emailService.sendEmail(
      data.email,
      'Welcome to EventFlow!',
      html,
    );
  }

  async sendTicketPurchasedEmail(data: {
    userId: string;
    email?: string;
    ticketCode: string;
    eventTitle?: string;
    quantity: number;
    totalPrice: number;
  }) {
    const email = data.email || 'user@example.com';

    const html = `
      <h1>Ticket Confirmed!</h1>
      <p>Your ticket purchase was successful.</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Event:</strong> ${data.eventTitle || 'Your Event'}</p>
        <p><strong>Ticket Code:</strong> ${data.ticketCode}</p>
        <p><strong>Quantity:</strong> ${data.quantity}</p>
        <p><strong>Total:</strong> $${(data.totalPrice / 100).toFixed(2)}</p>
      </div>
      <p>Show this ticket code at the event entrance.</p>
    `;

    await this.emailService.sendEmail(email, 'Your Ticket is Confirmed!', html);
  }

  async sendTicketCancelledEmail(data: {
    ticketId: string;
    userId: string;
    email?: string;
  }) {
    const email = data.email || 'user@example.com';

    const html = `
      <h1>Ticket Cancelled</h1>
      <p>Your ticket has been cancelled as requested.</p>
      <p>If you did not request this cancellation, please contact support.</p>
    `;

    await this.emailService.sendEmail(email, 'Ticket Cancelled', html);
  }

  async retryOrDLQ(data: any, error: any) {
    const retryCount = data.retryCount ?? 0;

    if (retryCount < this.MAX_RETRIES) {
      this.logger.warn(`Retrying... attempt ${retryCount + 1}`);

      await this.kafkaClient.emit(KAFKA_TOPICS.EMAIL_RETRY, {
        ...data,
        retryCount: retryCount + 1,
      });
    } else {
      this.logger.error('Retry exhausted → sending to DLQ');

      await this.kafkaClient.emit(KAFKA_TOPICS.EMAIL_DLQ, {
        ...data,
        error: error?.message || 'Unknown error',
        failedAt: new Date().toISOString(),
      });
    }
  }

  async handleDLQ(data: any) {
    await this.dbService.db.insert(failed_events).values({
      payload: data,
      error: data.error || 'Email failed after retries',
      retries: data.retryCount ?? 3,
    });
  }
}