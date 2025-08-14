"use client";

import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Github, TvIcon } from "lucide-react";

export const OauthButtons = () => (
  <div className="flex flex-col gap-y-2">
    <Button
      variant="default"
      className="w-full"
      onClick={() => signIn("google")}
      disabled
    >
      <TvIcon className="mr-2 size-5" />
      Log in with Google
    </Button>
    <Button
      variant="default"
      className="w-full"
      onClick={() => signIn("github")}
    >
      <Github className="mr-2 size-5" />
      Log in with GitHub
    </Button>
  </div>
);
