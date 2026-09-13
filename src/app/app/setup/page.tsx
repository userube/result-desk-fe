import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ClipboardList, FileText, GraduationCap, Layers3, School, UserPlus, Users } from "lucide-react";

const setupSteps = [
  { title: "School profile", copy: "Confirm contact details, logo, address, and portal URL.", status: "Done", icon: School, href: "/app/settings/school" },
  { title: "Classes and programs", copy: "Create Nursery, Primary, Secondary, terms, and coaching groups.", status: "Done", icon: Layers3, href: "/app/classes" },
  { title: "Invite teachers", copy: "Send secure invite links and assign class or subject responsibilities.", status: "Done", icon: UserPlus, href: "/app/teachers" },
  { title: "Add students", copy: "Import students, guardians, admission numbers, and current classes.", status: "Done", icon: Users, href: "/app/students" },
  { title: "Grading scale", copy: "Set CA, exam, total score, grade bands, and comments.", status: "Done", icon: GraduationCap, href: "/app/settings/grading" },
  { title: "Result template", copy: "Finish the PDF layout before final result generation.", status: "Pending", icon: FileText, href: "/app/settings/result-template" }
];

const weekStory = [
  "Teachers submit weekly reports from phone or laptop.",
  "Scores move from draft to submitted to approval requested.",
  "Management reviews missing work before final PDFs.",
  "Every important action appears in audit logs."
];

export default function SetupPage() {
  return (
    <AppShell>
      <section className="overflow-hidden rounded-[28px] bg-[#063d35] text-white shadow-sm">
        <div className="grid gap-8 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
          <div>
            <Badge className="bg-white/10 text-[#e2dbb5]">5 of 6 complete</Badge>
            <h2 className="mt-5 text-3xl font-bold md:text-4xl">Your school workspace is almost ready for result week.</h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/72">
              Finish the result template, then Greenfield Crest can invite teachers into a simple routine: submit reports, enter scores, request approval, and generate clean PDFs.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="bg-white text-brand-dark hover:bg-[#effaf7]">
                <Link href="/app/settings/result-template">Finish result template</Link>
              </Button>
              <Button asChild variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/15">
                <Link href="/app/dashboard">Go to dashboard</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
            <p className="text-sm font-semibold text-[#e2dbb5]">What happens next</p>
            <div className="mt-4 grid gap-3">
              {weekStory.map((item) => (
                <p className="flex items-start gap-2 text-sm leading-6 text-white/78" key={item}>
                  <CheckCircle2 size={16} className="mt-1 shrink-0 text-[#e2dbb5]" /> {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.7fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Launch checklist</CardTitle>
            <p className="text-sm text-slate-500">Follow the school setup story from identity to PDF readiness.</p>
          </CardHeader>
          <CardContent className="grid gap-3">
            {setupSteps.map(({ title, copy, status, icon: Icon, href }, index) => (
              <Link className="group flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-brand/30 hover:bg-brand-soft/50 sm:flex-row sm:items-center sm:justify-between" href={href} key={title}>
                <div className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#effaf7] text-brand">
                    <Icon size={21} />
                  </span>
                  <div>
                    <p className="font-semibold">{index + 1}. {title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{copy}</p>
                  </div>
                </div>
                <Badge className={status === "Done" ? undefined : "bg-[#fbf7dc] text-[#7b6417]"}>{status}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader><CardTitle>Next best action</CardTitle></CardHeader>
            <CardContent>
              <div className="grid size-12 place-items-center rounded-2xl bg-[#fbf7dc] text-[#7b6417]">
                <FileText size={24} />
              </div>
              <h3 className="mt-4 font-bold">Finalize the result PDF layout.</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Once the template is ready, approved score batches can be generated and printed for parents.</p>
              <Button asChild className="mt-5 w-full">
                <Link href="/app/settings/result-template">Open template settings</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader><CardTitle>Demo readiness</CardTitle></CardHeader>
            <CardContent className="grid gap-3 text-sm text-slate-600">
              {["Teacher invites configured", "Weekly reports seeded", "Primary 1 result batch waiting", "Audit trail records visible"].map((item) => (
                <p className="flex items-center gap-2 rounded-xl bg-slate-50 p-3" key={item}>
                  <ClipboardList size={16} className="text-brand" /> {item}
                </p>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
