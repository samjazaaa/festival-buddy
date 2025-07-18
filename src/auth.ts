import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";
import prisma from "./lib/prisma";

async function getUser(user: string) {
  try {
    // TODO replace with correct sqlite syntax
    const userObj = await prisma.user.findUniqueOrThrow({
      where: { name: user },
    });

    return userObj;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            user: z.string().min(6),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { user, password } = parsedCredentials.data;
          const userObj = await getUser(user);
          if (!userObj) return null;
          const passwordsMatch = await bcrypt.compare(
            password,
            userObj.password
          );

          if (passwordsMatch) return userObj;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
