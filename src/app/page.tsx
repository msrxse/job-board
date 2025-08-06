import { db } from "@/db";
import { jobsTable } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import JobListItem from "@/components/jobListItem";
import JobFilterSidebar from "@/components/JobFilterSidebar";

export default async function Home() {
  const jobs = await db
    .select()
    .from(jobsTable)
    .where(eq(jobsTable.approved, true))
    .orderBy(asc(jobsTable.createdAt));
  return (
    <main className="m-auto my-10 max-w-5xl space-y-10 px-3">
      <div className="space-y-5 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Developer Jobs
        </h1>
        <p className="text-muted-foreground">Find your dream job</p>
      </div>
      <section className="flex flex-col gap-4 md:flex-row">
        <JobFilterSidebar />
        <div className="grow space-y-4">
          {jobs.map((job) => (
            <JobListItem job={job} key={job.id} />
          ))}
        </div>
      </section>
    </main>
  );
}
