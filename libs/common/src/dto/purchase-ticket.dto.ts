import { IsEnum, IsInt, IsNotEmpty, IsUUID, Max, Min } from "class-validator";


export class PurchaseTicketDto {


    @IsUUID(4, { message: "eventId must be a valid UUID v4" })
    @IsNotEmpty({ message: "eventId is required" })
    eventId: string;

    @IsInt({ message: "quantity must be an integer" })
    @Max(10, { message: "quantity cannot exceed 10" })
    @Min(1, { message: "quantity must be at least 1" })
    @IsNotEmpty({ message: "quantity is required" })
    quantity: number;


    @IsNotEmpty({ message: "status is required" })
    @IsEnum(['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CANCELED'], { message: "status must be one of: PENDING, CONFIRMED, CHECKED_IN, CANCELED" })
    status: string;






    // id: uuid('id').primaryKey().defaultRandom(),
    // eventId: uuid('event_id')
    //     .references(() => events.id)
    //     .notNull(),
    // userId: uuid('user_id')
    //     .references(() => users.id)
    //     .notNull(),
    // quantity: integer('quantity').default(1).notNull(),
    // totalPrice: integer('total_price').notNull(),
    // status: ticketStatusEnum('status').default('PENDING').notNull(),
    // ticketCode: varchar('ticket_code', { length: 20 }).notNull().unique(),
    // purchasedAt: timestamp('purchased_at').defaultNow().notNull(),
    // checkedInAt: timestamp('checked_in_at'),
    // createdAt: timestamp('created_at').notNull().defaultNow(),
    // updatedAt: timestamp('updated_at').notNull().defaultNow()


}
