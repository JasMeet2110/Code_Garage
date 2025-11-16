import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Credentials Provider for Email/Password
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 1. Check if user exists in database
        const users = (await query("SELECT * FROM users WHERE email = ?", [
          credentials.email,
        ])) as any[];

        const user = users[0];

        if (!user) {
          return null; // User not found
        }

        // 2. Verify password
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          return null; // Invalid password
        }

        // 3. Return user object on success, including the role
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role, // IMPORTANT: Pass the role from the database
        };
      },
    }),
  ],

  pages: {
    signIn: "/AuthScreen",
  },

  callbacks: {
    async signIn({ user }) {
      return !!user?.email;
    },

    // NEW: JWT callback to save the role to the token
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Save the role from the user object
      }
      return token;
    },

    // UPDATED: Session callback to read the role from the token
    // In app/api/auth/[...nextauth]/route.ts, inside the 'callbacks' object

    // In app/api/auth/[...nextauth]/route.ts, inside the 'callbacks' object

    async session({ session, token }) {
      if (!session.user) {
        return session;
      }

      // 1. Read role from the token (set by CredentialsProvider)
      if (token.role) {
        session.user.role = token.role;
        
      }
      // 2. Fallback for Google sign-in
      else if (session.user.email === "tracksidegarage0101@gmail.com") {
        session.user.role = "admin";
        
      }
      // 3. Default role
      else {
        session.user.role = "client";
       
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
