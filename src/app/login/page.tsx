import { redirect } from "next/navigation";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { auth, signIn } from "@/app/auth";

export default async function Login() {
  const session = await auth();
  console.log(session);

  if (session) return redirect("/admin");

  return (
    <main className="m-auto my-10 flex max-w-3xl justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="loginForm"
            action={async (formData) => {
              "use server";
              await signIn("credentials", formData);
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" form="loginForm" className="w-full">
            Login
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
