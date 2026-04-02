
import { desc } from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { varchar } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";
import { title } from "process";
import { users } from "./users";
import { create } from "axios";



//Enums for events table
export const eventStatusEnum = pgEnum('event_status', [
    'DRAFT',
    'PUBLISHED',
    'CANCELLED',
]);

export const events =  pgTable('events', {
    id: uuid('id').primaryKey().defaultRandom(),
    title : varchar('title' , { length : 255 }).notNull(),
    description : varchar('description'),
    date : timestamp('date').notNull(),
    location :  varchar('location' , { length : 255}).notNull(),
    capacity : integer('capacity').notNull(),
    price : integer('price').default(0).notNull(),
    status : eventStatusEnum('status').default('DRAFT').notNull(),
    orgnizerId : uuid('organizer_id')
    .references(() => users.id)
    .notNull(),
    createdAt : timestamp('created_at').defaultNow().notNull(),
    updatedAt : timestamp('updated_at').defaultNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;


