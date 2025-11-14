import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/AuthScreen",
  },

  callbacks: {
    async signIn({ user }) {
      return !!user?.email;
    },
    async session({ session }) {
      if (session?.user?.email === "tracksidegarage0101@gmail.com") {
        session.user.role = "admin";
      } else {
        session.user.role = "client";
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
