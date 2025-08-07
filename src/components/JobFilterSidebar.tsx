import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "@/components/ui/select";
import { db } from "@/db";
import { jobsTable } from "@/db/schema";
import { jobTypes } from "@/lib/job-types";
import { jobFilterSchema, JobFilterValues } from "@/lib/validation";
import { and, eq, isNotNull } from "drizzle-orm";
import { redirect } from "next/navigation";

/**
 *  NextJS magic of server-components:
 * - Sending this form creates a POST request attaching the queryStrings we created
 * - On the response of this redirect we have the contents of the new page - otherwise you
 *   would have need 2 requests to display filtered data.
 * - Server-actions are optimized so they already return the new page in the response of
 *   the POST request itself.
 *
 * Form-action + server-action = doesnt require JS
 * - Since we have done this form in server-components without any client-side features this
 *   form submission will also work with JS disabled. (Page is interactive immediately and user might not need to wait to submit)
 */
async function filterJobs(formData: FormData) {
  // A priory js doesn't know this is a server-component
  "use server";

  // 1 - turn formData into normal JS object
  const values = Object.fromEntries(formData.entries());
  // 2 - Now you can pass it to Zod
  // 3 - Zod validates this data against the schema
  const { q, type, location, remote } = jobFilterSchema.parse(values);

  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    ...(type && { type }),
    ...(location && { location }),
    ...(remote && { remote: "true" }),
  });

  redirect(`/?${searchParams.toString()}`);
}

interface JobFilterSidebarProps {
  defaultValues: JobFilterValues;
}

export default async function JobFilterSidebar({
  defaultValues,
}: JobFilterSidebarProps) {
  const distintLocations = (await db
    .selectDistinct({ location: jobsTable.location })
    .from(jobsTable)
    .where(and(eq(jobsTable.approved, true), isNotNull(jobsTable.location)))
    .then((locations) =>
      locations.map(({ location }) => location),
    )) as string[]; // TS doesnt see that isNolNull does remove nulls from the resulting array

  return (
    <aside className="bg-background sticky top-0 h-fit rounded-lg border p-4 md:w-[200px]">
      <form action={filterJobs}>
        {/* this div is necessary since when we use server-actions inside server-components, 
        nextJS automatically adds a hidden input that adds the id of the server-component 
        and that will mess up our spacing */}
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Search</Label>
            <Input
              name="q"
              id="q"
              placeholder="Title, company, etc."
              defaultValue={defaultValues.q}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Type</Label>
            <Select
              id="type"
              name="type"
              defaultValue={defaultValues.type || ""}
            >
              <option value="">All Types</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Select
              id="location"
              name="location"
              defaultValue={defaultValues.location || ""}
            >
              <option value="">All Locations</option>
              {distintLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="remote"
              name="remote"
              type="checkbox"
              className="scale-125 accent-black"
              defaultChecked={defaultValues.remote}
            />
            <Label htmlFor="remote">Remote jobs</Label>
          </div>
          <Button type="submit" className="w-full">
            Filter jobs
          </Button>
        </div>
      </form>
    </aside>
  );
}
