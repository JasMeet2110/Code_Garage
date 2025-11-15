"use client";

import { useState } from "react";
import Image from "next/image";
import AdminSidebar from "@/components/AdminSidebar";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function AdminAIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm the Trackside AI assistant. Tell me what you want to do — add inventory, manage employees, create appointments, diagnose a car issue, anything.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });

      const data = await res.json();

      // Auto CREATE logic
      const confirmWords = ["yes", "ok", "sure", "go ahead", "do it", "confirm"];

      const isConfirm = confirmWords.some((w) =>
        userMsg.content.toLowerCase().includes(w)
      );

      // EMPLOYEE CREATE
      if (
        data.intent === "employee" &&
        data.missingFields.length === 0 &&
        data.employeeData &&
        isConfirm
      ) {
        await fetch("/api/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data.employeeData),
        });
      }

      // INVENTORY CREATE
      if (
        data.intent === "inventory" &&
        data.missingFields.length === 0 &&
        data.inventoryData &&
        isConfirm
      ) {
        await fetch("/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data.inventoryData),
        });
      }

      // APPOINTMENT CREATE
      if (
        data.intent === "appointment" &&
        data.missingFields.length === 0 &&
        data.appointmentData &&
        isConfirm
      ) {
        await fetch("/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data.appointmentData),
        });
      }

      // Add bot response
      const botMsg: ChatMessage = {
        role: "assistant",
        content: data.replyText || "I processed your request.",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "AI error — try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen relative text-white">
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background/admin.png"
          alt="Garage Background"
          fill
          priority
          className="object-cover brightness-[0.45] blur-sm"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      <AdminSidebar />

      <main className="ml-72 flex-1 p-10">
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-8 h-[85vh] flex flex-col border border-white/20">
          <h1 className="text-4xl font-bold text-orange-400 mb-4">
            Trackside AI Assistant
          </h1>

          <div className="flex-1 bg-black/40 p-4 rounded-2xl overflow-y-auto space-y-3 border border-white/20">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                    m.role === "user"
                      ? "bg-orange-500 text-white"
                      : "bg-white/10 text-gray-100"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && <p className="text-xs text-gray-400">AI is thinking…</p>}
          </div>

          <div className="mt-4 flex gap-2 border-t border-white/20 pt-4">
            <input
              className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/20"
              placeholder="Tell me what to do..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="px-4 py-2 bg-orange-500 rounded-xl hover:bg-orange-600 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
