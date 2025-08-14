import AdminSidebar from "@/app/admin/jobs/[slug]/AdminSidebar";
import JobPage from "@/components/JobPage";
import { db } from "@/db";
import { jobsTable } from "@/db/job-schema";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

interface PageProps {
  params: { slug: string };
}

/**
 * We don't care about caching or SEO in this page because
 * only admins will work here. Doesn't show up in Google.
 */
export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const job = await db.select().from(jobsTable).where(eq(jobsTable.slug, slug));

  if (!job[0]) return notFound();

  return (
    <main className="m-auto my-10 flex max-w-5xl flex-col items-center gap-5 px-3 md:flex-row md:items-start">
      <JobPage job={job[0]} />
      <AdminSidebar job={job[0]} />
    </main>
  );
}
