import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";
import bcrypt from "bcrypt";
import sqlite3 from "sqlite3";
import path from "path";

// https://krimsonhart.medium.com/how-i-built-my-portfolio-using-next-js-and-sqlite-db-part-2-37595ca4dc40
const dbPath = path.join(process.cwd(), "users.db");
const db = new sqlite3.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error(err.message);
    }
  }
);

async function getUser(user: string): Promise<User | undefined> {
  try {
    // TODO replace with correct sqlite syntax
    const user = await db<User[]>`SELECT * FROM users WHERE user=$(user)`;
    return user[0];
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
