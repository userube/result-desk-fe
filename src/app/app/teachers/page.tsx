"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiGet, apiPost } from "@/lib/api";

type Teacher = { id: string; email: string; firstName: string; lastName: string; roles: Array<{ role: string }> };
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

  useEffect(() => { loadData(); }, []);

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

  return (
    <AppShell>
      {message && <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="grid gap-6">
          <Card>
            <CardHeader><CardTitle>Invite teacher</CardTitle></CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={inviteTeacher}>
                <div className="grid gap-2"><Label>Email</Label><Input name="email" placeholder="teacher@school.com" required /></div>
                <div className="grid gap-2">
                  <Label>Role</Label>
                  <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" name="role">
                    <option value="CLASS_TEACHER">Class teacher</option>
                    <option value="SUBJECT_TEACHER">Subject teacher</option>
                    <option value="HEAD_TEACHER">Head teacher</option>
                  </select>
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
              const classNames = assignments.classes.filter((item) => item.teacherId === teacher.id).map((item) => item.class.name);
              const subjectNames = assignments.subjects.filter((item) => item.teacherId === teacher.id).map((item) => item.subject.name);
              return (
                <div className="rounded-md border border-slate-200 p-4" key={teacher.id}>
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div><p className="font-semibold">{teacher.firstName} {teacher.lastName}</p><p className="text-sm text-slate-500">{teacher.email}</p></div>
                    <Badge>{teacher.roles[0]?.role ?? "USER"}</Badge>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                    <p><strong>Classes:</strong> {classNames.join(", ") || "No class assigned"}</p>
                    <p><strong>Subjects:</strong> {subjectNames.join(", ") || "No subject assigned"}</p>
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
