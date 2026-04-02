import { KAFKA_SERVICE, KAFKA_TOPICS } from '@app/kafka';
import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable({})
export class AuthServiceService implements OnModuleInit {


  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient : ClientKafka
  ){}

  async onModuleInit() {
    // connect when the module initializes
    await this.kafkaClient.connect();
  }

  getHello(): string {
    return 'Hello World!';
  }


  simulateUserRegistration(email: string) {
     this.kafkaClient.emit(KAFKA_TOPICS.USER_REGISTERED, { 
      email ,
      timestamp: new Date().toISOString()});


      return { message: `User with email ${email} registered successfully!` };
  }

}
