import { CreateEventDto, UpdateEventDto } from '@app/common';
import { DatabaseService, events } from '@app/database';
import { KAFKA_SERVICE, KAFKA_TOPICS } from '@app/kafka';
import { ForbiddenException, Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { eq } from 'drizzle-orm';


@Injectable()
export class EventServiceService implements OnModuleInit {

  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
    private readonly dbService: DatabaseService


  ) { }

  async onModuleInit() {
    await this.kafkaClient.connect();
  }



  async create(createEventDto: CreateEventDto, orgnizerId: string) {
    const [event] = await this.dbService.db.insert(events).values({
      ...createEventDto,
      // id : uuidv4(),
      date: new Date(createEventDto.date),
      price: createEventDto.price || 0,
      orgnizerId,
    }).returning();

    this.kafkaClient.emit(KAFKA_TOPICS.EVENT_CREATED, {
      eventId: event.id,
      orgnizerId: event.orgnizerId,
      title: event.title,
      timestamp: new Date().toISOString(),
    })

    return event;

  }

  async findAll() {
    return await this.dbService.db
      .select()
      .from(events)
      .where(eq(events.status, 'PUBLISHED'));
  }

  async findOne(id: string) {
    const [event] = await this.dbService.db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto, userId: string, userRole: string) {

    const [event] = await this.dbService.db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    if (event.orgnizerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You are not allowed to update this event');
    }

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const updatedData: Record<string, unknown> = { ...updateEventDto }


    if (updateEventDto.date) {
      updatedData.date = new Date(updateEventDto.date);
    }

    const [updated] = await this.dbService.db
      .update(events)
      .set({
        ...updatedData,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning();

    this.kafkaClient.emit(KAFKA_TOPICS.EVENT_UPDATED, {
      eventId: updated.id,
      chnages: Object.keys(updateEventDto),
      timestamp: new Date().toISOString(),
    })

    return updated;

  }


  async publish(id : string , userId : string , userRole : string ){
    const event =  await this.findOne(id);

    if(event.orgnizerId !== userId && userRole !== 'ADMIN'){
      throw new ForbiddenException('You are not authorized to publish this event');
    }

    const [published]  = await this.dbService.db
    .update(events)
    .set({  status : 'PUBLISHED',updatedAt : new Date()})
    .where(eq(events.id , id))
    .returning();

    return published;
    
  }


  async cancel(id : string , userId : string , userRole : string){
    const event =  await this.findOne(id);    
    if(event.orgnizerId !== userId && userRole !== 'ADMIN'){
      throw new ForbiddenException('You are not authorized to cancel this event');
    }

    const [cancelled]  = await this.dbService.db
    .update(events)
    .set({  status : 'CANCELLED',updatedAt : new Date()})
    .where(eq(events.id , id))
    .returning();

    this.kafkaClient.emit(KAFKA_TOPICS.EVENT_CANCELED , {
      eventId : cancelled.id,
      organizerId : cancelled.orgnizerId,
      timestamp : new Date().toISOString()
    });

    return cancelled;
    
  }


  async findMyEvent( organizerId : string ){
    return this.dbService.db
    .select()
    .from(events)
    .where(eq(events.orgnizerId , organizerId));
  }



}
