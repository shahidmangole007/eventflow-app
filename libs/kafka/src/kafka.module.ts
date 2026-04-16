import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

export const KAFKA_SERVICE = 'KAFKA_SERVICE';

@Module({})
export class KafkaModule {
  static register(consumerGroup?: string): DynamicModule {
    return {
      module: KafkaModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: KAFKA_SERVICE,

            imports: [ConfigModule],

            inject: [ConfigService],

            useFactory: (configService: ConfigService) => {
              const broker = configService.get<string>('KAFKA_BROKER');
              const username = configService.get<string>('KAFKA_USERNAME');
              const password = configService.get<string>('KAFKA_PASSWORD');

              if (!broker) {
                throw new Error('KAFKA_BROKER is not defined');
              }

              const useAuth = username && password;

              return {
                transport: Transport.KAFKA,
                options: { 
                  client: {
                    clientId: 'eventflow-app',
                    brokers: [broker],
                    ...(useAuth && {
                      ssl: {
                        rejectUnauthorized: false,
                      },
                      sasl: {
                        mechanism: 'plain',
                        username,
                        password,
                      },
                    }),
                  },
                  consumer: {
                    groupId: consumerGroup ?? 'default-consumer-group',
                  },
                },
              };
            },
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}