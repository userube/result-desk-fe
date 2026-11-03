"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiGet, apiPatch, apiPost } from "@/lib/api";

type Term = { id: string; name: string; isCurrent: boolean };
type Session = { id: string; name: string; isCurrent: boolean; terms: Term[] };
type Klass = { id: string; name: string };
type Student = { id: string; firstName: string; lastName: string; classId: string; class?: Klass };

export default function AcademicPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [classes, setClasses] = useState<Klass[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const currentTerm = sessions.flatMap((session) => session.terms).find((term) => term.isCurrent);

  async function load() {
    const [nextSessions, nextClasses, nextStudents] = await Promise.all([
      apiGet<Session[]>("/academic/sessions"), apiGet<Klass[]>("/schools/classes"), apiGet<Student[]>("/students")
    ]);
    setSessions(nextSessions); setClasses(nextClasses); setStudents(nextStudents);
  }

  useEffect(() => { load().catch((err) => setError(err.message)); }, []);

  async function action(work: () => Promise<unknown>, success: string) {
    setError("");
    try { await work(); await load(); setMessage(success); } catch (err) { setError(err instanceof Error ? err.message : "Action failed"); }
  }

  async function addSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    await action(() => apiPost("/academic/sessions", { name: String(data.get("name")), firstTerm: String(data.get("firstTerm")) }), "Session created. Activate its term when ready.");
    form.reset();
  }

  async function addTerm(event: FormEvent<HTMLFormElement>, sessionId: string) {
    event.preventDefault();
    const form = event.currentTarget;
    const name = String(new FormData(form).get("name"));
    await action(() => apiPost(`/academic/sessions/${sessionId}/terms`, { name }), "Term created.");
    form.reset();
  }

  return <AppShell>
    <h2 className="text-2xl font-bold">Academic year</h2>
    {message && <p className="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
    {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="mt-6 grid gap-8 xl:grid-cols-[1fr_320px]">
      <section>
        <h3 className="text-base font-semibold">Sessions and terms</h3>
        <div className="mt-3 divide-y border-y border-slate-200">
          {sessions.map((session) => <div className="py-4" key={session.id}>
            <p className="font-semibold">{session.name}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {session.terms.map((term) => <div className="flex items-center gap-2 border border-slate-200 px-3 py-2 text-sm" key={term.id}>
                <span>{term.name}{term.isCurrent ? " · Current" : ""}</span>
                {!term.isCurrent && <Button size="sm" variant="outline" onClick={() => action(() => apiPatch(`/academic/terms/${term.id}/activate`, {}), `${term.name} is now current.`)}>Activate</Button>}
              </div>)}
            </div>
            <form className="mt-3 flex max-w-md gap-2" onSubmit={(event) => addTerm(event, session.id)}><Input name="name" placeholder="New term name" required /><Button>Add term</Button></form>
          </div>)}
        </div>
        {currentTerm && <div className="mt-8">
          <h3 className="text-base font-semibold">Move a student in {currentTerm.name}</h3>
          <div className="mt-3 divide-y border-y border-slate-200">
            {students.map((student) => <div className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm" key={student.id}>
              <span>{student.firstName} {student.lastName} <span className="text-slate-500">· {student.class?.name}</span></span>
              <select className="h-10 border border-slate-200 bg-white px-2" value={student.classId} onChange={(event) => action(() => apiPatch(`/academic/terms/${currentTerm.id}/students/${student.id}/class`, { classId: event.target.value }), "Student moved.")}>
                {classes.map((klass) => <option key={klass.id} value={klass.id}>{klass.name}</option>)}
              </select>
            </div>)}
          </div>
        </div>}
      </section>
      <section>
        <h3 className="text-base font-semibold">New session</h3>
        <form className="mt-3 grid gap-3" onSubmit={addSession}>
          <Input name="name" placeholder="2027/2028" required />
          <Input name="firstTerm" placeholder="First Term" required />
          <Button>Create session</Button>
        </form>
      </section>
    </div>
  </AppShell>;
}
