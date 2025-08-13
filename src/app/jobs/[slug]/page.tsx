import { db } from "@/db";
import { cache } from "react";
import { jobsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import JobPage from "@/components/JobPage";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: {
    slug: string;
  };
}

/**
 * This fetch will be done once but notice that will be called
 * from generateMetadata and the main fn (as described in NextJS docs)
 * (if using fetch() you dont need to do this - is already deduplicated)
 */
const getJob = cache(async (slug: string) => {
  const job = await db.select().from(jobsTable).where(eq(jobsTable.slug, slug));

  if (!job[0]) notFound(); // does redirect to the 404 page

  return job[0];
});

/**
 * This metadata depends on the data received from the db (is not static)
 * You cant share data directly - you need to fetch getJob() again
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);

  return {
    title: job.title,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const job = await getJob(slug);

  const { applicationEmail, applicationUrl } = job;
  const applicationLink = applicationEmail
    ? `mailto:${applicationEmail}`
    : applicationUrl;

  /**
   * This should not happen but TS doesn't know that either email or
   * link must be present as we described it on the schema
   * Anyway if ever happens we navigate to notFOund() since an incomplete job is not good
   */
  if (!applicationLink) {
    console.log("Job has no application link or email");
    notFound();
  }

  return (
    <main className="m-auto my-10 flex max-w-5xl flex-col items-center gap-5 px-3 md:flex-row md:items-start">
      <JobPage job={job} />
      <aside>
        <Button asChild>
          <a href={applicationLink} className="w-40 md:w-fit">
            Apply now
          </a>
        </Button>
      </aside>
    </main>
  );
}
