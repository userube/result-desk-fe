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

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [inviteLink, setInviteLink] = useState("");

  async function loadTeachers() {
    setTeachers(await apiGet<Teacher[]>("/schools/teachers"));
  }

  useEffect(() => { loadTeachers(); }, []);

  async function inviteTeacher(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const invite = await apiPost<{ inviteLink: string }, { email: string; role: string }>("/invitations", {
      email: String(form.get("email") ?? ""),
      role: String(form.get("role") ?? "CLASS_TEACHER")
    });
    setInviteLink(invite.inviteLink);
    event.currentTarget.reset();
  }

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader><CardTitle>Invite teacher</CardTitle></CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={inviteTeacher}>
              <div className="grid gap-2"><Label>Email</Label><Input name="email" placeholder="teacher@school.com" required /></div>
              <div className="grid gap-2"><Label>Role</Label><Input name="role" defaultValue="CLASS_TEACHER" required /></div>
              <Button>Send invitation</Button>
              {inviteLink && <p className="break-all rounded-xl bg-brand-soft p-3 text-xs text-brand-dark">{inviteLink}</p>}
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Teachers and admins</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {teachers.map((teacher) => (
              <div className="rounded-md border border-slate-200 p-4" key={teacher.id}>
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div><p className="font-semibold">{teacher.firstName} {teacher.lastName}</p><p className="text-sm text-slate-500">{teacher.email}</p></div>
                  <Badge>{teacher.roles[0]?.role ?? "USER"}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
