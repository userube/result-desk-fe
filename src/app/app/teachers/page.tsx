"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";

type Teacher = { id: string; email: string; firstName: string; lastName: string; isActive?: boolean; roles: Array<{ role: string }> };
type Klass = { id: string; name: string };
type Subject = { id: string; name: string };
type Assignments = { classes: Array<{ id: string; teacherId: string; class: Klass }>; subjects: Array<{ id: string; teacherId: string; subject: Subject }> };

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Klass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<Assignments>({ classes: [], subjects: [] });
  const [inviteLink, setInviteLink] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    const [teacherData, classData, subjectData, assignmentData] = await Promise.all([
      apiGet<Teacher[]>("/schools/teachers"),
      apiGet<Klass[]>("/schools/classes"),
      apiGet<Subject[]>("/schools/subjects"),
      apiGet<Assignments>("/teachers/assignments")
    ]);
    setTeachers(teacherData);
    setClasses(classData);
    setSubjects(subjectData);
    setAssignments(assignmentData);
  }

  useEffect(() => { loadData().catch((err) => setError(err.message)); }, []);

  async function createTeacher(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    await apiPost("/teachers", {
      email: String(form.get("email") ?? ""),
      firstName: String(form.get("firstName") ?? ""),
      lastName: String(form.get("lastName") ?? ""),
      role: String(form.get("role") ?? "CLASS_TEACHER"),
      password: String(form.get("password") ?? "") || undefined
    });
    setMessage("Teacher created.");
    event.currentTarget.reset();
    await loadData();
  }

  async function inviteTeacher(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const invite = await apiPost<{ inviteLink: string }, { email: string; role: string }>("/invitations", {
      email: String(form.get("email") ?? ""),
      role: String(form.get("role") ?? "CLASS_TEACHER")
    });
    setInviteLink(invite.inviteLink);
    setMessage("Invitation sent.");
    event.currentTarget.reset();
  }

  async function updateTeacher(event: FormEvent<HTMLFormElement>, teacherId: string) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    await apiPatch(`/teachers/${teacherId}`, {
      firstName: String(form.get("firstName") ?? ""),
      lastName: String(form.get("lastName") ?? ""),
      email: String(form.get("email") ?? ""),
      role: String(form.get("role") ?? "CLASS_TEACHER"),
      isActive: form.get("isActive") === "active"
    });
    setMessage("Teacher updated.");
    await loadData();
  }

  async function assignClass(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await apiPost("/teachers/class-assignments", { teacherId: String(form.get("teacherId") ?? ""), classId: String(form.get("classId") ?? "") });
    setMessage("Class assignment saved.");
    await loadData();
  }

  async function assignSubject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await apiPost("/teachers/subject-assignments", { teacherId: String(form.get("teacherId") ?? ""), subjectId: String(form.get("subjectId") ?? "") });
    setMessage("Subject assignment saved.");
    await loadData();
  }

  async function removeAssignment(type: "class" | "subject", assignmentId: string) {
    setError("");
    await apiDelete(`/teachers/${type}-assignments/${assignmentId}`);
    setMessage("Assignment removed.");
    await loadData();
  }

  return (
    <AppShell>
      {message && <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
      {error && <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="grid gap-6">
          <Card>
            <CardHeader><CardTitle>Add teacher</CardTitle></CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={createTeacher}>
                <div className="grid gap-2"><Label>First name</Label><Input name="firstName" required /></div>
                <div className="grid gap-2"><Label>Last name</Label><Input name="lastName" required /></div>
                <div className="grid gap-2"><Label>Email</Label><Input name="email" type="email" required /></div>
                <RoleSelect />
                <div className="grid gap-2"><Label>Temporary password</Label><Input name="password" minLength={8} type="password" placeholder="Optional if using invite" /></div>
                <Button>Create teacher</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Invite teacher</CardTitle></CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={inviteTeacher}>
                <div className="grid gap-2"><Label>Email</Label><Input name="email" placeholder="teacher@school.com" required /></div>
                <div className="grid gap-2">
                  <Label>Role</Label>
                  <RoleSelect bare />
                </div>
                <Button>Send invitation</Button>
                {inviteLink && <p className="break-all rounded-xl bg-brand-soft p-3 text-xs text-brand-dark">{inviteLink}</p>}
              </form>
            </CardContent>
          </Card>

          <AssignmentForm title="Assign class" onSubmit={assignClass} teachers={teachers}>
            <SelectField label="Class" name="classId" items={classes} />
          </AssignmentForm>

          <AssignmentForm title="Assign subject" onSubmit={assignSubject} teachers={teachers}>
            <SelectField label="Subject" name="subjectId" items={subjects} />
          </AssignmentForm>
        </div>

        <Card>
          <CardHeader><CardTitle>Teachers and assignments</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {teachers.map((teacher) => {
              const classAssignments = assignments.classes.filter((item) => item.teacherId === teacher.id);
              const subjectAssignments = assignments.subjects.filter((item) => item.teacherId === teacher.id);
              return (
                <div className="rounded-md border border-slate-200 p-4" key={teacher.id}>
                  <form className="grid gap-3 md:grid-cols-[1fr_1fr_1.4fr_160px_120px_auto]" onSubmit={(event) => updateTeacher(event, teacher.id)}>
                    <Input name="firstName" defaultValue={teacher.firstName} required />
                    <Input name="lastName" defaultValue={teacher.lastName} required />
                    <Input name="email" defaultValue={teacher.email} type="email" required />
                    <RoleSelect defaultValue={teacher.roles[0]?.role ?? "CLASS_TEACHER"} bare />
                    <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" defaultValue={teacher.isActive === false ? "inactive" : "active"} name="isActive">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <Button variant="outline">Save</Button>
                  </form>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge>{teacher.roles[0]?.role ?? "USER"}</Badge>
                    <Badge className={teacher.isActive === false ? "bg-red-50 text-red-700" : undefined}>{teacher.isActive === false ? "inactive" : "active"}</Badge>
                  </div>
                  <div className="mt-3 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                    <div>
                      <p className="font-semibold text-brand-text">Classes</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {!classAssignments.length && <span>No class assigned</span>}
                        {classAssignments.map((item) => <button className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand" key={item.id} onClick={() => removeAssignment("class", item.id)} type="button">{item.class.name} ×</button>)}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-brand-text">Subjects</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {!subjectAssignments.length && <span>No subject assigned</span>}
                        {subjectAssignments.map((item) => <button className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand" key={item.id} onClick={() => removeAssignment("subject", item.id)} type="button">{item.subject.name} ×</button>)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function AssignmentForm({ title, children, teachers, onSubmit }: { title: string; children: React.ReactNode; teachers: Teacher[]; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <SelectField label="Teacher" name="teacherId" items={teachers.map((teacher) => ({ id: teacher.id, name: `${teacher.firstName} ${teacher.lastName}` }))} />
          {children}
          <Button variant="outline">Save assignment</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function SelectField({ label, name, items }: { label: string; name: string; items: Array<{ id: string; name: string }> }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" name={name} required>
        {items.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
      </select>
    </div>
  );
}

function RoleSelect({ defaultValue = "CLASS_TEACHER", bare = false }: { defaultValue?: string; bare?: boolean }) {
  const select = (
    <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" defaultValue={defaultValue} name="role">
      <option value="CLASS_TEACHER">Class teacher</option>
      <option value="SUBJECT_TEACHER">Subject teacher</option>
      <option value="HEAD_TEACHER">Head teacher</option>
      <option value="SCHOOL_ADMIN">School admin</option>
    </select>
  );
  if (bare) return select;
  return <div className="grid gap-2"><Label>Role</Label>{select}</div>;
}
