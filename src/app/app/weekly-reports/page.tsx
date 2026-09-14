"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiGet, apiPost } from "@/lib/api";

type Klass = { id: string; name: string };
type Report = { id: string; weekNumber: number; topicsTaught: string; status: string; teacher?: { firstName: string; lastName: string } };

export default function WeeklyReportsPage() {
  const [classes, setClasses] = useState<Klass[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  async function loadData() {
    const [classData, reportData] = await Promise.all([apiGet<Klass[]>("/schools/classes"), apiGet<Report[]>("/weekly-reports")]);
    setClasses(classData);
    setReports(reportData);
  }

  useEffect(() => { loadData(); }, []);

  async function submitReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await apiPost("/weekly-reports", {
      classId: String(form.get("classId") ?? ""),
      weekNumber: Number(form.get("weekNumber") ?? 1),
      topicsTaught: String(form.get("topicsTaught") ?? ""),
      attendanceSummary: String(form.get("attendanceSummary") ?? ""),
      studentConcerns: String(form.get("studentConcerns") ?? ""),
      assignmentsTests: String(form.get("assignmentsTests") ?? ""),
      behaviourNotes: String(form.get("behaviourNotes") ?? ""),
      needsFromManagement: String(form.get("needsFromManagement") ?? ""),
      generalComment: String(form.get("generalComment") ?? "")
    });
    event.currentTarget.reset();
    await loadData();
  }

  return (
    <AppShell>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader><CardTitle>Submit weekly report</CardTitle></CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={submitReport}>
              <div className="grid gap-2"><Label>Week number</Label><Input name="weekNumber" type="number" defaultValue="1" required /></div>
              <div className="grid gap-2">
                <Label>Class</Label>
                <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm shadow-sm" name="classId" required>
                  {classes.map((klass) => <option value={klass.id} key={klass.id}>{klass.name}</option>)}
                </select>
              </div>
              {[
                ["topicsTaught", "Topics taught"],
                ["attendanceSummary", "Attendance summary"],
                ["studentConcerns", "Student concerns"],
                ["assignmentsTests", "Assignments/tests given"],
                ["behaviourNotes", "Behaviour notes"],
                ["needsFromManagement", "Needs from management"],
                ["generalComment", "General comment"]
              ].map(([name, label]) => <div className="grid gap-2 md:col-span-2" key={name}><Label>{label}</Label><Textarea name={name} /></div>)}
              <div className="flex gap-3 md:col-span-2"><Button type="button" variant="outline">Save draft</Button><Button>Submit report</Button></div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Submitted reports</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {reports.map((report) => <div className="rounded-xl border border-slate-200 p-4" key={report.id}><p className="font-semibold">Week {report.weekNumber}</p><p className="mt-1 text-sm text-slate-600">{report.topicsTaught}</p><p className="mt-2 text-xs font-semibold text-brand">{report.status}</p></div>)}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
