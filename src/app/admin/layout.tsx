import AdminNavbar from "@/app/admin/jobs/[slug]/AdminNavbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AdminNavbar />
      {children}
    </div>
  );
}
