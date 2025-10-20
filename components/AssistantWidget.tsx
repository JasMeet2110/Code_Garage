"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const BUSINESS_HOURS = [
  "Mon–Fri: 9:00 AM – 6:00 PM",
  "Sat: 10:00 AM – 4:00 PM",
  "Sun: Closed",
];
const ADDRESS = "123 Example Ave, Calgary, AB";

type Msg = string;
type Step = "idle" | "form1" | "service" | "calendar" | "times";

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(["Hi! How can I help you?"]);
  const [step, setStep] = useState<Step>("idle");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [phone, setPhone]         = useState("");
  const [email, setEmail]         = useState("");
  const [vin, setVin]             = useState("");

  const [service, setService] = useState<"Vehicle checkup" | "oil change" | "tire change" | "">("");

  const [calendarCursor, setCalendarCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const monthLabel = (d: Date) =>
    d.toLocaleString(undefined, { month: "long", year: "numeric" });
  const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
  const endOfMonth   = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);

  const dayCells = (() => {
    const start = startOfMonth(calendarCursor);
    const end = endOfMonth(calendarCursor);
    const startWeekday = start.getDay();
    const daysInMonth = end.getDate();
    const cells: Array<{ day: number | null; date?: Date }> = [];
    for (let i = 0; i < startWeekday; i++) cells.push({ day: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth(), d);
      cells.push({ day: d, date });
    }
    return cells;
  })();

  const timeSlots = Array.from({ length: 9 }, (_, i) => 9 + i).map((h) => {
    const label = h === 12 ? "12:00 PM" : h < 12 ? `${h}:00 AM` : `${h - 12}:00 PM`;
    return { h, label };
  });

  const canNextForm1 =
    firstName.trim() && lastName.trim() && phone.trim() && email.trim() && vin.trim();

  const suggestions: Array<
    | { label: string; type: "action"; action: () => void }
    | { label: string; type: "text"; value: string }
    | { label: string; type: "link"; href: string }
  > = [
    {
      label: "➕ Make an appointment",
      type: "action",
      action: () => {
        setStep("form1");
        setFirstName(""); setLastName(""); setPhone(""); setEmail(""); setVin("");
        setService(""); setSelectedDate(null);
        const d = new Date();
        setCalendarCursor(new Date(d.getFullYear(), d.getMonth(), 1));
      },
    },
    {
      label: "💬 Ask about services",
      type: "action",
      action: () => {
        setMessages(prev => [...prev, "To be added soon"]);
      },
    },
    {
      label: "🕒 Hours & location",
      type: "action",
      action: () => {
        const lines = [
          "Here are our hours & location:",
          ...BUSINESS_HOURS,
          `Address: ${ADDRESS}`,
        ];
        setMessages((prev) => [...prev, lines.join("\n")]);
      },
    },
    {
      label: "📞 Contact info",
      type: "action",
      action: () => {
        const lines = [
          "Contact Information:",
          "Phone: +1 (403) 123-4567",
          "Email: tracksidegarage@gmail.com",
          `Address: ${ADDRESS}`,
        ];
        setMessages((prev) => [...prev, lines.join("\n")]);
      },
    },
    {
      label: "👤 Talk to an agent",
      type: "action",
      action: () => setMessages((p) => [...p, "connecting you to an agent .."]),
    },
  ];

  const send = () => {
    const v = inputRef.current?.value?.trim();
    if (!v) return;
    setMessages((prev) => [...prev, `You: ${v}`]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const selectDay = (date: Date) => {
    setSelectedDate(date);
  };

  const confirmDone = (timeLabel: string, timeHour: number) => {
    if (!selectedDate || !service) return;
    const chosen = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      timeHour,
      0,
      0
    );
    const when = chosen.toLocaleString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      `Appointment created for ${when}\nName: ${firstName} ${lastName}\nPhone: ${phone}\nEmail: ${email}\nVIN: ${vin}\nService: ${service}`,
      "your appoinment is created. you will get a text message to confimation of your appointment",
    ]);
    setStep("idle");
    setSelectedDate(null);
    setService("");
    setFirstName(""); setLastName(""); setPhone(""); setEmail(""); setVin("");
  };

  return (
    <>
      {!open && (
        <button
          aria-label="Open assistant"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[60] h-14 w-14 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center hover:opacity-90"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z"/>
          </svg>
        </button>
      )}

      {open && (
        <>
          <div className="fixed inset-0 z-[58] bg-black/30" onClick={() => setOpen(false)} />

          <div className="fixed bottom-6 right-6 z-[59] w-full sm:w-[420px] rounded-2xl bg-white shadow-2xl border overflow-hidden">
            <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-white/15">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z"/>
                  </svg>
                </span>
                <h3 className="text-sm font-semibold">AI Assistant</h3>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <button className="hover:text-white" title="Minimize" onClick={() => setOpen(false)}>—</button>
                <button className="hover:text-white" aria-label="Close" onClick={() => setOpen(false)}>✕</button>
              </div>
            </div>

            <div className="px-4 pt-4 space-y-3 max-h-72 overflow-y-auto">
              {messages.map((m, i) => (
                <div key={i} className="rounded-2xl bg-gray-100 px-3 py-2 text-sm text-gray-800 whitespace-pre-line">
                  {m}
                </div>
              ))}

              {step === "form1" && (
                <div className="rounded-2xl border p-3 space-y-2">
                  <div className="text-sm font-medium mb-1">Fill your info</div>
                  <input value={firstName} onChange={(e)=>setFirstName(e.target.value)} placeholder="First name" className="w-full rounded-lg border px-3 py-2 text-sm" />
                  <input value={lastName}  onChange={(e)=>setLastName(e.target.value)}  placeholder="Last name"  className="w-full rounded-lg border px-3 py-2 text-sm" />
                  <input value={phone}     onChange={(e)=>setPhone(e.target.value)}     placeholder="Phone"      className="w-full rounded-lg border px-3 py-2 text-sm" />
                  <input value={email}     onChange={(e)=>setEmail(e.target.value)}     placeholder="Email"      className="w-full rounded-lg border px-3 py-2 text-sm" />
                  <input value={vin}       onChange={(e)=>setVin(e.target.value)}       placeholder="Vehicle VIN" className="w-full rounded-lg border px-3 py-2 text-sm" />
                  <div className="flex justify-end">
                    <button
                      disabled={!canNextForm1}
                      onClick={() => setStep("service")}
                      className={`rounded-full px-4 py-2 text-sm ${canNextForm1 ? "bg-blue-600 text-white hover:opacity-90" : "bg-gray-200 text-gray-500"}`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {step === "service" && (
                <div className="rounded-2xl border p-3 space-y-3">
                  <div className="text-sm font-medium">Choose a service</div>
                  <div className="grid gap-2">
                    {["Vehicle checkup", "oil change", "tire change"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setService(s as any)}
                        className={`w-full text-left rounded-full border px-4 py-2 text-sm hover:bg-gray-50 ${service===s ? "ring-2 ring-blue-500" : ""}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button
                      disabled={!service}
                      onClick={() => setStep("calendar")}
                      className={`rounded-full px-4 py-2 text-sm ${service ? "bg-blue-600 text-white hover:opacity-90" : "bg-gray-200 text-gray-500"}`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {step === "calendar" && (
                <div className="rounded-2xl border p-3">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      className="rounded px-2 py-1 border hover:bg-gray-50 text-sm"
                      onClick={() => {
                        const d = new Date(calendarCursor);
                        setCalendarCursor(new Date(d.getFullYear(), d.getMonth() - 1, 1));
                      }}
                    >
                      ◀
                    </button>
                    <div className="text-sm font-medium">{monthLabel(calendarCursor)}</div>
                    <button
                      className="rounded px-2 py-1 border hover:bg-gray-50 text-sm"
                      onClick={() => {
                        const d = new Date(calendarCursor);
                        setCalendarCursor(new Date(d.getFullYear(), d.getMonth() + 1, 1));
                      }}
                    >
                      ▶
                    </button>
                  </div>
                  <div className="grid grid-cols-7 text-[11px] text-gray-500 mb-1">
                    <div className="text-center">Sun</div>
                    <div className="text-center">Mon</div>
                    <div className="text-center">Tue</div>
                    <div className="text-center">Wed</div>
                    <div className="text-center">Thu</div>
                    <div className="text-center">Fri</div>
                    <div className="text-center">Sat</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {dayCells.map((c, idx) =>
                      c.day === null ? (
                        <div key={idx} className="h-9" />
                      ) : (
                        <button
                          key={idx}
                          className={`h-9 rounded-md border text-sm hover:bg-gray-50 ${selectedDate && c.date && selectedDate.toDateString()===c.date.toDateString() ? "ring-2 ring-blue-500" : ""}`}
                          onClick={() => setSelectedDate(c.date!)}
                        >
                          {c.day}
                        </button>
                      )
                    )}
                  </div>
                  <div className="flex justify-end mt-3">
                    <button
                      disabled={!selectedDate}
                      onClick={() => setStep("times")}
                      className={`rounded-full px-4 py-2 text-sm ${selectedDate ? "bg-blue-600 text-white hover:opacity-90" : "bg-gray-200 text-gray-500"}`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {step === "times" && selectedDate && (
                <div className="rounded-2xl border p-3">
                  <div className="text-sm font-medium mb-2">
                    Choose a time for{" "}
                    {selectedDate.toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((t) => (
                      <button
                        key={t.h}
                        className="rounded-full border px-3 py-2 text-sm hover:bg-gray-50"
                        onClick={() => confirmDone(t.label, t.h)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-3 grid gap-2">
              {suggestions.map((s, i) => {
                if (s.type === "link") {
                  return (
                    <Link
                      key={"l" + i}
                      href={s.href}
                      className="w-full text-left rounded-full border px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      {s.label}
                    </Link>
                  );
                }
                if (s.type === "action") {
                  return (
                    <button
                      key={"a" + i}
                      className="w-full text-left rounded-full border px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={s.action}
                    >
                      {s.label}
                    </button>
                  );
                }
                return (
                  <button
                    key={"b" + i}
                    className="w-full text-left rounded-full border px-4 py-2 text-sm hover:bg-gray-50"
                    onClick={() => {
                      if (inputRef.current) inputRef.current.value = s.value;
                    }}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>

            <div className="px-4 pb-4">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask a question…"
                  className="flex-1 rounded-full border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => e.key === "Enter" && send()}
                />
                <button
                  onClick={send}
                  className="rounded-full bg-blue-600 px-4 py-2 text-sm text-white hover:opacity-90"
                >
                  Send
                </button>
              </div>
              <p className="mt-2 text-[11px] text-gray-500">Tip: click a suggestion to auto-fill the box.</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
