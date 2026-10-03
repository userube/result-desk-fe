"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";

type Klass = { id: string; name: string; students?: unknown[]; teacherAssignments?: unknown[]; program?: { name: string } | null };
type Program = { id: string; name: string };

export default function ClassesPage() {
  const [classes, setClasses] = useState<Klass[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadClasses() {
    const [classData, programData] = await Promise.all([
      apiGet<Klass[]>("/schools/classes"),
      apiGet<Program[]>("/programs")
    ]);
    setClasses(classData);
    setPrograms(programData);
  }

  useEffect(() => { loadClasses().catch((err) => setError(err.message)); }, []);

  async function addClass(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    await apiPost("/schools/classes", {
      name: String(form.get("name") ?? ""),
      programId: String(form.get("programId") ?? "") || undefined
    });
    setMessage("Class added.");
    event.currentTarget.reset();
    await loadClasses();
  }

  async function updateClass(event: FormEvent<HTMLFormElement>, classId: string) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    await apiPatch(`/schools/classes/${classId}`, {
      name: String(form.get("name") ?? ""),
      programId: String(form.get("programId") ?? "") || undefined
    });
    setMessage("Class updated.");
    await loadClasses();
  }

  async function deleteClass(classId: string) {
    setError("");
    try {
      await apiDelete(`/schools/classes/${classId}`);
      setMessage("Class deleted.");
      await loadClasses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete class.");
    }
  }

  return (
    <AppShell>
      {message && <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
      {error && <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardHeader><CardTitle>Add class</CardTitle></CardHeader>
          <CardContent>
            <form className="grid gap-3" onSubmit={addClass}>
              <div className="grid gap-2"><Label>Class name</Label><Input name="name" placeholder="Class name" required /></div>
              <div className="grid gap-2">
                <Label>Program</Label>
                <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" name="programId">
                  <option value="">No program</option>
                  {programs.map((program) => <option value={program.id} key={program.id}>{program.name}</option>)}
                </select>
              </div>
              <Button>Add class</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Classes</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {!classes.length && <p className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500">No classes yet. Add the first class to begin student enrollment.</p>}
            {classes.map((klass) => (
              <form className="grid gap-3 rounded-md border border-slate-200 p-4 md:grid-cols-[1fr_180px_auto_auto]" key={klass.id} onSubmit={(event) => updateClass(event, klass.id)}>
                <Input name="name" defaultValue={klass.name} required />
                <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" defaultValue={programs.find((program) => program.name === klass.program?.name)?.id ?? ""} name="programId">
                  <option value="">No program</option>
                  {programs.map((program) => <option value={program.id} key={program.id}>{program.name}</option>)}
                </select>
                <Button variant="outline">Save</Button>
                <Button type="button" variant="outline" onClick={() => deleteClass(klass.id)}>Delete</Button>
                <p className="text-sm text-slate-500 md:col-span-4">{klass.students?.length ?? 0} students · {klass.teacherAssignments?.length ?? 0} teacher assignments</p>
              </form>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
