import { BarChart3, CalendarDays, CheckCircle2, FileText, HelpCircle, LogOut, Settings, Smartphone, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { school } from "@/lib/demo-data";

const sidebar = [BarChart3, CalendarDays, FileText, Users, Settings];

export function DashboardPreview() {
  return (
    <div className="mx-auto rounded-[30px] border border-[#e3e6e2] bg-white/80 p-3 shadow-[0_28px_90px_rgba(23,23,36,0.18)] backdrop-blur">
      <div className="overflow-hidden rounded-[24px] border border-[#e8ebe7] bg-white text-left">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">Ewune workspace</p>
            <h3 className="text-lg font-bold">{school.name}</h3>
          </div>
          <div className="hidden items-center gap-5 text-xs font-medium text-slate-500 sm:flex">
            <span className="inline-flex items-center gap-1"><HelpCircle size={14} /> Help</span>
            <span className="inline-flex items-center gap-1"><Smartphone size={14} /> Teacher view</span>
            <span className="inline-flex items-center gap-1"><LogOut size={14} /> Log out</span>
          </div>
        </div>

        <div className="grid min-h-[360px] grid-cols-[58px_1fr] bg-[#fbfcfa]">
          <aside className="border-r border-slate-100 bg-[#edf8f5] px-3 py-5">
            <div className="mb-8 grid size-9 place-items-center rounded-lg bg-cyan-400 text-white">
              <LayersIcon />
            </div>
            <div className="grid gap-3">
              {sidebar.map((Icon, index) => (
                <span className={`grid size-9 place-items-center rounded-md ${index === 0 ? "bg-white text-brand shadow-sm" : "text-slate-500"}`} key={index}>
                  <Icon size={17} />
                </span>
              ))}
            </div>
          </aside>

          <div className="p-5">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <section className="rounded-xl border border-slate-100 bg-white p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <h4 className="text-xl font-bold">Hi Admin, let’s get school work moving.</h4>
                    <p className="mt-1 text-sm text-slate-500">greenfield.ewune.app</p>
                  </div>
                  <Button size="sm"><UserPlus size={15} /> Invite teacher</Button>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {[
                    ["Programs", "First Term", "Holiday Coaching"],
                    ["Reports", "11 submitted", "3 pending"],
                    ["ResultDesk", "72% complete", "Approval queue"]
                  ].map(([title, primary, secondary]) => (
                    <div className="rounded-lg bg-[#f6f8f5] p-4" key={title}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
                      <p className="mt-3 font-bold">{primary}</p>
                      <p className="mt-1 text-xs text-slate-500">{secondary}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-slate-100 bg-[#effaf7] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">Submission status</p>
                <div className="mt-4 grid gap-3">
                  {[
                    ["Weekly reports", "11/14", "w-[78%]"],
                    ["Scores", "18/25", "w-[72%]"],
                    ["Approvals", "6/8", "w-[75%]"]
                  ].map(([label, value, width]) => (
                    <div key={label}>
                      <div className="mb-1 flex justify-between text-xs"><span>{label}</span><span className="font-bold">{value}</span></div>
                      <div className="h-2 rounded-full bg-white"><div className={`h-2 rounded-full bg-brand ${width}`} /></div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
              <section className="rounded-xl border border-slate-100 bg-white p-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold">Today</h4>
                  <Button variant="outline" size="sm">Review</Button>
                </div>
                <div className="mt-4 rounded-lg bg-[#fbf7dc] p-4 text-sm">
                  <p className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand" /> Nursery 2 weekly report reviewed</p>
                  <p className="mt-3 flex items-center gap-2"><CheckCircle2 size={16} className="text-brand" /> Primary 1 scores submitted</p>
                  <p className="mt-3 flex items-center gap-2 text-slate-500"><CalendarDays size={16} /> Holiday coaching closes Friday</p>
                </div>
              </section>

              <section className="rounded-xl border border-slate-100 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-bold">ResultDesk queue</h4>
                    <p className="mt-1 text-sm text-slate-500">Scores are approved before final PDFs are generated.</p>
                  </div>
                  <Button variant="outline" size="sm"><FileText size={15} /> Generate PDFs</Button>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-100 p-4">
                    <p className="text-xs text-slate-500">Primary 1</p>
                    <p className="mt-1 font-bold text-brand-dark">Awaiting approval</p>
                  </div>
                  <div className="rounded-lg border border-slate-100 p-4">
                    <p className="text-xs text-slate-500">Book submitted</p>
                    <p className="mt-1 font-bold text-brand-dark">4 Feb 2026, 5:40PM</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LayersIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none">
      <path d="m12 3 8 4-8 4-8-4 8-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="m4 12 8 4 8-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m4 17 8 4 8-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
