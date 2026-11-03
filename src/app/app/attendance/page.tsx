"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { apiGet, apiPost, getAuthUser, hasAnyRole } from "@/lib/api";

type Klass = { id: string; name: string };
type Term = { id: string; name: string; isCurrent: boolean };
type Student = { id: string; firstName: string; lastName: string; admissionNumber: string; present: boolean | null };
type TeacherMe = { classes: Array<{ class: Klass }> };

export default function AttendancePage() {
  const [classes, setClasses] = useState<Klass[]>([]);
  const [term, setTerm] = useState<Term | null>(null);
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState(() => new Date().toLocaleDateString("en-CA"));
  const [students, setStudents] = useState<Student[]>([]);
  const [marked, setMarked] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([apiGet<Klass[]>("/schools/classes"), apiGet<Term[]>("/terms"), apiGet<TeacherMe>("/teachers/me")]).then(([allClasses, terms, me]) => {
      const roles = getAuthUser()?.roles ?? [];
      const visible = hasAnyRole(roles, ["SCHOOL_OWNER", "SCHOOL_ADMIN", "HEAD_TEACHER"]) ? allClasses : me.classes.map((item) => item.class);
      setClasses(visible); setClassId(visible[0]?.id ?? ""); setTerm(terms.find((item) => item.isCurrent) ?? null);
    }).catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!term || !classId || !date) return;
    apiGet<{ day: unknown; students: Student[] }>(`/academic/attendance?classId=${encodeURIComponent(classId)}&termId=${encodeURIComponent(term.id)}&date=${encodeURIComponent(date)}`)
      .then((data) => { setStudents(data.students.map((student) => ({ ...student, present: student.present ?? true }))); setMarked(Boolean(data.day)); })
      .catch((err) => setError(err.message));
  }, [term, classId, date]);

  async function save() {
    if (!term || !classId) return;
    setError("");
    try {
      await apiPost("/academic/attendance", { classId, termId: term.id, date, records: students.map((student) => ({ studentId: student.id, present: student.present === true })) });
      setMarked(true); setMessage("Attendance saved.");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not save attendance"); }
  }

  return <AppShell>
    <h2 className="text-2xl font-bold">Attendance</h2>
    {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {message && <p className="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
    <div className="mt-6 flex flex-wrap gap-3">
      <select className="h-10 border border-slate-200 bg-white px-3" value={classId} onChange={(event) => setClassId(event.target.value)} aria-label="Class">{classes.map((klass) => <option value={klass.id} key={klass.id}>{klass.name}</option>)}</select>
      <input className="h-10 border border-slate-200 bg-white px-3" type="date" value={date} onChange={(event) => setDate(event.target.value)} aria-label="Date" />
      <span className="self-center text-sm text-slate-500">{term?.name ?? "No current term"}{marked ? " · Saved" : ""}</span>
    </div>
    <div className="mt-6 max-w-3xl divide-y border-y border-slate-200">
      {!students.length && <p className="py-5 text-sm text-slate-500">No students enrolled in this class for the current term.</p>}
      {students.map((student) => <label className="flex items-center justify-between gap-3 py-3" key={student.id}>
        <span><strong>{student.firstName} {student.lastName}</strong><span className="ml-2 text-sm text-slate-500">{student.admissionNumber}</span></span>
        <span className="flex items-center gap-2 text-sm"><input type="checkbox" checked={student.present === true} onChange={(event) => setStudents((current) => current.map((item) => item.id === student.id ? { ...item, present: event.target.checked } : item))} /> Present</span>
      </label>)}
    </div>
    <Button className="mt-5" disabled={!students.length || !term} onClick={save}>Save attendance</Button>
  </AppShell>;
}
