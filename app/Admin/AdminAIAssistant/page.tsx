"use client";

import { useState } from "react";
import Image from "next/image";
import AdminSidebar from "@/components/AdminSidebar";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type AiResponse = {
  replyText: string;
  intent: "appointment" | "inventory" | "employee" | "customer" | "general";
  operation: "create" | "update" | "delete" | "none";
  missingFields: string[];
  appointmentData?: any;
  employeeData?: any;
  inventoryData?: any;
  customerData?: any;
};

export default function AdminAIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm the Trackside AI assistant. I can manage employees, customers, inventory, appointments, or help diagnose light car issues. Tell me what you want to do.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const confirmWords = ["yes", "ok", "okay", "sure", "go ahead", "do it", "confirm"];

  function isConfirmationMessage(text: string) {
    const lower = text.toLowerCase();
    return confirmWords.some((w) => lower === w || lower.includes(w));
  }

  /* ---------------------------------------------------------
     EMPLOYEES
  --------------------------------------------------------- */
  async function applyEmployeeAction(ai: AiResponse) {
    const data = ai.employeeData;
    if (!data) return;

    if (ai.operation === "create") {
      await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    if (ai.operation === "update") {
      let id = data.id;

      if (!id && data.email) {
        const list = await (await fetch("/api/employees")).json();
        id = list.find((e: any) => e.email === data.email)?.id;
      }

      if (!id) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I couldn't find the employee. Please give me their email or ID.",
          },
        ]);
        return;
      }

      await fetch("/api/employees", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, id }),
      });
    }

    if (ai.operation === "delete") {
      let id = data.id;

      if (!id && data.email) {
        const list = await (await fetch("/api/employees")).json();
        id = list.find((e: any) => e.email === data.email)?.id;
      }

      if (!id) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I couldn't find the employee to delete. Provide email or ID.",
          },
        ]);
        return;
      }

      await fetch("/api/employees", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    }
  }

  /* ---------------------------------------------------------
     INVENTORY
  --------------------------------------------------------- */
  async function applyInventoryAction(ai: AiResponse) {
    const data = ai.inventoryData;
    if (!data) return;

    if (ai.operation === "create") {
      await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    if (ai.operation === "update") {
      let id = data.id;

      if (!id && data.partNumber) {
        const list = await (await fetch("/api/inventory")).json();
        id = list.find((p: any) => p.partNumber === data.partNumber)?.id;
      }

      if (!id) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I couldn't find this part. Provide ID or part number.",
          },
        ]);
        return;
      }

      await fetch("/api/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, id }),
      });
    }

    if (ai.operation === "delete") {
      let id = data.id;

      if (!id && data.partNumber) {
        const list = await (await fetch("/api/inventory")).json();
        id = list.find((p: any) => p.partNumber === data.partNumber)?.id;
      }

      if (!id) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Couldn't find the part to delete." },
        ]);
        return;
      }

      await fetch("/api/inventory", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    }
  }

  /* ---------------------------------------------------------
     CUSTOMERS
  --------------------------------------------------------- */
  async function applyCustomerAction(ai: AiResponse) {
    const data = ai.customerData;
    if (!data) return;

    if (ai.operation === "create" || ai.operation === "update") {
      await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    if (ai.operation === "delete") {
      let id = data.id;

      if (!id && data.email) {
        const customer = await (await fetch(`/api/customers?email=${data.email}`)).json();
        id = customer?.id;
      }

      if (!id) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Couldn't find customer to delete." },
        ]);
        return;
      }

      await fetch(`/api/customers/${id}`, { method: "DELETE" });
    }
  }

  /* ---------------------------------------------------------
     APPOINTMENTS
  --------------------------------------------------------- */
  async function applyAppointmentAction(ai: AiResponse) {
    const data = ai.appointmentData;
    if (!data) return;

    if (ai.operation === "create") {
      await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    const resolveId = async () => {
      if (data.id) return data.id;

      if (data.appointment_date && data.appointment_time) {
        const list = await (
          await fetch(`/api/appointments?date=${data.appointment_date}`)
        ).json();
        return list.find((a: any) => a.appointment_time === data.appointment_time)?.id;
      }

      return null;
    };

    if (ai.operation === "update") {
      const id = await resolveId();
      if (!id) return;

      await fetch("/api/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, id }),
      });
    }

    if (ai.operation === "delete") {
      const id = await resolveId();
      if (!id) return;

      await fetch("/api/appointments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    }
  }

  /* ---------------------------------------------------------
     MAIN SEND HANDLER (NOW WITH FULL CHAT HISTORY)
  --------------------------------------------------------- */
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userContent = input.trim();
    const userMsg: ChatMessage = { role: "user", content: userContent };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userContent,
          history: messages, // 🔥 SEND FULL CHAT HISTORY
        }),
      });

      const ai: AiResponse = await res.json();

      const isConfirm = isConfirmationMessage(userContent);

      const allowAction =
        ai.intent !== "general" &&
        ai.operation !== "none" &&
        ai.missingFields.length === 0 &&
        isConfirm;

      if (allowAction) {
        if (ai.intent === "employee") await applyEmployeeAction(ai);
        if (ai.intent === "inventory") await applyInventoryAction(ai);
        if (ai.intent === "customer") await applyCustomerAction(ai);
        if (ai.intent === "appointment") await applyAppointmentAction(ai);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            ai.replyText ||
            (allowAction ? "Done — I've updated the system." : "I processed your request."),
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "AI error — please try again." },
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
          <h1 className="text-4xl font-bold text-orange-400 mb-4">Trackside AI Assistant</h1>

          <div className="flex-1 bg-black/40 p-4 rounded-2xl overflow-y-auto space-y-3 border border-white/20">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
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
