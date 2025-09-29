"use client";

export default function AdminTopbar({ title }: { title?: string }) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/90 backdrop-blur border-b border-slate-800">
      <div className="h-full px-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-100">
          {title ?? "Dashboard"}
        </h1>
        <div className="flex items-center gap-4">
          <input
            className="hidden md:block w-64 rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-200
                       placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-orange-400/40"
            placeholder="Search…"
          />
          <div className="h-9 w-9 rounded-full bg-slate-700" />
        </div>
      </div>
    </header>
  );
}

