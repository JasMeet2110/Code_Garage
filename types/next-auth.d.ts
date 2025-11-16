import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// Extend the User type to include the role
declare module "next-auth" {
  interface User extends DefaultUser {
    role?: "admin" | "client" | string; // Add the role property
  }

  // Extend the Session type to include the role
  interface Session extends DefaultSession {
    user?: {
      id?: string;
      role?: "admin" | "client" | string; // Add the role property
    } & DefaultSession["user"];
  }
}

// Extend the JWT type to include the role
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: "admin" | "client" | string; // Add the role property
  }
}
