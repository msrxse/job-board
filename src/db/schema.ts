import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const jobsTable = pgTable(
  "jobs",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug").unique().notNull(),
    title: varchar("title").notNull(),
    type: varchar("type").notNull(),
    locationType: varchar("location_type").notNull(),
    location: varchar("location"),
    description: varchar("description"),
    salary: integer("salary").notNull(),
    companyName: varchar("company_name").notNull(),
    applicationEmail: varchar("application_email"),
    applicationUrl: varchar("application_url"),
    companyLogoUrl: varchar("company_logo_url"),
    approved: boolean("approved").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updateAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("search_index").using(
      "gin",
      sql`(
          setweight(to_tsvector('english', ${table.title}), 'A') ||
          setweight(to_tsvector('english', ${table.companyName}), 'B') ||
          setweight(to_tsvector('english', ${table.type}), 'C') ||
          setweight(to_tsvector('english', ${table.locationType}), 'D')
      )`,
    ),
  ],
);
