"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiGet } from "@/lib/api";
import { ArrowUpRight, CheckCircle2, ClipboardList, FileText, GraduationCap, Search, UserPlus, Users } from "lucide-react";

type DashboardData = { students: number; teachers: number; classes: number; pendingScores: number; weeklyReports: number };
type Program = { id: string; name: string; type: string; status: string; classes?: Array<{ name: string }> };
type Student = { id: string; firstName: string; lastName: string; admissionNumber: string; class?: { name: string }; guardian?: { name: string } | null };
type AuditLog = { id: string; action: string; entityType: string; createdAt: string };
type Score = { id: string; status: string; total: number; student?: Student; subject?: { name: string } };
type SetupState = { school: { name: string; slug: string } };

const quickActions = [
  { label: "Invite teacher", Icon: UserPlus, href: "/app/teachers" },
  { label: "Open ResultDesk", Icon: FileText, href: "/app/results" },
  { label: "Review reports", Icon: ClipboardList, href: "/app/weekly-reports" },
  { label: "Add student", Icon: GraduationCap, href: "/app/students" }
] as const;

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [activity, setActivity] = useState<AuditLog[]>([]);
  const [setup, setSetup] = useState<SetupState | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiGet<DashboardData>("/dashboard"),
      apiGet<Program[]>("/programs"),
      apiGet<AuditLog[]>("/audit-logs"),
      apiGet<Score[]>("/scores"),
      apiGet<SetupState>("/schools/setup-state")
    ])
      .then(([dashboardData, programData, auditData, scoreData, setupData]) => {
        setDashboard(dashboardData);
        setPrograms(programData);
        setActivity(auditData);
        setScores(scoreData);
        setSetup(setupData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load dashboard data."));
  }, []);

  const metrics = useMemo(() => [
    { label: "Total students", value: dashboard?.students ?? 0, helper: "Across all active classes", tone: "bg-[#effaf7] text-brand", icon: GraduationCap },
    { label: "Teachers", value: dashboard?.teachers ?? 0, helper: "Owners, admins, and teachers", tone: "bg-[#f4f7fb] text-[#38618c]", icon: Users },
    { label: "Classes", value: dashboard?.classes ?? 0, helper: "Classes and program groups", tone: "bg-[#fbf7dc] text-[#7b6417]", icon: ClipboardList },
    { label: "Submitted scores", value: dashboard?.pendingScores ?? 0, helper: "Ready for review", tone: "bg-[#fff1ed] text-[#a34a2a]", icon: FileText }
  ], [dashboard]);

  const resultRows = scores.slice(0, 6).map((score) => ({
    name: score.student ? `${score.student.firstName} ${score.student.lastName}` : "Student",
    klass: score.student?.class?.name ?? "Unassigned",
    subject: score.subject?.name ?? "Subject",
    score: score.total,
    status: score.status
  }));

  return (
    <AppShell>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">{setup?.school.slug ? `${setup.school.slug}.ewune.app` : "School workspace"}</p>
          <h2 className="mt-2 text-2xl font-bold md:text-3xl">{setup?.school.name ?? "School dashboard"}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Live data from the backend: programs, submissions, students, and audit activity.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white"><Search size={16} /> Search</Button>
          <Button><FileText size={16} /> Generate PDFs</Button>
        </div>
      </div>

      {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, helper, tone, icon: Icon }) => (
          <Card className="overflow-hidden border-slate-200 bg-white shadow-sm" key={label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div><p className="text-sm text-slate-500">{label}</p><p className="mt-3 text-3xl font-bold">{value}</p></div>
                <span className={`grid size-10 place-items-center rounded-xl ${tone}`}><Icon size={20} /></span>
              </div>
              <p className="mt-4 text-xs font-medium text-slate-500">{helper}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.7fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div><CardTitle>Student result queue</CardTitle><p className="mt-1 text-sm text-slate-500">Pulled from student records in Postgres.</p></div>
            <Button variant="outline" size="sm" className="bg-white">Filter</Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="hidden grid-cols-[1.4fr_0.8fr_0.8fr_0.7fr_0.8fr] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
                <span>Student</span><span>Class</span><span>Subject</span><span>Total</span><span>Status</span>
              </div>
              {!resultRows.length && <p className="px-4 py-5 text-sm text-slate-500">No scores entered yet. Add students, subjects, and scores to build the result queue.</p>}
              {resultRows.map((row) => (
                <div className="grid gap-3 border-t border-slate-100 px-4 py-4 text-sm md:grid-cols-[1.4fr_0.8fr_0.8fr_0.7fr_0.8fr] md:items-center md:gap-4" key={`${row.name}-${row.subject}`}>
                  <div><p className="font-semibold">{row.name}</p><p className="mt-1 text-xs text-slate-500 md:hidden">{row.klass} • {row.subject}</p></div>
                  <span className="hidden text-slate-600 md:block">{row.klass}</span>
                  <span className="hidden text-slate-600 md:block">{row.subject}</span>
                  <span className="font-bold text-brand-dark">{row.score}</span>
                  <span className="w-fit rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">{row.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-[#063d35] text-white shadow-sm">
          <CardHeader><CardTitle className="text-white">ResultDesk readiness</CardTitle><p className="text-sm text-white/70">{dashboard?.pendingScores ?? 0} submitted scores ready for review.</p></CardHeader>
          <CardContent>
            <div className="h-3 rounded-full bg-white/15"><div className="h-3 rounded-full bg-[#e2dbb5]" style={{ width: `${scores.length ? Math.min(100, Math.round(((dashboard?.pendingScores ?? 0) / scores.length) * 100)) : 0}%` }} /></div>
            <div className="mt-6 grid gap-3">
              {[`${dashboard?.pendingScores ?? 0} scores submitted`, `${dashboard?.weeklyReports ?? 0} weekly reports submitted`, `${programs.length} active/program records`].map((item) => (
                <p className="flex items-center gap-2 rounded-xl bg-white/10 p-3 text-sm" key={item}><CheckCircle2 size={16} className="text-[#e2dbb5]" /> {item}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader><CardTitle>Programs</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {programs.slice(0, 4).map((program) => (
              <div className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center" key={program.id}>
                <div><p className="font-semibold">{program.name}</p><p className="mt-1 text-sm text-slate-500">{program.classes?.map((item) => item.name).join(", ") || program.type}</p></div>
                <Badge>{program.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader><CardTitle>Quick actions</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {quickActions.map(({ label, Icon, href }) => (
              <Button asChild className="h-12 justify-between rounded-xl bg-[#f8fbf9] px-4 text-brand-dark hover:bg-brand-soft" variant="outline" key={label}>
                <Link href={href}><span className="inline-flex items-center gap-3"><Icon size={17} /> {label}</span><ArrowUpRight size={16} /></Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-slate-200 bg-white shadow-sm">
        <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          {!activity.length && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No audit activity yet.</p>}
          {activity.slice(0, 6).map((item) => <p className="rounded-xl bg-slate-50 p-4 text-sm" key={item.id}>{item.action} · {item.entityType}</p>)}
        </CardContent>
      </Card>
    </AppShell>
  );
}
