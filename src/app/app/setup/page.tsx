"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiGet } from "@/lib/api";
import { CheckCircle2, ClipboardList, FileText, GraduationCap, Layers3, School, UserPlus, Users } from "lucide-react";

type SetupState = {
  school: { name: string; slug: string };
  counts: { students: number; teachers: number; gradingScale: number };
  classes: unknown[];
  programs: unknown[];
  subjects: unknown[];
  checklist: Record<string, boolean>;
};

const config = [
  ["school", "School profile", "Confirm contact details, logo, address, and portal URL.", School, "/app/settings/school"],
  ["classes", "Classes and programs", "Create Nursery, Primary, Secondary, terms, and coaching groups.", Layers3, "/app/classes"],
  ["teachers", "Invite teachers", "Send secure invite links and assign class or subject responsibilities.", UserPlus, "/app/teachers"],
  ["students", "Add students", "Import students, guardians, admission numbers, and current classes.", Users, "/app/students"],
  ["grading", "Grading scale", "Set CA, exam, total score, grade bands, and comments.", GraduationCap, "/app/settings/grading"],
  ["resultTemplate", "Result template", "Finish the PDF layout before final result generation.", FileText, "/app/settings/result-template"]
] as const;

export default function SetupPage() {
  const [state, setState] = useState<SetupState | null>(null);
  const [error, setError] = useState("");

  useEffect(() => { apiGet<SetupState>("/schools/setup-state").then(setState).catch((err) => setError(err.message)); }, []);

  const doneCount = useMemo(() => state ? Object.values(state.checklist).filter(Boolean).length : 0, [state]);
  const total = config.length;

  return (
    <AppShell>
      <section className="overflow-hidden rounded-[28px] bg-[#063d35] text-white shadow-sm">
        <div className="grid gap-8 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
          <div>
            <Badge className="bg-white/10 text-[#e2dbb5]">{doneCount} of {total} complete</Badge>
            <h2 className="mt-5 text-3xl font-bold md:text-4xl">{state?.school.name ?? "Your school"} is almost ready for result week.</h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/72">This checklist is loaded from the backend setup state for the current tenant.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="bg-white text-brand-dark hover:bg-[#effaf7]"><Link href="/app/settings/result-template">Finish result template</Link></Button>
              <Button asChild variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/15"><Link href="/app/dashboard">Go to dashboard</Link></Button>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
            <p className="text-sm font-semibold text-[#e2dbb5]">Live counts</p>
            <div className="mt-4 grid gap-3">
              {[`${state?.classes.length ?? 0} classes`, `${state?.programs.length ?? 0} programs`, `${state?.subjects.length ?? 0} subjects`, `${state?.counts.students ?? 0} students`].map((item) => (
                <p className="flex items-start gap-2 text-sm leading-6 text-white/78" key={item}><CheckCircle2 size={16} className="mt-1 shrink-0 text-[#e2dbb5]" /> {item}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.7fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader><CardTitle>Launch checklist</CardTitle><p className="text-sm text-slate-500">Each status is backed by current tenant data.</p></CardHeader>
          <CardContent className="grid gap-3">
            {config.map(([key, title, copy, Icon, href], index) => {
              const done = Boolean(state?.checklist[key]);
              return (
                <Link className="group flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-brand/30 hover:bg-brand-soft/50 sm:flex-row sm:items-center sm:justify-between" href={href} key={key}>
                  <div className="flex gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#effaf7] text-brand"><Icon size={21} /></span><div><p className="font-semibold">{index + 1}. {title}</p><p className="mt-1 text-sm leading-6 text-slate-600">{copy}</p></div></div>
                  <Badge className={done ? undefined : "bg-[#fbf7dc] text-[#7b6417]"}>{done ? "Done" : "Pending"}</Badge>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader><CardTitle>Demo readiness</CardTitle></CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-600">
            {["Teacher invites configured", "Weekly reports seeded", "Primary 1 result batch waiting", "Audit trail records visible"].map((item) => (
              <p className="flex items-center gap-2 rounded-xl bg-slate-50 p-3" key={item}><ClipboardList size={16} className="text-brand" /> {item}</p>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
