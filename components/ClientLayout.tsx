"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const noLayoutRoutes = ["/", "/signin", "/signup", "/AdminSignIn", "/Termscondition"];

  const shouldHideLayout = noLayoutRoutes.includes(pathname);

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!shouldHideLayout && <Footer />}
    </>
  );
}
