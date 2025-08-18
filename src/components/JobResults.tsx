import JobListItem from "@/components/JobListItem";
import { db } from "@/db";
import { jobsTable } from "@/db/schema";
import { cn } from "@/lib/utils";
import { JobFilterValues } from "@/lib/validation";
import { asc, eq, sql, and, count } from "drizzle-orm";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

interface JobResultsProps {
  filterValues: JobFilterValues;
  page?: number;
}
export default async function newFunction({
  filterValues,
  page = 1,
}: JobResultsProps) {
  const { q, type, location, remote } = filterValues;
  const jobsPerPage = 6;
  const offset = (page - 1) * jobsPerPage;
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

  const jobsPromise = db
    .select()
    .from(jobsTable)
    .where(and(...whereConditions))
    .orderBy(asc(jobsTable.createdAt))
    .limit(jobsPerPage)
    .offset(offset);

  const countPromise = db
    .select({ count: count() })
    .from(jobsTable)
    .where(and(...whereConditions));

  /**
   * We fetch fetch both queries in parallel
   * One are the jobs and another the count
   */
  const [jobs, countRows] = await Promise.all([jobsPromise, countPromise]);
  const totalResults = countRows[0]?.count ?? 0;

  return (
    <div className="grow space-y-4">
      {jobs.map((job) => (
        <Link key={job.id} href={`/jobs/${job.slug}`} className="block">
          <JobListItem job={job} />
        </Link>
      ))}
      {jobs.length === 0 && (
        <p className="m-auto text-center">
          No jobs found. Try adjusting your search filters.
        </p>
      )}
      {jobs.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(totalResults / jobsPerPage)}
          filterValues={filterValues}
        />
      )}
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  filterValues: JobFilterValues;
}

function Pagination({
  currentPage,
  totalPages,
  filterValues: { q, type, location, remote },
}: PaginationProps) {
  function generatePageLink(page: number) {
    const searchParams = new URLSearchParams({
      ...(q && { q }),
      ...(type && { type }),
      ...(location && { location }),
      ...(remote && { remote: "true" }),
      page: page.toString(),
    });
    return `/?${searchParams.toString()}`;
  }

  return (
    <div className="flex justify-between">
      <Link
        href={generatePageLink(currentPage - 1)}
        className={cn(
          "flex items-center gap-2 font-semibold",
          currentPage <= 1 && "invisible",
        )}
      >
        <ArrowLeft size={16} />
        Previous page
      </Link>
      <span className="font-semibold">
        Page {currentPage} of {totalPages}
      </span>
      <Link
        href={generatePageLink(currentPage + 1)}
        className={cn(
          "flex items-center gap-2 font-semibold",
          currentPage >= totalPages && "invisible",
        )}
      >
        Next page
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
