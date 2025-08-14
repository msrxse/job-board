"use server";

import { db } from "@/db";
import { auth } from "@/app/auth";
import { jobsTable, UserSchemaType } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type FormState = { error?: string } | undefined;

/**
 * Utility function to retrieve current user from the session
 */
async function currentUser(): Promise<UserSchemaType | undefined> {
  const session = await auth();
  return session?.user;
}

export async function approveSubmission(
  prevState: FormState, // since it will be called  with useFormState()
  formData: FormData,
): Promise<FormState> {
  try {
    const jobId = parseInt(formData.get("jobId") as string);
    const user = await currentUser();

    if (!user) {
      throw new Error("Not authorized");
    }

    await db
      .update(jobsTable)
      .set({ approved: true })
      .where(eq(jobsTable.id, jobId));

    // We want to show the updated data with revalidatePath()
    // This call in server-action it also clears the client side router cache
    // so what we see on the screen will also be refreshed. No matter the page we are currently on.
    revalidatePath("/");
  } catch (error) {
    // we catch this error here so we can have specific reason of failure -
    // nextjs doesn't send errors to the frontend from
    // server-components to avoid leaking sensitive data.
    // (we need to return it explicitly if we want it on the frontend)

    let message = "Unexpected error";
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }
}

export async function deleteJob(prevState: FormState, formData: FormData) {
  try {
    const jobId = parseInt(formData.get("jobId") as string);
    const user = await currentUser();

    if (!user) {
      throw new Error("Not authorized");
    }

    // Here we remove the logo url from vercel blob storage
    // const job = await db.query.jobsTable.findFirst({
    //   with: {
    //     id: jobId,
    //   },
    // });
    // if (job?.companyLogoUrl) {
    //   await del(job.companyLogoUrl);
    // }

    await db.delete(jobsTable).where(eq(jobsTable.id, jobId));

    revalidatePath("/");
  } catch (error) {
    // we catch this error here so we can have specific reason of failure -
    // nextjs doesn't send errors to the frontend from
    // server-components to avoid leaking sensitive data.
    // (we need to return it explicitly if we want it on the frontend)

    let message = "Unexpected error";
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }

  // redirects returns an error - so we need this outside the try/catch
  redirect("/admin");
}
