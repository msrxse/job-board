"use client";

import { approveSubmission, deleteJob } from "@/app/admin/jobs/[slug]/actions";
import FormSubmitButton from "@/components/FormSubmitButton";
import { JobsTableSchemaType } from "@/db/job-schema";
import { useActionState } from "react";

interface AdminSidebarProps {
  job: JobsTableSchemaType;
}

/**
 * Good practice more into form-actions and less click-handlers!
 *
 * We will handle the delete and approve actions via form-actions instead of
 * simple buttons calling server-actions in their click handlers. (requires javascript)
 *
 * Form actions will will support progressive enhancement (work without javascript)
 */
export default function AdminSidebar({ job }: AdminSidebarProps) {
  return (
    <aside className="flex w-[200px] flex-none flex-row items-center gap-2 md:flex-col md:items-stretch">
      {job.approved ? (
        <span className="text-center font-semibold text-green-500">
          Approved
        </span>
      ) : (
        <ApproveSubmissionButton jobId={job.id!} />
      )}
      <DeleteJobButton jobId={job.id!} />
    </aside>
  );
}

interface AdminButtonProps {
  jobId: number;
}

function ApproveSubmissionButton({ jobId }: AdminButtonProps) {
  // formerly useFromState from react-dom!!
  const [formState, formAction] = useActionState(approveSubmission, undefined);
  return (
    <form action={formAction} className="space-y-1">
      <input hidden name="jobId" value={jobId} />
      <FormSubmitButton className="w-full bg-green-500 hover:bg-green-600">
        Approve
      </FormSubmitButton>
      {formState?.error && (
        <p className="text-sm text-red-500">{formState.error}</p>
      )}
    </form>
  );
}

function DeleteJobButton({ jobId }: AdminButtonProps) {
  // formerly useFromState from react-dom!!
  const [formState, formAction] = useActionState(deleteJob, undefined);
  return (
    <form action={formAction} className="space-y-1">
      <input hidden name="jobId" value={jobId} />
      <FormSubmitButton className="w-full bg-red-500 hover:bg-red-600">
        Delete
      </FormSubmitButton>
      {formState?.error && (
        <p className="text-sm text-red-500">{formState.error}</p>
      )}
    </form>
  );
}
