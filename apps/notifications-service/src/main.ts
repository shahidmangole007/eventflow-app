import { NestFactory } from '@nestjs/core';
import { NotificationsServiceModule } from './notifications-service.module';
import { ValidationPipe } from '@nestjs/common';
import { SERVICE_PORTS } from '@app/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { KAFKA_BROKER, KAFKA_CLIENT_ID } from '@app/kafka';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsServiceModule);

  // connect kafka microservice for consuming events 
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport : Transport.KAFKA,
  //   options :{
  //     client : {
  //       clientId : `${KAFKA_CLIENT_ID}-notifications`,
  //       brokers : [KAFKA_BROKER]
  //     },

  //     consumer : {
  //       groupId : `notifications-consumer-group`
  //     }
  //   }
  // });


  const kafkaBroker = process.env.KAFKA_BROKER;
  const kafkaUsername = process.env.KAFKA_USERNAME;
  const kafkaPassword = process.env.KAFKA_PASSWORD;

  if (!kafkaBroker) {
    throw new Error('KAFKA_BROKER is not defined');
  }

  const useAuth = kafkaUsername && kafkaPassword;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: `${KAFKA_CLIENT_ID}-notifications`,
        brokers: [kafkaBroker],

        ...(useAuth && {
          ssl: {
            rejectUnauthorized: false,
          },
          sasl: {
            mechanism: 'plain',
            username: kafkaUsername,
            password: kafkaPassword,
          },
        }),
      },

      consumer: {
        groupId: 'notifications-consumer-group',
      },
    },
  });

  // start microservices  (kafka consumer)
  await app.startAllMicroservices()
  const port = process.env.PORT || SERVICE_PORTS.NOTIFICATIONS_SERVICE;

  await app.listen(port);
  console.log(`Notifications Service running on port ${port}`);

}
bootstrap();




