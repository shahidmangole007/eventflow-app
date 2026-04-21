import { jsonb } from "drizzle-orm/pg-core";
import { pgTable, pgEnum, uuid, varchar, timestamp , integer } from "drizzle-orm/pg-core";



export const failed_events = pgTable('failed_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  payload: jsonb('payload').notNull(),
  error: varchar('error', { length: 255 }),
  retries: integer('retries'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export type FailedEvents = typeof failed_events.$inferSelect;
export type NewFailedEvents = typeof failed_events.$inferInsert;
