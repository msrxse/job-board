import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

async function filterJobs(formData: FormData) {
  // A priory js doesn't know this is a server-component
  "use server";
}

export default function JobFilterSidebar() {
  return (
    <aside className="bg-background sticky top-0 h-fit rounded-lg border p-4 md:w-[200px]">
      <form action={filterJobs}>
        {/* this div is necessary since when we use server-actions inside server-components, 
        nextJS automatically adds a hidden input that adds the id of the server-component 
        and that will mess up our spacing */}
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Search</Label>
            <Input name="q" id="q" placeholder="Title, company, etc." />
          </div>
        </div>
      </form>
    </aside>
  );
}
