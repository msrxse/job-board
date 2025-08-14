import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { users, jobsTable } from "./schema";
import { placeholderJobs } from "./placeholder-data";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const user: typeof users.$inferInsert = {
    name: "John",
    email: "john@example.com",
  };

  try {
    console.log("Seeding data...");

    // Optional: Clear existing data
    // Workaround for DELETE FROM users since Drizzle needs a condition
    await db.delete(users).where(eq(users.id, users.id)); // Deletes all rows
    // await db.delete(jobsTable).where(eq(jobsTable.id, jobsTable.id)); // Deletes all rows

    // Insert singular item
    await db.insert(users).values(user);
    // Bulk Insert (Bulk insert: Drizzle supports passing an array directly to "values")
    // await db.insert(jobsTable).values(placeholderJobs);

    const allUsers = await db.select().from(users);
    console.log("Getting all users from the database: ", allUsers);
    // const jobs = await db.select().from(jobsTable);
    // console.log("Getting all jobs from the database: ", jobs);

    console.log("Seeding complete.");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

main();
