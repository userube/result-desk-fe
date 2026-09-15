"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiGet } from "@/lib/api";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  admissionNumber: string;
  gender: string;
  status: string;
  class?: { name: string };
  guardian?: { name: string; phone?: string; email?: string } | null;
  scores?: Array<{ id: string; caScore: number; examScore: number; total: number; status: string; subject?: { name: string }; program?: { name: string } | null }>;
};

export default function StudentDetailPage() {
  const params = useParams<{ studentId: string }>();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => { if (params.studentId) apiGet<Student>(`/students/${params.studentId}`).then(setStudent); }, [params.studentId]);

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Student profile</p>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">{student ? `${student.firstName} ${student.lastName}` : "Loading student"}</h2>
        <p className="mt-2 text-sm text-slate-600">{student?.admissionNumber} · {student?.class?.name}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader><CardTitle>Basic information</CardTitle></CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <p><strong>Gender:</strong> {student?.gender}</p>
            <p><strong>Status:</strong> <Badge>{student?.status}</Badge></p>
            <p><strong>Guardian:</strong> {student?.guardian?.name ?? "Not added"}</p>
            <p><strong>Phone:</strong> {student?.guardian?.phone ?? "Not added"}</p>
            <p><strong>Email:</strong> {student?.guardian?.email ?? "Not added"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Result history</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="grid grid-cols-[1fr_70px_70px_70px_100px] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span>Subject</span><span>CA</span><span>Exam</span><span>Total</span><span>Status</span>
              </div>
              {student?.scores?.map((score) => (
                <div className="grid grid-cols-[1fr_70px_70px_70px_100px] border-t border-slate-100 px-4 py-3 text-sm" key={score.id}>
                  <span>{score.subject?.name ?? "Subject"}</span><span>{score.caScore}</span><span>{score.examScore}</span><span>{score.total}</span><Badge>{score.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
