"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";

type Program = { id: string; name: string; type: string; status: string; startDate: string; endDate: string; classes?: Array<{ name: string }> };
const programTypes = ["academic_term", "holiday_coaching", "summer_school", "exam_prep", "after_school", "weekend_class", "custom"];
const statuses = ["draft", "active", "completed", "archived"];

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
    setMessage("Program created.");
    event.currentTarget.reset();
    await loadPrograms();
  }

  async function updateProgram(event: FormEvent<HTMLFormElement>, programId: string) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await apiPatch(`/programs/${programId}`, {
      name: String(form.get("name") ?? ""),
      type: String(form.get("type") ?? "custom"),
      startDate: String(form.get("startDate") ?? ""),
      endDate: String(form.get("endDate") ?? "")
    });
    setMessage("Program updated.");
    await loadPrograms();
  }

  async function updateStatus(programId: string, status: string) {
    await apiPatch(`/programs/${programId}/status`, { status });
    setMessage(`Program marked ${status}.`);
    await loadPrograms();
  }

  async function deleteProgram(programId: string) {
    try {
      await apiDelete(`/programs/${programId}`);
      setMessage("Program deleted.");
      await loadPrograms();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete program.");
    }
  }

  return (
    <AppShell>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Programs</h2>
        <p className="mt-1 text-sm text-slate-600">Live programs from the backend: normal terms, holiday coaching, exam prep, and custom groups.</p>
      </div>
      {message && <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
      {error && <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader><CardTitle>Create program</CardTitle></CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={createProgram}>
              <div className="grid gap-2"><Label>Name</Label><Input name="name" placeholder="First Term" required /></div>
              <div className="grid gap-2">
                <Label>Type</Label>
                <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" name="type" defaultValue="academic_term" required>
                  {programTypes.map((type) => <option value={type} key={type}>{type.replaceAll("_", " ")}</option>)}
                </select>
              </div>
              <div className="grid gap-2"><Label>Start date</Label><Input name="startDate" type="date" required /></div>
              <div className="grid gap-2"><Label>End date</Label><Input name="endDate" type="date" required /></div>
              <Button>Create program</Button>
            </form>
          </CardContent>
        </Card>
        <div className="grid gap-4">
          {!programs.length && <Card><CardContent className="p-6 text-sm text-slate-500">No programs yet. Create a term or coaching program to organize classes, reports, and results.</CardContent></Card>}
          {programs.map((program) => (
            <Card key={program.id}>
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div><CardTitle>{program.name}</CardTitle><p className="mt-1 text-sm text-slate-500">{program.type}</p></div>
                <Badge className={program.status === "draft" ? "bg-amber-50 text-amber-700" : undefined}>{program.status}</Badge>
              </CardHeader>
              <CardContent className="grid gap-4">
                <p className="text-sm text-slate-600">{program.classes?.map((item) => item.name).join(", ") || "No classes attached yet"}</p>
                <form className="grid gap-3 md:grid-cols-[1fr_180px_150px_150px_auto]" onSubmit={(event) => updateProgram(event, program.id)}>
                  <Input name="name" defaultValue={program.name} required />
                  <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" name="type" defaultValue={program.type} required>
                    {programTypes.map((type) => <option value={type} key={type}>{type.replaceAll("_", " ")}</option>)}
                  </select>
                  <Input name="startDate" type="date" defaultValue={program.startDate.slice(0, 10)} required />
                  <Input name="endDate" type="date" defaultValue={program.endDate.slice(0, 10)} required />
                  <Button variant="outline">Save</Button>
                </form>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => <Button size="sm" variant="outline" key={status} onClick={() => updateStatus(program.id, status)}>{status}</Button>)}
                  <Button size="sm" variant="outline" onClick={() => deleteProgram(program.id)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
