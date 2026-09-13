import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { school } from "@/lib/demo-data";

const sections = ["School logo and address", "Student information", "Subject scores", "Teacher comment", "Head teacher approval", "Resumption note"];

export default function ResultTemplatePage() {
  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Settings</p>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">Result template</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Control what appears on parent-ready PDF results before management generates final copies.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader><CardTitle>Template settings</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2"><Label>Template name</Label><Input defaultValue="Greenfield Standard Result" /></div>
            <div className="grid gap-2"><Label>Footer note</Label><Textarea defaultValue="This result is valid after management approval and school stamp." /></div>
            <div className="grid gap-2"><Label>Head teacher signature label</Label><Input defaultValue="Head Teacher" /></div>
            <div className="grid gap-2"><Label>Next term note</Label><Input defaultValue="Resumption date will be communicated by the school." /></div>
            <Button>Save result template</Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>PDF preview</CardTitle>
            <Badge className="bg-[#fbf7dc] text-[#7b6417]">Draft template</Badge>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-slate-200 bg-[#fbfcfa] p-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-xl font-bold text-brand-dark">{school.name}</p>
                  <p className="text-sm text-slate-500">{school.location}</p>
                </div>
                <span className="grid size-12 place-items-center rounded-xl bg-brand-dark font-bold text-white">G</span>
              </div>
              <div className="mt-5 grid gap-3 text-sm">
                <p><strong>Student:</strong> Amina Bello</p>
                <p><strong>Class:</strong> Primary 1 · <strong>Term:</strong> First Term</p>
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {["Mathematics 92 A", "English 88 B", "Creative Work 95 A"].map((row) => (
                    <p className="border-b border-slate-100 px-4 py-3 last:border-b-0" key={row}>{row}</p>
                  ))}
                </div>
                <p className="rounded-xl bg-brand-soft p-3 text-brand-dark">Teacher comment: Excellent progress. Keep encouraging reading practice at home.</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {sections.map((section) => <p className="rounded-xl bg-slate-50 p-3 text-sm font-medium" key={section}>{section}</p>)}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
