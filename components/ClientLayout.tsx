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
    "/Admin/AdminReviews",
    "/Admin/AdminAIAssistant",
    "/Admin/AdminShifts"
  ];

  const hideForAdminComplete =
    pathname.startsWith("/Admin/AdminAppointments/complete/");

  const shouldHideLayout =
    noLayoutRoutes.includes(pathname) || hideForAdminComplete;

  const noPaddingRoutes = ["/"];
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
