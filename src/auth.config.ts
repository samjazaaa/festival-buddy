import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnTimetable = nextUrl.pathname.startsWith("/timetable");
      if (isOnTimetable) {
        if (isLoggedIn) return true;
        return false; // redirect unauthenticated user to login
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/timetable", nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
