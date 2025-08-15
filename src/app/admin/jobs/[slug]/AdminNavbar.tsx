import Link from "next/link";
import { signOut, auth } from "@/app/auth";

export default async function AdminNavbar() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <div className="px-3">
      <div className="m-auto flex h-10 max-w-5xl items-center justify-between gap-2">
        <Link href={"/admin"} className="grow font-semibold underline">
          Admin Dashboard
        </Link>
        <div className="space-x-2">
          <span className="font-semibold">
            {session.user?.email || session.user?.name}
          </span>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="font-semibold underline" type="submit">
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
