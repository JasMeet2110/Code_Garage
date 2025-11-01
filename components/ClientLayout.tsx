"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const noLayoutRoutes = [
    "/Admin/AdminHome",
    "/Admin/AdminAppointments",
    "/Admin/AdminInventory",
    "/Admin/AdminEmployees",
    "/Admin/AdminCustomers",
    "/Admin/AdminServices",
    "/Admin/AdminReports",
    "/Admin/AdminFinance",
  ];

  const shouldHideLayout = noLayoutRoutes.includes(pathname);

  const noPaddingRoutes = ["/", "/Client/contact"];
  const shouldRemovePadding =
    noPaddingRoutes.includes(pathname) || pathname.startsWith("/Client/services/");

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      <main
        className={`flex-grow ${
          shouldHideLayout || shouldRemovePadding ? "" : "pt-28"
        }`}
      >
        {children}
      </main>
      {!shouldHideLayout && <Footer />}
    </>
  );
}
