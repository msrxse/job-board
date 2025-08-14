import { auth } from "@/app/auth";
import JobListItem from "@/components/JobListItem";
import H1 from "@/components/ui/h1";
import { db } from "@/db";
import { jobsTable } from "@/db/job-schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();
  if (!session) return redirect("/login");

  const unapprovedJobs = await db
    .select()
    .from(jobsTable)
    .where(eq(jobsTable.approved, false));

  return (
    <main className="m-auto my-10 max-w-5xl space-y-10 px-3">
      <H1 className="text-center">Admin Dashboard</H1>
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">Unapproved jobs</h2>
        {unapprovedJobs.map((job) => {
          return (
            <Link
              key={job.id}
              href={`/admin/jobs/${job.slug}`}
              className="block"
            >
              <JobListItem job={job} />
            </Link>
          );
        })}
        {unapprovedJobs.length === 0 && (
          <p className="text-muted-foreground">No unapproved jobs</p>
        )}
      </section>
    </main>
  );
}
