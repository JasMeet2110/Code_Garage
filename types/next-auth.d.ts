import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: "admin" | "client" | string;
  }

  interface Session extends DefaultSession {
    user?: {
      id?: string;
      role?: "admin" | "client" | string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: "admin" | "client" | string;
  }
}
