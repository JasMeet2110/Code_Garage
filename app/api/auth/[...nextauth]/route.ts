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

    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials?.email || !credentials?.password) return null;

        const users = (await query("SELECT * FROM users WHERE email = ?", [
          credentials.email,
        ])) as any[];

        const user = users[0];
        if (!user) return null;

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValidPassword) return null;

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        } as any;
      },
    }),
  ],

  pages: {
    signIn: "/AuthScreen",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user }) {
      return !!user?.email;
    },

    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },

    async session({ session, token }: any) {
      if (!session.user) return session;

      if (token.role) {
        session.user.role = token.role as string;
      } else if (session.user.email === "tracksidegarage0101@gmail.com") {
        session.user.role = "admin" as string;
      } else {
        session.user.role = "client" as string;
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
