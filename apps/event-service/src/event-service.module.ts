import { Module } from '@nestjs/common';
import { EventServiceController } from './event-service.controller';
import { EventServiceService } from './event-service.service';
import { KafkaModule } from '@app/kafka';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [KafkaModule.register("event-service-group"), DatabaseModule],
  controllers: [EventServiceController],
  providers: [EventServiceService],
})
export class EventServiceModule {}
