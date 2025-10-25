import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "admin" | "client";
      dbInfo?: {
        id: number;
        name: string;
        phone: string;
        email: string;
        car_name: string;
        car_plate: string;
        start_date: string;
        is_profile_complete: boolean;
        created_at: string;
        updated_at: string;
      };
    };
  }

  interface User {
    role?: "admin" | "client";
  }
}
