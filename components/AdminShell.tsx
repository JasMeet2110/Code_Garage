"use client";

import React, { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminShell({
  title,
  children,
}: {
  title?: string;
  children?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />
      {/* shift content right of sidebar */}
      <div className="ml-64 min-h-screen flex flex-col">
        <AdminTopbar title={title} />
        {/* content area with card-friendly container */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

