import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { activity, programs, school } from "@/lib/demo-data";
import { ArrowUpRight, CheckCircle2, ClipboardList, FileText, GraduationCap, Search, UserPlus, Users } from "lucide-react";

const metrics = [
  { label: "Total students", value: "20", helper: "+4 added this term", tone: "bg-[#effaf7] text-brand", icon: GraduationCap },
  { label: "Teachers", value: "4", helper: "3 assigned this week", tone: "bg-[#f4f7fb] text-[#38618c]", icon: Users },
  { label: "Active programs", value: "2", helper: "First Term, Coaching", tone: "bg-[#fbf7dc] text-[#7b6417]", icon: ClipboardList },
  { label: "Pending work", value: "7", helper: "Scores and reports", tone: "bg-[#fff1ed] text-[#a34a2a]", icon: FileText }
];

const resultRows = [
  { name: "Amina Bello", klass: "Primary 1", report: "Submitted", score: "96%", status: "Approved" },
  { name: "Daniel Okafor", klass: "Primary 1", report: "Submitted", score: "88%", status: "Review" },
  { name: "Tife Adebanjo", klass: "Nursery 2", report: "Draft", score: "72%", status: "Pending" },
  { name: "Samuel Bello", klass: "Nursery 1", report: "Missing", score: "42%", status: "Missing" }
];

const quickActions = [
  ["Invite teacher", UserPlus],
  ["Open ResultDesk", FileText],
  ["Review reports", ClipboardList],
  ["Add student", GraduationCap]
];

const statusClass: Record<string, string> = {
  Approved: "bg-brand-soft text-brand",
  Review: "bg-[#fbf7dc] text-[#7b6417]",
  Pending: "bg-slate-100 text-slate-500",
  Missing: "bg-[#fff1ed] text-[#a34a2a]"
};

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">{school.portal}</p>
          <h2 className="mt-2 text-2xl font-bold md:text-3xl">Good morning, Greenfield team.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Track programs, teacher submissions, result approvals, and parent-ready PDFs from one workspace.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white"><Search size={16} /> Search</Button>
          <Button><FileText size={16} /> Generate PDFs</Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, helper, tone, icon: Icon }) => (
          <Card className="overflow-hidden border-slate-200 bg-white shadow-sm" key={label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-3 text-3xl font-bold">{value}</p>
                </div>
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
            <div>
              <CardTitle>Student result queue</CardTitle>
              <p className="mt-1 text-sm text-slate-500">Primary 1 score completion and approval status.</p>
            </div>
            <Button variant="outline" size="sm" className="bg-white">Filter</Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="hidden grid-cols-[1.4fr_0.8fr_0.8fr_0.7fr_0.8fr] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
                <span>Student</span><span>Class</span><span>Report</span><span>Score</span><span>Status</span>
              </div>
              {resultRows.map((row) => (
                <div className="grid gap-3 border-t border-slate-100 px-4 py-4 text-sm md:grid-cols-[1.4fr_0.8fr_0.8fr_0.7fr_0.8fr] md:items-center md:gap-4" key={row.name}>
                  <div>
                    <p className="font-semibold">{row.name}</p>
                    <p className="mt-1 text-xs text-slate-500 md:hidden">{row.klass} • {row.report}</p>
                  </div>
                  <span className="hidden text-slate-600 md:block">{row.klass}</span>
                  <span className="hidden text-slate-600 md:block">{row.report}</span>
                  <span className="font-bold text-brand-dark">{row.score}</span>
                  <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusClass[row.status]}`}>{row.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-[#063d35] text-white shadow-sm">
          <CardHeader>
            <CardTitle>ResultDesk readiness</CardTitle>
            <p className="text-sm text-white/70">First Term result work is 72% complete.</p>
          </CardHeader>
          <CardContent>
            <div className="h-3 rounded-full bg-white/15"><div className="h-3 w-[72%] rounded-full bg-[#e2dbb5]" /></div>
            <div className="mt-6 grid gap-3">
              {["18 of 25 scores submitted", "6 of 8 approvals cleared", "11 weekly reports reviewed"].map((item) => (
                <p className="flex items-center gap-2 rounded-xl bg-white/10 p-3 text-sm" key={item}>
                  <CheckCircle2 size={16} className="text-[#e2dbb5]" /> {item}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Programs</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {programs.map((program) => (
              <div className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center" key={program.name}>
                <div>
                  <p className="font-semibold">{program.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{program.groups}</p>
                </div>
                <Badge>{program.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {quickActions.map(([label, Icon]) => (
              <Button className="h-12 justify-between rounded-xl bg-[#f8fbf9] px-4 text-brand-dark hover:bg-brand-soft" variant="outline" key={label as string}>
                <span className="inline-flex items-center gap-3"><Icon size={17} /> {label as string}</span>
                <ArrowUpRight size={16} />
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-slate-200 bg-white shadow-sm">
        <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          {activity.map((item) => <p className="rounded-xl bg-slate-50 p-4 text-sm" key={item}>{item}</p>)}
        </CardContent>
      </Card>
    </AppShell>
  );
}
