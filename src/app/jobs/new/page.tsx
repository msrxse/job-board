import NewJobForm from "@/app/jobs/new/NewJobForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post a new job",
};

export default function Page() {
  return <NewJobForm />;
}
