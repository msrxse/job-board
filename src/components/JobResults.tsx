import JobListItem from "@/components/jobListItem";
import { db } from "@/db";
import { jobsTable } from "@/db/schema";
import { JobFilterValues } from "@/lib/validation";
import { asc, eq, sql, and } from "drizzle-orm";

interface JobResultsProps {
  filterValues: JobFilterValues;
}
export default async function newFunction({ filterValues }: JobResultsProps) {
  const { q, type, location, remote } = filterValues;
  const whereConditions = [eq(jobsTable.approved, true)];

  // Conditionally add full-text search if querySearch exists
  if (q) {
    whereConditions.push(sql`
    (
      setweight(to_tsvector('english', ${jobsTable.title}), 'A') ||
      setweight(to_tsvector('english', ${jobsTable.companyName}), 'B') ||
      setweight(to_tsvector('english', ${jobsTable.type}), 'C') ||
      setweight(to_tsvector('english', ${jobsTable.locationType}), 'D') 
    ) @@ plainto_tsquery('english', ${q})
  `);
  }

  // Conditionally add type filter
  if (type) {
    whereConditions.push(sql`
    to_tsvector('english', ${jobsTable.type}) @@ to_tsquery('english', ${type})
  `);
  }

  // Conditionally add location filter
  if (location) {
    whereConditions.push(sql`
    to_tsvector('english', ${jobsTable.location}) @@ phraseto_tsquery('english', ${location})
  `);
  }

  // Conditionally add remote filter
  if (remote) {
    whereConditions.push(sql`
    to_tsvector('english', ${jobsTable.locationType}) @@ to_tsquery('english', 'Remote')
  `);
  }

  const jobs = await db
    .select()
    .from(jobsTable)
    .where(and(...whereConditions))
    .orderBy(asc(jobsTable.createdAt));

  return (
    <div className="grow space-y-4">
      {jobs.map((job) => (
        <JobListItem job={job} key={job.id} />
      ))}
      {jobs.length === 0 && (
        <p className="m-auto text-center">
          No jobs found. Try adjusting your search filters.
        </p>
      )}
    </div>
  );
}
