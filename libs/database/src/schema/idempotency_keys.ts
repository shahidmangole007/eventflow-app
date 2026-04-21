import { jsonb } from "drizzle-orm/pg-core";
import { pgTable, pgEnum, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const idempotencyStatusEnum = pgEnum('idempotency_status', [
    'IN_PROGRESS',
    'SUCCESS',
    'FAILED'
]);

export const idempotency_keys = pgTable('idempotency_keys', {
    id: uuid('id').defaultRandom().primaryKey(),
    key: varchar('key', { length: 255 }).notNull().unique(),
    status: idempotencyStatusEnum('status')
        .notNull()
        .default('IN_PROGRESS'),
    response: jsonb('response'),
    request_hash: varchar('request_hash', { length: 255 }),
    created_at: timestamp('created_at').notNull().defaultNow()
});

export type IdempotencyKey = typeof idempotency_keys.$inferSelect;
export type NewIdempotencyKey = typeof idempotency_keys.$inferInsert;