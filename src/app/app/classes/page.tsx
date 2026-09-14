"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiGet, apiPost } from "@/lib/api";

type Klass = { id: string; name: string; students?: unknown[]; teacherAssignments?: unknown[]; program?: { name: string } | null };

export default function ClassesPage() {
  const [classes, setClasses] = useState<Klass[]>([]);

  async function loadClasses() {
    setClasses(await apiGet<Klass[]>("/schools/classes"));
  }

  useEffect(() => { loadClasses(); }, []);

  async function addClass(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await apiPost("/schools/classes", { name: String(form.get("name") ?? "") });
    event.currentTarget.reset();
    await loadClasses();
  }

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card><CardHeader><CardTitle>Add class</CardTitle></CardHeader><CardContent><form className="grid gap-3" onSubmit={addClass}><Input name="name" placeholder="Primary 2" required /><Button>Add class</Button></form></CardContent></Card>
        <Card><CardHeader><CardTitle>Classes</CardTitle></CardHeader><CardContent className="grid gap-3">{classes.map((klass)=><div className="rounded-md border border-slate-200 p-4" key={klass.id}><p className="font-medium">{klass.name}</p><p className="mt-1 text-sm text-slate-500">{klass.students?.length ?? 0} students · {klass.program?.name ?? "No program"}</p></div>)}</CardContent></Card>
      </div>
    </AppShell>
  );
}
