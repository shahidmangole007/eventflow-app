
import { pgTable, pgEnum, uuid, varchar, timestamp } from "drizzle-orm/pg-core";



export const roleEnum = pgEnum('role', ['ORGNIZER', 'ADMIN', 'USER']);

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    role : roleEnum('role').notNull().default('USER'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
});


export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
