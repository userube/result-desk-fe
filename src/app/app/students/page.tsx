"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiGet, apiPost } from "@/lib/api";
import { BookOpenCheck, FileText, Phone, Search, Upload, UserPlus } from "lucide-react";

type Klass = { id: string; name: string };
type Student = { id: string; firstName: string; lastName: string; admissionNumber: string; gender: string; status: string; class?: Klass; guardian?: { name: string; phone?: string } | null };
type SetupState = { classes: Klass[] };

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Klass[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    const [studentData, setup] = await Promise.all([apiGet<Student[]>("/schools/students"), apiGet<SetupState>("/schools/setup-state")]);
    setStudents(studentData);
    setClasses(setup.classes);
  }

  useEffect(() => { loadData().catch((err) => setError(err.message)); }, []);

  const filtered = useMemo(() => students.filter((student) => `${student.firstName} ${student.lastName} ${student.admissionNumber}`.toLowerCase().includes(query.toLowerCase())), [students, query]);
  const selected = filtered[0] ?? students[0];

  async function addStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await apiPost("/schools/students", {
      firstName: String(form.get("firstName") ?? ""),
      lastName: String(form.get("lastName") ?? ""),
      admissionNumber: String(form.get("admissionNumber") ?? ""),
      classId: String(form.get("classId") ?? classes[0]?.id ?? ""),
      gender: String(form.get("gender") ?? "Female"),
      parentName: String(form.get("parentName") ?? ""),
      parentPhone: String(form.get("parentPhone") ?? "")
    });
    event.currentTarget.reset();
    await loadData();
  }

  return (
    <AppShell>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Student management</p>
          <h2 className="mt-2 text-2xl font-bold md:text-3xl">Every result starts with clean student records.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Records are loaded from the backend and isolated by the logged-in school tenant.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row"><Button variant="outline" className="bg-white"><Upload size={16} /> Import CSV</Button><Button><UserPlus size={16} /> Add student</Button></div>
      </div>
      {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.75fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="gap-4 md:flex md:flex-row md:items-center md:justify-between">
            <div><CardTitle>Student records</CardTitle><p className="mt-1 text-sm text-slate-500">{filtered.length} visible records</p></div>
            <div className="flex h-10 items-center rounded-xl border border-slate-200 bg-white px-3">
              <Search size={16} className="mr-2 text-slate-400" /><Input className="h-8 w-40 border-0 px-0 focus:ring-0 md:w-56" onChange={(event) => setQuery(event.target.value)} placeholder="Search student" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="hidden grid-cols-[1.25fr_0.9fr_0.75fr_1fr_0.9fr] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
                <span>Student</span><span>Admission no.</span><span>Class</span><span>Guardian</span><span>Status</span>
              </div>
              {filtered.map((student) => (
                <div className="grid gap-3 border-t border-slate-100 px-4 py-4 text-sm md:grid-cols-[1.25fr_0.9fr_0.75fr_1fr_0.9fr] md:items-center md:gap-4" key={student.id}>
                  <div><p className="font-semibold">{student.firstName} {student.lastName}</p><p className="mt-1 text-xs text-slate-500 md:hidden">{student.admissionNumber} • {student.class?.name}</p></div>
                  <span className="hidden text-slate-600 md:block">{student.admissionNumber}</span>
                  <span className="hidden text-slate-600 md:block">{student.class?.name ?? "Unassigned"}</span>
                  <span className="hidden text-slate-600 md:block">{student.guardian?.name ?? "No guardian"}</span>
                  <Badge>{student.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="border-slate-200 bg-[#063d35] text-white shadow-sm">
            <CardHeader><CardTitle className="text-white">Selected profile</CardTitle><p className="text-sm text-white/70">Live student profile preview.</p></CardHeader>
            <CardContent>
              <div className="grid size-14 place-items-center rounded-2xl bg-white text-xl font-bold text-brand-dark">{selected ? `${selected.firstName[0]}${selected.lastName[0]}` : "--"}</div>
              <h3 className="mt-4 text-2xl font-bold">{selected ? `${selected.firstName} ${selected.lastName}` : "No student yet"}</h3>
              <p className="mt-1 text-sm text-white/65">{selected?.admissionNumber} • {selected?.class?.name}</p>
              <div className="mt-5 grid gap-3 text-sm">
                <p className="flex items-center gap-2 rounded-xl bg-white/10 p-3"><Phone size={16} className="text-[#e2dbb5]" /> {selected?.guardian?.name ?? "No guardian"} · {selected?.guardian?.phone ?? "No phone"}</p>
                <p className="flex items-center gap-2 rounded-xl bg-white/10 p-3"><BookOpenCheck size={16} className="text-[#e2dbb5]" /> Result history ready</p>
                <p className="flex items-center gap-2 rounded-xl bg-white/10 p-3"><FileText size={16} className="text-[#e2dbb5]" /> Weekly notes linked</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader><CardTitle>Quick add</CardTitle></CardHeader>
            <CardContent>
              <form className="grid gap-3" onSubmit={addStudent}>
                <div className="grid gap-2"><Label>First name</Label><Input name="firstName" required /></div>
                <div className="grid gap-2"><Label>Last name</Label><Input name="lastName" required /></div>
                <div className="grid gap-2"><Label>Admission number</Label><Input name="admissionNumber" required /></div>
                <div className="grid gap-2">
                  <Label>Gender</Label>
                  <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm shadow-sm" name="gender" required>
                    <option>Female</option>
                    <option>Male</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Class</Label>
                  <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm shadow-sm" name="classId" required>
                    {classes.map((klass) => <option value={klass.id} key={klass.id}>{klass.name}</option>)}
                  </select>
                </div>
                <div className="grid gap-2"><Label>Guardian name</Label><Input name="parentName" /></div>
                <div className="grid gap-2"><Label>Guardian phone</Label><Input name="parentPhone" /></div>
                <Button>Add student record</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
