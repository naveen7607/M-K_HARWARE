"use client";

import { useMemo, useState } from "react";
import { Bot, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { postJson } from "@/lib/api";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function AiChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi, I can help with product availability, recommendations, and inquiry questions."
    }
  ]);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const canSend = useMemo(() => value.trim().length > 1 && !loading, [value, loading]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSend) return;

    const message = value.trim();
    setValue("");
    setMessages((current) => [...current, { role: "user", content: message }]);
    setLoading(true);

    try {
      const response = await postJson<{ answer: string }>("/ai/chat", { message });
      setMessages((current) => [...current, { role: "assistant", content: response.data.answer }]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "Please call or WhatsApp the shop for the latest stock and price. I can still help you browse products."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="flex h-[520px] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Bot className="h-5 w-5" aria-hidden />
              AI Shop Assistant
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" aria-hidden />
            </Button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={
                  message.role === "user"
                    ? "ml-auto max-w-[82%] rounded-lg bg-secondary px-3 py-2 text-sm text-white"
                    : "max-w-[82%] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                }
              >
                {message.content}
              </div>
            ))}
            {loading ? (
              <div className="max-w-[82%] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                Checking...
              </div>
            ) : null}
          </div>

          <form onSubmit={submit} className="flex gap-2 border-t border-slate-200 p-3">
            <Input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Ask about products..." />
            <Button type="submit" size="icon" disabled={!canSend} aria-label="Send message">
              <Send className="h-4 w-4" aria-hidden />
            </Button>
          </form>
        </div>
      ) : (
        <Button className="h-14 rounded-full px-5 shadow-soft" variant="accent" onClick={() => setOpen(true)}>
          <Bot className="h-5 w-5" aria-hidden />
          Ask AI
        </Button>
      )}
    </div>
  );
}
