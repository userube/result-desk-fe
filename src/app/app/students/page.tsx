"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiGet, apiPatch, apiPost } from "@/lib/api";
import { BookOpenCheck, FileText, Phone, Search, Upload, UserPlus, Users } from "lucide-react";

type Klass = { id: string; name: string };
type Student = { id: string; firstName: string; lastName: string; admissionNumber: string; gender: string; status: string; classId?: string; class?: Klass; guardian?: { name: string; phone?: string; email?: string } | null; scores?: unknown[] };
type SetupState = { classes: Klass[] };

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Klass[]>([]);
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [selectedId, setSelectedId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadData() {
    const [studentData, setup] = await Promise.all([apiGet<Student[]>("/students"), apiGet<SetupState>("/schools/setup-state")]);
    setStudents(studentData);
    setClasses(setup.classes);
    setSelectedId((current) => current || studentData[0]?.id || "");
  }

  useEffect(() => { loadData().catch((err) => setError(err.message)); }, []);

  const filtered = useMemo(() => students.filter((student) => {
    const matchesSearch = `${student.firstName} ${student.lastName} ${student.admissionNumber}`.toLowerCase().includes(query.toLowerCase());
    const matchesClass = classFilter === "all" || student.class?.id === classFilter || student.classId === classFilter;
    return matchesSearch && matchesClass;
  }), [students, query, classFilter]);
  const selected = students.find((student) => student.id === selectedId) ?? filtered[0] ?? students[0];

  async function addStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const student = await apiPost<Student, Record<string, string>>("/students", {
      firstName: String(form.get("firstName") ?? ""),
      lastName: String(form.get("lastName") ?? ""),
      admissionNumber: String(form.get("admissionNumber") ?? ""),
      classId: String(form.get("classId") ?? classes[0]?.id ?? ""),
      gender: String(form.get("gender") ?? "Female"),
      dateOfBirth: String(form.get("dateOfBirth") ?? ""),
      parentName: String(form.get("parentName") ?? ""),
      parentPhone: String(form.get("parentPhone") ?? ""),
      parentEmail: String(form.get("parentEmail") ?? "")
    });
    setNotice(`${student.firstName} ${student.lastName} has been added to ${student.class?.name ?? "class"}.`);
    setSelectedId(student.id);
    event.currentTarget.reset();
    await loadData();
  }

  async function assignClass(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const form = new FormData(event.currentTarget);
    const updated = await apiPatch<Student, { classId: string }>(`/students/${selected.id}/class`, { classId: String(form.get("classId") ?? "") });
    setNotice(`${updated.firstName} ${updated.lastName} moved to ${updated.class?.name ?? "the selected class"}.`);
    await loadData();
  }

  async function updateStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const form = new FormData(event.currentTarget);
    const updated = await apiPatch<Student, Record<string, string>>(`/students/${selected.id}`, {
      firstName: String(form.get("firstName") ?? ""),
      lastName: String(form.get("lastName") ?? ""),
      admissionNumber: String(form.get("admissionNumber") ?? ""),
      gender: String(form.get("gender") ?? ""),
      status: String(form.get("status") ?? "active"),
      parentName: String(form.get("parentName") ?? ""),
      parentPhone: String(form.get("parentPhone") ?? ""),
      parentEmail: String(form.get("parentEmail") ?? "")
    });
    setNotice(`${updated.firstName} ${updated.lastName} updated.`);
    await loadData();
  }

  async function importCsv(file?: File) {
    if (!file || !classes[0]) return;
    const text = await file.text();
    const rows = text.split(/\r?\n/).map((row) => row.trim()).filter(Boolean);
    const dataRows = rows[0]?.toLowerCase().includes("first") ? rows.slice(1) : rows;
    let imported = 0;
    for (const row of dataRows) {
      const [firstName, lastName, admissionNumber, gender = "Female", parentName = "", parentPhone = "", parentEmail = "", className = ""] = row.split(",").map((item) => item.trim());
      if (!firstName || !lastName || !admissionNumber) continue;
      const klass = classes.find((item) => item.name.toLowerCase() === className.toLowerCase()) ?? classes[0];
      await apiPost("/students", { firstName, lastName, admissionNumber, gender, parentName, parentPhone, parentEmail, classId: klass.id });
      imported += 1;
    }
    setNotice(`${imported} students imported.`);
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
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-brand/20 bg-white px-5 text-sm font-semibold text-brand-text hover:bg-brand-soft">
            <Upload size={16} /> Import CSV
            <input className="hidden" type="file" accept=".csv,text/csv" onChange={(event) => importCsv(event.target.files?.[0])} />
          </label>
          <Button><UserPlus size={16} /> Add student</Button>
        </div>
      </div>
      {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {notice && <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <Stat label="Students" value={students.length} />
        <Stat label="Classes represented" value={new Set(students.map((student) => student.class?.id).filter(Boolean)).size} />
        <Stat label="Active records" value={students.filter((student) => student.status === "active").length} />
        <Stat label="Guardians added" value={students.filter((student) => student.guardian).length} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.75fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="gap-4 md:flex md:flex-row md:items-center md:justify-between">
            <div><CardTitle>Student records</CardTitle><p className="mt-1 text-sm text-slate-500">{filtered.length} visible records</p></div>
            <div className="grid gap-2 sm:grid-cols-[1fr_180px]">
              <div className="flex h-10 items-center rounded-xl border border-slate-200 bg-white px-3">
                <Search size={16} className="mr-2 text-slate-400" /><Input className="h-8 w-full border-0 px-0 focus:ring-0" onChange={(event) => setQuery(event.target.value)} placeholder="Search student" />
              </div>
              <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm" onChange={(event) => setClassFilter(event.target.value)} value={classFilter}>
                <option value="all">All classes</option>
                {classes.map((klass) => <option value={klass.id} key={klass.id}>{klass.name}</option>)}
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="hidden grid-cols-[1.25fr_0.9fr_0.75fr_1fr_0.9fr] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
                <span>Student</span><span>Admission no.</span><span>Class</span><span>Guardian</span><span>Status</span>
              </div>
              {filtered.map((student) => (
                <button className={`grid w-full gap-3 border-t border-slate-100 px-4 py-4 text-left text-sm transition hover:bg-brand-soft/45 md:grid-cols-[1.25fr_0.9fr_0.75fr_1fr_0.9fr] md:items-center md:gap-4 ${selected?.id === student.id ? "bg-brand-soft/70" : ""}`} key={student.id} onClick={() => setSelectedId(student.id)} type="button">
                  <div><p className="font-semibold">{student.firstName} {student.lastName}</p><p className="mt-1 text-xs text-slate-500 md:hidden">{student.admissionNumber} • {student.class?.name}</p></div>
                  <span className="hidden text-slate-600 md:block">{student.admissionNumber}</span>
                  <span className="hidden text-slate-600 md:block">{student.class?.name ?? "Unassigned"}</span>
                  <span className="hidden text-slate-600 md:block">{student.guardian?.name ?? "No guardian"}</span>
                  <Badge>{student.status}</Badge>
                </button>
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
                <p className="flex items-center gap-2 rounded-xl bg-white/10 p-3"><BookOpenCheck size={16} className="text-[#e2dbb5]" /> {selected?.scores?.length ?? 0} score records linked</p>
                <p className="flex items-center gap-2 rounded-xl bg-white/10 p-3"><FileText size={16} className="text-[#e2dbb5]" /> Weekly notes linked</p>
              </div>
              {selected && (
                <>
                  <form className="mt-5 grid gap-2" onSubmit={assignClass}>
                    <Label className="text-white/80">Assign to class</Label>
                    <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                      <select className="h-10 rounded-xl border border-white/10 bg-white/10 px-3 text-sm text-white" defaultValue={selected.class?.id} name="classId" required>
                        {classes.map((klass) => <option className="text-brand-text" value={klass.id} key={klass.id}>{klass.name}</option>)}
                      </select>
                      <Button className="bg-white text-brand-dark hover:bg-white/90">Move</Button>
                    </div>
                  </form>
                  <Button asChild className="mt-3 w-full bg-white text-brand-dark hover:bg-white/90" variant="outline"><Link href={`/app/students/${selected.id}`}>Open student history</Link></Button>
                </>
              )}
            </CardContent>
          </Card>

          {selected && (
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader><CardTitle>Edit selected student</CardTitle></CardHeader>
              <CardContent>
                <form className="grid gap-3" onSubmit={updateStudent}>
                  <div className="grid gap-2"><Label>First name</Label><Input name="firstName" defaultValue={selected.firstName} required /></div>
                  <div className="grid gap-2"><Label>Last name</Label><Input name="lastName" defaultValue={selected.lastName} required /></div>
                  <div className="grid gap-2"><Label>Admission number</Label><Input name="admissionNumber" defaultValue={selected.admissionNumber} required /></div>
                  <div className="grid gap-2"><Label>Gender</Label><Input name="gender" defaultValue={selected.gender} required /></div>
                  <div className="grid gap-2"><Label>Status</Label><Input name="status" defaultValue={selected.status} required /></div>
                  <div className="grid gap-2"><Label>Guardian name</Label><Input name="parentName" defaultValue={selected.guardian?.name ?? ""} /></div>
                  <div className="grid gap-2"><Label>Guardian phone</Label><Input name="parentPhone" defaultValue={selected.guardian?.phone ?? ""} /></div>
                  <div className="grid gap-2"><Label>Guardian email</Label><Input name="parentEmail" defaultValue={selected.guardian?.email ?? ""} type="email" /></div>
                  <Button>Save changes</Button>
                </form>
              </CardContent>
            </Card>
          )}

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader><CardTitle>Quick add</CardTitle></CardHeader>
            <CardContent>
              <form className="grid gap-3" onSubmit={addStudent}>
                <div className="grid gap-2"><Label>First name</Label><Input name="firstName" required /></div>
                <div className="grid gap-2"><Label>Last name</Label><Input name="lastName" required /></div>
                <div className="grid gap-2"><Label>Admission number</Label><Input name="admissionNumber" required /></div>
                <div className="grid gap-2"><Label>Date of birth</Label><Input name="dateOfBirth" type="date" /></div>
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
                <div className="grid gap-2"><Label>Guardian email</Label><Input name="parentEmail" type="email" /></div>
                <Button>Add student record</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="flex items-center justify-between p-4">
        <div><p className="text-2xl font-bold">{value}</p><p className="mt-1 text-sm text-slate-500">{label}</p></div>
        <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand"><Users size={18} /></span>
      </CardContent>
    </Card>
  );
}
