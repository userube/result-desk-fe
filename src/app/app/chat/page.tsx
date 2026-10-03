"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiGet, apiPost } from "@/lib/api";
import { MessageSquareText, Plus, Send } from "lucide-react";

type Person = { id: string; firstName: string; lastName: string; email: string };
type ChatMessage = { id: string; body: string; createdAt: string; sender: Person };
type ChatRoom = {
  id: string;
  name: string;
  purpose?: string | null;
  messages?: ChatMessage[];
};

export default function TeacherChatPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function loadRooms() {
    const roomData = await apiGet<ChatRoom[]>("/chat/rooms");
    setRooms(roomData);
    setSelectedRoomId((current) => current || roomData[0]?.id || "");
  }

  async function loadMessages(roomId: string) {
    if (!roomId) return;
    setMessages(await apiGet<ChatMessage[]>(`/chat/rooms/${roomId}/messages`));
  }

  useEffect(() => {
    loadRooms().catch((err) => setError(err instanceof Error ? err.message : "Unable to load chat rooms."));
  }, []);

  useEffect(() => {
    loadMessages(selectedRoomId).catch((err) => setError(err instanceof Error ? err.message : "Unable to load messages."));
  }, [selectedRoomId]);

  const selectedRoom = useMemo(() => rooms.find((room) => room.id === selectedRoomId), [rooms, selectedRoomId]);

  async function createRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const room = await apiPost<ChatRoom, { name: string; purpose: string }>("/chat/rooms", {
      name: String(form.get("name") ?? ""),
      purpose: String(form.get("purpose") ?? "")
    });
    setNotice(`${room.name} group created.`);
    setSelectedRoomId(room.id);
    event.currentTarget.reset();
    await loadRooms();
  }

  async function startDirectChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const room = await apiPost<ChatRoom, { email: string }>("/chat/direct", { email: String(form.get("email") ?? "") });
    setNotice(`Direct chat ready: ${room.name}`);
    setSelectedRoomId(room.id);
    event.currentTarget.reset();
    await loadRooms();
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedRoomId) return;
    const form = new FormData(event.currentTarget);
    await apiPost<ChatMessage, { body: string }>(`/chat/rooms/${selectedRoomId}/messages`, {
      body: String(form.get("body") ?? "")
    });
    event.currentTarget.reset();
    await Promise.all([loadMessages(selectedRoomId), loadRooms()]);
  }

  return (
    <AppShell>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Teacher communication</p>
          <h2 className="mt-2 text-2xl font-bold md:text-3xl">In-app chat for teachers and school teams.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Create focused groups like Blink, Primary Teachers, or Exam Week and keep quick school communication inside Ewune.</p>
        </div>
      </div>

      {notice && <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
      {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="grid gap-6">
          <Card>
            <CardHeader><CardTitle>Message a teacher</CardTitle></CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={startDirectChat}>
                <div className="grid gap-2"><Label>Teacher email</Label><Input name="email" placeholder="teacher@yourschool.com" type="email" required /></div>
                <Button><MessageSquareText size={16} /> Start direct chat</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Create group</CardTitle></CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={createRoom}>
                <div className="grid gap-2"><Label>Group name</Label><Input name="name" placeholder="Blink" required /></div>
                <div className="grid gap-2"><Label>Purpose</Label><Input name="purpose" placeholder="Fast daily teacher updates" /></div>
                <Button><Plus size={16} /> Create group</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Groups</CardTitle></CardHeader>
            <CardContent className="grid gap-2">
              {rooms.map((room) => {
                const latest = room.messages?.[0];
                return (
                  <button className={`rounded-xl border p-4 text-left transition ${selectedRoomId === room.id ? "border-brand bg-brand-soft" : "border-slate-200 bg-white hover:bg-slate-50"}`} key={room.id} onClick={() => setSelectedRoomId(room.id)} type="button">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{room.name}</p>
                      <Badge>{latest ? "active" : "new"}</Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{latest?.body ?? room.purpose ?? "No messages yet"}</p>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <Card className="min-h-[640px] border-slate-200 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand"><MessageSquareText size={20} /></span>
              <div>
                <CardTitle>{selectedRoom?.name ?? "Teacher Chat"}</CardTitle>
                <p className="mt-1 text-sm text-slate-500">{selectedRoom?.purpose ?? "Choose a group to start messaging."}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid min-h-[560px] grid-rows-[1fr_auto] gap-4 p-4">
            <div className="grid content-start gap-3 overflow-hidden rounded-xl bg-slate-50 p-3">
              {messages.length === 0 && <p className="rounded-xl bg-white p-4 text-sm text-slate-500">No messages yet. Start the conversation.</p>}
              {messages.map((message) => (
                <article className="max-w-2xl rounded-xl bg-white p-4 shadow-sm" key={message.id}>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{message.sender.firstName} {message.sender.lastName}</p>
                    <span className="text-xs text-slate-400">{new Date(message.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{message.body}</p>
                </article>
              ))}
            </div>

            <form className="grid gap-3" onSubmit={sendMessage}>
              <Textarea className="min-h-24" name="body" placeholder="Type a message for this group..." required />
              <div className="flex justify-end"><Button disabled={!selectedRoomId}><Send size={16} /> Send message</Button></div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
