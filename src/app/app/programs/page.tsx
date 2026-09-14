"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiGet, apiPost } from "@/lib/api";

type Program = { id: string; name: string; type: string; status: string; startDate: string; endDate: string; classes?: Array<{ name: string }> };

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [error, setError] = useState("");

  async function loadPrograms() {
    setPrograms(await apiGet<Program[]>("/programs"));
  }

  useEffect(() => { loadPrograms().catch((err) => setError(err.message)); }, []);

  async function createProgram(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await apiPost("/programs", {
      name: String(form.get("name") ?? ""),
      type: String(form.get("type") ?? "custom"),
      startDate: String(form.get("startDate") ?? ""),
      endDate: String(form.get("endDate") ?? "")
    });
    event.currentTarget.reset();
    await loadPrograms();
  }

  return (
    <AppShell>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Programs</h2>
        <p className="mt-1 text-sm text-slate-600">Live programs from the backend: normal terms, holiday coaching, exam prep, and custom groups.</p>
      </div>
      {error && <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader><CardTitle>Create program</CardTitle></CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={createProgram}>
              <div className="grid gap-2"><Label>Name</Label><Input name="name" placeholder="Common Entrance Prep" required /></div>
              <div className="grid gap-2"><Label>Type</Label><Input name="type" placeholder="exam_prep" required /></div>
              <div className="grid gap-2"><Label>Start date</Label><Input name="startDate" type="date" required /></div>
              <div className="grid gap-2"><Label>End date</Label><Input name="endDate" type="date" required /></div>
              <Button>Create program</Button>
            </form>
          </CardContent>
        </Card>
        <div className="grid gap-4">
          {programs.map((program) => (
            <Card key={program.id}>
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div><CardTitle>{program.name}</CardTitle><p className="mt-1 text-sm text-slate-500">{program.type}</p></div>
                <Badge className={program.status === "draft" ? "bg-amber-50 text-amber-700" : undefined}>{program.status}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{program.classes?.map((item) => item.name).join(", ") || "No classes attached yet"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
