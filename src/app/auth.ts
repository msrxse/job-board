import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { accounts, sessions, users, verificationTokens } from "@/db/schema";
import { db } from "@/db";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { getUserByEmail } from "@/app/login/actions";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "john@example.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      authorize: async (credentials) => {
        // 1. Get the user from the DB by email

        const user = await getUserByEmail(credentials.email as string);

        if (!user) throw new Error("Invalid credentials.");

        // 2. Compare provided password with stored hash
        // const isValid = await bcrypt.compare(
        //   credentials.password as string,
        //   user.passwordHash,
        // );

        // if (!isValid) throw new Error("Invalid credentials.");

        // 3. Return the user object if valid
        return {
          id: user.id,
          name: user.name ?? "",
          email: user.email,
        };
      },
    }),
  ],
});
