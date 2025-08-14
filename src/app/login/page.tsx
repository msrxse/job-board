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
import { Button } from "@/components/ui/button";

import { auth, signIn } from "@/app/auth";
import { Github } from "lucide-react";
import { OauthButtons } from "@/app/login/_components/oauth-buttons";

export default async function Login() {
  const session = await auth();

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
          <OauthButtons />
        </CardContent>
      </Card>
    </main>
  );
}
