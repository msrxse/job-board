import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();
  if (!session) return redirect("/login");

  return <main>Admin page</main>;
}
