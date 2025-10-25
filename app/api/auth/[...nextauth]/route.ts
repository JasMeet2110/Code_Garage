import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
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
      if (!user?.email) return false;
      return true;
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
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
