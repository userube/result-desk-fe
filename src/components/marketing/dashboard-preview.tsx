import { CheckCircle2, FileText, Smartphone, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { school } from "@/lib/demo-data";

const progress = [
  ["Weekly reports", "11/14", "w-[78%]"],
  ["Score submissions", "18/25", "w-[72%]"],
  ["Approvals", "6/8", "w-[75%]"]
];

export function DashboardPreview() {
  return (
    <div className="relative min-h-[560px] overflow-hidden rounded-[28px] border border-[#dfe3de] bg-[#f3f4f1] p-4 md:p-6">
      <div className="absolute left-10 top-10 hidden h-72 w-72 rounded-full border border-[#d9ddd8] md:block" />
      <div className="absolute bottom-10 right-10 hidden h-80 w-80 rounded-full border border-[#d9ddd8] md:block" />

      <div className="relative mx-auto max-w-xl rounded-[22px] border border-[#dfe3de] bg-white p-4 shadow-soft">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">School workspace</p>
            <h3 className="mt-1 text-xl font-bold">{school.name}</h3>
            <p className="text-sm text-slate-500">{school.portal}</p>
          </div>
          <Button size="sm"><UserPlus size={16} /> Invite teacher</Button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-brand-dark p-4 text-white">
            <p className="text-xs uppercase tracking-wide text-white/60">Active program</p>
            <p className="mt-3 text-2xl font-bold">First Term</p>
            <p className="mt-2 text-sm text-white/70">72% result completion</p>
          </div>
          <div className="rounded-lg border border-[#dfe3de] bg-[#fbfcfa] p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Another program</p>
            <p className="mt-3 text-2xl font-bold text-brand-dark">Holiday Coaching</p>
            <p className="mt-2 text-sm text-slate-500">Reports reviewed</p>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-[#dfe3de] bg-[#fbfcfa] p-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Submission tracker</p>
            <span className="rounded-full bg-[#e2dbb5]/70 px-2 py-1 text-xs font-semibold text-brand-dark">Live</span>
          </div>
          <div className="mt-4 grid gap-4">
            {progress.map(([label, value, width]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600">{label}</span>
                  <span className="font-semibold">{value}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200"><div className={`h-2 rounded-full bg-brand ${width}`} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-brand-soft p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold">ResultDesk approval queue</p>
              <p className="text-sm text-slate-600">Primary 1 scores are ready for management review.</p>
            </div>
            <Button variant="outline" size="sm"><FileText size={16} /> Generate PDFs</Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-5 hidden w-56 rounded-xl border border-[#dfe3de] bg-white p-4 shadow-soft lg:block">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">Teacher reminder</p>
        <p className="mt-2 text-sm font-semibold">3 reports pending</p>
        <p className="mt-1 text-xs text-slate-500">Nursery 2, Primary 1, Common Entrance Group</p>
      </div>

      <div className="absolute bottom-5 right-5 w-56 rounded-[26px] border border-[#dfe3de] bg-brand-dark p-3 text-white shadow-soft">
        <div className="rounded-[20px] bg-white p-3 text-brand-text">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold"><Smartphone size={16} /> Teacher submit</div>
          {["Topics taught", "CA scores", "Class note"].map((item, index) => (
            <div className="mb-3 flex items-center justify-between rounded-md border border-slate-200 p-3 text-sm" key={item}>
              <span>{item}</span>
              <CheckCircle2 className={index < 2 ? "text-brand" : "text-slate-300"} size={16} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
