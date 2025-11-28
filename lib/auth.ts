import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

   if (!session || !session.user || session.user.role !== "admin") {
    return null;
  }

  return session.user;
}
