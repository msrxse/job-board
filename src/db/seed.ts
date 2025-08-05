import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { usersTable, jobsTable } from "./schema";
import { placeholderJobs } from "./placeholder-data";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const user: typeof usersTable.$inferInsert = {
    name: "John",
    age: 30,
    email: "john@example.com",
  };

  try {
    console.log("Seeding data...");

    // Optional: Clear existing data
    // Workaround for DELETE FROM users since Drizzle needs a condition
    await db.delete(usersTable).where(eq(usersTable.id, usersTable.id)); // Deletes all rows
    await db.delete(jobsTable).where(eq(jobsTable.id, jobsTable.id)); // Deletes all rows

    // Insert singular item
    await db.insert(usersTable).values(user);
    // Bulk Insert (Bulk insert: Drizzle supports passing an array directly to "values")
    await db.insert(jobsTable).values(placeholderJobs);

    const users = await db.select().from(usersTable);
    console.log("Getting all users from the database: ", users);
    const jobs = await db.select().from(jobsTable);
    console.log("Getting all jobs from the database: ", jobs);

    console.log("Seeding complete.");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

main();
