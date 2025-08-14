import {
  accounts,
  authenticators,
  sessions,
  users,
  verificationTokens,
} from "./auth-schema";
import { createInsertSchema } from "drizzle-zod";

import { jobsTable, JobsTableSchema, JobsTableSchemaType } from "./job-schema";
import z from "zod";

export { accounts, authenticators, sessions, users, verificationTokens };

export { jobsTable, JobsTableSchema, type JobsTableSchemaType };

export const userSchema = createInsertSchema(users);
export type UserSchemaType = z.infer<typeof userSchema>;
