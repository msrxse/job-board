"use server";

import { db } from "@/db";
import { jobsTable } from "@/db/schema";
import { toSlug } from "@/lib/utils";
import { createJobSchema } from "@/lib/validation";
import { nanoid } from "nanoid";
// import path from "path";
// import { put } from "@vercel/blob";

/**
 * Usually we anything as props on server components
 * but we keep it as formData since we are passing a file to the
 * server and that needs to be wrapped in server-components
 */
export async function createJobPosting(formData: FormData) {
  // Create JS object form formData
  const values = Object.fromEntries(formData.entries());
  // Validate it as if it is was a normal POST endpoint
  // if any of theres values is invalid it will throw
  const {
    title,
    type,
    companyName,
    companyLogo,
    locationType,
    location,
    applicationEmail,
    applicationUrl,
    description,
    salary,
  } = createJobSchema.parse(values);

  // create a slug that the entry needs of the DB
  const slug = `${toSlug(title)}-${nanoid(10)}`;

  // upload companyLogo to blob storage
  // commented code does use vercel
  let companyLogoUrl: string | undefined = undefined;
  // if (companyLogo) {
  //   const blob = await put(
  //     `company_logo/${slug}${path.extname(companyLogo.name)}`,
  //     companyLogo,
  //     {
  //       access: "public",
  //       addRandomSuffix: false,
  //     },
  //   );
  //   companyLogoUrl = blob.url;
  // }

  await db.insert(jobsTable).values({
    slug,
    title: title.trim(),
    type,
    companyName: companyName.trim(),
    companyLogoUrl,
    locationType,
    location,
    applicationEmail: applicationEmail?.trim(),
    applicationUrl: applicationUrl?.trim(),
    description: description?.trim(),
    salary: parseInt(salary),
  });
}
