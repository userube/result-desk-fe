import { CheckCircle2, FileText, Smartphone, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { school } from "@/lib/demo-data";

export function DashboardPreview() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
      <Card className="shadow-soft">
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">Live school workspace</p>
            <CardTitle className="mt-1 text-xl">{school.name}</CardTitle>
            <p className="text-sm text-slate-500">{school.portal}</p>
          </div>
          <Button size="sm"><UserPlus size={16} /> Invite teacher</Button>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {[
            ["Active program", "First Term"],
            ["Another program", "Holiday Coaching"],
            ["Pending teacher reports", "7"]
          ].map(([label, value]) => (
            <div className="rounded-md border border-slate-200 p-4" key={label}>
              <div className="text-2xl font-bold text-brand-dark">{value}</div>
              <div className="mt-1 text-xs text-slate-500">{label}</div>
            </div>
          ))}
          <div className="sm:col-span-3 rounded-md bg-brand-soft p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-brand-text">Score submissions awaiting approval</p>
                <p className="text-sm text-slate-600">ResultDesk is ready to generate Primary 1 PDFs</p>
              </div>
              <Button variant="outline" size="sm"><FileText size={16} /> Generate PDF result</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="rounded-[28px] border border-slate-200 bg-brand-dark p-3 text-white shadow-soft">
        <div className="rounded-[22px] bg-white p-3 text-brand-text">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold"><Smartphone size={16} /> Score entry</div>
          {["Amina Bello", "Daniel Okafor", "Tife Adebanjo"].map((name, index) => (
            <div className="mb-3 rounded-md border border-slate-200 p-3" key={name}>
              <div className="flex items-center justify-between text-sm">
                <span>{name}</span>
                <CheckCircle2 className={index === 0 ? "text-brand" : "text-slate-300"} size={16} />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <span className="rounded bg-slate-100 px-2 py-1">CA 28</span>
                <span className="rounded bg-slate-100 px-2 py-1">Exam 61</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
